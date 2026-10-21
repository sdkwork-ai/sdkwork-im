//! SdkWorkApiResponse payload helpers (`API_SPEC.md` §14–16).

use sdkwork_im_keyset_cursor::{CursorScope, KeysetCursorError, KeysetPosition, keyset_page};
use sdkwork_routes_web_framework_backend_api::response::ApiProblem;
use sdkwork_utils_rust::{SdkWorkPageData, SdkWorkResourceData};

pub fn resource_item<T>(item: T) -> SdkWorkResourceData<T> {
    SdkWorkResourceData { item }
}

/// Keyset page response builder for SQL stores that fetch `LIMIT page_size + 1`.
///
/// `position_of` maps the last item to its `(created_at, entity_id)` keyset
/// position; the continuation cursor is signed and bound to the list scope.
pub fn keyset_list_page<T, F>(
    records: Vec<T>,
    page_size: usize,
    scope: &CursorScope<'_>,
    position_of: F,
) -> Result<SdkWorkPageData<T>, ApiProblem>
where
    F: Fn(&T) -> KeysetPosition,
{
    keyset_page(records, page_size, scope, position_of).map_err(|error: KeysetCursorError| {
        ApiProblem::bad_request(error.to_string())
    })
}
