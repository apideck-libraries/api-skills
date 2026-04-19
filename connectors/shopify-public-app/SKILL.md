---
name: shopify-public-app
description: |
  Shopify (Public App) integration via Apideck's Ecommerce unified API — same methods work across every connector in Ecommerce, switch by changing `serviceId`. Use when the user wants to read, write, or sync orders, products, customers, and stores in Shopify (Public App). Routes through Apideck with serviceId "shopify-public-app".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: shopify-public-app
  unifiedApis: ["ecommerce"]
  authType: oauth2
  tier: "1b"
  verified: true
  status: beta
---

# Shopify (Public App) (via Apideck)

Access Shopify (Public App) through Apideck's **Ecommerce** unified API — one of 17 Ecommerce connectors that share the same method surface. Code you write here ports to Shopify, BigCommerce, WooCommerce and 13 other Ecommerce connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Shopify (Public App) plumbing.

> **Beta connector.** Shopify (Public App) is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `shopify-public-app`
- **Unified API:** Ecommerce
- **Auth type:** oauth2
- **Status:** beta
- **Shopify (Public App) docs:** https://shopify.dev/docs/apps
- **Homepage:** https://www.shopify.com/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Shopify (Public App)** — for example, "list orders in Shopify (Public App)" or "sync products in Shopify (Public App)". This skill teaches the agent:

1. Which Apideck unified API covers Shopify (Public App) (Ecommerce)
2. The correct `serviceId` to pass on every call (`shopify-public-app`)
3. Shopify (Public App)-specific auth and coverage caveats

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

// List orders in Shopify (Public App)
const { data } = await apideck.ecommerce.orders.list({
  serviceId: "shopify-public-app",
});
```

## Portable across 17 Ecommerce connectors

The Apideck **Ecommerce** unified API exposes the same methods for every connector in its catalog. Switching from Shopify (Public App) to another Ecommerce connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Shopify (Public App)
await apideck.ecommerce.orders.list({ serviceId: "shopify-public-app" });

// Tomorrow — same code, different connector
await apideck.ecommerce.orders.list({ serviceId: "shopify" });
await apideck.ecommerce.orders.list({ serviceId: "bigcommerce" });
```

This is the compounding advantage of using Apideck over integrating Shopify (Public App) directly: code against the unified Ecommerce API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Shopify Public App via Apideck Ecommerce

This is the OAuth-based Shopify connector, used when your app supports many Shopify merchants via the public App Store install flow. For single-store custom apps, use the `shopify` connector instead.

### When to use `shopify-public-app` vs `shopify`

| Use case | Connector |
|---|---|
| Your app is listed in the Shopify App Store | `shopify-public-app` |
| Your app is a custom app for one specific merchant | `shopify` |
| You want the merchant to authorize via OAuth | `shopify-public-app` |
| The merchant manually provides an admin access token | `shopify` |

Beyond the install flow, the surface (entities, coverage, examples) is identical to the `shopify` connector. See [`shopify`](../shopify/) for detailed Ecommerce mapping, coverage highlights, and worked examples.

### Public App auth notes

- **Type:** OAuth 2.0 via Shopify's install flow, managed by Apideck Vault
- **Typical scopes:** `read_orders`, `read_products`, `read_customers`, plus writes as needed. Apideck Vault requests the minimum configured.
- **Shop-per-install:** each install = one Shopify connection, bound to that specific `myshop.myshopify.com` domain.
- **Privacy webhooks:** Shopify requires public apps to handle mandatory privacy webhooks. Apideck's Vault app handles these; you don't need to implement them.
- **App review:** if you plan to publish on the App Store, Apideck's Vault app must be approved by Shopify. Contact Apideck support for review status.

### Example

Same as [`shopify`](../shopify/) — use `serviceId: "shopify-public-app"` instead of `"shopify"`.

## Verifying coverage

Not every Ecommerce operation is supported by every connector. Always verify before assuming a method works:

```bash
curl 'https://unify.apideck.com/connector/connectors/shopify-public-app' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}"
```

See [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) for patterns around `UnsupportedOperationError` and connector-specific fallbacks.

## Escape hatch: Proxy API

When an endpoint isn't covered by the Ecommerce unified API, use Apideck's Proxy to call Shopify (Public App) directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Shopify (Public App)'s own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: shopify-public-app" \
  -H "x-apideck-downstream-url: <target endpoint on Shopify (Public App)>" \
  -H "x-apideck-downstream-method: GET"
```

See [Shopify (Public App)'s API docs](https://shopify.dev/docs/apps) for available endpoints.

## Sibling connectors

Other **Ecommerce** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`shopify`](../shopify/) *(beta)*, [`bigcommerce`](../bigcommerce/) *(beta)*, [`woocommerce`](../woocommerce/) *(beta)*, [`amazon-seller-central`](../amazon-seller-central/) *(beta)*, [`ebay`](../ebay/) *(beta)*, [`etsy`](../etsy/) *(beta)*, [`magento`](../magento/) *(beta)*, [`bol-com`](../bol-com/) *(beta)*, and 8 more.

## See also

- [Ecommerce OpenAPI spec](https://specs.apideck.com/ecommerce.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=ecommerce)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Shopify (Public App) official docs](https://shopify.dev/docs/apps)
