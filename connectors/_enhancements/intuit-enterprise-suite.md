## Intuit Enterprise Suite via Apideck

Intuit Enterprise Suite (IES) is Intuit's enterprise-grade offering, above QuickBooks Online Advanced. Targets mid-market and multi-entity customers with deeper consolidation, multi-GL, and dimension tracking.

### Entity mapping

| IES entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Bill | `bills` |
| Customer Payment | `payments` |
| Vendor Payment | `bill-payments` |
| Credit Memo | `credit-notes` |
| Journal Entry | `journal-entries` |
| Chart of Accounts | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Item | `invoice-items` |
| Tax Rate | `tax-rates` |
| Purchase Order | `purchase-orders` |
| Class / Location | `tracking-categories`, `locations` |
| Department | `departments` |
| Expense | `expenses` |
| Attachments | `attachments` |
| Company | `companies` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries, credit memos, purchase orders
- ✅ Multi-dimension tracking (Class, Location, Department)
- ✅ Multi-entity / consolidated reporting
- ✅ Financial reports (P&L, Balance Sheet)
- ✅ Attachments on transactions
- ⚠️ Custom fields — more flexible than QBO; exposed via `custom_fields[]`
- ❌ Intuit-specific AI features (e.g., Transaction Matching) — use Proxy

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Realm binding:** same pattern as QuickBooks — one realm per connection. IES multi-entity setups expose child entities through the parent realm.
- **Higher API limits vs QBO:** IES has extended rate limits and throughput appropriate for mid-market volumes.
- **Compared to QuickBooks:** use [`quickbooks`](../quickbooks/) for QBO (SMB), [`intuit-enterprise-suite`](../intuit-enterprise-suite/) for IES (enterprise multi-entity).

### Example: list invoices across all entities in the realm

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "intuit-enterprise-suite",
  limit: 100,
});
```
