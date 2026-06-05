import Image from "next/image";
import type { ImageDisplaySettings } from "@/lib/image-display";
import {
  getImageDisplayContainerClass,
  getImageDisplayImageClass,
  getImageDisplayTransformStyle,
  resolveImageDisplay,
} from "@/lib/image-display";
import { cn } from "@/lib/utils";

export function ImageDisplayFrame({
  src,
  alt,
  settings,
  sizes,
  loading,
  priority,
  className,
  hover = true,
  children,
}: {
  src: string;
  alt: string;
  settings?: Partial<ImageDisplaySettings> | null;
  sizes: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  className?: string;
  hover?: boolean;
  children?: React.ReactNode;
}) {
  const resolved = resolveImageDisplay(settings);
  const containerClass = getImageDisplayContainerClass(resolved);
  const imageClass = getImageDisplayImageClass();
  const transformStyle = getImageDisplayTransformStyle(resolved);

  return (
    <div className={cn(containerClass, className)}>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div
          className={cn(
            "absolute inset-0",
            hover && "transition-transform duration-500 group-hover:scale-[1.03]",
          )}
          style={transformStyle}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            loading={loading}
            priority={priority}
            className={imageClass}
            draggable={false}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
