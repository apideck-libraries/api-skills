---
name: google-drive
description: |
  Google Drive integration via Apideck's File Storage unified API — same methods work across every connector in File Storage, switch by changing `serviceId`. Use when the user wants to read, write, upload, or search files, folders, and drives in Google Drive. Routes through Apideck with serviceId "google-drive".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: google-drive
  unifiedApis: ["file-storage"]
  authType: oauth2
  tier: "1b"
  verified: true
---

# Google Drive (via Apideck)

Access Google Drive through Apideck's **File Storage** unified API — one of 5 File Storage connectors that share the same method surface. Code you write here ports to SharePoint, Box, Dropbox and 1 other File Storage connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Google Drive plumbing.

## Quick facts

- **Apideck serviceId:** `google-drive`
- **Unified API:** File Storage
- **Auth type:** oauth2
- **Google Drive docs:** https://developers.google.com/drive
- **Homepage:** https://www.google.com/drive/index.html

## When to use this skill

Activate this skill when the user explicitly wants to work with **Google Drive** — for example, "upload a file in Google Drive" or "list a folder in Google Drive". This skill teaches the agent:

1. Which Apideck unified API covers Google Drive (File Storage)
2. The correct `serviceId` to pass on every call (`google-drive`)
3. Google Drive-specific auth and coverage caveats

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

// List files in Google Drive
const { data } = await apideck.fileStorage.files.list({
  serviceId: "google-drive",
});
```

## Portable across 5 File Storage connectors

The Apideck **File Storage** unified API exposes the same methods for every connector in its catalog. Switching from Google Drive to another File Storage connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Google Drive
await apideck.fileStorage.files.list({ serviceId: "google-drive" });

// Tomorrow — same code, different connector
await apideck.fileStorage.files.list({ serviceId: "sharepoint" });
await apideck.fileStorage.files.list({ serviceId: "box" });
```

This is the compounding advantage of using Apideck over integrating Google Drive directly: code against the unified File Storage API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

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

## Escape hatch: Proxy API

When an endpoint isn't covered by the File Storage unified API, use Apideck's Proxy to call Google Drive directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Google Drive's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: google-drive" \
  -H "x-apideck-downstream-url: <target endpoint on Google Drive>" \
  -H "x-apideck-downstream-method: GET"
```

See [Google Drive's API docs](https://developers.google.com/drive) for available endpoints.

## Sibling connectors

Other **File Storage** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`sharepoint`](../sharepoint/), [`box`](../box/), [`dropbox`](../dropbox/), [`onedrive`](../onedrive/).

## See also

- [File Storage OpenAPI spec](https://specs.apideck.com/file-storage.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=file-storage)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Google Drive official docs](https://developers.google.com/drive)
