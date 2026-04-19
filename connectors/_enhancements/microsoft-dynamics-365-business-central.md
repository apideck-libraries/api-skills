## Microsoft Dynamics 365 Business Central via Apideck

Dynamics 365 Business Central (BC) is Microsoft's SMB ERP, successor to Dynamics NAV. Strong in manufacturing, distribution, and professional services. Not to be confused with Dynamics 365 Finance (enterprise) or Dynamics CRM.

### Entity mapping

| BC entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Purchase Invoice | `bills` |
| Customer Payment | `payments` |
| Vendor Payment | `bill-payments` |
| Sales Credit Memo | `credit-notes` |
| Journal Entry (G/L Entry) | `journal-entries` |
| G/L Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Item | `invoice-items` |
| VAT Posting Setup | `tax-rates` |
| Company | `companies` |
| Purchase Order | `purchase-orders` |
| Dimension | `tracking-categories` |
| Location | `locations` |
| Attachments | `attachments` |
| Expense | `expenses` |
| Bank Account | `bank-accounts` |
| Employee | `employees` (HRIS context in some setups) |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, vendors
- ✅ Purchase orders (ERP grade)
- ✅ Journal entries
- ✅ Multi-company (companies = BC's tenants)
- ✅ Dimensions (tracking categories)
- ✅ Multi-currency and multi-locale
- ⚠️ Manufacturing, warehousing — not in unified; use Proxy
- ❌ Power Automate / Power Apps integrations — outside the API surface

### Auth notes

- **Type:** OAuth 2.0 (Microsoft identity platform), managed by Apideck Vault
- **Typical scopes:** Apideck Vault requests BC-specific scopes (`Financials.ReadWrite.All` or similar). Admin consent usually required for corporate tenants.
- **Environment binding:** each connection is bound to one environment (Production or Sandbox); choose during OAuth.
- **Company selection:** multi-company BC tenants have one connection but require a company parameter on many calls — Apideck handles this via connection metadata.

### Example: create a sales invoice

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "microsoft-dynamics-365-business-central",
  invoice: {
    customer_id: "cust_uuid",
    invoice_date: "2026-04-18",
    due_date: "2026-05-18",
    line_items: [
      { description: "Product A", quantity: 2, unit_price: 499.00 },
    ],
    currency: "USD",
  },
});
```
