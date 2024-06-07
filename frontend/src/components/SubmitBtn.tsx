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
}

const SubmitBtn: React.FC<SubmitBtnProps> = ({
  isSubmitting = false,
  text,
  onClick,
  variant,
  className,
}) => {
  return (
    <Button
      className={className}
      disabled={isSubmitting}
      onClick={onClick}
      variant={variant}
    >
      {isSubmitting ? <Loader /> : text}
    </Button>
  );
};

export default SubmitBtn;
