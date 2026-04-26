---
name: apideck-mcp-receive-payment
description: Task playbook for recording a customer payment against an invoice via the Apideck MCP server's `apideck-receive-customer-payment` workflow tool. Use when the user says a customer paid an invoice and wants the accounting service updated. AR mirror of `apideck-pay-bill` — same shape, opposite ledger side. Different unified endpoint, different counterparty (customer vs supplier), different allocation type.
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
---

# Receive a customer payment (Apideck MCP)

When the user wants to record a payment against an existing invoice, **prefer `apideck-receive-customer-payment`** over stitching `accounting-invoices-get` + `accounting-payments-create` manually. The workflow tool fetches the invoice, reads its outstanding balance, builds the right allocation with `type: "invoice"`, and surfaces structured errors with `failingStep`.

## When this is the right tool

| User intent | Tool |
|---|---|
| "Customer paid invoice 4", "Apply $500 to invoice 12 from ACME", "Record receipt for invoice 99" | **`apideck-receive-customer-payment`** ✓ |
| "Pay vendor bill X" | `apideck-pay-bill` (AP — accounts payable, different unified endpoint) |
| "Create an unallocated customer prepayment" | `accounting-payments-create` directly (no allocation) |
| "Show me unpaid invoices" | `accounting-invoices-list` with `filter[status]=open` |

## IMPORTANT RULES

- **CONFIRM before calling.** Receive-payment is **mutating and not idempotent** — calling twice creates two payments on the connected service. Always show the user the invoice total, currency, deposit account, and customer, and wait for explicit confirmation before invoking.
- **PASS `payment_method` capitalized for QuickBooks**: `"Check"`, `"CreditCard"`, `"Cash"`. Lower-case fails JSON parsing. Other connectors accept lower-case (`"check"`, `"ach"`, `"wire"`).
- **OMIT `amount` to settle the full outstanding balance.** The workflow defaults to the invoice's `balance` (outstanding), not the gross `total`, so partial-paid invoices don't get over-settled. Only pass `amount` when the user explicitly wants a partial payment.
- **DON'T confuse with `apideck-pay-bill`.** Customer payments (someone owes *you*) → `apideck-receive-customer-payment` → `accounting-payments-create`. Vendor bills (you owe someone) → `apideck-pay-bill` → `accounting-bill-payments-create`. The unified APIs split AR and AP into separate endpoints; the wrong one will be rejected by the connector with confusing error messages (e.g. QuickBooks: `VendorRef missing` when there's a customer on the other side).
- **SET `x-apideck-service-id`** when the consumer has multiple accounting connections.

## Argument map

| Arg | Required | Default | Notes |
|---|---|---|---|
| `invoice_id` | yes | — | From `accounting-invoices-list`. |
| `account_id` | yes | — | The deposit account that received the payment. From `accounting-ledger-accounts-list`. Often a bank or undeposited-funds account. |
| `amount` | no | invoice's outstanding balance | Pass smaller for a partial payment. |
| `transaction_date` | no | today (YYYY-MM-DD) | Some connectors reject future dates. |
| `payment_method` | no | — | QB requires capitalized. |
| `reference` | no | — | Memo / external reference. |
| `x-apideck-service-id` | no | first accounting connection | E.g. `"xero"`, `"quickbooks"`. |

## Result shape

### Success

```json
{
  "invoice_id": "inv-42",
  "payment_id": "pay-77",
  "amount": 250.50,
  "currency": "EUR",
  "transaction_date": "2026-04-26",
  "invoice_total": 250.50,
  "partial": false,
  "service_id": "xero"
}
```

`partial: true` indicates an under-payment; tell the user a follow-up payment is needed for the rest.

### Failure (with `isError: true`)

```json
{
  "invoice_id": "inv-42",
  "amount": 100,
  "currency": "USD",
  "error": "accounting-payments-create failed: ...",
  "failingStep": "accounting-payments-create",
  "upstream": { ... }
}
```

`failingStep` values:
- `accounting-invoices-get` — invoice ID wrong or connector lost the record
- `validate-amount` — invoice has zero outstanding balance (already paid)
- `accounting-payments-create` — payment write failed; check `upstream`

## Worked example

User: *"ACME paid invoice inv-42 for $250.50 by check. Apply it to our bank account."*

1. The user already gave you the invoice id. Find the deposit account: `accounting-ledger-accounts-list` filtered to bank — say `"acc-bank"`.
2. **Confirm**: *"Recording $250.50 payment from ACME on invoice inv-42 to bank account acc-bank via Xero, payment method check. Confirm?"*
3. On confirmation:
   ```json
   {
     "name": "apideck-receive-customer-payment",
     "arguments": {
       "invoice_id": "inv-42",
       "account_id": "acc-bank",
       "payment_method": "check",
       "x-apideck-service-id": "xero"
     }
   }
   ```
4. Surface `payment_id` to the user.

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `failingStep: validate-amount` | Invoice already fully paid | Confirm with user; pass explicit `amount` only if recording an over-payment is intentional |
| Moneybird returns 404 from `/accounting/payments` | Moneybird models customer payments as `financial_mutations`, not `payments` | Connector coverage gap; surface the limitation, fall back to the [Proxy API](https://developers.apideck.com/products/proxy) |
| QB rejects with parse error | `payment_method` lower-case | Pass `"Check"` (capitalized) for QB |
| `UrlElicitationRequiredError` | Connection expired/missing | Surface consent URL, retry after OAuth |

## Related

- [`apideck-mcp`](../apideck-mcp/) — front-door skill
- [`apideck-mcp-pay-bill`](../apideck-mcp-pay-bill/) — AP mirror (paying a vendor bill)
- Workflow source: [src/gen/workflows/receivePayment.ts](https://github.com/apideck-libraries/mcp/blob/main/src/gen/workflows/receivePayment.ts)
