# SDKWork IM PC Source Configuration

This deployable renderer consumes the enclosing IM deployment profile from
`../../../etc/sdkwork.deployment.config.json`. The local `browser/` directory owns only PC renderer
binding seeds and the local Vite targets; public domains and SDK Base URLs remain root deployment values.

Validate with `node ../../../sdkwork-specs/tools/check-source-config-standard.mjs --root .` from this app root.
