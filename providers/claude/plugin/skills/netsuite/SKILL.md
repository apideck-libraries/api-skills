---
name: netsuite
description: |
  NetSuite integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in NetSuite. Routes through Apideck with serviceId "netsuite".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: netsuite
  unifiedApis: ["accounting"]
  authType: custom
  tier: "1a"
  verified: true
---

# NetSuite (via Apideck)

Access NetSuite through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant NetSuite plumbing.

## Quick facts

- **Apideck serviceId:** `netsuite`
- **Unified API:** Accounting
- **Auth type:** custom
- **Apideck setup guide:** [Connection guide](https://developers.apideck.com/connectors/netsuite/docs/consumer+connection)
- **Gotchas:** [page](https://developers.apideck.com/apis/accounting/netsuite/gotchas)
- **NetSuite docs:** https://docs.oracle.com/en/cloud/saas/netsuite/
- **Homepage:** https://netsuite.com

## When to use this skill

Activate this skill when the user explicitly wants to work with **NetSuite** — for example, "create an invoice in NetSuite" or "reconcile payments in NetSuite". This skill teaches the agent:

1. Which Apideck unified API covers NetSuite (Accounting)
2. The correct `serviceId` to pass on every call (`netsuite`)
3. NetSuite-specific auth and coverage caveats

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

// List invoices in NetSuite
const { data } = await apideck.accounting.invoices.list({
  serviceId: "netsuite",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from NetSuite to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — NetSuite
await apideck.accounting.invoices.list({ serviceId: "netsuite" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating NetSuite directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## NetSuite via Apideck Accounting

NetSuite is Oracle's enterprise ERP. Apideck abstracts the SuiteTalk REST API; deep coverage for finance operations but less for NetSuite's broader ERP surface.

### Entity mapping

| NetSuite record | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Vendor Bill | `bills` |
| Customer Payment / Vendor Payment | `payments` |
| Journal Entry | `journal-entries` |
| Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Item | `items` |
| Purchase Order | `purchase-orders` |
| Subsidiary | `subsidiaries` |

### Coverage highlights

- ✅ CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries (posting + drafts)
- ✅ Multi-subsidiary and multi-currency (OneWorld editions)
- ✅ Purchase orders
- ⚠️ Custom records and custom fields — exposed via `custom_fields[]`; custom records need Proxy
- ❌ SuiteScript, SuiteFlow — out of scope; use Proxy for advanced operations

### Auth

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Account binding:** each connection is bound to one NetSuite account ID. Sandbox accounts have a distinct suffix (e.g. `TSTDRV`) — the user picks the right one during OAuth.
- **Role selection:** NetSuite auth ties to a specific user + role. The role's permissions determine which records are readable/writable. Admin roles are required for broadest coverage — limited roles will 403 on restricted operations.

### Example: list open invoices with multi-subsidiary filter

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "netsuite",
  filter: { status: "open", subsidiary_id: "1" },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call NetSuite directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on NetSuite's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: netsuite" \
  -H "x-apideck-downstream-url: <target endpoint on NetSuite>" \
  -H "x-apideck-downstream-method: GET"
```

See [NetSuite's API docs](https://docs.oracle.com/en/cloud/saas/netsuite/) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Apideck connection guide for NetSuite](https://developers.apideck.com/connectors/netsuite/docs/consumer+connection)
- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [NetSuite official docs](https://docs.oracle.com/en/cloud/saas/netsuite/)
