## Clear Books via Apideck Accounting

Clear Books is a UK SMB cloud accounting platform with a focus on simplicity for small businesses, contractors, and accountants.

### Entity mapping

| Clear Books entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Purchase Invoice / Bill | `bills` |
| Credit Note | `credit-notes` |
| Customer | `customers` |
| Supplier | `suppliers` |
| Account Code | `ledger-accounts` |

### Coverage highlights

- ✅ Sales invoices (CRUD)
- ✅ Bills
- ✅ Credit notes
- ✅ Customers, suppliers
- ✅ Chart of accounts
- ⚠️ Payments, journal entries — not in current coverage; use Proxy
- ❌ UK VAT return / MTD submission — use Proxy
- ❌ Payroll — separate product

### Auth notes

- **Type:** API key, managed by Apideck Vault
- **Business binding:** one Clear Books business per connection.
- **UK-only:** Clear Books is UK-market. Multi-regional customers typically use a different platform.

### Example: list unpaid bills

```typescript
const { data } = await apideck.accounting.bills.list({
  serviceId: "clearbooks-uk",
  filter: { status: "open" },
});
```
