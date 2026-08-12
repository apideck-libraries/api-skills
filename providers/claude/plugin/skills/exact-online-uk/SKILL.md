---
name: exact-online-uk
description: |
  Exact Online UK integration via Apideck's Accounting unified API — same methods work across every connector in Accounting, switch by changing `serviceId`. Use when the user wants to read, write, or reconcile invoices, bills, payments, ledger accounts, and journal entries in Exact Online UK. Routes through Apideck with serviceId "exact-online-uk".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: exact-online-uk
  unifiedApis: ["accounting"]
  authType: oauth2
  tier: "1a"
  verified: true
  status: beta
  difficulty: moderate
  partnershipRequired: true
  sandboxAvailable: true
---

# Exact Online UK (via Apideck)

Access Exact Online UK through Apideck's **Accounting** unified API — one of 34 Accounting connectors that share the same method surface. Code you write here ports to Access Financials, Acumatica, banqUP and 30 other Accounting connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Exact Online UK plumbing.

> **Beta connector.** Exact Online UK is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `exact-online-uk`
- **Unified API:** Accounting
- **Auth type:** oauth2
- **Status:** beta
- **Gotchas:** [page](https://developers.apideck.com/apis/accounting/exact-online-uk/gotchas)
- **Exact Online UK docs:** https://support.exactonline.com
- **Homepage:** https://www.exact.com/uk

## At a glance

- **Implementation difficulty:** moderate — Paid Developer Subscription + App Review Required for External Consumers
- **Vendor partnership required:** yes ([Exact Online App Store (Manage my apps)](https://apps.exactonline.com/gb/)) — Yes — registering your app requires a paid Exact Online developer subscription (per country); App Store listing is optional.
- **Apideck-managed credentials:** not available
- **Account type required:** Active Exact Online subscription on the UK instance
- **Consumer access level:** Any user who can authorise third-party app connections; at consent time the app must be granted access to each division (administration) it needs to access.
- **Sandbox:** available — No isolated sandbox — test with your UK developer subscription or a free 30-day UK trial (includes demo data).
- **Costs:** Developer subscription approx. €15/month per country (excl. VAT); no per-call charges. Consumers need a paid subscription after the 30-day trial.
- **Rate limits:** 60 requests/minute and 5,000 requests/day per app per division; Exact Online Premium raises the daily cap to 30,000.
- **Authentication:** OAuth 2.0 (Authorization Code). Access tokens last 10 minutes.
- **Webhooks:** No webhooks — data sync is polling-based.

**Important to know:**

- Exact Online runs separate country instances — an app registered in one country cannot serve consumers in another. For regions beyond this instance, use exact-online (per-connection region) or exact-online-nl.
- Your app must pass Exact's review before consumers outside your own Exact instance can connect — until it does, only your own subscription can be linked, which blocks pilot consumers.
- Refresh tokens are single-use and expire after 30 days of inactivity — a dormant connection must be re-authorised by the consumer.
- Write coverage is narrowest here: master data is read-only on all three Exact Online connectors, and on this UK connector bills are read-only too. Invoices, invoice items, payments, bill payments and journal entries accept writes.
- If you are integrating for a single consumer, that consumer can register an internal app (an API key in their own Exact Online environment) instead — this avoids the developer's subscription, but the app can only ever be linked to that one subscription.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/exact-online-uk` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user explicitly wants to work with **Exact Online UK** — for example, "create an invoice in Exact Online UK" or "reconcile payments in Exact Online UK". This skill teaches the agent:

1. Which Apideck unified API covers Exact Online UK (Accounting)
2. The correct `serviceId` to pass on every call (`exact-online-uk`)
3. Exact Online UK-specific auth and coverage caveats

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

// List invoices in Exact Online UK
const { data } = await apideck.accounting.invoices.list({
  serviceId: "exact-online-uk",
});
```

## Portable across 34 Accounting connectors

The Apideck **Accounting** unified API exposes the same methods for every connector in its catalog. Switching from Exact Online UK to another Accounting connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Exact Online UK
await apideck.accounting.invoices.list({ serviceId: "exact-online-uk" });

// Tomorrow — same code, different connector
await apideck.accounting.invoices.list({ serviceId: "access-financials" });
await apideck.accounting.invoices.list({ serviceId: "acumatica" });
```

This is the compounding advantage of using Apideck over integrating Exact Online UK directly: code against the unified Accounting API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Exact Online UK via Apideck Accounting

UK-specific variant of Exact Online. Use this connector when the user's Exact instance is on the UK data center. Coverage mirrors [`exact-online`](../exact-online/).

### When to use this vs `exact-online`

| User scenario | Use |
|---|---|
| User's division is in the UK | `exact-online-uk` |
| User's division is in the Netherlands | `exact-online-nl` |
| User's division is in Belgium or other EU | `exact-online` |

### Entity mapping + coverage

Identical to [`exact-online`](../exact-online/). See that skill for the full mapping table and coverage highlights.

Key UK-specific behaviors:
- **VAT handling:** UK 20% / 5% / 0% rates; Brexit-era rules (reverse charge on EU imports) handled through `tax-rates`.
- **Making Tax Digital (MTD) compliance:** UK divisions may have MTD-specific fields on invoices (HMRC submission). Use Proxy for MTD submission endpoints not covered by the unified model.
- **Currency:** typically GBP-denominated; multi-currency supported for international customers.

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Data center:** `start.exactonline.co.uk`. Wrong-DC errors = wrong connector variant.

### Example: list customers with invoices due in 30 days

```typescript
const { data: invoices } = await apideck.accounting.invoices.list({
  serviceId: "exact-online-uk",
  filter: { status: "open" },
});
```

## Verifying coverage

Not every Accounting operation is supported by every connector. Always verify before assuming a method works:

```bash
curl 'https://unify.apideck.com/connector/connectors/exact-online-uk' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}"
```

See [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) for patterns around `UnsupportedOperationError` and connector-specific fallbacks.

## Escape hatch: Proxy API

When an endpoint isn't covered by the Accounting unified API, use Apideck's Proxy to call Exact Online UK directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Exact Online UK's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: exact-online-uk" \
  -H "x-apideck-downstream-url: <target endpoint on Exact Online UK>" \
  -H "x-apideck-downstream-method: GET"
```

See [Exact Online UK's API docs](https://support.exactonline.com) for available endpoints.

## Sibling connectors

Other **Accounting** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`access-financials`](../access-financials/) *(beta)*, [`acumatica`](../acumatica/) *(beta)*, [`banqup`](../banqup/) *(beta)*, [`campfire`](../campfire/) *(beta)*, [`clearbooks-uk`](../clearbooks-uk/) *(beta)*, [`digits`](../digits/) *(beta)*, [`dualentry`](../dualentry/), [`exact-online`](../exact-online/), and 25 more.

## See also

- [Accounting OpenAPI spec](https://specs.apideck.com/accounting.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=accounting)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Exact Online UK official docs](https://support.exactonline.com)
