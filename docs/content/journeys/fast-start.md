# Fast app startup

The prepared startup path targets less than 15 seconds. It moves installation and application warm-up before signup, leaving the new VM to restore, apply its identity and answer requests.

This target depends on the image, machine shape and working dependencies. It does not describe every cold start or the entire signup UI.

## Image preparation

```mermaid
flowchart LR
  Cargo[Cargo prepares the app] --> Atlas[Atlas captures warm state]
  Atlas --> VM[Customer VM restores it]
```

Cargo installs Pilot, Frappe and the product apps, configures production processes and prepares hostname aliases.

A disk image saves those files. A warm snapshot also saves prepared memory and process state. Before capture, Atlas runs an isolated guest for five minutes. The prewarm service requests `/api/method/ping`, the home page, `/login` and an authenticated `/desk` page through the local worker.

Atlas captures after its fixed wait. It does not check whether prewarm succeeded.

Frappe loads code and prepares its workers ahead of the customer's request. Pilot's admin process must stay awake during preparation. An idle process can add another wake-up delay.

The [self-bootstrap design note](https://gameplan.frappe.io/g/community/frappe-cloud/space/17/discussion/5826/pilot-self-bootstrapping-in-cloud) describes a longer admin inactivity timeout for this preparation. It is separate from trial-VM sleep policy.

Warm restore needs the template's CPU count and memory size. The new disk must be at least as large as the template's disk.

## Instance configuration

Two mechanisms remove setup work from the first login:

- [Bootstrap](./bootstrap.md) applies the VM's identity from metadata and seeds Pilot's key cache, so the first login needs no key download.
- [Local aliases](./domains.md#local-hostname-aliases) let the public name reach the prepared site before its physical rename.

## Clock restoration

A memory snapshot preserves an old guest clock. A VM captured at 11 pm can initially read 11 pm when restored later.

A token issued now can appear to come from the future. Pilot can reject it even when the key and signature are correct.

Metal injects the host's current Unix time into metadata before guest resume. The guest's `atlas-metadata.service` reads that value and moves the clock forward if it is more than two seconds behind.

The service never moves the clock backward. Normal time sync corrects the remaining difference.

Pilot's key-cache and session ages also depend on time. A large correction can make a session expire immediately or change cache freshness calculations.

This needs both the Metal change and a guest image containing the updated agent. Updating Metal does not add the agent to an old image. [Atlas PR 476](https://github.com/frappe/atlas/pull/476) contains the change.

## Disk consistency

Cargo runs `sync`, stops the builder and waits for Stopped before requesting a disk snapshot. This flush is separate from warming memory.

Without it, dirty memory pages may never reach the captured disk. A service unit file can appear empty. Database files can need recovery on the next start.

MariaDB recovery delays warm-template preparation and can affect later signup. A good warm path therefore starts with a valid disk image.

## Startup measurements

The September 2026 [design note](https://gameplan.frappe.io/g/community/frappe-cloud/space/17/discussion/5826/pilot-self-bootstrapping-in-cloud) reports:

| Test measurement | Time |
| --- | --- |
| Public site answers | 4.76 seconds |
| Pilot site-login API call | 1.06 seconds |
| VM-create request through login handoff | 6.15 seconds total |

These are measurements from that test, rather than a general boot-time guarantee. They cover VM creation through login, not every signup UI step.

Always record the start and end event. VM Running, authenticated Pilot access, a public site response and usable customer login prove different milestones.

For delays, use [the signup debugging guide](../reference/debugging.md) to find the first failed milestone.
