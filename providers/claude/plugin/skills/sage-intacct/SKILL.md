---
name: sage-intacct
description: |
  Sage Intacct integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Sage Intacct. Routes through Apideck with serviceId "sage-intacct".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: sage-intacct
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
  difficulty: involved
  partnershipRequired: true
  sandboxAvailable: true
---

# Sage Intacct (via Apideck)

Access Sage Intacct through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Sage Intacct plumbing.

## Quick facts

- **Apideck serviceId:** `sage-intacct`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Apideck setup guide:** [Connection guide](https://developers.apideck.com/connectors/sage-intacct/docs/consumer+connection)
- **Gotchas:** [page](https://developers.apideck.com/apis/accounting/sage-intacct/gotchas)
- **Sage Intacct docs:** https://developer.intacct.com
- **Homepage:** https://www.sageintacct.com/

## At a glance

- **Implementation difficulty:** involved — Partnership + Custom Auth + Multiple Approvals
- **Vendor partnership required:** yes ([Sage Intacct Marketplace](https://marketplace.intacct.com/BecomeAPartner)) — A Sage Web Services developer license is required, via the Marketplace Partner Program. Apideck facilitates the introduction to Sage's Marketplace Partner team.
- **Apideck-managed credentials:** Not available — you supply the Sender ID once at integration level, and each consumer supplies their own Sage Intacct company login.
- **Account type required:** Sage Intacct with Web Services subscription enabled
- **Consumer access level:** Any Sage Intacct user with Web Services enabled and the Sender ID authorized in their company
- **Sandbox:** available — Sage provisions a sandbox with its own Sender ID on contract execution. Apideck's temporary shared sandbox requires an enterprise contract.
- **Costs:** Sage Intacct Marketplace Partner Program membership is $2,500/year, plus $0.015 per API call once your consumers are live. Effective August 2026.
- **Rate limits:** Sage Performance Tier 1 (default): 100K API transactions/month. One API plus one offline report job per company; a third waits 30s and errors if no spot opens.
- **Authentication:** Custom authentication — Sage Intacct XML Web Services using a Sender ID. Despite an OAuth2 label in the connector config, this is not a standard OAuth grant.
- **Webhooks:** Virtual webhooks — created, updated and deleted events across 9 resource families. Sage Intacct has no native webhooks.

**Important to know:**

- Sage titles this surface "About the XML API (Legacy)" and steers new work to REST. No sunset is announced and existing integrations stay supported, but legacy functions get no enhancements and individual legacy objects have been retired — weigh that on a long-term build.
- If a consumer skips authorizing your Sender ID in their company's Web Services settings, every call fails with errorno XL03000006, "Invalid Web Services Authorization", naming the unauthorized Sender ID.
- Approval process is multi-step (security questionnaire, discovery meeting, contract execution, development, API review, technical documentation, live demo call).
- Multi-entity companies require the entity/location ID in API calls — misconfiguration causes data access failures.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/sage-intacct` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user explicitly wants to work with **Sage Intacct** — for example, "create an invoice in Sage Intacct" or "reconcile payments in Sage Intacct". This skill teaches the agent:

1. Which Apideck unified API covers Sage Intacct (Accounting)
2. The correct `serviceId` to pass on every call (`sage-intacct`)
3. Sage Intacct-specific auth and coverage caveats

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

// List invoices in Sage Intacct
const { data } = await apideck.accounting.invoices.list({
  serviceId: "sage-intacct",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Sage Intacct to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Sage Intacct
await apideck.accounting.invoices.list({ serviceId: "sage-intacct" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Sage Intacct directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Sage Intacct via Apideck Accounting

Sage Intacct is a cloud accounting platform for mid-market. Apideck covers core finance entities.

### Entity mapping

| Intacct entity | Apideck Accounting resource |
|---|---|
| AR Invoice | `invoices` |
| AP Bill | `bills` |
| AR Payment / AP Payment | `payments` |
| Journal Entry (GLBATCH) | `journal-entries` |
| GL Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Item | `items` |

### Coverage highlights

- ✅ CRUD on invoices, bills, payments, customers, suppliers, items
- ✅ Multi-entity support (Intacct's Company structure)
- ✅ Multi-currency
- ⚠️ Dimensions (Department, Location, Class, Project) — exposed as custom fields where available
- ❌ Sage Intacct REST (beta) — separate auth-only connector; use standard XML connector via Apideck

### Auth

- **Type:** Basic auth (username / password + company ID), managed by Apideck Vault
- **Company ID required:** the user provides their Intacct Company ID alongside credentials — it's a per-tenant identifier, not a global login.
- **Sender credentials:** Apideck's Vault app already has the required Sender ID/password registered with Sage; the end-user provides only their own Intacct login.
- **Web Services subscription required:** Sage Intacct customers need the Web Services add-on enabled on their Intacct subscription before any API access works. If auth fails with "API not enabled," direct the user to their Intacct admin.

### Example: list invoices posted in last month

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "sage-intacct",
  filter: { updated_since: "2026-03-01T00:00:00Z" },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Sage Intacct directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Sage Intacct's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: sage-intacct" \
  -H "x-apideck-downstream-url: <target endpoint on Sage Intacct>" \
  -H "x-apideck-downstream-method: GET"
```

See [Sage Intacct's API docs](https://developer.intacct.com) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Apideck connection guide for Sage Intacct](https://developers.apideck.com/connectors/sage-intacct/docs/consumer+connection)
- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Sage Intacct official docs](https://developer.intacct.com)
