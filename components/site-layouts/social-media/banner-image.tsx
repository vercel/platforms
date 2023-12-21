import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

export default function BannerImage({
  src,
  alt,
  blurDataURL,
}: {
  src?: string;
  alt?: string;
  blurDataURL?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden md:rounded-3xl">
      {src ? (
        <AspectRatio ratio={3 / 1} className="w-full">
          <Image
            src={src}
            alt={alt ? alt : "Banner Image"}
            blurDataURL={blurDataURL ? blurDataURL : undefined}
            fill
            className="object-cover"
          />
        </AspectRatio>
      ) : null}
    </div>
  );
}
