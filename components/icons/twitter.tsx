import type { BaseIconProps } from "@/types";

interface TwitterIconProps extends BaseIconProps {}

const TwitterIcon = ({ className, color, height, width }: TwitterIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      fill="currentColor"
      version="1.1"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <title>Twitter Icon</title>
      <path d="M512 99.65a211.65 211.65 0 01-60.3 16.3 104.146 104.146 0 0046.17-57.2 213.54 213.54 0 01-66.73 25.1c-20-20.95-47.73-32.75-76.67-32.65-58.02 0-105.05 46.35-105.05 103.43 0 8.1.93 16 2.72 23.55-84.15-4-162.7-43.2-216.47-108.05A101.344 101.344 0 0021.5 122.1c0 35.9 18.53 67.57 46.68 86.1-16.65-.55-32.93-5-47.55-13v1.3c0 50.13 36.22 91.92 84.22 101.45-9.03 2.38-18.32 3.6-27.65 3.6-6.8 0-13.37-.65-19.8-1.92 14.07 42.4 53.45 71.25 98.1 71.88a212.948 212.948 0 01-130.43 44.2c-8.5 0-16.85-.5-25.08-1.42 48.17 30.48 104.03 46.63 161 46.52 193.23 0 298.85-157.6 298.85-294.3l-.38-13.38A207.882 207.882 0 00512 99.65z"></path>
    </svg>
  );
};

export default TwitterIcon;
