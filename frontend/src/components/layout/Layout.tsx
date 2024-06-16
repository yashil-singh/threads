import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useSocket } from "@/context/SocketContext";
import useShowToast from "@/hooks/useShowToast";
import { useRecoilState } from "recoil";
import {
  newNotificationAtom,
  notificationAtom,
} from "@/atoms/notificationAtom";
import useNotification from "@/hooks/useNotification";

const Layout: React.FC = () => {
  const { socket } = useSocket();
  const { showToast } = useShowToast();
  const { getNotification } = useNotification();
  const [notifications, setNotifications] = useRecoilState(notificationAtom);
  const [newNotification, setNewNotification] =
    useRecoilState(newNotificationAtom);

  const fetchNotifications = async () => {
    const response = await getNotification();
    if (response.success) {
      const data = response.data;
      const notif = data.data;
      setNotifications(notif);
      const hasUnread = notif.some((notification) => !notification.read);
      setNewNotification(hasUnread);
    }
  };

  useEffect(() => {
    socket?.on("receiveNotification", (data) => {
      // showToast({
      //   description: data.message,
      // });
      fetchNotifications();
    });
    fetchNotifications();
  }, [socket]);

  return (
    <div className="md:mx-[10%] 2xl:mx-[18%]">
      <Navbar />
      <div className="pb-5 md:pt-8 w-full max-w-[600px] m-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
