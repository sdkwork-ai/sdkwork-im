# sdkwork_im_flutter_mobile_contacts Specs

This directory is the local spec index for the Flutter mobile contacts capability package.

Authority:

- `component.spec.json` is the machine-readable package contract.
- Global rules remain in `../../../../../../sdkwork-specs/`; this directory links to them and does not copy their text.

Package role:

- Owns the address book, friend request (new friends), add friend, and organization directory screens plus their services.
- Consumes IM SDK capability through core/composed SDK boundaries.
- Does not construct SDK clients, persist auth/session credentials, or open chat conversations (the host root owns that navigation).
- Degrades the organization directory explicitly: the tree is served by the IAM SDK, which this root does not bundle.

Platform notes:

- `social.contacts.list` exposes no `q` parameter on this surface, so the address book searches the retained window locally instead of issuing a server-side search the contract does not offer.
- Display names resolve from `ContactView.remark`, then `ContactView.displayName`, then the raw target user id.

Verification:

- `flutter analyze` from `apps/sdkwork-im-flutter-mobile`
- `flutter test` from `apps/sdkwork-im-flutter-mobile`
- `node ../sdkwork-specs/tools/check-pagination.mjs --workspace .` from the repository root when list behavior changes
