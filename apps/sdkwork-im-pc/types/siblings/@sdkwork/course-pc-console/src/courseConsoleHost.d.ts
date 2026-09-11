import type { SdkworkBackendClient } from '@sdkwork/course-backend-sdk';
export interface CourseConsolePcHost {
    getBackendClientWithSession: () => SdkworkBackendClient;
}
export declare function configureCourseConsolePcHost(host: CourseConsolePcHost): void;
export declare function getCourseConsolePcHost(): CourseConsolePcHost;
export declare function resetCourseConsolePcHost(): void;
