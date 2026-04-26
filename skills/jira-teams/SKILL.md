---
name: jira-teams
description: |
  Jira Teams via Apideck's Proxy API + managed Vault auth — Apideck handles auth and proxies HTTP calls to Jira Teams's native API. Use when the user wants to call Jira Teams (no unified API resource mapping). Routes through Apideck with serviceId "jira-teams".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: jira-teams
  proxyOnly: true
  unifiedApis: []
  authType: basic
  tier: "2"
  verified: true
  status: beta
---

# Jira Teams (via Apideck Proxy)

Access Jira Teams through Apideck's **Proxy API** with managed Vault auth. Apideck stores credentials, refreshes tokens, and forwards your HTTP calls to Jira Teams's native API — you keep using Jira Teams's own request and response shapes, while Apideck eliminates per-tenant credential plumbing and gives you a single auth integration shared across every Apideck connector.

> **Auth-only / proxy-only connector.** Apideck does not map Jira Teams to a unified-API resource model — your code talks Jira Teams's own API directly through the Proxy. You still get Vault credential storage, token refresh, retries, and a consistent request envelope.

## Quick facts

- **Apideck serviceId:** `jira-teams`
- **Mode:** Proxy-only (no unified API resources)
- **Auth type:** basic
- **Status:** beta
- **Apideck setup guide:** [Connection guide](https://unify.apideck.com/connector/connectors/jira-teams/docs/consumer+connection)
- **Gotchas:** [page](https://developers.apideck.com/apis/proxy/jira-teams/gotchas)
- **Homepage:** https://www.atlassian.com

## When to use this skill

Activate this skill when the user wants to call Jira Teams via Apideck — for example, "call the Jira Teams API" or "fetch data from Jira Teams". This skill teaches the agent:

1. That Jira Teams routes through Apideck's **Proxy API**, not a unified resource API
2. The correct `serviceId` to pass on every call (`jira-teams`)
3. How to keep using Jira Teams's native request/response shapes while Apideck handles Vault auth

If you need a unified-API surface (one method shape across many vendors), see the connector skills in this catalog whose serviceId is mapped to a unified API.

## Auth

- **Type:** Basic auth (username/password)
- **Managed by:** Apideck Vault — credentials are collected through the Vault modal and stored encrypted server-side.
- **Note:** basic auth connectors often require manual rotation by the end user. If auth fails persistently, prompt them to re-enter credentials in Vault.

## Calling Jira Teams via the Proxy API

Send any HTTP request to `https://unify.apideck.com/proxy`. Apideck looks up the user's stored Jira Teams credentials by `x-apideck-consumer-id` + `x-apideck-service-id`, injects them on the way out, and returns Jira Teams's raw response.

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: jira-teams" \
  -H "x-apideck-downstream-url: <target endpoint on Jira Teams>" \
  -H "x-apideck-downstream-method: GET"
```

For `POST`/`PATCH`/`PUT`/`DELETE`, change `x-apideck-downstream-method` and pass the body as you would to Jira Teams directly. Apideck does not transform the body — it forwards bytes.

## See also

- [Apideck connection guide for Jira Teams](https://unify.apideck.com/connector/connectors/jira-teams/docs/consumer+connection)
- [Jira Teams gotchas](https://developers.apideck.com/apis/proxy/jira-teams/gotchas)
- [Apideck Proxy API reference](https://developers.apideck.com/apis/proxy/reference)
- [`apideck-rest`](../../skills/apideck-rest/) — REST patterns including the Proxy
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — Vault, error handling, retries
- [`apideck-unified-api`](../../skills/apideck-unified-api/) — when to use unified vs proxy
