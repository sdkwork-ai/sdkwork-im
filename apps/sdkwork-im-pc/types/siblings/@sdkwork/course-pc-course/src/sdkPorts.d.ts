import type { SdkworkAppClient } from '@sdkwork/course-app-sdk';
export interface CourseHostSessionUser {
    displayName?: string;
    nickname?: string;
    name?: string;
    avatar?: string;
}
export interface CourseHostSessionSnapshot {
    user?: CourseHostSessionUser;
}
export interface CoursePcSdkPorts {
    getCourseClient: () => SdkworkAppClient;
    readHostSession: () => CourseHostSessionSnapshot | null;
    subscribeHostSession?: (listener: () => void) => () => void;
    resolveHostLanguage?: () => string;
    subscribeHostLanguage?: (listener: (language: string) => void) => () => void;
}
export declare function configureCoursePcSdkPorts(ports: CoursePcSdkPorts): void;
export declare function getCoursePcSdkPorts(): CoursePcSdkPorts;
export declare function tryGetCoursePcSdkPorts(): CoursePcSdkPorts | null;
