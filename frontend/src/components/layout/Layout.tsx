import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
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
