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
