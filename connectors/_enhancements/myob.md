## MYOB via Apideck Accounting

MYOB is a major Australian/New Zealand accounting platform for SMB and mid-market. Apideck coverage focuses on invoicing and sales, with limited AP coverage currently.

### Entity mapping

| MYOB entity | Apideck Accounting resource |
|---|---|
| Sale Invoice | `invoices` |
| Item Invoice | `invoices` |
| Customer | `customers` |
| Item | `invoice-items` |
| Account | `ledger-accounts` |
| TaxCode | `tax-rates` |
| Payment | `payments` |
| Company File | `company-info` |

### Coverage highlights

- ✅ Invoices (CRUD)
- ✅ Customers
- ✅ Items / products
- ✅ Chart of accounts
- ✅ Tax codes (GST handling for AU/NZ)
- ✅ Customer payments
- ⚠️ Bills / supplier invoices — not in current Apideck mapping; use Proxy
- ⚠️ Journal entries — use Proxy
- ❌ Payroll — MYOB Payroll is a separate product surface
- ❌ Inventory management — use Proxy

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Company file binding:** MYOB uses "company files" as the multi-tenant boundary. Each connection is bound to one company file. Multi-file access = multi-connection.
- **Cloud vs desktop:** Apideck targets MYOB AccountRight Live (cloud) and MYOB Business. Desktop-only company files aren't accessible.
- **API rate limit:** MYOB applies per-file rate limits; Apideck handles 429s with backoff.

### Example: create an invoice for an AU customer

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "myob",
  invoice: {
    customer_id: "cust_abc",
    invoice_date: "2026-04-18",
    line_items: [
      { description: "Consulting", quantity: 10, unit_price: 220, tax_rate: { id: "GST" } },
    ],
    currency: "AUD",
  },
});
```

### Example: reach bills via Proxy

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: myob" \
  -H "x-apideck-downstream-url: /{company-file-id}/Purchase/Bill" \
  -H "x-apideck-downstream-method: GET"
```
