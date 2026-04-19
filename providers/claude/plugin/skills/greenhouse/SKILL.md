---
name: greenhouse
description: |
  Greenhouse integration via Apideck's ATS unified API — same methods work across every connector in ATS, switch by changing `serviceId`. Use when the user wants to read, write, or sync jobs, applicants, and applications in Greenhouse. Routes through Apideck with serviceId "greenhouse".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: greenhouse
  unifiedApis: ["ats"]
  authType: basic
  tier: "1a"
  verified: true
---

# Greenhouse (via Apideck)

Access Greenhouse through Apideck's **ATS** unified API — one of 11 ATS connectors that share the same method surface. Code you write here ports to Workday, Lever, Workable and 7 other ATS connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Greenhouse plumbing.

## Quick facts

- **Apideck serviceId:** `greenhouse`
- **Unified API:** ATS
- **Auth type:** basic
- **Greenhouse docs:** https://developers.greenhouse.io
- **Homepage:** https://www.greenhouse.io/

## When to use this skill

Activate this skill when the user explicitly wants to work with **Greenhouse** — for example, "list open jobs in Greenhouse" or "move an applicant through stages in Greenhouse". This skill teaches the agent:

1. Which Apideck unified API covers Greenhouse (ATS)
2. The correct `serviceId` to pass on every call (`greenhouse`)
3. Greenhouse-specific auth and coverage caveats

For the full method surface (parameters, pagination, filtering), use your language SDK skill:

- [`apideck-node`](../../skills/apideck-node/), [`apideck-python`](../../skills/apideck-python/), [`apideck-dotnet`](../../skills/apideck-dotnet/), [`apideck-java`](../../skills/apideck-java/), [`apideck-go`](../../skills/apideck-go/), [`apideck-php`](../../skills/apideck-php/), or [`apideck-rest`](../../skills/apideck-rest/)

For the raw OpenAPI spec:

- **ATS:** [https://specs.apideck.com/ats.yml](https://specs.apideck.com/ats.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=ats)

## Minimal example (TypeScript)

```typescript
import { Apideck } from "@apideck/unify";

const apideck = new Apideck({
  apiKey: process.env.APIDECK_API_KEY,
  appId: process.env.APIDECK_APP_ID,
  consumerId: "your-consumer-id",
});

// List applicants in Greenhouse
const { data } = await apideck.ats.applicants.list({
  serviceId: "greenhouse",
});
```

## Portable across 11 ATS connectors

The Apideck **ATS** unified API exposes the same methods for every connector in its catalog. Switching from Greenhouse to another ATS connector is a one-string change — no rewrite, no new SDK.

```typescript
// Today — Greenhouse
await apideck.ats.applicants.list({ serviceId: "greenhouse" });

// Tomorrow — same code, different connector
await apideck.ats.applicants.list({ serviceId: "workday" });
await apideck.ats.applicants.list({ serviceId: "lever" });
```

This is the compounding advantage of using Apideck over integrating Greenhouse directly: code against the unified ATS API once, gain access to every connector in it. New connectors Apideck adds become available to your app without code changes.

## Greenhouse via Apideck ATS

Greenhouse is the reference enterprise ATS connector on Apideck. Strong coverage for jobs, candidates, and applications.

### Entity mapping

| Greenhouse entity | Apideck ATS resource |
|---|---|
| Job | `jobs` |
| Candidate | `applicants` |
| Application | `applications` |
| Job Post (external posting) | exposed via `jobs[].job_posts[]` |
| Stage (pipeline stage) | exposed via `jobs[].stages[]` |
| Scorecard / Interview | use Proxy |
| Offer | exposed as `applications[].offers[]` |

### Coverage highlights

- ✅ Full CRUD on jobs and applicants
- ✅ Applications — create, list, update stage
- ✅ Attachments on applicants (resumes, cover letters)
- ✅ Moving candidates through pipeline stages via `application.current_stage`
- ⚠️ Scorecards and interview kits — read-only in Greenhouse's API; use Proxy
- ❌ User management — use Proxy (Greenhouse Users endpoint)
- ❌ Custom fields on applications — use Proxy with the Greenhouse custom field endpoints

### Greenhouse-specific auth notes

- **Auth type:** API key — managed by Apideck Vault. Users paste their Greenhouse key in the Vault modal.
- **Permissions:** Greenhouse keys can be Harvest (read/write) or Job Board (public-facing, limited). Apideck requires Harvest for full coverage — Job Board keys will 403 on writes.
- **On-Behalf-Of:** some Greenhouse operations require an `On-Behalf-Of` user header. Apideck injects this based on the connection's configured user; consult Apideck dashboard to set or override.
- **Rate limits:** Greenhouse enforces per-endpoint rate limits. Apideck respects upstream 429 responses with automatic backoff — check Greenhouse's current docs for exact thresholds.

### Common Greenhouse quirks handled by Apideck

- **Candidate vs. Prospect** — Greenhouse distinguishes these by whether they're attached to an Application. Apideck exposes both under `applicants` and discriminates via `applicant.is_prospect`.
- **Multiple applications per candidate** — a Greenhouse candidate can apply to N jobs. Apideck surfaces this as `applicant.applications[]`.
- **Timestamps** — Greenhouse uses ISO 8601 with Z. Apideck passes through unchanged.
- **Source tracking** — Greenhouse's `source` is a structured object; Apideck flattens to `applicant.source.name`.

### Example: create a candidate and an application in one flow

```typescript
// 1. Create the candidate
const { data: applicant } = await apideck.ats.applicants.create({
  serviceId: "greenhouse",
  applicant: {
    first_name: "Jordan",
    last_name: "Lee",
    emails: [{ email: "jordan@example.com", type: "personal" }],
  },
});

// 2. Create an application for a job
const { data: application } = await apideck.ats.applications.create({
  serviceId: "greenhouse",
  application: {
    applicant_id: applicant.data.id,
    job_id: "job_4001",
    source: { name: "Referral" },
  },
});
```

### Example: move an application to the next stage

```typescript
await apideck.ats.applications.update({
  serviceId: "greenhouse",
  id: "app_123",
  application: { current_stage: { id: "stage_phone_screen" } },
});
```

## Escape hatch: Proxy API

When an endpoint isn't covered by the ATS unified API, use Apideck's Proxy to call Greenhouse directly — Apideck injects auth headers and handles token refresh. Set `x-apideck-downstream-url` to the target endpoint on Greenhouse's own API:

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: greenhouse" \
  -H "x-apideck-downstream-url: <target endpoint on Greenhouse>" \
  -H "x-apideck-downstream-method: GET"
```

See [Greenhouse's API docs](https://developers.greenhouse.io) for available endpoints.

## Sibling connectors

Other **ATS** connectors that share this unified API surface (same method signatures, just change `serviceId`):

[`workday`](../workday/), [`lever`](../lever/), [`workable`](../workable/) *(beta)*, [`bullhorn-ats`](../bullhorn-ats/) *(beta)*, [`teamtailor`](../teamtailor/) *(beta)*, [`freshteam`](../freshteam/), [`jobadder`](../jobadder/) *(beta)*, [`recruitee`](../recruitee/), and 2 more.

## See also

- [ATS OpenAPI spec](https://specs.apideck.com/ats.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=ats)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Greenhouse official docs](https://developers.greenhouse.io)
