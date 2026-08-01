'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import SearchPalette from './SearchPalette';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { href: '/', label: 'About' },
    { href: '/programs', label: 'Programs' },
    { href: '/impact', label: 'Impact' },
    { href: '/stories', label: 'Stories' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav 
        className={`fixed z-50 transition-[top,width,padding,margin,background-color,border-color,box-shadow] duration-500 ease-out left-1/2 -translate-x-1/2 text-white ${
          isScrolled 
            ? 'top-4 bg-primary-dark border border-white/20 shadow-[0_12px_40px_0_rgba(7,30,19,0.5)] w-[calc(100%-2rem)] md:w-auto p-1.5 rounded-full' 
            : 'top-0 bg-primary-dark border-b border-white/10 border-t-0 border-l-0 border-r-0 w-full rounded-none shadow-md px-6 sm:px-6 lg:px-8'
        }`}
      >
        {isScrolled ? (
          <>
            {/* Desktop Dock */}
            <div className="hidden md:flex items-center gap-1 rounded-full">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-medium tracking-wide transition-all duration-300 relative px-4 py-2 rounded-full cursor-pointer ${
                    isActive(item.href) 
                      ? 'bg-accent text-primary font-semibold shadow-sm' 
                      : 'text-neutral-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <button
                id="navbar-search-trigger"
                onClick={() => setIsSearchOpen(true)}
                className="text-neutral-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer relative group shrink-0"
                aria-label="Open search palette"
              >
                <Search className="w-3.5 h-3.5 text-accent" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-[#092215]/95 border border-white/10 text-[9px] font-sans px-1.5 py-0.5 rounded text-neutral-300 transition-all duration-150 whitespace-nowrap shadow-md pointer-events-none z-50">
                  ⌘ K
                </span>
              </button>
            </div>

            {/* Mobile Scrolled Dock */}
            <div className="flex md:hidden items-center justify-between h-11 px-2 w-full">
              <Link 
                href="/"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer group transition-all duration-300 shrink-0"
              >
                <Logo className="h-8" iconOnly={true} />
              </Link>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-200 cursor-pointer"
                  aria-label="Open search palette"
                >
                  <Search className="h-5 w-5 text-accent" />
                </button>
                <button
                  onClick={() => setIsOpen(true)}
                  className="p-1.5 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-200 cursor-pointer"
                  id="mobile-menu-trigger-scrolled"
                >
                  <Menu className="block h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Unscrolled Header */
          <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-6">
            {/* Left: Logo */}
            <div className="flex-1 flex justify-start">
              <Link 
                href="/"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer group transition-all duration-300 whitespace-nowrap shrink-0"
              >
                <Logo className="h-10 text-accent group-hover:scale-105 transition-transform duration-300" />
              </Link>
            </div>

            {/* Center: Links center-aligned */}
            <div className="hidden md:flex items-center justify-center gap-1 lg:gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 relative px-4 py-2 rounded-full cursor-pointer ${
                    isActive(item.href) 
                      ? 'bg-accent text-primary font-semibold shadow-sm' 
                      : 'text-neutral-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right: Search Box + Search Icon */}
            <div className="flex-1 hidden md:flex items-center justify-end gap-2">
              <div 
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-full px-3 py-1.5 cursor-pointer transition-all duration-300 text-xs text-neutral-300 group"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  readOnly
                  className="bg-transparent text-sm text-white placeholder-neutral-400 focus:outline-none w-28 lg:w-36 cursor-pointer"
                />
                <button
                  id="navbar-search-trigger-unscrolled"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSearchOpen(true);
                  }}
                  className="text-neutral-300 hover:text-white p-1 rounded-full transition-all duration-300 flex items-center justify-center shrink-0"
                  aria-label="Open search palette"
                >
                  <Search className="w-4 h-4 text-accent" />
                </button>
              </div>
            </div>

            {/* Mobile hamburger / search icon */}
            <div className="md:hidden flex items-center gap-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-200 cursor-pointer"
                aria-label="Open search palette"
              >
                <Search className="h-5.5 w-5.5 text-accent" />
              </button>
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-200 cursor-pointer"
                id="mobile-menu-trigger"
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="block h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-primary-dark/80 backdrop-blur-sm z-[100] md:hidden cursor-pointer"
              id="mobile-menu-backdrop"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-primary-dark border-l border-white/10 z-[101] md:hidden shadow-2xl p-6 flex flex-col justify-between"
              id="mobile-menu-drawer"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <Link 
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Logo className="h-8" />
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    aria-label="Close menu"
                    id="mobile-menu-close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                        isActive(item.href)
                          ? 'bg-accent text-primary font-semibold shadow-md'
                          : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <p className="text-[10px] text-neutral-400 leading-normal font-sans">
                  Supporting primary schools, smart labs, and medical clinics in remote Himalayan communities.
                </p>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-accent hover:bg-accent-dark text-primary px-4 py-3.5 rounded-xl text-center text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-accent/20"
                >
                  Join Us
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}
