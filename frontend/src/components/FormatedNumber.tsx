import { formatNumber } from "@/helpers/formatNumber";
import React from "react";

interface FormatedNumberProps {
  number: number;
  className?: string;
}

const FormatedNumber: React.FC<FormatedNumberProps> = ({
  number,
  className,
}) => {
  return <p className={className}>{formatNumber(number)}</p>;
};

export default FormatedNumber;
