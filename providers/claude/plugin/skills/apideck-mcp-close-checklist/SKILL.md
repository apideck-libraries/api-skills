---
name: apideck-mcp-close-checklist
description: Read-only month-end close checklist through the Apideck MCP server. Checks whether the period is locked, lists draft or unapproved journal entries, overdue unpaid bills, bills on hold, unreconciled payments and balances left in suspense accounts, and pulls the P&L, balance sheet and aged AP/AR snapshot, on QuickBooks, Xero, NetSuite, Business Central, Exact Online and every other accounting connector. Use when the user asks "are we ready to close", "close checklist", "month-end checklist", "what's left before close", "is the period locked" or "pre-close review".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
---

# Close checklist (Apideck MCP)

Runs the read-only checks a controller does before calling a month closed and returns one checklist: done, open, or can't check on this ledger. It never locks a period or posts anything.

## IMPORTANT RULES

- **READ-ONLY.** Use only `-all`, `-one` and report tools: `accounting-fiscal-periods-all`, `accounting-journal-entries-all`, `accounting-bills-all`, `accounting-payments-all`, `accounting-bill-payments-all`, `accounting-ledger-accounts-all`, `accounting-trial-balance-one`, and the `apideck-month-end-close-check` workflow. Locking the period is the user's job in their ledger.
- **Three states per check:** ✅ done, ⚠️ open (with the items), — can't check on this connector (with the reason). Never report a check as done because the tool was unsupported.
- **Read every page** (`meta.cursors.next`).

## Inputs

| Input | Default |
|---|---|
| Period | last full calendar month |
| `service_id` | first accounting connection |

## Checks

| # | Check | Tool and rule |
|---|---|---|
| 1 | Period lock | `accounting-fiscal-periods-all`: the period's `status` is `closed` or `locked`, or `locked_through` is on or after the period end. `open` means it's still open for posting. |
| 2 | Unposted journals | `accounting-journal-entries-all` with `filter.start_date`/`end_date` for the period and `filter.status` `draft`, then `pending_approval`. Any result is open. |
| 3 | Overdue bills | `accounting-bills-all` with `filter.status: "unpaid"` (and `partially_paid`): `due_date` before the period end. List the 10 largest by `balance`. |
| 4 | Draft and held bills | `accounting-bills-all` for the period: `status` `draft` or `submitted` (entered, not yet approved), and `payment_hold: true`. |
| 5 | Suspense balance | `accounting-ledger-accounts-all`: accounts named suspense, clearing or uncategorized with a non-zero `current_balance`. |
| 6 | Trial balance | `accounting-trial-balance-one` with `filter.end_date` = period end: `total_debit` equals `total_credit`. |
| 7 | Bank reconciliation | `accounting-payments-all` and `accounting-bill-payments-all` with `filter.updated_since` at the period start: payments dated in the period with `reconciled: false` are open. Bank `accounting-ledger-accounts-all` entries with `last_reconciliation_date` before the period end are open too. |
| 8 | Snapshot | `apideck-month-end-close-check` with `report_as_of_date` = period end. Pass through its `warnings[]`. |

Reconciliation state depends on the ledger. The `reconciled` flag is filled on Xero, Sage Intacct, Holded, SAP S/4HANA Cloud and a few others; `last_reconciliation_date` on MYOB. On QuickBooks, NetSuite, Business Central and Exact Online both come back empty: if `reconciled` is null on every payment, report check 7 as "can't check on <connector>: check in the ledger's reconciliation screen", never as done.

## Report

```text
Close checklist, Xero, October 2026

✅ Trial balance: debits = credits (412,880.10)
⚠️ Period lock: October is open (lock date 30 Sep 2026)
⚠️ Unposted journals: 2 drafts (JE-1050 accrual reversal 2,150.00; JE-1051 payroll 18,400.00)
⚠️ Overdue bills: 6, total 9,812.00 (largest: Acme Supplies 4,200.00, due 12 Oct)
✅ Draft and held bills: none
⚠️ Suspense: 1,250.00 in Suspense (9999)
⚠️ Bank reconciliation: 14 October payments not reconciled (Business account)
✅ Snapshot: P&L, balance sheet, aged AP/AR fetched
```

Then suggest the next step for each open item, e.g. "run [`apideck-mcp-journal-entry-scan`](../apideck-mcp-journal-entry-scan/) before you lock October".

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Fiscal periods unsupported | Not every connector exposes periods (fiscal periods are beta on most) | Mark check 1 "can't check"; ask the user for the lock date |
| Trial balance unsupported | Connector has no trial balance report | Mark check 6 "can't check"; the balance sheet in check 8 still has to balance |
| `status` filter rejected on journals | Connector can't filter by status | List the period's entries and filter `status` locally |

## Related

- [`apideck-mcp-month-end-close`](../apideck-mcp-month-end-close/): the snapshot workflow used in check 8
- [`apideck-mcp-journal-entry-scan`](../apideck-mcp-journal-entry-scan/), [`apideck-mcp-po-bill-match`](../apideck-mcp-po-bill-match/), [`apideck-mcp-accruals-check`](../apideck-mcp-accruals-check/): the deeper checks
