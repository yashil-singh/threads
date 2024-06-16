import React from "react";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 w-full">
      <Skeleton className="h-12 w-14 rounded-full self-start" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-[35%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="w-full h-[300px]" />
      </div>
    </div>
  );
};

export default PostSkeleton;
