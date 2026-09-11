import React from "react";
interface SuccessModalProps {
    isPaid?: boolean;
    communityName: string;
    hasGroups: boolean;
    onClose: () => void;
    onEnterGroups: () => void;
    onEnterResources: () => void;
}
export declare const SuccessModal: React.FC<SuccessModalProps>;
export {};
