import { atom } from "recoil";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePic: string;
  followers: string[];
  following: string[];
  requestSent: string[];
  requestReceived: string[];
  bio: string;
  isPrivate: boolean;
  isFrozen: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const userAtom = atom<User | null>({
  key: "userAtom",
  default: null,
});
