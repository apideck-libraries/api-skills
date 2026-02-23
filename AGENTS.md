# Agent Guidelines for Apideck API Skills

This repository contains AI agent skills for the Apideck Unified API. Follow these guidelines when contributing or modifying skills.

## Repository Structure

```
skills/{skill-name}/
  SKILL.md              # Required: Agent instructions with YAML frontmatter
  metadata.json         # Required: Version, references, organization metadata
  references/           # Optional: Detailed reference docs (loaded on demand)
  scripts/              # Optional: Executable scripts
```

Provider mirrors (auto-generated via `node skills/sync.js`):
```
providers/{claude,cursor}/plugin/
  skills/               # Mirror of skills/ (do not edit directly)
  commands/             # Slash commands
  .{provider}-plugin/   # Plugin configuration
```

## Skill Authoring Rules

### SKILL.md Requirements

- **Frontmatter** must include: `name`, `description`, `license`, `alwaysApply`, `metadata` (with `author` and `version`)
- **`name`** must be kebab-case, match the directory name, and start with `apideck-`
- **`description`** must include trigger phrases — words/phrases that help agents decide when to activate the skill
- **`alwaysApply`** should be `false` for all skills (loaded only when contextually relevant)
- **SKILL.md body** should stay under 500 lines. Move detailed content to `references/` files
- **Code examples** must use real Apideck SDK patterns with correct method signatures
- **Doc links** should point to `https://developers.apideck.com/` for official docs

### Progressive Disclosure (Context Efficiency)

Skills are loaded in tiers to minimize context window usage:

1. **Metadata** (~100 tokens): `name` and `description` from frontmatter — loaded at startup for ALL installed skills
2. **Instructions** (< 5000 tokens): Full SKILL.md body — loaded when skill is activated
3. **References** (as needed): Files in `references/` — loaded only when agent needs specific details

Keep SKILL.md as a quick reference / index. Put detailed API endpoint docs, migration tables, and configuration references in separate files.

### metadata.json Format

```json
{
  "version": "1.0.0",
  "organization": "Apideck",
  "date": "February 2026",
  "abstract": "Brief description of the skill's purpose",
  "references": [
    "https://developers.apideck.com",
    "https://apideck.com"
  ]
}
```

### Important Conventions

- All SDKs follow the same CRUD pattern: `client.{api}.{resource}.{operation}()`
- Authentication always requires: `apiKey`, `appId`, `consumerId`
- `serviceId` specifies the downstream connector (e.g., `salesforce`, `quickbooks`)
- Base URL is always `https://unify.apideck.com`
- OpenAPI specs are at `https://specs.apideck.com/{api-name}.yml`
- API Explorer URL format: `https://developers.apideck.com/api-explorer?id={api}`
- Never hardcode API keys in examples — use environment variables
- Connector count is 200+

## Sync Workflow

After modifying skills, run the sync script to update provider directories:

```bash
node skills/sync.js --skills-only
```

This copies all skills and commands to `providers/claude/plugin/` and `providers/cursor/plugin/`.

## Adding a New Skill

1. Create `skills/apideck-{name}/SKILL.md` with proper frontmatter
2. Create `skills/apideck-{name}/metadata.json`
3. Add references in `skills/apideck-{name}/references/` if needed
4. Run `node skills/sync.js --skills-only` to sync to providers
5. Update `README.md` with the new skill
6. Update `llms.txt` if the skill covers a new API or tool

## Validation Checklist

- [ ] `name` field matches directory name
- [ ] `name` is kebab-case with `apideck-` prefix
- [ ] `description` includes trigger phrases for agent matching
- [ ] `alwaysApply: false` is set
- [ ] `metadata.json` exists with version and references
- [ ] SKILL.md is under 500 lines
- [ ] Code examples use correct SDK patterns
- [ ] No hardcoded API keys in examples
- [ ] Provider mirrors are up to date (`node skills/sync.js --skills-only`)
