---
name: apideck-mcp-accruals-check
description: Read-only accruals check through the Apideck MCP server. Finds suppliers who bill every month but have no bill in the period being closed, and estimates the amount to accrue from their recent bills, on QuickBooks, Xero, NetSuite, Business Central, Exact Online, Sage and every other accounting connector with bills. Use when the user asks "what should I accrue", "missing bills this month", "accruals check", "expected vendor bills", "recurring bills not received" or "unbilled expenses before close".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
---

# Accruals check (Apideck MCP)

An accrued expense is a cost the company has incurred in the period but hasn't been billed for yet. This skill looks for the most common case: a supplier who bills every month, missing from the month being closed. It proposes amounts; a person decides what to book.

## IMPORTANT RULES

- **READ-ONLY.** Use only `accounting-bills-all`, `accounting-suppliers-all` and `accounting-expenses-all`. Never post an accrual journal from this skill. If the user wants one booked, show the proposed lines and let them post it themselves.
- **An estimate is an estimate.** Show how it was worked out (the bills it came from) next to every number.
- **Read every page** (`meta.cursors.next`).

## Inputs

| Input | Default | Notes |
|---|---|---|
| Period being closed | last full calendar month | |
| Look-back | the 3 periods before it | "Recurring" means a bill in each of them |
| Minimum amount | none | Skip suppliers whose typical bill is below it |
| `service_id` | first accounting connection | |

## Steps

1. **Bills for the look-back and the period.**
   ```json
   { "name": "accounting-bills-all",
     "arguments": { "limit": 200, "filter": { "billed_since": "2026-07-01" } } }
   ```
2. **Group by supplier** (`supplier.id`) and by month of `bill_date`.
3. **Recurring suppliers:** a bill in every month of the look-back.
4. **Missing this period:** recurring suppliers with no bill dated in the period being closed. Also check `accounting-expenses-all` for the period: a card or direct payment to the same supplier means nothing is missing.
5. **Estimate:** the median of the supplier's look-back bill totals (median, so one odd month doesn't skew it), with the ledger account most of those bills used (`line_items[].ledger_account`).
6. **Report** (format below), largest estimate first.

## Report

```text
Accruals check, QuickBooks, October 2026 (look-back July to September). 14 suppliers bill monthly; 3 have no October bill.

1. CloudHost Ltd: about 2,150.00 to Hosting (6100). Jul 2,100.00, Aug 2,150.00, Sep 2,190.00.
2. ...

Proposed journal (not posted): Dr Hosting 2,150.00 / Cr Accrued expenses 2,150.00, dated 31 Oct 2026, reverse on 1 Nov 2026.
```

Say which suppliers were skipped and why (below the minimum, a payment found in expenses).

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| A quarterly supplier shows as missing | Look-back too short to see the pattern | Treat only monthly patterns as recurring; mention quarterly ones separately |
| The same supplier appears twice | Duplicate supplier records in the ledger | Group by name as well as id and point out the duplicate |
| Bills arrive late every month | Supplier bills after period end | Re-run a few days after period end, or include bills dated in the period but entered later |

## Related

- [`apideck-mcp`](../apideck-mcp/): front-door skill
- [`apideck-mcp-close-checklist`](../apideck-mcp-close-checklist/): the rest of the month-end checks
- [`apideck-mcp-po-bill-match`](../apideck-mcp-po-bill-match/): bills that did arrive, checked against their POs
