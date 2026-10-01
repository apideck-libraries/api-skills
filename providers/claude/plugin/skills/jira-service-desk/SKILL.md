---
name: jira-service-desk
description: |
  Jira Service Desk via Apideck's Proxy API + managed Vault auth — Apideck handles auth and proxies HTTP calls to Jira Service Desk's native API. Use when the user wants to call Jira Service Desk (no unified API resource mapping). Routes through Apideck with serviceId "jira-service-desk".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: jira-service-desk
  proxyOnly: true
  unifiedApis: []
  authType: oauth2
  tier: "2"
  verified: true
  status: beta
  difficulty: moderate
  partnershipRequired: false
  sandboxAvailable: false
---

# Jira Service Desk (via Apideck Proxy)

Access Jira Service Desk through Apideck's **Proxy API** with managed Vault auth. Apideck stores credentials, refreshes tokens, and forwards your HTTP calls to Jira Service Desk's native API — you keep using Jira Service Desk's own request and response shapes, while Apideck eliminates per-tenant credential plumbing and gives you a single auth integration shared across every Apideck connector.

> **Auth-only / proxy-only connector.** Apideck does not map Jira Service Desk to a unified-API resource model — your code talks Jira Service Desk's own API directly through the Proxy. You still get Vault credential storage, token refresh, retries, and a consistent request envelope.

## Quick facts

- **Apideck serviceId:** `jira-service-desk`
- **Mode:** Proxy-only (no unified API resources)
- **Auth type:** oauth2
- **Status:** beta
- **Apideck setup guide:** [OAuth credentials](https://unify.apideck.com/connector/connectors/jira-service-desk/docs/application_owner+oauth_credentials)
- **Gotchas:** [page](https://developers.apideck.com/apis/proxy/jira-service-desk/gotchas)
- **Jira Service Desk docs:** https://developer.atlassian.com/cloud/jira/service-desk/rest/intro/
- **Homepage:** https://www.atlassian.com/software/jira/service-management

## At a glance

- **Implementation difficulty:** moderate — Self-Service OAuth App + No Dedicated Sandbox
- **Vendor partnership required:** no ([Atlassian developer console](https://developer.atlassian.com/console/myapps/)) — Registering your own OAuth 2.0 app there gives you the client ID and secret.
- **Apideck-managed credentials:** available — Apideck's test credentials, for trying the connection; production connections use your own OAuth app.
- **Account type required:** A Jira Service Management site on Atlassian Cloud.
- **Consumer access level:** A Jira user on the site who can authorise the app; the connection then reaches what that user can already see.
- **Sandbox:** not available — Test on a free Jira Service Management site (up to three agents).
- **Rate limits:** 65,000 points an hour, enforced since 2 March 2026, plus per-second burst limits. Listing customers on a service desk is capped at 5 requests a second.
- **Authentication:** Authorization Code flow.
- **Webhooks:** No webhooks - poll for changes instead.

**Important to know:**

- Jira Service Desk is an auth-only connector: there are no unified Issue Tracking endpoints. Apideck handles the OAuth connection, and every read and write goes through the Proxy API against Atlassian's own Service Desk API shape.
- The hourly request quota belongs to the app, not to each connected site: every site draws from the same pool by default, so later consumers compete with earlier ones.

> Facts synced from Apideck's connector metadata API — `GET /connector/connectors/jira-service-desk` (`overview` field) is the live, authoritative version.

## When to use this skill

Activate this skill when the user wants to call Jira Service Desk via Apideck — for example, "call the Jira Service Desk API" or "fetch data from Jira Service Desk". This skill teaches the agent:

1. That Jira Service Desk routes through Apideck's **Proxy API**, not a unified resource API
2. The correct `serviceId` to pass on every call (`jira-service-desk`)
3. How to keep using Jira Service Desk's native request/response shapes while Apideck handles Vault auth

If you need a unified-API surface (one method shape across many vendors), see the connector skills in this catalog whose serviceId is mapped to a unified API.

## Auth

- **Type:** OAuth 2.0
- **Managed by:** Apideck Vault — Apideck handles the full OAuth dance (authorization code flow, token exchange, refresh). Never ask the user for API keys or tokens directly.
- **User setup:** Users authorize via the Vault modal. Connection state progresses `available → added → authorized → callable`.
- **Token refresh:** automatic. Expired tokens are refreshed transparently on the next API call.

## Calling Jira Service Desk via the Proxy API

Send any HTTP request to `https://unify.apideck.com/proxy`. Apideck looks up the user's stored Jira Service Desk credentials by `x-apideck-consumer-id` + `x-apideck-service-id`, injects them on the way out, and returns Jira Service Desk's raw response.

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: jira-service-desk" \
  -H "x-apideck-downstream-url: <target endpoint on Jira Service Desk>" \
  -H "x-apideck-downstream-method: GET"
```

For `POST`/`PATCH`/`PUT`/`DELETE`, change `x-apideck-downstream-method` and pass the body as you would to Jira Service Desk directly. Apideck does not transform the body — it forwards bytes.

See [Jira Service Desk's API docs](https://developer.atlassian.com/cloud/jira/service-desk/rest/intro/) for available endpoints.

## See also

- [Apideck OAuth setup guide for Jira Service Desk](https://unify.apideck.com/connector/connectors/jira-service-desk/docs/application_owner+oauth_credentials)
- [Jira Service Desk gotchas](https://developers.apideck.com/apis/proxy/jira-service-desk/gotchas)
- [Apideck Proxy API reference](https://developers.apideck.com/apis/proxy/reference)
- [`apideck-rest`](../../skills/apideck-rest/) — REST patterns including the Proxy
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — Vault, error handling, retries
- [`apideck-unified-api`](../../skills/apideck-unified-api/) — when to use unified vs proxy
- [Jira Service Desk official docs](https://developer.atlassian.com/cloud/jira/service-desk/rest/intro/)
