import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const iconVariants = cva("inline-block size-8", {
  variants: {
    icon: {
      home: "home",
      search: "search",
      heart: "heart",
      post: "post",
      user: "user",
      google: "google",
    },
    size: {
      default: "size-6",
      sm: "size-4",
      lg: "size-10",
    },
  },
  defaultVariants: {
    icon: "home",
    size: "default",
  },
});

export interface IconProps
  extends React.SVGProps<SVGSVGElement>,
    VariantProps<typeof iconVariants> {
  asChild?: boolean;
}

const Icon: React.FC<IconProps> = ({ icon, size, className }) => {
  return (
    <span>
      {icon === "home" && (
        <svg
          aria-label="Home"
          role="img"
          viewBox="0 0 26 26"
          className={cn(iconVariants({ size, className }))}
        >
          <title>Home</title>
          <path
            d="M2.25 12.8855V20.7497C2.25 21.8543 3.14543 22.7497 4.25 22.7497H8.25C8.52614 22.7497 8.75 22.5259 8.75 22.2497V17.6822V17.4997C8.75 15.1525 10.6528 13.2497 13 13.2497C15.3472 13.2497 17.25 15.1525 17.25 17.4997V17.6822V22.2497C17.25 22.5259 17.4739 22.7497 17.75 22.7497H21.75C22.8546 22.7497 23.75 21.8543 23.75 20.7497V12.8855C23.75 11.3765 23.0685 9.94815 21.8954 8.99883L16.1454 4.3454C14.3112 2.86095 11.6888 2.86095 9.85455 4.3454L4.10455 8.99883C2.93153 9.94815 2.25 11.3765 2.25 12.8855Z"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2.5"
            fill-rule="evenodd"
          ></path>
        </svg>
      )}
      {icon === "search" && (
        <svg
          aria-label="Search"
          role="img"
          viewBox="0 0 26 26"
          className={cn(iconVariants({ size, className }))}
        >
          <title>Search</title>
          <path
            clip-rule="evenodd"
            d="M3.5 11.5C3.5 7.08172 7.08172 3.5 11.5 3.5C15.9183 3.5 19.5 7.08172 19.5 11.5C19.5 15.9183 15.9183 19.5 11.5 19.5C7.08172 19.5 3.5 15.9183 3.5 11.5ZM11.5 1C5.70101 1 1 5.70101 1 11.5C1 17.299 5.70101 22 11.5 22C13.949 22 16.2023 21.1615 17.9883 19.756L22.3661 24.1339C22.8543 24.622 23.6457 24.622 24.1339 24.1339C24.622 23.6457 24.622 22.8543 24.1339 22.3661L19.756 17.9883C21.1615 16.2023 22 13.949 22 11.5C22 5.70101 17.299 1 11.5 1Z"
            fill="currentColor"
            fill-rule="evenodd"
          ></path>
        </svg>
      )}
      {icon === "post" && (
        <svg
          aria-label="Create"
          role="img"
          viewBox="0 0 26 26"
          className={cn(iconVariants({ size, className }))}
        >
          <title>Create</title>
          <path
            d="M22.75 13L22.75 13.15C22.75 16.5103 22.75 18.1905 22.096 19.4739C21.5208 20.6029 20.6029 21.5208 19.4739 22.096C18.1905 22.75 16.5103 22.75 13.15 22.75L12.85 22.75C9.48969 22.75 7.80953 22.75 6.52606 22.096C5.39708 21.5208 4.4792 20.6029 3.90396 19.4739C3.25 18.1905 3.25 16.5103 3.25 13.15L3.25 12.85C3.25 9.48968 3.25 7.80953 3.90396 6.52606C4.4792 5.39708 5.39708 4.4792 6.52606 3.90396C7.80953 3.25 9.48968 3.25 12.85 3.25L13 3.25"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2.5"
          ></path>
          <path
            d="M21.75 4.25L13.75 12.25"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2.5"
          ></path>
        </svg>
      )}
      {icon === "heart" && (
        <svg
          aria-label="Notifications"
          role="img"
          viewBox="0 0 26 26"
          className={cn(iconVariants({ size, className }))}
        >
          <title>Notifications</title>
          <path
            d="M2.5 9.85683C2.5 14.224 6.22178 18.5299 12.0332 22.2032C12.3554 22.397 12.7401 22.5909 13 22.5909C13.2703 22.5909 13.655 22.397 13.9668 22.2032C19.7782 18.5299 23.5 14.224 23.5 9.85683C23.5 6.11212 20.8698 3.5 17.4599 3.5C15.4847 3.5 13.9356 4.39792 13 5.74479C12.0851 4.40812 10.5257 3.5 8.5401 3.5C5.14059 3.5 2.5 6.11212 2.5 9.85683Z"
            stroke="currentColor"
            stroke-width="2.5"
          ></path>
        </svg>
      )}
      {icon === "user" && (
        <svg
          aria-label="Profile"
          role="img"
          viewBox="0 0 26 26"
          className={cn(iconVariants({ size, className }))}
        >
          <title>Profile</title>
          <circle
            cx="13"
            cy="7.25"
            r="4"
            stroke="currentColor"
            stroke-width="2.5"
          ></circle>
          <path
            d="M6.26678 23.75H19.744C21.603 23.75 22.5 23.2186 22.5 22.0673C22.5 19.3712 18.8038 15.75 13 15.75C7.19625 15.75 3.5 19.3712 3.5 22.0673C3.5 23.2186 4.39704 23.75 6.26678 23.75Z"
            stroke="currentColor"
            stroke-width="2.5"
          ></path>
        </svg>
      )}
      {icon === "google" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="0.98em"
          height="1em"
          viewBox="0 0 256 262"
          className={cn(iconVariants({ size, className }))}
        >
          <path
            fill="#4285f4"
            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          />
          <path
            fill="#34a853"
            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          />
          <path
            fill="#fbbc05"
            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
          />
          <path
            fill="#eb4335"
            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          />
        </svg>
      )}
    </span>
  );
};

export default Icon;
