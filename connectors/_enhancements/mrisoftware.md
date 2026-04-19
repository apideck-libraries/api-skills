## MRI Software via Apideck Accounting

MRI Software is an enterprise real-estate management platform (property management + accounting). Apideck coverage targets the accounting surface within MRI's financial modules.

### Entity mapping

| MRI entity | Apideck Accounting resource |
|---|---|
| Journal Entry | `journal-entries` |
| Tenant / Receivable | `customers` |
| Vendor | `suppliers` |
| Account | `ledger-accounts` |
| Department | `departments` |
| Location / Property | `locations` |
| Purchase Order | `purchase-orders` |
| Tax | `tax-rates` |
| Bill | `bills` |
| Entity / Portfolio | `subsidiaries` |

### Coverage highlights

- ✅ Journal entries (general ledger)
- ✅ Customers (tenants), suppliers (vendors)
- ✅ Chart of accounts
- ✅ Purchase orders
- ✅ Multi-entity / multi-property via departments, locations, subsidiaries
- ❌ Invoices in the unified sense — MRI uses tenant billing workflows; use Proxy for invoice-like records
- ❌ Lease management, property records — separate MRI module surfaces
- ❌ MRI-specific reporting tools — use Proxy

### Auth notes

- **Type:** Basic auth (MRI API username + password), managed by Apideck Vault
- **Client binding:** MRI installations are per-client; one connection per client ID.
- **Version / product variant:** MRI has many product lines (Commercial Management, Residential Management, AnyBUILD). Confirm which API surface the user has access to.
- **Enterprise-only:** MRI is typically sold to large real-estate organizations — integration setup requires coordination with MRI admin staff.

### Example: list journal entries for a property

```typescript
const { data } = await apideck.accounting.journalEntries.list({
  serviceId: "mrisoftware",
  filter: { location_id: "property_xyz" },
});
```
