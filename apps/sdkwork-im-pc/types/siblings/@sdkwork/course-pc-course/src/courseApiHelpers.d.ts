export declare function asRecord(value: unknown): Record<string, unknown> | null;
export declare function readOptionalString(record: Record<string, unknown>, ...keys: string[]): string | undefined;
export declare function readString(record: Record<string, unknown>, ...keys: string[]): string;
export declare function readNumber(record: Record<string, unknown>, ...keys: string[]): number | undefined;
export declare function extractCoursePayload(payload: unknown): Record<string, unknown> | null;
export declare function extractCourseItems(payload: unknown): Record<string, unknown>[];
export declare function extractCourseEntity(payload: unknown): Record<string, unknown> | null;
export declare function courseOperationData(payload: unknown): Record<string, unknown> | null;
