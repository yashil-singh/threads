import ContentModal from "@/components/ContentModal";
import ImageSlider from "@/components/ImageSlider";
import ProfileImg from "@/components/ProfileImg";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import seperateUsername from "@/helpers/seperateUsername";
import { PostType, UserType } from "@/helpers/types";
import usePosts from "@/hooks/usePosts";
import useUsers from "@/hooks/useUsers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Post: React.FC = () => {
  const { postId } = useParams();
  const { getPostById } = usePosts();
  const { getProfile } = useUsers();

  const [post, setPost] = useState<PostType | null>(null);
  const [author, setAuthor] = useState<UserType | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [openImageModal, setOpenImageModal] = useState(false);

  const onOpenImageModal = () => {
    setOpenImageModal(true);
  };

  const fetchPostInfo = async () => {
    if (!postId) return;
    const response = await getPostById(postId);

    if (response.success) {
      const data = response.data;
      setPost(data.data);
    }

    setIsLoading(false);
  };

  const fetchUser = async () => {
    if (!post) return;
    const response = await getProfile(undefined, post.userId);
    if (response?.success) {
      setAuthor(response.data.data);
    }
  };

  useEffect(() => {
    fetchPostInfo();
  }, [postId]);

  useEffect(() => {
    fetchUser();
  }, [post]);

  if (!post || !author || isLoading) return <PostSkeleton />;

  return (
    <div className="space-y-3 p-3 md:p-0">
      <div className="flex items-center gap-3">
        <Link to={`/@${author.username}`} className="flex gap-3 items-center">
          <ProfileImg
            url={author?.profilePic}
            fallBackText={seperateUsername({ username: author.username }) || ""}
          />
          <h1 className="hover:underline">{author.username}</h1>
        </Link>
        <Label className="text-muted-foreground">
          {moment(post.createdAt).fromNow()}
        </Label>
      </div>

      <p>{post.content}</p>

      <ImageSlider media={post.media} onOpenImageModal={onOpenImageModal} />

      <Dialog open={openImageModal} onOpenChange={setOpenImageModal}>
        <DialogContent className="bg-transparent border-none max-w-full h-screen close-btn">
          <ContentModal media={post.media} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Post;
