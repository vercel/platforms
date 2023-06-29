import Image from "next/image";

export default function NotFound() {
  console.log("404 on app/[domain]/not-found.tsx");
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-cal">404</h1>
      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/timed-out-error.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        Blimey! You&rsquo;ve found a page that doesn&rsquo;t exist.
      </p>
    </div>
  );
}
