import { userAtom } from "@/atoms/userAtom";
import ContentModal from "@/components/ContentModal";
import CreatePost from "@/components/CreatePost";
import CreatePostButton from "@/components/CreatePostButton";
import PostCard from "@/components/PostCard";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PostType } from "@/helpers/types";
import usePosts from "@/hooks/usePosts";
import useShowToast from "@/hooks/useShowToast";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const Home: React.FC = () => {
  const user = useRecoilValue(userAtom);
  const { getPosts, postThread, deleteThread } = usePosts();
  const { showToast } = useShowToast();

  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<PostType[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // To open the create post modal
  const onOpenCreateModal = () => {
    if (user) {
      setOpenCreateModal(true);
    }
  };

  // To open post images
  const onOpenImageModal = (media) => {
    setOpenImageModal(true);
    setSelectedMedia(media);
  };

  // To post thread
  const onPostThread = async () => {
    setIsPosting(true);
    const response = await postThread(content, selectedFiles);
    if (response.success) {
      showToast({
        description: response.data.message,
      });
      setOpenCreateModal(false);
      setContent("");
      setSelectedFiles([]);
      fetchPosts();
    } else {
      const errors = response?.errors;
      errors.map((error: string) => {
        showToast({
          variant: "destructive",
          description: error,
        });
      });
    }
    setIsPosting(false);
  };

  const onDeletePost = async (postId: string) => {
    const response = await deleteThread(postId);

    if (response.success) {
      const data = response.data;
      showToast({
        description: data.message,
      });
      fetchPosts();
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

  // To fetch all posts
  const fetchPosts = async () => {
    const response = await getPosts();

    if (response.success) {
      const data = response?.data;

      setPosts(data.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // To reset create post fields
  useEffect(() => {
    if (!openCreateModal) {
      setSelectedFiles([]);
    }
  }, [openCreateModal]);

  return (
    <>
      {/* Main Content */}
      <main className="max-w-[600px] m-auto w-full space-y-2">
        {/* Create Post */}
        {user && (
          <>
            <CreatePostButton
              onOpenCreatePost={onOpenCreateModal}
              profilePic={user?.profilePic}
              username={user?.username}
            />
            <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
              <DialogContent className="bg-transparent border-0 p-0">
                <h1 className="text-center font-bold">New Thread</h1>
                <CreatePost
                  profilePic={user?.profilePic}
                  username={user?.username}
                  content={content}
                  setContent={setContent}
                  onPostThread={onPostThread}
                  selectedFile={selectedFiles}
                  setSelectedFile={setSelectedFiles}
                  isSubmitting={isPosting}
                />
              </DialogContent>
            </Dialog>
          </>
        )}

        <Separator />

        {/* Posts */}
        <div className="w-full relative min-h-[calc(100vh-250px)] py-5 space-y-5">
          {isLoading ? (
            <div className="flex flex-col gap-8">
              <PostSkeleton />
              <Skeleton className="w-full h-1" />
              <PostSkeleton />
              <Skeleton className="w-full h-1" />
              <PostSkeleton />
              <Skeleton className="w-full h-1" />
              <PostSkeleton />
              <Skeleton className="w-full h-1" />
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                _id={post?._id}
                content={post?.content}
                userId={post.userId}
                createdAt={post.createdAt}
                likes={post.likes}
                replies={post.replies}
                reposts={post.reposts}
                media={post.media}
                updatedAt={post.updatedAt}
                onOpenImageModal={() => onOpenImageModal(post.media)}
                onDeletePost={() => onDeletePost(post?._id)}
              />
            ))
          )}
          <Dialog open={openImageModal} onOpenChange={setOpenImageModal}>
            <DialogContent className="bg-black border-none max-w-full h-screen close-btn">
              <ContentModal media={selectedMedia} />
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </>
  );
};

export default Home;
