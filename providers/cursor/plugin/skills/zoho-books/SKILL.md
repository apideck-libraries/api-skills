---
name: zoho-books
description: |
  Zoho Books integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Zoho Books. Routes through Apideck with serviceId "zoho-books".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: zoho-books
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
  difficulty: straightforward
  partnershipRequired: false
  sandboxAvailable: false
---

# Zoho Books (via Apideck)

Access Zoho Books through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Zoho Books plumbing.

## Quick facts

- **Apideck serviceId:** `zoho-books`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Gotchas:** [page](https://developers.apideck.com/apis/accounting/zoho-books/gotchas)
- **Zoho Books docs:** https://www.zoho.com/books/api/v3/
- **Homepage:** https://www.zoho.com/books/

## At a glance

- **Implementation difficulty:** straightforward — Self-Service OAuth, No Partnership Required
- **Vendor partnership required:** no — No partner programme — self-service OAuth client registration is free. An optional Zoho Marketplace listing adds discoverability, not API access.
- **Apideck-managed credentials:** Available for testing — the OAuth consent screen shows "Apideck"; use your own Zoho OAuth client for production.
- **Account type required:** Active Zoho Books subscription (Free plan or higher)
- **Consumer access level:** A user with organization-level access in the Zoho Books organization being authorized
- **Sandbox:** not available — No separate sandbox environment is offered.
- **Costs:** Free — Zoho charges nothing for API access on any Zoho Books plan, including the Free plan.
- **Rate limits:** 100 requests/minute per organization; daily cap set by the consumer's plan (1,000 Free to 10,000 Premium); 5 concurrent calls on Free, 10 on paid plans.
- **Authentication:** OAuth 2.0 (Authorization Code).
- **Webhooks:** Virtual webhooks — created/updated/deleted events on 10 resources, including invoices, bills, payments, customers and suppliers.

**Important to know:**

- Zoho hosts each organization in one of seven regional data centres (US, EU, IN, AU, JP, CA, SA — verified June 2026). Apideck resolves the right region during authorization.
- A Zoho Books account can hold several organizations and each is authorized separately, so a consumer running three organizations needs three connections.
- Each consumer's own Zoho Books subscription sets their daily API quota, not yours — you cannot raise it for them. Design syncs around the lowest tier your consumers run on; heavier users unlock more frequent syncs by upgrading their own plan.
- Refresh tokens never expire, but Zoho stores at most 20 per user: authorizing a 21st silently revokes the oldest, which can break a long-standing connection with no error or warning.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/zoho-books` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user explicitly wants to work with **Zoho Books** — for example, "create an invoice in Zoho Books" or "reconcile payments in Zoho Books". This skill teaches the agent:

1. Which Apideck unified API covers Zoho Books (Accounting)
2. The correct `serviceId` to pass on every call (`zoho-books`)
3. Zoho Books-specific auth and coverage caveats

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

// List invoices in Zoho Books
const { data } = await apideck.accounting.invoices.list({
  serviceId: "zoho-books",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Zoho Books to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Zoho Books
await apideck.accounting.invoices.list({ serviceId: "zoho-books" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Zoho Books directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Zoho Books via Apideck Accounting

Zoho Books is Zoho's accounting product, part of the Zoho One suite. Strong in India and emerging markets, with multi-currency and multi-entity support.

### Entity mapping

| Zoho Books entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Bill | `bills` |
| Payment (Customer Payment) | `payments` |
| Bill Payment (Vendor Payment) | `bill-payments` |
| Journal | `journal-entries` |
| Chart of Account | `ledger-accounts` |
| Contact (customer) | `customers` |
| Contact (vendor) | `suppliers` |
| Item | `invoice-items` |
| Tax | `tax-rates` |
| Credit Note | `credit-notes` |
| Purchase Order | `purchase-orders` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries
- ✅ Multi-currency
- ✅ Purchase orders
- ✅ GST / VAT handling (India and other regions)
- ⚠️ Recurring invoices — not exposed; use Proxy
- ❌ Projects and time tracking — separate Zoho products (Zoho Projects, Zoho People)
- ❌ Expense claim workflow — use Proxy with Zoho Expense API

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Data center / region:** Zoho is sharded by region (US, EU, IN, AU, CN, JP). The user's data center is determined during OAuth; wrong-DC errors mean re-authorization is needed.
- **Organization binding:** one Zoho Books organization per connection.
- **Zoho One:** users on Zoho One share auth across Zoho apps — connecting Books doesn't automatically connect CRM/People etc.

### Example: create an invoice with tax

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "zoho-books",
  invoice: {
    customer_id: "contact_abc",
    invoice_date: "2026-04-18",
    line_items: [
      { description: "Software license", quantity: 1, unit_price: 500, tax_rate: { id: "tax_gst_18" } },
    ],
    currency: "INR",
  },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Zoho Books directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Zoho Books's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: zoho-books" \
  -H "x-apideck-downstream-url: <target endpoint on Zoho Books>" \
  -H "x-apideck-downstream-method: GET"
```

See [Zoho Books's API docs](https://www.zoho.com/books/api/v3/) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Zoho Books official docs](https://www.zoho.com/books/api/v3/)
