## Dropbox via Apideck File Storage

Dropbox is a popular consumer + team file sync product. Apideck covers file, folder, and upload-session operations.

### Entity mapping

| Dropbox concept | Apideck File Storage resource |
|---|---|
| File | `files` |
| Folder | `folders` |
| Upload session | `upload-sessions` |
| Shared link | not yet exposed — use Proxy |

### Coverage highlights

- ✅ List, get, create, update, delete files and folders
- ✅ Upload via sessions for large files
- ✅ Download file content
- ⚠️ Shared links — still being added; use Proxy with `/sharing/create_shared_link_with_settings` for now
- ❌ Dropbox Paper, team admin features — use Proxy

### Auth

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Scopes:** Apideck Vault requests file read/write scopes as needed.
- **Team vs. personal:** both supported. Team connections include `team_member_id` context.

### Example: upload a small file

```typescript
const { data } = await apideck.fileStorage.files.create({
  serviceId: "dropbox",
  file: { name: "notes.txt", parent_folder_id: "/" },
});
```
