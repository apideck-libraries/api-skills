## Lever via Apideck ATS

Lever is a recruiting platform with strong pipeline tooling. Apideck maps its opportunity-centric model.

### Entity mapping

| Lever entity | Apideck ATS resource |
|---|---|
| Posting | `jobs` |
| Opportunity | `applicants` |
| Application (Opportunity on a Posting) | `applications` |
| Stage | exposed via `applications.current_stage` |

### Coverage highlights

- ✅ List postings (jobs) by status
- ✅ List and create opportunities (applicants)
- ✅ Create/update applications
- ✅ Move through stages
- ⚠️ Feedback forms and scorecards — use Proxy
- ❌ Nurture campaigns — use Proxy

### Auth

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Org binding:** each connection is bound to one Lever org.
- **Scopes:** read/write on postings and opportunities; Apideck Vault requests the minimum needed.

### Example: create a candidate with source attribution

```typescript
const { data } = await apideck.ats.applicants.create({
  serviceId: "lever",
  applicant: {
    first_name: "Morgan",
    last_name: "Lee",
    emails: [{ email: "morgan@example.com", type: "personal" }],
    source: { name: "LinkedIn" },
  },
});
```
