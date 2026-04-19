## HiBob via Apideck HRIS

HiBob (Bob) is a modern HRIS for fast-growing companies. Apideck surfaces 101+ employee fields — the deepest employee coverage in the catalog.

### Entity mapping

| Bob entity | Apideck HRIS resource |
|---|---|
| Employee | `employees` (101+ fields) |
| Department | `departments` |
| Time Off Request | `time-off-requests` |
| Company | ⚠️ evolving |
| Sites / Locations | derived from employee attributes |

### Coverage highlights

- ✅ Very deep employee coverage (101+ fields including employment, personal, about, work, compensation sections)
- ✅ Departments
- ✅ Time-off requests
- ❌ Performance management, Docs, Tasks — use Proxy

### Auth

- **Type:** Basic auth (service user ID + API token generated in Bob admin), managed by Apideck Vault
- **Service user:** Bob recommends creating a dedicated service user for API access with scoped permissions.
- **Permissions:** the service user's role determines which fields are readable. Sensitive fields (comp, sensitive personal) require explicit access.

### Example: list employees with compensation fields

```typescript
const { data } = await apideck.hris.employees.list({
  serviceId: "hibob",
  fields: "id,first_name,last_name,email,department,job_title,compensation",
});
```
