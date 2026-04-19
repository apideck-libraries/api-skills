## Digits via Apideck Accounting

Digits is a modern US-focused accounting platform built for real-time financial visibility, popular with startups and venture-backed companies. Apideck coverage focuses on reporting and ledger views.

### Entity mapping

| Digits entity | Apideck Accounting resource |
|---|---|
| Account | `ledger-accounts` |
| Journal Entry | `journal-entries` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Dimension | `tracking-categories` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Ledger accounts (chart of accounts)
- ✅ Journal entries
- ✅ Customers, suppliers
- ✅ Financial reports (P&L, Balance Sheet)
- ✅ Dimensions (tracking categories)
- ❌ Invoices, bills, payments — Digits is primarily a reporting/analytics layer on top of QuickBooks/Xero; transactional writes go through those source systems
- ❌ AI-driven insights — Digits' signature feature; proprietary, not exposed

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Workspace binding:** one Digits workspace per connection.
- **Upstream source:** Digits typically syncs from QuickBooks or Xero. For transactional writes, use those connectors directly; use Digits for unified reporting views.

### Example: fetch P&L for the quarter

```typescript
const { data } = await apideck.accounting.profitAndLoss.get({
  serviceId: "digits",
  filter: { start_date: "2026-01-01", end_date: "2026-03-31" },
});
```
