import React from "react";
import { Post } from "../types";
interface PostItemProps {
    post: Post;
    onLike: (postId: string) => void;
    onCommentClick: (postId: string) => void;
}
export declare const PostItem: React.FC<PostItemProps>;
export {};
