export const formatNumber = (number: number) => {
  if (!number) return 0;
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(number);
};
