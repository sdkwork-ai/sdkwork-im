# SDKWork IM Flutter Source Configuration

This deployable mobile root consumes the enclosing IM deployment profile from
`../../../etc/sdkwork.deployment.config.json`. Flutter build/runtime materialization owns target
bindings only; public application and SDK origins remain root deployment values. Secrets and local
`dart-define` overlays are not committed here.

## Inherited env overlay

Optional application env layers merge after the repository topology layers
(`ENVIRONMENT_SPEC.md` §5.1.7.1):

- `etc/env.base.env` - application-wide defaults
- `etc/env.<deployment-profile>.<environment>.env` - application/profile delta

Do not put `SDKWORK_ACCESS_TOKEN` here; the public application token is generated
per application and profile.
