# Token validation

Use this reference to check a service connection, its accepted identity and the claims it enforces. [Authentication and trust](../trust/authentication.md) explains the model.

## Service access matrix

Each row describes the credential boundary for that connection. Operator maintenance paths use their own access rules.

| Caller → receiver | How the receiver checks the caller | Limit on that access |
| --- | --- | --- |
| Customer → Central | Signed-in session, team and capability checks. | Only the resources and actions the customer may use. |
| Central → Atlas | Signed token for that region's Atlas API. | Central has broad tenant authority. Its integration selects the authorized team's tenant for each customer request. |
| Atlas → Metal | Regional certificates and mutual TLS. | The host control API accepts the pinned Atlas client identity. A customer VM does not hold this identity. |
| Cargo → Atlas | Atlas token with tenant `0`. | Regional service resources in tenant `0`. It cannot select a customer tenant with that credential. |
| Central → proxy | Token for that region's proxy, with site and domain scopes. | Customer route operations. The token does not grant Atlas VM access. |
| Cargo → proxy | Proxy token with a name constraint. | Site routes with the `-svc` suffix. It cannot use that token for arbitrary customer domain routes. |
| Central → Cargo | Token for that region's Cargo API. | Cargo checks the signature, issuer, audience and expiry. Its handlers check the region and cluster state. |
| Central → Pilot | Signed assertion for the assigned Pilot audience. | The supported scope, such as bench login or login to a named site. |
| Pilot → Central | The server's `X-Pilot-Token` credential. | Central resolves the linked server and team. The credential is not a customer's general console session. |
| Frappe site → Pilot | Site-scoped token. | The allowed operations for that site. Shared bench changes have further checks. |
| Pilot → Datum | Token for the regional Datum service. | Writes for the token's resource identity. It does not grant telemetry reads. |
| Atlas or Cargo → Central | A signed webhook delivery. | Reports from the configured regional sender. The secret does not grant console access. |

Central is a trusted service with wider authority than a customer. The platform does not rely on Atlas to repeat Central's team-role checks.

### Atlas tenant selection

Central's Atlas token has `tenant="*"` and `scope="*"`. It can act across tenants in that region.

For a customer request, Central checks the customer's permission and reads the tenant ID from the authorized Team. Its integration sends that ID in `X-Tenant-ID`.

Atlas checks the token and applies the selected tenant to resource access. A fixed-tenant service token cannot select a different tenant with this header.

Central must complete the customer permission check before it selects that tenant.

## Key distribution and rotation

Atlas publishes its merged key set at `/api/atlas/jwks.json`. It periodically refreshes Central's public keys and retains the last valid set after a failed refresh.

A new key reaches the region after a successful sync. A removed key also needs a successful sync to disappear from the saved set.

An unknown key ID fails validation. Atlas does not fetch Central's keys for each unknown ID. Receivers have their own cache and refresh rules.

Central uses separate signing keys for Pilot assertions and regional tokens. Metal uses regional certificates instead of the JWT path.

## Receiver validation

`R` is the receiver's numeric region ID. Regional validators accept configured algorithms and known key IDs, then check the signature, issuer binding and token times.

| Receiver | Audience | Additional rules |
| --- | --- | --- |
| Atlas | `atlas-admin:R` | Requires its identity claims, `scope="*"` and a valid tenant claim. Nonempty constraints are not permitted. Fixed-tenant tokens cannot select another tenant. |
| HTTP proxy | `atlas-proxy:R` | Requires supported scopes. Checks each route operation and name constraint. Rejects a tenant claim. |
| WireGuard gateway | `atlas-wg-gateway:R` | Requires supported peer scopes and checks the requested operation. Rejects a tenant claim. |
| Cargo | `atlas-cargo:R` | Requires issuer, subject, audience, issue time and expiry. The bucket handlers check the region and serving cluster. |
| Datum | `atlas-datum:R` | Requires issuer, audience, issue time and expiry. A telemetry write needs `access` containing `write` and a `resource_id`. |

Cargo's shared validator does not enforce a `scope` claim. Its access boundary differs from the proxy's route restrictions and Atlas's tenant rules.

Pilot uses its configured JWKS source and its own audience. It requires expiry and audience and accepts only its configured asymmetric algorithms.

Pilot checks time claims when present, then bench or site scope and site binding. Its configured key source and audience form a separate boundary from the regional key-ID and issuer rules.

Pilot's locally issued site tokens use its local signing secret. Pilot-to-Central credentials and webhook signatures also use separate checks. They are not regional JWKS tokens.

## JWT fields

| Field | Meaning |
| --- | --- |
| `alg` | The signing algorithm. Regional JWTs use EdDSA with Ed25519 keys. |
| `kid` | The ID of the public key that checks the signature. |
| `iss` | The issuer. Regional key IDs bind to Central or the local Atlas issuer. |
| `aud` | The intended receiver. It includes a region ID or Pilot audience as appropriate. |
| `iat` | The time when the issuer created the token. A future value can fail a time check. |
| `exp` | The expiry time. The receiver rejects an expired token. |
| `nbf` | The earliest permitted use time, when the token includes this field. |
| `scope` | Permitted operations in APIs that enforce scopes. |
| `tenant` | The infrastructure tenant authority used by Atlas. |
| `constraints` | Extra limits, such as the proxy site-name suffix. |
| `resource_id` | The resource whose telemetry Datum may accept. |
| `access` | Datum access, such as `write`. |

A public key can remain valid for many tokens. Each token has its own expiry and permissions.

**Sources:** [Central IAM](https://github.com/frappe/central/blob/develop/spec/IAM.md), [Central SSO](https://github.com/frappe/central/blob/develop/spec/SSO.md), [Atlas signing keys](https://github.com/frappe/atlas/blob/develop/docs/interfaces/signing-keys.md), and [Atlas security](https://github.com/frappe/atlas/blob/develop/docs/interfaces/security.md).
