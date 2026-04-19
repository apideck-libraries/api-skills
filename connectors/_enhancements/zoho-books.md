## Zoho Books via Apideck Accounting

Zoho Books is Zoho's accounting product, part of the Zoho One suite. Strong in India and emerging markets, with multi-currency and multi-entity support.

### Entity mapping

| Zoho Books entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Bill | `bills` |
| Payment (Customer Payment) | `payments` |
| Bill Payment (Vendor Payment) | `bill-payments` |
| Journal | `journal-entries` |
| Chart of Account | `ledger-accounts` |
| Contact (customer) | `customers` |
| Contact (vendor) | `suppliers` |
| Item | `invoice-items` |
| Tax | `tax-rates` |
| Credit Note | `credit-notes` |
| Purchase Order | `purchase-orders` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries
- ✅ Multi-currency
- ✅ Purchase orders
- ✅ GST / VAT handling (India and other regions)
- ⚠️ Recurring invoices — not exposed; use Proxy
- ❌ Projects and time tracking — separate Zoho products (Zoho Projects, Zoho People)
- ❌ Expense claim workflow — use Proxy with Zoho Expense API

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Data center / region:** Zoho is sharded by region (US, EU, IN, AU, CN, JP). The user's data center is determined during OAuth; wrong-DC errors mean re-authorization is needed.
- **Organization binding:** one Zoho Books organization per connection.
- **Zoho One:** users on Zoho One share auth across Zoho apps — connecting Books doesn't automatically connect CRM/People etc.

### Example: create an invoice with tax

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "zoho-books",
  invoice: {
    customer_id: "contact_abc",
    invoice_date: "2026-04-18",
    line_items: [
      { description: "Software license", quantity: 1, unit_price: 500, tax_rate: { id: "tax_gst_18" } },
    ],
    currency: "INR",
  },
});
```
