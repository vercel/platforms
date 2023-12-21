export default function HeaderMainTitle({ children }: { children?: string }) {
  return (
    <h1 className="mb-3 text-2xl font-extrabold text-gray-800  dark:text-gray-200 md:text-3xl">
      {children}
    </h1>
  );
}
