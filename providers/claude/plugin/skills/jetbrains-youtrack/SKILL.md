---
name: jetbrains-youtrack
description: |
  JetBrains YouTrack via Apideck's Proxy API + managed Vault auth — Apideck handles auth and proxies HTTP calls to JetBrains YouTrack's native API. Use when the user wants to call JetBrains YouTrack (no unified API resource mapping). Routes through Apideck with serviceId "jetbrains-youtrack".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: jetbrains-youtrack
  proxyOnly: true
  unifiedApis: []
  authType: apiKey
  tier: "2"
  verified: true
  status: beta
---

# JetBrains YouTrack (via Apideck Proxy)

Access JetBrains YouTrack through Apideck's **Proxy API** with managed Vault auth. Apideck stores credentials, refreshes tokens, and forwards your HTTP calls to JetBrains YouTrack's native API — you keep using JetBrains YouTrack's own request and response shapes, while Apideck eliminates per-tenant credential plumbing and gives you a single auth integration shared across every Apideck connector.

> **Auth-only / proxy-only connector.** Apideck does not map JetBrains YouTrack to a unified-API resource model — your code talks JetBrains YouTrack's own API directly through the Proxy. You still get Vault credential storage, token refresh, retries, and a consistent request envelope.

## Quick facts

- **Apideck serviceId:** `jetbrains-youtrack`
- **Mode:** Proxy-only (no unified API resources)
- **Auth type:** apiKey
- **Status:** beta
- **Gotchas:** [page](https://developers.apideck.com/apis/proxy/jetbrains-youtrack/gotchas)
- **JetBrains YouTrack docs:** https://www.jetbrains.com/help/youtrack/devportal/youtrack-rest-api.html
- **Homepage:** https://www.jetbrains.com/youtrack/

## When to use this skill

Activate this skill when the user wants to call JetBrains YouTrack via Apideck — for example, "call the JetBrains YouTrack API" or "fetch data from JetBrains YouTrack". This skill teaches the agent:

1. That JetBrains YouTrack routes through Apideck's **Proxy API**, not a unified resource API
2. The correct `serviceId` to pass on every call (`jetbrains-youtrack`)
3. How to keep using JetBrains YouTrack's native request/response shapes while Apideck handles Vault auth

If you need a unified-API surface (one method shape across many vendors), see the connector skills in this catalog whose serviceId is mapped to a unified API.

## Auth

- **Type:** API Key
- **Managed by:** Apideck Vault — the user pastes their JetBrains YouTrack API key into the Vault modal; Apideck stores it encrypted and injects it on every request.
- **Rotation:** if the user rotates their key, they re-enter it in Vault. No code changes needed.

## Calling JetBrains YouTrack via the Proxy API

Send any HTTP request to `https://unify.apideck.com/proxy`. Apideck looks up the user's stored JetBrains YouTrack credentials by `x-apideck-consumer-id` + `x-apideck-service-id`, injects them on the way out, and returns JetBrains YouTrack's raw response.

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: jetbrains-youtrack" \
  -H "x-apideck-downstream-url: <target endpoint on JetBrains YouTrack>" \
  -H "x-apideck-downstream-method: GET"
```

For `POST`/`PATCH`/`PUT`/`DELETE`, change `x-apideck-downstream-method` and pass the body as you would to JetBrains YouTrack directly. Apideck does not transform the body — it forwards bytes.

See [JetBrains YouTrack's API docs](https://www.jetbrains.com/help/youtrack/devportal/youtrack-rest-api.html) for available endpoints.

## See also

- [JetBrains YouTrack gotchas](https://developers.apideck.com/apis/proxy/jetbrains-youtrack/gotchas)
- [Apideck Proxy API reference](https://developers.apideck.com/apis/proxy/reference)
- [`apideck-rest`](../../skills/apideck-rest/) — REST patterns including the Proxy
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — Vault, error handling, retries
- [`apideck-unified-api`](../../skills/apideck-unified-api/) — when to use unified vs proxy
- [JetBrains YouTrack official docs](https://www.jetbrains.com/help/youtrack/devportal/youtrack-rest-api.html)
