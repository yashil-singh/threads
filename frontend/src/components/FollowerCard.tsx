import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileImg from "./ProfileImg";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import SubmitBtn from "./SubmitBtn";

interface User {
  _id: string;
  name: string;
  username: string;
  profilePic: string;
  followers: string[];
  requestReceived: string[];
}

interface FollowerCardProps {
  selectedCard: "follower" | "following";
  followers: User[];
  following: User[];
  onVisitProfile: () => void;
  onToggleFollow: (id: string) => void;
}

const FollowerCard: React.FC<FollowerCardProps> = ({
  selectedCard,
  followers,
  following,
  onVisitProfile,
  onToggleFollow,
}) => {
  const user = useRecoilValue(userAtom);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const handleToggleFollow = async (id: string) => {
    setSubmittingId(id);
    await onToggleFollow(id);
    setSubmittingId(null);
  };

  return (
    <Card>
      <CardContent className="px-0 pt-0 pb-2">
        <Tabs defaultValue={selectedCard} className="w-full">
          <CardHeader className="px-2 pt-2 pb-0">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="follower">
                Followers
              </TabsTrigger>
              <TabsTrigger className="w-full" value="following">
                Following
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <TabsContent
            value="follower"
            className="max-h-[calc(100vh-180px)] overflow-y-auto flex flex-col gap-3"
          >
            {followers.length > 0 ? (
              followers.map((follower) => (
                <div className="flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/@${follower?.username}`}
                      onClick={onVisitProfile}
                      className="flex overflow-hidden gap-3 pl-3 items-center"
                      key={follower?._id}
                    >
                      <ProfileImg
                        fallBackText={follower?.username}
                        url={follower?.profilePic}
                      />
                      <div className="flex flex-col w-[80%]">
                        <span className="pb-3">
                          <h1 className="font-bold text-base truncate">
                            {follower?.username}
                          </h1>
                          <p className="font-normal text-muted-foreground text-sm truncate">
                            {follower?.name}
                          </p>
                        </span>
                      </div>
                    </Link>

                    {follower?._id !== user?._id && (
                      <div className="min-w-[120px] pr-3">
                        {follower?.followers.includes(user?._id ?? "") ? (
                          <SubmitBtn
                            text="Following"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleToggleFollow(follower?._id)}
                            isSubmitting={submittingId === follower?._id}
                          />
                        ) : follower?.requestReceived.includes(
                            user?._id ?? ""
                          ) ? (
                          <SubmitBtn
                            text="Requested"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleToggleFollow(follower?._id)}
                            isSubmitting={submittingId === follower?._id}
                          />
                        ) : (
                          <SubmitBtn
                            text="Follow"
                            className="w-full"
                            onClick={() => handleToggleFollow(follower?._id)}
                            isSubmitting={submittingId === follower?._id}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <Separator className="ml-14" />
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No followers.</p>
            )}
          </TabsContent>
          <TabsContent
            value="following"
            className="max-h-[calc(100vh-180px)] overflow-y-auto flex flex-col gap-2 mt-0"
          >
            {following.length > 0 ? (
              following.map((follow) => (
                <div className="flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/@${follow?.username}`}
                      onClick={onVisitProfile}
                      className="flex overflow-hidden gap-3 pl-3 items-center"
                      key={follow?._id}
                    >
                      <ProfileImg
                        fallBackText={follow?.username}
                        url={follow?.profilePic}
                      />
                      <div className="flex flex-col w-[80%]">
                        <span className="pb-3">
                          <h1 className="font-bold text-base truncate">
                            {follow?.username}
                          </h1>
                          <p className="font-normal text-muted-foreground text-sm truncate">
                            {follow?.name}
                          </p>
                        </span>
                      </div>
                    </Link>

                    {follow?._id !== user?._id && (
                      <div className="min-w-[120px] pr-3">
                        {follow?.followers.includes(user?._id ?? "") ? (
                          <SubmitBtn
                            text="Following"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleToggleFollow(follow?._id)}
                            isSubmitting={submittingId === follow?._id}
                          />
                        ) : follow?.requestReceived.includes(
                            user?._id ?? ""
                          ) ? (
                          <SubmitBtn
                            text="Requested"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleToggleFollow(follow?._id)}
                            isSubmitting={submittingId === follow?._id}
                          />
                        ) : (
                          <SubmitBtn
                            text="Follow"
                            className="w-full"
                            onClick={() => handleToggleFollow(follow?._id)}
                            isSubmitting={submittingId === follow?._id}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <Separator className="ml-14" />
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No following.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FollowerCard;
