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
