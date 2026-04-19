---
name: linear-multiworkspace
description: |
  Linear Multiworkspace integration via Apideck's Issue Tracking unified API — same methods work across every connector in Issue Tracking, switch by changing `serviceId`. Use when the user wants to read, write, or comment on tickets and issues in Linear Multiworkspace. Routes through Apideck with serviceId "linear-multiworkspace".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: linear-multiworkspace
  unifiedApis: ["issue-tracking"]
  authType: apiKey
  tier: "2"
  verified: true
  status: beta
---

# Linear Multiworkspace (via Apideck)

Access Linear Multiworkspace through Apideck's **Issue Tracking** unified API — one of 6 Issue Tracking connectors that share the same method surface. Code you write here ports to Jira, GitHub, GitLab and 2 other Issue Tracking connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Linear Multiworkspace plumbing.

> **Beta connector.** Linear Multiworkspace is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `linear-multiworkspace`
- **Unified API:** Issue Tracking
- **Auth type:** apiKey
- **Status:** beta
- **Apideck setup guide:** [Connection guide](https://developers.apideck.com/connectors/linear-multiworkspace/docs/consumer+connection)
- **Linear Multiworkspace docs:** https://developers.linear.app
- **Homepage:** https://linear.app/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Linear Multiworkspace** — for example, "create a ticket in Linear Multiworkspace" or "comment on an issue in Linear Multiworkspace". This skill teaches the agent:

1. Which Apideck unified API covers Linear Multiworkspace (Issue Tracking)
2. The correct `serviceId` to pass on every call (`linear-multiworkspace`)
3. Linear Multiworkspace-specific auth and coverage caveats

For the full method surface (parameters, pagination, filtering), use your language SDK skill:

- [`apideck-node`](../../skills/apideck-node/), [`apideck-python`](../../skills/apideck-python/), [`apideck-dotnet`](../../skills/apideck-dotnet/), [`apideck-java`](../../skills/apideck-java/), [`apideck-go`](../../skills/apideck-go/), [`apideck-php`](../../skills/apideck-php/), or [`apideck-rest`](../../skills/apideck-rest/)

For the raw OpenAPI spec:

- **Issue Tracking:** [https://specs.apideck.com/issue-tracking.yml](https://specs.apideck.com/issue-tracking.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=issue-tracking)

## Minimal example (TypeScript)

```typescript
import { Apideck } from "@apideck/unify";

const apideck = new Apideck({
  apiKey: process.env.APIDECK_API_KEY,
  appId: process.env.APIDECK_APP_ID,
  consumerId: "your-consumer-id",
});

// List tickets in Linear Multiworkspace
const { data } = await apideck.issueTracking.tickets.list({
  serviceId: "linear-multiworkspace",
});
```

## Portable across 6 Issue Tracking connectors

The Apideck **Issue Tracking** unified API exposes the same methods for every connector in its catalog. Switching from Linear Multiworkspace to another Issue Tracking connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Linear Multiworkspace
await apideck.issueTracking.tickets.list({ serviceId: "linear-multiworkspace" });

// Tomorrow — same code, different connector
await apideck.issueTracking.tickets.list({ serviceId: "jira" });
await apideck.issueTracking.tickets.list({ serviceId: "github" });
```

This is the compounding advantage of using Apideck over integrating Linear Multiworkspace directly: code against the unified Issue Tracking API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Authentication

- **Type:** API Key
- **Managed by:** Apideck Vault — the user pastes their Linear Multiworkspace API key into the Vault modal; Apideck stores it encrypted and injects it on every request.
- **Rotation:** if the user rotates their key, they re-enter it in Vault. No code changes needed.

**Setup guide:** Apideck publishes a step-by-step guide for registering an OAuth app / configuring credentials for Linear Multiworkspace — see [https://developers.apideck.com/connectors/linear-multiworkspace/docs/consumer+connection](https://developers.apideck.com/connectors/linear-multiworkspace/docs/consumer+connection). Use that as the authoritative source when walking users through connection setup.

See [`apideck-best-practices`](../../skills/apideck-best-practices/) for Vault setup, connection lifecycle, and handling re-auth flows.

## Verifying coverage

Not every Issue Tracking operation is supported by every connector. Always verify before assuming a method works:

```bash
curl 'https://unify.apideck.com/connector/connectors/linear-multiworkspace' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}"
```

See [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) for patterns around `UnsupportedOperationError` and connector-specific fallbacks.

## Escape hatch: Proxy API

When an endpoint isn't covered by the Issue Tracking unified API, use Apideck's Proxy to call Linear Multiworkspace directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Linear Multiworkspace's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: linear-multiworkspace" \
  -H "x-apideck-downstream-url: <target endpoint on Linear Multiworkspace>" \
  -H "x-apideck-downstream-method: GET"
```

See [Linear Multiworkspace's API docs](https://developers.linear.app) for available endpoints.

## Sibling connectors

Other **Issue Tracking** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`jira`](../jira/) *(beta)*, [`github`](../github/) *(beta)*, [`gitlab`](../gitlab/) *(beta)*, [`linear`](../linear/) *(beta)*, [`gitlab-server`](../gitlab-server/) *(beta)*.

## See also

- [Apideck connection guide for Linear Multiworkspace](https://developers.apideck.com/connectors/linear-multiworkspace/docs/consumer+connection)
- [Issue Tracking OpenAPI spec](https://specs.apideck.com/issue-tracking.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=issue-tracking)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Linear Multiworkspace official docs](https://developers.linear.app)
