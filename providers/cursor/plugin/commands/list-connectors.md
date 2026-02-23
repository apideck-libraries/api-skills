---
description: List available Apideck connectors and their supported operations for a unified API
argument-hint: [api] (e.g., crm, accounting, hris)
---

# List Apideck Connectors

Show available connectors and their capabilities for a given Apideck unified API:

1. Accept the unified API name from arguments (e.g., `crm`, `accounting`, `hris`, `file-storage`, `ats`)
2. Use the Vault API to list connections: `vault.connections.list({ api: "<api>" })`
3. Display each connector with:
   - Service ID and name
   - Connection state (available, callable, added, authorized, invalid)
   - Whether it's currently enabled
4. If the user has no connections, suggest opening Vault to set them up
5. For each connected service, note which CRUD operations are supported
6. Include a link to the full connector coverage at https://developers.apideck.com/apis/connector/reference
