# Apideck API Skills

AI coding agent skills for the [Apideck](https://apideck.com) Unified API.

These skills teach your AI agent SDK patterns, available methods, authentication setup, best practices, and API testing for integrating with 200+ connectors through Apideck's unified APIs.

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

### Integration Skills

| Skill | Description |
|-------|-------------|
| [apideck-best-practices](skills/apideck-best-practices/) | Architecture patterns, authentication, pagination, error handling, Vault, webhooks, and common pitfalls |
| [apideck-portman](skills/apideck-portman/) | API contract testing with Portman — generate Postman collections with tests from OpenAPI specs |
| [apideck-codegen](skills/apideck-codegen/) | Generate typed clients from OpenAPI specs using openapi-generator, Speakeasy, or Postman import |
| [apideck-connector-coverage](skills/apideck-connector-coverage/) | Check connector API coverage before building — verify which operations each connector supports |
| [apideck-migration](skills/apideck-migration/) | Migrate from direct Salesforce/HubSpot/QuickBooks/Xero integrations to Apideck's unified layer |

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
