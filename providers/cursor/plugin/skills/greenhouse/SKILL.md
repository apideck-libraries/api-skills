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
  difficulty: involved
  partnershipRequired: true
  sandboxAvailable: true
---

# Greenhouse (via Apideck)

Access Greenhouse through Apideck's **ATS** unified API — one of 11 ATS connectors that share the same method surface. Code you write here ports to Workday, Lever, Workable and 7 other ATS connectors by changing a single `serviceId` string. Apideck handles auth, pagination, rate limiting, and retries so you don't write per-tenant Greenhouse plumbing.

## Quick facts

- **Apideck serviceId:** `greenhouse`
- **Unified API:** ATS
- **Auth type:** basic
- **Apideck setup guide:** [Connection guide](https://developers.apideck.com/connectors/greenhouse/docs/consumer+connection)
- **Gotchas:** [page](https://developers.apideck.com/apis/ats/greenhouse/gotchas)
- **Greenhouse docs:** https://developers.greenhouse.io
- **Homepage:** https://www.greenhouse.io/

## At a glance

- **Implementation difficulty:** involved — Greenhouse-Issued Partner Credentials Per Organization — No Self-Service Signup or Sandbox
- **Vendor partnership required:** yes ([Greenhouse Integration Partner Program](https://www.greenhouse.com/integration-partner)) — Required — apply through the Greenhouse Integration Partner Program. There is no self-service developer signup.
- **Apideck-managed credentials:** not available — consumers supply their own Greenhouse-issued OAuth credentials in every environment.
- **Account type required:** An active Greenhouse account with a Harvest V3 partner integration provisioned.
- **Consumer access level:** Authorization requires a Greenhouse Site Admin, or a user with the "can manage ALL organization's API credentials" permission; the connection then operates with exactly that user's permissions.
- **Sandbox:** available — Partner-only — Greenhouse grants sandbox and demo organizations through its partner program during onboarding. There is no self-service developer sandbox.
- **Costs:** Quote-based — Greenhouse sells three plans (Core, Plus, and Pro) priced by hiring volume and organizational complexity, with no public price list. No free trial is offered.
- **Rate limits:** Fixed 30-second window; the ceiling varies by integration type (partner vs custom) and is returned per response — Greenhouse's documented example is 75 per window.
- **Authentication:** OAuth 2.0 Authorization Code Grant against Harvest V3.
- **Webhooks:** Virtual webhooks — Apideck polls Greenhouse and emits ats.applicant.created, ats.applicant.updated, ats.job.created, and ats.job.updated.

**Important to know:**

- Greenhouse shuts down Harvest V1 and V2 on August 31, 2026. Connections created with the older API-key authentication stop working on that date — every existing consumer must re-authorize through the Harvest V3 OAuth flow before then.
- Greenhouse must approve the integration before customers can migrate to Harvest V3.
- Refresh tokens rotate on every use and idle-expire after 24 hours. A connection that goes a full day without activity cannot refresh itself and must be re-authorized from Vault, which makes low-traffic or seasonal integrations especially prone to dropping out.
- Every record the integration creates or updates is attributed in Greenhouse to the individual user who authorized the connection — Greenhouse does offer Site-Admin-only service accounts as a dedicated authorizing identity — so have consumers authorize deliberately rather than with whoever happens to be signed in.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/greenhouse` (`overview` field) is the live, authoritative version.

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

- **Auth type:** API key — user pastes their Greenhouse key into the Vault modal.
- **Key type matters:** Greenhouse keys are either **Harvest** (read/write, full coverage) or **Job Board** (public-facing, read-only). Apideck needs a Harvest key for anything beyond reading published jobs. If the user provides a Job Board key, writes will 403 — direct them to generate a Harvest key in Greenhouse admin.
- **On-Behalf-Of user:** some Greenhouse writes (moving applications, rejecting candidates) require an `On-Behalf-Of` user header. This is configured on the connection in the Apideck dashboard — the user picks which Greenhouse user Apideck acts as.

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

- [Apideck connection guide for Greenhouse](https://developers.apideck.com/connectors/greenhouse/docs/consumer+connection)
- [ATS OpenAPI spec](https://specs.apideck.com/ats.yml) · [API Explorer](https://developers.apideck.com/api-explorer?id=ats)
- [`apideck-connector-coverage`](../../skills/apideck-connector-coverage/) — programmatic coverage checks
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — architecture, Vault, pagination, error handling
- [`apideck-node`](../../skills/apideck-node/) — TypeScript / Node SDK patterns
- [Greenhouse official docs](https://developers.greenhouse.io)
