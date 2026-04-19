---
name: quickbooks
description: |
  QuickBooks integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in QuickBooks. Routes through Apideck with serviceId "quickbooks".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: quickbooks
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
---

# QuickBooks (via Apideck)

Access QuickBooks through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to NetSuite, Sage Intacct, Workday and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant QuickBooks plumbing.

## Quick facts

- **Apideck serviceId:** `quickbooks`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **QuickBooks docs:** https://developer.intuit.com/app/developer/qbo/docs
- **Homepage:** https://quickbooks.intuit.com/

## When to use this skill

Activate this skill when the user explicitly wants to work with **QuickBooks** — for example, "create an invoice in QuickBooks" or "reconcile payments in QuickBooks". This skill teaches the agent:

1. Which Apideck unified API covers QuickBooks (Accounting)
2. The correct `serviceId` to pass on every call (`quickbooks`)
3. QuickBooks-specific auth and coverage caveats

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

// List invoices in QuickBooks
const { data } = await apideck.accounting.invoices.list({
  serviceId: "quickbooks",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from QuickBooks to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — QuickBooks
await apideck.accounting.invoices.list({ serviceId: "quickbooks" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "netsuite" });
await apideck.accounting.invoices.list({ serviceId: "sage-intacct" });
```

This is the compounding advantage of using Apideck over integrating QuickBooks directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## QuickBooks via Apideck Accounting

QuickBooks Online is the most widely used SMB accounting connector on Apideck. Coverage is near-complete for core accounting resources.

### Entity mapping

| QuickBooks entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Bill | `bills` |
| Payment | `payments` |
| BillPayment | `bill-payments` |
| JournalEntry | `journal-entries` |
| Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Item | `items` |
| TaxRate, TaxCode | `tax-rates` |
| Company info | `company-info` |
| P&L, Balance Sheet reports | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers, items
- ✅ Journal entries (create/read)
- ✅ Financial reports: P&L, Balance Sheet, Aged Receivables/Payables
- ✅ Multi-currency — invoices created with `currency` field route correctly
- ✅ Attachments on invoices/bills via the `attachments` sub-resource
- ⚠️ Tax rates read-only (QuickBooks requires tax setup through its UI)
- ⚠️ Recurring invoices — not exposed; use Proxy
- ❌ Deposits — use Proxy with the `/deposit` endpoint
- ❌ Purchase orders — use Proxy

### QuickBooks-specific auth notes

- **Company/realm selection:** QuickBooks is multi-tenant via `realmId`. The user picks their company during OAuth; the connection is bound to that single realm. Multi-company = one connection per realm (distinct `consumerId`).
- **Token expiry:** Intuit enforces short-lived access tokens and longer-lived refresh tokens (see Intuit docs for current values). Apideck refreshes automatically, but long inactivity can invalidate refresh tokens — the connection then needs re-authorization.
- **Sandbox:** QuickBooks Sandbox is a separate environment. Apideck exposes it as a distinct connection; the user toggles sandbox during Vault OAuth.

### Common QuickBooks quirks handled by Apideck

- **Line items on invoices** — QuickBooks uses a nested `Line` array with `DetailType` discriminators. Apideck normalizes to `line_items[]` with unified fields.
- **Tax calculation** — `TotalAmt` vs. `SubTotal` split is exposed as `total_amount` and `sub_total`.
- **Customer refs** — QuickBooks uses `CustomerRef.value`; Apideck exposes as `customer.id`.
- **Soft-deleted records** — `Active: false` entries. Apideck filters these out by default; pass `filter[active]=false` to include them.

### Example: create an invoice with line items

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "quickbooks",
  invoice: {
    customer_id: "12", // QuickBooks customer ID
    invoice_date: "2026-04-18",
    due_date: "2026-05-18",
    line_items: [
      {
        description: "Consulting — April 2026",
        quantity: 10,
        unit_price: 150.0,
        item_id: "7", // QuickBooks Item ID
        tax_rate: { id: "TAX" },
      },
    ],
    currency: "USD",
  },
});
```

### Example: pull P&L report for a date range

P&L is exposed via `/accounting/profit-and-loss`. See [`apideck-node`](../../skills/apideck-node/) for the canonical method signature.

```typescript
const { data } = await apideck.accounting.profitAndLoss.get({
  serviceId: "quickbooks",
  filter: {
    start_date: "2026-01-01",
    end_date: "2026-03-31",
  },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call QuickBooks directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on QuickBooks's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: quickbooks" \
  -H "x-apideck-downstream-url: <target endpoint on QuickBooks>" \
  -H "x-apideck-downstream-method: GET"
```

See [QuickBooks's API docs](https://developer.intuit.com/app/developer/qbo/docs) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`netsuite`](../netsuite/), [`sage-intacct`](../sage-intacct/), [`workday`](../workday/), [`xero`](../xero/), [`exact-online`](../exact-online/), [`freeagent`](../freeagent/) *(beta)*, [`freshbooks`](../freshbooks/), [`wave`](../wave/) *(beta)*, and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [QuickBooks official docs](https://developer.intuit.com/app/developer/qbo/docs)
