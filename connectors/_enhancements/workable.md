## Workable via Apideck ATS

Workable is a mid-market recruiting platform. Apideck maps its candidate-centric model.

### Entity mapping

| Workable entity | Apideck ATS resource |
|---|---|
| Job | `jobs` |
| Candidate | `applicants` |
| Application (candidate on a job) | `applications` |
| Stage | exposed via `applications.current_stage` |

### Coverage highlights

- ✅ List jobs (with status filter: published, draft, archived)
- ✅ List and create candidates
- ✅ Create applications (link candidate to job)
- ✅ Move candidates through stages via `application.current_stage`
- ⚠️ Requisitions and offers — not in unified; use Proxy

### Auth

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Subdomain binding:** each connection is bound to one Workable subdomain.

### Example: list published jobs

```typescript
const { data } = await apideck.ats.jobs.list({
  serviceId: "workable",
  filter: { status: "published" },
});
```
