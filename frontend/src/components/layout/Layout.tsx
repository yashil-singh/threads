import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  return (
    <div className="2xl:mx-[18%]">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
