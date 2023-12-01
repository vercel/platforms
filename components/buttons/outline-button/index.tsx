export default function OutlineButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      className="group flex h-10 items-center justify-center rounded-full border border-gray-300/30 px-5 py-1.5 font-medium text-gray-300 transition-all duration-200 hover:border-brand-primary/60 hover:text-brand-primary/60"
      {...props}
    />
  );
}
