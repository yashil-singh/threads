import React from "react";
import Icon from "../Icon";
import { Link, useLocation } from "react-router-dom";
import Brand from "../Brand";

const Navbar: React.FC = () => {
  const location = useLocation();

  const className =
    "flex-1 transition-all duration-300 ease-in-out hover:bg-accent py-5 md:px-8 hover:scale-105 rounded-lg flex items-center justify-center active:scale-95";

  return (
    <>
      <header className="flex items-center justify-between px-2 pt-5 md:pt-2 bg-background/90 sticky top-0">
        <Link to="/" className="w-[68px]">
          <Brand className="hover:scale-110 active:scale-95" />
        </Link>

        <div className="fixed left-0 right-0 flex justify-evenly bottom-0 md:relative bg-opacity-80 gap-2">
          <Link to="/" className={className}>
            <Icon
              icon="home"
              className={
                location.pathname === "/" ? "fill-secondary" : "text-muted"
              }
            />
          </Link>
          <Link to="/search" className={className}>
            <Icon
              icon="search"
              className={
                location.pathname === "/search"
                  ? "fill-secondary"
                  : "text-muted"
              }
            />
          </Link>
          <Link to="/" className={className}>
            <Icon
              icon="post"
              className={
                location.pathname === "/create"
                  ? "fill-secondary"
                  : "text-muted"
              }
            />
          </Link>
          <Link to="/" className={className}>
            <Icon
              icon="heart"
              className={
                location.pathname === "/likes" ? "fill-secondary" : "text-muted"
              }
            />
          </Link>
          <Link to="/" className={className}>
            <Icon
              icon="user"
              className={
                location.pathname === "/profile"
                  ? "fill-secondary"
                  : "text-muted"
              }
            />
          </Link>
        </div>

        <Link
          to="login"
          className="bg-primary text-primary-foreground font-medium rounded-[10px] px-4 py-1 transition-all duration-300 ease-in-out active:scale-95"
        >
          Log in
        </Link>
      </header>
    </>
  );
};

export default Navbar;
