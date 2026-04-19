## Jira via Apideck Issue Tracking

Jira Cloud is the reference Issue Tracking connector. Covers issues (tickets), projects (collections), comments, and users.

### Entity mapping

| Jira concept | Apideck Issue Tracking resource |
|---|---|
| Project | `collections` |
| Issue | `tickets` |
| Comment | `comments` |
| User | `users` |
| Label | `tags` |
| Issue type (Story, Bug, Task) | `ticket.type` |
| Status (To Do, In Progress, Done) | `ticket.status` |
| Priority | `ticket.priority` |
| Assignee | `ticket.assignees[]` |
| Custom fields | `ticket.custom_fields[]` |
| Epic link, Sprint | use Proxy or custom fields |
| Worklog (time tracking) | use Proxy |
| Jira Service Desk tickets | ❌ separate auth-only connector |

### Coverage highlights

- ✅ CRUD on issues across all accessible projects
- ✅ Comments (create, list, update, delete)
- ✅ Filtering by project, status, assignee, labels
- ✅ Transitioning issue status (Apideck maps to Jira's workflow transition API under the hood)
- ✅ Issue search via JQL (pass as `filter[jql]`)
- ⚠️ Custom fields — exposed as `custom_fields[]`; write values must match Jira's expected type
- ❌ Jira Service Management / Service Desk — separate product surface; use the JSM connector (auth-only in Apideck today)
- ❌ Boards, Sprints (Agile) — use Proxy with Agile REST endpoints
- ❌ Workflow configuration — use Proxy

### Jira-specific auth notes

- **Type:** OAuth 2.0 (3LO) via Atlassian, managed by Apideck Vault
- **Typical Atlassian scopes:** Apideck Vault requests read/write scopes for Jira work and user data. Exact scopes are configured in the Vault app — check the consent screen or Apideck dashboard.
- **Cloud only:** this connector targets Jira Cloud. Self-hosted Jira (Data Center / Server) is a separate surface — use Proxy with basic auth or a PAT.
- **Resource selection:** OAuth 3LO returns a list of accessible Atlassian resources (cloudIds); the first is selected by default. Users with multiple Jira sites under one account should verify the right site was connected.
- **API version:** Apideck targets Jira REST API v3. Some v2-only endpoints (deprecated) require Proxy.

### Common Jira quirks handled by Apideck

- **ADF (Atlassian Document Format)** — Jira v3 uses ADF for rich text in `description` and comment bodies. Apideck accepts plain text or Markdown and transforms to ADF on write; on read, ADF is flattened to plain text in `ticket.description`. For rich content, use `raw=true` to see ADF directly.
- **Issue keys vs. IDs** — Jira surfaces both (`PROJ-123` and numeric ID). Apideck accepts either on read; writes return both.
- **Transitions are not status updates** — in Jira, you don't PUT a status; you POST a transition. Apideck handles this: `ticket.status = "Done"` triggers the right transition if one exists.
- **Pagination** — Jira uses `startAt`/`maxResults`. Apideck normalizes to cursor-based pagination.
- **Rate limits** — Atlassian Cloud enforces strict per-tenant rate limits; Apideck backs off automatically on 429.

### Example: create a bug with labels

Tickets in the Issue Tracking API are nested under a collection (project). See [`apideck-node`](../../skills/apideck-node/) for the canonical method signature — typically requires `collectionId`.

```typescript
const { data } = await apideck.issueTracking.collectionTickets.create({
  serviceId: "jira",
  collectionId: "10001", // Jira project ID
  ticket: {
    title: "Login button fails on Safari",
    description: "Repro: open Safari 17, click login. Nothing happens.",
    type: "Bug",
    priority: "High",
    assignees: [{ id: "5b10a2844c20165700ede21g" }],
    tags: [{ name: "safari" }, { name: "regression" }],
  },
});
```

### Example: search with JQL via Proxy

The unified Issue Tracking API supports basic filters, but complex JQL isn't exposed. Use the Proxy for full JQL:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: jira" \
  -H "x-apideck-downstream-url: /rest/api/3/search?jql=project%20%3D%20PROJ" \
  -H "x-apideck-downstream-method: GET"
```

### Example: transition an issue status

In Jira you don't PUT a status — you POST a transition. Apideck's `update` with `ticket.status = "Done"` triggers the matching workflow transition if one exists. If the transition isn't auto-resolvable, use Proxy with `/rest/api/3/issue/{id}/transitions`.

```typescript
await apideck.issueTracking.collectionTickets.update({
  serviceId: "jira",
  collectionId: "10001",
  ticketId: "10042",
  ticket: { status: "Done" },
});
```
