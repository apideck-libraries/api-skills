---
name: odoo
description: |
  Odoo integration via Apideck's CRM, Accounting unified API — same methods work across every connector in CRM, Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or search contacts, companies, leads, opportunities, activities, and pipelines in Odoo. Routes through Apideck with serviceId "odoo".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: odoo
  unifiedApis: ["crm", "accounting"]
  authType: basic
  tier: "2"
  verified: true
  status: beta
---

# Odoo (via Apideck)

Access Odoo through Apideck's **CRM, Accounting** unified API — one of 21 CRM connectors that share the same method surface. Code you write here ports to Salesforce, HubSpot, Pipedrive and 17 other CRM connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Odoo plumbing.

> **Beta connector.** Odoo is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `odoo`
- **Unified APIs:** CRM, Accounting
- **Auth type:** basic
- **Status:** beta
- **Odoo docs:** https://www.odoo.com/documentation/
- **Homepage:** https://www.odoo.com/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Odoo** — for example, "pull contacts in Odoo" or "sync leads in Odoo". This skill teaches the agent:

1. Which Apideck unified API covers Odoo (CRM, Accounting)
2. The correct `serviceId` to pass on every call (`odoo`)
3. Odoo-specific auth and coverage caveats

For the full method surface (parameters, pagination, filtering), use your language SDK skill:

- [`apideck-node`](../../skills/apideck-node/), [`apideck-python`](../../skills/apideck-python/), [`apideck-dotnet`](../../skills/apideck-dotnet/), [`apideck-java`](../../skills/apideck-java/), [`apideck-go`](../../skills/apideck-go/), [`apideck-php`](../../skills/apideck-php/), or [`apideck-rest`](../../skills/apideck-rest/)

For the raw OpenAPI spec:

- **CRM:** [https://specs.apideck.com/crm.yml](https://specs.apideck.com/crm.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=crm)
- **Accounting:** [https://specs.apideck.com/accounting.yml](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)

## Minimal example (TypeScript)

```typescript
import { Apideck } from "@apideck/unify";

const apideck = new Apideck({
  apiKey: process.env.APIDECK_API_KEY,
  appId: process.env.APIDECK_APP_ID,
  consumerId: "your-consumer-id",
});

// List contacts in Odoo
const { data } = await apideck.crm.contacts.list({
  serviceId: "odoo",
});
```

## Portable across 21 CRM connectors

The Apideck **CRM** unified API exposes the same methods for every connector in its catalog. Switching from Odoo to another CRM connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Odoo
await apideck.crm.contacts.list({ serviceId: "odoo" });

// Tomorrow — same code, different connector
await apideck.crm.contacts.list({ serviceId: "salesforce" });
await apideck.crm.contacts.list({ serviceId: "hubspot" });
```

This is the compounding advantage of using Apideck over integrating Odoo directly: code against the unified CRM API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Authentication

- **Type:** Basic auth (username/password)
- **Managed by:** Apideck Vault — credentials are collected through the Vault modal and stored encrypted server-side.
- **Note:** basic auth connectors often require manual rotation by the end user. If auth fails persistently, prompt them to re-enter credentials in Vault.

See [`apideck-best-practices`](../../skills/apideck-best-practices/) for Vault setup, connection lifecycle, and handling re-auth flows.

## Verifying coverage

Not every CRM operation is supported by every connector. Always verify before assuming a method works:

```bash
curl 'https://unify.apideck.com/connector/connectors/odoo' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}"
```

See [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) for patterns around `UnsupportedOperationError` and connector-specific fallbacks.

## Escape hatch: Proxy API

When an endpoint isn't covered by the CRM unified API, use Apideck's Proxy to call Odoo directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Odoo's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: odoo" \
  -H "x-apideck-downstream-url: <target endpoint on Odoo>" \
  -H "x-apideck-downstream-method: GET"
```

See [Odoo's API docs](https://www.odoo.com/documentation/) for available endpoints.

## Sibling connectors

Other **CRM** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`salesforce`](../salesforce/), [`hubspot`](../hubspot/), [`pipedrive`](../pipedrive/), [`zoho-crm`](../zoho-crm/), [`activecampaign`](../activecampaign/), [`close`](../close/), [`microsoft-dynamics`](../microsoft-dynamics/), [`teamleader`](../teamleader/), and 12 more.

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`quickbooks`](../quickbooks/), [`netsuite`](../netsuite/), [`sage-intacct`](../sage-intacct/), [`workday`](../workday/), [`xero`](../xero/), [`exact-online`](../exact-online/), [`freeagent`](../freeagent/) *(beta)*, [`freshbooks`](../freshbooks/), and 25 more.

## See also

- [CRM OpenAPI spec](https://specs.apideck.com/crm.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=crm)
- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Odoo official docs](https://www.odoo.com/documentation/)
