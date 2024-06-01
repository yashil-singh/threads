import React, { ChangeEvent, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import ProfileImg from "./ProfileImg";
import { Button } from "./ui/button";
import Icon from "./Icon";
import { Input } from "./ui/input";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

const CreatePost: React.FC = () => {
  const [content, setConent] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<
    { file: File; url: string }[]
  >([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setSelectedFiles((prevFiles) => [...prevFiles, { file, url }]);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      const removedFile = newFiles.splice(index, 1);
      URL.revokeObjectURL(removedFile[0].url);
      return newFiles;
    });
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setConent(e.target.value);
    resizeTextarea(e.target);
  };

  const resizeTextarea = (element: HTMLTextAreaElement | null): void => {
    if (element) {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  return (
    <Card className="max-w-[650px]">
      <CardContent className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="flex gap-4">
          <div className="flex flex-col justify-around items-center gap-4 overflow-hidden min-w-[36px]">
            <div>
              <ProfileImg width={36} height={36} fallBackText="Y" url="sd" />
            </div>
            <Separator orientation="vertical" className="w-[2px]" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col w-full">
              <h1 className="font-bold">yaashil.s</h1>
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
                  {selectedFiles.map((item, index) => (
                    <>
                      <CarouselItem
                        className={cn(
                          "flex items-center",
                          selectedFiles.length > 1 && "basis-5/6"
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
                          {item.file.type.startsWith("image/") ? (
                            <img
                              src={item.url}
                              alt={`preview-${index}`}
                              className="rounded-lg min-h-[250px] object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              controls
                              className="rounded-lg min-h-[200px]"
                            />
                          )}
                        </div>
                      </CarouselItem>
                    </>
                  ))}
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
        <Button
          disabled={content.trim().length === 0}
          variant={"outline"}
          className="ml-auto"
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePost;
