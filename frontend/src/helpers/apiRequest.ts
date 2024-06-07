import axios from "axios";
import { BASE_URL } from "./constants";

interface ApiRequestProps {
  url: string;
  method: "post" | "get" | "put" | "delete";
  data?: any;
  withCredentials?: boolean;
}

export const api = axios.create({
  baseURL: BASE_URL,
  responseType: "json",
});

export const protectedApi = axios.create({
  baseURL: BASE_URL,
  responseType: "json",
  withCredentials: true,
});

export const apiRequest = async ({ url, method, data }: ApiRequestProps) => {
  try {
    const response = await protectedApi({ url, method, data });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        errors: error.response?.data.errors || [error.response?.data.message],
      };
    } else {
      return {
        success: false,
        errors: ["An unexpected error occurred."],
      };
    }
  }
};
