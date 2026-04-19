## GitHub via Apideck Issue Tracking

GitHub Issues is mapped to Apideck's Issue Tracking unified API. Covers repositories, issues, comments, users, and labels.

### Entity mapping

| GitHub concept | Apideck Issue Tracking resource |
|---|---|
| Repository | `collections` |
| Issue | `tickets` |
| Comment | `comments` |
| User | `users` |
| Label | `tags` |
| Milestone | use Proxy (not in unified) |
| Pull Request | use Proxy (distinct GitHub surface) |
| Project (Projects v2) | use Proxy |

### Coverage highlights

- ✅ List repositories (collections) the authenticated user can access
- ✅ CRUD on issues (tickets)
- ✅ Comments
- ✅ Labels (tags)
- ❌ Pull requests — separate surface; use Proxy with `/repos/{owner}/{repo}/pulls`
- ❌ GitHub Actions, Packages, Codespaces — use Proxy

### Auth

- **Type:** OAuth 2.0 or GitHub App installation, managed by Apideck Vault
- **Scopes:** repo scope for read/write on private repos; public_repo for public-only.
- **Org-level vs. user-level:** each connection targets one owner (user or org). To access multiple orgs, create multiple connections.
- **Rate limits:** GitHub's rate limits apply (5,000/hour for authenticated users; higher for Apps). Apideck backs off on 403/429.

### Example: list open issues in a repo

```typescript
const { data } = await apideck.issueTracking.collectionTickets.list({
  serviceId: "github",
  collectionId: "owner/repo", // or GitHub's numeric repo ID depending on SDK
  filter: { status: "open" },
});
```
