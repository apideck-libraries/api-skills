---
name: woocommerce
description: |
  WooCommerce integration via Apideck's Ecommerce unified API — same methods work across every connector in Ecommerce, switch by changing `serviceId`. Use when the user wants to read, write, or sync orders, products, customers, and stores in WooCommerce. Routes through Apideck with serviceId "woocommerce".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: woocommerce
  unifiedApis: ["ecommerce"]
  authType: custom
  tier: "1b"
  verified: true
  status: beta
---

# WooCommerce (via Apideck)

Access WooCommerce through Apideck's **Ecommerce** unified API — one of 17 Ecommerce connectors that share the same method surface. Code you write here ports to Shopify, BigCommerce, Shopify (Public App) and 13 other Ecommerce connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant WooCommerce plumbing.

> **Beta connector.** WooCommerce is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `woocommerce`
- **Unified API:** Ecommerce
- **Auth type:** custom
- **Status:** beta
- **WooCommerce docs:** https://woocommerce.github.io/woocommerce-rest-api-docs/
- **Homepage:** https://woocommerce.com/

## When to use this skill

Activate this skill when the user explicitly wants to work with **WooCommerce** — for example, "list orders in WooCommerce" or "sync products in WooCommerce". This skill teaches the agent:

1. Which Apideck unified API covers WooCommerce (Ecommerce)
2. The correct `serviceId` to pass on every call (`woocommerce`)
3. WooCommerce-specific auth and coverage caveats

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

// List orders in WooCommerce
const { data } = await apideck.ecommerce.orders.list({
  serviceId: "woocommerce",
});
```

## Portable across 17 Ecommerce connectors

The Apideck **Ecommerce** unified API exposes the same methods for every connector in its catalog. Switching from WooCommerce to another Ecommerce connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — WooCommerce
await apideck.ecommerce.orders.list({ serviceId: "woocommerce" });

// Tomorrow — same code, different connector
await apideck.ecommerce.orders.list({ serviceId: "shopify" });
await apideck.ecommerce.orders.list({ serviceId: "bigcommerce" });
```

This is the compounding advantage of using Apideck over integrating WooCommerce directly: code against the unified Ecommerce API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## WooCommerce via Apideck Ecommerce

WooCommerce is the WordPress-plugin ecommerce platform. Apideck covers the REST API for orders, products, and customers.

### Entity mapping

| WooCommerce entity | Apideck Ecommerce resource |
|---|---|
| Order | `orders` |
| Product | `products` |
| Customer | `customers` |
| Store settings | `stores` |
| Variation (variable product) | nested under `products[].variants[]` |

### Coverage highlights

- ✅ CRUD on orders, products, customers
- ✅ Variable products with variants
- ❌ Shipping zones, coupons, tax settings — use Proxy
- ❌ WooCommerce Subscriptions, Memberships (paid add-ons) — use Proxy

### Auth

- **Type:** API key (consumer key + consumer secret generated in WooCommerce admin), managed by Apideck Vault
- **Site binding:** each connection points to one WordPress site (store URL).
- **HTTPS required:** WooCommerce REST API requires HTTPS; sites using self-signed certs may fail auth.

### Example: list processing orders

```typescript
const { data } = await apideck.ecommerce.orders.list({
  serviceId: "woocommerce",
  filter: { status: "processing" },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Ecommerce unified API, use Apideck's Proxy to call WooCommerce directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on WooCommerce's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: woocommerce" \
  -H "x-apideck-downstream-url: <target endpoint on WooCommerce>" \
  -H "x-apideck-downstream-method: GET"
```

See [WooCommerce's API docs](https://woocommerce.github.io/woocommerce-rest-api-docs/) for available endpoints.

## Sibling connectors

Other **Ecommerce** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`shopify`](../shopify/) *(beta)*, [`bigcommerce`](../bigcommerce/) *(beta)*, [`shopify-public-app`](../shopify-public-app/) *(beta)*, [`amazon-seller-central`](../amazon-seller-central/) *(beta)*, [`ebay`](../ebay/) *(beta)*, [`etsy`](../etsy/) *(beta)*, [`magento`](../magento/) *(beta)*, [`bol-com`](../bol-com/) *(beta)*, and 8 more.

## See also

- [Ecommerce OpenAPI spec](https://specs.apideck.com/ecommerce.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=ecommerce)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [WooCommerce official docs](https://woocommerce.github.io/woocommerce-rest-api-docs/)
