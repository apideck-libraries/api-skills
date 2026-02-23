# Vault API Reference

Base namespace: `apideck.vault`

Vault manages authentication and connections between your application and downstream services. It provides embeddable UI components for end-users to authorize their own integrations.

## Connections

```typescript
// List all connections for a consumer
const { data } = await apideck.vault.connections.list({
  api: "crm",
});
// Returns: id, service_id, name, state, auth_type, enabled, created_at

// Get connection details
const { data } = await apideck.vault.connections.get({
  serviceId: "salesforce",
  unifiedApi: "crm",
});

// Update connection settings
const { data } = await apideck.vault.connections.update({
  serviceId: "salesforce",
  unifiedApi: "crm",
  connection: {
    enabled: true,
    settings: {
      instance_url: "https://mycompany.salesforce.com",
    },
  },
});

// Delete connection
await apideck.vault.connections.delete({
  serviceId: "salesforce",
  unifiedApi: "crm",
});

// Import connection (bring existing OAuth tokens)
const { data } = await apideck.vault.connections.imports({
  serviceId: "salesforce",
  unifiedApi: "crm",
  connectionImportData: {
    credentials: {
      access_token: "existing-access-token",
      refresh_token: "existing-refresh-token",
    },
  },
});
```

Connection states: `available`, `callable`, `added`, `authorized`, `invalid`.

## Connection Settings

```typescript
// Get available settings for a connection
const { data } = await apideck.vault.connectionSettings.list({
  unifiedApi: "accounting",
  serviceId: "quickbooks",
  resource: "invoices",
});
// Returns configurable fields, allowed values, and current settings
```

## Sessions

Create a Vault session URL to embed the connection management UI:

```typescript
// Create session for Vault embedded UI
const { data } = await apideck.vault.sessions.create({
  session: {
    consumer_metadata: {
      account_name: "Acme Corp",
      user_name: "John Doe",
      email: "john@acme.com",
      image: "https://acme.com/john.jpg",
    },
    redirect_uri: "https://myapp.com/integrations",
    settings: {
      unified_apis: ["accounting", "crm"],
      hide_resource_settings: false,
      sandbox_mode: false,
      auto_redirect: false,
    },
    theme: {
      vault_name: "My App Integrations",
      primary_color: "#4F46E5",
      sidepanel_background_color: "#F9FAFB",
      sidepanel_text_color: "#111827",
      favicon: "https://myapp.com/favicon.ico",
      logo: "https://myapp.com/logo.png",
    },
  },
});
// data.session_uri -> redirect user here to manage connections
```

## Consumers

```typescript
// List consumers
const { data } = await apideck.vault.consumers.list({ limit: 50 });

// Create consumer
const { data } = await apideck.vault.consumers.create({
  consumer: {
    consumer_id: "user_abc123",
    metadata: {
      account_name: "Acme Corp",
      user_name: "John Doe",
      email: "john@acme.com",
    },
  },
});

// Get consumer
const { data } = await apideck.vault.consumers.get({
  consumerId: "user_abc123",
});

// Delete consumer and all their connections
await apideck.vault.consumers.delete({
  consumerId: "user_abc123",
});
```

## Custom Mappings

Map connector-specific fields to your unified model:

```typescript
// List custom mappings for a connection
const { data } = await apideck.vault.customMappings.list({
  unifiedApi: "crm",
  serviceId: "salesforce",
});

// Update custom field mapping
const { data } = await apideck.vault.customMappings.update({
  unifiedApi: "crm",
  serviceId: "salesforce",
  id: "mapping_123",
  customMapping: {
    value: "$.custom_sf_field__c",
  },
});
```

## Logs

```typescript
// List API call logs
const { data } = await apideck.vault.logs.list({
  filter: {
    connector_id: "salesforce",
    status_code: 200,
    exclude_unified_apis: "vault,proxy",
  },
});
// Returns: api_style, base_url, path, method, status_code, duration, consumer_id, service_id, timestamp
```
