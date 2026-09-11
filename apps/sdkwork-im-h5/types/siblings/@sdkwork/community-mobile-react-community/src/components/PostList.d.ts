import React from "react";
import { Post } from "../types";
interface PostListProps {
    posts: Post[];
    onLike: (postId: string) => void;
    onCommentClick: (postId: string) => void;
}
export declare const PostList: React.FC<PostListProps>;
export {};
