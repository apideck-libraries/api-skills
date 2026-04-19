## Salesforce via Apideck CRM

Salesforce is the reference implementation for Apideck CRM. All Tier 1 CRM resources are supported; coverage is the most complete of any CRM connector.

### Entity mapping

| Salesforce object | Apideck CRM resource |
|---|---|
| Contact | `contacts` |
| Account | `companies` |
| Lead | `leads` |
| Opportunity | `opportunities` |
| Task, Event | `activities` |
| User | `users` |
| Note (Task with note body) | `notes` |
| OpportunityStage / pipeline config | `pipelines` |
| Custom objects (`*__c`) | use Proxy API — not exposed through unified resources |

### Coverage highlights

- ✅ Full CRUD on contacts, companies, leads, opportunities, activities, notes
- ✅ Pagination via cursor (Apideck normalizes SOQL `LIMIT` / `OFFSET` into cursor tokens)
- ✅ Field-level filtering via `filter[...]` query params
- ✅ Deep pagination beyond 2,000 records (Apideck uses `queryMore` / `nextRecordsUrl` under the hood)
- ❌ Custom objects — use Proxy API with the SOQL endpoint
- ❌ Apex REST endpoints — Proxy API
- ❌ Bulk API (2.0) job creation — Proxy API

### Salesforce-specific auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Sandbox vs. production:** the user picks environment during the Vault OAuth flow. The same `serviceId` routes to both; connection is bound to whichever was chosen.
- **API daily limits:** Salesforce enforces per-org daily API call limits based on edition (Professional/Enterprise/Unlimited). Apideck surfaces Salesforce's remaining-limit headers via `raw=true` — monitor these for high-volume integrations. Hitting the daily limit means API calls fail until the 24h rolling window resets.

### Common Salesforce quirks handled by Apideck

- **Compound fields** (e.g., `BillingAddress`) — flattened to `address.*` in the unified shape
- **Picklist values** — exposed verbatim; no enum normalization
- **Record types** — available as `record_type_id` on writes; if omitted Salesforce uses the default for the user's profile
- **Polymorphic references** (e.g., `WhoId` on Task) — Apideck resolves to the correct entity type in `activity.owner_id`

### Example: create an opportunity with a contact role

```typescript
// 1. Create the opportunity
const { data: opp } = await apideck.crm.opportunities.create({
  serviceId: "salesforce",
  opportunity: {
    name: "Acme — Enterprise deal",
    amount: 50000,
    close_date: "2026-06-30",
    stage: "Qualification",
    company_id: "001XXXXXXXXXXXXXXX",
  },
});

// 2. For contact roles (Salesforce-specific), use Proxy
await fetch("https://unify.apideck.com/proxy", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.APIDECK_API_KEY}`,
    "x-apideck-app-id": process.env.APIDECK_APP_ID,
    "x-apideck-consumer-id": consumerId,
    "x-apideck-service-id": "salesforce",
    "x-apideck-downstream-url": "/services/data/v59.0/sobjects/OpportunityContactRole",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    OpportunityId: opp.data.id,
    ContactId: "003XXXXXXXXXXXXXXX",
    Role: "Decision Maker",
  }),
});
```
