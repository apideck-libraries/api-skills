---
name: bigcommerce
description: |
  BigCommerce integration via Apideck's Ecommerce unified API — same methods work across every connector in Ecommerce, switch by changing `serviceId`. Use when the user wants to read, write, or sync orders, products, customers, and stores in BigCommerce. Routes through Apideck with serviceId "bigcommerce".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: bigcommerce
  unifiedApis: ["ecommerce"]
  authType: apiKey
  tier: "1b"
  verified: true
  status: beta
---

# BigCommerce (via Apideck)

Access BigCommerce through Apideck's **Ecommerce** unified API — one of 17 Ecommerce connectors that share the same method surface. Code you write here ports to Shopify, Shopify (Public App), WooCommerce and 13 other Ecommerce connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant BigCommerce plumbing.

> **Beta connector.** BigCommerce is currently in beta on Apideck. Expect partial resource coverage and occasional mapping gaps. Always verify coverage (see below) and fall back to the Proxy API for unsupported operations.

## Quick facts

- **Apideck serviceId:** `bigcommerce`
- **Unified API:** Ecommerce
- **Auth type:** apiKey
- **Status:** beta
- **Gotchas:** [page](https://developers.apideck.com/apis/ecommerce/bigcommerce/gotchas)
- **BigCommerce docs:** https://developer.bigcommerce.com
- **Homepage:** https://www.bigcommerce.com/

## When to use this skill

Activate this skill when the user explicitly wants to work with **BigCommerce** — for example, "list orders in BigCommerce" or "sync products in BigCommerce". This skill teaches the agent:

1. Which Apideck unified API covers BigCommerce (Ecommerce)
2. The correct `serviceId` to pass on every call (`bigcommerce`)
3. BigCommerce-specific auth and coverage caveats

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

// List orders in BigCommerce
const { data } = await apideck.ecommerce.orders.list({
  serviceId: "bigcommerce",
});
```

## Portable across 17 Ecommerce connectors

The Apideck **Ecommerce** unified API exposes the same methods for every connector in its catalog. Switching from BigCommerce to another Ecommerce connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — BigCommerce
await apideck.ecommerce.orders.list({ serviceId: "bigcommerce" });

// Tomorrow — same code, different connector
await apideck.ecommerce.orders.list({ serviceId: "shopify" });
await apideck.ecommerce.orders.list({ serviceId: "shopify-public-app" });
```

This is the compounding advantage of using Apideck over integrating BigCommerce directly: code against the unified Ecommerce API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## BigCommerce via Apideck Ecommerce

BigCommerce is a mid-market ecommerce platform. Apideck covers the storefront catalog + order/customer data.

### Entity mapping

| BigCommerce entity | Apideck Ecommerce resource |
|---|---|
| Order | `orders` |
| Product | `products` |
| Customer | `customers` |
| Store settings | `stores` |
| Variant | nested under `products[].variants[]` |
| Category | use Proxy |
| Brand | use Proxy |

### Coverage highlights

- ✅ Orders (list, get)
- ✅ Products with variants (list, get, create, update)
- ✅ Customers (list, get, create)
- ❌ Inventory, price lists, promotions — use Proxy

### Auth

- **Type:** API key (Store API token + client ID), managed by Apideck Vault
- **Store binding:** each connection = one BigCommerce store hash.
- **Scopes:** the API token's scopes determine what's callable. For full catalog + orders, create a token with broad read/write.

### Example: list orders from the last week

```typescript
const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

const { data } = await apideck.ecommerce.orders.list({
  serviceId: "bigcommerce",
  filter: { updated_since: since },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the Ecommerce unified API, use Apideck's Proxy to call BigCommerce directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on BigCommerce's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: bigcommerce" \
  -H "x-apideck-downstream-url: <target endpoint on BigCommerce>" \
  -H "x-apideck-downstream-method: GET"
```

See [BigCommerce's API docs](https://developer.bigcommerce.com) for available endpoints.

## Sibling connectors

Other **Ecommerce** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`shopify`](../shopify/) *(beta)*, [`shopify-public-app`](../shopify-public-app/) *(beta)*, [`woocommerce`](../woocommerce/) *(beta)*, [`amazon-seller-central`](../amazon-seller-central/) *(beta)*, [`ebay`](../ebay/) *(beta)*, [`etsy`](../etsy/) *(beta)*, [`magento`](../magento/) *(beta)*, [`bol-com`](../bol-com/) *(beta)*, and 8 more.

## See also

- [Ecommerce OpenAPI spec](https://specs.apideck.com/ecommerce.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=ecommerce)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [BigCommerce official docs](https://developer.bigcommerce.com)
