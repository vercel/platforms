import React from "react";

import type { BaseIconProps } from "@/types";

interface LinkIconProps extends BaseIconProps {}

function LinkIcon({ className, color, height, width }: LinkIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      width={width}
      height={height}
      className={className}
      fill={color}
      enableBackground="new 0 0 512 512"
      version="1.1"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <title>Twitter Icon</title>
      <path
        d="M168.9 198.7c7.9 7.9 7.9 20.7 0 28.6L65 331.1c-17.1 18.9-25 37.6-24.6 56.6.5 25.6 7.1 39.8 22.3 57.1 13 14.8 30.8 24.5 55.2 26.6 17.5 1.5 35.5-4.1 54.7-17.3l111.5-111.5c7.9-7.9 20.7-7.9 28.6 0 7.9 7.9 7.9 20.7 0 28.6L199.9 483.8l-2.6 2.2c-27 19.2-54.8 27.9-82.8 25.6-35.3-3-62.5-17.9-82.1-40.1C11.3 447.6.7 424.7 0 388.5c-.6-29.9 11.4-58.3 35.7-85.2l104.6-104.6c7.9-7.9 20.7-7.9 28.6 0zM388.4 0c36.2.7 59.1 11.3 83 32.4 22.3 19.6 37.2 46.8 40.1 82.1 2.3 28-6.4 55.8-25.6 82.8l-2.2 2.6L371 312.7c-7.9 7.9-20.7 7.9-28.6 0-7.9-7.9-7.9-20.7 0-28.6L454 172.6c13.3-19.1 18.8-37.2 17.3-54.7-2-24.3-11.8-42.1-26.6-55.2-17.3-15.2-31.5-21.8-57.1-22.3-19-.3-37.7 7.5-56.6 24.6L227.3 168.9c-7.9 7.9-20.7 7.9-28.6 0s-7.9-20.7 0-28.6L303.3 35.8C330.2 11.5 358.5-.5 388.4 0zM306 197.1c7.9 7.9 7.9 20.7 0 28.6l-74.9 74.9c-7.9 7.9-20.7 7.9-28.6 0-7.9-7.9-7.9-20.7 0-28.6l74.9-74.9c7.9-7.9 20.7-7.9 28.6 0z"
        className="st0"
      ></path>
    </svg>
  );
}

export default LinkIcon;
