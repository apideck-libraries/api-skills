## Exact Online NL via Apideck Accounting

Netherlands-specific variant of Exact Online, optimized for Dutch divisions and BTW (VAT) handling. Use this connector when the user's Exact instance is on the NL data center. Coverage mirrors [`exact-online`](../exact-online/) (same entities, same methods).

### When to use this vs `exact-online`

| User scenario | Use |
|---|---|
| User's division is in the Netherlands | `exact-online-nl` |
| User's division is in Belgium or a different EU market | `exact-online` |
| User's division is in the UK | `exact-online-uk` |
| Not sure | Ask the user; they know their Exact region |

### Entity mapping + coverage

Identical to [`exact-online`](../exact-online/). See that skill for the full mapping table and coverage highlights.

Key NL-specific behaviors:
- **BTW (VAT) handling:** Dutch 21%, 9%, 0% rates are surfaced via `tax-rates`; VAT on invoices is auto-computed based on customer type (binnenland/EU/buiten-EU).
- **SEPA integration:** bank reconciliation and direct debit integrations more common in NL; extra fields may surface on `payments`.
- **UBL e-invoicing:** mandatory for B2G invoicing in NL. Use Proxy for UBL-specific formatting endpoints.

### Auth notes

- **Type:** OAuth 2.0, managed by Apideck Vault
- **Data center:** `start.exactonline.nl`. Wrong-DC errors indicate the user picked the wrong variant at OAuth time — connection needs re-authorization against the correct variant.

### Example: list invoices updated today

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "exact-online-nl",
  filter: { updated_since: new Date(new Date().setHours(0,0,0,0)).toISOString() },
});
```
