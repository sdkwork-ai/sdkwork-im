export type CourseCategory = 'all' | 'live' | 'design' | 'frontend' | 'backend' | 'ai';
export interface CourseMessage {
    id: number;
    user: string;
    text: string;
    time: string;
    isPro: boolean;
}
export interface CourseComment {
    id: number;
    user: string;
    avatar: string;
    text: string;
    time: string;
    likes: number;
    isLiked: boolean;
}
export interface CourseLesson {
    id: string;
    title: string;
    duration: string;
    status: 'completed' | 'playing' | 'locked';
}
export interface CourseChapter {
    title: string;
    lessons: CourseLesson[];
}
export interface Course {
    id: string;
    title: string;
    instructor: string;
    type: 'video' | 'live';
    level: string;
    duration: string;
    students: number;
    viewers: number;
    updatedAt?: string;
    cover: string;
    category: CourseCategory;
    rating: number;
    progress: number;
    tags?: string[];
    chapters?: CourseChapter[];
    messages?: CourseMessage[];
    comments?: CourseComment[];
}
declare class SdkworkCourseService {
    private client;
    getCourses(): Promise<Course[]>;
    getFeaturedCourse(): Promise<Course | null>;
    getCourseDetail(courseId: string): Promise<Course | null>;
}
export declare const courseService: SdkworkCourseService;
declare const PC_COURSE_COMMENTS_UNAVAILABLE = "pc course comments contract is not available";
declare const PC_COURSE_LIVE_CHAT_UNAVAILABLE = "pc course live chat contract is not available";
export interface CourseInteractionService {
    createComment(_courseId: string, _content: string): Promise<void>;
    sendLiveMessage(_courseId: string, _content: string): Promise<void>;
}
declare class SdkworkCourseInteractionService implements CourseInteractionService {
    createComment(_courseId: string, _content: string): Promise<void>;
    sendLiveMessage(_courseId: string, _content: string): Promise<void>;
}
export declare const courseInteractionService: SdkworkCourseInteractionService;
export { PC_COURSE_COMMENTS_UNAVAILABLE, PC_COURSE_LIVE_CHAT_UNAVAILABLE };
