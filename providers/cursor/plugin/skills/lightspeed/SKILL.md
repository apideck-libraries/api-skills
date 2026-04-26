---
name: lightspeed
description: |
  Lightspeed integration via Apideck's Ecommerce unified API — same methods work across every connector in Ecommerce, switch by changing `serviceId`. Use when the user wants to read, write, or sync orders, products, customers, and stores in Lightspeed. Routes through Apideck with serviceId "lightspeed".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: lightspeed
  unifiedApis: ["ecommerce"]
  authType: oauth2
  tier: "2"
  verified: true
  status: beta
---

# Lightspeed (via Apideck)

Access Lightspeed through Apideck's **Ecommerce** unified API — one of 17 Ecommerce connectors that share the same method surface. Code you write here ports to Shopify, BigCommerce, Shopify (Public App) and 13 other Ecommerce connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Lightspeed plumbing.

> **Beta connector.** Lightspeed is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `lightspeed`
- **Unified API:** Ecommerce
- **Auth type:** oauth2
- **Status:** beta
- **Gotchas:** [page](https://developers.apideck.com/apis/ecommerce/lightspeed/gotchas)
- **Lightspeed docs:** https://developers.lightspeedhq.com
- **Homepage:** https://lightspeedhq.com

## When to use this skill

Activate this skill when the user explicitly wants to work with **Lightspeed** — for example, "list orders in Lightspeed" or "sync products in Lightspeed". This skill teaches the agent:

1. Which Apideck unified API covers Lightspeed (Ecommerce)
2. The correct `serviceId` to pass on every call (`lightspeed`)
3. Lightspeed-specific auth and coverage caveats

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

// List orders in Lightspeed
const { data } = await apideck.ecommerce.orders.list({
  serviceId: "lightspeed",
});
```

## Portable across 17 Ecommerce connectors

The Apideck **Ecommerce** unified API exposes the same methods for every connector in its catalog. Switching from Lightspeed to another Ecommerce connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Lightspeed
await apideck.ecommerce.orders.list({ serviceId: "lightspeed" });

// Tomorrow — same code, different connector
await apideck.ecommerce.orders.list({ serviceId: "shopify" });
await apideck.ecommerce.orders.list({ serviceId: "bigcommerce" });
```

This is the compounding advantage of using Apideck over integrating Lightspeed directly: code against the unified Ecommerce API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Authentication

- **Type:** OAuth 2.0
- **Managed by:** Apideck Vault — Apideck handles the full OAuth dance (authorization code flow, token exchange, refresh). Never ask the user for API keys or tokens directly.
- **User setup:** Users authorize via the Vault modal. Connection state progresses `available → added → authorized → callable`.
- **Token refresh:** automatic. Expired tokens are refreshed transparently on the next API call.

See [`apideck-best-practices`](../../skills/apideck-best-practices/) for Vault setup, connection lifecycle, and handling re-auth flows.

## Verifying coverage

Not every Ecommerce operation is supported by every connector. Always verify before assuming a method works:

```bash
curl 'https://unify.apideck.com/connector/connectors/lightspeed' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}"
```

See [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) for patterns around `UnsupportedOperationError` and connector-specific fallbacks.

## Escape hatch: Proxy API

When an endpoint isn't covered by the Ecommerce unified API, use Apideck's Proxy to call Lightspeed directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Lightspeed's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: lightspeed" \
  -H "x-apideck-downstream-url: <target endpoint on Lightspeed>" \
  -H "x-apideck-downstream-method: GET"
```

See [Lightspeed's API docs](https://developers.lightspeedhq.com) for available endpoints.

## Sibling connectors

Other **Ecommerce** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`shopify`](../shopify/) *(beta)*, [`bigcommerce`](../bigcommerce/) *(beta)*, [`shopify-public-app`](../shopify-public-app/) *(beta)*, [`woocommerce`](../woocommerce/) *(beta)*, [`amazon-seller-central`](../amazon-seller-central/) *(beta)*, [`ebay`](../ebay/) *(beta)*, [`etsy`](../etsy/) *(beta)*, [`magento`](../magento/) *(beta)*, and 8 more.

## See also

- [Ecommerce OpenAPI spec](https://specs.apideck.com/ecommerce.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=ecommerce)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Lightspeed official docs](https://developers.lightspeedhq.com)
