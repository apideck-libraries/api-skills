## Dualentry via Apideck Accounting

Dualentry is a cloud accounting platform offering modern, double-entry bookkeeping with comprehensive multi-entity support. Broad Apideck coverage.

### Entity mapping

| Dualentry entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Bill | `bills` |
| Bill Payment | `bill-payments` |
| Credit Note | `credit-notes` |
| Payment | `payments` |
| Journal Entry | `journal-entries` |
| Ledger Account | `ledger-accounts` |
| Customer | `customers` |
| Supplier | `suppliers` |
| Item | `invoice-items` |
| Purchase Order | `purchase-orders` |
| Expense | `expenses` |
| Subsidiary | `subsidiaries` |
| Attachments | `attachments` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments (incl. bill payments)
- ✅ Credit notes
- ✅ Journal entries
- ✅ Purchase orders
- ✅ Expenses
- ✅ Multi-subsidiary support
- ✅ Attachments on transactions
- ⚠️ Financial reports (P&L, Balance Sheet) — not in current mapping; use Proxy
- ❌ Payroll — separate surface

### Auth notes

- **Type:** API key, managed by Apideck Vault
- **Organization binding:** one Dualentry organization per connection.
- **Multi-subsidiary:** subsidiaries are exposed as a first-class resource; use `subsidiaries` to fetch and filter.

### Example: create a multi-line bill

```typescript
const { data } = await apideck.accounting.bills.create({
  serviceId: "dualentry",
  bill: {
    supplier_id: "sup_abc",
    bill_date: "2026-04-18",
    due_date: "2026-05-18",
    line_items: [
      { description: "Service A", quantity: 1, unit_price: 500 },
      { description: "Service B", quantity: 2, unit_price: 250 },
    ],
    currency: "USD",
  },
});
```
