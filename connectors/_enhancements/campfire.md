## Campfire via Apideck Accounting

Campfire is a modern accounting platform designed for fast-growing companies with multi-entity and multi-dimensional tracking needs. Very broad Apideck coverage.

### Entity mapping

| Campfire entity | Apideck Accounting resource |
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
| Department | `departments` |
| Subsidiary | `subsidiaries` |
| Tracking Category | `tracking-categories` |
| Bank Feed Account | `bank-feed-accounts` |
| Bank Feed Statement | `bank-feed-statements` |
| Company Info | `company-info` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments (incl. bill payments)
- ✅ Credit notes
- ✅ Journal entries
- ✅ Departments, subsidiaries, tracking categories (deep multi-dim support)
- ✅ Bank feeds
- ✅ Financial reports (P&L, Balance Sheet)
- ⚠️ Revenue recognition — not in unified; use Proxy
- ❌ Audit trail detail beyond `updated_at` — use Proxy

### Auth notes

- **Type:** API key, managed by Apideck Vault
- **Organization binding:** one Campfire organization per connection.
- **Multi-entity:** subsidiaries exposed as a first-class resource; scale to dozens of entities per org.

### Example: list bills with department filter

```typescript
const { data } = await apideck.accounting.bills.list({
  serviceId: "campfire",
  filter: { department_id: "dept_marketing" },
});
```
