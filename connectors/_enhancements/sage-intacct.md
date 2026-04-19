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

- **Type:** Basic auth (username / password + company ID), managed by Apideck Vault
- **Company ID required:** the user provides their Intacct Company ID alongside credentials — it's a per-tenant identifier, not a global login.
- **Sender credentials:** Apideck's Vault app already has the required Sender ID/password registered with Sage; the end-user provides only their own Intacct login.
- **Web Services subscription required:** Sage Intacct customers need the Web Services add-on enabled on their Intacct subscription before any API access works. If auth fails with "API not enabled," direct the user to their Intacct admin.

### Example: list invoices posted in last month

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "sage-intacct",
  filter: { updated_since: "2026-03-01T00:00:00Z" },
});
```
