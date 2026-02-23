---
description: Generate a Portman configuration for API contract testing against an Apideck spec
argument-hint: [api] (e.g., crm, accounting, hris)
---

# Initialize Portman for Apideck API Testing

Generate a complete Portman configuration for testing an Apideck unified API:

1. Accept the API name from arguments (e.g., `crm`, `accounting`, `hris`, `file-storage`, `ats`)
2. Create a `portman-config.json` with:
   - Contract tests enabled for all operations (status, content-type, JSON body, schema validation)
   - Response time tests at 500ms threshold
   - Variable chaining: capture `data.id` from create operations for use in get/update/delete
   - Security overwrites for Bearer token from `{{bearerToken}}` env var
   - Header overwrites for `x-apideck-app-id`, `x-apideck-consumer-id`, `x-apideck-service-id`
   - A variation test for 401 Unauthorized with an invalid token
   - An integration test for the primary resource lifecycle (create → get → update → delete)
3. Create a `.env` file template with `PORTMAN_BEARER_TOKEN`, `PORTMAN_APP_ID`, `PORTMAN_CONSUMER_ID`, `PORTMAN_SERVICE_ID`
4. Create a `portman-cli-options.json` pointing to the Apideck spec URL (`https://specs.apideck.com/{api}.yml`)
5. Show the command to run: `portman --cliOptionsFile ./portman-cli-options.json`
