export default function LandingButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      className="text-md flex cursor-pointer items-center gap-2 rounded-[8px] bg-gray-800 border border-gray-800  px-[16px] py-1.5 font-semibold  tracking-wider text-gray-100 transition-colors duration-300 hover:text-brand-primary/80"
      {...props}
    />
  );
}
