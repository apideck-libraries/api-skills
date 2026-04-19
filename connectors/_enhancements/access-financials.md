## Access Financials via Apideck Accounting

Access Financials (part of The Access Group) is a UK mid-market accounting platform aimed at enterprise finance teams. Apideck coverage targets the core AR/AP surface.

### Entity mapping

| Access entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Credit Note | `credit-notes` |
| Customer | `customers` |
| Supplier | `suppliers` |
| Payment | `payments` |
| Nominal Account | `ledger-accounts` |
| Tax | `tax-rates` |
| Tracking / Analysis Code | `tracking-categories` |

### Coverage highlights

- ✅ Sales invoices
- ✅ Credit notes
- ✅ Customers, suppliers, payments
- ✅ Chart of accounts
- ✅ Tax rates (UK VAT)
- ✅ Tracking categories
- ⚠️ Purchase invoices — may be partial; verify with connector API
- ❌ UK MTD submissions — use Proxy
- ❌ Payroll — Access offers payroll via a separate product line

### Auth notes

- **Type:** API key, managed by Apideck Vault
- **Client binding:** one Access Financials client per connection.
- **Enterprise-typical onboarding:** integration may require coordination with the customer's Access admin team.

### Example: list recent customers

```typescript
const { data } = await apideck.accounting.customers.list({
  serviceId: "access-financials",
  filter: { updated_since: "2026-03-01T00:00:00Z" },
});
```
