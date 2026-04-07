import Image from "next/image";

interface ImageFigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: "full" | "large" | "medium";
}

const widthMap = {
  full: "100%",
  large: "90%",
  medium: "70%",
} as const;

export function ImageFigure({ src, alt, caption, width = "full" }: ImageFigureProps) {
  return (
    <figure
      className="my-6"
      style={{ width: widthMap[width], marginInline: "auto" }}
    >
      <div className="overflow-hidden rounded-lg border border-cream-dark shadow-sm">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={675}
          className="h-auto w-full"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
