---
name: apideck-mcp-pay-bill
description: Task playbook for paying a vendor bill via the Apideck MCP server's `apideck-pay-bill` workflow tool. Use when the user asks to settle, pay, or close a known accounts-payable bill in QuickBooks, Xero, NetSuite, or any other connected accounting service. Covers confirmation prompts, partial payments, payment-method capitalization quirks, and the AP-vs-AR routing decision agents routinely get wrong.
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
---

# Pay a vendor bill (Apideck MCP)

When the user wants to pay a known vendor bill, **prefer `apideck-pay-bill`** over stitching `accounting-bills-get` + `accounting-bill-payments-create` manually. The workflow tool fetches the bill, reads its outstanding balance, builds the right allocation, picks the correct AP endpoint, and surfaces structured errors with `failingStep` so you know which leg broke.

## When this is the right tool

| User intent | Tool |
|---|---|
| "Pay bill 6", "Settle the LinkedIn invoice", "Close out bill from RocketReach" | **`apideck-pay-bill`** ✓ |
| "Record that customer paid invoice 4" | `apideck-receive-customer-payment` (AR mirror — different unified endpoint) |
| "Create a prepayment / unallocated transfer" | `accounting-payments-create` directly (no allocation) |
| "Show me unpaid bills" | `accounting-bills-list` with `filter[status]=open` |

## IMPORTANT RULES

- **CONFIRM before calling.** Pay-bill is **mutating and not idempotent** — calling twice creates two payments on the connected service. Always show the user the bill total, currency, payment account, and supplier, and wait for explicit confirmation before invoking the tool.
- **PASS `payment_method` as a capitalized value when targeting QuickBooks**: `"Check"`, `"CreditCard"`, `"Cash"`. Lower-case `"check"` triggers a generic JSON-parse rejection from QuickBooks before any meaningful validation runs. Other connectors accept lower-case (`"check"`, `"ach"`, `"wire"`, `"credit_card"`).
- **DON'T pass `amount` to pay the full balance** — omit it and the workflow defaults to the bill's outstanding balance (which is the correct amount even on partially-settled bills). Only pass `amount` when the user explicitly wants a partial payment.
- **SET `x-apideck-service-id`** when the consumer has multiple accounting connections (e.g. both Xero and QuickBooks). Otherwise the call routes to whichever connection Apideck picks first.
- **DON'T confuse with `apideck-receive-customer-payment`.** Bills are accounts payable (you owe money). Invoices are accounts receivable (someone owes you). They route to *different* unified endpoints under the hood.

## Argument map

| Arg | Required | Default | Notes |
|---|---|---|---|
| `bill_id` | yes | — | From `accounting-bills-list`. The numeric or UUID id Apideck returns. |
| `account_id` | yes | — | The bank/cash account the payment is drawn from. From `accounting-ledger-accounts-list` filtered to `type=bank`. |
| `amount` | no | bill's outstanding balance | In bill's currency. Pass smaller for a partial payment. |
| `transaction_date` | no | today (YYYY-MM-DD) | Some connectors reject future dates. |
| `payment_method` | no | — | QB requires capitalized: `"Check"` etc. Other connectors flexible. |
| `reference` | no | — | Memo / external reference shown on the payment record. |
| `x-apideck-service-id` | no | first accounting connection | E.g. `"xero"`, `"quickbooks"`. |

## Result shape

### Success

```json
{
  "bill_id": "4",
  "payment_id": "pay-77",
  "amount": 742.45,
  "currency": "USD",
  "transaction_date": "2026-04-26",
  "bill_total": 742.45,
  "partial": false,
  "service_id": "quickbooks"
}
```

`partial: true` means the agent paid less than the bill's outstanding balance. Use this to confirm with the user that a follow-up payment will be needed.

### Failure (with `isError: true`)

```json
{
  "bill_id": "4",
  "amount": 1,
  "currency": "USD",
  "error": "accounting-bill-payments-create failed: ...",
  "failingStep": "accounting-bill-payments-create",
  "upstream": { "status_code": 400, "type_name": "ConnectorExecutionError", ... }
}
```

`failingStep` tells you which leg failed:
- `accounting-bills-get` — the bill ID is wrong or the connector lost the record
- `validate-amount` — the bill has no positive outstanding balance (already paid, or zero-total)
- `accounting-bill-payments-create` — the payment write itself failed; inspect `upstream` for connector-specific reason

## Worked example

User: *"Pay the bill from LinkedIn for $742.45 from Business Checking."*

1. `accounting-bills-list` with `filter: { supplier_id: ... }` to find the bill ID — say `"4"`.
2. `accounting-ledger-accounts-list` with `filter: { type: "bank" }` to find Business Checking — say `"8"`.
3. **Confirm with the user**: *"Paying bill 4 (LinkedIn, $742.45 USD) from Business Checking via QuickBooks. Confirm?"*
4. On confirmation, call:
   ```json
   {
     "name": "apideck-pay-bill",
     "arguments": {
       "bill_id": "4",
       "account_id": "8",
       "payment_method": "Check",
       "x-apideck-service-id": "quickbooks"
     }
   }
   ```
5. Surface the resulting `payment_id` to the user.

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `failingStep: validate-amount` | Bill has zero outstanding balance | Either it's already paid, or pass an explicit `amount` to override |
| QuickBooks rejects with `Property Name:failed to parse json object` | `payment_method` lower-case | Pass `"Check"` (capitalized) for QB |
| QuickBooks rejects with `CustomerRef missing` | Wrong unified endpoint chosen — workflow protects against this | Should not happen via `apideck-pay-bill`; if it does, file a bug |
| `failingStep: accounting-bill-payments-create` with `Subscription period has ended` | QB sandbox/account billing issue, not a workflow bug | Renew connector subscription |
| `UrlElicitationRequiredError` thrown | Connection expired or never authorized | Surface the consent URL to user, retry after OAuth |

## Related

- [`apideck-mcp`](../apideck-mcp/) — front-door skill for the MCP server itself
- [`apideck-mcp-receive-payment`](../apideck-mcp-receive-payment/) — AR mirror (customer paying you)
- Workflow source: [src/gen/workflows/payBill.ts](https://github.com/apideck-libraries/mcp/blob/main/src/gen/workflows/payBill.ts)
