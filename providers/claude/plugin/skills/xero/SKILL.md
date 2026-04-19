---
name: xero
description: |
  Xero integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Xero. Routes through Apideck with serviceId "xero".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: xero
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
---

# Xero (via Apideck)

Access Xero through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Xero plumbing.

## Quick facts

- **Apideck serviceId:** `xero`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Xero docs:** https://developer.xero.com
- **Homepage:** https://www.xero.com/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Xero** — for example, "create an invoice in Xero" or "reconcile payments in Xero". This skill teaches the agent:

1. Which Apideck unified API covers Xero (Accounting)
2. The correct `serviceId` to pass on every call (`xero`)
3. Xero-specific auth and coverage caveats

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

// List invoices in Xero
const { data } = await apideck.accounting.invoices.list({
  serviceId: "xero",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Xero to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Xero
await apideck.accounting.invoices.list({ serviceId: "xero" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Xero directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Xero via Apideck Accounting

Xero is a widely-used cloud accounting platform, strong in UK/AU/NZ markets. Apideck covers the core financial entities.

### Entity mapping

| Xero entity | Apideck Accounting resource |
|---|---|
| Invoice (ACCREC) | `invoices` |
| Bill (ACCPAY) | `bills` |
| Payment | `payments` |
| Manual Journal | `journal-entries` |
| Account (chart of accounts) | `ledger-accounts` |
| Contact (customer or supplier) | `customers` / `suppliers` |
| Item | `items` |
| TaxRate | `tax-rates` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Manual journals
- ✅ Financial reports (P&L, Balance Sheet, Aged Receivables/Payables)
- ✅ Multi-currency on invoices/bills
- ⚠️ Tracking categories / cost centers — surfaced as custom fields
- ❌ Payroll — separate Xero Payroll API; use Proxy

### Auth

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Tenant selection:** Xero users can belong to multiple organizations. OAuth returns the chosen `tenantId`; one Apideck connection = one Xero org.
- **API limits:** Xero enforces daily and minute-level limits per tenant. Apideck backs off on 429.

### Example: create an invoice

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "xero",
  invoice: {
    customer_id: "xero-contact-uuid",
    invoice_date: "2026-04-18",
    due_date: "2026-05-18",
    line_items: [
      { description: "Consulting", quantity: 10, unit_price: 150, account_id: "sales-revenue" },
    ],
    currency: "GBP",
  },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Xero directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Xero's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: xero" \
  -H "x-apideck-downstream-url: <target endpoint on Xero>" \
  -H "x-apideck-downstream-method: GET"
```

See [Xero's API docs](https://developer.xero.com) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Xero official docs](https://developer.xero.com)
