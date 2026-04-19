## Acumatica via Apideck Accounting

Acumatica is a cloud ERP platform for mid-market businesses, with strong distribution, manufacturing, and services verticals. Apideck coverage targets the core financial management surface.

### Entity mapping

| Acumatica entity | Apideck Accounting resource |
|---|---|
| AR Invoice | `invoices` |
| AP Bill | `bills` |
| Payment | `payments` |
| Credit Memo | `credit-notes` |
| GL Transaction | `journal-entries` |
| Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Inventory Item | `invoice-items` |
| Tax | `tax-rates` |
| Purchase Order | `purchase-orders` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries
- ✅ Purchase orders
- ✅ Credit notes
- ⚠️ Acumatica Generic Inquiries — powerful custom reports; not exposed, use Proxy
- ❌ Manufacturing and distribution modules — use Proxy for BOM, work orders, shipments
- ❌ Payroll

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Tenant + branch binding:** Acumatica supports multi-tenant + multi-branch. The connection is bound to one tenant; branch selection is typically passed per call.
- **Screen-based APIs:** Acumatica has both OData-style REST and "Screen-Based" Contract API. Apideck abstracts this; Proxy calls can hit either.

### Example: create an AR invoice

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "acumatica",
  invoice: {
    customer_id: "cust_abc",
    invoice_date: "2026-04-18",
    line_items: [
      { description: "Consulting", quantity: 10, unit_price: 150 },
    ],
    currency: "USD",
  },
});
```
