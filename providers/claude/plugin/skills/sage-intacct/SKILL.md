---
name: sage-intacct
description: |
  Sage Intacct integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Sage Intacct. Routes through Apideck with serviceId "sage-intacct".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: sage-intacct
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
---

# Sage Intacct (via Apideck)

Access Sage Intacct through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Sage Intacct plumbing.

## Quick facts

- **Apideck serviceId:** `sage-intacct`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Sage Intacct docs:** https://developer.intacct.com
- **Homepage:** https://www.sageintacct.com/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Sage Intacct** — for example, "create an invoice in Sage Intacct" or "reconcile payments in Sage Intacct". This skill teaches the agent:

1. Which Apideck unified API covers Sage Intacct (Accounting)
2. The correct `serviceId` to pass on every call (`sage-intacct`)
3. Sage Intacct-specific auth and coverage caveats

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

// List invoices in Sage Intacct
const { data } = await apideck.accounting.invoices.list({
  serviceId: "sage-intacct",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Sage Intacct to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Sage Intacct
await apideck.accounting.invoices.list({ serviceId: "sage-intacct" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Sage Intacct directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Sage Intacct via Apideck Accounting

Sage Intacct is a cloud accounting platform for mid-market. Apideck covers core finance entities.

### Entity mapping

| Intacct entity | Apideck Accounting resource |
|---|---|
| AR Invoice | `invoices` |
| AP Bill | `bills` |
| AR Payment / AP Payment | `payments` |
| Journal Entry (GLBATCH) | `journal-entries` |
| GL Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Item | `items` |

### Coverage highlights

- ✅ CRUD on invoices, bills, payments, customers, suppliers, items
- ✅ Multi-entity support (Intacct's Company structure)
- ✅ Multi-currency
- ⚠️ Dimensions (Department, Location, Class, Project) — exposed as custom fields where available
- ❌ Sage Intacct REST (beta) — separate auth-only connector; use standard XML connector via Apideck

### Auth

- **Type:** Basic auth (username / password + company ID) — managed by Apideck Vault
- **Session tokens:** Intacct uses session-based auth under the hood. Apideck handles session lifecycle automatically.
- **Sender credentials:** Apideck's Vault app has the required Sender ID/password; end-user only needs to provide their own login.

### Example: list invoices posted in last month

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "sage-intacct",
  filter: { updated_since: "2026-03-01T00:00:00Z" },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Sage Intacct directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Sage Intacct's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: sage-intacct" \
  -H "x-apideck-downstream-url: <target endpoint on Sage Intacct>" \
  -H "x-apideck-downstream-method: GET"
```

See [Sage Intacct's API docs](https://developer.intacct.com) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Sage Intacct official docs](https://developer.intacct.com)
