import { apiRequest } from "@/helpers/apiRequest";

const useNotification = () => {
  const getNotification = async () => {
    return apiRequest({
      url: "/notification",
      method: "get",
    });
  };

  const readAllNotification = async () => {
    return apiRequest({
      url: "/notification",
      method: "put",
    });
  };

  return { getNotification, readAllNotification };
};

export default useNotification;
