## Linear via Apideck Issue Tracking

Linear is a modern issue tracker for product teams. Apideck maps its Team/Issue model.

### Entity mapping

| Linear concept | Apideck Issue Tracking resource |
|---|---|
| Team | `collections` |
| Issue | `tickets` |
| Comment | ⚠️ coverage is evolving — check `/connector/connectors/linear` |
| User | ⚠️ coverage is evolving |
| Label | ⚠️ coverage is evolving |
| Project, Cycle | use Proxy (GraphQL) |

### Coverage highlights

- ✅ Team list (collections)
- ✅ Issues (tickets) — create, list, update, delete
- ⚠️ Users, comments, tags — may be partial; verify with coverage endpoint
- ❌ Projects, Cycles, Roadmaps — use Proxy with Linear's GraphQL API

### Auth

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Workspace binding:** each connection targets one Linear workspace. For multi-workspace scenarios, use the separate `linear-multiworkspace` connector.
- **API:** Linear is GraphQL-only upstream; Apideck abstracts this. For raw GraphQL queries use Proxy.

### Example: list issues in a team

```typescript
const { data } = await apideck.issueTracking.collectionTickets.list({
  serviceId: "linear",
  collectionId: "team_abc123",
});
```
