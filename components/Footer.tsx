'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import Newsletter from './Newsletter';
import { Youtube, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import type { SiteSettings } from '@/lib/site-cms-types';
const currentYear = new Date().getFullYear();

export default function Footer({ settings }: { settings?: SiteSettings } = {}) {
  const youtubeUrl = settings?.youtubeUrl || 'https://www.youtube.com/@ISSAClasses';
  const facebookUrl = settings?.facebookUrl || 'https://www.facebook.com/profile.php?id=61592854956791&sk=about';
  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/issa__foundation/';
  const twitterUrl = settings?.twitterUrl || 'https://x.com/ISSAfoundation1';
  const linkedinUrl = settings?.linkedinUrl || 'https://www.linkedin.com/company/issa-foundation-uttarakhand/about/?viewAsMember=true';
  const phone = settings?.phone || '0135 430 8180';
  const email = settings?.email || 'career.issafoundation@gmail.com';
  const tagline = settings?.footerTagline || 'A grassroots non-profit committed to strengthening educational infrastructure, digital literacy, and clinical care systems across remote Himalayan communities.';

  return (
    <footer className="bg-primary-dark text-neutral-300 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          {/* Logo and Tagline */}
          <div className="md:col-span-4 space-y-4">
            <Logo className="w-[13.5rem] h-[5.25rem] text-accent" logoUrl={settings?.logoUrl} />
            <p className="text-sm text-neutral-300 leading-relaxed max-w-xs font-sans">
              {tagline}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-neutral-200 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300"
                  aria-label="YouTube"
                  id="footer-social-youtube"
                >
                  <Youtube className="w-4.5 h-4.5" />
                </a>
              )}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-neutral-200 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300"
                  aria-label="Facebook"
                  id="footer-social-facebook"
                >
                  <Facebook className="w-4.5 h-4.5" />
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-neutral-200 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300"
                  aria-label="Instagram"
                  id="footer-social-instagram"
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-neutral-200 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300" aria-label="Twitter / X" id="footer-social-x"><Twitter className="w-4.5 h-4.5" /></a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-neutral-200 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300" aria-label="LinkedIn" id="footer-social-linkedin"><Linkedin className="w-4.5 h-4.5" /></a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-4">
            <p className="text-sm font-sans uppercase tracking-wider text-white font-bold">Quick Links</p>
            <ul className="space-y-2.5 text-sm text-neutral-300 font-medium">
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
                  Program Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="md:col-span-2 space-y-4">
            <p className="text-sm font-sans uppercase tracking-wider text-white font-bold">Governance & Legal</p>
            <ul className="space-y-2.5 text-sm text-neutral-300 font-medium">
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
            <div className="pt-4 border-t border-white/10 space-y-2">
              <h5 className="text-xs font-sans uppercase tracking-wider text-white font-bold">Operations & Offices</h5>
              <p className="text-xs text-neutral-300 font-sans">
                <strong className="text-white">Head Office:</strong> {settings?.headOfficeAddress || 'Dehradun'} | <strong className="text-white">Regional Office:</strong> {settings?.regionalOfficeAddress || 'Pauri'}
              </p>
              <div className="flex flex-wrap items-baseline gap-x-3 pt-1">
                <p className="text-xl font-serif text-accent font-bold">{phone}</p>
                <p className="text-xs text-neutral-300 font-sans font-medium">{email}</p>
              </div>
              {settings?.taxExemptInfo && (
                <p className="text-[11px] text-neutral-400 font-sans pt-1">
                  {settings.taxExemptInfo}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-sm font-sans text-neutral-300">
          <p className="text-center md:text-left">© { currentYear } ISSA Foundation. All rights reserved.</p>
          <div className="flex items-center justify-center gap-3 text-neutral-300 flex-wrap text-center">
            <Link href="/privacy" className="hover:text-accent transition-colors cursor-pointer">
              Privacy Policy
            </Link>
            <span>•</span>
            <a 
              href="https://pinebrooktechnologies.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline transition-all cursor-pointer text-neutral-300 hover:text-accent"
            >
            By PineBrook
            </a>
            <span>•</span>
            <Link href="/terms" className="hover:text-accent transition-colors cursor-pointer">
              Terms & Conditions
            </Link>
          </div>
          <div className="hidden md:block"></div>
        </div>
      </div>
    </footer>
  );
}
