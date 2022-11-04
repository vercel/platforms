import BlurImage from "../BlurImage";

import type { MdxCardData } from "@/types";

interface CardProps {
  data: MdxCardData;
}

export default function Card({ data }: CardProps) {
  return (
    <a href={`https://${data.url}`} target="_blank" rel="noreferrer">
      <div className="hidden lg:block rounded-2xl border-2 border-gray-100 shadow-md bg-white hover:shadow-xl hover:-translate-y-1 transition-all ease duration-200">
        <div className="rounded-t-2xl overflow-hidden">
          <BlurImage
            alt={data.name ?? "Card Thumbnail"}
            width={500}
            height={400}
            className="w-full h-64 object-cover"
            src={`/examples/${data.image}`}
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? undefined}
          />
        </div>
        <div className="py-6 px-5 h-36">
          <h3 className="font-cal text-2xl font-bold tracking-wide truncate">
            {data.name}
          </h3>
          <p className="mt-3 text-gray-800 italic text-base leading-snug">
            {data.description}
          </p>
        </div>
      </div>
      <div className="lg:hidden overflow-hidden rounded-xl flex items-center md:h-48 h-36 border-2 border-gray-100 focus:border-black active:border-black bg-white transition-all ease duration-200">
        <div className="w-2/5 relative h-full">
          <BlurImage
            alt={data.name ?? "Card thumbnail"}
            width={500}
            height={400}
            className="h-full object-cover"
            src={`/examples/${data.image}`}
            placeholder="blur"
            blurDataURL={data.imageBlurhash ?? undefined}
          />
        </div>
        <div className="py-6 px-5 w-3/5">
          <h3 className="font-cal my-0 text-xl font-bold tracking-wide truncate">
            {data.name}
          </h3>
          <p className="mt-3 text-gray-800 italic text-sm leading-snug font-normal">
            {data.description}
          </p>
        </div>
      </div>
    </a>
  );
}
