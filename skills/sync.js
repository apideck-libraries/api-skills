#!/usr/bin/env node

/**
 * Sync script for Apideck API Skills
 *
 * Fetches the latest OpenAPI specs from specs.apideck.com and updates
 * skill reference files with current endpoint information. Also syncs
 * skills to provider plugin directories (Claude, Cursor).
 *
 * Usage:
 *   node skills/sync.js                  # Sync all
 *   node skills/sync.js --skills-only    # Only sync to provider dirs
 *   node skills/sync.js --specs-only     # Only update from OpenAPI specs
 *
 * Environment:
 *   APIDECK_SPECS_BASE_URL  Override specs base URL (default: https://specs.apideck.com)
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const SPECS_BASE_URL =
  process.env.APIDECK_SPECS_BASE_URL || "https://specs.apideck.com";

const APIS = [
  "accounting",
  "crm",
  "hris",
  "file-storage",
  "ats",
  "vault",
  "webhook",
  "ecommerce",
  "issue-tracking",
  "sms",
  "lead",
  "pos",
  "connector",
  "proxy",
];

const SKILLS_DIR = path.join(__dirname);
const PROVIDERS_DIR = path.join(__dirname, "..", "providers");
const PROVIDER_TARGETS = [
  path.join(PROVIDERS_DIR, "claude", "plugin", "skills"),
  path.join(PROVIDERS_DIR, "cursor", "plugin", "skills"),
];

// ── Skill Sync ──────────────────────────────────────────────────────────────

function getSkillDirs() {
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(
      (d) => d.isDirectory() && d.name.startsWith("apideck-") && d.name !== "apideck-node"
    )
    .map((d) => d.name);
}

function getNodeSkillDirs() {
  const nodeSkillDir = path.join(SKILLS_DIR, "apideck-node");
  if (!fs.existsSync(nodeSkillDir)) return [];
  return ["apideck-node"];
}

function syncSkillToProviders(skillName) {
  const srcDir = path.join(SKILLS_DIR, skillName);
  const skillFile = path.join(srcDir, "SKILL.md");

  if (!fs.existsSync(skillFile)) {
    console.warn(`  SKIP ${skillName}: no SKILL.md found`);
    return;
  }

  for (const targetBase of PROVIDER_TARGETS) {
    const targetDir = path.join(targetBase, skillName);
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy SKILL.md
    fs.copyFileSync(skillFile, path.join(targetDir, "SKILL.md"));

    // Copy references/ if present
    const refsDir = path.join(srcDir, "references");
    if (fs.existsSync(refsDir)) {
      const targetRefsDir = path.join(targetDir, "references");
      fs.mkdirSync(targetRefsDir, { recursive: true });
      for (const file of fs.readdirSync(refsDir)) {
        fs.copyFileSync(
          path.join(refsDir, file),
          path.join(targetRefsDir, file)
        );
      }
    }
  }

  console.log(`  OK ${skillName} -> ${PROVIDER_TARGETS.length} providers`);
}

function syncAllSkills() {
  console.log("Syncing skills to provider directories...\n");

  const allSkills = [
    ...getSkillDirs(),
    ...getNodeSkillDirs(),
  ];

  for (const skill of allSkills) {
    syncSkillToProviders(skill);
  }

  // Also copy commands to Cursor
  const claudeCommands = path.join(
    PROVIDERS_DIR,
    "claude",
    "plugin",
    "commands"
  );
  const cursorCommands = path.join(
    PROVIDERS_DIR,
    "cursor",
    "plugin",
    "commands"
  );

  if (fs.existsSync(claudeCommands)) {
    fs.mkdirSync(cursorCommands, { recursive: true });
    for (const file of fs.readdirSync(claudeCommands)) {
      fs.copyFileSync(
        path.join(claudeCommands, file),
        path.join(cursorCommands, file)
      );
    }
    console.log(`  OK commands -> cursor`);
  }

  console.log("\nDone.\n");
}

// ── OpenAPI Spec Fetch ──────────────────────────────────────────────────────

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetch(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

async function fetchSpecInfo(apiName) {
  const url = `${SPECS_BASE_URL}/${apiName}.yml`;
  try {
    const spec = await fetch(url);
    // Extract basic info from the YAML (lightweight parse)
    const titleMatch = spec.match(/^\s*title:\s*(.+)$/m);
    const versionMatch = spec.match(/^\s*version:\s*(.+)$/m);
    const pathCount = (spec.match(/^\s{2}\/[^\s:]+:/gm) || []).length;

    return {
      api: apiName,
      title: titleMatch ? titleMatch[1].trim().replace(/['"]/g, "") : apiName,
      version: versionMatch
        ? versionMatch[1].trim().replace(/['"]/g, "")
        : "unknown",
      endpoints: pathCount,
      url,
    };
  } catch (err) {
    console.warn(`  SKIP ${apiName}: ${err.message}`);
    return null;
  }
}

async function updateSpecsInfo() {
  console.log("Fetching OpenAPI spec info...\n");

  const results = [];
  for (const api of APIS) {
    const info = await fetchSpecInfo(api);
    if (info) {
      results.push(info);
      console.log(
        `  OK ${info.api}: v${info.version}, ${info.endpoints} paths`
      );
    }
  }

  // Write spec summary
  const summaryPath = path.join(SKILLS_DIR, "..", "specs-summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2) + "\n");
  console.log(`\nWrote ${summaryPath}\n`);

  return results;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const skillsOnly = args.includes("--skills-only");
  const specsOnly = args.includes("--specs-only");

  if (!skillsOnly) {
    await updateSpecsInfo();
  }

  if (!specsOnly) {
    syncAllSkills();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
