import { apiRequest } from "@/helpers/apiRequest";

const usePosts = () => {
  const getPosts = async () => {
    return await apiRequest({
      url: "/post",
      method: "get",
    });
  };

  const getPostById = async (id: string) => {
    return await apiRequest({
      url: "/post/" + id,
      method: "get",
    });
  };

  const getPostByUserId = async (id: string) => {
    return await apiRequest({
      url: "/post/user/" + id,
      method: "get",
    });
  };

  const postThread = async (content: string, images: string[]) => {
    const data = {
      content,
      images,
    };

    return await apiRequest({
      url: "/post/create",
      method: "post",
      data: data,
    });
  };

  const deleteThread = async (postId: string) => {
    return apiRequest({
      method: "delete",
      url: "/post/" + postId,
    });
  };

  const toggleLike = async (id: string) => {
    return await apiRequest({
      url: "/post/toggle-like/" + id,
      method: "post",
    });
  };

  const toggleRepost = async (id: string) => {
    return await apiRequest({
      url: "/post/toggle-repost/" + id,
      method: "post",
    });
  };

  return {
    getPosts,
    getPostById,
    getPostByUserId,
    postThread,
    deleteThread,
    toggleLike,
    toggleRepost,
  };
};

export default usePosts;
