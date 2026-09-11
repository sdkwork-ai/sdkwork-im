import React from "react";
interface CommunityHeaderProps {
    isSearching: boolean;
    setIsSearching: (val: boolean) => void;
    searchText: string;
    setSearchText: (val: string) => void;
    isPlusMenuOpen: boolean;
    setIsPlusMenuOpen: (val: boolean) => void;
}
export declare const CommunityHeader: React.FC<CommunityHeaderProps>;
export {};
