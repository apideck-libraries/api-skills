## FreeAgent via Apideck Accounting

FreeAgent is a UK-focused cloud accounting platform for freelancers and small businesses, part of NatWest Group. Popular for MTD-compliant VAT and self-assessment flows.

### Entity mapping

| FreeAgent entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Bill | `bills` |
| Credit Note | `credit-notes` |
| Contact (customer) | `customers` |
| Contact (supplier) | `suppliers` |
| Category | `ledger-accounts` |
| Invoice Item | `invoice-items` |
| Journal Set | `journal-entries` |
| Bank Account | `bank-accounts` |
| Company Info | `company-info` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ CRUD on invoices, bills, credit notes, customers, suppliers
- ✅ Journal entries
- ✅ Financial reports (P&L, Balance Sheet)
- ✅ Bank accounts
- ⚠️ VAT returns / MTD submission — use Proxy with FreeAgent's `/v2/vat_returns` endpoints
- ❌ Time tracking, project management — use Proxy
- ❌ Self-assessment / Personal tax — use Proxy

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Company binding:** one FreeAgent company per connection.
- **MTD (Making Tax Digital):** FreeAgent is HMRC-recognized. VAT submission requires additional Agent Services Account permissions not covered by the unified API.

### Example: list unpaid invoices

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "freeagent",
  filter: { status: "open" },
});
```
