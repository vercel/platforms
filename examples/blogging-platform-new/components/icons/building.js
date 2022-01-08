const BuildingIcon = ({ color, width, height, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      fill="currentColor"
      version="1.1"
      viewBox="0 0 354 318"
      xmlSpace="preserve"
    >
      <title>Building Icon</title>
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g
          fill={color || '#FFF'}
          stroke={color || '#FFF'}
          transform="translate(-312 -1880)"
        >
          <g transform="translate(312 1881)">
            <path d="M177 0L354 70 0 70z"></path>
            <path d="M37.5 70.5H317.5V104.5H37.5z"></path>
            <path d="M37.5 282.5H317.5V316.5H37.5z"></path>
            <path d="M52.5 105.5H87.5V280.5H52.5z"></path>
            <path d="M123.5 105.5H158.5V280.5H123.5z"></path>
            <path d="M195.5 105.5H230.5V280.5H195.5z"></path>
            <path d="M266.5 105.5H301.5V280.5H266.5z"></path>
          </g>
        </g>
      </g>{' '}
    </svg>
  );
};

export default BuildingIcon;
