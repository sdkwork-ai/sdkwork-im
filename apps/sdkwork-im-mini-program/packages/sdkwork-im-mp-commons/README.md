# @sdkwork/im-mp-commons

Domain-neutral mini program UI primitives, design tokens, and thin i18n helpers for the IM mini
program surface.

## Role

| Aspect | Value |
| --- | --- |
| Package role | `commons` |
| Layer role | `frontend-commons` |
| Surface | `app` |

## Contents

- `src/components/screenStates.ts` - payload-free loading/ready/empty/error primitives.
- `src/theme/designTokens.ts` - IM mobile design tokens (`rpx` spacing, mobile palette).
- `src/i18n/locale.ts` - thin locale boundary: normalize, look up, merge. No authored copy.

## Boundaries

- Domain-neutral only. No business screens, domain services, or SDK construction.
- Authored copy belongs to capability packages under
  `src/i18n/<locale>/<domain>/<capability>/<fragment>.ts`.
- Must not import `core`, `shell`, or capability packages.
