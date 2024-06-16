import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { cn } from "@/lib/utils";

export interface ImageSliderProps {
  media: [
    {
      _id: string;
      mediaUrl: string;
      type: string;
    }
  ];
  onOpenImageModal?: (mediaUrl: string) => void;
  classname?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  media,
  onOpenImageModal,
  classname,
}) => {
  return (
    <Carousel>
      <CarouselContent>
        {media.map((m) => (
          <CarouselItem
            className={cn(
              media.length === 1 ? "basis-full" : "basis-2/3 lg:basis-2/3",
              classname
            )}
            key={m._id}
          >
            <button
              className="hover:scale-[101%] active:scale-[98%] transition-all duration-300 hover:cursor-grab active:cursor-grabbing"
              onClick={() => onOpenImageModal && onOpenImageModal(m.mediaUrl)}
            >
              {m.type === "image" ? (
                <img
                  className="rounded-lg object-cover max-h-[300px] min-h-[300px] md:max-h-[400px] md:min-h-[400px]"
                  src={m.mediaUrl}
                />
              ) : (
                <video
                  className="rounded-lg object-cover max-h-[300px] min-h-[300px] md:max-h-[400px] md:min-h-[400px]"
                  src={m.mediaUrl}
                />
              )}
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ImageSlider;
