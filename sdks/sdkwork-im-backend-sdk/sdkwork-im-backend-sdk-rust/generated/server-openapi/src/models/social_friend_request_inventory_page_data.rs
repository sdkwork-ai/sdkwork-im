use serde::{Deserialize, Serialize};

use crate::models::{PageInfo, SocialFriendRequestInventoryItem};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SocialFriendRequestInventoryPageData {
    pub items: Vec<SocialFriendRequestInventoryItem>,

    #[serde(rename = "pageInfo")]
    pub page_info: PageInfo,
}
