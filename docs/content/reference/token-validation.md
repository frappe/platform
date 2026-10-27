# Token validation

Use this reference to check how each service identifies callers and limits their access. [Authentication and trust](../trust/authentication.md) explains the basics.

## Service access matrix

Each row shows how a service checks its caller and limits its access. Central uses tenant `0` only for operators with the System Manager bypass.

| Caller → receiver | How the receiver checks the caller | Limit on that access |
| --- | --- | --- |
| Customer → Central | Signed-in session, team and capability checks. | Only the resources and actions the customer may use. |
| Central → Atlas | Signed token for that region's Atlas API. | Central has broad tenant authority. Its integration selects the authorized team's tenant for each customer request. |
| Atlas → Metal | Regional certificates and mutual TLS. | The host control API accepts the pinned Atlas client identity. A customer VM does not hold this identity. |
| Cargo → Atlas | Atlas token with tenant `0`. | Regional service resources in tenant `0`. It cannot select a customer tenant with that credential. |
| Central → proxy | Token for that region's proxy, with site and domain scopes. | Customer route operations. The token does not grant Atlas VM access. |
| Cargo → proxy | Proxy token with a name constraint. | Site routes with the `-svc` suffix. It cannot use that token for arbitrary customer domain routes. |
| Central → Cargo | Token for that region's Cargo API, in `X-Cargo-Access-Token`. | Cargo checks the signature, issuer, audience and expiry. Bucket handlers also check the region and serving cluster. |
| Atlas → Cargo | Atlas-signed token for that region's Cargo API. | Creates Atlas's own image bucket. Cargo ignores the token's scope and tenant. |
| Central → Pilot | Signed token for the assigned Pilot audience. | The supported scope, such as bench login or login to a named site. |
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

A new key reaches the region after a successful sync. Removing a key also needs a successful sync.

A regional receiver rejects a token with an unknown key ID and does not fetch keys for it. Pilot fetches Central's key set on an unknown ID, at most once every 30 seconds.

Central uses separate signing keys for Pilot tokens and regional tokens. Metal uses regional certificates instead of the JWT path.

## Receiver validation

`R` is the receiver's numeric region ID. Regional validators accept only `EdDSA` and known key IDs, then check the signature, issuer binding and token times.

| Receiver | Audience | Additional rules |
| --- | --- | --- |
| Atlas | `atlas-admin:R` | Requires `iss`, `sub`, `aud`, `iat`, `exp`, `scope="*"` and a tenant of `*` or a 32-bit unsigned number. Nonempty constraints are not permitted. Fixed-tenant tokens cannot select another tenant. |
| HTTP proxy | `atlas-proxy:R` | Requires supported scopes. Checks each route operation and name constraint. Rejects a tenant claim. Also accepts the regional service password, which grants `*`. |
| WireGuard gateway | `atlas-wg-gateway:R` | Requires supported peer scopes and checks the requested operation. Rejects a tenant claim. Also accepts the regional service password, which grants `*`. |
| Cargo | `atlas-cargo:R` | Requires issuer, subject, audience, issue time and expiry. The bucket handlers check the region and serving cluster. |
| Datum | `atlas-datum:R` | Requires issuer, audience, issue time and expiry. A telemetry write needs `access` containing `write` and a `resource_id`. |

Cargo checks no `scope` or `tenant`. A valid regional token with the Cargo audience reaches every Cargo bucket handler.

Pilot uses its configured JWKS source and its own audience. It requires expiry and audience and accepts only a fixed list of asymmetric algorithms (RS, ES, PS and EdDSA).

Pilot checks time claims when present, then bench or site scope and site binding. Its configured key source and audience form a separate boundary from the regional key-ID and issuer rules.

Pilot's locally issued site tokens use its local signing secret. Pilot-to-Central credentials and webhook signatures also use separate checks. They are not regional JWKS tokens.

## JWT fields

| Field | Meaning |
| --- | --- |
| `alg` | The signing algorithm. Regional JWTs use EdDSA with Ed25519 keys. |
| `kid` | The ID of the public key that checks the signature. |
| `iss` | The issuer. Regional key IDs bind to Central or the local Atlas issuer. Pilot tokens carry Central's URL, and Pilot does not check it. |
| `aud` | The intended receiver: `atlas-<service>:R` for regional services, or the Pilot credential ID for Pilot. |
| `iat` | The time when the issuer created the token. A future value can fail a time check. |
| `exp` | The expiry time. The receiver rejects an expired token. |
| `nbf` | The earliest permitted use time, when the token includes this field. |
| `scope` | Space-separated permitted operations, such as `site:* domain:*`. Atlas accepts only `*`. |
| `tenant` | The infrastructure tenant authority used by Atlas. |
| `constraints` | Extra limits, such as `{"site": {"suffix": "-svc"}}` for the proxy. Keys are `prefix`, `suffix` and `names`. |
| `resource_id` | The resource whose telemetry Datum may accept. |
| `access` | Datum access, such as `write`. |

Many tokens can use the same public key. Each token has its own expiry and permissions.

**Sources:** [Central IAM](https://github.com/frappe/central/blob/develop/spec/IAM.md), [Central SSO](https://github.com/frappe/central/blob/develop/spec/SSO.md), [Atlas signing keys](https://github.com/frappe/atlas/blob/develop/docs/interfaces/signing-keys.md), and [Atlas security](https://github.com/frappe/atlas/blob/develop/docs/interfaces/security.md).
