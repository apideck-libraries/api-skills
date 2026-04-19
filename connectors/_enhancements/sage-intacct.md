## Sage Intacct via Apideck Accounting

Sage Intacct is a cloud accounting platform for mid-market. Apideck covers core finance entities.

### Entity mapping

| Intacct entity | Apideck Accounting resource |
|---|---|
| AR Invoice | `invoices` |
| AP Bill | `bills` |
| AR Payment / AP Payment | `payments` |
| Journal Entry (GLBATCH) | `journal-entries` |
| GL Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Item | `items` |

### Coverage highlights

- ✅ CRUD on invoices, bills, payments, customers, suppliers, items
- ✅ Multi-entity support (Intacct's Company structure)
- ✅ Multi-currency
- ⚠️ Dimensions (Department, Location, Class, Project) — exposed as custom fields where available
- ❌ Sage Intacct REST (beta) — separate auth-only connector; use standard XML connector via Apideck

### Auth

- **Type:** Basic auth (username / password + company ID) — managed by Apideck Vault
- **Session tokens:** Intacct uses session-based auth under the hood. Apideck handles session lifecycle automatically.
- **Sender credentials:** Apideck's Vault app has the required Sender ID/password; end-user only needs to provide their own login.

### Example: list invoices posted in last month

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "sage-intacct",
  filter: { updated_since: "2026-03-01T00:00:00Z" },
});
```
