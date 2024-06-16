import useUsers from "@/hooks/useUsers";
import React, { useEffect, useState } from "react";
import ProfileImg from "./ProfileImg";
import { Link } from "react-router-dom";
import moment from "moment";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { PostType, UserType } from "@/helpers/types";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import usePosts from "@/hooks/usePosts";
import useShowToast from "@/hooks/useShowToast";
import ImageSlider from "./ImageSlider";
import PostActions from "./PostActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import Icon from "./Icon";

interface Props {
  onOpenImageModal: (imageUrl: string) => void;
  onDeletePost: () => void;
}

interface PostCardProps extends PostType, Props {}

const PostCard: React.FC<PostCardProps> = ({
  _id,
  content,
  createdAt,
  likes,
  media,
  replies,
  reposts,
  userId,
  onOpenImageModal,
  onDeletePost,
}) => {
  const user = useRecoilValue(userAtom);
  const { getProfile } = useUsers();
  const { toggleLike, toggleRepost } = usePosts();
  const { showToast } = useShowToast();

  const [author, setAuthor] = useState<UserType | null>(null);

  // Count States
  const [likeCount, setLikeCount] = useState<number>(0);
  const [replyCount, setReplyCount] = useState<number>(0);
  const [repostCount, setRespostCount] = useState<number>(0);

  // Action States
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [hasReposted, setHasReposted] = useState<boolean>(false);

  // Animation States
  const [likeAnimation, setLikeAnimation] = useState<string>("");
  const [repostAnimation, setRepostAnimation] = useState<string>("");

  // State to avoid animation when first mounting
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setLikeCount(likes.length);
    setReplyCount(replies.length);
    setRespostCount(reposts.length);
    if (user) {
      setHasLiked(likes.includes(user?._id));
      setHasReposted(reposts.includes(user?._id));
    }
  }, [likes]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await toggleLike(_id);
    if (response.success) {
      if (hasLiked) {
        if (likeCount > 0) {
          setLikeCount(likeCount - 1);
        }
        setHasLiked(false);
        setLikeAnimation("like-removed");
      } else {
        setLikeCount(likeCount + 1);
        setHasLiked(true);
        setLikeAnimation("like-added");
      }
    } else {
      const errors = response.errors;
      errors.map((error: string) => {
        showToast({
          description: error,
          variant: "destructive",
        });
      });
    }
  };

  const handleRepost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await toggleRepost(_id);
    if (response.success) {
      showToast({
        description: response.data?.message,
      });
      if (hasReposted) {
        if (repostCount > 0) {
          setRespostCount(likeCount - 1);
        }
        setHasReposted(false);
        setRepostAnimation("like-removed");
      } else {
        setRespostCount(repostCount + 1);
        setHasReposted(true);
        setRepostAnimation("like-added");
      }
    } else {
      const errors = response.errors;
      errors.map((error: string) => {
        showToast({
          description: error,
          variant: "destructive",
        });
      });
    }
  };

  const fetchUser = async () => {
    const response = await getProfile(undefined, userId);
    if (response?.success) {
      setAuthor(response.data.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [_id]);
  return (
    <>
      {author && (
        <>
          <div className="flex gap-2 px-3 md:px-0 relative">
            <div className="flex flex-col items-center gap-5 overflow-hidden mb-5 min-w-[36px]">
              <Link to={`/@${author?.username}`} className="flex gap-3">
                <ProfileImg
                  url={author?.profilePic}
                  fallBackText={author?.username?.charAt(0)}
                />
              </Link>
              <Separator orientation="vertical" />
            </div>
            <div className="w-full">
              <Link
                to={`/post/${_id}`}
                className="flex gap-3 px-3 md:px-0 relative"
              >
                <div className="flex flex-col w-full items-start mb-2">
                  <div className="flex gap-2 items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                      <Link to={`/@${author?.username}`}>
                        <h1 className="hover:underline">{author?.username}</h1>
                      </Link>
                      <Label className="font-normal text-sm text-muted-foreground cursor-pointer">
                        {moment(createdAt).fromNow()}
                      </Label>
                    </span>
                  </div>

                  <p className="w-full">{content}</p>
                </div>
              </Link>
              <span className="absolute right-0 top-0">
                {user?._id === userId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="absolute -right-4 min-w-[200px] font-bold p-3">
                      <DropdownMenuItem
                        className=" py-5 text-base cursor-pointer flex items-center justify-between"
                        onClick={onDeletePost}
                      >
                        <p className="text-destructive">Delete</p>
                        <Icon
                          icon="trash"
                          className="text-destructive size-5"
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </span>
              {/* <Carousel> */}
              <ImageSlider media={media} onOpenImageModal={onOpenImageModal} />
              <PostActions
                user={user}
                likeCount={likeCount}
                replyCount={replyCount}
                repostCount={repostCount}
                handleLike={handleLike}
                handleRepost={handleRepost}
                hasLiked={hasLiked}
                isMounted={isMounted}
                likeAnimation={likeAnimation}
                repostAnimation={repostAnimation}
                postId={_id}
              />
            </div>
          </div>
          <Separator />
        </>
      )}
    </>
  );
};

export default PostCard;
