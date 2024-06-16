import React from "react";
import Icon from "../Icon";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Brand from "../Brand";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import useShowToast from "@/hooks/useShowToast";
import { Ellipsis } from "lucide-react";
import { newNotificationAtom } from "@/atoms/notificationAtom";
import useNotification from "@/hooks/useNotification";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useRecoilState(userAtom);
  const [newNotification, setNewNotification] =
    useRecoilState(newNotificationAtom);

  const navigate = useNavigate();

  const { logout } = useAuth();
  const { showToast } = useShowToast();
  const { readAllNotification } = useNotification();

  const onReadNotification = async () => {
    const response = await readAllNotification();
    if (response.success) setNewNotification(false);
  };

  const onLogout = async () => {
    const response = await logout();
    if (response.success) {
      setUser(null);
      localStorage.removeItem("token");
      showToast({ title: response.data.message });
      navigate("/");
    } else {
      const errors = response.errors;
      errors.map((error: string) => showToast({ title: error }));
    }
  };

  const className =
    "flex-1 transition-all duration-200 ease-in-out hover:bg-muted py-5 hover:scale-105 rounded-lg flex items-center justify-center active:scale-95";

  return (
    <>
      <header className="flex items-center justify-center px-2 pt-5 md:pt-2 sticky bg-background/90 h-[80px] top-0 z-10">
        <Link to="/" className="w-[68px] absolute left-4 top-6">
          <Brand className="hover:scale-110 active:scale-95" />
        </Link>

        <div className="fixed left-0 right-0 flex justify-between bottom-0 md:relative bg-opacity-80 gap-2 flex-1 md:max-w-[360px] bg-background/90 md:bg-transparent">
          <Link to="/" className={className}>
            <Icon
              icon="home"
              className={
                location.pathname === "/"
                  ? "fill-secondary"
                  : "text-muted-foreground"
              }
            />
          </Link>
          <Link to="/search" className={className}>
            <Icon
              icon="search"
              className={
                location.pathname === "/search"
                  ? "fill-secondary"
                  : "text-muted-foreground"
              }
            />
          </Link>
          <Link
            to={user ? "/activity" : "/login"}
            className={className}
            onClick={onReadNotification}
          >
            {newNotification && (
              <span className="size-1 bg-red-500 rounded-full absolute bottom-3"></span>
            )}
            {}
            <Icon
              icon="heart"
              className={
                location.pathname === "/activity"
                  ? "fill-secondary"
                  : "text-muted-foreground"
              }
            />
          </Link>
          <Link
            to={user ? `/@${user?.username}` : "/login"}
            className={className}
          >
            <Icon
              icon="user"
              className={
                location.pathname === `/@${user?.username}`
                  ? "fill-secondary"
                  : "text-muted-foreground"
              }
            />
          </Link>
        </div>

        {!user ? (
          <Link
            to="login"
            className="absolute right-3 top-6 bg-primary text-primary-foreground font-medium rounded-[10px] px-4 py-1 transition-all duration-300 ease-in-out active:scale-95"
          >
            Log in
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute right-5 top-6 cursor-pointer">
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute -right-4 min-w-[200px] font-bold p-3">
              <DropdownMenuItem className="p-0 text-base cursor-pointer">
                <Link
                  className="p-5 w-full text-bold"
                  to={`/@${user.username}`}
                >
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="p-5 text-base cursor-pointer"
                onClick={onLogout}
              >
                <span className="w-full text-bold cursor-pointer">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>
    </>
  );
};

export default Navbar;
