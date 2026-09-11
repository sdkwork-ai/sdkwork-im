export interface ConsoleCourseItem {
    id: string;
    courseCode: string;
    title: string;
    status: string;
    studentsCount: number;
    lessonsCount: number;
    category?: string;
    instructor?: string;
}
export interface ConsoleCourseListResult {
    items: ConsoleCourseItem[];
    total: number;
}
export interface CreateConsoleCourseInput {
    title: string;
    subtitle?: string;
    description?: string;
}
export interface ConsoleCourseCategoryItem {
    id: string;
    name: string;
    slug: string;
    status: string;
    sortOrder: number;
}
export interface ConsoleCourseCategoryListResult {
    items: ConsoleCourseCategoryItem[];
    total: number;
}
export interface CreateConsoleCourseCategoryInput {
    name: string;
    slug?: string;
    description?: string;
}
export interface ConsoleCourseSectionItem {
    id: string;
    courseId: string;
    title: string;
    lessonCount: number;
    sortOrder: number;
    status: string;
}
export interface ConsoleCourseLessonItem {
    id: string;
    courseId: string;
    sectionId?: string;
    title: string;
    durationSeconds: number;
    freePreview: boolean;
    status: string;
    /** Lesson form: vod_video / live_session / article / download / quiz / assignment. */
    kind?: string;
    /** External source id (e.g. bilibili BV id) for connected lessons. */
    externalSourceId?: string;
    /** External source provider (`bilibili`, `manual`, ...). */
    sourceProvider?: string;
}
export interface CreateConsoleCourseSectionInput {
    title: string;
    description?: string;
}
export interface CreateConsoleCourseLessonInput {
    title: string;
    sectionId?: string;
    description?: string;
    freePreview?: boolean;
    /** Lesson form: vod_video / live_session / article / download / quiz / assignment. */
    kind?: string;
    /** External source id (e.g. bilibili BV id) for connected lessons. */
    externalSourceId?: string;
    /** External source provider (`bilibili`, `manual`, ...). */
    sourceProvider?: string;
}
export declare const courseConsoleService: {
    listCourses(params?: {
        q?: string;
        status?: string;
        limit?: number;
    }): Promise<ConsoleCourseListResult>;
    createCourse(input: CreateConsoleCourseInput): Promise<ConsoleCourseItem>;
    publishCourse(courseId: string): Promise<ConsoleCourseItem>;
    unpublishCourse(courseId: string): Promise<ConsoleCourseItem>;
    listCategories(params?: {
        q?: string;
        limit?: number;
    }): Promise<ConsoleCourseCategoryListResult>;
    createCategory(input: CreateConsoleCourseCategoryInput): Promise<ConsoleCourseCategoryItem>;
    listSections(courseId: string): Promise<ConsoleCourseSectionItem[]>;
    createSection(courseId: string, input: CreateConsoleCourseSectionInput): Promise<ConsoleCourseSectionItem>;
    listLessons(courseId: string): Promise<ConsoleCourseLessonItem[]>;
    createLesson(courseId: string, input: CreateConsoleCourseLessonInput): Promise<ConsoleCourseLessonItem>;
    attachLessonResource(lessonId: string, file: File): Promise<{
        driveResourceId: string;
        fileName: string;
    }>;
};
