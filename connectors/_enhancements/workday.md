## Workday via Apideck

Workday is an enterprise cloud platform covering HCM, Finance, and Recruiting. Apideck exposes Workday across **HRIS**, **Accounting**, and **ATS** unified APIs — one of only a handful of multi-API connectors in the catalog.

### Unified API coverage (verified via Connector API)

| Apideck API | Resources mapped | Notes |
|---|---|---|
| Accounting | 20 resources | invoices, bills, journal entries, GL accounts, customers, suppliers, more |
| HRIS | 3 resources | employees + org hierarchy |
| ATS | 2 resources | job requisitions + applicants (limited) |

Always verify current coverage with `GET /connector/connectors/workday`.

### Example: list employees (HRIS)

```typescript
const { data } = await apideck.hris.employees.list({
  serviceId: "workday",
});
```

### Example: list invoices (Accounting)

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "workday",
});
```

### Example: list job requisitions (ATS)

```typescript
const { data } = await apideck.ats.jobs.list({
  serviceId: "workday",
});
```

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Tenant binding:** each connection is bound to one Workday tenant. Module access (HCM, Financials, Recruiting) depends on what's licensed in that tenant.
- **Integration System User (ISU):** Workday best practice is to use a dedicated ISU with scoped permissions. Consult your Workday admin for ISU setup before provisioning the Apideck connection.
- **API versioning:** Workday web services are versioned; Apideck targets the latest supported version per module.
