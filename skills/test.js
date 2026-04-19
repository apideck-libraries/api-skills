#!/usr/bin/env node

/**
 * Skill validation test script
 *
 * Validates all skills in the repository for structure, content, and consistency.
 *
 * Usage:
 *   node skills/test.js                # Run all validations
 *   node skills/test.js --check-links  # Also verify external URLs via HEAD requests
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const SKILLS_DIR = path.join(__dirname);
const ROOT_DIR = path.join(__dirname, "..");
const PROVIDER_TARGETS = [
  path.join(ROOT_DIR, "providers", "claude", "plugin", "skills"),
  path.join(ROOT_DIR, "providers", "cursor", "plugin", "skills"),
];

const SDK_SKILLS = new Set([
  "apideck-node",
  "apideck-python",
  "apideck-dotnet",
  "apideck-java",
  "apideck-go",
  "apideck-php",
  "apideck-rest",
]);

const SDK_PACKAGES = {
  "apideck-node": "@apideck/unify",
  "apideck-python": "apideck-unify",
  "apideck-dotnet": "ApideckUnifySdk",
  "apideck-java": "com.apideck:unify",
  "apideck-go": "github.com/apideck-libraries/sdk-go",
  "apideck-php": "apideck-libraries/sdk-php",
};

const SDK_EXPECTED_SECTIONS = [
  /authentication|setup|install/i,
  /crud|operations|create.*read|list.*get/i,
  /pagination|cursor/i,
  /error/i,
];

const SECRET_PATTERNS = [
  /Bearer\s+[A-Za-z0-9\-._~+/]{20,}/,
  /sk[-_]live[-_][A-Za-z0-9]{20,}/,
  /api[_-]?key\s*[:=]\s*["'][A-Za-z0-9]{20,}["']/i,
];

const args = process.argv.slice(2);
const checkLinks = args.includes("--check-links");

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

let totalErrors = 0;
let totalWarnings = 0;

function error(skill, msg) {
  console.log(`  ${red("FAIL")} ${msg}`);
  totalErrors++;
}

function warn(skill, msg) {
  console.log(`  ${yellow("WARN")} ${msg}`);
  totalWarnings++;
}

function pass(msg) {
  console.log(`  ${green("PASS")} ${msg}`);
}

// ── Frontmatter parser ──────────────────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const fields = {};

  for (const line of yaml.split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) {
      let val = kv[2].trim();
      if (val === "true") val = true;
      else if (val === "false") val = false;
      else if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      fields[kv[1]] = val;
    }
  }

  return fields;
}

// ── Link extraction ─────────────────────────────────────────────────────────

function extractLinks(content) {
  const links = [];
  const re = /\[([^\]]*)\]\(([^)]*)\)/g;
  let m;
  while ((m = re.exec(content))) {
    links.push({ text: m[1], url: m[2], offset: m.index });
  }
  return links;
}

// ── External link checker ───────────────────────────────────────────────────

function checkUrl(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.request(url, { method: "HEAD", timeout: 10000 }, (res) => {
      resolve({ url, status: res.statusCode, ok: res.statusCode < 400 });
    });
    req.on("error", (e) => resolve({ url, status: 0, ok: false, error: e.message }));
    req.on("timeout", () => { req.destroy(); resolve({ url, status: 0, ok: false, error: "timeout" }); });
    req.end();
  });
}

// ── Validations ─────────────────────────────────────────────────────────────

function validateStructure(skillName, skillDir) {
  const skillFile = path.join(skillDir, "SKILL.md");
  const metaFile = path.join(skillDir, "metadata.json");

  // SKILL.md exists
  if (!fs.existsSync(skillFile)) {
    error(skillName, "SKILL.md not found");
    return null;
  }

  const content = fs.readFileSync(skillFile, "utf-8");
  const lines = content.split("\n").length;

  // Frontmatter
  const fm = parseFrontmatter(content);
  if (!fm) {
    error(skillName, "SKILL.md has no valid YAML frontmatter");
    return null;
  }

  // Required fields
  for (const field of ["name", "description", "license", "alwaysApply"]) {
    if (fm[field] === undefined) {
      error(skillName, `missing required frontmatter field: ${field}`);
    }
  }

  // Name matches directory
  if (fm.name && fm.name !== skillName) {
    error(skillName, `name "${fm.name}" does not match directory "${skillName}"`);
  }

  // Name starts with apideck-
  if (fm.name && !fm.name.startsWith("apideck-")) {
    error(skillName, `name "${fm.name}" must start with "apideck-"`);
  }

  // alwaysApply is false
  if (fm.alwaysApply !== false) {
    error(skillName, `alwaysApply must be false, got: ${fm.alwaysApply}`);
  }

  // Line count
  if (lines > 500) {
    warn(skillName, `SKILL.md is ${lines} lines (max recommended: 500)`);
  } else {
    pass(`SKILL.md: ${lines} lines`);
  }

  // metadata.json
  if (!fs.existsSync(metaFile)) {
    error(skillName, "metadata.json not found");
  } else {
    try {
      const meta = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
      for (const field of ["version", "organization", "references"]) {
        if (!meta[field]) {
          error(skillName, `metadata.json missing field: ${field}`);
        }
      }
      pass("metadata.json valid");
    } catch {
      error(skillName, "metadata.json is not valid JSON");
    }
  }

  // References linked from SKILL.md exist on disk
  const refLinks = extractLinks(content).filter((l) =>
    l.url.startsWith("references/")
  );
  for (const link of refLinks) {
    const refPath = path.join(skillDir, link.url);
    if (!fs.existsSync(refPath)) {
      error(skillName, `linked reference not found: ${link.url}`);
    }
  }
  if (refLinks.length > 0) {
    pass(`${refLinks.length} reference link(s) verified`);
  }

  return { content, fm, lines };
}

function validateCodeBlocks(skillName, content) {
  const codeBlockRe = /```(\w*)\n([\s\S]*?)```/g;
  let m;
  let blockCount = 0;
  let unlabeled = 0;

  while ((m = codeBlockRe.exec(content))) {
    blockCount++;
    const lang = m[1];
    const body = m[2];

    if (!lang) {
      unlabeled++;
    }

    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(body)) {
        error(skillName, `possible hardcoded secret in code block (lang: ${lang || "none"})`);
      }
    }
  }

  if (unlabeled > 0) {
    warn(skillName, `${unlabeled}/${blockCount} code block(s) missing language identifier`);
  } else if (blockCount > 0) {
    pass(`${blockCount} code block(s) all have language identifiers`);
  }
}

function validateContentConsistency(skillName, content) {
  if (!SDK_SKILLS.has(skillName)) return;

  // Check expected sections
  const missingSections = [];
  for (const pattern of SDK_EXPECTED_SECTIONS) {
    if (!pattern.test(content)) {
      missingSections.push(pattern.source);
    }
  }
  if (missingSections.length > 0) {
    warn(skillName, `SDK skill missing expected sections: ${missingSections.join(", ")}`);
  } else {
    pass("SDK sections present");
  }

  // Check package name appears for non-rest SDK skills
  const expectedPkg = SDK_PACKAGES[skillName];
  if (expectedPkg && !content.includes(expectedPkg)) {
    warn(skillName, `expected package "${expectedPkg}" not found in SKILL.md`);
  }
}

function validateLinks(skillName, content, skillDir) {
  const links = extractLinks(content);
  const externalUrls = [];

  for (const link of links) {
    if (!link.url || link.url.trim() === "") {
      error(skillName, `empty URL for link text "${link.text}"`);
      continue;
    }

    if (link.url.startsWith("http://") || link.url.startsWith("https://")) {
      try {
        new URL(link.url);
        externalUrls.push(link.url);
      } catch {
        error(skillName, `malformed URL: ${link.url}`);
      }
    } else if (link.url.startsWith("references/")) {
      // Already checked in validateStructure
    } else if (!link.url.startsWith("#") && !link.url.startsWith("mailto:")) {
      // Relative file link — check if it exists
      const resolved = path.join(skillDir, link.url);
      if (!fs.existsSync(resolved)) {
        warn(skillName, `relative link target not found: ${link.url}`);
      }
    }
  }

  return externalUrls;
}

function validateProviderSync(skillName, skillDir) {
  const skillFile = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(skillFile)) return;

  const srcContent = fs.readFileSync(skillFile, "utf-8");

  for (const targetBase of PROVIDER_TARGETS) {
    const targetFile = path.join(targetBase, skillName, "SKILL.md");
    if (!fs.existsSync(targetFile)) {
      warn(skillName, `not synced to ${path.relative(ROOT_DIR, targetBase)}`);
      continue;
    }
    const targetContent = fs.readFileSync(targetFile, "utf-8");
    if (srcContent !== targetContent) {
      warn(skillName, `out of sync with ${path.relative(ROOT_DIR, targetBase)}`);
    }
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(bold("\nApideck Skill Validation\n"));

  const skillDirs = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("apideck-"))
    .map((d) => d.name)
    .sort();

  console.log(`Found ${skillDirs.length} skill(s)\n`);

  const allExternalUrls = [];

  for (const skillName of skillDirs) {
    console.log(bold(`${skillName}`));
    const skillDir = path.join(SKILLS_DIR, skillName);

    const result = validateStructure(skillName, skillDir);
    if (result) {
      validateCodeBlocks(skillName, result.content);
      validateContentConsistency(skillName, result.content);
      const urls = validateLinks(skillName, result.content, skillDir);
      allExternalUrls.push(...urls);
      validateProviderSync(skillName, skillDir);
    }

    console.log();
  }

  // External link checking (opt-in)
  if (checkLinks && allExternalUrls.length > 0) {
    const unique = [...new Set(allExternalUrls)];
    console.log(bold(`Checking ${unique.length} external URL(s)...\n`));

    const results = await Promise.all(unique.map(checkUrl));
    let broken = 0;
    for (const r of results) {
      if (!r.ok) {
        console.log(`  ${red("BROKEN")} ${r.url} (${r.error || r.status})`);
        broken++;
      }
    }
    if (broken === 0) {
      console.log(`  ${green("PASS")} All external URLs reachable\n`);
    } else {
      console.log(`\n  ${broken} broken URL(s)\n`);
      totalWarnings += broken;
    }
  }

  // Summary
  console.log(bold("Summary"));
  console.log(`  Skills: ${skillDirs.length}`);
  console.log(`  Errors: ${totalErrors === 0 ? green("0") : red(totalErrors)}`);
  console.log(`  Warnings: ${totalWarnings === 0 ? green("0") : yellow(totalWarnings)}`);
  console.log();

  if (totalErrors > 0) {
    console.log(red("FAILED") + ` — ${totalErrors} error(s) found\n`);
    process.exit(1);
  }

  console.log(green("PASSED") + " — all validations passed\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
