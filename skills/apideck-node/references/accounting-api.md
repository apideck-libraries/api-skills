# Accounting API Reference

Base namespace: `apideck.accounting`

Supported connectors: QuickBooks, Xero, NetSuite, Exact Online, FreshBooks, Sage Intacct, Sage Business Cloud, MYOB, Wave, Zoho Books, and 20+ more.

## Invoices

```typescript
// List invoices
const { data } = await apideck.accounting.invoices.list({
  serviceId: "quickbooks",
  limit: 50,
  filter: { updated_since: "2024-01-01T00:00:00.000Z" },
  sort: { by: "updated_at", direction: "desc" },
});

// Create invoice
const { data } = await apideck.accounting.invoices.create({
  serviceId: "quickbooks",
  invoice: {
    type: "standard",
    number: "INV-001",
    customer: { id: "customer_123", display_name: "Acme Corp" },
    invoice_date: "2024-06-01",
    due_date: "2024-07-01",
    currency: "USD",
    line_items: [
      {
        description: "Consulting services",
        quantity: 10,
        unit_price: 150,
        total_amount: 1500,
        tax_rate: { id: "tax_rate_1" },
      },
    ],
  },
});

// Get invoice by ID
const { data } = await apideck.accounting.invoices.get({
  id: "invoice_123",
  serviceId: "quickbooks",
});

// Update invoice
const { data } = await apideck.accounting.invoices.update({
  id: "invoice_123",
  serviceId: "quickbooks",
  invoice: { due_date: "2024-08-01" },
});

// Delete invoice
await apideck.accounting.invoices.delete({
  id: "invoice_123",
  serviceId: "quickbooks",
});
```

Key invoice fields: `id`, `number`, `type` (`standard` | `credit`), `customer`, `invoice_date`, `due_date`, `currency`, `line_items[]`, `sub_total`, `total_tax`, `total`, `balance`, `status` (`draft` | `submitted` | `authorised` | `paid` | `voided`), `payment_method`, `tracking_categories[]`, `custom_fields[]`.

## Bills

```typescript
// List bills
const { data } = await apideck.accounting.bills.list({
  serviceId: "xero",
  filter: { updated_since: "2024-01-01T00:00:00.000Z" },
});

// Create bill
const { data } = await apideck.accounting.bills.create({
  serviceId: "xero",
  bill: {
    supplier: { id: "supplier_123" },
    bill_date: "2024-06-01",
    due_date: "2024-07-01",
    currency: "USD",
    line_items: [
      {
        description: "Office supplies",
        quantity: 1,
        unit_price: 250,
        total_amount: 250,
      },
    ],
  },
});
```

## Payments

```typescript
// List payments
const { data } = await apideck.accounting.payments.list({
  serviceId: "quickbooks",
});

// Create payment
const { data } = await apideck.accounting.payments.create({
  serviceId: "quickbooks",
  payment: {
    customer: { id: "customer_123" },
    total_amount: 1500,
    currency: "USD",
    payment_method: "credit_card",
    reference: "PAY-001",
    allocations: [{ id: "invoice_123", type: "invoice", amount: 1500 }],
  },
});
```

## Customers

```typescript
// List customers
const { data } = await apideck.accounting.customers.list({
  serviceId: "quickbooks",
  filter: { company_name: "Acme", email: "billing@acme.com" },
});

// Create customer
const { data } = await apideck.accounting.customers.create({
  serviceId: "quickbooks",
  customer: {
    display_name: "Acme Corp",
    company_name: "Acme Corporation",
    emails: [{ email: "billing@acme.com", type: "primary" }],
    phone_numbers: [{ number: "+1234567890", type: "primary" }],
    addresses: [
      {
        type: "primary",
        street_1: "123 Main St",
        city: "San Francisco",
        state: "CA",
        postal_code: "94105",
        country: "US",
      },
    ],
  },
});
```

## Suppliers

```typescript
const { data } = await apideck.accounting.suppliers.list({
  serviceId: "xero",
  filter: { company_name: "Vendor Inc" },
});

const { data } = await apideck.accounting.suppliers.create({
  serviceId: "xero",
  supplier: {
    display_name: "Vendor Inc",
    company_name: "Vendor Incorporated",
    emails: [{ email: "ap@vendor.com", type: "primary" }],
  },
});
```

## Ledger Accounts

```typescript
// List chart of accounts
const { data } = await apideck.accounting.ledgerAccounts.list({
  serviceId: "quickbooks",
  filter: { type: "expense" },
});

// Create ledger account
const { data } = await apideck.accounting.ledgerAccounts.create({
  serviceId: "quickbooks",
  ledgerAccount: {
    display_id: "6000",
    name: "Marketing Expenses",
    type: "expense",
    sub_type: "expense",
    currency: "USD",
  },
});
```

Ledger account types: `asset`, `liability`, `equity`, `income`, `expense`, `other`.

## Journal Entries

```typescript
const { data } = await apideck.accounting.journalEntries.create({
  serviceId: "quickbooks",
  journalEntry: {
    title: "Monthly depreciation",
    currency: "USD",
    line_items: [
      {
        type: "debit",
        ledger_account: { id: "account_depreciation" },
        total_amount: 500,
        description: "Depreciation expense",
      },
      {
        type: "credit",
        ledger_account: { id: "account_accumulated_dep" },
        total_amount: 500,
        description: "Accumulated depreciation",
      },
    ],
  },
});
```

## Tax Rates (read-only)

```typescript
const { data } = await apideck.accounting.taxRates.list({
  serviceId: "quickbooks",
});

const { data } = await apideck.accounting.taxRates.get({
  id: "tax_rate_1",
  serviceId: "quickbooks",
});
```

## Credit Notes

```typescript
const { data } = await apideck.accounting.creditNotes.create({
  serviceId: "xero",
  creditNote: {
    number: "CN-001",
    customer: { id: "customer_123" },
    currency: "USD",
    line_items: [
      { description: "Refund for defective item", quantity: 1, unit_price: 100, total_amount: 100 },
    ],
  },
});
```

## Purchase Orders

```typescript
const { data } = await apideck.accounting.purchaseOrders.create({
  serviceId: "quickbooks",
  purchaseOrder: {
    po_number: "PO-001",
    supplier: { id: "supplier_123" },
    line_items: [
      { description: "Laptop", quantity: 5, unit_price: 1200, total_amount: 6000 },
    ],
  },
});
```

## Reports

```typescript
// Balance sheet
const { data } = await apideck.accounting.balanceSheet.get({
  serviceId: "quickbooks",
  filter: { start_date: "2024-01-01", end_date: "2024-12-31" },
});
// Returns: assets, liabilities, equity with nested account breakdowns

// Profit & Loss
const { data } = await apideck.accounting.profitAndLoss.get({
  serviceId: "quickbooks",
  filter: { start_date: "2024-01-01", end_date: "2024-12-31" },
});
// Returns: income, expenses, net_income/net_loss with category breakdowns

// Aged Debtors
const { data } = await apideck.accounting.agedDebtors.get({
  serviceId: "quickbooks",
});

// Aged Creditors
const { data } = await apideck.accounting.agedCreditors.get({
  serviceId: "quickbooks",
});
```

## Expenses

```typescript
const { data } = await apideck.accounting.expenses.create({
  serviceId: "quickbooks",
  expense: {
    transaction_date: "2024-06-15",
    account: { id: "account_123" },
    currency: "USD",
    line_items: [
      { description: "Client dinner", total_amount: 150, account: { id: "account_meals" } },
    ],
  },
});
```

## Bill Payments

```typescript
const { data } = await apideck.accounting.billPayments.create({
  serviceId: "quickbooks",
  billPayment: {
    supplier: { id: "supplier_123" },
    total_amount: 250,
    currency: "USD",
    allocations: [{ id: "bill_123", type: "bill", amount: 250 }],
  },
});
```

## Tracking Categories

```typescript
const { data } = await apideck.accounting.trackingCategories.list({
  serviceId: "xero",
});
// Returns categories like departments, projects, cost centers
```

## Attachments

```typescript
// List attachments for a resource
const { data } = await apideck.accounting.attachments.list({
  referenceType: "invoice",
  referenceId: "invoice_123",
  serviceId: "quickbooks",
});

// Download attachment
const { data } = await apideck.accounting.attachments.download({
  referenceType: "invoice",
  referenceId: "invoice_123",
  id: "attachment_123",
  serviceId: "quickbooks",
});
```

## Company Info

```typescript
const { data } = await apideck.accounting.companyInfo.get({
  serviceId: "quickbooks",
});
// Returns: legal_name, company_name, currency, fiscal_year_start_month, addresses, phone_numbers
```
