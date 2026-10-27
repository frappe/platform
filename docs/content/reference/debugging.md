# Signup debugging

Find the first step that failed. This tells you whether to investigate the VM, Pilot setup, login, routing or the app.

## Locate the delay

Find the Resource Action in Central. Its **Site Setup** timeline shows the time of each step. The steps are requested, sent to the region, server created, site addressable, site answered, signed in and name applied. The first step with no time is where the signup stopped. A failed step shows its error.

Record the region, image, VM ID if available, and action state. Compare these events in UTC:

1. Central accepts creation.
2. Atlas reports VM Running.
3. Pilot accepts an authenticated request.
4. The public site answers its readiness probe.
5. Central completes the customer login.

A restored VM can start with an old clock. Its first log times can make the comparison misleading.

| First failed stage | Check |
| --- | --- |
| No accepted VM identity | Central's action and Atlas response. Establish whether creation remains queued, has an accepted identity or has an uncertain outcome. |
| Slow VM startup | Image choice, warm-template eligibility and Metal runtime state. |
| Pilot rejects login | Guest clock, signing key, audience and token times. |
| Pilot works but the site fails | Workers, database, proxy route and local hostname match. |
| Rename returns 404 | The compatibility symlink at the old site path, and the nginx reload. |
| Many VMs from one image fail | Cargo build, disk flush and warm-template preparation. |

## Check the restored clock

On the affected guest, read UTC time and the metadata-agent status. Compare it with the time on the host that runs the VM.

```sh
date -u
systemctl status atlas-metadata.service --no-pager
journalctl -u atlas-metadata.service -b --no-pager
```

These commands inspect state without changing it. The agent does not log clock steps, so the journal shows only service starts and restarts. A restart loop means the agent is failing.

Check that Metal supplied `host-time-unix-ms`. Read only that value, because full metadata can contain server credentials:

```sh
token=$(curl -s -X PUT -H 'X-metadata-token-ttl-seconds: 60' http://169.254.169.254/latest/api/token)
curl -s -H "X-metadata-token: $token" http://169.254.169.254/latest/meta-data/host-time-unix-ms
```

The value is the host time at the last resume, in milliseconds. Compare it with `date +%s%3N`.

An old VM clock can make the token's issue time, `iat`, appear to be in the future. Check the clock before treating this as a signature failure. Both Metal and the guest agent must support [clock restoration](../journeys/fast-start.md#clock-restoration).

## Check the failing boundary

### Authentication

Check the key ID, signature, intended receiver and token times. Then check the service's permission, tenant or site rules in the [validation reference](./token-validation.md).

Keep expiry and audience validation enabled. Record a safe claim summary rather than a raw token or credential.

### Routing and rename

Check the proxy's destination VM, then Pilot's local hostname match. A chosen name can work while rename remains pending.

During rename, the old directory path must still resolve for existing workers and tasks. [Domains](../journeys/domains.md) explains the route and filesystem layers.

### Shared image failures

Check Cargo's build log and whether writes finished before disk capture. Empty service units or MariaDB recovery can indicate a faulty image, but inspect the files and database logs before deciding.

Also check the warm-template shape and `pilot-prewarm.service`. The service removes its pending marker only after every probe succeeds. Atlas captures after a fixed wait and does not check that marker.

## Where to inspect each service

| Service | Starting point |
| --- | --- |
| Central | The Resource Action, its progress and accepted regional VM identity. |
| Atlas | The regional VM and service records, observed state and failure phase. |
| Metal | The host's runtime state and logs for the affected VM. |
| Cargo | The Pilot Image build record and build output, or the managed-service status and health. |
| Pilot | The relevant site or server task and its result. |
| HTTP proxy | The route for the public name and the health of the serving nodes. |
| Datum | Pilot's telemetry delivery and Datum's write path. Telemetry reads use separate ClickHouse credentials. |

For regional service setup, check the Atlas service record and its linked installation SSH Task. [Regional bootstrap](../regional/bootstrap.md) explains the setup milestones.

## Diagnostic evidence

Record the first failed milestone, image and VM references, clock comparison and relevant task or service error.

A timeout after a creation request does not prove that creation failed. Check the original request before creating another VM.

Detailed recovery belongs in [Central actions](https://github.com/frappe/central/blob/develop/central/infrastructure/doctype/resource_action/SPEC.md), [Atlas runtime](https://github.com/frappe/atlas/blob/develop/docs/compute/runtime.md), [Cargo images](https://github.com/frappe/cargo/blob/develop/docs/image.md) and [Pilot tasks](https://github.com/frappe/pilot/blob/develop/docs/tasks.md).
