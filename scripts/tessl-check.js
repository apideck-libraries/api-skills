#!/usr/bin/env node

/**
 * Tessl quality check
 *
 * Runs `npx tessl skill review` against skill folders and aggregates scores.
 * Tessl's review uses LLM-as-judge so it's slow (~30–90s per skill) — by
 * default this only runs against Tier 1a connectors + apideck-* meta/SDK
 * skills. Pass --all to run against the full catalog.
 *
 * Scoring reference (from docs.tessl.io/evaluate/evaluating-skills):
 *   ≥ 90%  Conforms to best practices
 *   70–89% Good, minor improvements needed
 *   < 70%  Likely needs work before deployment
 *
 * Usage:
 *   node scripts/tessl-check.js                       # sample (Tier 1a + apideck-*)
 *   node scripts/tessl-check.js --all                 # every skill in repo
 *   node scripts/tessl-check.js --tier=1b             # specific connector tier
 *   node scripts/tessl-check.js --only=salesforce     # one skill by slug
 *   node scripts/tessl-check.js --skills-only         # just skills/apideck-*
 *   node scripts/tessl-check.js --connectors-only     # just connectors/
 *   node scripts/tessl-check.js --threshold=70        # fail CI if any score < 70
 *   node scripts/tessl-check.js --report              # write report to .planning/tessl-reports/
 *
 * The script does not commit reports to the repo. Summary scores are printed
 * to stdout; full transcripts go to the gitignored .planning/ path if --report.
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const CONNECTORS_DIR = path.join(ROOT, "connectors");
const MANIFEST_PATH = path.join(CONNECTORS_DIR, "manifest.json");
const REPORT_DIR = path.join(ROOT, ".planning", "tessl-reports");

// ── Flags ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const flags = {
  all: args.includes("--all"),
  skillsOnly: args.includes("--skills-only"),
  connectorsOnly: args.includes("--connectors-only"),
  report: args.includes("--report"),
  tier: (args.find((a) => a.startsWith("--tier=")) || "").split("=")[1] || null,
  only: (args.find((a) => a.startsWith("--only=")) || "").split("=")[1] || null,
  threshold: Number(
    (args.find((a) => a.startsWith("--threshold=")) || "").split("=")[1] || 0
  ),
};

// ── Target selection ───────────────────────────────────────────────────────

function listApideckSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("apideck-"))
    .map((d) => path.join(SKILLS_DIR, d.name));
}

function listConnectors() {
  if (!fs.existsSync(MANIFEST_PATH)) return [];
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  let entries = manifest.connectors;
  if (flags.tier) entries = entries.filter((c) => c.tier === flags.tier);
  if (flags.only) entries = entries.filter((c) => c.slug === flags.only);
  if (!flags.all && !flags.tier && !flags.only) {
    entries = entries.filter((c) => c.tier === "1a");
  }
  return entries.map((c) => path.join(CONNECTORS_DIR, c.slug));
}

function selectTargets() {
  if (flags.only) {
    // may be in skills/ or connectors/
    const candidates = [
      path.join(SKILLS_DIR, flags.only),
      path.join(CONNECTORS_DIR, flags.only),
    ];
    return candidates.filter((p) => fs.existsSync(path.join(p, "SKILL.md")));
  }

  const targets = [];
  if (!flags.connectorsOnly) targets.push(...listApideckSkills());
  if (!flags.skillsOnly) targets.push(...listConnectors());
  return targets;
}

// ── Tessl runner ───────────────────────────────────────────────────────────

function runTessl(skillPath) {
  const res = spawnSync("npx", ["-y", "tessl", "skill", "review", skillPath], {
    encoding: "utf-8",
    maxBuffer: 20 * 1024 * 1024,
    env: { ...process.env },
  });

  const output = (res.stdout || "") + (res.stderr || "");
  const parsed = parseTesslOutput(output);
  return { output, ...parsed };
}

function parseTesslOutput(output) {
  const overall = output.match(/Review Score: (\d+)%/);
  const validation = output.match(/Overall: (PASSED|FAILED) \((\d+) errors?, (\d+) warnings?\)/);
  const description = output.match(/Description: (\d+)%/);
  const content = output.match(/Content: (\d+)%/);

  return {
    overallScore: overall ? Number(overall[1]) : null,
    validationPassed: validation ? validation[1] === "PASSED" : null,
    validationErrors: validation ? Number(validation[2]) : 0,
    validationWarnings: validation ? Number(validation[3]) : 0,
    descriptionScore: description ? Number(description[1]) : null,
    contentScore: content ? Number(content[1]) : null,
  };
}

// ── Report writer ──────────────────────────────────────────────────────────

function writeReport(skillPath, output) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const name = path.relative(ROOT, skillPath).replace(/\//g, "_");
  const date = new Date().toISOString().slice(0, 10);
  const file = path.join(REPORT_DIR, `${date}__${name}.txt`);
  fs.writeFileSync(file, output);
  return file;
}

// ── Main ───────────────────────────────────────────────────────────────────

function color(score) {
  if (score === null) return `\x1b[90m-\x1b[0m`;
  if (score >= 90) return `\x1b[32m${score}%\x1b[0m`;
  if (score >= 70) return `\x1b[33m${score}%\x1b[0m`;
  return `\x1b[31m${score}%\x1b[0m`;
}

async function main() {
  const targets = selectTargets();

  if (targets.length === 0) {
    console.error("No skills matched the filters.");
    process.exit(1);
  }

  console.log(`\nTessl quality check\n-------------------`);
  console.log(`Targets: ${targets.length}`);
  console.log(`Threshold: ${flags.threshold || "none"}\n`);

  const results = [];
  let failures = 0;

  for (const target of targets) {
    const rel = path.relative(ROOT, target);
    process.stdout.write(`  ${rel.padEnd(50)}`);
    const t0 = Date.now();
    const { output, ...parsed } = runTessl(target);
    const secs = ((Date.now() - t0) / 1000).toFixed(1);

    const line = `${color(parsed.overallScore)} (desc ${color(parsed.descriptionScore)}  content ${color(parsed.contentScore)})  ${secs}s`;
    console.log(line);

    if (parsed.overallScore === null) {
      console.log(`    \x1b[31mFAILED to parse Tessl output for ${rel}\x1b[0m`);
      failures++;
    } else if (flags.threshold && parsed.overallScore < flags.threshold) {
      failures++;
    }

    if (flags.report) {
      const reportFile = writeReport(target, output);
      console.log(`    report: ${path.relative(ROOT, reportFile)}`);
    }

    results.push({ skill: rel, ...parsed });
  }

  // Summary
  const scored = results.filter((r) => r.overallScore !== null);
  const avg =
    scored.length === 0 ? 0 : scored.reduce((a, r) => a + r.overallScore, 0) / scored.length;
  const below70 = scored.filter((r) => r.overallScore < 70).length;
  const at70to89 = scored.filter((r) => r.overallScore >= 70 && r.overallScore < 90).length;
  const at90 = scored.filter((r) => r.overallScore >= 90).length;

  console.log(`\nSummary`);
  console.log(`  Skills evaluated: ${scored.length}`);
  console.log(`  Average score: ${avg.toFixed(1)}%`);
  console.log(`  ≥ 90%: ${at90}   70–89%: ${at70to89}   < 70%: ${below70}`);

  if (flags.threshold) {
    console.log(`  Threshold ${flags.threshold}%: ${failures === 0 ? "\x1b[32mPASSED\x1b[0m" : `\x1b[31mFAILED (${failures} skill(s) below)\x1b[0m`}`);
  }
  console.log();

  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
