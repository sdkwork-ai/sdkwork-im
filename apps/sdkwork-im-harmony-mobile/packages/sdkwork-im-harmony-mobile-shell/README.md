# sdkwork-im-harmony-mobile-shell

SDKWork IM HarmonyOS mobile shell: app surface shell, navigation/page stack
assembly, AuthGate integration, and the shell-owned session screen.

Authority: `../../../../sdkwork-specs/HARMONY_APP_MOBILE_ARCHITECTURE_SPEC.md`
(sections 3, 5, 8) and `../../../../sdkwork-specs/FRONTEND_SPEC.md`.

## Boundary

Section 3 gives `shell` the app shell, navigation/page stack assembly, AuthGate
integration, and app route composition — **not** business services. The shell
therefore contributes the session/login route, which must exist before any
capability is reachable, and nothing else.

Section 5 places `shell` above capability packages, so the shell owns its own
`ImHarmonyRouteRegistration` shape in `navigation/RouteStack.ets` and does not
import a capability package. The root bootstrap projects capability
contributions onto that shape.

## Why the login route is root-owned

`app.communication.session.login` is not shared with H5: the H5 client
authenticates through the IAM H5 surface and declares no login route, so there is
no H5 id to share. The mini program shell authors the same id separately for its
platform. Route ids that *are* shared (`app.communication.chat.*`) are asserted
equal to the H5 catalog by `tests/harmony-surface-contract.test.mjs`.
