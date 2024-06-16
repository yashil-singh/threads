import { userAtom } from "@/atoms/userAtom";
import ProfileImg from "@/components/ProfileImg";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useUsers from "@/hooks/useUsers";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FollowerCard from "@/components/FollowerCard";
import seperateUsername from "@/helpers/seperateUsername";
import NotFound from "./NotFound";
import SubmitBtn from "@/components/SubmitBtn";
import EditProfile from "@/components/EditProfile";
import { formatNumber } from "@/helpers/formatNumber";
import usePosts from "@/hooks/usePosts";
import { PostType } from "@/helpers/types";
import { Separator } from "@/components/ui/separator";
import PostCard from "@/components/PostCard";
import { Loader } from "@/components/Loader";
import PostSkeleton from "@/components/skeleton/PostSkeleton";
import ContentModal from "@/components/ContentModal";

interface Profile {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePic: string;
  bio: string;
  createdAt: string;
  followers: string[];
  following: string[];
  requestReceived: string[];
  requestSent: string[];
  isFrozen: boolean;
  isPrivate: boolean;
}

const Profile: React.FC = () => {
  const user = useRecoilValue(userAtom);

  const { username } = useParams();

  // Hooks
  const { getProfile, getFollowerById, getFollowingById, followAccount } =
    useUsers();
  const { getPostByUserId } = usePosts();
  const navigate = useNavigate();

  // Page related States
  const [profile, setProfile] = useState<Profile>({
    _id: "",
    name: "",
    username: "",
    email: "",
    profilePic: "",
    bio: "",
    createdAt: "",
    followers: [],
    following: [],
    requestReceived: [],
    requestSent: [],
    isFrozen: false,
    isPrivate: false,
  });
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // Modal related States
  const [openFollowerModal, setOpenFollowerModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<"follower" | "following">(
    "follower"
  );
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const checkFollowing = () => {
    if (isCurrentUser) return true;
    if (!profile?.isPrivate) return true;
    if (!profile?.followers) return false;
    return profile?.followers?.includes(user?._id ?? "");
  };

  const onOpenFollowerCard = (card: "follower" | "following") => {
    if (!user) {
      navigate("/login");
    } else {
      const isFollowing = checkFollowing();

      if (isFollowing) {
        setOpenFollowerModal(true);
        setSelectedCard(card);
      } else {
        setOpenFollowerModal(false);
      }
    }
  };

  const onFollowAccount = async (id: string) => {
    setIsToggling(true);
    const response = await followAccount(id);

    if (response.success) {
      fetchProfile();
      fetchFollowers();
      fetchFollowing();
    }
    setIsToggling(false);
  };

  const fetchProfile = async () => {
    const response = await getProfile(username ?? "");

    if (!response) return;

    if (response.success) {
      setProfile(response?.data.data);
    }
  };

  const fetchFollowers = async () => {
    if (profile?._id) {
      const response = await getFollowerById(profile._id);

      if (response.success) {
        setFollowers(response.data.data);
      }
    }
  };

  const fetchFollowing = async () => {
    if (profile?._id) {
      const response = await getFollowingById(profile._id);

      if (response.success) {
        setFollowing(response.data.data);
      }
    }
  };

  const fetchPosts = async () => {
    if (profile?._id) {
      const response = await getPostByUserId(profile?._id);

      if (response.success) {
        setPosts(response.data.data);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);

    fetchFollowers();
    fetchFollowing();
    fetchPosts();

    setIsLoading(false);
  }, [profile]);

  useEffect(() => {
    fetchProfile();
    if (
      user &&
      user?.username === seperateUsername({ username: username || "" })
    ) {
      setIsCurrentUser(true);
    } else {
      setIsCurrentUser(false);
    }
  }, [username]);

  if (!username) return <NotFound />;

  return (
    <>
      <div className="px-3 md:px-0 space-y-5">
        {/* Profile Info */}
        <div className="flex justify-between items-center">
          <span>
            <h1 className="font-bold text-2xl">{profile?.name}</h1>
            <h2>@{profile.username}</h2>
          </span>
          <Dialog>
            <DialogTrigger>
              <ProfileImg
                url={profile?.profilePic}
                fallBackText={profile?.username}
                height={100}
                width={100}
                font={28}
                className="hover:scale-105 active:scale-95 transition-all duration-300"
              />
            </DialogTrigger>
            <DialogContent className="bg-transparent border-none p-0 m-0 flex items-center justify-center">
              <ProfileImg
                url={profile?.profilePic}
                fallBackText={profile?.username}
                className="max-w-full w-full h-full"
                width={300}
                height={300}
                font={80}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Bio */}
        <div className="w-full">
          <Label>{profile?.bio}</Label>
        </div>

        {/* Followers Card */}
        <div className="flex gap-2 text-muted-foreground text-sm items-center">
          <Dialog open={openFollowerModal} onOpenChange={setOpenFollowerModal}>
            <button
              className="hover:underline"
              onClick={() => onOpenFollowerCard("follower")}
            >
              {formatNumber(profile?.followers?.length)} Followers
            </button>
            ·
            <button
              className="hover:underline"
              onClick={() => onOpenFollowerCard("following")}
            >
              {formatNumber(profile?.following?.length)} Following
            </button>
            <DialogContent className="bg-transparent border-0 p-0 min-h-[350px]">
              <FollowerCard
                selectedCard={selectedCard}
                followers={followers}
                following={following}
                onVisitProfile={() => setOpenFollowerModal(false)}
                onToggleFollow={onFollowAccount}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Follow Activity */}
        {user ? (
          isCurrentUser ? (
            // Edit Profile
            <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setOpenEditModal(true)}
              >
                Edit Profile
              </Button>
              <DialogContent className="bg-transparent border-0 p-0">
                <EditProfile />
              </DialogContent>
            </Dialog>
          ) : // Following Case
          profile?.followers?.includes(user?._id ?? "") ? (
            <SubmitBtn
              text="Following"
              variant="outline"
              className="w-full"
              onClick={() => onFollowAccount(profile?._id)}
              isSubmitting={isToggling}
            />
          ) : profile?.isPrivate ? (
            profile?.requestReceived?.includes(user?._id ?? "") ? (
              <SubmitBtn
                text="Requested"
                variant="outline"
                className="w-full"
                onClick={() => onFollowAccount(profile?._id)}
                isSubmitting={isToggling}
              />
            ) : (
              <SubmitBtn
                text="Follow"
                className="w-full"
                onClick={() => onFollowAccount(profile?._id)}
                isSubmitting={isToggling}
              />
            )
          ) : (
            <SubmitBtn
              text="Follow"
              className="w-full"
              onClick={() => onFollowAccount(profile?._id)}
              isSubmitting={isToggling}
            />
          )
        ) : (
          <></>
        )}

        <Separator />

        {isLoading ? (
          <div className="space-y-8">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              _id={post._id}
              content={post.content}
              createdAt={post.createdAt}
              likes={post.likes}
              media={post.media}
              onOpenImageModal={() => {
                setOpenImageModal(true);
                setSelectedMedia(post.media);
              }}
              replies={post.replies}
              reposts={post.reposts}
              updatedAt={post.updatedAt}
              userId={post.userId}
            />
          ))
        )}
      </div>

      <Dialog open={openImageModal} onOpenChange={setOpenImageModal}>
        <DialogContent className="bg-black border-none max-w-full h-screen close-btn">
          <ContentModal media={selectedMedia} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
