---
name: apideck-mcp-journal-entry-scan
description: Read-only month-end review of journal entries through the Apideck MCP server. Flags entries worth a second look before the books close (large or round amounts, weekend postings, unusual users, suspense or rarely used accounts, missing descriptions, entries dated after period end) on QuickBooks, Xero, NetSuite, Business Central, Exact Online and every other accounting connector with journal entries. Use when the user asks to "scan journal entries", "review manual journals", "journal entry testing", "find unusual entries", "JE review before close", or "what should I look at before closing the month".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
---

# Journal entry scan (Apideck MCP)

Lists the journal entries posted in a period, scores each one against a set of red flags auditors use when they test journal entries, and returns a short list for a person to review. It never changes an entry.

## IMPORTANT RULES

- **READ-ONLY.** Use only `accounting-journal-entries-all`, `accounting-journal-entries-one`, `accounting-ledger-accounts-all` and `accounting-company-info-one`. Never call an `-add`, `-update` or `-delete` tool from this skill. Start the server with `--scope read` where you can.
- **A flag is a reason to look, not a finding.** Say "worth a look because…", never "fraudulent" or "wrong".
- **Read every page.** Follow `meta.cursors.next` until it's null. A scan of the first 20 entries is not a scan.
- **Say what you could not check.** If the connector rejects a filter or omits a field (`created_by`, `source_type`), list that check as "not available on <connector>", don't skip it silently.

## Inputs

| Input | Default | Notes |
|---|---|---|
| Period | last full calendar month | Ask if the company's fiscal periods are not calendar months. |
| Large-amount threshold | none: ask, or use the top 2% of entries by amount | Materiality is the user's call. |
| Known posting users | none | Ask who normally posts journals; anyone else is "unusual". |
| `service_id` | the consumer's first accounting connection | e.g. `xero`, `quickbooks`, `netsuite`. |

## Steps

1. **Company and currency.** `accounting-company-info-one` for the base currency, so amounts are compared in one currency.
2. **Entries in the period.**
   ```json
   { "name": "accounting-journal-entries-all",
     "arguments": { "limit": 200, "filter": { "start_date": "2026-10-01", "end_date": "2026-10-31" } } }
   ```
   If the connector answers `UnsupportedFiltersError` for the dates, fetch with `filter.updated_since` set to the period start and filter on `posted_at` yourself.
   On Xero, `filter.scope: "manual"` returns only manual journals (the ones people type); the default `system` includes every posting the ledger generates.
3. **Accounts.** `accounting-ledger-accounts-all` once, to name each `line_items[].ledger_account` and find suspense, clearing and rarely used accounts.
4. **Score each entry** with the flags below. Keep entries with at least one flag.
5. **Report** (format below), largest total first.

## Flags

| Flag | Rule | Fields used |
|---|---|---|
| Large | Sum of debit lines at or above the threshold | `line_items[].total_amount`, `type` |
| Round amount | Total is a whole multiple of 1,000 (or of 100 for totals under 10,000) | `line_items[].total_amount` |
| Weekend or holiday posting | `posted_at` falls on a Saturday or Sunday | `posted_at` |
| Late in the period | Posted in the last 2 days of the period, or dated after period end but inside the period | `posted_at`, `created_at` |
| Unusual user | `created_by` is not one of the known posting users | `created_by` |
| Suspense or clearing account | A line hits an account whose name contains suspense, clearing, ask my accountant, or uncategorized | `line_items[].ledger_account` |
| Rarely used account | The account has no other postings in the last 12 months | `ledger_account.id`, a 12-month entry list |
| No description | Both `memo` and every line `description` are empty | `memo`, `line_items[].description` |
| Not posted | `status` is `draft` or `pending_approval` at period end | `status` |

These follow the characteristics of journal entries that auditing standards ask auditors to examine (PCAOB AS 2401.61; ISA 240.A43): entries to unrelated, unusual or seldom-used accounts, entries by people who don't usually make them, entries at period end or after closing with little or no explanation, and round numbers.

## Report

```text
Journal entry scan, Xero, 1 to 31 Oct 2026 (EUR). 214 entries read, 9 worth a look.

1. JE-1042, 31 Oct (Saturday), 25,000.00: Suspense → Consulting fees. Round, weekend, suspense account, no description. Posted by j.smith (not a usual poster).
2. ...

Not checked on this connector: created_by (not returned).
```

Then offer the next step, never take it: "Want me to open any of these (`accounting-journal-entries-one`)?"

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `UnsupportedFiltersError` on `start_date` | Connector has no date-range filter | Use `updated_since` and filter `posted_at` locally |
| Every Xero entry looks system-generated | Default `scope` is `system` | Re-run with `filter.scope: "manual"` |
| `created_by` always null | Connector doesn't expose the user | Report "unusual user" as not available |
| `UrlElicitationRequiredError` | Connection missing or expired | Surface the consent URL, retry |

## Related

- [`apideck-mcp`](../apideck-mcp/): front-door skill (setup, dynamic mode, scopes)
- [`apideck-mcp-close-checklist`](../apideck-mcp-close-checklist/): the rest of the month-end checks
- [`apideck-mcp-month-end-close`](../apideck-mcp-month-end-close/): P&L, balance sheet and aged AP/AR in one call
