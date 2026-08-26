---
name: exact-online
description: |
  Exact Online integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Exact Online. Routes through Apideck with serviceId "exact-online".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: exact-online
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
  difficulty: moderate
  partnershipRequired: true
  sandboxAvailable: true
---

# Exact Online (via Apideck)

Access Exact Online through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Exact Online plumbing.

## Quick facts

- **Apideck serviceId:** `exact-online`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Gotchas:** [page](https://developers.apideck.com/apis/accounting/exact-online/gotchas)
- **Exact Online docs:** https://support.exactonline.com/community/s/knowledge-base
- **Homepage:** https://www.exact.com/

## At a glance

- **Implementation difficulty:** moderate — Paid Developer Subscription + App Review Required for External Consumers
- **Vendor partnership required:** yes ([Exact Online App Store (Manage my apps)](https://apps.exactonline.com)) — Yes — registering your app requires a paid Exact Online developer subscription (per country); App Store listing is optional.
- **Apideck-managed credentials:** not available
- **Account type required:** Active Exact Online subscription in any supported country edition (NL, BE, DE, ES, UK, US)
- **Consumer access level:** Any user who can authorise third-party app connections; at consent time the app must be granted access to each division (administration) it needs to access.
- **Sandbox:** available — No isolated sandbox — test with your developer subscription or a free 30-day trial.
- **Costs:** Developer subscription approx. €15/month per country (excl. VAT); no per-call API charges.
- **Rate limits:** 60 requests/minute and 5,000 requests/day per app per division; Exact Online Premium raises the daily cap to 30,000.
- **Authentication:** OAuth 2.0 (Authorization Code).
- **Webhooks:** No webhooks — sync is polling-based; Exact Online's native webhooks are not surfaced through this connector.

**Important to know:**

- Exact Online runs separate country instances — an app registered in one country cannot serve consumers in another. Select and save the connection's region **before** authorizing; it defaults to the Dutch domain, so non-NL consumers fail otherwise.
- Your app must pass Exact's review before consumers outside your own Exact instance can connect — until it does, only your own subscription can be linked, which blocks pilot consumers.
- Write-back is limited to transactions (invoices, bills, invoice items, payments, bill payments, journal entries); master data — customers, suppliers, ledger accounts, tax rates and credit notes — is read-only, so consumers maintain it in Exact Online.
- Refresh tokens are single-use and expire after 30 days of inactivity — a dormant connection must be re-authorised by the consumer.
- Exact requires sequential API calls — parallel or multi-threaded requests are explicitly disallowed, so a high-volume sync must be serialised rather than fanned out.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/exact-online` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user explicitly wants to work with **Exact Online** — for example, "create an invoice in Exact Online" or "reconcile payments in Exact Online". This skill teaches the agent:

1. Which Apideck unified API covers Exact Online (Accounting)
2. The correct `serviceId` to pass on every call (`exact-online`)
3. Exact Online-specific auth and coverage caveats

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

// List invoices in Exact Online
const { data } = await apideck.accounting.invoices.list({
  serviceId: "exact-online",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Exact Online to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Exact Online
await apideck.accounting.invoices.list({ serviceId: "exact-online" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Exact Online directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Exact Online via Apideck Accounting

Exact Online is a widely-used cloud accounting platform across the Netherlands, Belgium, Germany, and other European markets. Deep Apideck coverage; one of the most mature European accounting connectors in the catalog.

> **Regional variants:** `exact-online` is the default / multi-region connector. For country-specific Exact instances use [`exact-online-nl`](../exact-online-nl/) (Dutch market) or [`exact-online-uk`](../exact-online-uk/) (UK market). Pick the one that matches the user's division country.

### Entity mapping

| Exact Online entity | Apideck Accounting resource |
|---|---|
| SalesInvoice | `invoices` |
| PurchaseInvoice / Bill | `bills` |
| Payment | `payments` |
| BillPayment | `bill-payments` |
| Journal / Entry | `journal-entries` |
| GL Account | `ledger-accounts` |
| Account (Customer) | `customers` |
| Account (Supplier) | `suppliers` |
| Item | `invoice-items` |
| VatCode | `tax-rates` |
| CreditInvoice | `credit-notes` |
| Division | `companies` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries and VAT handling
- ✅ Multi-division — exposed as `companies`
- ✅ Multi-currency
- ✅ Financial reports (P&L, Balance Sheet)
- ⚠️ Banking imports — partial; use Proxy for bulk reconciliation
- ❌ CRM / quotation features — separate Exact surface; use Proxy
- ❌ Payroll — separate Exact product

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Division selection:** Exact accounts often contain multiple divisions (legal entities). Apideck connections are bound to one division by default — if the user needs multi-division access, either create multiple connections or pass the division ID via pass-through.
- **Regional data centers:** NL / BE / DE / UK accounts may route to different Exact endpoints. Use the correct connector variant (`exact-online`, `exact-online-nl`, `exact-online-uk`) or ensure the user selects the right region during Vault OAuth.
- **Refresh tokens:** Exact Online refresh tokens are rotated — Apideck handles rotation transparently.

### Example: list invoices for the current month

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "exact-online",
  filter: { updated_since: "2026-04-01T00:00:00Z" },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Exact Online directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Exact Online's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: exact-online" \
  -H "x-apideck-downstream-url: <target endpoint on Exact Online>" \
  -H "x-apideck-downstream-method: GET"
```

See [Exact Online's API docs](https://support.exactonline.com/community/s/knowledge-base) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online-nl`](../exact-online-nl/) *(beta)*, and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Exact Online official docs](https://support.exactonline.com/community/s/knowledge-base)
