---
name: myob-acumatica
description: |
  MYOB Acumatica integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in MYOB Acumatica. Routes through Apideck with serviceId "myob-acumatica".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: myob-acumatica
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
  status: beta
  difficulty: moderate
  partnershipRequired: true
  sandboxAvailable: true
---

# MYOB Acumatica (via Apideck)

Access MYOB Acumatica through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant MYOB Acumatica plumbing.

> **Beta connector.** MYOB Acumatica is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `myob-acumatica`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Status:** beta
- **Apideck setup guide:** [Connection guide](https://developers.apideck.com/connectors/myob-acumatica/docs/consumer+connection)
- **Gotchas:** [page](https://developers.apideck.com/apis/accounting/myob-acumatica/gotchas)
- **MYOB Acumatica docs:** https://developer.myob.com
- **Homepage:** https://www.myob.com/au/erp-software/products/myob-acumatica

## At a glance

- **Implementation difficulty:** moderate — Developer Program Certification Required for Sandbox and Scale
- **Vendor partnership required:** yes ([MYOB Developer Program](https://enterprise-support.myob.com/acudev/join-the-myob-developer-program)) — Membership is required to build a connected integration.
- **Apideck-managed credentials:** not available — A MYOB Acumatica client id is bound to the instance that issued it, so no credential can be shared across consumers.
- **Account type required:** A MYOB Acumatica (also sold as MYOB Advanced) instance.
- **Consumer access level:** An administrator who can reach the instance's Integration menu (Connected Applications, Web Service Endpoints).
- **Sandbox:** available ([signup](https://enterprise-support.myob.com/acudev/downloading-test-sandbox-and-demo-data)) — Not self-service: MYOB issues a developer instance once a team member completes the Acumatica web services certification and joins the partner portal.
- **Costs:** Free to build. The optional paid tiers cost AUD$200 (Developer Partner) or AUD$500 (Premium Developer Partner) + GST per month.
- **Rate limits:** Free Full User API licence: 1,500 calls/day, 1 named API user. Paid Full Access API licence: unlimited calls/day, up to 100 named users.
- **Authentication:** Authorization Code flow against the consumer's own instance URL.
- **Webhooks:** No webhooks — neither native nor virtual; change detection is polling-based.

**Important to know:**

- Outgrowing the free API licence is a MYOB licensing step, not a configuration change: the upgrade has to be arranged on the MYOB side before call volume grows past the daily cap.
- MYOB Acumatica is the Australia/New Zealand build on the Acumatica platform. A customer running generic Acumatica ERP belongs on the separate Acumatica connector, not this one.
- MYOB Acumatica sessions do not tolerate parallel requests that reuse the same session or token: concurrent calls trigger throttling or timeouts, so plan for sequential rather than fanned-out calls.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/myob-acumatica` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user explicitly wants to work with **MYOB Acumatica** — for example, "create an invoice in MYOB Acumatica" or "reconcile payments in MYOB Acumatica". This skill teaches the agent:

1. Which Apideck unified API covers MYOB Acumatica (Accounting)
2. The correct `serviceId` to pass on every call (`myob-acumatica`)
3. MYOB Acumatica-specific auth and coverage caveats

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

// List invoices in MYOB Acumatica
const { data } = await apideck.accounting.invoices.list({
  serviceId: "myob-acumatica",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from MYOB Acumatica to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — MYOB Acumatica
await apideck.accounting.invoices.list({ serviceId: "myob-acumatica" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating MYOB Acumatica directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## MYOB Acumatica via Apideck Accounting

MYOB Acumatica (formerly MYOB Advanced) is MYOB's enterprise ERP for mid-market, built on the Acumatica platform. Wider ERP coverage than MYOB Business; closer in feel to [`acumatica`](../acumatica/).

### Entity mapping

| MYOB Acumatica entity | Apideck Accounting resource |
|---|---|
| AR Invoice | `invoices` |
| AP Bill | `bills` |
| Payment | `payments` |
| Credit Note | `credit-notes` |
| Journal Transaction | `journal-entries` |
| Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Inventory Item | `invoice-items` |
| Tax | `tax-rates` |
| Purchase Order | `purchase-orders` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries
- ✅ Credit notes
- ✅ Purchase orders (ERP-grade)
- ✅ Multi-entity / multi-branch
- ⚠️ Projects, manufacturing — not in unified accounting; use Proxy
- ❌ Payroll — separate product

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Tenant binding:** one MYOB Acumatica tenant per connection.
- **Role-based access:** the user's Acumatica role determines which records are readable/writable; Apideck surfaces 403s transparently.

### Example: list open AR invoices

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "myob-acumatica",
  filter: { status: "open" },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call MYOB Acumatica directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on MYOB Acumatica's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: myob-acumatica" \
  -H "x-apideck-downstream-url: <target endpoint on MYOB Acumatica>" \
  -H "x-apideck-downstream-method: GET"
```

See [MYOB Acumatica's API docs](https://developer.myob.com) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Apideck connection guide for MYOB Acumatica](https://developers.apideck.com/connectors/myob-acumatica/docs/consumer+connection)
- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [MYOB Acumatica official docs](https://developer.myob.com)
