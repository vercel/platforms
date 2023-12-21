export default function HeaderMainDescription({
  children,
}: {
  children?: string;
}) {
  return (
    <p className="mb-3 max-w-lg font-medium tracking-[-0.02em] text-gray-800 dark:text-gray-350">
      {children}
    </p>
  );
}
