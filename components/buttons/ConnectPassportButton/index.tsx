import PrimaryButton from "@/components/primary-button";
const ConnectPassportButton = (props: any) => (
  <PrimaryButton {...props}>
    <span className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-book-check w-4"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="m9 9.5 2 2 4-4" />
      </svg>
      <span className="group-hover:text-fora-primary ml-2  mr-2 transition-all duration-100">
        {props.children}
      </span>
    </span>
  </PrimaryButton>
);

export default ConnectPassportButton;
