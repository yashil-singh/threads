import { apiRequest } from "@/helpers/apiRequest";

const usePosts = () => {
  const getPosts = async () => {
    return await apiRequest({
      url: "/post",
      method: "get",
    });
  };
  const postThread = async (content: string) => {
    const data = {
      content,
    };
    return await apiRequest({
      url: "/post/create",
      method: "post",
      data: data,
    });
  };

  return { getPosts, postThread };
};

export default usePosts;
