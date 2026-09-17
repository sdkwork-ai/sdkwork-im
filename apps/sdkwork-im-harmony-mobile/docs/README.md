# Documentation Canon

- [README.md](../README.md)
- [AGENTS.md](../AGENTS.md)

HarmonyOS-specific design notes, package taxonomy decisions, and host adapter
boundaries are recorded here as the root matures.

## Route identity

The chat routes contributed by
`packages/sdkwork-im-harmony-mobile-chat/src/main/ets/routes/RouteContributions.ets`
carry the same route ids as the H5, mini program, and PC roots
(`app.communication.chat.inbox`, `app.communication.chat.conversation`,
`app.communication.chat.create-group`). Only the physical page path differs, per
`APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md` section 7.

`app.communication.session.login` is root-owned. H5 authenticates through the IAM
H5 surface and declares no login route, so there is no H5 id for it to share;
the shell authors it here and the mini program shell authors it separately.
