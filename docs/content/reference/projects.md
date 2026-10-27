# Repositories

This page maps each repository to its responsibility, code entry points and docs. Each repository holds its own API details, setup commands and operating guides.

## Repository ownership

| Repository | Responsibility | Code entry points |
| --- | --- | --- |
| [Central](https://github.com/frappe/central) | Accounts, permissions, signup, billing, and the control plane for servers and sites. | `central/infrastructure/`, `central/signups/`, `central/billing/`, `central/integrations/`, `dashboard/` |
| [Atlas](https://github.com/frappe/atlas) | Regional VMs, hosts and networking. | `atlas/` (control app), `metal/` (host daemon), `services/` (network services) |
| [Pilot](https://github.com/frappe/pilot) | Benches, sites, local processes, tasks and backups. | `pilot/core/`, `pilot/integrations/central/`, `admin/backend/api/v1/` |
| [Cargo](https://github.com/frappe/cargo) | Pilot image builds, the Garage object storage cluster and the Datum host. | `cargo/image_builder/`, `cargo/object_storage/`, `cargo/telemetry/` |
| [Frappe](https://github.com/frappe/frappe) | Application framework for sites. Hosts the in-app Cloud Settings and billing clients. | `frappe/integrations/frappe_providers/` |

## Component documentation

### Central

The [specification index](https://github.com/frappe/central/blob/develop/spec/README.md) links to module contracts. Start with [integrations](https://github.com/frappe/central/blob/develop/spec/INTEGRATIONS.md) for service handoffs, [IAM](https://github.com/frappe/central/blob/develop/spec/IAM.md) for permissions or [SSO](https://github.com/frappe/central/blob/develop/spec/SSO.md) for login.

The [customer docs](https://frappe.github.io/central/) describe console use.

### Atlas

Start with [architecture](https://github.com/frappe/atlas/blob/develop/docs/start/architecture.md), then [a VM request](https://github.com/frappe/atlas/blob/develop/docs/start/how-a-vm-request-works.md). Use [networking](https://github.com/frappe/atlas/blob/develop/docs/networking/index.md), [signing keys](https://github.com/frappe/atlas/blob/develop/docs/interfaces/signing-keys.md) and the [code map](https://github.com/frappe/atlas/blob/develop/docs/develop/code-map.md) for focused work.

### Pilot

The [architecture](https://github.com/frappe/pilot/blob/develop/docs/architecture.md) explains the local runtime. The [domain provider](https://github.com/frappe/pilot/blob/develop/docs/domain-provider.md), [tasks](https://github.com/frappe/pilot/blob/develop/docs/tasks.md) and [admin API](https://github.com/frappe/pilot/blob/develop/docs/admin-api.md) describe its interfaces.

### Cargo

Use [image builds](https://github.com/frappe/cargo/blob/develop/docs/image.md), [object storage](https://github.com/frappe/cargo/blob/develop/docs/object-storage.md) and [health](https://github.com/frappe/cargo/blob/develop/docs/health.md) for the owning workflows. The [Atlas contract](https://github.com/frappe/cargo/blob/develop/docs/atlas-contract.md) defines the infrastructure requests.

### Frappe

The [Cloud Settings client](https://github.com/frappe/frappe/blob/develop/frappe/integrations/frappe_providers/cloud_settings.py) connects the app to Pilot. Follow [in-app Cloud](../journeys/in-app-cloud.md) before tracing the implementation.

## Documentation ownership

Keep explanations that cross services in the workflow and platform pages. Keep exact API fields, commands and recovery steps in the service's own docs.

When behavior changes, update the service's docs and this guide's summary if needed. If docs and code differ, check the code.
