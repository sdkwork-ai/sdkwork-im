# Streams

## What This Module Is For

This page covers ordered application-data streams as they are delivered today: through the
realtime WebSocket plane, not through a dedicated streams REST surface.

The former IM streams REST routes (`/im/v3/api/streams/*`) were pruned from the open-api
authority. `sdkwork-im-sdk` therefore exposes no streams REST operations, and the app-api
`/app/v3/api/streams` route is a mount descriptor only, with no documented HTTP operation.

## Public Entrypoints

Use the realtime module entrypoints for stream-shaped traffic:

- live push through `sdk.connect(...)`
- durable replay through `sdk.sync.catchUp(...)`
- route-level HTTP control through `sdk.realtime.*` only when exact transport alignment is needed

## API Mapping

- Realtime WebSocket plane: `/im/v3/api/realtime/ws` (manual-owned upgrade route, excluded from
  generated HTTP transports).
- Session and realtime HTTP alignment: `/api-reference/im/session-and-realtime`.

## Common Workflows

Typical flows include opening the realtime connection, subscribing to ordered events, appending
application frames to the live feed, checkpointing through durable catch-up, and completion
acknowledgements.

## Ownership and Status

The realtime module owns connection lifecycle and ordered delivery. There is no current streams
REST authority to generate from; do not document or call streams REST endpoints that the
authorities no longer declare.

## Example

Use this page together with the stream and RTC example, which coordinates the realtime plane
with RTC sessions.
