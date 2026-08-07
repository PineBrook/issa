'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import SearchPalette from './SearchPalette';

interface MenuItem {
  href: string;
  label: string;
  external?: boolean;
}

function NavItem({
  item,
  className,
  onClick,
}: {
  item: MenuItem;
  className: string;
  onClick?: () => void;
}) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} onClick={onClick} className={className}>
      {item.label}
    </Link>
  );
}

/**
 * Charcoal glass nav — complements warm ivory page surfaces and gold accents
 * without flooding the UI in forest green.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems: MenuItem[] = [
    { href: '/', label: 'About' },
    { href: '/programs', label: 'Programs' },
    { href: '/impact', label: 'Impact' },
    { href: '/stories', label: 'Stories' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
    { href: 'https://classes.issafoundation.in', label: 'LMS Login', external: true },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const linkBase =
    'text-sm font-medium tracking-wide transition-colors duration-200 relative px-4 py-2 rounded-full cursor-pointer';
  const linkIdle = 'text-white/75 hover:text-white hover:bg-white/8';
  const linkActive = 'bg-accent text-primary font-semibold shadow-sm';

  return (
    <>
      <nav
        className={`fixed z-50 left-1/2 -translate-x-1/2 text-white transition-[top,background-color,border-color,box-shadow,border-radius,padding] duration-400 ease-out ${
          isScrolled
            ? 'top-4 w-[calc(100%-2rem)] md:w-auto max-w-[calc(100%-2rem)] p-1.5 rounded-full border border-white/12 bg-[#1a1714]/92 backdrop-blur-xl shadow-[0_12px_40px_rgba(18,16,14,0.45)]'
            : 'top-0 w-full rounded-none border-b border-white/10 bg-[#12100e]/55 backdrop-blur-md shadow-none px-6 sm:px-6 lg:px-8'
        }`}
      >
        {isScrolled ? (
          <>
            <div className="hidden md:flex items-center gap-1 rounded-full">
              {menuItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  className={`${linkBase} text-xs ${isActive(item.href) ? linkActive : linkIdle}`}
                />
              ))}

              <button
                id="navbar-search-trigger"
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors duration-200 flex items-center justify-center cursor-pointer relative group shrink-0"
                aria-label="Open search palette"
              >
                <Search className="w-3.5 h-3.5 text-accent" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-[#1a1714]/95 border border-white/10 text-[9px] font-sans px-1.5 py-0.5 rounded text-white/70 transition-transform duration-150 whitespace-nowrap shadow-md pointer-events-none z-50">
                  ⌘ K
                </span>
              </button>
            </div>

            <div className="flex md:hidden items-center justify-between h-11 px-2 w-full">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer group transition-opacity duration-200 shrink-0"
              >
                <Logo className="h-8" iconOnly={true} />
              </Link>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 focus:outline-none transition-colors duration-200 cursor-pointer"
                  aria-label="Open search palette"
                >
                  <Search className="h-5 w-5 text-accent" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 focus:outline-none transition-colors duration-200 cursor-pointer"
                  id="mobile-menu-trigger-scrolled"
                  aria-label="Open main menu"
                >
                  <Menu className="block h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-6">
            <div className="flex-1 flex justify-start">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer group transition-opacity duration-200 whitespace-nowrap shrink-0"
              >
                <Logo className="h-10 text-accent" />
              </Link>
            </div>

            <div className="hidden md:flex items-center justify-center gap-1 lg:gap-2">
              {menuItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  className={`${linkBase} ${isActive(item.href) ? linkActive : linkIdle}`}
                />
              ))}
            </div>

            <div className="flex-1 hidden md:flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-full px-3 py-1.5 cursor-pointer transition-colors duration-200 text-xs text-white/70"
              >
                <span className="text-sm text-white/50 w-28 lg:w-36 text-left">Search...</span>
                <Search className="w-4 h-4 text-accent shrink-0" />
              </button>
            </div>

            <div className="md:hidden flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 focus:outline-none transition-colors duration-200 cursor-pointer"
                aria-label="Open search palette"
              >
                <Search className="h-5 w-5 text-accent" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 focus:outline-none transition-colors duration-200 cursor-pointer"
                id="mobile-menu-trigger"
                aria-label="Open main menu"
              >
                <Menu className="block h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] md:hidden cursor-pointer"
              id="mobile-menu-backdrop"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-[#1a1714] border-l border-white/10 z-[101] md:hidden shadow-2xl p-6 flex flex-col justify-between"
              id="mobile-menu-drawer"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-white/8">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Logo className="h-8" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                    aria-label="Close menu"
                    id="mobile-menu-close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      onClick={() => setIsOpen(false)}
                      className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer ${
                        isActive(item.href)
                          ? 'bg-accent text-primary font-semibold shadow-md'
                          : 'text-white/75 hover:bg-white/8 hover:text-white'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/8">
                <p className="text-[10px] text-white/50 leading-normal font-sans">
                  Supporting primary schools, smart labs, and medical clinics in remote Himalayan communities.
                </p>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-accent hover:bg-accent-dark text-primary px-4 py-3.5 rounded-xl text-center text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer"
                >
                  Join Us
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
