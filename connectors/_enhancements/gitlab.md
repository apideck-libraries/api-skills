## GitLab via Apideck Issue Tracking

GitLab Issues is mapped to Apideck's Issue Tracking unified API. Covers projects, issues, comments (notes), users, and labels.

### Entity mapping

| GitLab concept | Apideck Issue Tracking resource |
|---|---|
| Project | `collections` |
| Issue | `tickets` |
| Note (comment on issue) | `comments` |
| User (project member) | `users` |
| Label | `tags` |
| Epic, Milestone | use Proxy |
| Merge Request | use Proxy |

### Coverage highlights

- ✅ CRUD on issues within projects
- ✅ Comments (notes)
- ✅ Labels as tags
- ❌ Merge requests — separate surface; use Proxy
- ❌ CI/CD pipelines, runners — use Proxy

### Auth

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Self-hosted GitLab:** the cloud `gitlab` connector targets gitlab.com. For self-hosted Data Center / CE, use the separate `gitlab-server` connector.
- **Scopes:** `api` scope for read/write access.

### Example: list issues in a project

```typescript
const { data } = await apideck.issueTracking.collectionTickets.list({
  serviceId: "gitlab",
  collectionId: "1234", // GitLab project ID
  filter: { status: "opened" },
});
```
