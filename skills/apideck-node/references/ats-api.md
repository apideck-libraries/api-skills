# ATS API Reference

Base namespace: `apideck.ats`

Supported connectors: Greenhouse, Lever, Workable, Recruitee, Bullhorn, SAP SuccessFactors, Teamtailor, and more.

## Jobs

Jobs are read-only in the unified model.

```typescript
// List jobs
const { data } = await apideck.ats.jobs.list({
  serviceId: "greenhouse",
  limit: 50,
});

// Get job details
const { data } = await apideck.ats.jobs.get({
  id: "job_123",
  serviceId: "greenhouse",
});
```

Key job fields: `id`, `title`, `description`, `status` (`draft` | `open` | `closed`), `department`, `branch`, `recruiters[]`, `hiring_managers[]`, `addresses[]`, `confidential`, `salary`, `tags[]`, `created_at`, `updated_at`, `closing_date`.

## Applicants

```typescript
// List applicants
const { data } = await apideck.ats.applicants.list({
  serviceId: "greenhouse",
  limit: 50,
});

// Create applicant
const { data } = await apideck.ats.applicants.create({
  serviceId: "greenhouse",
  applicant: {
    first_name: "Sarah",
    last_name: "Chen",
    emails: [{ email: "sarah@example.com", type: "primary" }],
    phone_numbers: [{ number: "+1234567890", type: "mobile" }],
    title: "Senior Software Engineer",
    websites: [
      { url: "https://github.com/sarahchen", type: "github" },
      { url: "https://linkedin.com/in/sarahchen", type: "linkedin" },
    ],
    social_links: [
      { url: "https://twitter.com/sarahchen", type: "twitter" },
    ],
    tags: ["referral", "senior"],
  },
});

// Get applicant
const { data } = await apideck.ats.applicants.get({
  id: "applicant_123",
  serviceId: "greenhouse",
});

// Update applicant
const { data } = await apideck.ats.applicants.update({
  id: "applicant_123",
  serviceId: "greenhouse",
  applicant: {
    tags: ["referral", "senior", "fast-track"],
  },
});

// Delete applicant
await apideck.ats.applicants.delete({
  id: "applicant_123",
  serviceId: "greenhouse",
});
```

Key applicant fields: `id`, `first_name`, `last_name`, `name`, `title`, `emails[]`, `phone_numbers[]`, `addresses[]`, `websites[]`, `social_links[]`, `stage_id`, `recruiter_id`, `coordinator_id`, `applications[]`, `tags[]`, `sources[]`, `confidential`, `custom_fields[]`.

## Applications

```typescript
// List applications
const { data } = await apideck.ats.applications.list({
  serviceId: "greenhouse",
});

// Create application (link applicant to job)
const { data } = await apideck.ats.applications.create({
  serviceId: "greenhouse",
  application: {
    applicant_id: "applicant_123",
    job_id: "job_456",
    stage_id: "stage_phone_screen",
    status: "open",
  },
});

// Get application
const { data } = await apideck.ats.applications.get({
  id: "application_123",
  serviceId: "greenhouse",
});

// Update application (advance stage)
const { data } = await apideck.ats.applications.update({
  id: "application_123",
  serviceId: "greenhouse",
  application: {
    stage_id: "stage_onsite_interview",
  },
});

// Delete application
await apideck.ats.applications.delete({
  id: "application_123",
  serviceId: "greenhouse",
});
```

Key application fields: `id`, `applicant_id`, `job_id`, `status` (`open` | `rejected` | `hired`), `stage`, `current_stage`, `reject_reason`, `source`, `custom_fields[]`, `created_at`, `updated_at`.
