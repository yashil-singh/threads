import { userAtom } from "@/atoms/userAtom";
import CreatePost from "@/components/CreatePost";
import CreatePostButton from "@/components/CreatePostButton";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import usePosts from "@/hooks/usePosts";
import useShowToast from "@/hooks/useShowToast";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const Home: React.FC = () => {
  const user = useRecoilValue(userAtom);
  const { getPosts, postThread } = usePosts();
  const { showToast } = useShowToast();

  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const onOpenCreateModal = () => {
    if (user) {
      setOpenCreateModal(true);
    }
  };

  const onOpenImageModal = (imageUrl: string, e) => {
    e.preventDefault();
    setOpenImageModal(true);
    setSelectedImage(imageUrl);
  };

  const onPostThread = async () => {
    const response = await postThread(content);
    if (response.success) {
      showToast({
        description: response.data.message,
      });
      setOpenCreateModal(false);
      setContent("");
      fetchPosts();
    } else {
      const errors = response?.errors;
      errors.map((error) => {
        showToast({
          variant: "destructive",
          description: error,
        });
      });
    }
  };

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
                />
              </DialogContent>
            </Dialog>
          </>
        )}

        <Separator />

        <div className="w-full relative min-h-[calc(100vh-250px)] py-5 space-y-5">
          {isLoading ? (
            <div className="absolute top-1/2 left-1/2">
              <Loader size={32} stroke={2} />
            </div>
          ) : (
            posts.map((post) => (
              <>
                <Post
                  _id={post?._id}
                  content={post?.content}
                  userId={post.userId}
                  createdAt={post.createdAt}
                  likes={post.likes}
                  replies={post.replies}
                  media={post.media}
                  updatedAt={post.updatedAt}
                  onOpenImageModal={onOpenImageModal}
                />
                <Separator />
                <Dialog open={openImageModal} onOpenChange={setOpenImageModal}>
                  <DialogContent className="bg-transparent border-none max-w-full h-screen close-btn">
                    <img
                      src={selectedImage}
                      className="rounded-lg object-contain m-auto md:max-w-[80%]"
                    />
                  </DialogContent>
                </Dialog>
              </>
            ))
          )}
        </div>

        {/* Posts */}
      </main>
    </>
  );
};

export default Home;
