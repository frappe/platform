---
outline: false
pageClass: platform-home
---

# Frappe Cloud v2

Central manages your Cloud account. Regional services run your virtual machines (VMs), route app traffic and store data.

<CloudArchitecture />

## Regions

A region is infrastructure in one location, such as Mumbai (BOM) or Bengaluru (BLR). Each region has its own Atlas, regional services and physical servers.

Cloud v2 uses a **microservice architecture**. Each service owns a specific job and accepts requests through an API. Services work together without sharing one database or one credential.

Central checks the customer's account and permissions. Atlas coordinates work in the chosen region. Metal runs Firecracker VMs on physical hosts. WG Mesh connects those VMs through a private network.

Atlas also creates the regional service VMs: the HTTP proxy, Cargo, the IPv6 router and the WireGuard gateway. Cargo builds app images and runs managed services: Garage stores objects, and Datum receives metrics and logs and writes them to ClickHouse.

## VM types

A virtual machine is a computer inside a physical server. Atlas manages both types:

- **Raw VM:** an operating system, such as Ubuntu. You install and manage your software.
- **Pilot VM:** a VM with Pilot and Frappe apps. Pilot manages its benches, sites, app processes and local tasks.

## Management and application traffic

A management request goes from **customer → Central → Atlas → Metal**. Central checks the customer's permission. The regional services check the credentials for their part of the work.

An app request goes from **visitor → regional HTTP proxy → Pilot VM**. Central does not process each page request to a running app.

These paths have separate access rules. Access to an app or a VM does not grant access to regional control APIs. [Authentication](./trust/authentication.md) explains these trust boundaries.
