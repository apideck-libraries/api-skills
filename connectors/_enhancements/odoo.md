## Odoo via Apideck Accounting

Odoo is an open-source ERP with cloud (Odoo.com) and self-hosted deployments. Broad module coverage; Apideck targets the Accounting module.

### Entity mapping

| Odoo entity | Apideck Accounting resource |
|---|---|
| Customer Invoice (account.move with type "out_invoice") | `invoices` |
| Vendor Bill (account.move with type "in_invoice") | `bills` |
| Payment | `payments` |
| Bill Payment | `bill-payments` |
| Credit Note (refund) | `credit-notes` |
| Journal Item (account.move.line) | `journal-entries` |
| Account (account.account) | `ledger-accounts` |
| Partner (res.partner, customer) | `customers` |
| Partner (res.partner, supplier) | `suppliers` |
| Tax (account.tax) | `tax-rates` |
| Product | `invoice-items` |
| Analytic Account | `tracking-categories` |
| Company (res.company) | `companies`, `subsidiaries` |
| Bank Account | `bank-accounts` |
| Department | `departments` |
| Expense (hr.expense) | `expenses` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries via account.move lines
- ✅ Analytic accounting (tracking categories)
- ✅ Multi-company (subsidiaries)
- ✅ Bank feeds for reconciliation
- ⚠️ Odoo has many custom modules (Studio, custom fields) — coverage varies per installation; use Proxy for module-specific models
- ❌ Other Odoo modules (Sales, CRM, HR, Manufacturing) — use Proxy or a module-specific connector

### Auth notes

- **Type:** Basic auth (username / API key), managed by Apideck Vault
- **Database binding:** Odoo users belong to one database (dbname). Multi-db setups require separate connections.
- **Self-hosted vs cloud:** Apideck connects to any reachable Odoo instance — works for self-hosted provided the URL is accessible.
- **Version sensitivity:** Odoo's model may change across versions (17 → 18 → 19). Apideck abstracts common operations; custom model access via Proxy.

### Example: list customer invoices

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "odoo",
  filter: { status: "open" },
});
```

### Example: read custom Odoo model via Proxy

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: odoo" \
  -H "x-apideck-downstream-url: /jsonrpc" \
  -H "x-apideck-downstream-method: POST"
```
