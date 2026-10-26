# API reference

These links describe each service's API. Central, Cargo, WG Mesh, the IPv6 router, Grove, FrappeMail and Insights have no separate API reference. Use their [integration contracts](#integration-contracts) and source.

## Available documentation

| Service or interface | API docs |
| --- | --- |
| Atlas | [Atlas API](https://frappe.github.io/atlas/api/atlas/) |
| Metal | [Metal API](https://frappe.github.io/atlas/api/metal/) |
| Regional HTTP proxy | [Proxy control API](https://frappe.github.io/atlas/api/http-proxy/) |
| WireGuard gateway | [Gateway API](https://frappe.github.io/atlas/api/wg-gateway/) |
| Pilot | [Admin API guide](https://github.com/frappe/pilot/blob/develop/docs/admin-api.md) |
| Garage | [Upstream administration API v2](https://garagehq.deuxfleurs.fr/api/garage-admin-v2.html) |
| Datum | [Endpoint guide](https://github.com/frappe/datum#endpoints) |
| ClickHouse | [Upstream HTTP interface](https://clickhouse.com/docs/interfaces/http) |

Pilot has a written guide. Datum lists its endpoints and deployed reference paths. Atlas publishes a generated API reference.

## References on a deployment

| Service | Path relative to its base URL |
| --- | --- |
| Atlas | `/api/atlas/docs` |
| Datum | `/docs` |
| Datum OpenAPI document | `/v1/openapi.json` |

Use the intended deployment's base URL and its required credentials. The public Atlas handbook provides reference schemas, rather than a customer control endpoint.

## Integration contracts

[Central integrations](https://github.com/frappe/central/blob/develop/spec/INTEGRATIONS.md), [Cargo buckets](https://github.com/frappe/cargo/blob/develop/docs/central-contract.md) and [Cargo's Atlas contract](https://github.com/frappe/cargo/blob/develop/docs/atlas-contract.md) describe service handoffs.

They complement the API references. The [service access matrix](./token-validation.md#service-access-matrix) describes which callers may use each interface.
