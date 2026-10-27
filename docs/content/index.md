---
outline: false
pageClass: platform-home
---

# Frappe Cloud v2

Central manages your Cloud account. Regional services run your virtual machines (VMs), route app traffic and store data.

<CloudArchitecture />

## Regions

A region is a group of servers and services in one location, such as Mumbai (BOM) or Bengaluru (BLR). Each region has its own Atlas and infrastructure.

Cloud v2 uses a **microservice architecture**: each service has its own job and data. Services send requests to each other through APIs.

Central checks the customer's account and permissions. Atlas coordinates work in the chosen region. Metal runs VMs on physical hosts. WG Mesh connects those VMs through a private network.

Atlas also creates the regional service VMs: the HTTP proxy, Cargo, the IPv6 router and the WireGuard gateway. Cargo builds app images and provisions managed services through Atlas. Garage stores objects, and Datum receives metrics and logs and writes them to ClickHouse.

## VM types

Atlas manages two types of VM:

- **Raw VM:** an operating system, such as Ubuntu. You install and manage your software.
- **Pilot VM:** a VM with Pilot and Frappe apps. Pilot manages its benches, sites, app processes and local tasks.

## Management and application traffic

For a VM infrastructure change, a request can go from **customer → Central → Atlas → Metal**. Central checks the customer's permission. The regional services check the credentials for their part of the work.

An app request goes from **visitor → regional HTTP proxy → Pilot VM**. Central does not process each page request to a running app.

[Authentication and trust](./trust/authentication.md) explains how services check management requests.
