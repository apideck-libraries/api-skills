## Exact Online via Apideck Accounting

Exact Online is a widely-used cloud accounting platform across the Netherlands, Belgium, Germany, and other European markets. Deep Apideck coverage; one of the most mature European accounting connectors in the catalog.

> **Regional variants:** `exact-online` is the default / multi-region connector. For country-specific Exact instances use [`exact-online-nl`](../exact-online-nl/) (Dutch market) or [`exact-online-uk`](../exact-online-uk/) (UK market). Pick the one that matches the user's division country.

### Entity mapping

| Exact Online entity | Apideck Accounting resource |
|---|---|
| SalesInvoice | `invoices` |
| PurchaseInvoice / Bill | `bills` |
| Payment | `payments` |
| BillPayment | `bill-payments` |
| Journal / Entry | `journal-entries` |
| GL Account | `ledger-accounts` |
| Account (Customer) | `customers` |
| Account (Supplier) | `suppliers` |
| Item | `invoice-items` |
| VatCode | `tax-rates` |
| CreditInvoice | `credit-notes` |
| Division | `companies` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries and VAT handling
- ✅ Multi-division — exposed as `companies`
- ✅ Multi-currency
- ✅ Financial reports (P&L, Balance Sheet)
- ⚠️ Banking imports — partial; use Proxy for bulk reconciliation
- ❌ CRM / quotation features — separate Exact surface; use Proxy
- ❌ Payroll — separate Exact product

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Division selection:** Exact accounts often contain multiple divisions (legal entities). Apideck connections are bound to one division by default — if the user needs multi-division access, either create multiple connections or pass the division ID via pass-through.
- **Regional data centers:** NL / BE / DE / UK accounts may route to different Exact endpoints. Use the correct connector variant (`exact-online`, `exact-online-nl`, `exact-online-uk`) or ensure the user selects the right region during Vault OAuth.
- **Refresh tokens:** Exact Online refresh tokens are rotated — Apideck handles rotation transparently.

### Example: list invoices for the current month

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "exact-online",
  filter: { updated_since: "2026-04-01T00:00:00Z" },
});
```
