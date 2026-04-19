---
name: procountor-fi
description: |
  Procountor integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Procountor. Routes through Apideck with serviceId "procountor-fi".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: procountor-fi
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "2"
  verified: true
---

# Procountor (via Apideck)

Access Procountor through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to QuickBooks, NetSuite, Sage Intacct and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Procountor plumbing.

## Quick facts

- **Apideck serviceId:** `procountor-fi`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Procountor docs:** https://dev.procountor.com
- **Homepage:** https://procountor.fi/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Procountor** — for example, "create an invoice in Procountor" or "reconcile payments in Procountor". This skill teaches the agent:

1. Which Apideck unified API covers Procountor (Accounting)
2. The correct `serviceId` to pass on every call (`procountor-fi`)
3. Procountor-specific auth and coverage caveats

For the full method surface (parameters, pagination, filtering), use your language SDK skill:

- [`apideck-node`](../../skills/apideck-node/), [`apideck-python`](../../skills/apideck-python/), [`apideck-dotnet`](../../skills/apideck-dotnet/), [`apideck-java`](../../skills/apideck-java/), [`apideck-go`](../../skills/apideck-go/), [`apideck-php`](../../skills/apideck-php/), or [`apideck-rest`](../../skills/apideck-rest/)

For the raw OpenAPI spec:

- **Accounting:** [https://specs.apideck.com/accounting.yml](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)

## Minimal example (TypeScript)

```typescript
import { Apideck } from "@apideck/unify";

const apideck = new Apideck({
  apiKey: process.env.APIDECK_API_KEY,
  appId: process.env.APIDECK_APP_ID,
  consumerId: "your-consumer-id",
});

// List invoices in Procountor
const { data } = await apideck.accounting.invoices.list({
  serviceId: "procountor-fi",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Procountor to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Procountor
await apideck.accounting.invoices.list({ serviceId: "procountor-fi" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "quickbooks" });
await apideck.accounting.invoices.list({ serviceId: "netsuite" });
```

This is the compounding advantage of using Apideck over integrating Procountor directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Authentication

- **Type:** OAuth 2.0
- **Managed by:** Apideck Vault — Apideck handles the full OAuth dance (authorization code flow, token exchange, refresh). Never ask the user for API keys or tokens directly.
- **User setup:** Users authorize via the Vault modal. Connection state progresses `available → added → authorized → callable`.
- **Token refresh:** automatic. Expired tokens are refreshed transparently on the next API call.

See [`apideck-best-practices`](../../skills/apideck-best-practices/) for Vault setup, connection lifecycle, and handling re-auth flows.

## Verifying coverage

Not every Accounting operation is supported by every connector. Always verify before assuming a method works:

```bash
curl 'https://unify.apideck.com/connector/connectors/procountor-fi' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}"
```

See [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) for patterns around `UnsupportedOperationError` and connector-specific fallbacks.

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Procountor directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Procountor's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: procountor-fi" \
  -H "x-apideck-downstream-url: <target endpoint on Procountor>" \
  -H "x-apideck-downstream-method: GET"
```

See [Procountor's API docs](https://dev.procountor.com) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`quickbooks`](../quickbooks/), [`netsuite`](../netsuite/), [`sage-intacct`](../sage-intacct/), [`workday`](../workday/), [`xero`](../xero/), [`exact-online`](../exact-online/), [`freeagent`](../freeagent/) *(beta)*, [`freshbooks`](../freshbooks/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Procountor official docs](https://dev.procountor.com)
