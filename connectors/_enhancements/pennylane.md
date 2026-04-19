## Pennylane via Apideck Accounting

Pennylane is a French/European cloud accounting and finance platform blending bookkeeping with modern UX. Fast-growing in France; expanding across the EU.

### Entity mapping

| Pennylane entity | Apideck Accounting resource |
|---|---|
| Customer Invoice | `invoices` |
| Supplier Invoice | `bills` |
| Journal Entry | `journal-entries` |
| Ledger (Compte) | `ledger-accounts` |
| Customer | `customers` |
| Supplier | `suppliers` |
| Product / Service | `invoice-items` |
| VAT rate | `tax-rates` |
| Purchase Order | `purchase-orders` |
| Quote | `quotes` |
| Bank Account | `bank-accounts` |
| Analytic dimension | `tracking-categories` |
| Attachments | `attachments` |
| Bank Feed Statements | `bank-feed-statements` |

### Coverage highlights

- ✅ CRUD on invoices, bills, customers, suppliers
- ✅ Purchase orders and quotes (France-typical sales workflow)
- ✅ Analytic dimensions (cost centre / project tracking)
- ✅ Bank feed statements for reconciliation
- ✅ Attachments on invoices / bills (Pennylane's document-centric model)
- ⚠️ French-specific VAT declaration (CA3) — not exposed; use Proxy
- ❌ Payroll features — separate Pennylane surface
- ❌ Bill automation rules — use Proxy

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Company binding:** one Pennylane company per connection.
- **French market focus:** defaults to French-specific tax codes and reporting; users outside France may see reduced functionality.

### Example: create a purchase order

```typescript
const { data } = await apideck.accounting.purchaseOrders.create({
  serviceId: "pennylane",
  purchaseOrder: {
    supplier_id: "supplier_abc",
    line_items: [{ description: "Widgets", quantity: 10, unit_price: 25.5 }],
    currency: "EUR",
  },
});
```
