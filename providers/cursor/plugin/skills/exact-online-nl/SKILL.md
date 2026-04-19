---
name: exact-online-nl
description: |
  Exact Online NL integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Exact Online NL. Routes through Apideck with serviceId "exact-online-nl".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: exact-online-nl
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "2"
  verified: true
  status: beta
---

# Exact Online NL (via Apideck)

Access Exact Online NL through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to QuickBooks, NetSuite, Sage Intacct and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Exact Online NL plumbing.

> **Beta connector.** Exact Online NL is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `exact-online-nl`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Status:** beta
- **Exact Online NL docs:** https://support.exactonline.com
- **Homepage:** https://www.exact.com/nl

## When to use this skill

Activate this skill when the user explicitly wants to work with **Exact Online NL** — for example, "create an invoice in Exact Online NL" or "reconcile payments in Exact Online NL". This skill teaches the agent:

1. Which Apideck unified API covers Exact Online NL (Accounting)
2. The correct `serviceId` to pass on every call (`exact-online-nl`)
3. Exact Online NL-specific auth and coverage caveats

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

// List invoices in Exact Online NL
const { data } = await apideck.accounting.invoices.list({
  serviceId: "exact-online-nl",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Exact Online NL to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Exact Online NL
await apideck.accounting.invoices.list({ serviceId: "exact-online-nl" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "quickbooks" });
await apideck.accounting.invoices.list({ serviceId: "netsuite" });
```

This is the compounding advantage of using Apideck over integrating Exact Online NL directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Authentication

- **Type:** OAuth 2.0
- **Managed by:** Apideck Vault — Apideck handles the full OAuth dance (authorization code flow, token exchange, refresh). Never ask the user for API keys or tokens directly.
- **User setup:** Users authorize via the Vault modal. Connection state progresses `available → added → authorized → callable`.
- **Token refresh:** automatic. Expired tokens are refreshed transparently on the next API call.

See [`apideck-best-practices`](../../skills/apideck-best-practices/) for Vault setup, connection lifecycle, and handling re-auth flows.

## Verifying coverage

Not every Accounting operation is supported by every connector. Always verify before assuming a method works:

```bash
curl 'https://unify.apideck.com/connector/connectors/exact-online-nl' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}"
```

See [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) for patterns around `UnsupportedOperationError` and connector-specific fallbacks.

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Exact Online NL directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Exact Online NL's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: exact-online-nl" \
  -H "x-apideck-downstream-url: <target endpoint on Exact Online NL>" \
  -H "x-apideck-downstream-method: GET"
```

See [Exact Online NL's API docs](https://support.exactonline.com) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`quickbooks`](../quickbooks/), [`netsuite`](../netsuite/), [`sage-intacct`](../sage-intacct/), [`workday`](../workday/), [`xero`](../xero/), [`exact-online`](../exact-online/), [`freeagent`](../freeagent/) *(beta)*, [`freshbooks`](../freshbooks/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Exact Online NL official docs](https://support.exactonline.com)
