## Xero via Apideck Accounting

Xero is a widely-used cloud accounting platform, strong in UK/AU/NZ markets. Apideck covers the core financial entities.

### Entity mapping

| Xero entity | Apideck Accounting resource |
|---|---|
| Invoice (ACCREC) | `invoices` |
| Bill (ACCPAY) | `bills` |
| Payment | `payments` |
| Manual Journal | `journal-entries` |
| Account (chart of accounts) | `ledger-accounts` |
| Contact (customer or supplier) | `customers` / `suppliers` |
| Item | `items` |
| TaxRate | `tax-rates` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Manual journals
- ✅ Financial reports (P&L, Balance Sheet, Aged Receivables/Payables)
- ✅ Multi-currency on invoices/bills
- ⚠️ Tracking categories / cost centers — surfaced as custom fields
- ❌ Payroll — separate Xero Payroll API; use Proxy

### Auth

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Tenant selection:** Xero users can belong to multiple organizations. The user picks which org to authorize during the Vault flow; one Apideck connection = one Xero org.

### Example: create an invoice

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "xero",
  invoice: {
    customer_id: "xero-contact-uuid",
    invoice_date: "2026-04-18",
    due_date: "2026-05-18",
    line_items: [
      { description: "Consulting", quantity: 10, unit_price: 150, account_id: "sales-revenue" },
    ],
    currency: "GBP",
  },
});
```
