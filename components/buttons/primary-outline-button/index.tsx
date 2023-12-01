export default function PrimaryOutlineButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      className="text-md hover:glow-primary flex cursor-pointer items-center gap-2 rounded-full border border-brand-primary/60 bg-brand-primary/5 px-5 py-1.5  font-medium text-gray-200/90 transition-all duration-200 hover:bg-brand-primary/20 hover:text-gray-50"
      {...props}
    />
  );
}
