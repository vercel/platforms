import type { BaseIconProps } from "@/types";

interface NotFoundIconProps extends BaseIconProps {}

const NotFoundIcon = ({
  className,
  color,
  height,
  width,
}: NotFoundIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      fill={color}
      viewBox="0 0 634 431"
      xmlSpace="preserve"
    >
      <title>Not Found Icon</title>
      <g>
        <path d="M538 239.566C523.657 227.955 505.39 221 485.5 221c-46.116 0-83.5 37.384-83.5 83.5 0 16.784 4.952 32.41 13.474 45.5H125c-16.016 0-29-12.984-29-29V163h442v76.566zM538 138H96v-17c0-16.016 12.984-29 29-29h384c16.016 0 29 12.984 29 29v17zm-408.5-16a7.5 7.5 0 100-15 7.5 7.5 0 000 15zm23 0a7.5 7.5 0 100-15 7.5 7.5 0 000 15zm23 0a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"></path>
        <path d="M480.308 308.5l-18.032 18.031a6.5 6.5 0 109.193 9.193l18.031-18.032 18.031 18.032a6.5 6.5 0 109.193-9.193L498.692 308.5l18.032-18.031a6.5 6.5 0 10-9.193-9.193L489.5 299.308l-18.031-18.032a6.5 6.5 0 10-9.193 9.193l18.032 18.031zM489 382c-40.87 0-74-33.13-74-74s33.13-74 74-74 74 33.13 74 74-33.13 74-74 74z"></path>
      </g>
    </svg>
  );
};

export default NotFoundIcon;
