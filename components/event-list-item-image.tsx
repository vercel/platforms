import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";

export default function EventListItemImage({
  ratio,
  src,
  alt,
}: {
  ratio?: number;

  src: string;
  alt: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl h-24 w-24 md:h-24 md:w-24">
      <AspectRatio ratio={1}>
        <Image
          alt={alt}
          src={src ?? "/placeholder.png"}
          className="object-cover"
          fill
          // placeholder="blur"
          // blurDataURL={event.imageBlurhash ?? placeholderBlurhash}
          // width={800}
          // height={400}
        />
      </AspectRatio>
    </div>
  );
}
