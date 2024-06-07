import { ring2, lineSpinner } from "ldrs";
import React from "react";

// ring2.register();
lineSpinner.register();
interface LoaderProps {
  size?: number;
  stroke?: number;
  speed?: number;
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 20,
  stroke = 3,
  speed = 1,
  color = "gray",
}) => {
  return (
    // <l-ring-2
    //   size={size}
    //   stroke={stroke}
    //   speed={speed}
    //   color={color}
    // ></l-ring-2>
    <l-line-spinner
      size={size}
      stroke={stroke}
      speed={speed}
      color={color}
    ></l-line-spinner>
  );
};

// Default values shown
