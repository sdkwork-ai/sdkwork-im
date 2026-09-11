use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SpaceGroupTransferOwnerRequest {
    #[serde(rename = "newOwnerUserId")]
    pub new_owner_user_id: String,
}
