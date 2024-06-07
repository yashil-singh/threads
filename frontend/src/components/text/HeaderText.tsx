import { cn } from "@/lib/utils";
import React from "react";

interface HeaderTextProps {
  children: React.ReactNode;
  className?: string;
}

const HeaderText: React.FC<HeaderTextProps> = ({ children, className }) => {
  return <h1 className={cn("text-primary text-xl", className)}>{children}</h1>;
};

export default HeaderText;
