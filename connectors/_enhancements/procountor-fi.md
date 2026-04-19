## Procountor via Apideck Accounting

Procountor is a Finnish cloud accounting and financial management platform, part of Accountor Group. Popular with Finnish SMBs and accounting firms.

### Entity mapping

| Procountor entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Purchase Invoice | `bills` |
| Customer | `customers` |
| Supplier | `suppliers` |
| Payment | `payments` |
| Account | `ledger-accounts` |
| Product | `invoice-items` |
| Company Info | `company-info` |
| VAT | `tax-rates` |
| Purchase Order | `purchase-orders` |
| Journal | `journal-entries` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Purchase orders
- ✅ Journal entries
- ✅ Finnish VAT handling
- ⚠️ E-invoicing (Finland uses Finvoice 3.0) — handled under the hood; specific formatting via Proxy
- ❌ Payroll — separate Procountor module
- ❌ Banking / reconciliation rules — use Proxy

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Company binding:** one Procountor company per connection.
- **Finnish market focus:** Procountor is Finland-specific. Regulatory compliance (Finnish Accounting Act, OmaVero) is built-in.
- **API version:** Procountor v2 API; Apideck tracks current stable.

### Example: list bills updated this week

```typescript
const { data } = await apideck.accounting.bills.list({
  serviceId: "procountor-fi",
  filter: { updated_since: "2026-04-14T00:00:00Z" },
});
```
