---
name: google-workspace
description: |
  Google Workspace integration via Apideck's HRIS unified API — same methods work across every connector in HRIS, switch by changing `serviceId`. Use when the user wants to read or sync employees, departments, payrolls, and time-off records in Google Workspace. Routes through Apideck with serviceId "google-workspace".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: google-workspace
  unifiedApis: ["hris"]
  authType: oauth2
  tier: "2"
  verified: true
  difficulty: moderate
  partnershipRequired: false
  sandboxAvailable: false
---

# Google Workspace (via Apideck)

Access Google Workspace through Apideck's **HRIS** unified API — one of 58 HRIS connectors that share the same method surface. Code you write here ports to BambooHR, Workday, Deel and 54 other HRIS connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Google Workspace plumbing.

## Quick facts

- **Apideck serviceId:** `google-workspace`
- **Unified API:** HRIS
- **Auth type:** oauth2
- **Gotchas:** [page](https://developers.apideck.com/apis/hris/google-workspace/gotchas)
- **Homepage:** https://workspace.google.com/

## At a glance

- **Implementation difficulty:** moderate — Self-Service OAuth App + Google Verification Required to Pass 100 Connected Accounts
- **Vendor partnership required:** no — No programme to join: Google's verification is a review of your own application, open to anyone.
- **Apideck-managed credentials:** not available — Apideck's shared Google application was retired on 11 May 2023, so each application owner registers their own Google Cloud OAuth client.
- **Account type required:** Google Workspace account: a personal Gmail account exposes no directory to read.
- **Consumer access level:** A Google Workspace administrator authorises, since the connection reads the whole directory. Delegated admin roles vary, so use a super administrator.
- **Sandbox:** not available — Google's 14-day Workspace trial (up to 10 users) is the usual stand-in, but it asks for a payment method up front; there is no dedicated sandbox.
- **Costs:** Free to build: Google charges nothing for the OAuth client or for verification. Your consumer needs a paid Google Workspace subscription.
- **Rate limits:** 2,400 queries per minute per user per Cloud project, raisable from the Admin SDK quota page. A separate concurrency cap returns 429 and cannot be raised.
- **Authentication:** Authorization Code flow via Google Identity, reading the directory through the Admin SDK.
- **Webhooks:** Virtual webhooks (Apideck polls the directory): employee created and employee updated events only. Deletions and department changes raise nothing.

**Important to know:**

- Until Google verifies the application it can connect at most 100 Google accounts in total, and the same hard cap applies whether the application is still in Testing or has been published without verification. Verification is what turns a pilot into a product.
- While the application's publishing status is Testing, Google expires refresh tokens after seven days: every connection made in that state stops working within a week and the administrator has to authorise again. Publishing the application ends that behaviour.
- A Google Workspace administrator can mark an application as Trusted for their own organisation, which lifts both the 100-account ceiling and the seven-day token expiry for everyone in it: the practical way to pilot with a named customer while verification is pending.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/google-workspace` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user explicitly wants to work with **Google Workspace** — for example, "sync employees in Google Workspace" or "list time-off requests in Google Workspace". This skill teaches the agent:

1. Which Apideck unified API covers Google Workspace (HRIS)
2. The correct `serviceId` to pass on every call (`google-workspace`)
3. Google Workspace-specific auth and coverage caveats

For the full method surface (parameters, pagination, filtering), use your language SDK skill:

- [`apideck-node`](../../skills/apideck-node/), [`apideck-python`](../../skills/apideck-python/), [`apideck-dotnet`](../../skills/apideck-dotnet/), [`apideck-java`](../../skills/apideck-java/), [`apideck-go`](../../skills/apideck-go/), [`apideck-php`](../../skills/apideck-php/), or [`apideck-rest`](../../skills/apideck-rest/)

For the raw OpenAPI spec:

- **HRIS:** [https://specs.apideck.com/hris.yml](https://specs.apideck.com/hris.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=hris)

## Minimal example (TypeScript)

```typescript
import { Apideck } from "@apideck/unify";

const apideck = new Apideck({
  apiKey: process.env.APIDECK_API_KEY,
  appId: process.env.APIDECK_APP_ID,
  consumerId: "your-consumer-id",
});

// List employees in Google Workspace
const { data } = await apideck.hris.employees.list({
  serviceId: "google-workspace",
});
```

## Portable across 58 HRIS connectors

The Apideck **HRIS** unified API exposes the same methods for every connector in its catalog. Switching from Google Workspace to another HRIS connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Google Workspace
await apideck.hris.employees.list({ serviceId: "google-workspace" });

// Tomorrow — same code, different connector
await apideck.hris.employees.list({ serviceId: "bamboohr" });
await apideck.hris.employees.list({ serviceId: "workday" });
```

This is the compounding advantage of using Apideck over integrating Google Workspace directly: code against the unified HRIS API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Authentication

- **Type:** OAuth 2.0
- **Managed by:** Apideck Vault — Apideck handles the full OAuth dance (authorization code flow, token exchange, refresh). Never ask the user for API keys or tokens directly.
- **User setup:** Users authorize via the Vault modal. Connection state progresses `available → added → authorized → callable`.
- **Token refresh:** automatic. Expired tokens are refreshed transparently on the next API call.

See [`apideck-best-practices`](../../skills/apideck-best-practices/) for Vault setup, connection lifecycle, and handling re-auth flows.

## Verifying coverage

Not every HRIS operation is supported by every connector. Always verify before assuming a method works:

```bash
curl 'https://unify.apideck.com/connector/connectors/google-workspace' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}"
```

See [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) for patterns around `UnsupportedOperationError` and connector-specific fallbacks.

## Escape hatch: Proxy API

When an endpoint isn't covered by the HRIS unified API, use Apideck's Proxy to call Google Workspace directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Google Workspace's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: google-workspace" \
  -H "x-apideck-downstream-url: <target endpoint on Google Workspace>" \
  -H "x-apideck-downstream-method: GET"
```

See [Google Workspace's API docs](#) for available endpoints.

## Sibling connectors

Other **HRIS** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`bamboohr`](../bamboohr/), [`workday`](../workday/), [`deel`](../deel/) *(beta)*, [`hibob`](../hibob/), [`personio`](../personio/), [`adp-ihcm`](../adp-ihcm/) *(beta)*, [`adp-workforce-now`](../adp-workforce-now/) *(beta)*, [`paychex`](../paychex/) *(beta)*, and 49 more.

## See also

- [HRIS OpenAPI spec](https://specs.apideck.com/hris.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=hris)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
