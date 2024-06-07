import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

interface ProfileImgProps {
  url: string;
  fallBackText: string;
  width?: number;
  height?: number;
  font?: number;
  className?: string;
}

const ProfileImg: React.FC<ProfileImgProps> = ({
  url,
  fallBackText,
  width = 36,
  height = 36,
  font = 14,
  className,
}) => {
  const firstLetter = fallBackText?.charAt(0);
  return (
    <div
      className={cn(
        "bg-accent rounded-full cursor-pointer overflow-hidden flex justify-center items-center",
        className
      )}
      style={{
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        maxWidth: `${width}px`,
        maxHeight: `${height}px`,
      }}
    >
      <Avatar>
        <AvatarImage
          className="object-cover"
          src={url}
          alt="profile"
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        />
        <AvatarFallback className="uppercase" style={{ fontSize: font }}>
          {firstLetter}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProfileImg;
