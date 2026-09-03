'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  logoUrl?: string;
}

export default function Logo({ className = "h-10", iconOnly = false, logoUrl }: LogoProps) {
  // Extract custom sizing and spacing classes
  const classes = className.split(' ');
  const heightClass = classes.find(c => c.startsWith('h-')) || 'h-10';
  const widthClass = classes.find(c => c.startsWith('w-')) || 'w-36';
  const otherClasses = classes.filter(c => !c.startsWith('h-') && !c.startsWith('w-') && !c.startsWith('aspect-')).join(' ');

  const src = (logoUrl && logoUrl.trim()) ? logoUrl : '/logo_new.png';
  const isExternal = src.startsWith('http://') || src.startsWith('https://');

  if (iconOnly) {
    return (
      <div 
        className={`relative overflow-hidden aspect-square select-none shrink-0 ${heightClass} ${otherClasses}`}
        id="logo-icon-only-container"
      >
        <Image
          src={src}
          alt="ISSA Foundation Shield" 
          width={612}
          height={408}
          unoptimized={isExternal}
          className="h-full w-auto max-w-none object-contain object-left pointer-events-none"
          id="logo-icon-only-img"
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden select-none shrink-0 ${heightClass} ${widthClass} ${otherClasses}`}
      id="logo-full-container"
    >
      <Image
        src={src}
        alt="ISSA Foundation Logo" 
        width={612}
        height={408}
        unoptimized={isExternal}
        className="absolute inset-0 h-full w-full object-contain pointer-events-none"
      />
    </div>
  );
}
