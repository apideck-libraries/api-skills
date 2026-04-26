---
name: apideck-mcp-month-end-close
description: Task playbook for fetching a month-end financial snapshot via the Apideck MCP server's `apideck-month-end-close-check` workflow tool. Use when the user asks for a P&L, balance sheet, aged creditors, or aged debtors view at a point in time. Read-only, idempotent, returns partial snapshots when some reports aren't supported by the connector.
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
---

# Month-end close snapshot (Apideck MCP)

When the user wants a one-shot financial snapshot, **prefer `apideck-month-end-close-check`** over fetching the four reports individually. The workflow fans out aged creditors, aged debtors, balance sheet, and profit-and-loss in parallel against the connected accounting service and returns one aggregated object.

## When this is the right tool

| User intent | Tool |
|---|---|
| "Run the month-end close", "P&L plus balance sheet for last month", "Aged AP/AR snapshot as of March 31" | **`apideck-month-end-close-check`** ✓ |
| "Just the P&L" | `accounting-profit-and-loss-get` directly |
| "Just aged creditors" | `accounting-aged-creditors-get` directly |
| "Reconcile bank statements" | Out of scope — use the connector's native reconciliation |

## IMPORTANT RULES

- **READ-ONLY, idempotent.** Safe to call repeatedly — no confirmation needed. The tool fetches data; it doesn't post anything.
- **OMIT `report_as_of_date` to use today.** Most users running a month-end ask for "last month", in which case pass an explicit `YYYY-MM-DD` like `"2026-03-31"`.
- **EXPECT partial results.** Connector coverage varies — Odoo doesn't implement aged-creditors, Moneybird doesn't implement balance-sheet, etc. The workflow returns `{ unsupported: true, reason }` for steps the connector can't fulfill, plus a top-level `warnings[]` array. Surface these to the user instead of treating them as failures.
- **`isError: true` only fires when *every* report failed** — typically a missing connection or expired credentials. Partial snapshots come back as `isError: false` so the agent can still extract value.

## Argument map

| Arg | Required | Default | Notes |
|---|---|---|---|
| `report_as_of_date` | no | today (YYYY-MM-DD) | Cutoff date for aged reports + balance sheet. |
| `x-apideck-service-id` | no | first accounting connection | E.g. `"xero"`, `"quickbooks"`. |

## Result shape

### Full success

```json
{
  "report_as_of_date": "2026-03-31",
  "service_id": "xero",
  "aged_creditors": { "summary": [...] },
  "aged_debtors":   { "summary": [...] },
  "balance_sheet":  { "assets": 100000, ... },
  "profit_and_loss":{ "revenue": 250000, ... }
}
```

### Partial — some reports unsupported

```json
{
  "report_as_of_date": "2026-03-31",
  "service_id": "odoo",
  "aged_creditors": { "unsupported": true, "reason": "Aged-creditors not implemented for Odoo" },
  "aged_debtors":   { "unsupported": true, "reason": "..." },
  "balance_sheet":  { "assets": 100000, ... },
  "profit_and_loss":{ "revenue": 250000, ... },
  "warnings": [
    "aged_creditors: unsupported on odoo (...)",
    "aged_debtors: unsupported on odoo (...)"
  ]
}
```

`isError: false` — two reports came back, that's still useful.

### Total failure

```json
{
  "report_as_of_date": "2026-03-31",
  "service_id": null,
  "aged_creditors": { "error": "..." },
  "aged_debtors":   { "error": "..." },
  "balance_sheet":  { "error": "..." },
  "profit_and_loss":{ "error": "..." },
  "warnings": [...]
}
```

With `isError: true`. Usually a missing connection — surface the elicitation URL.

## Worked example

User: *"Give me a month-end snapshot for March 2026 from QuickBooks."*

```json
{
  "name": "apideck-month-end-close-check",
  "arguments": {
    "report_as_of_date": "2026-03-31",
    "x-apideck-service-id": "quickbooks"
  }
}
```

Then summarize for the user, calling out any `unsupported` rows distinctly:

> *On 2026-03-31 in QuickBooks: revenue $250K, total assets $100K. Aged creditors / aged debtors aren't supported by this connector — pull those from the Bills-list and Invoices-list reports if you need them.*

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| All four reports `unsupported` | Connector doesn't implement these (e.g. Odoo without the Reports module) | Surface the limitation; suggest aggregating from `accounting-bills-list` + `accounting-invoices-list` instead |
| `UnsupportedFiltersError` on a report | Connector rejects `filter[report_as_of_date]` or `filter[end_date]` | Connector quirk — currently surfaces as `unsupported` with the upstream message |
| `UrlElicitationRequiredError` | Connection expired/missing | Surface consent URL, retry |

## Related

- [`apideck-mcp`](../apideck-mcp/) — front-door skill
- Workflow source: [src/gen/workflows/monthEndClose.ts](https://github.com/apideck-libraries/mcp/blob/main/src/gen/workflows/monthEndClose.ts)
