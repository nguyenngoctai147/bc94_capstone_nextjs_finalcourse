"use client";

import Image from "next/image";
import { useState, type ComponentProps, type ReactNode } from "react";
import { resolveApiImageSrc } from "@/lib/api/images";

type ApiImageProps = Omit<ComponentProps<typeof Image>, "src" | "onError"> & {
  src: string | null | undefined;
  fallback?: ReactNode;
};

export function ApiImage({ src, alt, fallback = null, ...props }: ApiImageProps) {
  const imageSrc = resolveApiImageSrc(src);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!imageSrc || failedSrc === imageSrc) return <>{fallback}</>;

  return <Image {...props} src={imageSrc} alt={alt} onError={() => setFailedSrc(imageSrc)} />;
}
