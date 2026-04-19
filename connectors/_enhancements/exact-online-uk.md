## Exact Online UK via Apideck Accounting

UK-specific variant of Exact Online. Use this connector when the user's Exact instance is on the UK data center. Coverage mirrors [`exact-online`](../exact-online/).

### When to use this vs `exact-online`

| User scenario | Use |
|---|---|
| User's division is in the UK | `exact-online-uk` |
| User's division is in the Netherlands | `exact-online-nl` |
| User's division is in Belgium or other EU | `exact-online` |

### Entity mapping + coverage

Identical to [`exact-online`](../exact-online/). See that skill for the full mapping table and coverage highlights.

Key UK-specific behaviors:
- **VAT handling:** UK 20% / 5% / 0% rates; Brexit-era rules (reverse charge on EU imports) handled through `tax-rates`.
- **Making Tax Digital (MTD) compliance:** UK divisions may have MTD-specific fields on invoices (HMRC submission). Use Proxy for MTD submission endpoints not covered by the unified model.
- **Currency:** typically GBP-denominated; multi-currency supported for international customers.

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Data center:** `start.exactonline.co.uk`. Wrong-DC errors = wrong connector variant.

### Example: list customers with invoices due in 30 days

```typescript
const { data: invoices } = await apideck.accounting.invoices.list({
  serviceId: "exact-online-uk",
  filter: { status: "open" },
});
```
