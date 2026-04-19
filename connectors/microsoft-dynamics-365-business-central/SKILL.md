---
name: microsoft-dynamics-365-business-central
description: |
  Microsoft Dynamics 365 Business Central integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Microsoft Dynamics 365 Business Central. Routes through Apideck with serviceId "microsoft-dynamics-365-business-central".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: microsoft-dynamics-365-business-central
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
---

# Microsoft Dynamics 365 Business Central (via Apideck)

Access Microsoft Dynamics 365 Business Central through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Microsoft Dynamics 365 Business Central plumbing.

## Quick facts

- **Apideck serviceId:** `microsoft-dynamics-365-business-central`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Microsoft Dynamics 365 Business Central docs:** https://learn.microsoft.com/dynamics365/business-central/
- **Homepage:** https://dynamics.microsoft.com/en-us/business-central/overview/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Microsoft Dynamics 365 Business Central** — for example, "create an invoice in Microsoft Dynamics 365 Business Central" or "reconcile payments in Microsoft Dynamics 365 Business Central". This skill teaches the agent:

1. Which Apideck unified API covers Microsoft Dynamics 365 Business Central (Accounting)
2. The correct `serviceId` to pass on every call (`microsoft-dynamics-365-business-central`)
3. Microsoft Dynamics 365 Business Central-specific auth and coverage caveats

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

// List invoices in Microsoft Dynamics 365 Business Central
const { data } = await apideck.accounting.invoices.list({
  serviceId: "microsoft-dynamics-365-business-central",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Microsoft Dynamics 365 Business Central to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Microsoft Dynamics 365 Business Central
await apideck.accounting.invoices.list({ serviceId: "microsoft-dynamics-365-business-central" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Microsoft Dynamics 365 Business Central directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Microsoft Dynamics 365 Business Central via Apideck

Dynamics 365 Business Central (BC) is Microsoft's SMB ERP, successor to Dynamics NAV. Strong in manufacturing, distribution, and professional services. Not to be confused with Dynamics 365 Finance (enterprise) or Dynamics CRM.

### Entity mapping

| BC entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Purchase Invoice | `bills` |
| Customer Payment | `payments` |
| Vendor Payment | `bill-payments` |
| Sales Credit Memo | `credit-notes` |
| Journal Entry (G/L Entry) | `journal-entries` |
| G/L Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Item | `invoice-items` |
| VAT Posting Setup | `tax-rates` |
| Company | `companies` |
| Purchase Order | `purchase-orders` |
| Dimension | `tracking-categories` |
| Location | `locations` |
| Attachments | `attachments` |
| Expense | `expenses` |
| Bank Account | `bank-accounts` |
| Employee | `employees` (HRIS context in some setups) |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, vendors
- ✅ Purchase orders (ERP grade)
- ✅ Journal entries
- ✅ Multi-company (companies = BC's tenants)
- ✅ Dimensions (tracking categories)
- ✅ Multi-currency and multi-locale
- ⚠️ Manufacturing, warehousing — not in unified; use Proxy
- ❌ Power Automate / Power Apps integrations — outside the API surface

### Auth notes

- **Type:** OAuth 2.0 (Microsoft identity platform), managed by Apideck Vault
- **Typical scopes:** Apideck Vault requests BC-specific scopes (`Financials.ReadWrite.All` or similar). Admin consent usually required for corporate tenants.
- **Environment binding:** each connection is bound to one environment (Production or Sandbox); choose during OAuth.
- **Company selection:** multi-company BC tenants have one connection but require a company parameter on many calls — Apideck handles this via connection metadata.

### Example: create a sales invoice

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "microsoft-dynamics-365-business-central",
  invoice: {
    customer_id: "cust_uuid",
    invoice_date: "2026-04-18",
    due_date: "2026-05-18",
    line_items: [
      { description: "Product A", quantity: 2, unit_price: 499.00 },
    ],
    currency: "USD",
  },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Microsoft Dynamics 365 Business Central directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Microsoft Dynamics 365 Business Central's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: microsoft-dynamics-365-business-central" \
  -H "x-apideck-downstream-url: <target endpoint on Microsoft Dynamics 365 Business Central>" \
  -H "x-apideck-downstream-method: GET"
```

See [Microsoft Dynamics 365 Business Central's API docs](https://learn.microsoft.com/dynamics365/business-central/) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Microsoft Dynamics 365 Business Central official docs](https://learn.microsoft.com/dynamics365/business-central/)
