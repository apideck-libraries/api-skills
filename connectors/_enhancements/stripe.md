## Stripe via Apideck Accounting

Stripe is the dominant online payments platform. Apideck surfaces Stripe's accounting-adjacent resources (customers, invoices, payments, refunds) through the unified Accounting API — not the full Stripe surface.

> **Scope:** use this connector when you want to read Stripe data as part of an accounting workflow (invoices, payments, tax). For subscription management, Stripe Elements, Connect, or Terminal, go direct to Stripe's API or use the Proxy.

### Entity mapping

| Stripe entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Customer | `customers` |
| PaymentIntent / Charge | `payments` |
| Refund | `refunds` |
| Credit Note | `credit-notes` |
| Tax Rate | `tax-rates` |
| Invoice Item | `invoice-items` |
| Account | `company-info` |
| Bank Account | `bank-accounts` |
| Expense | `expenses` |

### Coverage highlights

- ✅ Invoices and invoice items
- ✅ Customers
- ✅ Payments / charges
- ✅ Refunds (critical for reconciliation workflows)
- ✅ Tax rates
- ⚠️ Bills / supplier AP concepts — not meaningful in Stripe (no AP); treat as empty
- ❌ Subscriptions, plans, pricing — use Proxy or the Stripe SDK directly
- ❌ Connect (multi-party) flows — complex; use Proxy
- ❌ Webhooks — use Stripe's webhook endpoints directly, not the Apideck unified webhook

### Auth notes

- **Type:** OAuth 2.0 (Stripe Connect flow) — managed by Apideck Vault
- **Account binding:** one Stripe account per connection. Connect-based marketplaces need per-seller connections.
- **Test vs live mode:** Stripe distinguishes test and live keys. Ensure the user authorizes the intended mode during Vault OAuth.
- **Alternative for accounting reconciliation:** many teams already use Stripe's own data sync to QuickBooks/Xero. Apideck via Stripe is best when you need unified data across multiple providers (e.g., Stripe + QuickBooks).

### Example: list customers with payment totals

```typescript
const { data } = await apideck.accounting.customers.list({
  serviceId: "stripe",
});
```
