# Terms and concepts

These terms connect the customer account, regional infrastructure and Frappe runtime.

## Account and ownership

| Term | Meaning |
| --- | --- |
| User | A person who signs in to Central. |
| Team | The account that owns resources and billing. A user can belong to several teams. |
| Role | A set of permissions assigned to a team member. |
| Capability | A named permission, such as viewing a server or changing its size. |
| Tenant | The regional infrastructure identity that separates a team's resources. |

Central checks the capability needed for each action. Regional services use the tenant identity to limit infrastructure access. Regional service resources use tenant `0`.

## Machines and regions

| Term | Meaning |
| --- | --- |
| Region | A deployment with its own Atlas, regional services, compute and network resources. |
| Host | A physical server that runs Metal and contains VMs. |
| Server or VM | A virtual machine. The console calls it a server. Atlas manages it as a VM. |
| Raw VM | A VM whose software the customer manages. |
| Pilot VM | A VM with Pilot to manage Frappe benches, sites and apps. |
| Image | A prepared machine disk used to create a VM. |
| Warm template | Prepared memory and process state that a compatible VM can restore. |
| Snapshot | Saved machine state for an image or recovery. |
| Mesh address | A VM's stable private IPv6 address in the regional network. |

A VM keeps its mesh address when it moves between hosts. The regional proxy targets that address rather than a physical host.

## Frappe runtime

| Term | Meaning |
| --- | --- |
| App | Code and assets that provide functionality, such as ERPNext. |
| Bench | App code, processes and dependencies used to run Frappe. |
| Site | A database, files and configuration that use apps installed in a bench. |
| Site backup | A copy of Frappe data created through Pilot. Its scope differs from a VM snapshot. |

Pilot manages the runtime inside its VM. A product signup starts with a prepared site. A bench can contain more than one site.

## Names and progress

A **domain** is a public name for a site or Pilot. Several domains can reach one VM. The public name can differ from the site's directory name.

**Requested state** describes the intended result. **Observed state** describes what a service reports. An accepted start request does not prove that a VM runs or that its app is ready.

[Signup](../journeys/signup.md) connects these concepts in one flow. [Domains](../journeys/domains.md) explains the name-to-site mapping.
