---
name: box
description: |
  Box integration via Apideck's File Storage unified API — same methods work across every connector in File Storage, switch by changing `serviceId`. Use when the user wants to read, write, upload, or search files, folders, and drives in Box. Routes through Apideck with serviceId "box".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: box
  unifiedApis: ["file-storage"]
  authType: oauth2
  tier: "1b"
  verified: true
---

# Box (via Apideck)

Access Box through Apideck's **File Storage** unified API — one of 5 File Storage connectors that share the same method surface. Code you write here ports to SharePoint, Dropbox, Google Drive and 1 other File Storage connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Box plumbing.

## Quick facts

- **Apideck serviceId:** `box`
- **Unified API:** File Storage
- **Auth type:** oauth2
- **Gotchas:** [page](https://developers.apideck.com/apis/file-storage/box/gotchas)
- **Box docs:** https://developer.box.com
- **Homepage:** https://www.box.com/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Box** — for example, "upload a file in Box" or "list a folder in Box". This skill teaches the agent:

1. Which Apideck unified API covers Box (File Storage)
2. The correct `serviceId` to pass on every call (`box`)
3. Box-specific auth and coverage caveats

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

// List files in Box
const { data } = await apideck.fileStorage.files.list({
  serviceId: "box",
});
```

## Portable across 5 File Storage connectors

The Apideck **File Storage** unified API exposes the same methods for every connector in its catalog. Switching from Box to another File Storage connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Box
await apideck.fileStorage.files.list({ serviceId: "box" });

// Tomorrow — same code, different connector
await apideck.fileStorage.files.list({ serviceId: "sharepoint" });
await apideck.fileStorage.files.list({ serviceId: "dropbox" });
```

This is the compounding advantage of using Apideck over integrating Box directly: code against the unified File Storage API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Authentication

- **Type:** OAuth 2.0
- **Managed by:** Apideck Vault — Apideck handles the full OAuth dance (authorization code flow, token exchange, refresh). Never ask the user for API keys or tokens directly.
- **User setup:** Users authorize via the Vault modal. Connection state progresses `available → added → authorized → callable`.
- **Token refresh:** automatic. Expired tokens are refreshed transparently on the next API call.

See [`apideck-best-practices`](../../skills/apideck-best-practices/) for Vault setup, connection lifecycle, and handling re-auth flows.

## Verifying coverage

Not every File Storage operation is supported by every connector. Always verify before assuming a method works:

```bash
curl 'https://unify.apideck.com/connector/connectors/box' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}"
```

See [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) for patterns around `UnsupportedOperationError` and connector-specific fallbacks.

## Escape hatch: Proxy API

When an endpoint isn't covered by the File Storage unified API, use Apideck's Proxy to call Box directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Box's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: box" \
  -H "x-apideck-downstream-url: <target endpoint on Box>" \
  -H "x-apideck-downstream-method: GET"
```

See [Box's API docs](https://developer.box.com) for available endpoints.

## Sibling connectors

Other **File Storage** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`sharepoint`](../sharepoint/), [`dropbox`](../dropbox/), [`google-drive`](../google-drive/), [`onedrive`](../onedrive/).

## See also

- [File Storage OpenAPI spec](https://specs.apideck.com/file-storage.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=file-storage)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Box official docs](https://developer.box.com)
