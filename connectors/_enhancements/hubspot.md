## HubSpot via Apideck CRM

HubSpot is Apideck's most-installed SMB CRM connector. Strong coverage for contacts, companies, deals (opportunities), and activities.

### Entity mapping

| HubSpot entity | Apideck CRM resource |
|---|---|
| Contact | `contacts` |
| Company | `companies` |
| Deal | `opportunities` |
| Engagement (email, call, meeting, note, task) | `activities` / `notes` |
| Pipeline / Deal Stage | `pipelines` |
| Owner | `users` |
| Custom properties | `custom_fields[]` |
| Lists (static/dynamic) | not in unified API — use Proxy |

### Coverage highlights

- ✅ Full CRUD on contacts, companies, deals
- ✅ Activity engagements (reads and writes)
- ✅ Custom properties surfaced as `custom_fields[]`
- ✅ Associations (contact → company, deal → contact) exposed as ID references
- ⚠️ HubSpot Marketing Hub (forms, workflows, campaigns) — not in CRM unified; use Proxy
- ❌ HubSpot Lists API — use Proxy with `/crm/v3/lists`
- ❌ HubSpot Timeline events — use Proxy

### HubSpot auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Scopes:** Apideck Vault requests the CRM scopes needed for objects and associations. Exact scope set is configured in the Vault app.
- **Portal binding:** each connection is bound to one HubSpot portal (`hubId`). Multi-portal = multi-connection.
- **API limits:** HubSpot enforces per-portal daily and 10-second burst limits. Apideck respects 429 with backoff.

### Example: list open deals with pipeline and owner

```typescript
const { data } = await apideck.crm.opportunities.list({
  serviceId: "hubspot",
  filter: { status: "open" },
  fields: "id,name,amount,close_date,pipeline,owner_id,company_id",
});
```

### Example: create a contact with associations

```typescript
const { data } = await apideck.crm.contacts.create({
  serviceId: "hubspot",
  contact: {
    first_name: "Alex",
    last_name: "Rivera",
    emails: [{ email: "alex@example.com", type: "primary" }],
    company_id: "hs_company_123",
  },
});
```
