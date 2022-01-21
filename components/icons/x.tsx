import type { BaseIconProps } from "@/types";

interface XIconProps extends BaseIconProps {}

const XIcon = ({ className, color, height, width }: XIconProps) => {
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
      <title>X Icon</title>
      <path
        d="M324.91,256L497.13,83.79c19.36-18.7,19.89-49.57,1.19-68.89c-18.7-19.36-49.52-19.89-68.89-1.24l-1.19,1.24L255.98,187.12
		L83.76,14.9C65.06-4.46,34.24-4.98,14.87,13.71C-4.49,32.36-5.01,63.24,13.68,82.55l1.19,1.24l172.22,172.17L14.87,428.22
		c-19.36,18.7-19.89,49.52-1.19,68.89c18.7,19.36,49.52,19.89,68.89,1.19l1.19-1.19l172.22-172.22l172.26,172.22
		c18.7,19.36,49.52,19.89,68.89,1.19c19.36-18.65,19.89-49.52,1.19-68.89l-1.19-1.19L324.91,255.96V256z"
      />
    </svg>
  );
};

export default XIcon;
