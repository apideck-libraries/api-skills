## Visma Netvisor via Apideck Accounting

Visma Netvisor is a Finnish financial management platform under the Visma Group, popular with Finnish SMBs and service businesses.

### Entity mapping

| Netvisor entity | Apideck Accounting resource |
|---|---|
| Sales Invoice | `invoices` |
| Purchase Invoice | `bills` |
| Customer | `customers` |
| Supplier | `suppliers` |
| Credit Note | `credit-notes` |
| Payment | `payments` |
| Item | `invoice-items` |
| Purchase Order | `purchase-orders` |
| Journal | `journal-entries` |

### Coverage highlights

- ✅ Sales and purchase invoices
- ✅ Customers, suppliers
- ✅ Credit notes, payments
- ✅ Purchase orders
- ✅ Journal entries
- ✅ Finnish VAT
- ❌ Finnish-specific regulatory submissions — use Proxy
- ❌ Payroll — separate Visma product

### Auth notes

- **Type:** Custom (Netvisor-specific signed-request auth), managed by Apideck Vault
- **Company binding:** one Netvisor company per connection. Netvisor identifies companies via Business ID (Y-tunnus).
- **Sender credentials:** Apideck's Vault app handles sender key rotation; end-user provides their Netvisor partner credentials.
- **Finnish compliance:** Netvisor is certified for Finnish accounting standards (Kirjanpitolaki).

### Example: list open invoices

```typescript
const { data } = await apideck.accounting.invoices.list({
  serviceId: "visma-netvisor",
  filter: { status: "open" },
});
```
