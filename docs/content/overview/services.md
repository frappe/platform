# Service responsibilities

Cloud v2 has services for customer accounts, regional infrastructure and software inside VMs. Each service has its own job.

## Infrastructure components

| Component | Responsibility |
| --- | --- |
| Central | Holds accounts, teams, permissions and billing, and accepts customer resource requests. |
| Atlas | Keeps a region's VM records, selects hosts and coordinates infrastructure changes. |
| Metal | Runs VMs and manages disks and images on each physical host. Returns host capacity and VM state to Atlas on each sync. |
| WG Mesh | Carries private VM traffic over encrypted host tunnels and enforces tenant network boundaries. |

For example, to resize a VM, the customer asks Central. Central checks their permission and billing, then asks Atlas to resize the VM. Atlas resizes it on its current host, or moves it to a host with enough capacity.

Atlas manages both raw and Pilot VMs. Metal and WG Mesh run on the physical hosts.

Metal uses Firecracker to run VMs and ZFS to manage disks.

## Image builds and runtime management

**Cargo** builds app images before signup. It requests machines and snapshots from Atlas. It also provisions Garage and the regional Datum host. Atlas installs Cargo itself on a service VM, and Cargo runs as a Frappe app on that VM's Pilot.

**Pilot** runs inside a Pilot VM. It manages benches, sites, apps, local tasks and backups. A Frappe site can call Pilot's admin API with a token limited to that site.

[App images](../regional/images.md) and [Pilot bootstrap](../journeys/bootstrap.md) explain how Cargo prepares the runtime and Pilot configures it for a customer.

## Networking, storage and telemetry

| Component | Responsibility |
| --- | --- |
| HTTP proxy | Route public app requests to the correct VM. |
| Garage | Store objects through an S3-compatible interface. |
| Datum | Receive metrics and logs and write them to ClickHouse. |
| ClickHouse | Store telemetry. It runs on the Datum host. Readers such as Insights use their own account. |
| IPv6 router | Connect public IPv6 traffic to private VM mesh addresses. |
| WireGuard gateway | Connect authorized customer devices to their tenant's VMs. |

The proxy reaches a VM through WG Mesh. The VM's nginx selects the site. A VM keeps its mesh address when it moves between physical hosts.

Regional service VMs use the same Metal infrastructure as customer VMs, under service tenant `0`. [Regional bootstrap](../regional/bootstrap.md) follows their setup order.

- **Atlas creates** the HTTP proxy, Cargo, IPv6 router and WireGuard gateway.
- **Cargo creates**, through Atlas, the Garage gateway and storage nodes and the Datum host.

The proxy, Cargo, IPv6 router and WireGuard gateway run on **privileged** service VMs. WG Mesh lets these VMs reach across tenant boundaries. Customer VMs do not receive this access.

Atlas keeps image files in a bucket on the regional Garage. Atlas asks Cargo to create the bucket. Metal downloads the files through signed URLs. During [regional bootstrap](../regional/bootstrap.md), before Garage exists, System images are public files on the Atlas site.

Network reach does not replace API permission. [Authentication](../trust/authentication.md) explains the checks on each request.

## Service integrations

Some product features use services outside the VM request path. These integrations do not imply a deployment in every VM region.

- **Grove** provides AI models, keys and limits. Central links them to a team. AI geography is separate from VM region.
- **FrappeMail** supplies outgoing mail accounts where configured. Central delivers the server's mail settings.
- **Insights** reads telemetry through a separate ClickHouse account. A Datum write token does not grant read access.

The owning contracts cover [Atlas networking](https://github.com/frappe/atlas/blob/develop/docs/networking/index.md), [Central integrations](https://github.com/frappe/central/blob/develop/spec/INTEGRATIONS.md) and [AI services](https://github.com/frappe/central/blob/develop/central/services/doctype/ai_settings/SPEC.md).
