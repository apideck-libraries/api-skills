---
name: apideck-mcp-po-bill-match
description: Read-only two-way or three-way match of vendor bills against purchase orders (and goods receipts where the ledger has them) through the Apideck MCP server. Lists bills whose amount, quantity or unit price differs from the purchase order by more than a tolerance, bills that point at a missing or closed PO, and large bills with no PO, on QuickBooks, Xero, NetSuite, Business Central, Odoo, Pennylane, Zoho Books and any other connector with purchase orders. Use when the user asks to "match bills to purchase orders", "two-way match", "three-way match", "PO match", "check invoices against POs", "AP exceptions" or "bills without a PO".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
---

# PO-to-bill match (Apideck MCP)

Compares each vendor bill in a period with the purchase order it references and reports the differences above a tolerance. By default it's a **two-way match** (purchase order against bill). Where the ledger exposes goods receipts (`accounting-goods-receipts-all`, beta: NetSuite, Business Central, Odoo, SAP S/4HANA Cloud), it adds the third leg and checks billed quantities against received quantities. Elsewhere, say the match is two-way.

## IMPORTANT RULES

- **READ-ONLY.** Use only `accounting-bills-all`, `accounting-bills-one`, `accounting-purchase-orders-all`, `accounting-purchase-orders-one`, `accounting-goods-receipts-all`, `accounting-goods-receipts-one` and `accounting-suppliers-all`. Never create, update, approve or pay anything from this skill.
- **Check coverage first.** Not every accounting connector has purchase orders (Sage Intacct, Exact Online and FreeAgent don't in the unified API today). If `accounting-purchase-orders-all` returns an unsupported-resource error, stop and say so.
- **Read every page** of both lists (`meta.cursors.next`).
- **Tolerance is the user's call.** Ask for it (percentage, amount, or both). Without an answer, use 0 and report every difference.

## Inputs

| Input | Default | Notes |
|---|---|---|
| Period | last full calendar month, by `bill_date` | |
| Tolerance | ask; else 0 | e.g. "2% or 50.00, whichever is larger" |
| No-PO threshold | ask; else skip that check | Bills above it with no PO are listed |
| `service_id` | first accounting connection | |

## Steps

1. **Bills in the period.**
   ```json
   { "name": "accounting-bills-all",
     "arguments": { "limit": 200, "filter": { "billed_since": "2026-10-01" } } }
   ```
   Drop bills with `bill_date` after the period end.
2. **Purchase orders.** `accounting-purchase-orders-all` with `filter.updated_since` about 6 months before the period start (POs are raised before the bill). Index them by `id` and by `po_number`.
3. **Goods receipts (three-way only).** `accounting-goods-receipts-all` with the same `updated_since`. An unsupported-resource error means two-way only; carry on without it. Index receipts by `purchase_order_id` (and `po_number`); a line's `quantity_received` is what arrived.
4. **Link each bill to its PO.** In this order: `line_items[].purchase_order.id`, then the bill's `po_number` against the PO's `po_number`. A bill can reference several POs through its lines.
5. **Compare.**
   - Header: bill `total` against PO `total` (same currency; if `currency` differs, report it and don't compare).
   - Lines, where both sides have them: match by `item.id`, else by `description`; compare `quantity`, `unit_price` and `total_amount`.
   - Running total: the sum of all bills against one PO above the PO total means it's billed beyond what was ordered.
   - Three-way: billed `quantity` per PO line above the summed `quantity_received` on its receipts.
6. **Report** (format below), largest difference first.

## Exceptions

| Exception | Rule |
|---|---|
| Over the PO | Bill total, or the sum of bills on the PO, is above the PO total by more than the tolerance |
| Price difference | A line's `unit_price` differs from the PO line beyond the tolerance |
| Quantity difference | A line's `quantity` is above the PO line's `quantity` |
| Billed before received (three-way) | Billed quantity on a PO line is above the quantity received on its goods receipts |
| PO not found | The bill names a PO number or id that isn't in the list |
| PO not open | The PO `status` is `draft`, `closed` or `deleted`, or `billed` (already fully billed) when this bill is a new one |
| Supplier mismatch | Bill `supplier.id` differs from the PO `supplier.id` |
| No PO | Bill total above the no-PO threshold and no PO linked |

## Report

```text
PO-to-bill match, NetSuite, bills dated 1 to 31 Oct 2026. 86 bills, 61 linked to a PO, 5 exceptions (tolerance 2% or 50.00).

1. Bill 4471 (Acme Supplies), 12,400.00 against PO-2210 at 11,800.00: over by 600.00 (5.1%). Line 2 unit price 62.00 vs 59.00.
2. ...

Bills with no PO above 5,000.00: 3 (listed below).
Match: two-way (NetSuite goods receipts not found for 4 POs; those 4 are two-way).
```

Offer to open a bill or PO; never approve, hold or pay from this skill. To pay a bill that checks out, the user can switch to [`apideck-mcp-pay-bill`](../apideck-mcp-pay-bill/).

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Unsupported resource on purchase orders | Connector has no PO support | Stop; say which connectors do |
| No bill links to any PO | The ledger stores the PO number only in `reference` or a custom field | Ask the user where their team records it; match on that field |
| Line comparison impossible | One side has no line items (summary bills) | Compare header totals only and say so |

## Related

- [`apideck-mcp`](../apideck-mcp/): front-door skill
- [`apideck-mcp-pay-bill`](../apideck-mcp-pay-bill/): pay a bill once it's approved
- [`apideck-mcp-accruals-check`](../apideck-mcp-accruals-check/): bills you expected but haven't received
