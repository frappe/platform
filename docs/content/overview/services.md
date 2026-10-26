# Services and responsibilities

Cloud v2 divides work between customer account services, regional infrastructure and the runtime inside each VM. Each component owns a defined part of that work.

## Account and infrastructure

| Component | Responsibility |
| --- | --- |
| Central | Accounts, teams, permissions, billing and customer resource requests. |
| Atlas | A region's VM records, host selection and infrastructure changes. |
| Metal | Firecracker VM execution, ZFS disks, local images and state reporting on each physical host. |
| WG Mesh | Private VM traffic, encrypted host tunnels and tenant network boundaries. |

For a resize, Central checks the customer's permission. Atlas coordinates the regional change. Metal applies the host operation.

Atlas manages both raw and Pilot VMs. Metal is a host program. WG Mesh is host network code. The components do not all share one deployment model.

## App preparation and runtime

**Cargo** builds app images before signup. It requests machines and snapshots from Atlas. It also provisions Garage and the regional Datum host. Atlas installs Cargo itself on a service VM, and Cargo runs as a Frappe app on that VM's Pilot.

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

Regional service VMs use the same Metal infrastructure as customer VMs, under service tenant `0`.

- **Atlas creates** the HTTP proxy, Cargo, IPv6 router and WireGuard gateway.
- **Cargo creates**, through Atlas, the Garage gateway and storage nodes and the Datum host.

The proxy and Cargo are **privileged** VMs: WG Mesh lets them reach VMs in other tenants. Other VMs cannot cross tenant boundaries.

Atlas also stores image artifacts in its own Garage bucket, created through Cargo. Metal downloads them through signed URLs.

Network reach does not replace API permission. [Authentication](../trust/authentication.md) explains the checks on each request.

## Other connected services

Some product features use services outside the VM request path. These integrations do not imply a deployment in every VM region.

- **Grove** provides AI models, keys and limits. Central links them to a team. AI geography is separate from VM region.
- **FrappeMail** supplies outgoing mail accounts where configured. Central delivers the server's mail settings.
- **Insights** reads telemetry through a separate read-only ClickHouse account. A Datum write token does not grant read access.

The owning contracts cover [Atlas networking](https://github.com/frappe/atlas/blob/develop/docs/networking/index.md), [Central integrations](https://github.com/frappe/central/blob/develop/spec/INTEGRATIONS.md) and [AI services](https://github.com/frappe/central/blob/develop/central/services/doctype/ai_settings/SPEC.md).
