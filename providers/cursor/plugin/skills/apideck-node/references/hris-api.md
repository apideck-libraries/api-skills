# HRIS API Reference

Base namespace: `apideck.hris`

Supported connectors: Workday, BambooHR, Hibob, SAP SuccessFactors, Personio, Gusto, Rippling, Deel, ADP, Namely, Payfit, and 40+ more.

## Employees

```typescript
// List employees
const { data } = await apideck.hris.employees.list({
  serviceId: "bamboohr",
  limit: 50,
  filter: {
    company_id: "company_123",
    department_id: "dept_456",
    employment_status: "active",
    manager_id: "emp_789",
    title: "Engineer",
  },
  sort: { by: "last_name", direction: "asc" },
});

// Create employee
const { data } = await apideck.hris.employees.create({
  serviceId: "bamboohr",
  employee: {
    first_name: "Alice",
    last_name: "Johnson",
    display_name: "Alice Johnson",
    gender: "female",
    birthday: "1990-05-15",
    emails: [{ email: "alice@company.com", type: "work" }],
    phone_numbers: [{ number: "+1234567890", type: "mobile" }],
    addresses: [
      {
        type: "primary",
        street_1: "789 Oak Ave",
        city: "Austin",
        state: "TX",
        postal_code: "73301",
        country: "US",
      },
    ],
    employment_status: "active",
    employment_role: { type: "employee", sub_type: "full_time" },
    department_id: "dept_engineering",
    title: "Senior Software Engineer",
    manager: { id: "emp_manager_123" },
    start_date: "2024-03-01",
    compensations: [
      {
        rate: 150000,
        payment_unit: "year",
        currency: "USD",
        effective_date: "2024-03-01",
      },
    ],
  },
});

// Get employee
const { data } = await apideck.hris.employees.get({
  id: "emp_123",
  serviceId: "bamboohr",
});

// Update employee
const { data } = await apideck.hris.employees.update({
  id: "emp_123",
  serviceId: "bamboohr",
  employee: {
    title: "Staff Software Engineer",
    compensations: [
      {
        rate: 175000,
        payment_unit: "year",
        currency: "USD",
        effective_date: "2025-01-01",
      },
    ],
  },
});

// Delete employee
await apideck.hris.employees.delete({
  id: "emp_123",
  serviceId: "bamboohr",
});
```

Key employee fields: `id`, `first_name`, `last_name`, `display_name`, `title`, `department_id`, `department`, `company_id`, `company_name`, `employment_status` (`active` | `inactive` | `terminated`), `employment_role`, `manager`, `start_date`, `termination_date`, `birthday`, `gender`, `emails[]`, `phone_numbers[]`, `addresses[]`, `jobs[]`, `compensations[]`, `teams[]`, `social_links[]`, `custom_fields[]`.

Employment role types: `employee`, `contractor`. Sub-types: `full_time`, `part_time`, `intern`, `freelance`, `temp`, `seasonal`.

## Departments

```typescript
// List departments
const { data } = await apideck.hris.departments.list({
  serviceId: "bamboohr",
});

// Create department
const { data } = await apideck.hris.departments.create({
  serviceId: "bamboohr",
  department: {
    name: "Product Engineering",
    code: "PROD-ENG",
    parent_id: "dept_engineering",
  },
});
```

## Companies

```typescript
// List HRIS companies (for multi-entity organizations)
const { data } = await apideck.hris.companies.list({
  serviceId: "bamboohr",
});

// Get company details
const { data } = await apideck.hris.companies.get({
  id: "company_123",
  serviceId: "bamboohr",
});
// Returns: legal_name, display_name, status, addresses, phone_numbers, ein (tax ID)
```

## Payrolls

```typescript
// List payrolls
const { data } = await apideck.hris.payrolls.list({
  serviceId: "gusto",
  filter: {
    start_date: "2024-01-01",
    end_date: "2024-01-31",
  },
});

// Get specific payroll
const { data } = await apideck.hris.payrolls.get({
  payrollId: "payroll_123",
  serviceId: "gusto",
});
// Returns: id, processed_date, check_date, totals (gross_pay, net_pay, total_tax, total_deductions)
```

## Employee Payrolls

```typescript
// List employee payrolls for a specific employee
const { data } = await apideck.hris.employeePayrolls.list({
  employeeId: "emp_123",
  serviceId: "gusto",
});
// Returns per-employee: gross_pay, net_pay, taxes[], deductions[], compensations[]
```

## Time-Off Requests

```typescript
// List time-off requests
const { data } = await apideck.hris.timeOffRequests.list({
  serviceId: "bamboohr",
  filter: {
    employee_id: "emp_123",
    start_date: "2024-06-01",
    end_date: "2024-06-30",
  },
});

// Create time-off request
const { data } = await apideck.hris.timeOffRequests.create({
  serviceId: "bamboohr",
  timeOffRequest: {
    employee_id: "emp_123",
    policy_id: "policy_pto",
    start_date: "2024-07-15",
    end_date: "2024-07-19",
    status: "requested",
    request_type: "vacation",
    notes: { employee: "Family vacation" },
  },
});

// Update time-off request (approve/deny)
const { data } = await apideck.hris.timeOffRequests.update({
  id: "time_off_123",
  serviceId: "bamboohr",
  timeOffRequest: {
    status: "approved",
    notes: { manager: "Approved. Enjoy!" },
  },
});
```

Time-off statuses: `requested`, `approved`, `declined`, `cancelled`, `deleted`.
Request types: `vacation`, `sick`, `personal`, `jury_duty`, `volunteer`, `bereavement`.

## Employee Schedules

```typescript
// List employee schedules
const { data } = await apideck.hris.employeeSchedules.list({
  employeeId: "emp_123",
  serviceId: "bamboohr",
});
// Returns weekly schedule patterns with work days and hours
```
