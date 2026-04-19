---
name: sage-business-cloud-accounting
description: |
  Sage Business Cloud Accounting integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Sage Business Cloud Accounting. Routes through Apideck with serviceId "sage-business-cloud-accounting".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: sage-business-cloud-accounting
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
  status: beta
---

# Sage Business Cloud Accounting (via Apideck)

Access Sage Business Cloud Accounting through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Sage Business Cloud Accounting plumbing.

> **Beta connector.** Sage Business Cloud Accounting is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `sage-business-cloud-accounting`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Status:** beta
- **Sage Business Cloud Accounting docs:** https://developer.sage.com/accounting/
- **Homepage:** https://www.sage.com/en-za/sage-business-cloud/accounting/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Sage Business Cloud Accounting** — for example, "create an invoice in Sage Business Cloud Accounting" or "reconcile payments in Sage Business Cloud Accounting". This skill teaches the agent:

1. Which Apideck unified API covers Sage Business Cloud Accounting (Accounting)
2. The correct `serviceId` to pass on every call (`sage-business-cloud-accounting`)
3. Sage Business Cloud Accounting-specific auth and coverage caveats

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

// List invoices in Sage Business Cloud Accounting
const { data } = await apideck.accounting.invoices.list({
  serviceId: "sage-business-cloud-accounting",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Sage Business Cloud Accounting to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Sage Business Cloud Accounting
await apideck.accounting.invoices.list({ serviceId: "sage-business-cloud-accounting" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Sage Business Cloud Accounting directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Sage Business Cloud Accounting via Apideck

Sage Business Cloud Accounting (formerly Sage One) is Sage's cloud SMB accounting product, distinct from Sage Intacct (mid-market) and Sage 50 (desktop). Popular in UK, Ireland, and other English-speaking markets.

### Entity mapping

| Sage entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Purchase Invoice | `bills` |
| Credit Note | `credit-notes` |
| Contact Payment | `payments` |
| Bill Payment | `bill-payments` |
| Journal | `journal-entries` |
| Ledger Account | `ledger-accounts` |
| Contact (Customer) | `customers` |
| Contact (Supplier) | `suppliers` |
| Item / Product | `invoice-items` |
| Tax Rate | `tax-rates` |
| Bank Account | `bank-accounts` |
| Business | `subsidiaries` |
| Attachment | `attachments` |
| Expense | `expenses` |
| Company | `companies` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries
- ✅ Financial reports (P&L, Balance Sheet)
- ✅ Multi-business (Sage's term for multi-tenant access within one account)
- ✅ Attachments on invoices / bills
- ⚠️ VAT returns / MTD submission — use Proxy with Sage's dedicated MTD endpoints
- ❌ Payroll — Sage Payroll is separate
- ❌ Stock/inventory — Sage 50 territory

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Business binding:** each connection = one Sage business. Users may have access to multiple businesses from one account; Apideck binds to the selected one at OAuth time.
- **Region:** Sage Business Cloud has UK, US, DE, FR, ES, IE, CA variants. Choose the right regional variant or ensure the user selects correctly during OAuth.
- **Name collision:** do not confuse with Sage Intacct — different product, different connector.

### Example: list invoices for a specific customer

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "sage-business-cloud-accounting",
  filter: { customer_id: "contact_123" },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Sage Business Cloud Accounting directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Sage Business Cloud Accounting's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: sage-business-cloud-accounting" \
  -H "x-apideck-downstream-url: <target endpoint on Sage Business Cloud Accounting>" \
  -H "x-apideck-downstream-method: GET"
```

See [Sage Business Cloud Accounting's API docs](https://developer.sage.com/accounting/) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Sage Business Cloud Accounting official docs](https://developer.sage.com/accounting/)
