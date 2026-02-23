# Webhook API Reference

Base namespace: `apideck.webhook`

Apideck supports both **native webhooks** (from connectors that support them natively) and **virtual webhooks** (Apideck polls the connector and delivers events to your webhook URL).

## Webhook Subscriptions

```typescript
// List webhooks
const { data } = await apideck.webhook.webhooks.list();

// Create webhook subscription
const { data } = await apideck.webhook.webhooks.create({
  webhook: {
    description: "CRM contact changes",
    unified_api: "crm",
    status: "enabled",
    delivery_url: "https://myapp.com/webhooks/apideck",
    events: [
      "crm.contact.created",
      "crm.contact.updated",
      "crm.contact.deleted",
    ],
  },
});

// Get webhook
const { data } = await apideck.webhook.webhooks.get({
  id: "webhook_123",
});

// Update webhook
const { data } = await apideck.webhook.webhooks.update({
  id: "webhook_123",
  webhook: {
    description: "All CRM changes",
    events: [
      "crm.contact.created",
      "crm.contact.updated",
      "crm.contact.deleted",
      "crm.company.created",
      "crm.company.updated",
      "crm.lead.created",
    ],
  },
});

// Delete webhook
await apideck.webhook.webhooks.delete({
  id: "webhook_123",
});
```

## Webhook Event Types

Events follow the pattern `{unified_api}.{resource}.{action}`:

### Accounting
- `accounting.invoice.created` / `.updated` / `.deleted`
- `accounting.bill.created` / `.updated` / `.deleted`
- `accounting.payment.created` / `.updated` / `.deleted`
- `accounting.customer.created` / `.updated` / `.deleted`
- `accounting.supplier.created` / `.updated` / `.deleted`
- `accounting.ledger-account.created` / `.updated` / `.deleted`
- `accounting.journal-entry.created` / `.updated` / `.deleted`
- `accounting.credit-note.created` / `.updated` / `.deleted`
- `accounting.expense.created` / `.updated` / `.deleted`

### CRM
- `crm.contact.created` / `.updated` / `.deleted`
- `crm.company.created` / `.updated` / `.deleted`
- `crm.lead.created` / `.updated` / `.deleted`
- `crm.opportunity.created` / `.updated` / `.deleted`
- `crm.activity.created` / `.updated` / `.deleted`
- `crm.note.created` / `.updated` / `.deleted`

### HRIS
- `hris.employee.created` / `.updated` / `.deleted` / `.terminated`
- `hris.department.created` / `.updated` / `.deleted`
- `hris.company.created` / `.updated` / `.deleted`

### File Storage
- `file-storage.file.created` / `.updated` / `.deleted`
- `file-storage.folder.created` / `.updated` / `.deleted`

### ATS
- `ats.applicant.created` / `.updated` / `.deleted`
- `ats.application.created` / `.updated` / `.deleted`
- `ats.job.created` / `.updated` / `.deleted`

## Webhook Payload Format

```json
{
  "payload": {
    "event_type": "crm.contact.updated",
    "unified_api": "crm",
    "service_id": "salesforce",
    "consumer_id": "user_abc123",
    "entity_id": "contact_123",
    "entity_type": "contact",
    "entity_url": "https://unify.apideck.com/crm/contacts/contact_123",
    "occurred_at": "2024-06-15T10:30:00.000Z"
  }
}
```

## Webhook Signature Verification

Verify webhook signatures to ensure requests are from Apideck:

```typescript
import crypto from "crypto";

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("base64");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// In your webhook handler
app.post("/webhooks/apideck", (req, res) => {
  const signature = req.headers["x-apideck-signature"] as string;
  const isValid = verifyWebhookSignature(
    JSON.stringify(req.body),
    signature,
    process.env.APIDECK_WEBHOOK_SECRET!
  );
  if (!isValid) {
    return res.status(401).send("Invalid signature");
  }
  // Process event
  const { event_type, entity_id, service_id } = req.body.payload;
  console.log(`Received ${event_type} for ${entity_id} from ${service_id}`);
  res.status(200).send("OK");
});
```

## Event Logs

```typescript
// List webhook event logs
const { data } = await apideck.webhook.eventLogs.list({
  filter: {
    exclude_apis: "vault,proxy",
    service: { id: "salesforce" },
    consumer_id: "user_abc123",
    entity_type: "contact",
    event_type: "crm.contact.updated",
  },
});
// Returns: event delivery status, attempts, request/response details
```
