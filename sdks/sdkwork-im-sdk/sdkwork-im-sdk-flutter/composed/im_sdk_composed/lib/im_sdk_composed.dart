/// Composed Sdkwork IM Flutter SDK (realtime + generated transport).
///
/// This library is the consumer facade: application packages import only
/// `package:im_sdk_composed/im_sdk_composed.dart` — never the
/// `im_sdk_generated` transport package directly (APP_SDK_INTEGRATION_SPEC §9
/// composed-facade rule).
library im_sdk_composed;

export 'package:im_sdk_generated/im_sdk_generated.dart';
export 'package:sdkwork_common_flutter/sdkwork_common_flutter.dart' show SdkConfig;

export 'src/ccp_wire.dart';
export 'src/im_realtime.dart';
export 'src/im_sdk_client.dart';
export 'src/transport.dart';
export 'src/transport_selector.dart';
export 'src/transports/tcp_transport.dart';
export 'src/transports/udp_transport.dart';
export 'src/transports/websocket_transport.dart';
