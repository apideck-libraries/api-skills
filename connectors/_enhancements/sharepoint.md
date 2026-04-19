## SharePoint via Apideck File Storage

SharePoint is one of the most-requested file-storage connectors. Via Apideck, you get the core Drive/File/Folder surface of Microsoft Graph without writing per-tenant Graph API client code.

### Entity mapping

| SharePoint concept (Graph) | Apideck File Storage resource |
|---|---|
| Drive (document library) | `drives` |
| DriveItem (file) | `files` |
| DriveItem (folder) | `folders` |
| Site | exposed via `drive-groups` |
| Shared link | `shared-links` |
| Upload session | `upload-sessions` |
| SharePoint List, ListItem | ❌ not in unified API — use Proxy |
| SharePoint Pages | ❌ use Proxy |
| Permissions / sharing policy | partially via `shared-links`; advanced via Proxy |

### Coverage highlights

- ✅ List files and folders across accessible drives and sites
- ✅ Upload, download, update, and delete files
- ✅ Create folders, rename, move
- ✅ Generate shared links
- ✅ Large file upload via `upload-sessions` (Graph's resumable upload)
- ❌ SharePoint Lists and ListItems — different Graph surface; use Proxy
- ❌ Site-level operations (creating sites, modifying permissions)
- ❌ Co-authoring / real-time presence

Always verify exact coverage with `GET /connector/connectors/sharepoint`.

### SharePoint-specific auth notes

- **Type:** OAuth 2.0 (Microsoft identity platform), managed by Apideck Vault
- **Admin consent on corporate tenants:** scopes that enumerate SharePoint sites are typically admin-consented. Users in corporate Microsoft 365 tenants may hit a "Need admin approval" screen on first authorization — they must route to their M365 tenant admin to grant consent once for the tenant. This is the single most common cause of SharePoint onboarding friction.
- **Personal vs. Work accounts:** personal Microsoft accounts (`@outlook.com`, `@hotmail.com`) don't require admin consent and authorize on first try. Work accounts typically do.
- **Tenant isolation:** each Apideck connection is bound to one M365 tenant. Multi-tenant access = one connection per tenant.

### Common SharePoint quirks

- **Path-based vs. ID-based addressing** — Graph supports both. Apideck exposes files by ID; path-based reads go through the Proxy.
- **eTags for concurrent updates** — Graph returns eTags on every DriveItem. Check `file.etag` and pass through in `If-Match` via raw headers when needed.
- **Thumbnail URLs** — signed and short-lived. Don't cache.
- **Differential sync (delta queries)** — not exposed through unified API. Use Proxy with `/drives/{id}/root/delta` for change tracking.

### Example: upload a file via upload sessions

Files > 4MB use upload sessions (resumable upload). Smaller files can be uploaded directly. See [`apideck-node`](../../skills/apideck-node/) for canonical method signatures.

```typescript
// Small file — direct upload via POST /file-storage/files
const { data } = await apideck.fileStorage.files.create({
  serviceId: "sharepoint",
  file: { name: "Q1 Report.pdf", parent_folder_id: "folder_id_here" },
  // body handling per SDK — see apideck-node SKILL.md
});

// Large file — upload session
const { data: session } = await apideck.fileStorage.uploadSessions.create({
  serviceId: "sharepoint",
  uploadSession: { name: "big.zip", size: 50_000_000, parent_folder_id: "folder_id_here" },
});
// Upload chunks to session.upload_url, then finish via uploadSessions.finish
```

### Example: search files by name

```typescript
const { data } = await apideck.fileStorage.files.search({
  serviceId: "sharepoint",
  filesSearch: { query: "quarterly report" },
});
```

### Example: reach SharePoint Lists via Proxy

SharePoint Lists (a different Graph surface from Drive) aren't covered by the unified File Storage API. Use the Proxy:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: sharepoint" \
  -H "x-apideck-downstream-url: https://graph.microsoft.com/v1.0/sites/root/lists" \
  -H "x-apideck-downstream-method: GET"
```
