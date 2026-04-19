## Deel via Apideck HRIS

Deel is a global payroll and contractor management platform. Apideck covers the HRIS-adjacent surface (employees, time-off).

### Entity mapping

| Deel entity | Apideck HRIS resource |
|---|---|
| Employee | `employees` (57+ fields surfaced) |
| Contractor | also `employees` (distinguished via `employment_type`) |
| Time Off Request | `time-off-requests` |
| Department | `departments` |
| Company entity | `companies` |
| Payroll runs | ❌ use Proxy |

### Coverage highlights

- ✅ Employee list + details (full- and part-time, contractor)
- ✅ Time-off requests
- ✅ Company + department metadata
- ❌ Invoicing for contractors — separate Deel API surface; use Proxy
- ❌ Contract lifecycle (offer, signing) — use Proxy

### Auth

- **Type:** API key, managed by Apideck Vault
- **Org binding:** each connection = one Deel organization.
- **Permissions:** API key inherits the generating user's role.

### Example: list all workers (employees + contractors)

```typescript
const { data } = await apideck.hris.employees.list({
  serviceId: "deel",
});
```
