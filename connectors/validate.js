#!/usr/bin/env node

/**
 * Connector skill validator
 *
 * Validates each generated SKILL.md against the manifest and repository conventions.
 *
 * Checks:
 *   - frontmatter has required fields (name, description, license, alwaysApply, metadata)
 *   - name matches directory name and manifest slug
 *   - alwaysApply is false
 *   - serviceId in frontmatter matches manifest
 *   - unifiedApis in frontmatter match manifest
 *   - line count under soft limit
 *   - no hardcoded secrets in code blocks
 *   - every manifest entry has a corresponding directory (and vice versa)
 *   - every code block has a language identifier
 *
 * Usage:
 *   node connectors/validate.js
 *   node connectors/validate.js --strict  # treat warnings as errors
 */

const fs = require("fs");
const path = require("path");

const CONNECTORS_DIR = __dirname;
const MANIFEST_PATH = path.join(CONNECTORS_DIR, "manifest.json");
const LINE_SOFT_LIMIT = 500;

const SECRET_PATTERNS = [
  /Bearer\s+[A-Za-z0-9\-._~+/]{32,}/,
  /sk[-_]live[-_][A-Za-z0-9]{20,}/,
  /api[_-]?key\s*[:=]\s*["'][A-Za-z0-9]{20,}["']/i,
];

const args = process.argv.slice(2);
const strict = args.includes("--strict");

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

let errors = 0;
let warnings = 0;

function fail(slug, msg) {
  console.log(`  ${red("FAIL")} [${slug}] ${msg}`);
  errors++;
}

function warn(slug, msg) {
  console.log(`  ${yellow("WARN")} [${slug}] ${msg}`);
  warnings++;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const yaml = match[1];
  const top = {};
  const metadata = {};
  let inMetadata = false;
  for (const raw of yaml.split("\n")) {
    if (/^metadata:\s*$/.test(raw)) {
      inMetadata = true;
      continue;
    }
    if (inMetadata) {
      const m = raw.match(/^  (\w+):\s*(.*)$/);
      if (!m) {
        inMetadata = false;
        continue;
      }
      let v = m[2].trim();
      if (v === "true") v = true;
      else if (v === "false") v = false;
      else if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      else if (v.startsWith("[") && v.endsWith("]")) {
        v = v
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^"|"$/g, ""))
          .filter(Boolean);
      }
      metadata[m[1]] = v;
    } else {
      const m = raw.match(/^(\w+):\s*(.*)$/);
      if (m) {
        let v = m[2].trim();
        if (v === "true") v = true;
        else if (v === "false") v = false;
        else if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
        top[m[1]] = v;
      }
    }
  }
  top.metadata = metadata;
  return top;
}

function validateConnector(connector) {
  const dir = path.join(CONNECTORS_DIR, connector.slug);
  const skillFile = path.join(dir, "SKILL.md");
  const metaFile = path.join(dir, "metadata.json");

  if (!fs.existsSync(skillFile)) {
    fail(connector.slug, "SKILL.md missing (run connectors/generate.js)");
    return;
  }

  const content = fs.readFileSync(skillFile, "utf-8");
  const fm = parseFrontmatter(content);

  if (!fm) {
    fail(connector.slug, "no valid frontmatter");
    return;
  }

  for (const field of ["name", "description", "license", "alwaysApply"]) {
    if (fm[field] === undefined) {
      fail(connector.slug, `missing required frontmatter field: ${field}`);
    }
  }

  if (fm.name && fm.name !== connector.slug) {
    fail(connector.slug, `name "${fm.name}" does not match slug "${connector.slug}"`);
  }

  if (fm.name && fm.name.startsWith("apideck-")) {
    fail(connector.slug, `connector skill must NOT have apideck- prefix (bare name convention)`);
  }

  if (fm.alwaysApply !== false) {
    fail(connector.slug, `alwaysApply must be false, got: ${fm.alwaysApply}`);
  }

  // metadata nested fields
  const md = fm.metadata || {};
  if (!md.author) fail(connector.slug, "metadata.author missing");
  if (!md.version) fail(connector.slug, "metadata.version missing");
  if (md.serviceId !== connector.serviceId) {
    fail(
      connector.slug,
      `metadata.serviceId "${md.serviceId}" != manifest "${connector.serviceId}"`
    );
  }
  if (md.authType && md.authType !== connector.authType) {
    fail(
      connector.slug,
      `metadata.authType "${md.authType}" != manifest "${connector.authType}"`
    );
  }
  if (Array.isArray(md.unifiedApis)) {
    const missing = connector.unifiedApis.filter((a) => !md.unifiedApis.includes(a));
    const extra = md.unifiedApis.filter((a) => !connector.unifiedApis.includes(a));
    if (missing.length || extra.length) {
      fail(
        connector.slug,
        `metadata.unifiedApis mismatch: missing=${missing}, extra=${extra}`
      );
    }
  }

  // line count
  const lineCount = content.split("\n").length;
  if (lineCount > LINE_SOFT_LIMIT) {
    warn(connector.slug, `SKILL.md is ${lineCount} lines (soft limit ${LINE_SOFT_LIMIT})`);
  }

  // metadata.json
  if (!fs.existsSync(metaFile)) {
    fail(connector.slug, "metadata.json missing");
  } else {
    try {
      const meta = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
      for (const field of ["version", "organization", "references"]) {
        if (!meta[field]) fail(connector.slug, `metadata.json missing ${field}`);
      }
      if (meta.serviceId !== connector.serviceId) {
        fail(
          connector.slug,
          `metadata.json serviceId mismatch: ${meta.serviceId} vs ${connector.serviceId}`
        );
      }
    } catch (e) {
      fail(connector.slug, `metadata.json invalid JSON: ${e.message}`);
    }
  }

  // code blocks
  const codeBlockRe = /```(\w*)\n([\s\S]*?)```/g;
  let m;
  let total = 0;
  let unlabeled = 0;
  while ((m = codeBlockRe.exec(content))) {
    total++;
    if (!m[1]) unlabeled++;
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(m[2])) {
        fail(connector.slug, `possible hardcoded secret in code block`);
      }
    }
  }
  if (unlabeled > 0) {
    warn(connector.slug, `${unlabeled}/${total} code blocks missing language identifier`);
  }

  // serviceId mentioned in body (sanity check)
  if (!content.includes(connector.serviceId)) {
    warn(connector.slug, `serviceId "${connector.serviceId}" not mentioned in body`);
  }
}

function main() {
  console.log(bold("\nConnector Catalog Validation\n"));

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  const connectors = manifest.connectors;

  console.log(`Manifest has ${connectors.length} connector(s)`);
  const manifestSlugs = new Set(connectors.map((c) => c.slug));

  // Check for orphan directories (exist in connectors/ but not in manifest)
  const dirs = fs
    .readdirSync(CONNECTORS_DIR, { withFileTypes: true })
    .filter(
      (d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith(".")
    )
    .map((d) => d.name);

  for (const dir of dirs) {
    if (!manifestSlugs.has(dir)) {
      fail(dir, `directory exists but no manifest entry (stale — delete or add to manifest)`);
    }
  }

  console.log(`Directory listing has ${dirs.length} skill folder(s)\n`);

  for (const connector of connectors) {
    validateConnector(connector);
  }

  const tierCounts = connectors.reduce((acc, c) => {
    acc[c.tier] = (acc[c.tier] || 0) + 1;
    return acc;
  }, {});
  const verifiedCount = connectors.filter((c) => c.verified).length;

  console.log(bold("\nSummary"));
  console.log(`  Connectors: ${connectors.length}`);
  console.log(`  Verified serviceIds: ${verifiedCount}/${connectors.length}`);
  console.log(`  Tiers: ${Object.entries(tierCounts).map(([t, n]) => `${t}=${n}`).join(", ")}`);
  console.log(`  Errors: ${errors === 0 ? green("0") : red(errors)}`);
  console.log(`  Warnings: ${warnings === 0 ? green("0") : yellow(warnings)}`);
  console.log();

  if (errors > 0 || (strict && warnings > 0)) {
    console.log(red("FAILED"));
    process.exit(1);
  }

  console.log(green("PASSED"));
}

main();
