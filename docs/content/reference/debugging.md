# Debug a slow signup

Find the first milestone that failed. That identifies whether to investigate creation, VM startup, bootstrap, authentication, routing or the app.

## Locate the delay

Find the Resource Action in Central. Record the region, image, accepted VM identity and action state. Compare these events using the same time basis:

1. Central accepts creation.
2. Atlas reports VM Running.
3. Pilot accepts an authenticated request.
4. The public site answers its readiness probe.
5. Central completes the customer login.

A restored guest can initially have an old clock. Its first log timestamps can mislead the comparison.

| First failed stage | Check |
| --- | --- |
| No accepted VM identity | Central's action and Atlas response. Establish whether creation remains queued, has an accepted identity or has an uncertain outcome. |
| Slow VM startup | Image choice, warm-template eligibility and Metal runtime state. |
| Pilot rejects login | Guest clock, signing key, audience and token times. |
| Pilot works but the site fails | Workers, database, proxy route and local hostname match. |
| Rename returns 404 | The old directory alias and nginx transition. |
| Many VMs from one image fail | Cargo build, disk flush and warm-template preparation. |

## Check the restored clock

On the affected guest, read UTC time and the metadata-agent status. Compare with host time through the approved operator access path.

```sh
date -u
systemctl status atlas-metadata.service --no-pager
journalctl -u atlas-metadata.service -b --no-pager
```

These commands inspect state without changing it. Check that Metal supplied `host-time-unix-ms` and that the guest image contains the updated agent.

Inspect only the needed metadata value. Full metadata can contain server credentials.

An old guest clock makes a current token's `iat` appear to be in the future. Fix the time path before treating this as a signature failure. Both Metal and the guest agent must support [clock restoration](../journeys/fast-start.md#clock-restoration).

## Check the failing boundary

### Authentication

Check the key ID, signature result, audience and time claims. Then check the service's scope, tenant or site rules in the [validation reference](./token-validation.md).

Keep expiry and audience validation enabled. Record a safe claim summary rather than a raw token or credential.

### Routing and rename

Check the proxy's destination VM, then Pilot's local hostname match. A chosen name can work while rename remains pending.

During rename, the old directory path must still resolve for existing workers and tasks. [Domains](../journeys/domains.md) explains the route and filesystem layers.

### Shared image failures

Check Cargo's build log and whether writes finished before disk capture. Empty service units or MariaDB recovery can indicate a defective image, but inspect the files and database logs before deciding.

Also check the warm-template shape and prewarm result. Installed files alone do not prove that warm memory preparation succeeded.

## Diagnostic evidence

Record the first failed milestone, image and VM references, clock comparison and relevant task or service error.

A timeout after creation leaves an uncertain result. Observe the original request before creating a replacement VM.

Detailed recovery belongs in [Central actions](https://github.com/frappe/central/blob/develop/central/infrastructure/doctype/resource_action/SPEC.md), [Atlas runtime](https://github.com/frappe/atlas/blob/develop/docs/compute/runtime.md), [Cargo images](https://github.com/frappe/cargo/blob/develop/docs/image.md) and [Pilot tasks](https://github.com/frappe/pilot/blob/develop/docs/tasks.md).
