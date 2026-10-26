---
tableFirstCol: 10rem
---

# Services and responsibilities

Cloud v2 divides work between customer account services, regional infrastructure and the runtime inside each VM. Each component owns a defined part of that work.

## Account and infrastructure

| Component | Responsibility |
| --- | --- |
| Central | Accounts, teams, permissions, billing and customer resource requests. |
| Atlas | A region's VM records, host selection and infrastructure changes. |
| Metal | VM execution and state reporting on each physical host. |
| WG Mesh | Private VM traffic, encrypted host tunnels and tenant network boundaries. |

For a resize, Central checks the customer's permission. Atlas coordinates the regional change. Metal applies the host operation.

Atlas manages both raw and Pilot VMs. Metal is a host program. WG Mesh is host network code. The components do not all share one deployment model.

## App preparation and runtime

**Cargo** builds app images before signup. It requests machines and snapshots from Atlas. It also manages regional services such as Garage.

**Pilot** runs inside a Pilot VM. It manages benches, sites, apps, local tasks and backups. Frappe sites use its site-scoped APIs.

Cargo prepares reusable runtime. Pilot manages the running customer's copy. [App images](../regional/images.md) and [bootstrap](../journeys/bootstrap.md) connect these stages.

## Regional traffic and data

| Component | Responsibility |
| --- | --- |
| HTTP proxy | Route public app requests to the correct VM. |
| Garage | Store objects through an S3-compatible interface. |
| Datum | Receive metrics and logs and write them to ClickHouse. |
| ClickHouse | Store telemetry for tools with separate read credentials. |
| IPv6 router | Connect public IPv6 traffic to private VM mesh addresses. |
| WireGuard gateway | Connect authorized customer devices to their tenant's VMs. |

The proxy reaches a VM through WG Mesh. The VM's nginx selects the site. A VM keeps its mesh address when it moves between physical hosts.

Regional service VMs use the same Metal infrastructure as customer VMs, under service tenant `0`. Atlas explicitly grants network access to services that need to cross customer boundaries.

Network reach does not replace API permission. [Authentication](../trust/authentication.md) explains the checks on each request.

## Other connected services

Some product features use services outside the VM request path. These integrations do not imply a deployment in every VM region.

- **Grove** provides AI models, keys and limits. Central links them to a team. AI geography is separate from VM region.
- **FrappeMail** supplies outgoing mail accounts where configured. Central delivers the server's mail settings.
- **Insights** reads telemetry through a separate read-only ClickHouse account. A Datum write token does not grant read access.

The owning contracts cover [Atlas networking](https://github.com/frappe/atlas/blob/develop/docs/networking/index.md), [Central integrations](https://github.com/frappe/central/blob/develop/spec/INTEGRATIONS.md) and [AI services](https://github.com/frappe/central/blob/develop/central/services/doctype/ai_settings/SPEC.md).
