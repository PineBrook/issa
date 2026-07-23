'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

interface BlurImageProps extends Omit<ImageProps, 'onLoad'> {
  wrapperClassName?: string;
}

/**
 * A highly optimized Next.js Image wrapper that provides an instant blur-up
 * placeholder using micro-Unsplash assets or theme-aligned shimmer fallbacks.
 */
export default function BlurImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  ...props
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Parse source URL to generate a micro-placeholder for Unsplash images
  const getMicroPlaceholderUrl = (source: any): string | null => {
    if (typeof source !== 'string') return null;
    if (!source.startsWith('https://images.unsplash.com')) return null;

    try {
      const url = new URL(source);
      // Replace size (w) and quality (q) with ultra-low preview values
      url.searchParams.set('w', '20');
      url.searchParams.set('q', '10');
      // Add a slight blur search param if Unsplash supports it, but keeping it small is enough
      return url.toString();
    } catch {
      return null;
    }
  };

  const microPlaceholder = getMicroPlaceholderUrl(src);

  return (
    <div
      className={`relative overflow-hidden ${
        props.fill ? 'w-full h-full' : ''
      } ${wrapperClassName}`}
      id={`blur-image-wrapper-${alt ? alt.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'img'}`}
    >
      {/* 1. Underlying Base Shimmer/Pulsing Layer */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0 z-10 bg-neutral-100 flex items-center justify-center overflow-hidden"
            id="image-shimmer-container"
          >
            {/* Shimmering Pulse Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-200/50 via-neutral-300/30 to-neutral-200/50 animate-pulse" />
            
            {/* Dynamic Low-Res Micro-Blur Image */}
            {microPlaceholder && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={microPlaceholder}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover filter blur-xl scale-110 select-none pointer-events-none opacity-80"
                id="image-micro-placeholder"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Standard High-Resolution Image */}
      <Image
        src={src}
        alt={alt}
        className={`transition-all duration-500 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.01]'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}
