## banqUP via Apideck Accounting

banqUP is a Belgian cloud invoicing and business banking platform targeting SMBs and accountants. Apideck coverage is invoice-focused.

### Entity mapping

| banqUP entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Customer | `customers` |

### Coverage highlights

- ✅ Invoices (CRUD)
- ✅ Customers
- ⚠️ AP / bills — not in current Apideck mapping; use Proxy
- ❌ Payments, journal entries, ledger accounts — use Proxy
- ❌ Business banking features — separate banqUP API surface

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Organization binding:** one banqUP organization per connection.
- **Belgium-focused:** Belgian compliance (PEPPOL e-invoicing, Belgian VAT) built-in.
- **Coverage is narrow:** this connector currently exposes only invoices + customers. If you need full accounting breadth, pick a different Belgian connector (e.g. [`exact-online`](../exact-online/)).

### Example: create an invoice

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "banqup",
  invoice: {
    customer_id: "cust_abc",
    invoice_date: "2026-04-18",
    line_items: [
      { description: "Consulting", quantity: 5, unit_price: 120 },
    ],
    currency: "EUR",
  },
});
```
