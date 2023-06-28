import Image from "next/image";

export default function NotFoundPost() {
  return (
    <div className="flex flex-col mt-20 items-center space-x-4">
      <h1 className="text-4xl font-cal">404</h1>
      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/falling.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        Post does not exist, or you do not have permission to edit it
      </p>
    </div>
  );
}
