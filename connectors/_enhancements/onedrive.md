## OneDrive via Apideck File Storage

OneDrive (Microsoft personal + business) is accessed via Microsoft Graph, same as SharePoint. Apideck normalizes the Drive/File/Folder surface.

### Entity mapping

| OneDrive concept | Apideck File Storage resource |
|---|---|
| Drive (user's OneDrive) | `drives` |
| DriveItem (file) | `files` |
| DriveItem (folder) | `folders` |
| Shared link | `shared-links` |
| Upload session | `upload-sessions` |

### Coverage highlights

- ✅ CRUD on files and folders
- ✅ Upload via resumable sessions (required for large files)
- ✅ Download file content
- ✅ Shared links
- ❌ Delta queries (change tracking) — use Proxy with Graph `/delta`

### Auth

- **Type:** OAuth 2.0 (Microsoft identity platform), managed by Apideck Vault
- **Personal vs. Work:** both account types work. Personal accounts don't need admin consent; corporate tenants often do for Graph scopes.
- **User binding:** each connection is bound to one user's OneDrive (unlike SharePoint which exposes site-wide drives).

### Example: list files in root

```typescript
const { data } = await apideck.fileStorage.files.list({
  serviceId: "onedrive",
});
```
