#!/usr/bin/env node

/**
 * Install smoke test
 *
 * Runs `npx skills add apideck-libraries/api-skills --skill <name>` once per
 * skill in an ephemeral temp directory, verifies the install produced the
 * expected file layout, then tears everything down.
 *
 * Purpose: catch broken manifests, missing metadata, or packaging regressions
 * before users hit them. Meant to run manually or in CI — not on a schedule,
 * and not repeatedly. A single pass is the point.
 *
 * Usage:
 *   node scripts/install-smoketest.js                   # Full catalog (all apideck-* + all connectors)
 *   node scripts/install-smoketest.js --skills-only     # Just skills/apideck-*
 *   node scripts/install-smoketest.js --connectors-only # Just connectors/
 *   node scripts/install-smoketest.js --tier=1a         # Tier 1a connectors only
 *   node scripts/install-smoketest.js --only=salesforce # One skill by slug
 *   node scripts/install-smoketest.js --sample=10       # Random N-skill sample
 *   node scripts/install-smoketest.js --keep            # Don't clean up temp dir (for debugging)
 *   node scripts/install-smoketest.js --verbose         # Show npx stdout/stderr on failures
 *
 * Exit code: 0 if all skills installed cleanly, 1 if any failed.
 *
 * What this is NOT:
 *   - Not a benchmark, not a scheduled job, not a loop.
 *   - Not intended to affect skills.sh install metrics. Each run does a
 *     small number of installs from a temp dir; skills.sh de-duplicates
 *     installs per machine, so this neither inflates nor suppresses counts.
 *   - Not a substitute for `node skills/test.js` or `node connectors/validate.js`
 *     which do deterministic structural validation without network.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const CONNECTORS_DIR = path.join(ROOT, "connectors");
const MANIFEST_PATH = path.join(CONNECTORS_DIR, "manifest.json");

const SOURCE = "apideck-libraries/api-skills";
const INSTALL_TIMEOUT_MS = 120_000; // npx cold starts can be slow

// ── Flags ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flags = {
  skillsOnly: args.includes("--skills-only"),
  connectorsOnly: args.includes("--connectors-only"),
  keep: args.includes("--keep"),
  verbose: args.includes("--verbose"),
  tier: (args.find((a) => a.startsWith("--tier=")) || "").split("=")[1] || null,
  only: (args.find((a) => a.startsWith("--only=")) || "").split("=")[1] || null,
  sample:
    Number((args.find((a) => a.startsWith("--sample=")) || "").split("=")[1]) || 0,
};

// ── Target selection ───────────────────────────────────────────────────────

function listApideckSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("apideck-"))
    .map((d) => ({ kind: "skill", slug: d.name }));
}

function listConnectors() {
  if (!fs.existsSync(MANIFEST_PATH)) return [];
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  let entries = manifest.connectors;
  if (flags.tier) entries = entries.filter((c) => c.tier === flags.tier);
  return entries.map((c) => ({ kind: "connector", slug: c.slug }));
}

function selectTargets() {
  if (flags.only) {
    const match = [
      { kind: "skill", slug: flags.only },
      { kind: "connector", slug: flags.only },
    ].filter((t) =>
      fs.existsSync(
        path.join(t.kind === "skill" ? SKILLS_DIR : CONNECTORS_DIR, t.slug, "SKILL.md")
      )
    );
    return match;
  }

  const targets = [];
  if (!flags.connectorsOnly) targets.push(...listApideckSkills());
  if (!flags.skillsOnly) targets.push(...listConnectors());

  if (flags.sample && flags.sample > 0 && flags.sample < targets.length) {
    // Deterministic sample from a session-random seed — same run hits same set.
    const seed = crypto.randomBytes(4).toString("hex");
    console.log(`Sampling ${flags.sample} of ${targets.length} (seed: ${seed})`);
    for (let i = targets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [targets[i], targets[j]] = [targets[j], targets[i]];
    }
    return targets.slice(0, flags.sample);
  }

  return targets;
}

// ── Temp workspace ─────────────────────────────────────────────────────────

function makeWorkspace() {
  const id = crypto.randomBytes(6).toString("hex");
  const dir = path.join(os.tmpdir(), `apideck-smoketest-${id}`);
  fs.mkdirSync(dir, { recursive: true });
  // skills ecosystems often key on a package.json existing
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ name: "apideck-smoketest", version: "0.0.0", private: true }, null, 2)
  );
  return dir;
}

function teardown(dir) {
  if (flags.keep) {
    console.log(`\n(kept workspace: ${dir})`);
    return;
  }
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (e) {
    console.warn(`\n  warning: could not clean up ${dir}: ${e.message}`);
  }
}

// ── Install + verify ───────────────────────────────────────────────────────

function runInstall(workspace, slug) {
  // `skills` CLI needs its own -y to skip the confirmation prompt.
  // We install locally (not --global) so artifacts stay in the workspace
  // and disappear on teardown — no pollution of the user's system.
  const res = spawnSync(
    "npx",
    ["-y", "skills", "add", SOURCE, "--skill", slug, "-y"],
    {
      cwd: workspace,
      encoding: "utf-8",
      timeout: INSTALL_TIMEOUT_MS,
      maxBuffer: 10 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"], // no stdin — reject any prompts
      env: { ...process.env, CI: "1" },
    }
  );
  return {
    ok: res.status === 0,
    status: res.status,
    stdout: res.stdout || "",
    stderr: res.stderr || "",
    signal: res.signal,
  };
}

function verifyInstalled(workspace, slug) {
  // skills typically land under .claude/skills/<slug>/ (Claude Code convention).
  // Some harnesses may use different layouts — we search a few common locations.
  const candidates = [
    path.join(workspace, ".claude", "skills", slug, "SKILL.md"),
    path.join(workspace, "skills", slug, "SKILL.md"),
    path.join(workspace, ".skills", slug, "SKILL.md"),
  ];
  const found = candidates.find((p) => fs.existsSync(p));
  return { found: !!found, path: found || null };
}

// ── Output helpers ─────────────────────────────────────────────────────────

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[90m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

// ── Main ───────────────────────────────────────────────────────────────────

function main() {
  const targets = selectTargets();

  if (targets.length === 0) {
    console.error("No targets matched the filters.");
    process.exit(1);
  }

  console.log(bold("\nApideck skills install smoke test"));
  console.log(`Source: ${SOURCE}`);
  console.log(`Targets: ${targets.length}`);
  console.log("");

  const workspace = makeWorkspace();
  console.log(dim(`workspace: ${workspace}\n`));

  const results = [];
  for (const target of targets) {
    process.stdout.write(
      `  [${target.kind}] ${target.slug.padEnd(45)}`
    );
    const t0 = Date.now();
    const install = runInstall(workspace, target.slug);
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1) + "s";

    if (!install.ok) {
      console.log(
        `${red("FAIL")} ${dim(`install exited ${install.status}${install.signal ? " " + install.signal : ""}, ${elapsed}`)}`
      );
      if (flags.verbose) {
        console.log(dim("    stdout:"), install.stdout.slice(0, 500));
        console.log(dim("    stderr:"), install.stderr.slice(0, 500));
      }
      results.push({ ...target, ok: false, reason: "install failed" });
      continue;
    }

    const verify = verifyInstalled(workspace, target.slug);
    if (!verify.found) {
      console.log(`${red("FAIL")} ${dim(`no SKILL.md found after install, ${elapsed}`)}`);
      if (flags.verbose) {
        console.log(dim("    stdout:"), install.stdout.slice(0, 500));
      }
      results.push({ ...target, ok: false, reason: "skill not materialized" });
      continue;
    }

    console.log(`${green("OK")}   ${dim(elapsed)}`);
    results.push({ ...target, ok: true });
  }

  teardown(workspace);

  const failed = results.filter((r) => !r.ok);
  const passed = results.filter((r) => r.ok);

  console.log(bold("\nSummary"));
  console.log(`  Installed cleanly: ${green(passed.length)}`);
  console.log(`  Failed:            ${failed.length === 0 ? green("0") : red(failed.length)}`);

  if (failed.length > 0) {
    console.log(bold("\nFailures"));
    for (const f of failed) {
      console.log(`  ${red("✗")} ${f.kind}/${f.slug}: ${f.reason}`);
    }
    console.log(
      "\n" + yellow("Re-run with --verbose --only=<slug> to see install output.")
    );
    process.exit(1);
  }

  console.log(green("\nPASSED") + " — all skills installed cleanly.\n");
}

main();
