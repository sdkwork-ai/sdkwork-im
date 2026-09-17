# sdkwork-im-harmony-mobile-commons

SDKWork IM HarmonyOS mobile commons: domain-neutral ArkUI primitives, design
tokens, screen-state model, and i18n helpers.

Authority: `../../../../sdkwork-specs/APP_HARMONY_NATIVE_UI_SPEC.md` and
`../../../../sdkwork-specs/FRONTEND_SPEC.md`.

## Boundary

Section 3 of the architecture standard gives `commons` domain-neutral UI only:
no business pages, no SDK construction, no route contributions, no API base URL
reads. It depends on nothing in the package family so every other layer can
depend on it without creating a cycle.

`ScreenState.ets` enumerates the seven UI states section 11 requires so a page
cannot silently ship only the success path.
