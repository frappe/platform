# Pilot bootstrap

Bootstrap gives a prepared Pilot VM its own identity and connection to Central. Pilot reads its configuration from inside the VM before Central can manage it.

```mermaid
flowchart LR
  Central[Central prepares metadata] --> Guest[Atlas delivers it to the VM]
  Guest --> Pilot[Pilot applies configuration]
```

## Image preparation

Cargo's image contains Pilot, a bench, production configuration and the admin hostname alias. Site and Apps images also contain a prepared site and its hostname alias.

Cargo runs `pilot setup central` to leave the image Central-enabled and awaiting bootstrap. The image contains no customer's Central credential.

## Instance metadata

Central prepares a server-specific credential and includes it in the VM request as **instance metadata**. Metadata is configuration that the host makes available inside the VM at `169.254.169.254`.

The `pilot-central` attribute requires `central_endpoint`, `central_auth_token`, `jwks_url` and `jwks_audience_id`. It can also include `initial_jwks_cache`.

Atlas and Metal deliver this configuration to the selected VM. Pilot reads it itself, so startup needs no separate SSH setup script from Atlas.

| Metadata attribute | Destination |
| --- | --- |
| `pilot-central` | Central connection and verification identity. |
| `pilot-common-config` | Host-shared settings, including telemetry when supplied. |
| `pilot-config` | Bench configuration patches. |
| `pilot-common-site-config` | Shared Frappe site settings. |

Each metadata value is limited to 1 KiB, so each configuration file has its own attribute. These patches configure the runtime. They do not replace its database or app code.

## Configuration application

Pilot waits for the Central credential in metadata. Configuration patches are optional. If metadata is invalid, Pilot logs the error and checks again.

Pilot seeds the public-key cache when initial keys are present. It applies the patches, saves the verification endpoint and audience, and marks the host bootstrapped.

When supplied, the initial keys let Pilot check a known signing key without a separate download on the first request. An old cache can refresh in the background. Signature, audience and time checks still apply.

During bootstrap, Pilot sizes its managed MariaDB for the VM's memory. The customer's VM can have a different size from the build machine.

Pilot's Central client reads its endpoint and credential from metadata for each call. Pilot saves bootstrap and verification state, but does not copy that credential into its local TOML configuration.

## Bootstrap and readiness

Bootstrap establishes management identity. Central separately checks whether the app answers through its public hostname, then arranges the customer's login.

A VM can run its web server while Pilot still applies Cloud configuration. If the site alias has no matching site, nginx serves a pending screen and the readiness probe returns 503.

Pilot uses its server credential to call Central. Central uses separate signed tokens to call Pilot. [Authentication](../trust/authentication.md) explains both checks.

The [self-bootstrap design note](https://gameplan.frappe.io/g/community/frappe-cloud/space/17/discussion/5826/pilot-self-bootstrapping-in-cloud) describes the design. Implementation starts in [metadata handling](https://github.com/frappe/pilot/blob/develop/pilot/integrations/central/metadata.py) and the [bootstrap watcher](https://github.com/frappe/pilot/blob/develop/admin/backend/central_bootstrap.py).
