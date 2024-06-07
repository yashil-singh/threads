import useUsers from "@/hooks/useUsers";
import React, { useEffect, useState } from "react";
import ProfileImg from "./ProfileImg";
import { Link } from "react-router-dom";
import moment from "moment";
import { Label } from "./ui/label";
import Icon from "./Icon";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import { Dialog } from "./ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

interface PostProps {
  _id: string;
  content: string;
  likes: number;
  userId: string;
  media: [];
  replies: [];
  createdAt: string;
  updatedAt: string;
  onOpenImageModal: (
    imageUrl: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

const Post: React.FC<PostProps> = ({
  _id,
  content,
  createdAt,
  likes,
  media,
  replies,
  updatedAt,
  userId,
  onOpenImageModal,
}) => {
  const { getProfile } = useUsers();
  const [postedByInfo, setPostedByInfo] = useState({});

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("LIKED");
  };

  const fetchUser = async () => {
    const response = await getProfile(undefined, userId);
    if (response?.success) {
      setPostedByInfo(response.data.data);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [_id]);
  return (
    <div className="flex gap-2 px-3 md:px-0">
      <Link to={`/@${postedByInfo?.username}`} className="flex gap-3">
        <ProfileImg
          url={postedByInfo?.profilePic}
          fallBackText={postedByInfo?.username?.charAt(0)}
        />
      </Link>
      <div className="w-full">
        <Link to={`/post/${_id}`} className="flex gap-3 px-3 md:px-0 relative">
          <div className="flex flex-col w-full items-start">
            <span className="flex gap-2 items-center">
              <Link to={`/@${postedByInfo?.username}`}>
                <h1 className="hover:underline">{postedByInfo?.username}</h1>
              </Link>
              <Label className="font-normal text-sm text-accent cursor-pointer">
                {moment(createdAt).fromNow()}
              </Label>
            </span>

            <p className="w-full mb-2">{content}</p>

            {media.map((imageUrl) => (
              <button
                className="active:scale-[98%] transition-all duration-300"
                onClick={(e) => onOpenImageModal(imageUrl, e)}
              >
                <img
                  className="rounded-lg object-contain max-h-[500px]"
                  src={imageUrl}
                />
              </button>
            ))}
          </div>
        </Link>
        <Carousel>
          <CarouselContent>
            {media.map((imageUrl) => (
              <CarouselItem className="basis-2/3 lg:basis-2/3">
                <button
                  className="hover:scale-[101%] active:scale-[98%] transition-all duration-300"
                  onClick={(e) => onOpenImageModal(imageUrl, e)}
                >
                  <img
                    className="rounded-lg object-cover max-h-[300px] min-h-[300px] md:max-h-[400px] md:min-h-[400px]"
                    src={imageUrl}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* <Carousel>
          <CarouselContent>
            <CarouselItem className="basis-2/3 lg:basis-2/3">
              <button
                className="hover:scale-[101%] active:scale-[98%] transition-all duration-300"
                onClick={(e) =>
                  onOpenImageModal(
                    "https://res.cloudinary.com/dscbmvzph/image/upload/v1717779819/cxptufcjf4iftmo56nf2.png",
                    e
                  )
                }
              >
                <img
                  className="rounded-lg object-cover max-h-[300px] min-h-[300px] md:max-h-[400px] md:min-h-[400px]"
                  src={
                    "https://res.cloudinary.com/dscbmvzph/image/upload/v1717779819/cxptufcjf4iftmo56nf2.png"
                  }
                />
              </button>
            </CarouselItem>
            <CarouselItem className="basis-2/3 lg:basis-2/3">
              <button
                className="hover:scale-[101%] active:scale-[98%] transition-all duration-300"
                onClick={(e) =>
                  onOpenImageModal(
                    "https://res.cloudinary.com/dscbmvzph/image/upload/v1717777602/heloromxnuwxkjthvdzl.jpg",
                    e
                  )
                }
              >
                <img
                  className="rounded-lg object-cover max-h-[300px] min-h-[300px] md:max-h-[400px] md:min-h-[400px]"
                  src={
                    "https://res.cloudinary.com/dscbmvzph/image/upload/v1717777602/heloromxnuwxkjthvdzl.jpg"
                  }
                />
              </button>
            </CarouselItem>
          </CarouselContent>
        </Carousel> */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="flex items-center justify-center gap-1 min-w-[45px]"
            onClick={handleLike}
          >
            <Icon icon="heart" className="size-5" />
            <p>{likes}</p>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex items-center justify-center gap-1 min-w-[45px]"
            onClick={(e) => {
              console.log("CLICKED Comment");
              e.preventDefault();
            }}
          >
            <MessageCircle className="size-5" />
            <p>{replies.length}</p>
          </Button>
          <Link to={`/post/${_id}`} className="w-full"></Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
