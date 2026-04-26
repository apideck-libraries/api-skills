---
name: apideck-mcp
description: Front-door skill for the Apideck MCP server — 330 unified-API tools across 10 domains plus 4 intent-grouped workflow tools, exposed via dynamic discovery. Use when the user is building an MCP-based agent (Claude Code, OpenAI Agents SDK, Pydantic AI, LangChain) and wants to integrate with any of the 200+ SaaS connectors Apideck covers. Hosted at mcp.apideck.dev/mcp; stdio transport via `npx -y @apideck/mcp` for local development.
license: Apache-2.0
alwaysApply: false
metadata:
  author: apideck
  version: "1.0.0"
---

# Apideck MCP

The [Apideck MCP server](https://github.com/apideck-libraries/mcp) exposes the Unified API as Model Context Protocol tools. One MCP server, 330+ tools, 200+ SaaS connectors.

If you're building an agent that needs to read/write SaaS data — invoices, candidates, employees, files, tickets, customers — and your agent runtime supports MCP (Claude Code, Claude Desktop, Cursor, Windsurf, OpenAI Agents SDK, Pydantic AI, LangChain), this is usually the right choice over a language SDK.

## When to prefer MCP over the language SDK

| Use the MCP server when… | Use a language SDK ([`apideck-node`](../apideck-node/), [`apideck-python`](../apideck-python/), …) when… |
|---|---|
| You're building an agent (LLM-driven control flow) | You're building a deterministic backend integration |
| You want dynamic tool discovery — agent picks tools at runtime | You know at compile time which methods you'll call |
| Your runtime already speaks MCP (Claude Code, Cursor, OpenAI Agents SDK, …) | You're embedding Apideck inside a non-agent service |
| You want Vault OAuth elicitation handled for free (consent URLs surface as MCP elicitations) | You'll wire OAuth flows yourself |
| Tool descriptions matter for agent decision-making | Your code knows which method to call regardless of description quality |

## Endpoints

```
Hosted:    https://mcp.apideck.dev/mcp
Stdio:     npx -y @apideck/mcp
Source:    https://github.com/apideck-libraries/mcp
```

### Pass credentials via headers (HTTP)

```
x-apideck-api-key:      <your Apideck API key>
x-apideck-app-id:       <your application ID>
x-apideck-consumer-id:  <end-user / customer ID>
```

### Pass credentials via env vars (stdio)

```bash
APIDECK_API_KEY=...  APIDECK_APP_ID=...  APIDECK_CONSUMER_ID=...  npx -y @apideck/mcp
```

## IMPORTANT RULES

- **PREFER dynamic mode** (`?mode=dynamic` or `--dynamic`, the default). It exposes 4 meta-tools — `list_tools`, `describe_tool_input`, `execute_tool`, `list_scopes` — instead of 330 individual tools, dropping initial token cost from ~25-40K to ~1,300. Switch to static mode only for small fixed tool sets.
- **CALL `list_tools` first** with relevant `search_terms` (`["accounting", "invoices"]`, `["hris", "employees"]`). Don't enumerate 330 tools.
- **PREFER workflow tools over manual chains** — see "Intent-grouped workflows" below. The agent that picks `apideck-pay-bill` instead of stitching `accounting-bills-get` + `accounting-bill-payments-create` will succeed more often and leak less context.
- **HANDLE URL elicitations**: when an upstream call hits a missing/expired Vault connection, the server throws `UrlElicitationRequiredError` (MCP error code `-32042`) carrying a one-time consent URL. Surface this URL to the user, wait for them to complete OAuth, then retry the original tool call.
- **USE `x-apideck-service-id`** when a consumer has multiple connections of the same unified API — e.g. the consumer connected both Xero and QuickBooks, and the user wants the call to target Xero. Without this, Apideck routes to whichever connection is first.
- **USE scopes** to restrict an agent to a subset of capabilities — `?scopes=read` for analysis agents, `?scopes=read,write` to allow non-destructive changes, omit for full access. Scopes are enforced server-side, so a "read-only" agent literally cannot call destructive tools no matter what the prompt says.

## Intent-grouped workflows

The MCP server ships 4 high-level **workflow tools** alongside the 330 endpoint tools. Each workflow orchestrates 2-4 underlying calls behind a single intent. Prefer these when they match the user's task — agents picking the right workflow succeed more often than agents stitching the chain manually.

| Workflow | Use when… | See |
|---|---|---|
| `apideck-month-end-close-check` | "Give me a P&L / balance sheet / aged receivables snapshot" | [`apideck-mcp-month-end-close`](../apideck-mcp-month-end-close/) |
| `apideck-pay-bill` | "Pay bill X" / "Settle invoice X from supplier" | [`apideck-mcp-pay-bill`](../apideck-mcp-pay-bill/) |
| `apideck-receive-customer-payment` | "Record that customer paid invoice X" | [`apideck-mcp-receive-payment`](../apideck-mcp-receive-payment/) |
| `apideck-onboard-employee` | "Convert hired applicant X into an employee" | [`apideck-mcp-onboard-employee`](../apideck-mcp-onboard-employee/) |

Workflows return a structured result with `failingStep` so you know *which* leg of the chain broke when something fails. Partial successes (e.g. one report unsupported by the connector) come back as useful data, not opaque errors.

## Mode selection

The server supports three operational modes:

- **Dynamic mode** (default): 4 meta-tools, ~1,300 initial tokens, agent discovers via `list_tools`. **Use this.**
- **Static mode**: All 330+ tools listed up front, ~25-40K tokens. Use only when you're filtering to a tiny subset (e.g. `?include=accounting-invoices-list,accounting-invoices-get`) and want the schemas resolved at handshake.
- **Code mode** (`?mode=code`, experimental): Agent writes JavaScript against an `apideck.*` SDK in a sandbox. Beta — currently uses `vm.createContext` which isn't production-hardened. Skip for production agents.

## Coverage

330 tools across these unified APIs:

| API | Tools | Examples |
|---|---|---|
| Accounting | 143 | invoices, bills, payments, suppliers, customers, P&L, balance sheet, journal entries |
| CRM | 50 | companies, contacts, leads, opportunities, pipelines, activities |
| File Storage | 32 | files, folders, drives, shared links, upload sessions |
| HRIS | 25 | employees, departments, payrolls, time-off requests |
| Vault | 23 | connections, consumers, sessions, custom mappings, logs |
| ATS | 15 | applicants, applications, jobs |
| Issue Tracking | 15 | tickets, comments, users, tags |
| Connector | 8 | API discovery, coverage metadata |
| Ecommerce | 7 | customers, orders, products, stores |
| Webhook | 6 | webhook subscriptions, logs |
| Proxy | 6 | direct GET/POST/PUT/PATCH/DELETE for connector-native endpoints not yet in the unified spec |

## Worked example: list invoices in dynamic mode

```
Agent: list_tools(search_terms: ["accounting", "invoices"])
→ Returns: [
    "accounting-invoices-list",
    "accounting-invoices-get",
    "accounting-invoices-create",
    "accounting-invoices-update",
    "accounting-invoices-delete"
  ]

Agent: describe_tool_input(tool_name: "accounting-invoices-list")
→ Returns: {
    filter: { updated_since, status, ... },
    cursor: string,
    limit: number,
    "x-apideck-service-id": string,
    ...
  }

Agent: execute_tool(
  tool_name: "accounting-invoices-list",
  input: { limit: 10, "x-apideck-service-id": "quickbooks" }
)
→ Returns: { data: [...], meta: { cursors: { next: "..." } } }
```

Initial cost: ~1,300 tokens for the meta-tools. The agent fetches schemas only for tools it intends to call.

## Related skills

- [`apideck-unified-api`](../apideck-unified-api/) — the unified-API model itself; install this alongside `apideck-mcp` if your agent isn't already grounded on Apideck's routing model.
- [`apideck-best-practices`](../apideck-best-practices/) — auth patterns, pagination, error handling, Vault — applies to MCP usage too.
- [`apideck-connector-coverage`](../apideck-connector-coverage/) — how to verify a method is supported by a specific connector before calling it.
- Per-workflow playbooks: [`apideck-mcp-pay-bill`](../apideck-mcp-pay-bill/), [`apideck-mcp-receive-payment`](../apideck-mcp-receive-payment/), [`apideck-mcp-onboard-employee`](../apideck-mcp-onboard-employee/), [`apideck-mcp-month-end-close`](../apideck-mcp-month-end-close/).

## Reference

- Server source + docs: [github.com/apideck-libraries/mcp](https://github.com/apideck-libraries/mcp)
- Workflow tool authoring guide: [docs/authoring-workflow-tools.md](https://github.com/apideck-libraries/mcp/blob/main/docs/authoring-workflow-tools.md)
- MCP protocol spec: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- Glama TDQS rubric (server scores AAA): [glama.ai/blog/2026-04-03-tool-definition-quality-score-tdqs](https://glama.ai/blog/2026-04-03-tool-definition-quality-score-tdqs)
