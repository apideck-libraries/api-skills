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
