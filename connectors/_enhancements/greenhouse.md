## Greenhouse via Apideck ATS

Greenhouse is the reference enterprise ATS connector on Apideck. Strong coverage for jobs, candidates, and applications.

### Entity mapping

| Greenhouse entity | Apideck ATS resource |
|---|---|
| Job | `jobs` |
| Candidate | `applicants` |
| Application | `applications` |
| Job Post (external posting) | exposed via `jobs[].job_posts[]` |
| Stage (pipeline stage) | exposed via `jobs[].stages[]` |
| Scorecard / Interview | use Proxy |
| Offer | exposed as `applications[].offers[]` |

### Coverage highlights

- ✅ Full CRUD on jobs and applicants
- ✅ Applications — create, list, update stage
- ✅ Attachments on applicants (resumes, cover letters)
- ✅ Moving candidates through pipeline stages via `application.current_stage`
- ⚠️ Scorecards and interview kits — read-only in Greenhouse's API; use Proxy
- ❌ User management — use Proxy (Greenhouse Users endpoint)
- ❌ Custom fields on applications — use Proxy with the Greenhouse custom field endpoints

### Greenhouse-specific auth notes

- **Auth type:** API key — managed by Apideck Vault. Users paste their Greenhouse key in the Vault modal.
- **Permissions:** Greenhouse keys can be Harvest (read/write) or Job Board (public-facing, limited). Apideck requires Harvest for full coverage — Job Board keys will 403 on writes.
- **On-Behalf-Of:** some Greenhouse operations require an `On-Behalf-Of` user header. Apideck injects this based on the connection's configured user; consult Apideck dashboard to set or override.
- **Rate limits:** Greenhouse enforces per-endpoint rate limits. Apideck respects upstream 429 responses with automatic backoff — check Greenhouse's current docs for exact thresholds.

### Common Greenhouse quirks handled by Apideck

- **Candidate vs. Prospect** — Greenhouse distinguishes these by whether they're attached to an Application. Apideck exposes both under `applicants` and discriminates via `applicant.is_prospect`.
- **Multiple applications per candidate** — a Greenhouse candidate can apply to N jobs. Apideck surfaces this as `applicant.applications[]`.
- **Timestamps** — Greenhouse uses ISO 8601 with Z. Apideck passes through unchanged.
- **Source tracking** — Greenhouse's `source` is a structured object; Apideck flattens to `applicant.source.name`.

### Example: create a candidate and an application in one flow

```typescript
// 1. Create the candidate
const { data: applicant } = await apideck.ats.applicants.create({
  serviceId: "greenhouse",
  applicant: {
    first_name: "Jordan",
    last_name: "Lee",
    emails: [{ email: "jordan@example.com", type: "personal" }],
  },
});

// 2. Create an application for a job
const { data: application } = await apideck.ats.applications.create({
  serviceId: "greenhouse",
  application: {
    applicant_id: applicant.data.id,
    job_id: "job_4001",
    source: { name: "Referral" },
  },
});
```

### Example: move an application to the next stage

```typescript
await apideck.ats.applications.update({
  serviceId: "greenhouse",
  id: "app_123",
  application: { current_stage: { id: "stage_phone_screen" } },
});
```
