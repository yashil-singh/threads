import React from "react";
import { Button } from "./ui/button";
import { Loader } from "./Loader";

interface SubmitBtnProps {
  isSubmitting?: boolean;
  text: string;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";

  className?: string;
  isDisabled?: boolean;
  size?: number;
  stroke?: number;
}

const SubmitBtn: React.FC<SubmitBtnProps> = ({
  isSubmitting = false,
  text,
  onClick,
  variant,
  className,
  isDisabled,
  size,
  stroke = 2,
}) => {
  return (
    <Button
      className={className}
      disabled={isSubmitting || isDisabled}
      onClick={onClick}
      variant={variant}
    >
      {isSubmitting ? <Loader stroke={stroke} size={size} /> : text}
    </Button>
  );
};

export default SubmitBtn;
