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

- **Implementation difficulty:** involved — Paid Web Services Developer License + Per-Consumer Admin Authorization Required
- **Vendor partnership required:** yes ([Sage Intacct Marketplace](https://marketplace.intacct.com/BecomeAPartner)) — A Sage Web Services developer license is required — via the Sage Intacct Marketplace Partner Program, or directly from Sage through your account manager.
- **Apideck-managed credentials:** Available for testing and evaluation — consumers authorize against Apideck's registered Sage application, so the consent screen shows Apideck branding.
- **Account type required:** Sage Intacct company with REST API access enabled
- **Consumer access level:** The connection inherits the authorizing Sage Intacct user's role permissions, and a company Admin must authorize the application in each consumer's company.
- **Sandbox:** available — Free — choose the Non-production client scope when registering the app, or use a Sage Intacct Developer Portal test account.
- **Costs:** The Web Services developer license is paid: one third-party example is $2,500/year plus $0.015 per API call (Q4 2025). Confirm current terms with Sage.
- **Rate limits:** Tier 1 (automatic): 100,000 API transactions/month — each written record and each read call, per page, is one transaction. One API job at a time per company.
- **Authentication:** OAuth 2.0 authorization code grant — a real OAuth flow, unlike the sage-intacct (XML) connector, which uses a Sender ID plus company/user credentials.
- **Webhooks:** Virtual webhooks — created, updated and deleted events across 13 of the supported accounting resources. Sage Intacct has no native webhooks.

**Important to know:**

- API tokens are session-bound: signing in to the Sage Intacct web UI as the authorizing user invalidates the token (error REST-2102). Authorize with a dedicated integration user that nobody signs in as interactively.
- Financial reports stay exclusive to the sage-intacct (XML) connector: REST's reporting endpoints only generate downloadable files asynchronously, never queryable data — a permanent platform gap. Other uncovered Sage endpoints remain reachable via the Apideck Proxy API.
- The two Sage Intacct connectors are not interchangeable and nothing migrates automatically: switching means authorizing a brand-new connection, and record identifiers do not carry over. Choose one before you build.
- Two module permissions are easy to miss: quotes need Order Entry — without it, listing returns 403 and creating fails with an error that reads like a company misconfiguration — and customer refunds stay hidden until the feature is enabled in Accounts Receivable.
- The REST API reached General Availability with Sage's 2025 Release 1 and is the platform Sage recommends for new integrations. The legacy XML/SOAP gateway is frozen and receives no new API objects, so customer refunds and quote creation live only here.

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
