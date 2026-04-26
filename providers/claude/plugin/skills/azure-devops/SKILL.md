---
name: azure-devops
description: |
  Azure DevOps via Apideck's Proxy API + managed Vault auth — Apideck handles auth and proxies HTTP calls to Azure DevOps's native API. Use when the user wants to call Azure DevOps (no unified API resource mapping). Routes through Apideck with serviceId "azure-devops".
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
  serviceId: azure-devops
  proxyOnly: true
  unifiedApis: []
  authType: basic
  tier: "2"
  verified: true
  status: beta
---

# Azure DevOps (via Apideck Proxy)

Access Azure DevOps through Apideck's **Proxy API** with managed Vault auth. Apideck stores credentials, refreshes tokens, and forwards your HTTP calls to Azure DevOps's native API — you keep using Azure DevOps's own request and response shapes, while Apideck eliminates per-tenant credential plumbing and gives you a single auth integration shared across every Apideck connector.

> **Auth-only / proxy-only connector.** Apideck does not map Azure DevOps to a unified-API resource model — your code talks Azure DevOps's own API directly through the Proxy. You still get Vault credential storage, token refresh, retries, and a consistent request envelope.

## Quick facts

- **Apideck serviceId:** `azure-devops`
- **Mode:** Proxy-only (no unified API resources)
- **Auth type:** basic
- **Status:** beta
- **Gotchas:** [page](https://developers.apideck.com/apis/proxy/azure-devops/gotchas)
- **Azure DevOps docs:** https://learn.microsoft.com/en-us/rest/api/azure/devops/
- **Homepage:** https://azure.microsoft.com/en-us/products/devops

## When to use this skill

Activate this skill when the user wants to call Azure DevOps via Apideck — for example, "call the Azure DevOps API" or "fetch data from Azure DevOps". This skill teaches the agent:

1. That Azure DevOps routes through Apideck's **Proxy API**, not a unified resource API
2. The correct `serviceId` to pass on every call (`azure-devops`)
3. How to keep using Azure DevOps's native request/response shapes while Apideck handles Vault auth

If you need a unified-API surface (one method shape across many vendors), see the connector skills in this catalog whose serviceId is mapped to a unified API.

## Auth

- **Type:** Basic auth (username/password)
- **Managed by:** Apideck Vault — credentials are collected through the Vault modal and stored encrypted server-side.
- **Note:** basic auth connectors often require manual rotation by the end user. If auth fails persistently, prompt them to re-enter credentials in Vault.

## Calling Azure DevOps via the Proxy API

Send any HTTP request to `https://unify.apideck.com/proxy`. Apideck looks up the user's stored Azure DevOps credentials by `x-apideck-consumer-id` + `x-apideck-service-id`, injects them on the way out, and returns Azure DevOps's raw response.

```bash
curl 'https://unify.apideck.com/proxy' \
  -H "Authorization: Bearer ${APIDECK_API_KEY}" \
  -H "x-apideck-app-id: ${APIDECK_APP_ID}" \
  -H "x-apideck-consumer-id: ${CONSUMER_ID}" \
  -H "x-apideck-service-id: azure-devops" \
  -H "x-apideck-downstream-url: <target endpoint on Azure DevOps>" \
  -H "x-apideck-downstream-method: GET"
```

For `POST`/`PATCH`/`PUT`/`DELETE`, change `x-apideck-downstream-method` and pass the body as you would to Azure DevOps directly. Apideck does not transform the body — it forwards bytes.

See [Azure DevOps's API docs](https://learn.microsoft.com/en-us/rest/api/azure/devops/) for available endpoints.

## See also

- [Azure DevOps gotchas](https://developers.apideck.com/apis/proxy/azure-devops/gotchas)
- [Apideck Proxy API reference](https://developers.apideck.com/apis/proxy/reference)
- [`apideck-rest`](../../skills/apideck-rest/) — REST patterns including the Proxy
- [`apideck-best-practices`](../../skills/apideck-best-practices/) — Vault, error handling, retries
- [`apideck-unified-api`](../../skills/apideck-unified-api/) — when to use unified vs proxy
- [Azure DevOps official docs](https://learn.microsoft.com/en-us/rest/api/azure/devops/)
