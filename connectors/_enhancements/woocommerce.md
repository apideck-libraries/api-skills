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
