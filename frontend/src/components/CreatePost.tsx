import React, { ChangeEvent, useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import ProfileImg from "./ProfileImg";
import { Button } from "./ui/button";

const CreatePost: React.FC = () => {
  const [textareaValue, setTextareaValue] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setTextareaValue(e.target.value);
    resizeTextarea(e.target);
  };

  const resizeTextarea = (element: HTMLTextAreaElement | null): void => {
    if (element) {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    }
  };
  return (
    <Card className="max-w-[600px]">
      <CardContent className="p-5 max-h-[calc(100vh-200px)] overflow-y-auto mb-2">
        <div className="flex items-start gap-2 h-full">
          <ProfileImg width={36} height={36} fallBackText="Y" url="sd" />
          <div className="flex flex-col w-full">
            <h1 className="font-bold">yaashil.s</h1>
            <textarea
              className="bg-inherit focus:outline-none block w-full resize-none"
              placeholder="Start a thread..."
              rows={1}
              value={textareaValue}
              onChange={handleChange}
              autoFocus
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant={"outline"} className="ml-auto">
          Post
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePost;
