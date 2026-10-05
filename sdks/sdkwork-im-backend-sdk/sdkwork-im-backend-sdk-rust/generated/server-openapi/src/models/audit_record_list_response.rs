use serde::{Deserialize, Serialize};

use crate::models::{AuditRecordView, PageInfo};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AuditRecordListResponse {
    pub items: Vec<AuditRecordView>,

    #[serde(rename = "pageInfo")]
    pub page_info: PageInfo,
}
