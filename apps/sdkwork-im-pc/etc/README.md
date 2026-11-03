# SDKWork IM PC Source Configuration

This deployable renderer consumes the enclosing IM deployment profile from
`../../../etc/sdkwork.deployment.config.json`. The local `browser/` directory owns only PC renderer
binding seeds and the local Vite targets; public domains and SDK Base URLs remain root deployment values.

Validate with `node ../../../sdkwork-specs/tools/check-source-config-standard.mjs --root .` from this app root.

## Inherited env overlay

Optional application env layers merge after the repository topology layers
(`ENVIRONMENT_SPEC.md` §5.1.7.1):

- `etc/env.base.env` - application-wide defaults
- `etc/env.<deployment-profile>.<environment>.env` - application/profile delta

Do not put `SDKWORK_ACCESS_TOKEN` here; the public application token is generated
per application and profile.
