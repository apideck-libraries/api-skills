# Apideck API Skills

[![Tessl Review Score](https://img.shields.io/badge/Tessl%20Review-85%25-yellow?labelColor=0f172a)](https://tessl.io/registry/skills/submit)
[![Connectors](https://img.shields.io/badge/connectors-146-blue)](connectors/manifest.json)
[![Unified APIs](https://img.shields.io/badge/unified%20APIs-7-blue)](#connector-skills)
[![License](https://img.shields.io/badge/license-Apache--2.0-green)](LICENSE)

**One abstraction, 146+ SaaS connectors.** AI agent skills for the [Apideck](https://apideck.com) Unified API — integrate Salesforce, HubSpot, QuickBooks, Xero, BambooHR, Workday, Greenhouse, SharePoint, Jira, Shopify, and 130+ more apps through a single method set. Switch connectors by changing one string; don't rewrite per vendor.

```typescript
// One codebase, any CRM
await apideck.crm.contacts.list({ serviceId: "salesforce" });
await apideck.crm.contacts.list({ serviceId: "hubspot" });
await apideck.crm.contacts.list({ serviceId: "pipedrive" });
```

Same pattern for accounting (34 connectors), HRIS (58), ATS (11), file storage (5), issue tracking (6), ecommerce (17). New connectors Apideck adds become available without code changes — this is the compounding advantage.

## Start here

```bash
# The front-door meta-skill — teaches the unified-API model
npx skills add apideck/api-skills --skill apideck-unified-api
```

[`apideck-unified-api`](skills/apideck-unified-api/) is the catalog's introduction. Install it alongside any connector or SDK skill to give your agent the routing model upfront.

**Test-drive with the 30-day free trial.** [Sign up at apideck.com](https://apideck.com) — no credit card required. Agents and developers can explore all unified APIs, connect to downstream services via Vault, and validate coverage before any commitment. This is the friction-free path to evaluate whether Apideck fits your use case.

## Installation

Install a skill for your language:

```bash
# TypeScript / Node.js
npx skills add apideck/api-skills --skill apideck-node

# Python
npx skills add apideck/api-skills --skill apideck-python

# C# / .NET
npx skills add apideck/api-skills --skill apideck-dotnet

# Java
npx skills add apideck/api-skills --skill apideck-java

# Go
npx skills add apideck/api-skills --skill apideck-go

# PHP
npx skills add apideck/api-skills --skill apideck-php

# REST API (any language)
npx skills add apideck/api-skills --skill apideck-rest

# Best practices (recommended with any SDK skill)
npx skills add apideck/api-skills --skill apideck-best-practices

# API contract testing
npx skills add apideck/api-skills --skill apideck-portman

# Code generation from OpenAPI specs
npx skills add apideck/api-skills --skill apideck-codegen

# Connector coverage checking
npx skills add apideck/api-skills --skill apideck-connector-coverage

# Migration from direct integrations
npx skills add apideck/api-skills --skill apideck-migration
```

Add `--global` to install globally across all projects.

## Skills

Every skill in the catalog lives under `skills/` — the canonical path scanned by the `skills` CLI. Two naming conventions coexist there:

- **`skills/apideck-*`** — Apideck-specific API abstractions and SDK patterns (`apideck-node`, `apideck-unified-api`, `apideck-best-practices`, etc.)
- **`skills/<bare-slug>`** — per-connector routing skills (`salesforce`, `quickbooks`, `sharepoint`, etc.). Generated from `connectors/manifest.json` by `node connectors/generate.js`; do not hand-edit.

The `connectors/` directory holds the tooling that generates connector skills (`manifest.json`, `generate.js`, `validate.js`, `_enhancements/`) — no SKILL.md output lives there.

### SDK Skills

| Skill | Language | Package |
|-------|----------|---------|
| [apideck-node](skills/apideck-node/) | TypeScript / Node.js | `@apideck/unify` |
| [apideck-python](skills/apideck-python/) | Python | `apideck-unify` |
| [apideck-dotnet](skills/apideck-dotnet/) | C# / .NET | `ApideckUnifySdk` |
| [apideck-java](skills/apideck-java/) | Java | `com.apideck:unify` |
| [apideck-go](skills/apideck-go/) | Go | `github.com/apideck-libraries/sdk-go` |
| [apideck-php](skills/apideck-php/) | PHP | `apideck-libraries/sdk-php` |
| [apideck-rest](skills/apideck-rest/) | Any (HTTP) | Direct REST API calls |

### Meta & Integration Skills

| Skill | Description |
|-------|-------------|
| [apideck-unified-api](skills/apideck-unified-api/) | **Start here.** Front-door skill teaching the unified-API model, routing to connector / SDK skills |
| [apideck-best-practices](skills/apideck-best-practices/) | Architecture patterns, authentication, pagination, error handling, Vault, webhooks, and common pitfalls |
| [apideck-portman](skills/apideck-portman/) | API contract testing with Portman — generate Postman collections with tests from OpenAPI specs |
| [apideck-codegen](skills/apideck-codegen/) | Generate typed clients from OpenAPI specs using openapi-generator, Speakeasy, or Postman import |
| [apideck-connector-coverage](skills/apideck-connector-coverage/) | Check connector API coverage before building — verify which operations each connector supports |
| [apideck-migration](skills/apideck-migration/) | Migrate from direct Salesforce/HubSpot/QuickBooks/Xero integrations to Apideck's unified layer |

### Connector Skills

Per-connector skills for the top apps across seven unified APIs: Ecommerce, Accounting, CRM, ATS, File Storage, Issue Tracking, HRIS. Auth-only connectors are excluded.

**Tier 1a — hand-authored depth** (entity mapping, coverage ✅/❌, auth gotchas, 2–3 worked examples):

| Connector | Unified API |
|---|---|
| [salesforce](skills/salesforce/) | CRM |
| [quickbooks](skills/quickbooks/) | Accounting |
| [bamboohr](skills/bamboohr/) | HRIS |
| [greenhouse](skills/greenhouse/) | ATS |
| [sharepoint](skills/sharepoint/) | File Storage |
| [jira](skills/jira/) | Issue Tracking |
| [shopify](skills/shopify/) | Ecommerce |

**Tier 1b — abbreviated depth** (21 connectors): HubSpot, Pipedrive, Zoho CRM, Xero, NetSuite, Sage Intacct, Workable, Lever, Google Drive, OneDrive, Dropbox, Box, GitHub, GitLab, Linear, BigCommerce, WooCommerce, Shopify Public App, Personio, Workday, Deel, HiBob.

**Tier 1c + Tier 2 — baseline routing skills** (~107 connectors): every live connector in scope gets a minimal routing skill (serviceId, unified API, Proxy escape hatch). See [`connectors/manifest.json`](connectors/manifest.json) for the full list and tier assignment.

**Installation:**

```bash
# Install a specific connector skill
npx skills add apideck/api-skills --skill salesforce
npx skills add apideck/api-skills --skill sharepoint

# Or install the full catalog (all connectors)
npx skills add apideck/api-skills
```

**Authoring workflow:**

Connector skills are generated from [`connectors/manifest.json`](connectors/manifest.json) and optional per-connector enhancement files in `connectors/_enhancements/`. Generator output lands at `skills/{slug}/` alongside the apideck-* skills — do not hand-edit those files, regenerate instead:

```bash
node connectors/generate.js          # regenerate all into skills/
node connectors/generate.js --only=salesforce
node connectors/generate.js --tier=1a

node connectors/validate.js          # lint skills/ connector entries against manifest
```

## IDE Plugins

Pre-configured plugins with skills and slash commands:

| Provider | Path |
|----------|------|
| Claude Code | [providers/claude/plugin/](providers/claude/plugin/) |
| Cursor | [providers/cursor/plugin/](providers/cursor/plugin/) |

### Slash Commands

| Command | Description |
|---------|-------------|
| `/test-connection` | Verify an Apideck connection works by making a test API call |
| `/list-connectors` | Show available connectors and their capabilities for a unified API |
| `/portman-init` | Generate a Portman config for API contract testing against an Apideck spec |

## Testing

Two levels of quality checks.

### 1. Structural validation (fast, deterministic)

```bash
node skills/test.js                 # Validate apideck-* skills
node skills/test.js --check-links   # Also verify external URLs
node connectors/validate.js         # Validate connector catalog against manifest
```

Checks frontmatter, metadata, code blocks, links, SDK content consistency, provider sync status, serviceId/manifest consistency.

### 2. Tessl quality review (slow, LLM-as-judge)

[Tessl](https://tessl.io) scores skills on validation + description quality + content quality using the [agentskills.io spec](https://agentskills.io/specification). Scores:

- **≥ 90%** — conforms to best practices
- **70–89%** — good, minor improvements needed
- **< 70%** — needs work

Run against a sample or the full catalog:

```bash
node scripts/tessl-check.js                       # Tier 1a sample (fast baseline)
node scripts/tessl-check.js --tier=1b             # Tier 1b connectors
node scripts/tessl-check.js --only=salesforce     # One skill
node scripts/tessl-check.js --all                 # Full catalog (slow)
node scripts/tessl-check.js --threshold=70        # Exit non-zero if any skill < 70%
node scripts/tessl-check.js --report              # Save full reports to .planning/tessl-reports/
```

Current baseline (Tier 1a + meta/SDK skills, 20 skills): **85% average**, every skill in the 70–89% "good" band.

Tessl uses LLMs for parts of its evaluation, so `--all` against 158 skills takes a while and may cost real tokens on your account. Default mode (Tier 1a sample) runs in ~5 min.

## Skill Sync

Skills are synced to provider plugin directories using the sync script:

```bash
node skills/sync.js              # Sync all (fetch spec info + copy skills)
node skills/sync.js --skills-only  # Only sync skills to provider dirs
node skills/sync.js --specs-only   # Only fetch OpenAPI spec info
```

## LLM Integration

This repository includes [`llms.txt`](llms.txt) following the emerging standard for making content accessible to LLMs. It provides a curated index of all Apideck documentation, API references, SDKs, and developer tools with integration guidelines.

## Prerequisites

Set your API key as an environment variable:

```bash
export APIDECK_API_KEY="your-api-key"
```

You also need your **App ID** and **Consumer ID** from the [Apideck dashboard](https://app.apideck.com).

## What's Covered

- **Accounting API** - Invoices, bills, payments, ledger accounts, journal entries, tax rates, reports
- **CRM API** - Contacts, companies, leads, opportunities, activities, pipelines
- **HRIS API** - Employees, departments, payrolls, time-off requests
- **File Storage API** - Files, folders, drives, shared links, upload sessions
- **ATS API** - Jobs, applicants, applications
- **Vault API** - Connection management, OAuth flows, custom field mapping
- **Vault JS** - Embeddable modal UI for user-managed integrations
- **Webhook API** - Event subscriptions and real-time notifications
- **Portman** - API contract testing from OpenAPI specs

## Developer Tools

- [API Explorer](https://developers.apideck.com/api-explorer) - Test endpoints in the browser with a JWT token
- [OpenAPI Specs](https://specs.apideck.com) - Machine-readable specs for all unified APIs
- [Portman](https://github.com/apideck-libraries/portman) - API contract testing from OpenAPI specs

## License

Apache-2.0
