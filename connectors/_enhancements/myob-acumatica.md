## MYOB Acumatica via Apideck Accounting

MYOB Acumatica (formerly MYOB Advanced) is MYOB's enterprise ERP for mid-market, built on the Acumatica platform. Wider ERP coverage than MYOB Business; closer in feel to [`acumatica`](../acumatica/).

### Entity mapping

| MYOB Acumatica entity | Apideck Accounting resource |
|---|---|
| AR Invoice | `invoices` |
| AP Bill | `bills` |
| Payment | `payments` |
| Credit Note | `credit-notes` |
| Journal Transaction | `journal-entries` |
| Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Inventory Item | `invoice-items` |
| Tax | `tax-rates` |
| Purchase Order | `purchase-orders` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries
- ✅ Credit notes
- ✅ Purchase orders (ERP-grade)
- ✅ Multi-entity / multi-branch
- ⚠️ Projects, manufacturing — not in unified accounting; use Proxy
- ❌ Payroll — separate product

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Tenant binding:** one MYOB Acumatica tenant per connection.
- **Role-based access:** the user's Acumatica role determines which records are readable/writable; Apideck surfaces 403s transparently.

### Example: list open AR invoices

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "myob-acumatica",
  filter: { status: "open" },
});
```
