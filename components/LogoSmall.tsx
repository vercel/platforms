import type { WithClassName } from "@/types";

interface LogoSmallProps extends WithClassName {
  height?: number;
  width: number;
}

const LogoSmall = (props: LogoSmallProps) => {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width={props.height ? undefined : props.width || 40}
      height={props.height || 25}
      viewBox="0 0 40 25"
    >
      <title>Platforms Starter Kit Logo (Small)</title>
      <g fill="#000" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path d="M30.746 25C23.483 25 18 19.421 18 12.534 18 5.613 23.203 0 30.746 0 34.727 0 37.8 1.137 40 3.72c-.328.375-.717.901-1.165 1.577a9.121 9.121 0 00-1.015 1.976c-1.467-1.515-4.874-2.796-7.074-2.796-4.714 0-7.683 3.65-7.683 8.057 0 4.408 2.969 7.99 7.788 7.99 2.374 0 5.607-1.128 7.039-2.677.411.91.726 1.538.945 1.883.25.396.639.878 1.165 1.448C38.15 23.382 35.006 25 30.746 25z"></path>
        <path d="M0 24V1h8.21C16.158 1 20 5.929 20 12.533 20 19.104 16.158 24 8.21 24H0zm4.598-4.14h3.054c5.451 0 7.586-3.154 7.586-7.327S13.103 5.14 7.652 5.14H4.598v14.72z"></path>
      </g>
    </svg>
  );
};

export default LogoSmall;
