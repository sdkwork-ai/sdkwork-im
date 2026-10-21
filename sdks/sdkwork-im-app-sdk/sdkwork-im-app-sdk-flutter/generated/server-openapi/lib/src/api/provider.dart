import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class ProviderApi {
  final HttpClient _client;

  ProviderApi(this._client);

  /// Retrieve media provider health
  Future<MediaHealthRetrieveResponse?> mediaHealthRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/media/provider_health'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : MediaHealthRetrieveResponse.fromJson(map);
    })();
  }
}
