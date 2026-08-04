'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface BlurImageProps extends Omit<ImageProps, 'onLoad'> {
  wrapperClassName?: string;
}

/**
 * A highly optimized Next.js Image wrapper with robust fallback,
 * referrerPolicy="no-referrer", and instant loading states.
 */
export default function BlurImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  ...props
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${
        props.fill ? 'w-full h-full' : ''
      } ${wrapperClassName}`}
      id={`blur-image-wrapper-${alt ? String(alt).toLowerCase().replace(/[^a-z0-9]/g, '-') : 'img'}`}
    >
      {/* 1. Subtle Shimmer Background (behind image) */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-neutral-800/30 animate-pulse pointer-events-none z-0"
          id="image-shimmer-container"
        />
      )}

      {/* 2. High-Resolution Image with no-referrer policy */}
      <Image
        src={src}
        alt={alt}
        unoptimized
        referrerPolicy="no-referrer"
        className={`transition-opacity duration-300 relative z-[1] ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}

