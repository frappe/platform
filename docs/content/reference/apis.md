# API reference

Links to each service's API reference. N/A means the service has no separate API reference. [Integration contracts](#integration-contracts) lists the contract pages that exist.

## API references

| Service or interface | API docs |
| --- | --- |
| Central | N/A |
| Atlas | [Atlas API](https://frappe.github.io/atlas/api/atlas/) |
| Metal | [Metal API](https://frappe.github.io/atlas/api/metal/) |
| Regional HTTP proxy | [Proxy control API](https://frappe.github.io/atlas/api/http-proxy/) |
| WireGuard gateway | [Gateway API](https://frappe.github.io/atlas/api/wg-gateway/) |
| Pilot | [Admin API guide](https://github.com/frappe/pilot/blob/develop/docs/admin-api.md) |
| Cargo | N/A |
| Garage | [Upstream administration API v2](https://garagehq.deuxfleurs.fr/api/garage-admin-v2.html) |
| Datum | [README, Endpoints section](https://github.com/frappe/datum#endpoints) |
| ClickHouse | [Upstream HTTP interface](https://clickhouse.com/docs/interfaces/http) |
| WG Mesh | N/A |
| IPv6 router | N/A |
| Grove | N/A |
| FrappeMail integration | N/A |
| Insights integration | N/A |

## References on a deployment

| Service | Path | What it serves |
| --- | --- | --- |
| Atlas | `/api/atlas/docs` | Interactive API reference |
| Atlas | `/api/atlas/docs/openapi.json` | Raw OpenAPI schema |
| Datum | `/docs` | Interactive API reference |
| Datum | `/v1/openapi.json` | Raw OpenAPI schema |

Add the path to the service's base URL, for example `https://atlas.example.com/api/atlas/docs`.

## Integration contracts

These pages describe how services call each other:

- [How Central integrates with Atlas, Pilot and Cargo](https://github.com/frappe/central/blob/develop/spec/INTEGRATIONS.md)
- [Webhooks that regions send to Central](https://github.com/frappe/central/blob/develop/spec/WEBHOOKS.md)
- [The Central and Cargo contract](https://github.com/frappe/cargo/blob/develop/docs/central-contract.md)
- [What Cargo needs from Atlas](https://github.com/frappe/cargo/blob/develop/docs/atlas-contract.md)

Use them together with the API references above. The [service access matrix](./token-validation.md#service-access-matrix) describes which callers may use each interface.
