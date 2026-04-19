## Moneybird via Apideck Accounting

Moneybird is a popular Dutch SMB accounting platform favored by freelancers and small businesses. Strong coverage of the core invoicing + expense workflow, plus banking integration.

### Entity mapping

| Moneybird entity | Apideck Accounting resource |
|---|---|
| SalesInvoice | `invoices` |
| PurchaseInvoice / Receipt | `bills` |
| Payment | `payments` |
| Bill Payment | `bill-payments` |
| Journal (BookingEntry) | `journal-entries` |
| Ledger Account | `ledger-accounts` |
| Contact (customer) | `customers` |
| Contact (supplier) | `suppliers` |
| Product | `invoice-items` |
| Tax Rate | `tax-rates` |
| Bank Account | `bank-accounts` |
| Administration | `subsidiaries` |
| Expense | `expenses` |
| Tracking Category | `tracking-categories` |

### Coverage highlights

- ✅ CRUD on invoices, bills, payments, customers, suppliers
- ✅ Expense management (Moneybird's first-class "expense" workflow)
- ✅ Journal entries and tax rates (Dutch BTW)
- ✅ Multi-administration (Moneybird's term for tenants/subsidiaries)
- ✅ Bank accounts for reconciliation
- ⚠️ OCR receipt processing — Moneybird-specific; not in unified API
- ❌ Quote/proposal flows — use Proxy
- ❌ Time tracking — use Proxy

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Administration selection:** Moneybird accounts can contain multiple administrations. The connection is bound to one — for multi-admin access, create separate connections with different consumer IDs, or pass administration ID through pass-through.
- **Dutch-only UI:** Moneybird itself is Dutch-market. Users outside NL rarely have accounts here.

### Example: list overdue invoices

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "moneybird",
  filter: { status: "overdue" },
});
```
