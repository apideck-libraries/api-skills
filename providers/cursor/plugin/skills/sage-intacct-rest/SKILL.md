---
name: sage-intacct-rest
description: |
  Sage Intacct REST via Apideck's Proxy API + managed Vault auth — Apideck handles auth and proxies HTTP calls to Sage Intacct REST's native API. Use when the user wants to call Sage Intacct REST (no unified API resource mapping). Routes through Apideck with serviceId "sage-intacct-rest".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: sage-intacct-rest
  proxyOnly: true
  unifiedApis: []
  authType: oauth2
  tier: "2"
  verified: true
  status: live
  difficulty: involved
  partnershipRequired: true
  sandboxAvailable: true
---

# Sage Intacct REST (via Apideck Proxy)

Access Sage Intacct REST through Apideck's **Proxy API** with managed Vault auth. Apideck stores credentials, refreshes tokens, and forwards your HTTP calls to Sage Intacct REST's native API — you keep using Sage Intacct REST's own request and response shapes, while Apideck eliminates per-tenant credential plumbing and gives you a single auth integration shared across every Apideck connector.

> **Auth-only / proxy-only connector.** Apideck does not map Sage Intacct REST to a unified-API resource model — your code talks Sage Intacct REST's own API directly through the Proxy. You still get Vault credential storage, token refresh, retries, and a consistent request envelope.

## Quick facts

- **Apideck serviceId:** `sage-intacct-rest`
- **Mode:** Proxy-only (no unified API resources)
- **Auth type:** oauth2
- **Status:** live
- **Apideck setup guide:** [OAuth credentials](https://unify.apideck.com/connector/connectors/sage-intacct-rest/docs/application_owner+oauth_credentials)
- **Gotchas:** [page](https://developers.apideck.com/apis/proxy/sage-intacct-rest/gotchas)
- **Sage Intacct REST docs:** https://developer.intacct.com/api/
- **Homepage:** https://www.sageintacct.com/

## At a glance

- **Implementation difficulty:** involved — Marketplace Partnership + App Registry Registration Required
- **Vendor partnership required:** yes ([Sage Intacct Marketplace](https://marketplace.intacct.com/BecomeAPartner)) — Sage Intacct Marketplace Partner Program is required, plus a separate OAuth application registered in the Sage App Registry. Apideck can facilitate the partnership introduction.
- **Apideck-managed credentials:** available — Available for testing and evaluation — consumers authorize against Apideck's registered Sage application, so the consent screen shows Apideck branding. Production requires your own App Registry application, registered once the Marketplace partnership is in place.
- **Account type required:** Sage Intacct company with REST API access enabled
- **Consumer access level:** The connection acts as the authorizing Sage Intacct user, so that user's role permissions become the connection's effective access. Permissions are granted per module and per operation, and a company Admin must authorize the client application in each consumer's Sage Intacct company before any connection works.
- **Sandbox:** available — The App Registry application carries a Non-production client scope for testing. Sage's own sandbox companies are restricted — offered to new direct customers with smaller tenants and refreshable up to 4 times a year — and are not available to customers whose companies are managed through a Sage Intacct console, or who bought Intacct through a reseller.
- **Costs:** Sage Intacct Marketplace Partner Program: $2,500/year plus $0.015 per API call once consumers are live (as of Q4 2025). Confirm current terms with Sage during onboarding.
- **Rate limits:** Each company is allowed one API transaction job (online or offline) plus one offline report job concurrently on the standard level of service; a third concurrent request is held about 30 seconds and then errors. Sage also returns its live budget on every response, which Apideck surfaces as x-downstream-ratelimit-limit / -remaining / -reset — read those rather than assuming, as the concurrency Sage grants a given company can differ from the documented default.
- **Authentication:** OAuth 2.0 authorization code grant — a real OAuth flow, unlike the sage-intacct (XML) connector, which uses a Sender ID plus company/user credentials.
- **Webhooks:** No native webhooks — Apideck provides virtual webhooks (polling-based change detection, https://help.apideck.com/en/articles/4231234) with created, updated and deleted events across 13 of the supported accounting resources.

**Important to know:**

- Financial reports are not available through the REST API — no balance sheet, profit and loss, aged debtors or account hierarchies. Sage's REST reporting endpoints generate downloadable files asynchronously instead of returning queryable data.
- Two Sage Intacct connectors exist with different capabilities: customer refunds and quote creation are REST-only, while the financial reports above remain exclusive to sage-intacct (XML). Attachments work on both — here they cover invoices, bills, expenses, expense reports and quotes. Choosing the wrong one means rebuilding.
- API tokens are session-bound: signing in to the Sage Intacct web UI as the authorizing user invalidates the token (error REST-2102). Authorize with a dedicated integration user that nobody signs in as interactively.
- Customer refunds are switched off by default in Sage, and the permission to grant does not appear until the feature is enabled in the Accounts Receivable configuration.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/sage-intacct-rest` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user wants to call Sage Intacct REST via Apideck — for example, "call the Sage Intacct REST API" or "fetch data from Sage Intacct REST". This skill teaches the agent:

1. That Sage Intacct REST routes through Apideck's **Proxy API**, not a unified resource API
2. The correct `serviceId` to pass on every call (`sage-intacct-rest`)
3. How to keep using Sage Intacct REST's native request/response shapes while Apideck handles Vault auth

If you need a unified-API surface (one method shape across many vendors), see the connector skills in this catalog whose serviceId is mapped to a unified API.

## Auth

- **Type:** OAuth 2.0
- **Managed by:** Apideck Vault — Apideck handles the full OAuth dance (authorization code flow, token exchange, refresh). Never ask the user for API keys or tokens directly.
- **User setup:** Users authorize via the Vault modal. Connection state progresses `available → added → authorized → callable`.
- **Token refresh:** automatic. Expired tokens are refreshed transparently on the next API call.

## Calling Sage Intacct REST via the Proxy API

Send any HTTP request to `https://unify.apideck.com/proxy`. Apideck looks up the user's stored Sage Intacct REST credentials by `x-apideck-consumer-id` + `x-apideck-service-id`, injects them on the way out, and returns Sage Intacct REST's raw response.

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: sage-intacct-rest" \
  -H "x-apideck-downstream-url: <target endpoint on Sage Intacct REST>" \
  -H "x-apideck-downstream-method: GET"
```

For `POST`/`PATCH`/`PUT`/`DELETE`, change `x-apideck-downstream-method` and pass the body as you would to Sage Intacct REST directly. Apideck does not transform the body — it forwards bytes.

See [Sage Intacct REST's API docs](https://developer.intacct.com/api/) for available endpoints.

## See also

- [Apideck OAuth setup guide for Sage Intacct REST](https://unify.apideck.com/connector/connectors/sage-intacct-rest/docs/application_owner+oauth_credentials)
- [Sage Intacct REST gotchas](https://developers.apideck.com/apis/proxy/sage-intacct-rest/gotchas)
- [Apideck Proxy API reference](https://developers.apideck.com/apis/proxy/reference)
- [`apideck-rest`](../../skills/apideck-rest/) — REST patterns including the Proxy
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — Vault, error handling, retries
- [`apideck-unified-api`](../../skills/apideck-unified-api/) — when to use unified vs proxy
- [Sage Intacct REST official docs](https://developer.intacct.com/api/)
