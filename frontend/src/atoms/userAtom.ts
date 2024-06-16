import { UserType } from "@/helpers/types";
import { atom } from "recoil";

export const userAtom = atom<UserType | null>({
  key: "userAtom",
  default: null,
});
