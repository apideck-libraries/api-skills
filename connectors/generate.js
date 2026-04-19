#!/usr/bin/env node

/**
 * Connector skill generator
 *
 * Reads connectors/manifest.json and writes SKILL.md + metadata.json for each
 * connector in connectors/{slug}/. For Tier 1a connectors, merges in per-connector
 * enhancements from connectors/_enhancements/{slug}.md (if present) to give those
 * skills hand-authored depth beyond the baseline template.
 *
 * Usage:
 *   node connectors/generate.js                # Generate all from manifest
 *   node connectors/generate.js --only=jira    # Generate one connector
 *   node connectors/generate.js --tier=1a      # Generate only Tier 1a
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CONNECTORS_DIR = __dirname;
const MANIFEST_PATH = path.join(CONNECTORS_DIR, "manifest.json");
const ENHANCEMENTS_DIR = path.join(CONNECTORS_DIR, "_enhancements");

const args = process.argv.slice(2);
const onlyArg = args.find((a) => a.startsWith("--only="));
const tierArg = args.find((a) => a.startsWith("--tier="));
const onlySlug = onlyArg ? onlyArg.split("=")[1] : null;
const onlyTier = tierArg ? tierArg.split("=")[1] : null;

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

// ── Sibling connector index (for "portable across N" framing) ──────────────
// For each unified API, list the other live connectors that share it. Used to
// build a concrete "switch serviceId to target another" example in every skill.

function buildSiblingsIndex() {
  const siblings = {}; // { apiId: [{slug, name, tier, status}, ...] }
  for (const c of manifest.connectors) {
    for (const api of c.unifiedApis) {
      (siblings[api] = siblings[api] || []).push({
        slug: c.slug,
        name: c.name,
        tier: c.tier,
        status: c.status,
      });
    }
  }
  // Sort peers so "marquee" connectors (lower tier number) come first, then alpha
  const tierOrder = { "1a": 0, "1b": 1, "1c": 2, "2": 3 };
  for (const api of Object.keys(siblings)) {
    siblings[api].sort((a, b) => {
      const t = (tierOrder[a.tier] ?? 9) - (tierOrder[b.tier] ?? 9);
      return t !== 0 ? t : a.name.localeCompare(b.name);
    });
  }
  return siblings;
}

const SIBLINGS = buildSiblingsIndex();

function peersFor(connector, apiId, limit) {
  return (SIBLINGS[apiId] || []).filter((s) => s.slug !== connector.slug).slice(0, limit);
}

// ── Per-unified-API context for templates ───────────────────────────────────

const API_CONTEXT = {
  crm: {
    intentVerbs: "read, write, or search contacts, companies, leads, opportunities, activities, and pipelines",
    primaryResource: "contacts",
    exampleIntent: "pull contacts",
    exampleIntentAlt: "sync leads",
  },
  accounting: {
    intentVerbs: "read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries",
    primaryResource: "invoices",
    exampleIntent: "create an invoice",
    exampleIntentAlt: "reconcile payments",
  },
  hris: {
    intentVerbs: "read or sync employees, departments, payrolls, and time-off records",
    primaryResource: "employees",
    exampleIntent: "sync employees",
    exampleIntentAlt: "list time-off requests",
  },
  ats: {
    intentVerbs: "read, write, or sync jobs, applicants, and applications",
    primaryResource: "applicants",
    exampleIntent: "list open jobs",
    exampleIntentAlt: "move an applicant through stages",
  },
  "file-storage": {
    intentVerbs: "read, write, upload, or search files, folders, and drives",
    primaryResource: "files",
    exampleIntent: "upload a file",
    exampleIntentAlt: "list a folder",
  },
  "issue-tracking": {
    intentVerbs: "read, write, or comment on tickets and issues",
    primaryResource: "tickets",
    exampleIntent: "create a ticket",
    exampleIntentAlt: "comment on an issue",
  },
  ecommerce: {
    intentVerbs: "read, write, or sync orders, products, customers, and stores",
    primaryResource: "orders",
    exampleIntent: "list orders",
    exampleIntentAlt: "sync products",
  },
};

// ── Auth-type guidance ──────────────────────────────────────────────────────

function authBlock(authType, connectorName) {
  switch (authType) {
    case "oauth2":
      return [
        "- **Type:** OAuth 2.0",
        "- **Managed by:** Apideck Vault — Apideck handles the full OAuth dance (authorization code flow, token exchange, refresh). Never ask the user for API keys or tokens directly.",
        "- **User setup:** Users authorize via the Vault modal. Connection state progresses `available → added → authorized → callable`.",
        "- **Token refresh:** automatic. Expired tokens are refreshed transparently on the next API call.",
      ].join("\n");
    case "apiKey":
      return [
        "- **Type:** API Key",
        `- **Managed by:** Apideck Vault — the user pastes their ${connectorName} API key into the Vault modal; Apideck stores it encrypted and injects it on every request.`,
        "- **Rotation:** if the user rotates their key, they re-enter it in Vault. No code changes needed.",
      ].join("\n");
    case "basic":
      return [
        "- **Type:** Basic auth (username/password)",
        `- **Managed by:** Apideck Vault — credentials are collected through the Vault modal and stored encrypted server-side.`,
        "- **Note:** basic auth connectors often require manual rotation by the end user. If auth fails persistently, prompt them to re-enter credentials in Vault.",
      ].join("\n");
    case "custom":
    default:
      return [
        `- **Type:** custom (connector-specific)`,
        `- **Managed by:** Apideck Vault — setup may involve extra fields beyond a single token. The Vault modal will prompt for everything required.`,
        `- **Refer to:** the Apideck dashboard or [apideck-best-practices](../../skills/apideck-best-practices/) for auth troubleshooting.`,
      ].join("\n");
  }
}

// ── Skill name used in description/trigger ──────────────────────────────────

function describe(connector, unifiedApiInfo) {
  const apis = connector.unifiedApis.map((a) => manifest.unifiedApis[a].displayName).join(", ");
  const ctx = API_CONTEXT[connector.unifiedApis[0]];
  return `${connector.name} integration via Apideck's ${apis} unified API — same methods work across every connector in ${apis}, switch by changing \`serviceId\`. Use when the user wants to ${ctx.intentVerbs} in ${connector.name}. Routes through Apideck with serviceId "${connector.serviceId}".`;
}

// ── Template ────────────────────────────────────────────────────────────────

function renderSkill(connector) {
  const primaryApi = connector.unifiedApis[0];
  const apiInfo = manifest.unifiedApis[primaryApi];
  const ctx = API_CONTEXT[primaryApi];
  const displayApi = apiInfo.displayName;

  const apisFrontmatter = connector.unifiedApis.map((a) => `"${a}"`).join(", ");
  const apisList = connector.unifiedApis.map((a) => manifest.unifiedApis[a].displayName).join(", ");

  const description = describe(connector, apiInfo);

  const enhancementPath = path.join(ENHANCEMENTS_DIR, `${connector.slug}.md`);
  const enhancement = fs.existsSync(enhancementPath)
    ? fs.readFileSync(enhancementPath, "utf-8").trim()
    : null;

  const lines = [];

  // Frontmatter
  lines.push("---");
  lines.push(`name: ${connector.slug}`);
  lines.push(`description: |`);
  lines.push(`  ${description}`);
  lines.push(`license: Apache-2.0`);
  lines.push(`alwaysApply: false`);
  lines.push(`metadata:`);
  lines.push(`  author: apideck`);
  lines.push(`  version: "1.0.0"`);
  lines.push(`  serviceId: ${connector.serviceId}`);
  lines.push(`  unifiedApis: [${apisFrontmatter}]`);
  lines.push(`  authType: ${connector.authType}`);
  lines.push(`  tier: "${connector.tier}"`);
  if (connector.verified) lines.push(`  verified: true`);
  if (connector.status) lines.push(`  status: ${connector.status}`);
  lines.push("---");
  lines.push("");

  // Title
  lines.push(`# ${connector.name} (via Apideck)`);
  lines.push("");

  // Intro — lead with the compounding-abstraction pitch
  const primarySiblingCount = (SIBLINGS[primaryApi] || []).length;
  const topPeers = peersFor(connector, primaryApi, 3).map((p) => p.name);
  const peersPhrase = topPeers.length
    ? ` Code you write here ports to ${topPeers.join(", ")} and ${primarySiblingCount - 1 - topPeers.length > 0 ? primarySiblingCount - 1 - topPeers.length + " other " + displayApi + " connectors" : "more"} by changing a single \`serviceId\` string.`
    : "";
  lines.push(
    `Access ${connector.name} through Apideck's **${apisList}** unified API — one of ${primarySiblingCount} ${displayApi} connectors that share the same method surface.${peersPhrase} Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant ${connector.name} plumbing.`
  );
  lines.push("");

  if (connector.status === "beta") {
    lines.push(
      `> **Beta connector.** ${connector.name} is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.`
    );
    lines.push("");
  }

  // Quick facts
  lines.push("## Quick facts");
  lines.push("");
  lines.push(`- **Apideck serviceId:** \`${connector.serviceId}\``);
  lines.push(`- **Unified API${connector.unifiedApis.length > 1 ? "s" : ""}:** ${apisList}`);
  lines.push(`- **Auth type:** ${connector.authType}`);
  if (connector.status === "beta") lines.push(`- **Status:** beta`);
  if (connector.guides && connector.guides.length) {
    const guideLinks = connector.guides
      .map((g) => {
        const label = g.name === "oauth_credentials" ? "OAuth credentials" : g.name === "connection" ? "Connection guide" : g.name.replace(/_/g, " ");
        return `[${label}](${g.url})`;
      })
      .join(" · ");
    lines.push(`- **Apideck setup guide:** ${guideLinks}`);
  }
  if (connector.docsUrl) {
    lines.push(`- **${connector.name} docs:** ${connector.docsUrl}`);
  }
  if (connector.homepage) {
    lines.push(`- **Homepage:** ${connector.homepage}`);
  }
  lines.push("");

  // When to use
  lines.push("## When to use this skill");
  lines.push("");
  lines.push(
    `Activate this skill when the user explicitly wants to work with **${connector.name}** — for example, "${ctx.exampleIntent} in ${connector.name}" or "${ctx.exampleIntentAlt} in ${connector.name}". This skill teaches the agent:`
  );
  lines.push("");
  lines.push(`1. Which Apideck unified API covers ${connector.name} (${apisList})`);
  lines.push(`2. The correct \`serviceId\` to pass on every call (\`${connector.serviceId}\`)`);
  lines.push(`3. ${connector.name}-specific auth and coverage caveats`);
  lines.push("");
  lines.push("For the full method surface (parameters, pagination, filtering), use your language SDK skill:");
  lines.push("");
  lines.push(
    "- [`apideck-node`](../../skills/apideck-node/), [`apideck-python`](../../skills/apideck-python/), [`apideck-dotnet`](../../skills/apideck-dotnet/), [`apideck-java`](../../skills/apideck-java/), [`apideck-go`](../../skills/apideck-go/), [`apideck-php`](../../skills/apideck-php/), or [`apideck-rest`](../../skills/apideck-rest/)"
  );
  lines.push("");
  lines.push("For the raw OpenAPI spec:");
  lines.push("");
  for (const api of connector.unifiedApis) {
    const info = manifest.unifiedApis[api];
    lines.push(`- **${info.displayName}:** [${info.specUrl}](${info.specUrl}) · [API Explorer](${info.apiExplorerUrl})`);
  }
  lines.push("");

  // Minimal example
  lines.push("## Minimal example (TypeScript)");
  lines.push("");
  lines.push("```typescript");
  lines.push(`import { Apideck } from "@apideck/unify";`);
  lines.push("");
  lines.push(`const apideck = new Apideck({`);
  lines.push(`  apiKey: process.env.APIDECK_API_KEY,`);
  lines.push(`  appId: process.env.APIDECK_APP_ID,`);
  lines.push(`  consumerId: "your-consumer-id",`);
  lines.push(`});`);
  lines.push("");
  lines.push(`// List ${ctx.primaryResource} in ${connector.name}`);
  lines.push(`const { data } = await apideck.${apiInfo.packageName}.${ctx.primaryResource}.list({`);
  lines.push(`  serviceId: "${connector.serviceId}",`);
  lines.push(`});`);
  lines.push("```");
  lines.push("");

  // Portability section — the compounding-abstraction pitch made concrete
  {
    const peerSlugs = peersFor(connector, primaryApi, 2).map((p) => p.slug);
    lines.push(`## Portable across ${primarySiblingCount} ${displayApi} connectors`);
    lines.push("");
    lines.push(
      `The Apideck **${displayApi}** unified API exposes the same methods for every connector in its catalog. Switching from ${connector.name} to another ${displayApi} connector is a one-string change — no rewrite, no new SDK.`
    );
    lines.push("");
    if (peerSlugs.length >= 2) {
      lines.push("```typescript");
      lines.push(`// Today — ${connector.name}`);
      lines.push(`await apideck.${apiInfo.packageName}.${ctx.primaryResource}.list({ serviceId: "${connector.serviceId}" });`);
      lines.push("");
      lines.push(`// Tomorrow — same code, different connector`);
      for (const peerSlug of peerSlugs) {
        lines.push(`await apideck.${apiInfo.packageName}.${ctx.primaryResource}.list({ serviceId: "${peerSlug}" });`);
      }
      lines.push("```");
      lines.push("");
    }
    lines.push(
      `This is the compounding advantage of using Apideck over integrating ${connector.name} directly: code against the unified ${displayApi} API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.`
    );
    lines.push("");
  }

  // Authentication (generic block; enhancement may override with connector-specific content)
  if (!enhancement) {
    lines.push("## Authentication");
    lines.push("");
    lines.push(authBlock(connector.authType, connector.name));
    lines.push("");
    if (connector.guides && connector.guides.length) {
      const guideLink = connector.guides.find((g) => g.name === "connection") || connector.guides.find((g) => g.name === "oauth_credentials") || connector.guides[0];
      lines.push(
        `**Setup guide:** Apideck publishes a step-by-step guide for registering an OAuth app / configuring credentials for ${connector.name} — see [${guideLink.url}](${guideLink.url}). Use that as the authoritative source when walking users through connection setup.`
      );
      lines.push("");
    }
    lines.push(
      `See [\`apideck-best-practices\`](../../skills/apideck-best-practices/) for Vault setup, connection lifecycle, and handling re-auth flows.`
    );
    lines.push("");
  }

  // Enhancement slot (Tier 1a/1b hand-authored content — replaces generic auth block)
  if (enhancement) {
    lines.push(enhancement);
    lines.push("");
  }

  // Coverage (skip if enhancement already covered it)
  if (!enhancement || !/##\s+Coverage|##\s+Verifying coverage/i.test(enhancement)) {
    lines.push("## Verifying coverage");
    lines.push("");
    lines.push(
      `Not every ${displayApi} operation is supported by every connector. Always verify before assuming a method works:`
    );
    lines.push("");
    lines.push("```bash");
    lines.push(`curl 'https://unify.apideck.com/connector/connectors/${connector.serviceId}' \\`);
    lines.push(`  -H "Authorization: Bearer \${APIDECK_API_KEY}" \\`);
    lines.push(`  -H "x-apideck-app-id: \${APIDECK_APP_ID}"`);
    lines.push("```");
    lines.push("");
    lines.push(
      `See [\`apideck-connector-coverage\`](../../skills/apideck-connector-coverage/) for patterns around \`UnsupportedOperationError\` and connector-specific fallbacks.`
    );
    lines.push("");
  }

  // Proxy escape hatch (skip if enhancement already showed it with real URL)
  if (!enhancement || !/x-apideck-downstream-url/i.test(enhancement)) {
    lines.push("## Escape hatch: Proxy API");
    lines.push("");
    lines.push(
      `When an endpoint isn't covered by the ${displayApi} unified API, use Apideck's Proxy to call ${connector.name} directly — Apideck injects auth headers and handles token refresh. Set \`x-apideck-downstream-url\` to the target endpoint on ${connector.name}'s own API:`
    );
    lines.push("");
    lines.push("```bash");
    lines.push(`curl 'https://unify.apideck.com/proxy' \\`);
    lines.push(`  -H "Authorization: Bearer \${APIDECK_API_KEY}" \\`);
    lines.push(`  -H "x-apideck-app-id: \${APIDECK_APP_ID}" \\`);
    lines.push(`  -H "x-apideck-consumer-id: \${CONSUMER_ID}" \\`);
    lines.push(`  -H "x-apideck-service-id: ${connector.serviceId}" \\`);
    lines.push(`  -H "x-apideck-downstream-url: <target endpoint on ${connector.name}>" \\`);
    lines.push(`  -H "x-apideck-downstream-method: GET"`);
    lines.push("```");
    lines.push("");
    lines.push(`See [${connector.name}'s API docs](${connector.docsUrl || "#"}) for available endpoints.`);
    lines.push("");
  }

  // Sibling connectors — cross-link to drive the catalog network effect
  lines.push("## Sibling connectors");
  lines.push("");
  for (const api of connector.unifiedApis) {
    const info = manifest.unifiedApis[api];
    const peers = peersFor(connector, api, 8);
    if (peers.length === 0) continue;
    lines.push(
      `Other **${info.displayName}** connectors that share this unified API surface (same method signatures, just change \`serviceId\`):`
    );
    lines.push("");
    const peerLinks = peers
      .map((p) => `[\`${p.slug}\`](../${p.slug}/)${p.status === "beta" ? " *(beta)*" : ""}`)
      .join(", ");
    const remainder = (SIBLINGS[api] || []).length - 1 - peers.length;
    lines.push(`${peerLinks}${remainder > 0 ? `, and ${remainder} more.` : "."}`);
    lines.push("");
  }

  // See also
  lines.push("## See also");
  lines.push("");
  if (connector.guides && connector.guides.length) {
    for (const g of connector.guides) {
      const label = g.name === "oauth_credentials" ? `Apideck OAuth setup guide for ${connector.name}` : g.name === "connection" ? `Apideck connection guide for ${connector.name}` : `Apideck ${g.name.replace(/_/g, " ")} guide`;
      lines.push(`- [${label}](${g.url})`);
    }
  }
  for (const api of connector.unifiedApis) {
    const info = manifest.unifiedApis[api];
    lines.push(`- [${info.displayName} OpenAPI spec](${info.specUrl}) · [API Explorer](${info.apiExplorerUrl})`);
  }
  lines.push("- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks");
  lines.push("- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling");
  lines.push("- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns");
  if (connector.docsUrl) {
    lines.push(`- [${connector.name} official docs](${connector.docsUrl})`);
  }
  lines.push("");

  return lines.join("\n");
}

function renderMetadata(connector) {
  const apis = connector.unifiedApis.map((a) => manifest.unifiedApis[a].displayName).join(", ");
  return {
    version: "1.0.0",
    organization: "Apideck",
    date: "April 2026",
    abstract: `${connector.name} connector skill. Routes through Apideck's ${apis} unified API using serviceId "${connector.serviceId}".`,
    serviceId: connector.serviceId,
    unifiedApis: connector.unifiedApis,
    authType: connector.authType,
    tier: connector.tier,
    references: [
      "https://developers.apideck.com",
      "https://apideck.com",
      `https://unify.apideck.com/connector/connectors/${connector.serviceId}`,
      connector.docsUrl,
    ].filter(Boolean),
  };
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  let connectors = manifest.connectors;
  if (onlySlug) connectors = connectors.filter((c) => c.slug === onlySlug);
  if (onlyTier) connectors = connectors.filter((c) => c.tier === onlyTier);

  if (connectors.length === 0) {
    console.error("No connectors matched.");
    process.exit(1);
  }

  console.log(`Generating ${connectors.length} connector skill(s)...\n`);

  let written = 0;
  for (const connector of connectors) {
    const dir = path.join(CONNECTORS_DIR, connector.slug);
    fs.mkdirSync(dir, { recursive: true });

    const skillMd = renderSkill(connector);
    fs.writeFileSync(path.join(dir, "SKILL.md"), skillMd);

    const meta = renderMetadata(connector);
    fs.writeFileSync(
      path.join(dir, "metadata.json"),
      JSON.stringify(meta, null, 2) + "\n"
    );

    written++;
    const enhancedMark = fs.existsSync(path.join(ENHANCEMENTS_DIR, `${connector.slug}.md`))
      ? " (enhanced)"
      : "";
    console.log(`  OK ${connector.slug}${enhancedMark}`);
  }

  console.log(`\nWrote ${written} connector skill(s).\n`);
}

main();
