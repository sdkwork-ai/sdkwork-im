export declare function isDesktopSecureSessionStorageEnabled(): boolean;
export declare function readDesktopSecureSessionRawValue(): Promise<string | null>;
export declare function writeDesktopSecureSessionRawValue(_value: string): Promise<void>;
export declare function clearDesktopSecureSessionRawValue(): Promise<void>;
