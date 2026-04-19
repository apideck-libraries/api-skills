---
name: sharepoint
description: |
  SharePoint integration via Apideck's File Storage unified API — same methods work across every connector in File Storage, switch by changing `serviceId`. Use when the user wants to read, write, upload, or search files, folders, and drives in SharePoint. Routes through Apideck with serviceId "sharepoint".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: sharepoint
  unifiedApis: ["file-storage"]
  authType: oauth2
  tier: "1a"
  verified: true
---

# SharePoint (via Apideck)

Access SharePoint through Apideck's **File Storage** unified API — one of 5 File Storage connectors that share the same method surface. Code you write here ports to Box, Dropbox, Google Drive and 1 other File Storage connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant SharePoint plumbing.

## Quick facts

- **Apideck serviceId:** `sharepoint`
- **Unified API:** File Storage
- **Auth type:** oauth2
- **SharePoint docs:** https://learn.microsoft.com/sharepoint/dev/
- **Homepage:** https://products.office.com

## When to use this skill

Activate this skill when the user explicitly wants to work with **SharePoint** — for example, "upload a file in SharePoint" or "list a folder in SharePoint". This skill teaches the agent:

1. Which Apideck unified API covers SharePoint (File Storage)
2. The correct `serviceId` to pass on every call (`sharepoint`)
3. SharePoint-specific auth and coverage caveats

For the full method surface (parameters, pagination, filtering), use your language SDK skill:

- [`apideck-node`](../../skills/apideck-node/), [`apideck-python`](../../skills/apideck-python/), [`apideck-dotnet`](../../skills/apideck-dotnet/), [`apideck-java`](../../skills/apideck-java/), [`apideck-go`](../../skills/apideck-go/), [`apideck-php`](../../skills/apideck-php/), or [`apideck-rest`](../../skills/apideck-rest/)

For the raw OpenAPI spec:

- **File Storage:** [https://specs.apideck.com/file-storage.yml](https://specs.apideck.com/file-storage.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=file-storage)

## Minimal example (TypeScript)

```typescript
import { Apideck } from "@apideck/unify";

const apideck = new Apideck({
  apiKey: process.env.APIDECK_API_KEY,
  appId: process.env.APIDECK_APP_ID,
  consumerId: "your-consumer-id",
});

// List files in SharePoint
const { data } = await apideck.fileStorage.files.list({
  serviceId: "sharepoint",
});
```

## Portable across 5 File Storage connectors

The Apideck **File Storage** unified API exposes the same methods for every connector in its catalog. Switching from SharePoint to another File Storage connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — SharePoint
await apideck.fileStorage.files.list({ serviceId: "sharepoint" });

// Tomorrow — same code, different connector
await apideck.fileStorage.files.list({ serviceId: "box" });
await apideck.fileStorage.files.list({ serviceId: "dropbox" });
```

This is the compounding advantage of using Apideck over integrating SharePoint directly: code against the unified File Storage API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

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

## Sibling connectors

Other **File Storage** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`box`](../box/), [`dropbox`](../dropbox/), [`google-drive`](../google-drive/), [`onedrive`](../onedrive/).

## See also

- [File Storage OpenAPI spec](https://specs.apideck.com/file-storage.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=file-storage)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [SharePoint official docs](https://learn.microsoft.com/sharepoint/dev/)
