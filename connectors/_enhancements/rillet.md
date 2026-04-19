## Rillet via Apideck Accounting

Rillet is a modern SaaS finance platform (general ledger + revenue recognition) targeting B2B SaaS companies. Deep coverage via Apideck.

### Entity mapping

| Rillet entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Bill | `bills` |
| Bill Payment | `bill-payments` |
| Credit Note | `credit-notes` |
| Payment | `payments` |
| Journal Entry | `journal-entries` |
| Account | `ledger-accounts` |
| Customer | `customers` |
| Supplier | `suppliers` |
| Item | `invoice-items` |
| Tax Rate | `tax-rates` |
| Expense | `expenses` |
| Subsidiary | `subsidiaries` |
| Bank Account | `bank-accounts` |
| Bank Feed Statement | `bank-feed-statements` |
| Company Info | `company-info` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments
- ✅ Credit notes
- ✅ Journal entries
- ✅ Expenses
- ✅ Multi-subsidiary
- ✅ Bank feeds for reconciliation
- ✅ Financial reports (P&L, Balance Sheet)
- ⚠️ Revenue recognition schedules (Rillet's signature feature) — not in unified; use Proxy
- ❌ SaaS metrics (ARR, MRR) — Rillet-specific; use Proxy

### Auth notes

- **Type:** API key, managed by Apideck Vault
- **Organization binding:** one Rillet organization per connection.
- **B2B SaaS focus:** Rillet's model assumes subscription revenue. Customers without subscription semantics may not use all features.

### Example: fetch P&L for YTD

```typescript
const { data } = await apideck.accounting.profitAndLoss.get({
  serviceId: "rillet",
  filter: { start_date: "2026-01-01", end_date: "2026-04-18" },
});
```
