## Pipedrive via Apideck CRM

Pipedrive is a sales-pipeline-focused CRM. Apideck maps its deal-centric model to the unified CRM API.

### Entity mapping

| Pipedrive entity | Apideck CRM resource |
|---|---|
| Person | `contacts` |
| Organization | `companies` |
| Deal | `opportunities` |
| Activity | `activities` |
| Note | `notes` |
| Stage / Pipeline | `pipelines` |
| Custom fields | `custom_fields[]` |
| Lead (pre-deal) | `leads` |

### Coverage highlights

- ✅ Full CRUD on persons, organizations, deals, activities
- ✅ Pipeline and stage metadata
- ✅ Custom fields as `custom_fields[]`
- ⚠️ Products (line items on deals) — partial coverage; use Proxy for full product catalog

### Auth

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Company binding:** each connection is bound to one Pipedrive company. Multi-company = multi-connection.
- **API limits:** Pipedrive enforces per-company rate limits; Apideck backs off on 429.

### Example: list deals in a specific pipeline

```typescript
const { data } = await apideck.crm.opportunities.list({
  serviceId: "pipedrive",
  filter: { pipeline_id: "pipeline_1" },
});
```
