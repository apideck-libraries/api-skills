---
name: clearbooks-uk
description: |
  Clear Books integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Clear Books. Routes through Apideck with serviceId "clearbooks-uk".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: clearbooks-uk
  unifiedApis: ["accounting"]
  authType: apiKey
  tier: "1a"
  verified: true
  status: beta
---

# Clear Books (via Apideck)

Access Clear Books through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Clear Books plumbing.

> **Beta connector.** Clear Books is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `clearbooks-uk`
- **Unified API:** Accounting
- **Auth type:** apiKey
- **Status:** beta
- **Gotchas:** [page](https://developers.apideck.com/apis/accounting/clearbooks-uk/gotchas)
- **Clear Books docs:** https://www.clearbooks.co.uk/support/api/
- **Homepage:** https://www.clearbooks.co.uk/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Clear Books** — for example, "create an invoice in Clear Books" or "reconcile payments in Clear Books". This skill teaches the agent:

1. Which Apideck unified API covers Clear Books (Accounting)
2. The correct `serviceId` to pass on every call (`clearbooks-uk`)
3. Clear Books-specific auth and coverage caveats

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

// List invoices in Clear Books
const { data } = await apideck.accounting.invoices.list({
  serviceId: "clearbooks-uk",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Clear Books to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Clear Books
await apideck.accounting.invoices.list({ serviceId: "clearbooks-uk" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Clear Books directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Clear Books via Apideck Accounting

Clear Books is a UK SMB cloud accounting platform with a focus on simplicity for small businesses, contractors, and accountants.

### Entity mapping

| Clear Books entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Purchase Invoice / Bill | `bills` |
| Credit Note | `credit-notes` |
| Customer | `customers` |
| Supplier | `suppliers` |
| Account Code | `ledger-accounts` |

### Coverage highlights

- ✅ Sales invoices (CRUD)
- ✅ Bills
- ✅ Credit notes
- ✅ Customers, suppliers
- ✅ Chart of accounts
- ⚠️ Payments, journal entries — not in current coverage; use Proxy
- ❌ UK VAT return / MTD submission — use Proxy
- ❌ Payroll — separate product

### Auth notes

- **Type:** API key, managed by Apideck Vault
- **Business binding:** one Clear Books business per connection.
- **UK-only:** Clear Books is UK-market. Multi-regional customers typically use a different platform.

### Example: list unpaid bills

```typescript
const { data } = await apideck.accounting.bills.list({
  serviceId: "clearbooks-uk",
  filter: { status: "open" },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Clear Books directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Clear Books's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: clearbooks-uk" \
  -H "x-apideck-downstream-url: <target endpoint on Clear Books>" \
  -H "x-apideck-downstream-method: GET"
```

See [Clear Books's API docs](https://www.clearbooks.co.uk/support/api/) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), [`exact-online-nl`](../exact-online-nl/) *(beta)*, and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Clear Books official docs](https://www.clearbooks.co.uk/support/api/)
