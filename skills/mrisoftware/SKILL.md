---
name: mrisoftware
description: |
  MRI Software integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in MRI Software. Routes through Apideck with serviceId "mrisoftware".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: mrisoftware
  unifiedApis: ["accounting"]
  authType: basic
  tier: "1a"
  verified: true
  status: beta
  difficulty: highly_complex
  partnershipRequired: true
  sandboxAvailable: false
---

# MRI Software (via Apideck)

Access MRI Software through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant MRI Software plumbing.

> **Beta connector.** MRI Software is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `mrisoftware`
- **Unified API:** Accounting
- **Auth type:** basic
- **Status:** beta
- **Gotchas:** [page](https://developers.apideck.com/apis/accounting/mrisoftware/gotchas)
- **MRI Software docs:** https://www.mrisoftware.com
- **Homepage:** https://www.mrisoftware.com/

## At a glance

- **Implementation difficulty:** highly complex — Partnership Required + Custom Composite Credential + Manual Per-Consumer Web Services User Setup
- **Vendor partnership required:** yes ([myMRI Partner Portal](https://www.mrisoftware.com/become-a-partner/)) — Yes — an MRI relationship supplies the required MIX Partner Key.
- **Apideck-managed credentials:** not available
- **Account type required:** An MRI client with Web Services (MIX APIs) licensed on their own MRI installation; the consumer supplies their own installation credentials.
- **Consumer access level:** A dedicated MRI Web Services user with a role granting rights to each API in use — a plain client login is not sufficient.
- **Sandbox:** not available — None for integration providers — testing runs against a consumer's own MRI installation.
- **Costs:** No published self-serve API pricing — access and economic terms are negotiated individually with MRI. MIX API licensing may carry a fee.
- **Rate limits:** Partner keys: 1,000 requests per rolling 5-minute window. Developer keys carry a lower, unpublished rate. MRI documents no per-day figure.
- **Authentication:** HTTP Basic Authentication with an MRI-issued composite credential — not OAuth. There are no scopes and no token expiry.
- **Webhooks:** No webhooks — change detection is polling-based.

**Important to know:**

- MRI grants API access through its Partner Connect programme or a customer-led introduction — engage MRI early and ask your contact for current onboarding expectations.
- The two key tiers are not interchangeable: a Partner key only executes APIs MRI has registered in its manifest, while a Developer key runs ad-hoc APIs. Requesting the wrong tier blocks calls you expect to work.
- There is no shared, multi-tenant MRI API host — every connection targets that consumer's own installation at https://{domain}/MRIAPIServices, so every consumer onboards with their own installation hostname.
- A 401 from MRI does not identify its own cause, so an authentication failure cannot be self-diagnosed — expect support round-trips with MRI when a connection will not validate.
- Public API documentation is minimal and dated — the main openly available reference is MRI's API Design Guide from 2016. Current technical specifics reach you only through the MRI relationship, so you cannot fully scope the build before entering it.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/mrisoftware` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user explicitly wants to work with **MRI Software** — for example, "create an invoice in MRI Software" or "reconcile payments in MRI Software". This skill teaches the agent:

1. Which Apideck unified API covers MRI Software (Accounting)
2. The correct `serviceId` to pass on every call (`mrisoftware`)
3. MRI Software-specific auth and coverage caveats

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

// List invoices in MRI Software
const { data } = await apideck.accounting.invoices.list({
  serviceId: "mrisoftware",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from MRI Software to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — MRI Software
await apideck.accounting.invoices.list({ serviceId: "mrisoftware" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating MRI Software directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## MRI Software via Apideck Accounting

MRI Software is an enterprise real-estate management platform (property management + accounting). Apideck coverage targets the accounting surface within MRI's financial modules.

### Entity mapping

| MRI entity | Apideck Accounting resource |
|---|---|
| Journal Entry | `journal-entries` |
| Tenant / Receivable | `customers` |
| Vendor | `suppliers` |
| Account | `ledger-accounts` |
| Department | `departments` |
| Location / Property | `locations` |
| Purchase Order | `purchase-orders` |
| Tax | `tax-rates` |
| Bill | `bills` |
| Entity / Portfolio | `subsidiaries` |

### Coverage highlights

- ✅ Journal entries (general ledger)
- ✅ Customers (tenants), suppliers (vendors)
- ✅ Chart of accounts
- ✅ Purchase orders
- ✅ Multi-entity / multi-property via departments, locations, subsidiaries
- ❌ Invoices in the unified sense — MRI uses tenant billing workflows; use Proxy for invoice-like records
- ❌ Lease management, property records — separate MRI module surfaces
- ❌ MRI-specific reporting tools — use Proxy

### Auth notes

- **Type:** Basic auth (MRI API username + password), managed by Apideck Vault
- **Client binding:** MRI installations are per-client; one connection per client ID.
- **Version / product variant:** MRI has many product lines (Commercial Management, Residential Management, AnyBUILD). Confirm which API surface the user has access to.
- **Enterprise-only:** MRI is typically sold to large real-estate organizations — integration setup requires coordination with MRI admin staff.

### Example: list journal entries for a property

```typescript
const { data } = await apideck.accounting.journalEntries.list({
  serviceId: "mrisoftware",
  filter: { location_id: "property_xyz" },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call MRI Software directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on MRI Software's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: mrisoftware" \
  -H "x-apideck-downstream-url: <target endpoint on MRI Software>" \
  -H "x-apideck-downstream-method: GET"
```

See [MRI Software's API docs](https://www.mrisoftware.com) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [MRI Software official docs](https://www.mrisoftware.com)
