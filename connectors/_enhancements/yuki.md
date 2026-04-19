## Yuki via Apideck Accounting

Yuki is a Dutch cloud accounting and bookkeeping platform, strong in automated document processing and NL/BE SMB markets.

### Entity mapping

| Yuki entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Purchase Invoice | `bills` |
| Journal Entry (GB-mutation) | `journal-entries` |
| GL Account | `ledger-accounts` |
| Customer (Debtor) | `customers` |
| Supplier (Creditor) | `suppliers` |
| BTW code | `tax-rates` |
| Cost centre | `tracking-categories` |
| Company (Administration) | `company-info` |
| Attachments | `attachments` |

### Coverage highlights

- ✅ CRUD on invoices, bills, customers, suppliers
- ✅ Journal entries and Dutch BTW handling
- ✅ Tracking categories (cost centres)
- ✅ Document attachments (Yuki's OCR output)
- ❌ Automated document recognition workflow (Yuki's signature feature) — not exposed; use Proxy
- ❌ Bank reconciliation rules — use Proxy

### Auth notes

- **Type:** API key, managed by Apideck Vault
- **Administration-scoped:** Yuki API keys are tied to a single administration (tenant). Multi-admin customers need one connection per admin.
- **Permission scope:** key inherits the generator's role — admin-level access recommended for full coverage.

### Example: list invoices for a specific period

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "yuki",
  filter: { updated_since: "2026-01-01T00:00:00Z" },
});
```
