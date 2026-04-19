## Shopify via Apideck Ecommerce

Shopify is the reference Ecommerce connector. Strong coverage for orders, products, customers, and stores.

### Entity mapping

| Shopify entity | Apideck Ecommerce resource |
|---|---|
| Order | `orders` |
| Product | `products` |
| Variant | exposed via `products[].variants[]` |
| Customer | `customers` |
| Shop | `stores` |
| Fulfillment | exposed via `orders[].fulfillments[]` |
| Transaction | exposed via `orders[].payments[]` |
| Inventory Level | ❌ use Proxy |
| Discount / Price Rule | ❌ use Proxy |
| Webhook subscriptions | use Apideck Webhooks, not Shopify's |
| Metafields | `custom_fields[]` on orders/products |

### Coverage highlights

- ✅ Read orders, products, customers, stores
- ✅ Filter orders by status, date range, customer
- ✅ Filter products by vendor, status, published state
- ✅ Variants flattened into product responses
- ✅ Multi-currency orders — `currency` and `total_price` surface correctly
- ⚠️ Create / update are available for products and customers; orders are typically read-only (Shopify strongly prefers order creation through checkout, not API)
- ❌ Inventory adjustments — use Proxy with `/inventory_levels/adjust.json`
- ❌ Discount codes — use Proxy
- ❌ Draft orders — use Proxy
- ❌ Shopify Functions / App Bridge — out of scope for a backend API

### Shopify-specific auth notes

- **Two app models:**
  - **Custom app** (single store): store owner generates an admin API token and pastes it into Vault. Use `shopify` serviceId.
  - **Public app** (many stores): OAuth install flow from the Shopify App Store. Use `shopify-public-app` serviceId (separate connector).
- **Shop binding:** each connection is bound to one shop (`myshop.myshopify.com`). Multi-shop = multi-connection.
- **Merchant app review (public app only):** if you're a Shopify App Store app, Apideck's Vault app must pass Shopify's review process before install. Existing Apideck customers typically use the custom-app route to avoid the review.

### Common Shopify quirks handled by Apideck

- **GraphQL vs REST** — Shopify is pushing customers to GraphQL. Apideck currently routes through REST Admin API for most endpoints. If you need GraphQL (for large reads, bulk queries), use Proxy with the GraphQL endpoint.
- **Line items on orders** — nested with variant refs. Apideck surfaces as `order.line_items[]` with resolved product/variant names.
- **Order financial_status / fulfillment_status** — Apideck normalizes to `order.payment_status` and `order.status`.
- **Metafields** — exposed as `custom_fields[]`; write access requires additional scopes.
- **Deprecation tracking** — Shopify deprecates API versions twice a year. Apideck tracks the current stable version; raw Proxy calls should pin a version.

### Example: list orders from the last 30 days

```typescript
const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

let cursor;
const orders = [];

do {
  const { data, pagination } = await apideck.ecommerce.orders.list({
    serviceId: "shopify",
    cursor,
    filter: { updated_since: since, status: "any" },
    limit: 100,
  });
  orders.push(...data);
  cursor = pagination?.cursors?.next;
} while (cursor);
```

### Example: create a product

```typescript
const { data } = await apideck.ecommerce.products.create({
  serviceId: "shopify",
  product: {
    name: "Linen Shirt — Navy",
    description_html: "<p>100% European linen. Pre-washed.</p>",
    vendor: "Acme Apparel",
    status: "active",
    variants: [
      {
        sku: "LIN-NVY-S",
        price: 89.0,
        inventory_quantity: 42,
        options: [{ name: "Size", value: "S" }],
      },
      {
        sku: "LIN-NVY-M",
        price: 89.0,
        inventory_quantity: 35,
        options: [{ name: "Size", value: "M" }],
      },
    ],
  },
});
```

### Example: GraphQL bulk query via Proxy

```bash
curl 'https://unify.apideck.com/proxy' \
  -X POST \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: shopify" \
  -H "x-apideck-downstream-url: https://{shop}.myshopify.com/admin/api/2026-01/graphql.json" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ shop { name currencyCode } }"}'
```
