---
name: procountor-fi
description: |
  Procountor integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Procountor. Routes through Apideck with serviceId "procountor-fi".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: procountor-fi
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
  difficulty: moderate
  partnershipRequired: false
  sandboxAvailable: true
---

# Procountor (via Apideck)

Access Procountor through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Procountor plumbing.

## Quick facts

- **Apideck serviceId:** `procountor-fi`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Gotchas:** [page](https://developers.apideck.com/apis/accounting/procountor-fi/gotchas)
- **Procountor docs:** https://dev.procountor.com
- **Homepage:** https://procountor.fi/

## At a glance

- **Implementation difficulty:** moderate — Vendor-Issued Credentials — API access is requested from Procountor rather than created in a self-service developer portal.
- **Vendor partnership required:** no ([developer portal](https://procountor.fi/en/integrations-api/#form)) — Credentials are requested via Procountor's integrations form; certification applies only to the optional Partner Programme.
- **Apideck-managed credentials:** not available
- **Account type required:** Active Procountor environment
- **Consumer access level:** A Procountor user with API rights to authorize the connection
- **Sandbox:** available — Procountor runs a separate Public Testing Server with its own base URL and its own credentials.
- **Costs:** Procountor publishes no API usage fees; the cost is the consumer's own Procountor subscription. A free product trial is available.
- **Rate limits:** Documented by Procountor: 60 requests/second per client on the production server; 90 requests/minute per client on the testing server.
- **Authentication:** Bearer token — not OAuth. Procountor issues an API token that you configure in Apideck; there is no consent-screen redirect flow.
- **Webhooks:** No webhooks — change detection is polling-based.

**Important to know:**

- Production credentials come last. Procountor releases them only after your integration has been validated against its testing server, so budget for a build-and-validate cycle before you can reach live customer data.
- Journal entries include Procountor's system-generated postings, not just manually entered ones. Invoice and payment postings arrive mixed in with manual entries, which matters if you are reconciling or reporting off journal entries.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/procountor-fi` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user explicitly wants to work with **Procountor** — for example, "create an invoice in Procountor" or "reconcile payments in Procountor". This skill teaches the agent:

1. Which Apideck unified API covers Procountor (Accounting)
2. The correct `serviceId` to pass on every call (`procountor-fi`)
3. Procountor-specific auth and coverage caveats

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

// List invoices in Procountor
const { data } = await apideck.accounting.invoices.list({
  serviceId: "procountor-fi",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Procountor to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Procountor
await apideck.accounting.invoices.list({ serviceId: "procountor-fi" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Procountor directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Procountor via Apideck Accounting

Procountor is a Finnish cloud accounting and financial management platform, part of Accountor Group. Popular with Finnish SMBs and accounting firms.

### Entity mapping

| Procountor entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Purchase Invoice | `bills` |
| Customer | `customers` |
| Supplier | `suppliers` |
| Payment | `payments` |
| Account | `ledger-accounts` |
| Product | `invoice-items` |
| Company Info | `company-info` |
| VAT | `tax-rates` |
| Purchase Order | `purchase-orders` |
| Journal | `journal-entries` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Purchase orders
- ✅ Journal entries
- ✅ Finnish VAT handling
- ⚠️ E-invoicing (Finland uses Finvoice 3.0) — handled under the hood; specific formatting via Proxy
- ❌ Payroll — separate Procountor module
- ❌ Banking / reconciliation rules — use Proxy

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Company binding:** one Procountor company per connection.
- **Finnish market focus:** Procountor is Finland-specific. Regulatory compliance (Finnish Accounting Act, OmaVero) is built-in.
- **API version:** Procountor v2 API; Apideck tracks current stable.

### Example: list bills updated this week

```typescript
const { data } = await apideck.accounting.bills.list({
  serviceId: "procountor-fi",
  filter: { updated_since: "2026-04-14T00:00:00Z" },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Procountor directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Procountor's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: procountor-fi" \
  -H "x-apideck-downstream-url: <target endpoint on Procountor>" \
  -H "x-apideck-downstream-method: GET"
```

See [Procountor's API docs](https://dev.procountor.com) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Procountor official docs](https://dev.procountor.com)
