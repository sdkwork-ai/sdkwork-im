# Stream and RTC

## Goal

This example shows how realtime data-plane traffic and RTC call sessions fit together in the IM
consumer SDK.

## Modules Involved

This scenario uses the realtime WebSocket plane and the RTC provider runtime. There is no streams
REST surface involved: the IM streams REST routes were pruned from the open-api authority, so
stream-shaped application data flows over the realtime connection.

## Flow

The final version of this page will show a realistic coordination path: open the realtime
connection with `sdk.connect(...)`, run catch-up with `sdk.sync.catchUp(...)`, then start an RTC
session through the RTC SDK while realtime events keep flowing.

## Related Pages

Continue with the streams and realtime module pages, then the RTC SDK page.
