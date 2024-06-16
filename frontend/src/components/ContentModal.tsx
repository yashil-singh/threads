import React, { useEffect, useState } from "react";
import { ImageSliderProps } from "./ImageSlider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { cn } from "@/lib/utils";

const ContentModal: React.FC<ImageSliderProps> = ({ media, classname }) => {
  return (
    <Carousel className="absolute w-full h-screen flex items-center justify-center">
      <CarouselContent>
        {media.map((m) => (
          <CarouselItem
            className={cn(
              "flex justify-center items-center h-screen w-full cursor-grab active:cursor-grabbing",
              classname
            )}
            key={m._id}
          >
            <div className="md:max-w-[90%] h-screen flex items-center">
              {m.type === "image" ? (
                <img className="object-contain w-full" src={m.mediaUrl} />
              ) : (
                <video
                  className="object-cover xl:min-h-screen"
                  src={m.mediaUrl}
                />
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {media.length > 1 && (
        <>
          <CarouselPrevious className="left-5 hidden md:flex" />
          <CarouselNext className="right-5 hidden md:flex" />
        </>
      )}
    </Carousel>
  );
};

export default ContentModal;
