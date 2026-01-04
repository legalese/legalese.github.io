import cn from "classnames";
import Link from "next/link";
import Image from "next/image";

type Props = {
  title: string;
  src: string;
  slug?: string;
  className?: string;
};

const CoverImage = ({ title, src, slug, className }: Props) => {
  const useFill = className?.includes("object-cover");
  
  const image = (
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn("shadow-sm", className || "w-full", {
        "hover:shadow-lg transition-shadow duration-200": slug,
      })}
      {...(useFill 
        ? { fill: true, sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" }
        : { width: 1300, height: 630 }
      )}
    />
  );
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]" aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
