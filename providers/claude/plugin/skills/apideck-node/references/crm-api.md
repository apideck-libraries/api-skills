# CRM API Reference

Base namespace: `apideck.crm`

Supported connectors: Salesforce, HubSpot, Pipedrive, Microsoft Dynamics 365, Zoho CRM, Close, Copper, Freshsales, and 15+ more.

## Contacts

```typescript
// List contacts with filtering and sorting
const { data } = await apideck.crm.contacts.list({
  serviceId: "salesforce",
  limit: 50,
  filter: {
    name: "John",
    email: "john@example.com",
    phone_number: "+1234567890",
    company_id: "company_123",
    owner_id: "user_456",
    first_name: "John",
    last_name: "Doe",
  },
  sort: { by: "updated_at", direction: "desc" },
});

// Create contact
const { data } = await apideck.crm.contacts.create({
  serviceId: "salesforce",
  contact: {
    first_name: "John",
    last_name: "Doe",
    title: "VP of Engineering",
    department: "Engineering",
    company_id: "company_123",
    emails: [
      { email: "john@example.com", type: "primary" },
      { email: "john.doe@personal.com", type: "secondary" },
    ],
    phone_numbers: [
      { number: "+1234567890", type: "mobile" },
    ],
    addresses: [
      {
        type: "primary",
        street_1: "123 Main St",
        city: "San Francisco",
        state: "CA",
        postal_code: "94105",
        country: "US",
      },
    ],
    social_links: [
      { url: "https://linkedin.com/in/johndoe", type: "linkedin" },
    ],
    tags: ["vip", "enterprise"],
    custom_fields: [
      { id: "lead_source", value: "Website" },
    ],
  },
});

// Get contact
const { data } = await apideck.crm.contacts.get({
  id: "contact_123",
  serviceId: "salesforce",
});

// Update contact
const { data } = await apideck.crm.contacts.update({
  id: "contact_123",
  serviceId: "salesforce",
  contact: { title: "CTO" },
});

// Delete contact
await apideck.crm.contacts.delete({
  id: "contact_123",
  serviceId: "salesforce",
});
```

Key contact fields: `id`, `name`, `first_name`, `last_name`, `title`, `department`, `company_id`, `company_name`, `emails[]`, `phone_numbers[]`, `addresses[]`, `social_links[]`, `tags[]`, `owner_id`, `lead_source`, `description`, `custom_fields[]`, `created_at`, `updated_at`.

## Companies

```typescript
// List companies
const { data } = await apideck.crm.companies.list({
  serviceId: "hubspot",
  filter: { name: "Acme" },
  sort: { by: "name", direction: "asc" },
});

// Create company
const { data } = await apideck.crm.companies.create({
  serviceId: "hubspot",
  company: {
    name: "Acme Corporation",
    industry: "Technology",
    website: "https://acme.com",
    annual_revenue: "10000000",
    number_of_employees: "500",
    emails: [{ email: "info@acme.com", type: "primary" }],
    phone_numbers: [{ number: "+1234567890", type: "primary" }],
    addresses: [
      {
        type: "primary",
        street_1: "456 Tech Blvd",
        city: "San Francisco",
        state: "CA",
        postal_code: "94105",
        country: "US",
      },
    ],
  },
});
```

Key company fields: `id`, `name`, `industry`, `website`, `annual_revenue`, `number_of_employees`, `owner_id`, `emails[]`, `phone_numbers[]`, `addresses[]`, `social_links[]`, `tags[]`, `description`, `custom_fields[]`.

## Leads

```typescript
// List leads
const { data } = await apideck.crm.leads.list({
  serviceId: "salesforce",
  filter: { email: "lead@example.com", name: "Jane" },
});

// Create lead
const { data } = await apideck.crm.leads.create({
  serviceId: "salesforce",
  lead: {
    name: "Jane Smith",
    first_name: "Jane",
    last_name: "Smith",
    company_name: "Startup Inc",
    title: "CEO",
    emails: [{ email: "jane@startup.com", type: "primary" }],
    phone_numbers: [{ number: "+1987654321", type: "mobile" }],
    lead_source: "Webinar",
    monetary_amount: 50000,
    currency: "USD",
  },
});

// Convert lead (connector-specific, use pass-through)
const { data } = await apideck.crm.leads.update({
  id: "lead_123",
  serviceId: "salesforce",
  lead: {
    pass_through: [
      {
        service_id: "salesforce",
        extend_object: { Status: "Converted" },
      },
    ],
  },
});
```

## Opportunities

```typescript
// List opportunities
const { data } = await apideck.crm.opportunities.list({
  serviceId: "pipedrive",
  filter: { status: "open" },
});

// Create opportunity
const { data } = await apideck.crm.opportunities.create({
  serviceId: "pipedrive",
  opportunity: {
    title: "Enterprise deal - Acme Corp",
    primary_contact_id: "contact_123",
    company_id: "company_456",
    pipeline_id: "pipeline_789",
    stage_id: "stage_negotiation",
    status: "open",
    monetary_amount: 150000,
    currency: "USD",
    win_probability: 60,
    close_date: "2024-09-30",
    owner_id: "user_123",
  },
});

// Update opportunity stage
const { data } = await apideck.crm.opportunities.update({
  id: "opportunity_123",
  serviceId: "pipedrive",
  opportunity: {
    stage_id: "stage_closed_won",
    status: "won",
    win_probability: 100,
  },
});
```

Key opportunity fields: `id`, `title`, `primary_contact_id`, `company_id`, `pipeline_id`, `stage_id`, `status` (`open` | `won` | `lost`), `monetary_amount`, `currency`, `win_probability`, `close_date`, `owner_id`, `priority`, `tags[]`.

## Activities

```typescript
// List activities
const { data } = await apideck.crm.activities.list({
  serviceId: "salesforce",
});

// Create activity (call, meeting, email, task, etc.)
const { data } = await apideck.crm.activities.create({
  serviceId: "salesforce",
  activity: {
    type: "call",
    title: "Follow-up call with Acme",
    description: "Discuss contract renewal",
    activity_date: "2024-07-01T10:00:00.000Z",
    duration_seconds: 1800,
    owner_id: "user_123",
    contact_id: "contact_456",
    company_id: "company_789",
  },
});
```

Activity types: `call`, `meeting`, `email`, `note`, `task`, `deadline`, `send_letter`, `send_quote`, `other`.

## Notes

```typescript
// List notes
const { data } = await apideck.crm.notes.list({
  serviceId: "hubspot",
});

// Create note
const { data } = await apideck.crm.notes.create({
  serviceId: "hubspot",
  note: {
    title: "Meeting summary",
    content: "Discussed Q3 renewal. Client interested in premium tier.",
    contact_id: "contact_123",
    company_id: "company_456",
    opportunity_id: "opportunity_789",
  },
});
```

## Pipelines

```typescript
// List pipelines
const { data } = await apideck.crm.pipelines.list({
  serviceId: "pipedrive",
});
// Returns: id, name, stages[{ id, name, display_order }], currency

// Get pipeline with stages
const { data } = await apideck.crm.pipelines.get({
  id: "pipeline_123",
  serviceId: "pipedrive",
});
```

## Users

```typescript
const { data } = await apideck.crm.users.list({
  serviceId: "salesforce",
});
// Returns CRM users: id, name, email, role, status
```
