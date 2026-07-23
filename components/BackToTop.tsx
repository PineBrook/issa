'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Show button after scrolling 300px
      if (scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Track scroll progress percentage
      if (totalHeight > 0) {
        const progress = (scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to set initial visibility and progress
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Circular progress calculation
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-1 rounded-full bg-primary/85 hover:bg-primary backdrop-blur-md border border-white/10 text-white shadow-xl hover:shadow-accent/25 transition-all duration-300 group cursor-pointer"
          aria-label="Back to top"
          id="back-to-top-button"
        >
          <div className="relative w-11 h-11 flex items-center justify-center">
            {/* SVG Circular Progress Track */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              {/* Background circle track */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-white/10 fill-none"
                strokeWidth="2.5"
              />
              {/* Animated Progress circle */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-accent fill-none transition-all duration-150 ease-out"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Arrow Icon */}
            <ArrowUp className="w-5 h-5 text-accent group-hover:text-white transition-colors duration-300 group-hover:-translate-y-0.5 transform" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
