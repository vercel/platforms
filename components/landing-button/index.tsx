export default function LandingButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      className="text-md flex cursor-pointer items-center gap-2 rounded-[8px] bg-brand-gray800 border border-brand-gray800  px-[16px] py-1.5 font-semibold  tracking-wider text-brand-gray100 transition-colors duration-300 hover:text-brand-primary/80"
      {...props}
    />
  );
}
