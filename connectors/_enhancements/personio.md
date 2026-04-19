## Personio via Apideck HRIS

Personio is a European SMB HRIS. Apideck currently covers employees and time-off requests.

### Entity mapping

| Personio entity | Apideck HRIS resource |
|---|---|
| Employee | `employees` (with custom fields as attributes) |
| Time Off Request | `time-off-requests` |
| Absence Period | exposed via `time-off-requests` |
| Department, Office | derived from employee attributes |
| Company | ⚠️ coverage evolving |
| Payroll | ❌ not in scope |

### Coverage highlights

- ✅ Full employee list + details (51+ fields surfaced)
- ✅ Time-off request lifecycle (read, approve, reject)
- ⚠️ Departments/offices — derived from employee fields, not first-class
- ❌ Performance reviews, training — use Proxy

Always check `/connector/connectors/personio` for current coverage.

### Auth

- **Type:** API credentials (client ID + client secret), managed by Apideck Vault
- **Region:** Personio's API is region-sharded (EU). All accounts share the same base URL.
- **Permissions:** API credentials inherit the configured role. Admin credentials recommended for full sync.

### Example: list all employees with custom fields

```typescript
const { data } = await apideck.hris.employees.list({
  serviceId: "personio",
  fields: "id,first_name,last_name,email,department,custom_fields",
});
```
