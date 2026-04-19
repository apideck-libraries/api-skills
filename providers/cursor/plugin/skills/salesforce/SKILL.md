---
name: salesforce
description: |
  Salesforce integration via Apideck's CRM unified API — same methods work across every connector in CRM, switch by changing `serviceId`. Use when the user wants to read, write, or search contacts, companies, leads, opportunities, activities, and pipelines in Salesforce. Routes through Apideck with serviceId "salesforce".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: salesforce
  unifiedApis: ["crm"]
  authType: oauth2
  tier: "1a"
  verified: true
---

# Salesforce (via Apideck)

Access Salesforce through Apideck's **CRM** unified API — one of 21 CRM connectors that share the same method surface. Code you write here ports to HubSpot, Pipedrive, Zoho CRM and 17 other CRM connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Salesforce plumbing.

## Quick facts

- **Apideck serviceId:** `salesforce`
- **Unified API:** CRM
- **Auth type:** oauth2
- **Salesforce docs:** https://developer.salesforce.com/docs
- **Homepage:** https://www.salesforce.com

## When to use this skill

Activate this skill when the user explicitly wants to work with **Salesforce** — for example, "pull contacts in Salesforce" or "sync leads in Salesforce". This skill teaches the agent:

1. Which Apideck unified API covers Salesforce (CRM)
2. The correct `serviceId` to pass on every call (`salesforce`)
3. Salesforce-specific auth and coverage caveats

For the full method surface (parameters, pagination, filtering), use your language SDK skill:

- [`apideck-node`](../../skills/apideck-node/), [`apideck-python`](../../skills/apideck-python/), [`apideck-dotnet`](../../skills/apideck-dotnet/), [`apideck-java`](../../skills/apideck-java/), [`apideck-go`](../../skills/apideck-go/), [`apideck-php`](../../skills/apideck-php/), or [`apideck-rest`](../../skills/apideck-rest/)

For the raw OpenAPI spec:

- **CRM:** [https://specs.apideck.com/crm.yml](https://specs.apideck.com/crm.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=crm)

## Minimal example (TypeScript)

```typescript
import { Apideck } from "@apideck/unify";

const apideck = new Apideck({
  apiKey: process.env.APIDECK_API_KEY,
  appId: process.env.APIDECK_APP_ID,
  consumerId: "your-consumer-id",
});

// List contacts in Salesforce
const { data } = await apideck.crm.contacts.list({
  serviceId: "salesforce",
});
```

## Portable across 21 CRM connectors

The Apideck **CRM** unified API exposes the same methods for every connector in its catalog. Switching from Salesforce to another CRM connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Salesforce
await apideck.crm.contacts.list({ serviceId: "salesforce" });

// Tomorrow — same code, different connector
await apideck.crm.contacts.list({ serviceId: "hubspot" });
await apideck.crm.contacts.list({ serviceId: "pipedrive" });
```

This is the compounding advantage of using Apideck over integrating Salesforce directly: code against the unified CRM API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Salesforce via Apideck CRM

Salesforce is the reference implementation for Apideck CRM. All Tier 1 CRM resources are supported; coverage is the most complete of any CRM connector.

### Entity mapping

| Salesforce object | Apideck CRM resource |
|---|---|
| Contact | `contacts` |
| Account | `companies` |
| Lead | `leads` |
| Opportunity | `opportunities` |
| Task, Event | `activities` |
| User | `users` |
| Note (Task with note body) | `notes` |
| OpportunityStage / pipeline config | `pipelines` |
| Custom objects (`*__c`) | use Proxy API — not exposed through unified resources |

### Coverage highlights

- ✅ Full CRUD on contacts, companies, leads, opportunities, activities, notes
- ✅ Pagination via cursor (Apideck normalizes SOQL `LIMIT` / `OFFSET` into cursor tokens)
- ✅ Field-level filtering via `filter[...]` query params
- ✅ Deep pagination beyond 2,000 records (Apideck uses `queryMore` / `nextRecordsUrl` under the hood)
- ❌ Custom objects — use Proxy API with the SOQL endpoint
- ❌ Apex REST endpoints — Proxy API
- ❌ Bulk API (2.0) job creation — Proxy API

### Salesforce-specific auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Sandboxes:** Apideck supports both production and sandbox orgs. Environment is selected during the Vault OAuth flow; the same `serviceId` routes to both.
- **Session timeout:** Salesforce sessions expire based on org profile settings. Apideck's token refresh handles this transparently. If you see `INVALID_SESSION_ID` after refresh, the connection state is likely `invalid` and needs re-authorization.
- **API limits:** Salesforce enforces per-org daily API call limits. Apideck surfaces rate-limit headers via the `raw=true` parameter — monitor these in production.

### Common Salesforce quirks handled by Apideck

- **Compound fields** (e.g., `BillingAddress`) — flattened to `address.*` in the unified shape
- **Picklist values** — exposed verbatim; no enum normalization
- **Record types** — available as `record_type_id` on writes; if omitted Salesforce uses the default for the user's profile
- **Polymorphic references** (e.g., `WhoId` on Task) — Apideck resolves to the correct entity type in `activity.owner_id`

### Example: create an opportunity with a contact role

```typescript
// 1. Create the opportunity
const { data: opp } = await apideck.crm.opportunities.create({
  serviceId: "salesforce",
  opportunity: {
    name: "Acme — Enterprise deal",
    amount: 50000,
    close_date: "2026-06-30",
    stage: "Qualification",
    company_id: "001XXXXXXXXXXXXXXX",
  },
});

// 2. For contact roles (Salesforce-specific), use Proxy
await fetch("https://unify.apideck.com/proxy", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.APIDECK_API_KEY}`,
    "x-apideck-app-id": process.env.APIDECK_APP_ID,
    "x-apideck-consumer-id": consumerId,
    "x-apideck-service-id": "salesforce",
    "x-apideck-downstream-url": "/services/data/v59.0/sobjects/OpportunityContactRole",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    OpportunityId: opp.data.id,
    ContactId: "003XXXXXXXXXXXXXXX",
    Role: "Decision Maker",
  }),
});
```

## Sibling connectors

Other **CRM** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`hubspot`](../hubspot/), [`pipedrive`](../pipedrive/), [`zoho-crm`](../zoho-crm/), [`activecampaign`](../activecampaign/), [`close`](../close/), [`microsoft-dynamics`](../microsoft-dynamics/), [`teamleader`](../teamleader/), [`zendesk-sell`](../zendesk-sell/), and 12 more.

## See also

- [CRM OpenAPI spec](https://specs.apideck.com/crm.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=crm)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Salesforce official docs](https://developer.salesforce.com/docs)
