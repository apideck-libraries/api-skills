## Google Drive via Apideck File Storage

Google Drive is Google's consumer + Workspace file sync product. Apideck covers the standard File/Folder/Drive surface.

### Entity mapping

| Drive concept | Apideck File Storage resource |
|---|---|
| File (any type) | `files` |
| Folder | `folders` |
| My Drive / Shared Drive | `drives` |
| Shared link | `shared-links` |
| Upload session (resumable) | `upload-sessions` |
| Google Docs / Sheets / Slides | exposed as `files` with Google MIME types (export via `/files/{id}/export`) |
| Permissions | partially via `shared-links`; advanced via Proxy |

### Coverage highlights

- ✅ CRUD on files and folders (personal + Shared Drives)
- ✅ Upload (simple and resumable) and download
- ✅ Export Google-native formats (Docs → PDF, Sheets → XLSX)
- ✅ Generate shareable links
- ❌ Changes API (delta sync) — use Proxy with `/changes`
- ❌ Comments on files — use Proxy
- ❌ Drive labels / metadata schema — use Proxy

### Auth

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Typical scopes:** Apideck Vault requests `drive` / `drive.file` scopes as needed. Workspace-only deployments may require admin consent.
- **Shared Drives:** supported; pass `drive_id` to target a specific Shared Drive.

### Example: list files in a Shared Drive

```typescript
const { data } = await apideck.fileStorage.files.list({
  serviceId: "google-drive",
  filter: { drive_id: "0A..." },
});
```

### Example: export a Google Doc as PDF

Use `/file-storage/files/{id}/export` with the target MIME type via Apideck's export endpoint.
