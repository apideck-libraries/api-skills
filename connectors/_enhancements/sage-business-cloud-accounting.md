## Sage Business Cloud Accounting via Apideck

Sage Business Cloud Accounting (formerly Sage One) is Sage's cloud SMB accounting product, distinct from Sage Intacct (mid-market) and Sage 50 (desktop). Popular in UK, Ireland, and other English-speaking markets.

### Entity mapping

| Sage entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Purchase Invoice | `bills` |
| Credit Note | `credit-notes` |
| Contact Payment | `payments` |
| Bill Payment | `bill-payments` |
| Journal | `journal-entries` |
| Ledger Account | `ledger-accounts` |
| Contact (Customer) | `customers` |
| Contact (Supplier) | `suppliers` |
| Item / Product | `invoice-items` |
| Tax Rate | `tax-rates` |
| Bank Account | `bank-accounts` |
| Business | `subsidiaries` |
| Attachment | `attachments` |
| Expense | `expenses` |
| Company | `companies` |
| P&L, Balance Sheet | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers
- ✅ Journal entries
- ✅ Financial reports (P&L, Balance Sheet)
- ✅ Multi-business (Sage's term for multi-tenant access within one account)
- ✅ Attachments on invoices / bills
- ⚠️ VAT returns / MTD submission — use Proxy with Sage's dedicated MTD endpoints
- ❌ Payroll — Sage Payroll is separate
- ❌ Stock/inventory — Sage 50 territory

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Business binding:** each connection = one Sage business. Users may have access to multiple businesses from one account; Apideck binds to the selected one at OAuth time.
- **Region:** Sage Business Cloud has UK, US, DE, FR, ES, IE, CA variants. Choose the right regional variant or ensure the user selects correctly during OAuth.
- **Name collision:** do not confuse with Sage Intacct — different product, different connector.

### Example: list invoices for a specific customer

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "sage-business-cloud-accounting",
  filter: { customer_id: "contact_123" },
});
```
