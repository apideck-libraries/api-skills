# Vault JS Integration Reference

Vault JS is a vanilla JavaScript library to embed Apideck Vault in any web application. It lets your users authorize connectors and manage integration settings through a pre-built modal UI, and stores credentials securely so you can make authorized API calls on their behalf.

## Installation

```bash
npm install @apideck/vault-js
```

Or load via CDN (available globally as `window.ApideckVault`):

```html
<script src="https://unpkg.com/@apideck/vault-js"></script>
```

## Prerequisites

Session creation MUST happen server-side to prevent token leakage. Create a session using the `@apideck/unify` SDK before opening Vault:

```typescript
import { Apideck } from "@apideck/unify";

const apideck = new Apideck({
  apiKey: process.env["APIDECK_API_KEY"] ?? "",
  appId: "your-app-id",
  consumerId: "user_abc123",
});

const { data } = await apideck.vault.sessions.create({
  session: {
    consumer_metadata: {
      account_name: "Acme Corp",
      user_name: "John Doe",
      email: "john@acme.com",
    },
    redirect_uri: "https://myapp.com/integrations",
    settings: {
      unified_apis: ["accounting", "crm"],
      hide_resource_settings: false,
      sandbox_mode: false,
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

const sessionToken = data.session_token;
// Pass this token to your frontend
```

## Opening Vault

```typescript
import { ApideckVault } from "@apideck/vault-js";

// Basic usage — open Vault modal with a session token
ApideckVault.open({
  token: "SESSION_TOKEN_FROM_BACKEND",
});
```

## Configuration Options

```typescript
ApideckVault.open({
  // REQUIRED: JWT session token from your backend
  token: "SESSION_TOKEN_FROM_BACKEND",

  // Show integrations for a single Unified API only
  unifiedApi: "accounting",

  // Open Vault for a single integration only
  serviceId: "quickbooks",

  // Initial view to display
  // "settings" | "configurable-resources" | "custom-mapping"
  initialView: "settings",

  // Locale for the modal UI
  // "en" (default) | "nl" | "de" | "fr" | "es"
  locale: "en",

  // Show language switch in the modal
  showLanguageSwitch: true,

  // Use button layout instead of dropdown menus
  showButtonLayout: false,

  // Automatically start OAuth flow when opening a connection
  autoStartAuthorization: true,

  // Callback when modal is ready and visible
  onReady: () => {
    console.log("Vault modal is open");
  },

  // Callback when modal is closed
  onClose: () => {
    console.log("Vault modal closed");
  },

  // Callback when a connection is added, updated, or authorized
  onConnectionChange: (connection) => {
    console.log("Connection changed:", connection);
    // connection: { id, service_id, unified_api, state, ... }
  },

  // Callback when a connection is deleted
  onConnectionDelete: (connection) => {
    console.log("Connection deleted:", connection);
  },
});
```

## Closing Vault Programmatically

```typescript
ApideckVault.close();
```

## Full Integration Example

### Server-side (Node.js / Express)

```typescript
import express from "express";
import { Apideck } from "@apideck/unify";

const app = express();

const apideck = new Apideck({
  apiKey: process.env["APIDECK_API_KEY"] ?? "",
  appId: process.env["APIDECK_APP_ID"] ?? "",
  consumerId: "", // set per-request
});

// Create a Vault session for the authenticated user
app.post("/api/vault/session", async (req, res) => {
  const userId = req.user.id; // from your auth middleware

  const client = new Apideck({
    apiKey: process.env["APIDECK_API_KEY"] ?? "",
    appId: process.env["APIDECK_APP_ID"] ?? "",
    consumerId: userId,
  });

  const { data } = await client.vault.sessions.create({
    session: {
      consumer_metadata: {
        account_name: req.user.company_name,
        user_name: req.user.name,
        email: req.user.email,
      },
      redirect_uri: `${process.env["APP_URL"]}/integrations`,
      settings: {
        unified_apis: ["accounting", "crm", "hris"],
      },
      theme: {
        vault_name: "My App",
        primary_color: "#4F46E5",
      },
    },
  });

  res.json({ token: data.session_token });
});
```

### Client-side (Vanilla JS)

```typescript
import { ApideckVault } from "@apideck/vault-js";

async function openVault() {
  // Fetch session token from your backend
  const response = await fetch("/api/vault/session", { method: "POST" });
  const { token } = await response.json();

  ApideckVault.open({
    token,
    onReady: () => console.log("Vault opened"),
    onClose: () => console.log("Vault closed"),
    onConnectionChange: (connection) => {
      console.log(`${connection.service_id} is now ${connection.state}`);
      // Refresh your integrations list
      loadIntegrations();
    },
    onConnectionDelete: (connection) => {
      console.log(`${connection.service_id} disconnected`);
      loadIntegrations();
    },
  });
}

document.getElementById("manage-integrations")
  ?.addEventListener("click", openVault);
```

### Client-side (React)

```tsx
import { ApideckVault } from "@apideck/vault-js";
import { useCallback, useState } from "react";

function IntegrationsButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenVault = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/vault/session", { method: "POST" });
      const { token } = await response.json();

      ApideckVault.open({
        token,
        onReady: () => setIsLoading(false),
        onClose: () => console.log("Vault closed"),
        onConnectionChange: (connection) => {
          console.log("Connection changed:", connection);
        },
      });
    } catch (error) {
      console.error("Failed to create Vault session:", error);
      setIsLoading(false);
    }
  }, []);

  return (
    <button onClick={handleOpenVault} disabled={isLoading}>
      {isLoading ? "Loading..." : "Manage Integrations"}
    </button>
  );
}
```

## Filtering by API or Connector

```typescript
// Show only accounting integrations
ApideckVault.open({
  token: "SESSION_TOKEN",
  unifiedApi: "accounting",
});

// Open directly to QuickBooks settings
ApideckVault.open({
  token: "SESSION_TOKEN",
  serviceId: "quickbooks",
  initialView: "settings",
});

// Open custom field mapping for Salesforce
ApideckVault.open({
  token: "SESSION_TOKEN",
  serviceId: "salesforce",
  initialView: "custom-mapping",
});
```

## Theming

Theme customization is set during session creation on the server side:

```typescript
const { data } = await apideck.vault.sessions.create({
  session: {
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
```

| Theme Property | Description |
|----------------|-------------|
| `vault_name` | Display name shown in the modal header |
| `primary_color` | Primary accent color (hex) |
| `sidepanel_background_color` | Side panel background (hex) |
| `sidepanel_text_color` | Side panel text color (hex) |
| `favicon` | URL to your favicon |
| `logo` | URL to your logo image |
