import { atom } from "recoil";

export const notificationAtom = atom({
  key: "notificationAtom",
  default: [],
});

export const newNotificationAtom = atom({
  key: "newNotificationAtom",
  default: false,
});
