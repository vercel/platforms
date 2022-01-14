import Link from "next/link";
import BlurImage from "./BlurImage";
import Date from "./Date";

export default function BlogCard({ data }) {
  return (
    <Link href={`/${data.slug}`}>
      <a>
        <div className="rounded-2xl border-2 border-gray-100 overflow-hidden shadow-md bg-white hover:shadow-xl hover:-translate-y-1 transition-all ease duration-200">
          <BlurImage
            src={data.image}
            alt={data.title}
            width={500}
            height={400}
            layout="responsive"
            objectFit="cover"
            placeholder="blur"
            blurDataURL={data.imageBlurhash}
          />
          <div className="py-8 px-5 h-36 border-t border-gray-200">
            <h3 className="font-cal text-xl tracking-wide">{data.title}</h3>
            <p className="text-md italic text-gray-600 my-2 truncate">
              {data.description}
            </p>
            <p className="text-sm text-gray-600 my-2">
              Published <Date dateString={data.createdAt} />
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
}
