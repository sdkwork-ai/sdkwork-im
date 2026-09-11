export declare function asRecord(value: unknown): Record<string, unknown>;
type ReadKeyArg = string | string[] | number;
export declare function readString(record: Record<string, unknown>, ...args: ReadKeyArg[]): string;
export declare function readNumber(record: Record<string, unknown>, ...args: ReadKeyArg[]): number;
export declare function unwrapCourseBackendEnvelope<T = unknown>(value: unknown): T;
export declare function readRecords(value: unknown, collectionKeys: string[]): Record<string, unknown>[];
export declare function readSingleRecord(value: unknown): Record<string, unknown>;
export {};
