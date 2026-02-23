---
description: Test an Apideck connection by listing resources from a specified API and connector
argument-hint: [api] [service_id] (e.g., crm salesforce)
---

# Test Apideck Connection

Verify that an Apideck connection is working by making a simple list call:

1. Accept the unified API name (e.g., `crm`, `accounting`, `hris`) and service ID (e.g., `salesforce`, `quickbooks`) from arguments
2. Use the appropriate SDK to make a list call with `limit: 1` to the primary resource for that API:
   - `crm` → list contacts
   - `accounting` → list invoices
   - `hris` → list employees
   - `file-storage` → list files
   - `ats` → list jobs
3. If successful, show the connection status, service name, and a sample record
4. If it fails, explain the error and provide troubleshooting steps:
   - 401: Check API key, App ID, and Consumer ID
   - 402: Check API plan limits
   - 404: Verify the service ID and that the connection is authorized in Vault
5. Suggest using Vault to manage the connection if authorization is needed
