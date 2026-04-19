## Zoho CRM via Apideck

Zoho CRM is a popular CRM in the SMB and international market. Apideck covers the core modules.

### Entity mapping

| Zoho CRM module | Apideck CRM resource |
|---|---|
| Contacts | `contacts` |
| Accounts | `companies` |
| Leads | `leads` |
| Deals | `opportunities` |
| Tasks, Events, Calls | `activities` |
| Notes | `notes` |
| Pipeline / Stage | `pipelines` |
| Custom modules | use Proxy |

### Coverage highlights

- ✅ Full CRUD on contacts, accounts, leads, deals
- ✅ Activities (tasks, events, calls) as unified `activities`
- ⚠️ Custom modules and custom layouts — not in unified; use Proxy
- ❌ Zoho CRM Plus (analytics, projects) — separate products; not covered here

### Auth

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Data center:** Zoho is region-sharded (US, EU, IN, AU, CN, JP). The user's data center is determined during OAuth. If writes hit a "wrong DC" error, the connection needs re-authorization.
- **API limits:** Zoho enforces per-org credit-based rate limits. Apideck backs off on 429.

### Example: list deals sorted by close date

```typescript
const { data } = await apideck.crm.opportunities.list({
  serviceId: "zoho-crm",
  sort: { by: "close_date", direction: "asc" },
});
```
