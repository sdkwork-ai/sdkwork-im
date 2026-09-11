import type { CoursePcSdkPorts } from './sdkPorts';
export interface ConfigureCoursePcRuntimeOptions {
    sdkPorts: CoursePcSdkPorts;
}
export declare function configureCoursePcRuntime(options: ConfigureCoursePcRuntimeOptions): void;
