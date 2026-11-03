# SDKWork IM Mini Program Source Configuration

This deployable WeChat mini program root consumes the enclosing IM deployment profile from
`../../../etc/sdkwork.deployment.config.json`; public domains and SDK Base URLs remain root
deployment values.

Non-secret runtime env materializes as
`../config/mini-program/runtime-env.<deploymentProfile>.<environment>.json` and declares matching
`SDKWORK_ENVIRONMENT`, `SDKWORK_DEPLOYMENT_PROFILE`, `SDKWORK_PROFILE_ID`, and
`SDKWORK_RUNTIME_TARGET=mini-program`.

WeChat platform metadata, appid references, upload environment, and permission references belong to
`../config/host/` and must stay secret-free. WeChat DevTools developer settings stay in the ignored
`project.private.config.json`.

Validate with `node ../../../sdkwork-specs/tools/check-source-config-standard.mjs --root .` from
this app root.

## Inherited env overlay

Optional application env layers merge after the repository topology layers
(`ENVIRONMENT_SPEC.md` §5.1.7.1):

- `etc/env.base.env` - application-wide defaults
- `etc/env.<deployment-profile>.<environment>.env` - application/profile delta

Do not put `SDKWORK_ACCESS_TOKEN` here; the public application token is generated
per application and profile.
