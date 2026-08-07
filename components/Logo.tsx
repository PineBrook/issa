'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = "h-10", iconOnly = false }: LogoProps) {
  // Extract custom sizing and spacing classes
  const classes = className.split(' ');
  const heightClass = classes.find(c => c.startsWith('h-')) || 'h-10';
  const otherClasses = classes.filter(c => !c.startsWith('h-') && !c.startsWith('w-') && !c.startsWith('aspect-')).join(' ');

  if (iconOnly) {
    return (
      <div 
        className={`relative overflow-hidden aspect-square select-none shrink-0 ${heightClass} ${otherClasses}`}
        id="logo-icon-only-container"
      >
        <Image
          src="/logo.webp" 
          alt="ISSA Foundation Shield" 
          width={520}
          height={164}
          className="h-full w-auto max-w-none object-cover object-left pointer-events-none"
          id="logo-icon-only-img"
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative select-none shrink-0 ${heightClass} ${otherClasses}`}
      id="logo-full-container"
    >
      <Image
        src="/logo.webp" 
        alt="ISSA Foundation Logo" 
        width={520}
        height={164}
        className="h-full w-auto object-contain pointer-events-none"
        id="logo-full-img"
      />
    </div>
  );
}
