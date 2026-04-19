## NetSuite via Apideck Accounting

NetSuite is Oracle's enterprise ERP. Apideck abstracts the SuiteTalk REST API; deep coverage for finance operations but less for NetSuite's broader ERP surface.

### Entity mapping

| NetSuite record | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Vendor Bill | `bills` |
| Customer Payment / Vendor Payment | `payments` |
| Journal Entry | `journal-entries` |
| Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Item | `items` |
| Purchase Order | `purchase-orders` |
| Subsidiary | `subsidiaries` |

### Coverage highlights

- ✅ CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries (posting + drafts)
- ✅ Multi-subsidiary and multi-currency (OneWorld editions)
- ✅ Purchase orders
- ⚠️ Custom records and custom fields — exposed via `custom_fields[]`; custom records need Proxy
- ❌ SuiteScript, SuiteFlow — out of scope; use Proxy for advanced operations

### Auth

- **Type:** OAuth 2.0 (Token-Based Authentication / OAuth 2.0 M2M) — managed by Apideck Vault
- **Account binding:** each connection is bound to one NetSuite account ID. Sandbox vs. production is distinguished by account suffix (e.g., `TSTDRV`).
- **Role impact:** the token's role determines visibility. Admin roles recommended for full coverage.
- **Rate limits:** NetSuite enforces concurrency limits per role/account. Apideck backs off; heavy workloads should batch.

### Example: list open invoices with multi-subsidiary filter

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "netsuite",
  filter: { status: "open", subsidiary_id: "1" },
});
```
