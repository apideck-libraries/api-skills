---
name: jira-data-center
description: |
  Jira Data Center via Apideck's Proxy API + managed Vault auth — Apideck handles auth and proxies HTTP calls to Jira Data Center's native API. Use when the user wants to call Jira Data Center (no unified API resource mapping). Routes through Apideck with serviceId "jira-data-center".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: jira-data-center
  proxyOnly: true
  unifiedApis: []
  authType: apiKey
  tier: "2"
  verified: true
  status: live
---

# Jira Data Center (via Apideck Proxy)

Access Jira Data Center through Apideck's **Proxy API** with managed Vault auth. Apideck stores credentials, refreshes tokens, and forwards your HTTP calls to Jira Data Center's native API — you keep using Jira Data Center's own request and response shapes, while Apideck eliminates per-tenant credential plumbing and gives you a single auth integration shared across every Apideck connector.

> **Auth-only / proxy-only connector.** Apideck does not map Jira Data Center to a unified-API resource model — your code talks Jira Data Center's own API directly through the Proxy. You still get Vault credential storage, token refresh, retries, and a consistent request envelope.

## Quick facts

- **Apideck serviceId:** `jira-data-center`
- **Mode:** Proxy-only (no unified API resources)
- **Auth type:** apiKey
- **Status:** live
- **Gotchas:** [page](https://developers.apideck.com/apis/proxy/jira-data-center/gotchas)
- **Jira Data Center docs:** https://developer.atlassian.com/server/jira/platform/rest/
- **Homepage:** https://www.atlassian.com/enterprise/data-center/jira

## When to use this skill

Activate this skill when the user wants to call Jira Data Center via Apideck — for example, "call the Jira Data Center API" or "fetch data from Jira Data Center". This skill teaches the agent:

1. That Jira Data Center routes through Apideck's **Proxy API**, not a unified resource API
2. The correct `serviceId` to pass on every call (`jira-data-center`)
3. How to keep using Jira Data Center's native request/response shapes while Apideck handles Vault auth

If you need a unified-API surface (one method shape across many vendors), see the connector skills in this catalog whose serviceId is mapped to a unified API.

## Auth

- **Type:** API Key
- **Managed by:** Apideck Vault — the user pastes their Jira Data Center API key into the Vault modal; Apideck stores it encrypted and injects it on every request.
- **Rotation:** if the user rotates their key, they re-enter it in Vault. No code changes needed.

## Calling Jira Data Center via the Proxy API

Send any HTTP request to `https://unify.apideck.com/proxy`. Apideck looks up the user's stored Jira Data Center credentials by `x-apideck-consumer-id` + `x-apideck-service-id`, injects them on the way out, and returns Jira Data Center's raw response.

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: jira-data-center" \
  -H "x-apideck-downstream-url: <target endpoint on Jira Data Center>" \
  -H "x-apideck-downstream-method: GET"
```

For `POST`/`PATCH`/`PUT`/`DELETE`, change `x-apideck-downstream-method` and pass the body as you would to Jira Data Center directly. Apideck does not transform the body — it forwards bytes.

See [Jira Data Center's API docs](https://developer.atlassian.com/server/jira/platform/rest/) for available endpoints.

## See also

- [Jira Data Center gotchas](https://developers.apideck.com/apis/proxy/jira-data-center/gotchas)
- [Apideck Proxy API reference](https://developers.apideck.com/apis/proxy/reference)
- [`apideck-rest`](../../skills/apideck-rest/) — REST patterns including the Proxy
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — Vault, error handling, retries
- [`apideck-unified-api`](../../skills/apideck-unified-api/) — when to use unified vs proxy
- [Jira Data Center official docs](https://developer.atlassian.com/server/jira/platform/rest/)
