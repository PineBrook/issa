'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import Newsletter from './Newsletter';
import { Youtube, Facebook, Instagram } from 'lucide-react';
const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-neutral-300 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          {/* Logo and Tagline */}
          <div className="md:col-span-4 space-y-4">
            <Logo className="w-9 h-9 text-accent" />
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs font-sans">
              A grassroots non-profit committed to strengthening educational infrastructure, digital literacy, and clinical care systems across remote Himalayan communities.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.youtube.com/@ISSAClasses" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300"
                aria-label="YouTube"
                id="footer-social-youtube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/people/ISSA-Foundation/61582300538326/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300"
                aria-label="Facebook"
                id="footer-social-facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/issa.foundation/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300"
                aria-label="Instagram"
                id="footer-social-instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-4">
            <p className="text-xs font-sans uppercase tracking-wider text-white font-bold">Quick Links</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  About Our Work
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-accent transition-colors">
                  Core Programs
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-accent transition-colors">
                  Our Impact Metrics
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-accent transition-colors">
                  Field Dispatches
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="md:col-span-2 space-y-4">
            <p className="text-xs font-sans uppercase tracking-wider text-white font-bold">Governance & Legal</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/careers" className="hover:text-accent transition-colors">
                  Join Our Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  General Inquiries
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Sourcing Hotline & Newsletter */}
          <div className="md:col-span-4 space-y-6">
            <Newsletter />
            <div className="pt-4 border-t border-white/5 space-y-2">
              <h5 className="text-[10px] font-sans uppercase tracking-widest text-neutral-400">Operations Support</h5>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                For regional partnerships or administrative inquiries, reach our hotline:
              </p>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <p className="text-lg font-serif text-accent font-bold">0135 430 8180</p>
                <p className="text-[10px] text-neutral-400 font-sans">career.issafoundation@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-xs font-sans text-neutral-400">
          <p className="text-center md:text-left">© { currentYear } ISSA Foundation. All rights reserved.</p>
          <div className="flex items-center justify-center gap-3 text-neutral-400 flex-wrap text-center">
            <Link href="/privacy" className="hover:text-accent transition-colors cursor-pointer">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-accent transition-colors cursor-pointer">
              Terms & Conditions
            </Link>
            <span>•</span>
            <a 
              href="https://pinebrooktechnologies.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline transition-all cursor-pointer text-neutral-400 hover:text-accent"
            >
            By PineBrook
            </a>
          </div>
          <div className="hidden md:block"></div>
        </div>
      </div>
    </footer>
  );
}
