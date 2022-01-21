import type { BaseIconProps } from "@/types";

interface PlusIconProps extends BaseIconProps {}

const PlusIcon = ({ color, width, height, className }: PlusIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      fill={color}
      version="1.1"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <title>Plus Icon</title>
      <path d="M224 32v448c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32s-32 14.3-32 32"></path>
      <path d="M32 288h448c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32"></path>
    </svg>
  );
};

export default PlusIcon;
