## Kashflow via Apideck Accounting

Kashflow is a UK-focused cloud accounting platform for SMB, owned by IRIS Software Group. Straightforward coverage of the standard UK accounting entity set.

### Entity mapping

| Kashflow entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Bill / Purchase Invoice | `bills` (partial) |
| Credit Note | `credit-notes` |
| Customer | `customers` |
| Supplier | `suppliers` |
| Item | `invoice-items` |
| Nominal Code | `ledger-accounts` |
| Journal | `journal-entries` |
| VAT | `tax-rates` |
| Payment | `payments` |
| Company Info | `company-info` |

### Coverage highlights

- ✅ Full CRUD on invoices, customers, suppliers
- ✅ Credit notes
- ✅ Journal entries
- ✅ Tax rates (UK VAT)
- ✅ Payments
- ⚠️ Payroll integration (Kashflow Payroll) — separate product surface; use Proxy
- ❌ Bank feeds — limited; use Proxy
- ❌ MTD-specific VAT return submissions — use Proxy

### Auth notes

- **Type:** Basic auth (API username + password), managed by Apideck Vault
- **Company binding:** one Kashflow company per connection.
- **Legacy flavor:** Kashflow's API is SOAP-based under the hood; Apideck abstracts this. Proxy calls still use SOAP envelopes.

### Example: list recent invoices

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "kashflow",
  filter: { updated_since: "2026-04-01T00:00:00Z" },
});
```
