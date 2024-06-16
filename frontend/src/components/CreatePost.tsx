import React, { ChangeEvent, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import ProfileImg from "./ProfileImg";
import Icon from "./Icon";
import { Input } from "./ui/input";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import SubmitBtn from "./SubmitBtn";

interface CreatePostProps {
  username: string;
  profilePic: string;
  content: string;
  onPostThread: () => void;
  setContent: (value: string) => void;
  selectedFile: string[];
  setSelectedFile: (value: string[]) => void;
  isSubmitting: boolean;
}

const CreatePost: React.FC<CreatePostProps> = ({
  profilePic,
  username,
  content,
  onPostThread,
  setContent,
  selectedFile,
  setSelectedFile,
  isSubmitting,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isFileLoading, setIsFileLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFileLoading(true);
    const file = e.target?.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedFile((prev) => [result, ...prev]);
        setIsFileLoading(false);
      };

      reader.readAsDataURL(file);
    } else {
      setIsFileLoading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFile((prevFiles) => {
      const newFiles = [...prevFiles];
      const removedFile = newFiles.splice(index, 1);
      URL.revokeObjectURL(removedFile[0].url);
      return newFiles;
    });
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(e.target.value);
    resizeTextarea(e.target);
  };

  const resizeTextarea = (element: HTMLTextAreaElement | null): void => {
    if (element) {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  return (
    <>
      <Card className="max-w-[650px]">
        <CardContent className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="flex gap-4">
            <div className="flex flex-col justify-around items-center gap-4 overflow-hidden min-w-[36px]">
              <Link to={`/@${username}`}>
                <ProfileImg
                  width={36}
                  height={36}
                  fallBackText={username.charAt(0)}
                  url={profilePic}
                />
              </Link>
              <Separator orientation="vertical" className="w-[2px]" />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-col w-full">
                <h1 className="font-bold">{username}</h1>
                <textarea
                  className="bg-inherit focus:outline-none block w-full resize-none placeholder:text-muted-foreground"
                  placeholder="Start a thread..."
                  rows={1}
                  value={content}
                  onChange={handleContentChange}
                  autoFocus
                />
                <Carousel className="flex mt-2 pr-1 cursor-grab active:cursor-grabbing">
                  <CarouselContent>
                    {selectedFile?.map((item, index) => (
                      <>
                        <CarouselItem
                          className={cn(
                            "flex items-center",
                            selectedFile.length > 1 && "basis-5/6"
                          )}
                          key={index}
                        >
                          <div className="relative">
                            <button
                              className="absolute right-3 top-3 z-10"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <Icon
                                icon="remove"
                                className="size-7 bg-background/50 rounded-full p-1"
                              />
                            </button>
                            {item.split(":")[1].startsWith("image/") ? (
                              <img
                                src={item}
                                alt={`preview-${index}`}
                                className="rounded-lg min-h-[250px] object-cover"
                              />
                            ) : (
                              <video
                                src={item}
                                controls
                                className="rounded-lg min-h-[200px]"
                              />
                            )}
                          </div>
                        </CarouselItem>
                      </>
                    ))}
                    {isFileLoading && (
                      <CarouselItem
                        className={cn(
                          "flex items-center",
                          selectedFile.length > 1 && "basis-5/6"
                        )}
                      >
                        <Skeleton className="w-[350px] h-[250px]" />
                      </CarouselItem>
                    )}
                  </CarouselContent>
                </Carousel>
              </div>
              <Input
                type="file"
                className="hidden"
                ref={fileRef}
                onChange={handleFileChange}
              />
              <span
                onClick={() => {
                  fileRef.current?.click();
                }}
              >
                <Icon
                  icon="images"
                  className="text-muted-foreground cursor-pointer size-5"
                />
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitBtn
            variant={"outline"}
            className="ml-auto"
            onClick={onPostThread}
            isSubmitting={isSubmitting}
            text="Post"
            isDisabled={content.trim().length < 1 && selectedFile.length < 1}
            stroke={1}
          />
        </CardFooter>
      </Card>
    </>
  );
};

export default CreatePost;
