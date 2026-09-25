---
name: visma-netvisor
description: |
  Visma Netvisor integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Visma Netvisor. Routes through Apideck with serviceId "visma-netvisor".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: visma-netvisor
  unifiedApis: ["accounting"]
  authType: custom
  tier: "1a"
  verified: true
  status: beta
  difficulty: highly_complex
  partnershipRequired: true
  sandboxAvailable: true
---

# Visma Netvisor (via Apideck)

Access Visma Netvisor through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Visma Netvisor plumbing.

> **Beta connector.** Visma Netvisor is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `visma-netvisor`
- **Unified API:** Accounting
- **Auth type:** custom
- **Status:** beta
- **Gotchas:** [page](https://developers.apideck.com/apis/accounting/visma-netvisor/gotchas)
- **Visma Netvisor docs:** https://support.netvisor.fi
- **Homepage:** https://netvisor.fi/accounting-software/

## At a glance

- **Implementation difficulty:** highly complex — Custom HMAC Authentication + Multi-Step Per-Consumer Credential Setup
- **Vendor partnership required:** yes ([Netvisor software partnership](https://netvisor.fi/ohjelmistokumppanuus/)) — Production credentials follow a partner agreement signed with Visma, issued after Netvisor reviews your finished integration.
- **Apideck-managed credentials:** not available — Netvisor issues credentials per integration, so there is no shared app to supply.
- **Account type required:** A Netvisor package that includes the Web Service Interface — Professional, Premium or Payroll. Basic, Starter and Core cannot connect.
- **Consumer access level:** Any Netvisor user with editing rights to at least one function can create the API identifiers; granting your integration its rights needs an administrator.
- **Sandbox:** available — Netvisor provisions a free test environment with its own credentials on sign-up. It arrives empty; Netvisor support can seed it with sample data.
- **Costs:** Free to build — Netvisor charges nothing to join, nor for test or production credentials.
- **Rate limits:** No published per-minute or per-day limit. Netvisor enforces limits server-side and may add endpoint-, partner- or company-specific ceilings.
- **Authentication:** Each request carries a freshly computed HMAC-SHA256 signature; not OAuth.
- **Webhooks:** No webhooks — Netvisor publishes none, so keep data fresh by polling.

**Important to know:**

- Credentials come in two tiers that are not interchangeable: integration-level values registered once, and customer-level values each consumer generates inside their own Netvisor account. Both must be in place before any call succeeds.
- Valid credentials alone are not enough. Each consumer must also grant your integration rights in Netvisor's own API security panel, looking it up by the access key you give them.
- Three Netvisor import resources — accounting entries with attachments, purchase invoices and eScan documents — carry a customer-specific per-transaction fee on top of the package price. Everything else is included in the package.
- Netvisor is Visma's Finnish accounting platform, sold mainly in Finland and Sweden, so treat it as regional coverage rather than a connector your whole user base can use.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/visma-netvisor` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user explicitly wants to work with **Visma Netvisor** — for example, "create an invoice in Visma Netvisor" or "reconcile payments in Visma Netvisor". This skill teaches the agent:

1. Which Apideck unified API covers Visma Netvisor (Accounting)
2. The correct `serviceId` to pass on every call (`visma-netvisor`)
3. Visma Netvisor-specific auth and coverage caveats

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

// List invoices in Visma Netvisor
const { data } = await apideck.accounting.invoices.list({
  serviceId: "visma-netvisor",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Visma Netvisor to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Visma Netvisor
await apideck.accounting.invoices.list({ serviceId: "visma-netvisor" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Visma Netvisor directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Visma Netvisor via Apideck Accounting

Visma Netvisor is a Finnish financial management platform under the Visma Group, popular with Finnish SMBs and service businesses.

### Entity mapping

| Netvisor entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Purchase Invoice | `bills` |
| Customer | `customers` |
| Supplier | `suppliers` |
| Credit Note | `credit-notes` |
| Payment | `payments` |
| Item | `invoice-items` |
| Purchase Order | `purchase-orders` |
| Journal | `journal-entries` |

### Coverage highlights

- ✅ Sales and purchase invoices
- ✅ Customers, suppliers
- ✅ Credit notes, payments
- ✅ Purchase orders
- ✅ Journal entries
- ✅ Finnish VAT
- ❌ Finnish-specific regulatory submissions — use Proxy
- ❌ Payroll — separate Visma product

### Auth notes

- **Type:** Custom (Netvisor-specific signed-request auth), managed by Apideck Vault
- **Company binding:** one Netvisor company per connection. Netvisor identifies companies via Business ID (Y-tunnus).
- **Sender credentials:** Apideck's Vault app handles sender key rotation; end-user provides their Netvisor partner credentials.
- **Finnish compliance:** Netvisor is certified for Finnish accounting standards (Kirjanpitolaki).

### Example: list open invoices

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "visma-netvisor",
  filter: { status: "open" },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Visma Netvisor directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Visma Netvisor's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: visma-netvisor" \
  -H "x-apideck-downstream-url: <target endpoint on Visma Netvisor>" \
  -H "x-apideck-downstream-method: GET"
```

See [Visma Netvisor's API docs](https://support.netvisor.fi) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Visma Netvisor official docs](https://support.netvisor.fi)
