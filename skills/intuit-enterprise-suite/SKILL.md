---
name: intuit-enterprise-suite
description: |
  Intuit Enterprise Suite integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Intuit Enterprise Suite. Routes through Apideck with serviceId "intuit-enterprise-suite".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: intuit-enterprise-suite
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
  difficulty: moderate
  partnershipRequired: true
  sandboxAvailable: true
---

# Intuit Enterprise Suite (via Apideck)

Access Intuit Enterprise Suite through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Intuit Enterprise Suite plumbing.

## Quick facts

- **Apideck serviceId:** `intuit-enterprise-suite`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Gotchas:** [page](https://developers.apideck.com/apis/accounting/intuit-enterprise-suite/gotchas)
- **Intuit Enterprise Suite docs:** https://developer.intuit.com
- **Homepage:** https://developer.intuit.com

## At a glance

- **Implementation difficulty:** moderate — Self-Service Signup + App Review Required
- **Vendor partnership required:** yes ([Intuit Developer Account](https://developer.intuit.com/app/developer/homepage)) — Free, self-service signup; an App Assessment Questionnaire must be approved before Intuit issues production credentials.
- **Apideck-managed credentials:** Not available — you register your own Intuit Developer app and supply its Client ID and Secret.
- **Account type required:** Active Intuit Enterprise Suite subscription
- **Consumer access level:** Any user with Intuit Enterprise Suite access can authorize (Admin recommended for full data access)
- **Sandbox:** available ([signup](https://developer.intuit.com/app/developer/qbo/docs/develop/sandboxes)) — QuickBooks Online sandbox companies, plus a dedicated single-entity Intuit Enterprise Suite sandbox, available from the Builder tier.
- **Costs:** Free at the Builder tier (500,000 CorePlus read calls/month); paid tiers from $300/month (Silver) to $1,700/month (Gold) for higher volumes.
- **Rate limits:** 500 requests/minute per company (realm), 10 concurrent per second; batch 120/minute (30 operations max). Paid tiers do not raise these limits.
- **Authentication:** OAuth 2.0 (authorization code). Custom scopes supported.
- **Webhooks:** Native — 13 event families including invoice, bill, payment, customer, and supplier (created/updated/deleted).

**Important to know:**

- Intuit Enterprise Suite shares its API, developer program, and OAuth client with QuickBooks Online — an existing QuickBooks integration on Apideck works with IES on the same production credentials with no code changes, and migration between the two connectors is supported.
- Each entity in a multi-entity IES organization needs its own OAuth connection (one connection = one company realm), and the API supports no cross-entity transactions or intercompany postings.
- Refresh tokens expire after 100 days of inactivity and, under Intuit's November 2025 policy, have a hard 5-year maximum lifetime regardless of activity (standard accounting scopes from October 2028; granular scopes from February 2027) — the consumer must then re-authorize.
- The free Builder tier's CorePlus (read) cap is hard: calls above the monthly volume are blocked, not throttled, until the next billing cycle or a tier upgrade. Because the connector uses your own Intuit app, Intuit's Platform Service Fees bill to you, not to Apideck.
- The IES-exclusive Dimensions API (GraphQL) is gated behind the paid Silver tier or higher — the free Builder tier has no access.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/intuit-enterprise-suite` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user explicitly wants to work with **Intuit Enterprise Suite** — for example, "create an invoice in Intuit Enterprise Suite" or "reconcile payments in Intuit Enterprise Suite". This skill teaches the agent:

1. Which Apideck unified API covers Intuit Enterprise Suite (Accounting)
2. The correct `serviceId` to pass on every call (`intuit-enterprise-suite`)
3. Intuit Enterprise Suite-specific auth and coverage caveats

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

// List invoices in Intuit Enterprise Suite
const { data } = await apideck.accounting.invoices.list({
  serviceId: "intuit-enterprise-suite",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Intuit Enterprise Suite to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Intuit Enterprise Suite
await apideck.accounting.invoices.list({ serviceId: "intuit-enterprise-suite" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Intuit Enterprise Suite directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Intuit Enterprise Suite via Apideck

Intuit Enterprise Suite (IES) is Intuit's enterprise-grade offering, above QuickBooks Online Advanced. Targets mid-market and multi-entity customers with deeper consolidation, multi-GL, and dimension tracking.

### Entity mapping

| IES entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Bill | `bills` |
| Customer Payment | `payments` |
| Vendor Payment | `bill-payments` |
| Credit Memo | `credit-notes` |
| Journal Entry | `journal-entries` |
| Chart of Accounts | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Item | `invoice-items` |
| Tax Rate | `tax-rates` |
| Purchase Order | `purchase-orders` |
| Class / Location | `tracking-categories`, `locations` |
| Department | `departments` |
| Expense | `expenses` |
| Attachments | `attachments` |
| Company | `companies` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries, credit memos, purchase orders
- ✅ Multi-dimension tracking (Class, Location, Department)
- ✅ Multi-entity / consolidated reporting
- ✅ Financial reports (P&L, Balance Sheet)
- ✅ Attachments on transactions
- ⚠️ Custom fields — more flexible than QBO; exposed via `custom_fields[]`
- ❌ Intuit-specific AI features (e.g., Transaction Matching) — use Proxy

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Realm binding:** same pattern as QuickBooks — one realm per connection. IES multi-entity setups expose child entities through the parent realm.
- **Compared to QuickBooks:** use [`quickbooks`](../quickbooks/) for QBO (SMB single-entity), [`intuit-enterprise-suite`](../intuit-enterprise-suite/) for IES (enterprise multi-entity). The product the user subscribed to determines which connector to pick.

### Example: list invoices across all entities in the realm

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "intuit-enterprise-suite",
  limit: 100,
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Intuit Enterprise Suite directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Intuit Enterprise Suite's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: intuit-enterprise-suite" \
  -H "x-apideck-downstream-url: <target endpoint on Intuit Enterprise Suite>" \
  -H "x-apideck-downstream-method: GET"
```

See [Intuit Enterprise Suite's API docs](https://developer.intuit.com) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Intuit Enterprise Suite official docs](https://developer.intuit.com)
