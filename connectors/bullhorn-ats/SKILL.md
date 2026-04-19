---
name: bullhorn-ats
description: |
  Bullhorn ATS integration via Apideck's ATS unified API — same methods work across every connector in ATS, switch by changing `serviceId`. Use when the user wants to read, write, or sync jobs, applicants, and applications in Bullhorn ATS. Routes through Apideck with serviceId "bullhorn-ats".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: bullhorn-ats
  unifiedApis: ["ats"]
  authType: oauth2
  tier: "1c"
  verified: true
  status: beta
---

# Bullhorn ATS (via Apideck)

Access Bullhorn ATS through Apideck's **ATS** unified API — one of 11 ATS connectors that share the same method surface. Code you write here ports to Greenhouse, Lever, Workable and 7 other ATS connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Bullhorn ATS plumbing.

> **Beta connector.** Bullhorn ATS is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `bullhorn-ats`
- **Unified API:** ATS
- **Auth type:** oauth2
- **Status:** beta
- **Bullhorn ATS docs:** https://bullhorn.github.io/rest-api-docs/
- **Homepage:** https://www.bullhorn.com/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Bullhorn ATS** — for example, "list open jobs in Bullhorn ATS" or "move an applicant through stages in Bullhorn ATS". This skill teaches the agent:

1. Which Apideck unified API covers Bullhorn ATS (ATS)
2. The correct `serviceId` to pass on every call (`bullhorn-ats`)
3. Bullhorn ATS-specific auth and coverage caveats

For the full method surface (parameters, pagination, filtering), use your language SDK skill:

- [`apideck-node`](../../skills/apideck-node/), [`apideck-python`](../../skills/apideck-python/), [`apideck-dotnet`](../../skills/apideck-dotnet/), [`apideck-java`](../../skills/apideck-java/), [`apideck-go`](../../skills/apideck-go/), [`apideck-php`](../../skills/apideck-php/), or [`apideck-rest`](../../skills/apideck-rest/)

For the raw OpenAPI spec:

- **ATS:** [https://specs.apideck.com/ats.yml](https://specs.apideck.com/ats.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=ats)

## Minimal example (TypeScript)

```typescript
import { Apideck } from "@apideck/unify";

const apideck = new Apideck({
  apiKey: process.env.APIDECK_API_KEY,
  appId: process.env.APIDECK_APP_ID,
  consumerId: "your-consumer-id",
});

// List applicants in Bullhorn ATS
const { data } = await apideck.ats.applicants.list({
  serviceId: "bullhorn-ats",
});
```

## Portable across 11 ATS connectors

The Apideck **ATS** unified API exposes the same methods for every connector in its catalog. Switching from Bullhorn ATS to another ATS connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Bullhorn ATS
await apideck.ats.applicants.list({ serviceId: "bullhorn-ats" });

// Tomorrow — same code, different connector
await apideck.ats.applicants.list({ serviceId: "greenhouse" });
await apideck.ats.applicants.list({ serviceId: "lever" });
```

This is the compounding advantage of using Apideck over integrating Bullhorn ATS directly: code against the unified ATS API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Authentication

- **Type:** OAuth 2.0
- **Managed by:** Apideck Vault — Apideck handles the full OAuth dance (authorization code flow, token exchange, refresh). Never ask the user for API keys or tokens directly.
- **User setup:** Users authorize via the Vault modal. Connection state progresses `available → added → authorized → callable`.
- **Token refresh:** automatic. Expired tokens are refreshed transparently on the next API call.

See [`apideck-best-practices`](../../skills/apideck-best-practices/) for Vault setup, connection lifecycle, and handling re-auth flows.

## Verifying coverage

Not every ATS operation is supported by every connector. Always verify before assuming a method works:

```bash
curl 'https://unify.apideck.com/connector/connectors/bullhorn-ats' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}"
```

See [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) for patterns around `UnsupportedOperationError` and connector-specific fallbacks.

## Escape hatch: Proxy API

When an endpoint isn't covered by the ATS unified API, use Apideck's Proxy to call Bullhorn ATS directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Bullhorn ATS's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: bullhorn-ats" \
  -H "x-apideck-downstream-url: <target endpoint on Bullhorn ATS>" \
  -H "x-apideck-downstream-method: GET"
```

See [Bullhorn ATS's API docs](https://bullhorn.github.io/rest-api-docs/) for available endpoints.

## Sibling connectors

Other **ATS** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`greenhouse`](../greenhouse/), [`lever`](../lever/), [`workable`](../workable/) *(beta)*, [`workday`](../workday/), [`teamtailor`](../teamtailor/) *(beta)*, [`freshteam`](../freshteam/), [`jobadder`](../jobadder/) *(beta)*, [`recruitee`](../recruitee/), and 2 more.

## See also

- [ATS OpenAPI spec](https://specs.apideck.com/ats.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=ats)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Bullhorn ATS official docs](https://bullhorn.github.io/rest-api-docs/)
