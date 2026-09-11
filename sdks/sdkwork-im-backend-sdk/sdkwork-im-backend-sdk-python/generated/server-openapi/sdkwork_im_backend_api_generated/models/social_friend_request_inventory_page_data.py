from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .page_info import PageInfo
    from .social_friend_request_inventory_item import SocialFriendRequestInventoryItem


@dataclass
class SocialFriendRequestInventoryPageData:
    items: List[SocialFriendRequestInventoryItem]
    page_info: PageInfo
