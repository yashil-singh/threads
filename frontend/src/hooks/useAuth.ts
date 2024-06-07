import { apiRequest } from "@/helpers/apiRequest";

const useAuth = () => {
  interface loginProps {
    username: string;
    password: string;
  }
  const login = async ({ username, password }: loginProps) => {
    const data = {
      username,
      password,
    };
    return await apiRequest({
      url: "/auth/login",
      method: "post",
      data,
    });
  };

  const signup = async () => {
    return await apiRequest({
      url: "/auth/signup",
      method: "post",
    });
  };

  const googleSignup = async (username: string) => {
    return await apiRequest({
      url: "/auth/google/success/" + username,
      method: "post",
    });
  };

  const logout = async () => {
    return await apiRequest({
      url: "/auth/logout",
      method: "post",
      withCredentials: true,
    });
  };

  const checkSession = async () => {
    return await apiRequest({
      url: "/auth/check-session",
      method: "get",
      withCredentials: true,
    });
  };

  return { login, signup, googleSignup, logout, checkSession };
};

export default useAuth;
