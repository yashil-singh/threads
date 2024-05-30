import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

interface ProfileImgProps {
  url: string;
  fallBackText: string;
  width: number;
  height: number;
}

const ProfileImg: React.FC<ProfileImgProps> = ({
  url,
  fallBackText,
  width,
  height,
}) => {
  return (
    <Avatar
      className="bg-muted rounded-full flex items-center justify-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <AvatarImage src={url} alt="profile" />
      <AvatarFallback>{fallBackText}</AvatarFallback>
    </Avatar>
  );
};

export default ProfileImg;
