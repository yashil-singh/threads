import { apiRequest } from "@/helpers/apiRequest";

interface updateProfileProps {
  name: string;
  username: string;
  bio: string;
  isPrivate: boolean;
  profilePic: string | null;
}

const useUsers = () => {
  const getProfile = async (usernameWithAt?: string, userId?: string) => {
    let query;
    if (!userId) {
      if (!usernameWithAt || !usernameWithAt.includes("@")) return null;
      query = usernameWithAt.split("@")[1];
    } else {
      query = userId;
    }
    return await apiRequest({
      method: "get",
      url: "/user/profile/" + query,
    });
  };

  const getFollowerById = async (id: string) => {
    return await apiRequest({
      method: "get",
      url: "/user/followers/" + id,
    });
  };

  const getFollowingById = async (id: string) => {
    return await apiRequest({
      method: "get",
      url: "/user/following/" + id,
    });
  };

  const followAccount = async (id: string) => {
    return await apiRequest({
      method: "post",
      url: "/user/toggle-follow/" + id,
    });
  };

  const updateProfile = async ({
    name,
    username,
    bio,
    isPrivate,
    profilePic,
  }: updateProfileProps) => {
    let data;
    if (profilePic) {
      data = {
        name,
        username,
        bio,
        isPrivate,
        profilePic,
      };
    } else {
      data = {
        name,
        username,
        bio,
        isPrivate,
      };
    }

    return await apiRequest({
      method: "put",
      url: "/user/update",
      data: data,
    });
  };

  const searchProfile = async (query: string) => {
    return await apiRequest({
      method: "get",
      url: "/user/search?query=" + query,
    });
  };

  return {
    getProfile,
    getFollowerById,
    getFollowingById,
    followAccount,
    updateProfile,
    searchProfile,
  };
};

export default useUsers;
