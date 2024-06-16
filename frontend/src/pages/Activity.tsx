import { notificationAtom } from "@/atoms/notificationAtom";
import ProfileImg from "@/components/ProfileImg";
import { Separator } from "@/components/ui/separator";
import useNotification from "@/hooks/useNotification";
import moment from "moment";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";

const Activity: React.FC = () => {
  const [notifications, setNotifications] = useRecoilState(notificationAtom);

  const { getNotification } = useNotification();

  const fetchNotifications = async () => {
    const response = await getNotification();
    if (response.success) {
      const data = response.data;
      setNotifications(data.data);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {notifications.map((notif) => (
        <Link
          to={
            notif.postId
              ? `/post/${notif.postId}`
              : `/@${notif.message.split(" ")[0]}`
          }
          className="space-y-5"
        >
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <Link
                to={`/@${notif.userId}`}
                className="hover:scale-105 active:scale-95 duration-300 transition-all"
              >
                <ProfileImg
                  url={notif.profilePic}
                  height={36}
                  width={36}
                  fallBackText={notif.message.charAt(0)}
                />
              </Link>
              <div className="space-y-1">
                <p className="text-ellipsis line-clamp-3">
                  {notif.message} {notif.content && `: ${notif.content}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {moment(notif.createdAt).fromNow()}
                </p>
              </div>
            </div>
            <img
              src={notif.thumbnail[0]?.mediaUrl}
              className="max-w-[100px] rounded-lg hover:scale-105 active:scale-95 duration-300 transition-all"
            />
          </div>
          <Separator />
        </Link>
      ))}
    </div>
  );
};

export default Activity;
