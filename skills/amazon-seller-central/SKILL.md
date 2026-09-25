---
name: amazon-seller-central
description: |
  Amazon Seller Central integration via Apideck's Ecommerce unified API — same methods work across every connector in Ecommerce, switch by changing `serviceId`. Use when the user wants to read, write, or sync orders, products, customers, and stores in Amazon Seller Central. Routes through Apideck with serviceId "amazon-seller-central".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: amazon-seller-central
  unifiedApis: ["ecommerce"]
  authType: oauth2
  tier: "1c"
  verified: true
  status: beta
  difficulty: moderate
  partnershipRequired: false
  sandboxAvailable: true
---

# Amazon Seller Central (via Apideck)

Access Amazon Seller Central through Apideck's **Ecommerce** unified API — one of 17 Ecommerce connectors that share the same method surface. Code you write here ports to Shopify, BigCommerce, Shopify (Public App) and 13 other Ecommerce connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Amazon Seller Central plumbing.

> **Beta connector.** Amazon Seller Central is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `amazon-seller-central`
- **Unified API:** Ecommerce
- **Auth type:** oauth2
- **Status:** beta
- **Apideck setup guide:** [Connection guide](https://developers.apideck.com/connectors/amazon-seller-central/docs/consumer+connection)
- **Gotchas:** [page](https://developers.apideck.com/apis/ecommerce/amazon-seller-central/gotchas)
- **Amazon Seller Central docs:** https://developer-docs.amazon.com/sp-api/

## At a glance

- **Implementation difficulty:** moderate — Self-Service Developer Signup + Mandatory Production/Published App Review Required
- **Vendor partnership required:** no ([Amazon Selling Partner API — Public Developer Registration](https://developer-docs.amazon.com/sp-api/docs/register-as-a-public-developer)) — No signed contract. Registration as a Public SP-API Developer is free and self-service.
- **Apideck-managed credentials:** not available — Every application owner registers and publishes their own SP-API app with Amazon.
- **Account type required:** An active Amazon Seller Central account, in a marketplace the integration covers.
- **Consumer access level:** A Seller Central user with the account's Develop Apps (API authorization) permission completes the consent.
- **Sandbox:** available ([signup](https://developer-docs.amazon.com/sp-api/docs/sp-api-sandbox)) — Amazon's own SP-API sandbox returns mock responses, but sits on Amazon's sandbox endpoints and cannot be reached through this connector.
- **Costs:** Free to build. Amazon charges nothing for access to the Selling Partner API itself.
- **Rate limits:** Per-operation token buckets (a refill rate plus a burst), scoped per seller account and application; some operations use limits Amazon adjusts dynamically.
- **Authentication:** Authorization Code flow via Login with Amazon (LWA).
- **Webhooks:** No webhooks — Amazon Seller Central offers no native or virtual webhook support here, so data is kept in sync by polling.

**Important to know:**

- Amazon's consent screen rejects a Draft or Sandbox SP-API app, so no connection, not even a test one, can be made through Apideck until the app reaches Published status. Amazon returns error MD9100.
- Every SP-API application's Login with Amazon client secret must be rotated every 180 days, or Amazon blocks all API calls for that application. Amazon gives 90 days' notice, but this is a standing operational duty for the life of the integration, not a one-off setup step.
- Amazon requires each selling partner to reauthorise a public application every 365 days, and again whenever a role is added to it, so annual re-consent by every connected seller has to be planned into the integration.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/amazon-seller-central` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user explicitly wants to work with **Amazon Seller Central** — for example, "list orders in Amazon Seller Central" or "sync products in Amazon Seller Central". This skill teaches the agent:

1. Which Apideck unified API covers Amazon Seller Central (Ecommerce)
2. The correct `serviceId` to pass on every call (`amazon-seller-central`)
3. Amazon Seller Central-specific auth and coverage caveats

For the full method surface (parameters, pagination, filtering), use your language SDK skill:

- [`apideck-node`](../../skills/apideck-node/), [`apideck-python`](../../skills/apideck-python/), [`apideck-dotnet`](../../skills/apideck-dotnet/), [`apideck-java`](../../skills/apideck-java/), [`apideck-go`](../../skills/apideck-go/), [`apideck-php`](../../skills/apideck-php/), or [`apideck-rest`](../../skills/apideck-rest/)

For the raw OpenAPI spec:

- **Ecommerce:** [https://specs.apideck.com/ecommerce.yml](https://specs.apideck.com/ecommerce.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=ecommerce)

## Minimal example (TypeScript)

```typescript
import { Apideck } from "@apideck/unify";

const apideck = new Apideck({
  apiKey: process.env.APIDECK_API_KEY,
  appId: process.env.APIDECK_APP_ID,
  consumerId: "your-consumer-id",
});

// List orders in Amazon Seller Central
const { data } = await apideck.ecommerce.orders.list({
  serviceId: "amazon-seller-central",
});
```

## Portable across 17 Ecommerce connectors

The Apideck **Ecommerce** unified API exposes the same methods for every connector in its catalog. Switching from Amazon Seller Central to another Ecommerce connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Amazon Seller Central
await apideck.ecommerce.orders.list({ serviceId: "amazon-seller-central" });

// Tomorrow — same code, different connector
await apideck.ecommerce.orders.list({ serviceId: "shopify" });
await apideck.ecommerce.orders.list({ serviceId: "bigcommerce" });
```

This is the compounding advantage of using Apideck over integrating Amazon Seller Central directly: code against the unified Ecommerce API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Authentication

- **Type:** OAuth 2.0
- **Managed by:** Apideck Vault — Apideck handles the full OAuth dance (authorization code flow, token exchange, refresh). Never ask the user for API keys or tokens directly.
- **User setup:** Users authorize via the Vault modal. Connection state progresses `available → added → authorized → callable`.
- **Token refresh:** automatic. Expired tokens are refreshed transparently on the next API call.

**Setup guide:** Apideck publishes a step-by-step guide for registering an OAuth app / configuring credentials for Amazon Seller Central — see [https://developers.apideck.com/connectors/amazon-seller-central/docs/consumer+connection](https://developers.apideck.com/connectors/amazon-seller-central/docs/consumer+connection). Use that as the authoritative source when walking users through connection setup.

See [`apideck-best-practices`](../../skills/apideck-best-practices/) for Vault setup, connection lifecycle, and handling re-auth flows.

## Verifying coverage

Not every Ecommerce operation is supported by every connector. Always verify before assuming a method works:

```bash
curl 'https://unify.apideck.com/connector/connectors/amazon-seller-central' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}"
```

See [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) for patterns around `UnsupportedOperationError` and connector-specific fallbacks.

## Escape hatch: Proxy API

When an endpoint isn't covered by the Ecommerce unified API, use Apideck's Proxy to call Amazon Seller Central directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Amazon Seller Central's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: amazon-seller-central" \
  -H "x-apideck-downstream-url: <target endpoint on Amazon Seller Central>" \
  -H "x-apideck-downstream-method: GET"
```

See [Amazon Seller Central's API docs](https://developer-docs.amazon.com/sp-api/) for available endpoints.

## Sibling connectors

Other **Ecommerce** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`shopify`](../shopify/) *(beta)*, [`bigcommerce`](../bigcommerce/) *(beta)*, [`shopify-public-app`](../shopify-public-app/) *(beta)*, [`woocommerce`](../woocommerce/) *(beta)*, [`ebay`](../ebay/) *(beta)*, [`etsy`](../etsy/) *(beta)*, [`magento`](../magento/) *(beta)*, [`bol-com`](../bol-com/) *(beta)*, and 8 more.

## See also

- [Apideck connection guide for Amazon Seller Central](https://developers.apideck.com/connectors/amazon-seller-central/docs/consumer+connection)
- [Ecommerce OpenAPI spec](https://specs.apideck.com/ecommerce.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=ecommerce)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Amazon Seller Central official docs](https://developer-docs.amazon.com/sp-api/)
