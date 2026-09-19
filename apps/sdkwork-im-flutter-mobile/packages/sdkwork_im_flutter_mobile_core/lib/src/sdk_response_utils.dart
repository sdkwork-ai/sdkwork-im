import 'package:im_sdk_generated/im_sdk_generated.dart';
import 'package:sdkwork_common_flutter/sdkwork_common_flutter.dart' as common;

/// IM-facing readers for the canonical SDKWork response envelope.
///
/// Envelope navigation itself lives in `sdkwork_common_flutter`; this file only
/// binds those helpers to the generated IM models so every IM capability
/// package reads a list or single response the same way.
///
/// Callers pass the already-extracted `data` object (`response.data`).

/// Reads a JSON object from an SDK response payload without assuming the
/// generic type arguments the generated client erases.
Map<String, dynamic>? readSdkMap(dynamic value) => common.asJsonMap(value);

/// Empty cursor `pageInfo` used when a response omits the field.
PageInfo emptyCursorPageInfo() => PageInfo(mode: 'cursor', hasMore: false);

/// Reads `data.pageInfo` from a list envelope.
PageInfo readPageInfoFromSdkData(dynamic data) {
  final pageInfoMap = common.readEnvelopePageInfo(data);
  if (pageInfoMap == null) {
    return emptyCursorPageInfo();
  }
  return PageInfo.fromJson(pageInfoMap);
}

/// Reads `data.items[]` from a list envelope.
List<T> readItemsFromSdkData<T>(
  dynamic data,
  T Function(Map<String, dynamic> json) decode,
) {
  return common.decodeEnvelopeItems<T>(data, decode);
}

/// Reads `data.item` from a single-resource envelope.
T? readItemFromSdkData<T>(
  dynamic data,
  T Function(Map<String, dynamic> json) decode,
) {
  return common.decodeEnvelopeItem<T>(data, decode);
}
