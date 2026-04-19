## FreshBooks via Apideck Accounting

FreshBooks is a US/CA SMB-focused cloud accounting platform geared toward service-based businesses and freelancers. Solid coverage via Apideck for invoicing and AP/AR workflows.

### Entity mapping

| FreshBooks entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Bill (Expense) | `bills` |
| Payment | `payments` |
| Bill Payment | `bill-payments` |
| Journal Entry | `journal-entries` |
| Account | `ledger-accounts` |
| Client | `customers` |
| Vendor | `suppliers` |
| Item | `invoice-items` |
| Tax | `tax-rates` |
| Credit | `credit-notes` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ CRUD on invoices, bills, payments, clients, suppliers, items
- ✅ Journal entries
- ✅ Financial reports (P&L, Balance Sheet)
- ✅ Tax rates (FreshBooks multi-jurisdiction support)
- ⚠️ Time tracking, projects — not in unified Accounting API; use Proxy
- ❌ Estimates, recurring invoices — use Proxy
- ❌ Team management — separate FreshBooks surface

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Business ID binding:** each connection is bound to one FreshBooks business. Multi-business = multi-connection.
- **Scopes:** FreshBooks scopes are business-wide; the user authorizes read/write on their behalf during the Vault flow.
- **Classic vs new FreshBooks:** Apideck targets FreshBooks New (the modern API). Classic is sunset.

### Example: create an invoice

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "freshbooks",
  invoice: {
    customer_id: "client_123",
    invoice_date: "2026-04-18",
    due_date: "2026-05-18",
    line_items: [
      { description: "Consulting", quantity: 10, unit_price: 150 },
    ],
    currency: "USD",
  },
});
```
