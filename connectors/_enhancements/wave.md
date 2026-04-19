## Wave via Apideck Accounting

Wave is a free US/CA accounting platform popular with small businesses and freelancers. Coverage is read-oriented for reporting, and invoicing is the primary write path.

### Entity mapping

| Wave entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Account | `ledger-accounts` |
| Product | `invoice-items` |
| Sales Tax | `tax-rates` |
| Bank Account | `bank-accounts` |
| Business | `company-info` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |
| Bank Feed Statements | `bank-feed-statements` |

### Coverage highlights

- ✅ Invoices (CRUD)
- ✅ Customers, suppliers, products
- ✅ Tax rates and chart of accounts
- ✅ Financial reports (P&L, Balance Sheet)
- ✅ Bank feed statements
- ⚠️ Bill / expense management — limited; use Proxy for Wave's specific bill endpoints
- ❌ Payroll — Wave Payroll is a separate product surface
- ❌ Receipt scanning — Wave-specific feature

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Business binding:** one Wave business per connection. Multi-business users need separate connections.
- **GraphQL upstream:** Wave's API is GraphQL; Apideck translates unified REST calls into GraphQL queries. For complex reads, the Proxy API forwards raw GraphQL.

### Example: list customers with contact details

```typescript
const { data } = await apideck.accounting.customers.list({
  serviceId: "wave",
  fields: "id,display_name,email,phone,addresses",
});
```
