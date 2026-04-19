## BambooHR via Apideck HRIS

BambooHR is the reference SMB HRIS connector on Apideck. Full employee and org coverage; payroll coverage is read-only (BambooHR doesn't run payroll itself — it integrates with providers like TRAXPayroll).

### Entity mapping

| BambooHR entity | Apideck HRIS resource |
|---|---|
| Employee | `employees` |
| Department | `departments` (derived from employee dept field) |
| Time Off Request | `time-off-requests` |
| Time Off Policy | `time-off-policies` |
| Employment Status | `employments` (historical employment records) |
| Company | `companies` |
| Job | exposed via `employees[].jobs[]` |
| Custom fields | exposed as `employees[].custom_fields[]` |

### Coverage highlights

- ✅ Full CRUD on employees (incl. custom fields)
- ✅ Time-off requests — read, approve, reject
- ✅ Employee photos via `employees/{id}/photo`
- ✅ Sensitive fields (SSN, DOB) — requires elevated permissions on the API key
- ⚠️ Departments are derived from employee records, not a first-class BambooHR entity
- ⚠️ Payroll data — read-only; BambooHR surfaces summaries from integrated payroll providers
- ❌ Benefits enrollment — use Proxy
- ❌ Performance reviews — use Proxy
- ❌ Hiring / ATS-adjacent data — use a dedicated ATS connector

### BambooHR-specific auth notes

- **Auth type:** API key (not OAuth). The user generates a key from BambooHR under "API Keys" in their account settings and pastes it into the Vault modal.
- **Subdomain required:** BambooHR API keys are bound to a company subdomain (e.g., `acme.bamboohr.com`). The user provides the subdomain alongside the key during Vault setup. Changing subdomain = reconfigure the connection.
- **Key permissions = user permissions:** the API key inherits the generating user's role. Sensitive fields (SSN, DOB, compensation) require admin-level access — limited keys get 403s on those fields. If sensitive data is missing from responses, check whether the key-generating user is an admin.

### Common BambooHR quirks handled by Apideck

- **Field naming** — BambooHR uses camelCase (`firstName`, `hireDate`); Apideck normalizes to snake_case (`first_name`, `hire_date`).
- **Custom fields** — BambooHR custom fields are prefixed `custom` in the raw API. Apideck exposes them as a structured `custom_fields[]` array with `id`, `name`, `value`.
- **Historical data** — employment history surfaced as `employments[]` ordered by `effective_date`.
- **Photo URLs** — signed URLs that expire. Fetch-through rather than cache.

### Example: sync all employees with custom fields

```typescript
let cursor;
const all = [];

do {
  const { data, pagination } = await apideck.hris.employees.list({
    serviceId: "bamboohr",
    cursor,
    fields: "id,first_name,last_name,email,department,job_title,custom_fields",
  });
  all.push(...data);
  cursor = pagination?.cursors?.next;
} while (cursor);

console.log(`Synced ${all.length} employees`);
```

### Example: approve a time-off request

The time-off-request endpoint is nested under employee (`/hris/time-off-requests/employees/{employee_id}/time-off-requests/{id}`). Check [`apideck-node`](../../skills/apideck-node/) for the canonical method signature.

```typescript
await apideck.hris.timeOffRequests.update({
  serviceId: "bamboohr",
  employeeId: "emp_001",
  id: "req_123",
  timeOffRequest: { status: "approved" },
});
```
