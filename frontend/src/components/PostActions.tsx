import React from "react";
import { Button } from "./ui/button";
import { UserType } from "@/helpers/types";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import FormatedNumber from "./FormatedNumber";

interface PostActionsProps {
  postId: string;
  user: UserType | null;
  replyCount: number;
  repostCount: number;
  hasLiked: boolean;
  handleLike: () => void;
  handleRepost: () => void;
  likeCount: number;
  isMounted: boolean;
  likeAnimation: string;
  repostAnimation: string;
}

const PostActions: React.FC<PostActionsProps> = ({
  postId,
  user,
  replyCount,
  repostCount,
  hasLiked,
  handleLike,
  handleRepost,
  likeCount,
  isMounted,
  likeAnimation,
  repostAnimation,
}) => {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/login");
  };
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center justify-center px-2 rounded-full hover:bg-muted gap-1"
        onClick={user ? handleLike : navigateToLogin}
      >
        {hasLiked ? (
          <Icon icon="heart" className="size-5 fill-red-500 text-red-500" />
        ) : (
          <Icon icon="heart" className="size-5 text-white" />
        )}

        {likeCount > 0 && (
          <FormatedNumber
            className={`text-white ${isMounted ? likeAnimation : ""}`}
            number={likeCount}
          />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center justify-center px-2 rounded-full hover:bg-muted gap-1"
        onClick={() => {}}
      >
        <Icon icon="comment" className="size-5 text-white" />
        {replyCount > 0 && (
          <FormatedNumber
            className={`text-white ${isMounted ? likeAnimation : ""}`}
            number={replyCount}
          />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center justify-center px-2 rounded-full hover:bg-muted gap-1"
        onClick={user ? handleRepost : navigateToLogin}
      >
        <Icon icon="repost" className="size-5 text-white" />
        {repostCount > 0 && (
          <FormatedNumber
            className={`text-white ${isMounted ? repostAnimation : ""}`}
            number={repostCount}
          />
        )}
      </Button>
      <Link to={`/post/${postId}`} className="w-full" />
    </div>
  );
};

export default PostActions;
