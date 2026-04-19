## QuickBooks via Apideck Accounting

QuickBooks Online is the most widely used SMB accounting connector on Apideck. Coverage is near-complete for core accounting resources.

### Entity mapping

| QuickBooks entity | Apideck Accounting resource |
|---|---|
| Invoice | `invoices` |
| Bill | `bills` |
| Payment | `payments` |
| BillPayment | `bill-payments` |
| JournalEntry | `journal-entries` |
| Account | `ledger-accounts` |
| Customer | `customers` |
| Vendor | `suppliers` |
| Item | `items` |
| TaxRate, TaxCode | `tax-rates` |
| Company info | `company-info` |
| P&L, Balance Sheet reports | `profit-and-loss`, `balance-sheet` |

### Coverage highlights

- ✅ Full CRUD on invoices, bills, payments, customers, suppliers, items
- ✅ Journal entries (create/read)
- ✅ Financial reports: P&L, Balance Sheet, Aged Receivables/Payables
- ✅ Multi-currency — invoices created with `currency` field route correctly
- ✅ Attachments on invoices/bills via the `attachments` sub-resource
- ⚠️ Tax rates read-only (QuickBooks requires tax setup through its UI)
- ⚠️ Recurring invoices — not exposed; use Proxy
- ❌ Deposits — use Proxy with the `/deposit` endpoint
- ❌ Purchase orders — use Proxy

### QuickBooks-specific auth notes

- **Company/realm selection:** QuickBooks is multi-tenant via `realmId`. The user picks their company during OAuth; the connection is bound to that single realm. Multi-company = one connection per realm (distinct `consumerId`).
- **Sandbox:** QuickBooks Sandbox is a separate environment. The user toggles sandbox vs. production during Vault OAuth — connection is bound to whichever was selected.

### Common QuickBooks quirks handled by Apideck

- **Line items on invoices** — QuickBooks uses a nested `Line` array with `DetailType` discriminators. Apideck normalizes to `line_items[]` with unified fields.
- **Tax calculation** — `TotalAmt` vs. `SubTotal` split is exposed as `total_amount` and `sub_total`.
- **Customer refs** — QuickBooks uses `CustomerRef.value`; Apideck exposes as `customer.id`.
- **Soft-deleted records** — `Active: false` entries. Apideck filters these out by default; pass `filter[active]=false` to include them.

### Example: create an invoice with line items

```typescript
const { data } = await apideck.accounting.invoices.create({
  serviceId: "quickbooks",
  invoice: {
    customer_id: "12", // QuickBooks customer ID
    invoice_date: "2026-04-18",
    due_date: "2026-05-18",
    line_items: [
      {
        description: "Consulting — April 2026",
        quantity: 10,
        unit_price: 150.0,
        item_id: "7", // QuickBooks Item ID
        tax_rate: { id: "TAX" },
      },
    ],
    currency: "USD",
  },
});
```

### Example: pull P&L report for a date range

P&L is exposed via `/accounting/profit-and-loss`. See [`apideck-node`](../../skills/apideck-node/) for the canonical method signature.

```typescript
const { data } = await apideck.accounting.profitAndLoss.get({
  serviceId: "quickbooks",
  filter: {
    start_date: "2026-01-01",
    end_date: "2026-03-31",
  },
});
```
