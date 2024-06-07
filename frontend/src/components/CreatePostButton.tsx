import React from "react";
import ProfileImg from "./ProfileImg";
import { Button } from "./ui/button";

interface CreatePostButton {
  onOpenCreatePost: () => void;
  profilePic: string;
  username: string;
}

const CreatePostButton: React.FC<CreatePostButton> = ({
  onOpenCreatePost,
  profilePic,
  username,
}) => {
  return (
    <div
      className="flex px-3 md:px-0 py-2 items-center justify-between"
      onClick={onOpenCreatePost}
    >
      <div className="flex gap-2 items-center w-full">
        <ProfileImg
          url={profilePic}
          fallBackText={username?.charAt(0)}
          width={36}
          height={36}
        />
        <div className="w-full cursor-text py-2">
          <p className="text-muted-foreground">Start a thread...</p>
        </div>
      </div>
      <Button variant={"outline"} onClick={onOpenCreatePost}>
        Post
      </Button>
    </div>
  );
};

export default CreatePostButton;
