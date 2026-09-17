# Repository Guidelines

## SDKWORK Soul

Read `../../../sdkwork-specs/SOUL.md` before executing application tasks. Start with the sections that route the current task; related-spec references are not a startup bundle.

## SDKWORK Standards

The canonical standards index is `../../../sdkwork-specs/README.md`, and `../../../sdkwork-specs/AGENTS_SPEC.md` governs this entrypoint. Read the relevant task-matrix row first and do not copy global normative bodies locally.

## Application Identity

Read `sdkwork.app.config.json` only for application identity, SDK/API inventory, release metadata, packaging, or app-owned capabilities. Runtime values belong to source configuration, not the application declaration.

- Application code: `chat`
- Application key: `sdkwork-im-mini-program`
- Platform: `MP_WEIXIN` (native WeChat mini program)
- Client architecture: `mini-program` (runtime target `mini-program`)

## Local Dictionary Structure

Use `AGENTS.md` as the application routing entrypoint. Read `.sdkwork/`, `specs/`, application source, tests, and documentation only when the current task reaches the contract each location governs.

- `src/` is the platform runtime root (`miniprogramRoot`): `app.ts`/`app.json`/`app.wxss`, `bootstrap/`, and projection targets under `pages/` and `subpackages/`.
- `packages/` owns the `sdkwork-im-mp-*` source package family: core, commons, shell, host, and capability packages. SDKWork packages are the business architecture boundary; platform pages/subpackages are packaging and loading boundaries only.
- `config/mini-program/` owns materialized non-secret runtime env JSON; `config/host/` owns WeChat platform metadata templates.
- `etc/` is this deployable root's source configuration and parent topology delegation authority.

## Spec Resolution Order

Use dynamic progressive loading: read this file and `../../AGENTS.md`, then `../../../sdkwork-specs/MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md`, then applicable local contracts under `specs/`, then the relevant task route in `../../../sdkwork-specs/README.md`, and only afterward inspect implementation files. Language-specific specs are on-demand only.

## Required Specs By Task Type

Mini program client work loads `../../../sdkwork-specs/APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md`, `../../../sdkwork-specs/MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md`, and `../../../sdkwork-specs/APP_MINI_PROGRAM_UI_SPEC.md`. Code changes load `../../../sdkwork-specs/CODE_STYLE_SPEC.md`, `../../../sdkwork-specs/NAMING_SPEC.md`, and only the touched `../../../sdkwork-specs/TYPESCRIPT_CODE_SPEC.md` or `../../../sdkwork-specs/FRONTEND_CODE_SPEC.md`. Package-command work loads `../../../sdkwork-specs/PNPM_SCRIPT_SPEC.md`; packaging workflow work loads `../../../sdkwork-specs/GITHUB_WORKFLOW_SPEC.md`; source configuration work loads `../../../sdkwork-specs/SOURCE_CONFIG_SPEC.md`; locale resource work loads `../../../sdkwork-specs/I18N_SPEC.md`.

## Code Style Rules

Consume remote capabilities through generated TypeScript app SDK clients composed in `mp-core` and injected from the platform page or root bootstrap. Do not introduce raw HTTP, manual authentication headers, generated transport imports, local SDK forks, duplicated shared utilities, platform globals (`wx.*`, `my.*`, `dd.*`) outside `mp-host`, or a second IAM runtime. Feature packages must not construct SDK clients or read runtime environment values directly.

## Build, Test, and Verification

Static verification runs today, without the WeChat DevTools toolchain:

```bash
pnpm typecheck
pnpm test
pnpm test:config
pnpm test:routes
node ../../../sdkwork-specs/tools/check-source-config-standard.mjs --root .
```

`pnpm test` loads the committed `src/runtime/im-app.js` bundle to assert the route projection and
the runtime identity rules, so it needs the bundle to be present. It is committed; run
`pnpm build:mini-program` first only after `pnpm clean`.

Runtime bundle build (requires `pnpm install`):

```bash
pnpm build:mini-program
pnpm build:mini-program:staging
pnpm build:mini-program:prod
```

WeChat DevTools upload requires the WeChat DevTools CLI and a bound mini program appid; both are operator-held and are not part of the repository workspace. Repository-wide gates that also cover this root run from the repository root with `pnpm check`.

## Agent Execution Rules

Follow specifications before memory and evidence before completion. Keep SDK construction, authentication, environment selection, and host capability bridges in their owning layers. Stop when kernel ownership, API authority, or SDK family boundaries are ambiguous.

## Task-Specific Standards

SDK consumer work loads `../../../sdkwork-specs/APP_SDK_INTEGRATION_SPEC.md` and runs `check-app-sdk-consumer-imports.mjs`. API work loads `../../../sdkwork-specs/API_SPEC.md` and its validators. List/search work loads `../../../sdkwork-specs/PAGINATION_SPEC.md` and runs `check-pagination.mjs`. Source configuration work loads `../../../sdkwork-specs/SOURCE_CONFIG_SPEC.md` and runs `check-source-config-standard.mjs`. Route projection work loads `../../../sdkwork-specs/MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 5.

## Human Review Rules

Human review is required for public API changes, security exceptions, database migrations, generated SDK ownership changes, destructive operations, and cross-application standards changes.
