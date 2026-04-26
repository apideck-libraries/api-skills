---
name: apideck-mcp-onboard-employee
description: Task playbook for converting a hired ATS applicant into an HRIS employee via the Apideck MCP server's `apideck-onboard-employee` workflow tool. First cross-unified-API workflow — requires both ATS and HRIS connections active on the consumer. Optionally moves the applicant to a "hired" stage in the ATS to close the loop.
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
---

# Onboard an employee from an applicant (Apideck MCP)

When the user has decided to hire a candidate and wants the new employee record created in their HRIS, **prefer `apideck-onboard-employee`** over manually mapping ATS fields onto an HRIS create call. The workflow fetches the applicant, maps name/contact/address fields onto the HRIS shape, creates the employee, and optionally updates the ATS stage.

## When this is the right tool

| User intent | Tool |
|---|---|
| "Onboard candidate Alice from Greenhouse to BambooHR", "Convert applicant 42 into an employee starting Monday" | **`apideck-onboard-employee`** ✓ |
| "Create an employee from scratch (no ATS lineage)" | `hris-employees-create` directly |
| "Move applicant to a different ATS stage without HRIS work" | `ats-applicants-update` directly |
| "Re-hire an existing employee" | Out of scope — usually a different HRIS endpoint per connector |

## IMPORTANT RULES

- **CONFIRM before calling.** Onboard is **mutating and not idempotent** — calling twice creates two HRIS employee records. Always confirm with the user the applicant name, start date, department, and target HRIS.
- **CROSSES TWO UNIFIED APIS.** The consumer needs both an ATS connection (Greenhouse, Lever, Workable, …) AND an HRIS connection (BambooHR, Workday, Personio, …) authorized in Vault. If either is missing the workflow throws an elicitation pointing at the missing one.
- **TWO SEPARATE SERVICE-ID HEADERS.** Unlike the accounting workflows, this one takes `x-apideck-ats-service-id` *and* `x-apideck-hris-service-id` separately — the underlying connectors are different, and the routing has to be set per call.
- **`hired_stage_id` IS OPTIONAL AND SOFT-FAILS.** If you pass it, the workflow tries to move the applicant to that stage in the ATS *after* creating the employee. If the ATS update fails, the workflow returns `isError: false` with a `warnings[]` entry — the employee was already created, and rolling back would leave the workspace in a worse state than partial success. Surface the warning to the user so they can move the applicant manually.
- **VALIDATION HAPPENS AT THE BOUNDARY.** If the applicant has no first or last name, the workflow returns `failingStep: "validate-applicant"` before touching the HRIS — the connector would reject a blank-name employee anyway, and we'd rather fail fast.

## Argument map

| Arg | Required | Default | Notes |
|---|---|---|---|
| `applicant_id` | yes | — | From `ats-applicants-list`. |
| `employment_start_date` | yes | — | First day of employment, `YYYY-MM-DD`. Most HRIS connectors require this. |
| `department_id` | no | — | From `hris-departments-list`. Some HRIS connectors require it; others derive from job. |
| `title` | no | applicant's `headline` or `title` | Job title. |
| `manager_id` | no | — | Reporting manager's HRIS employee id. |
| `employment_status` | no | `"active"` | One of `active`, `inactive`, `pending`, `leave`, `terminated`. |
| `hired_stage_id` | no | — | If set, moves the ATS applicant to this stage after employee creation. Soft-fails. |
| `x-apideck-ats-service-id` | no | first ATS connection | E.g. `"greenhouse"`, `"lever"`. |
| `x-apideck-hris-service-id` | no | first HRIS connection | E.g. `"bamboohr"`, `"workday"`. |

## Result shape

### Success (no stage move)

```json
{
  "applicant_id": "app-1",
  "employee_id": "emp-99",
  "first_name": "Ada",
  "last_name": "Lovelace",
  "employment_start_date": "2026-05-01",
  "title": "Senior Engineer",
  "department_id": "dept-eng",
  "ats_service_id": "greenhouse",
  "hris_service_id": "bamboohr"
}
```

### Soft-fail (employee created, stage move failed)

```json
{
  "applicant_id": "app-1",
  "employee_id": "emp-99",
  "first_name": "Ada",
  "last_name": "Lovelace",
  ...
  "warnings": [
    "Employee created but ATS stage update failed: Greenhouse momentarily unavailable. Move the applicant to the Hired stage manually."
  ]
}
```

`isError: false`. Tell the user the employee landed in HRIS, and they need to mark the applicant Hired manually.

### Hard fail

```json
{
  "applicant_id": "app-X",
  "error": "...",
  "failingStep": "ats-applicants-get" | "validate-applicant" | "hris-employees-create",
  "upstream": { ... }
}
```

`failingStep` values:
- `ats-applicants-get` — applicant ID wrong, ATS connection missing, or ATS connector down. Likely an elicitation if connection-level.
- `validate-applicant` — applicant has no first/last name; can't create a usable employee.
- `hris-employees-create` — HRIS rejected the body. Inspect `upstream` for the per-connector reason (often `department_id required` or `manager_id invalid`).

## Worked example

User: *"Onboard applicant app-1 (Ada Lovelace) into BambooHR starting May 1, engineering department, manager mgr-7. Move them to the Hired stage in Greenhouse."*

1. **Confirm**: *"Creating BambooHR employee Ada Lovelace, start 2026-05-01, department dept-eng, manager mgr-7. Will also move the Greenhouse applicant to stage `stage-hired`. Confirm?"*
2. On confirmation:
   ```json
   {
     "name": "apideck-onboard-employee",
     "arguments": {
       "applicant_id": "app-1",
       "employment_start_date": "2026-05-01",
       "department_id": "dept-eng",
       "manager_id": "mgr-7",
       "hired_stage_id": "stage-hired",
       "x-apideck-ats-service-id": "greenhouse",
       "x-apideck-hris-service-id": "bamboohr"
     }
   }
   ```
3. Surface `employee_id` to the user. If `warnings[]` is present, tell them what didn't happen.

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `failingStep: validate-applicant` | Applicant record has empty name fields | Verify applicant ID; consider whether the ATS exposes the name under a different field name |
| `failingStep: hris-employees-create` with `department_id required` | Connector requires explicit department | Pass `department_id` from `hris-departments-list` |
| `warnings[]` with stage-update failure | Optional ATS update failed after employee was created | Tell user to mark applicant Hired manually; don't retry the workflow (would create a duplicate employee) |
| `UrlElicitationRequiredError` for ATS or HRIS | Either connection missing | Surface consent URL for the named unified API, retry |

## Related

- [`apideck-mcp`](../apideck-mcp/) — front-door skill
- Workflow source: [src/gen/workflows/onboardEmployee.ts](https://github.com/apideck-libraries/mcp/blob/main/src/gen/workflows/onboardEmployee.ts)
- ATS connectors: [`ats`](../ats/), HRIS connectors: [`hris`](../hris/) — for understanding which downstream services support what fields
