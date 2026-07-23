'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Sparkles, X, CornerDownLeft, Command, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchItem {
  id: string;
  label: string;
  description: string;
  category: string;
  href: string;
  elementId: string;
  pillar?: 'education' | 'healthcare' | 'entrepreneurship';
}

const SEARCH_ITEMS: SearchItem[] = [
  // Home Page
  { id: 'home-root', label: 'Home & About Us', description: 'ISSA Foundation overview and grassroots mission in Uttarakhand', category: 'Home', href: '/', elementId: 'home-view' },
  { id: 'home-hero-sec', label: 'Lasting Change Close to Home', description: 'Strengthening education, healthcare, and opportunity across Himalayas', category: 'Home', href: '/', elementId: 'home-hero' },
  { id: 'home-philo', label: 'Grassroots Development Philosophy', description: 'Collaborating with village leaders and state authorities to build resilience', category: 'Home', href: '/', elementId: 'home-philosophy' },
  { id: 'home-4pillars', label: 'Four Focused Pillars', description: 'Education, Healthcare, Skills, and Digital Inclusion', category: 'Home', href: '/', elementId: 'home-pillars' },
  { id: 'home-strategic', label: 'Strategic Interventions', description: 'Smart boards, specialist teachers, and hospital beds in Pauri Garhwal', category: 'Home', href: '/', elementId: 'home-strategic-interventions' },
  { id: 'home-journals', label: 'Field Dispatches & Stories', description: 'Recent stories from our smart-classroom and mobile medical camps', category: 'Home', href: '/', elementId: 'home-stories' },
  { id: 'home-collab', label: 'Collaborate & Impact Form', description: 'Volunteer, partner, or contact our team directly', category: 'Home', href: '/', elementId: 'home-collaborate' },

  // Programs Page
  { id: 'prog-overview', label: 'Core Programs Overview', description: 'Discover our Education, Healthcare, and Entrepreneurship pillars', category: 'Programs', href: '/programs', elementId: 'programs-view' },
  { id: 'prog-edu', label: 'ISSA Education Initiative', description: 'Transforming government schools, digital classrooms, and teacher support', category: 'Education', href: '/programs', elementId: 'program-education', pillar: 'education' },
  { id: 'prog-cias', label: 'CIAS Adopted Schools Cluster', description: '12 government schools adopted in partnership with Education Department', category: 'Education', href: '/programs', elementId: 'program-cias', pillar: 'education' },
  { id: 'prog-smart', label: 'Smart Classrooms & Digital Labs', description: 'Interactive Smart Boards, computers, and digital literacy training', category: 'Education', href: '/programs', elementId: 'program-smart-classrooms', pillar: 'education' },
  { id: 'prog-skills', label: 'Future-Ready & Agniveer Prep', description: 'Computer education, career guidance, and military recruitment coaching', category: 'Education', href: '/programs', elementId: 'program-future-skills', pillar: 'education' },
  { id: 'prog-health', label: 'ISSA Rural Healthcare Initiative', description: 'Hospitals, polyclinics, mobile units, and community health outreach', category: 'Healthcare', href: '/programs', elementId: 'program-healthcare', pillar: 'healthcare' },
  { id: 'prog-uttara', label: 'UttaraCare Hospital (Pauri Garhwal)', description: 'Affordable specialist consultations, inpatient care, and clinical backbone', category: 'Healthcare', href: '/programs', elementId: 'program-uttaracare', pillar: 'healthcare' },
  { id: 'prog-bironkhal', label: 'Bironkhal Rural Health Hub', description: 'OPD consultations, diagnostics, pharmacy, and telemedicine in remote block', category: 'Healthcare', href: '/programs', elementId: 'program-bironkhal', pillar: 'healthcare' },
  { id: 'prog-mobile', label: 'Mobile Medical Units & Camps', description: 'Weekly village visits, preventive health camps, and medicine delivery', category: 'Healthcare', href: '/programs', elementId: 'program-mobile-health', pillar: 'healthcare' },
  { id: 'prog-beyond', label: 'Preventive Healthcare Outreach', description: 'Maternal care, school health checks, nutrition, and elderly screening', category: 'Healthcare', href: '/programs', elementId: 'program-beyond-treatment', pillar: 'healthcare' },
  { id: 'prog-iedp', label: 'Entrepreneurship Program (IEDP)', description: 'Mentorship, digital tech, soft loans, and growth partnership for local businesses', category: 'Entrepreneurship', href: '/programs', elementId: 'program-entrepreneurship', pillar: 'entrepreneurship' },
  { id: 'prog-iedp-eco', label: 'IEDP Business Growth Ecosystem', description: 'Connecting entrepreneurs with mentors, technology, and market access', category: 'Entrepreneurship', href: '/programs', elementId: 'program-iedp-ecosystem', pillar: 'entrepreneurship' },
  { id: 'prog-iedp-ent', label: 'Meet Our Rural Entrepreneurs', description: 'Supporting 19 shortlisted entrepreneurs in agriculture, food, and craft', category: 'Entrepreneurship', href: '/programs', elementId: 'program-iedp-entrepreneurs', pillar: 'entrepreneurship' },

  // Impact Page
  { id: 'impact-root', label: 'Evidence-Led Impact Overview', description: 'Metrics, attendance surge data, and transparent audit reports', category: 'Impact', href: '/impact', elementId: 'impact-view' },
  { id: 'impact-metrics-sec', label: 'Quantified Impact Metrics', description: '84% attendance surge, 72% reduced travel, 100% direct sourcing', category: 'Impact', href: '/impact', elementId: 'impact-metrics' },
  { id: 'impact-milestones-sec', label: 'Sustained Competency Growth', description: 'Student assessment trends across CIAS digital classroom terms', category: 'Impact', href: '/impact', elementId: 'impact-milestones' },
  { id: 'impact-transparency-sec', label: 'Field Transparency & Audits', description: 'Published annual program audits and direct project allocations', category: 'Impact', href: '/impact', elementId: 'impact-transparency' },

  // Stories Page
  { id: 'stories-root', label: 'Field Journals & Dispatches', description: 'Direct articles from educators, doctors, and village supervisors', category: 'Stories', href: '/stories', elementId: 'stories-view' },
  { id: 'story-digital-pauri', label: 'Digital Empowerment in Pauri', description: 'Bringing smart classrooms to over 350 rural students', category: 'Stories', href: '/stories', elementId: 'story-smart-labs' },
  { id: 'story-medical-peaks', label: 'Reaching the Unreachable Peaks', description: 'Free mobile medical camps delivering diagnostics in high altitudes', category: 'Stories', href: '/stories', elementId: 'story-high-clinics' },
  { id: 'story-youth-skills', label: 'Future-Proofing Youth Skills', description: 'Himalayan graduates completing industry technical certifications', category: 'Stories', href: '/stories', elementId: 'story-village-spot' },

  // Careers Page
  { id: 'careers-root', label: 'Careers & Field Opportunities', description: 'Join our team in Dehradun, Pauri, or remote mountain centers', category: 'Careers', href: '/careers', elementId: 'careers-view' },
  { id: 'careers-list-sec', label: 'Open Staff Positions', description: 'Senior Education Expert, Healthcare Camp Coordinator, Program Manager', category: 'Careers', href: '/careers', elementId: 'careers-openings' },
  { id: 'careers-form-sec', label: 'Apply Online Form', description: 'Submit your resume and statement of intent directly to HR', category: 'Careers', href: '/careers', elementId: 'application-form-card' },

  // Contact Page
  { id: 'contact-root', label: 'Contact Us & Offices', description: 'Dehradun Headquarters, Srinagar Garhwal, and Pauri Education Center', category: 'Contact', href: '/contact', elementId: 'contact-view' },
  { id: 'contact-offices-sec', label: 'Regional Office Locations', description: 'Addresses and contact info for our administrative and field hubs', category: 'Contact', href: '/contact', elementId: 'contact-offices' },
  { id: 'contact-form-sec', label: 'Send a Message', description: 'Log a direct inquiry with our regional sourcing desk', category: 'Contact', href: '/contact', elementId: 'contact-inquiry-form' },
  { id: 'contact-faq-sec', label: 'Frequently Asked Questions', description: 'Common questions about locations, volunteering, and governance', category: 'Contact', href: '/contact', elementId: 'contact-faq' },

  // Privacy & Terms
  { id: 'gov-privacy', label: 'Privacy Policy', description: 'Data protection, volunteer registrations, and 80G receipt guidelines', category: 'Governance', href: '/privacy', elementId: 'privacy-policy-section' },
  { id: 'gov-terms', label: 'Terms & Conditions', description: 'Legal rules, donation terms, and statutory compliance under Indian law', category: 'Governance', href: '/terms', elementId: 'terms-conditions-section' }
];

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchPalette({ isOpen, onClose }: SearchPaletteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        setQuery('');
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle global Cmd/Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger click or call open
          const btn = document.getElementById('navbar-search-trigger');
          btn?.click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items based on query
  const filteredItems = query.trim() === ''
    ? SEARCH_ITEMS.slice(0, 5) // Show top items when empty
    : SEARCH_ITEMS.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  // Handle key navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelectItem = (item: SearchItem) => {
    onClose();

    const target = item.pillar ? `/programs?pillar=${item.pillar}` : item.href;
    if (target.split('?')[0] !== pathname) {
      router.push(`${target}#${item.elementId}`);
      return;
    }

    if (item.pillar) {
      window.dispatchEvent(new CustomEvent('jump-to-section', { detail: item }));
    }

    // Scroll to element after a slight delay to allow rendering
    setTimeout(() => {
      const element = document.getElementById(item.elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add dynamic visual highlight effect if elements support it
        element.classList.add('ring-2', 'ring-accent', 'ring-offset-2', 'transition-all', 'duration-500');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-accent', 'ring-offset-2');
        }, 2000);
      }
    }, 250);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[10vh] px-4 md:px-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary-dark/80 backdrop-blur-md cursor-pointer"
            id="search-palette-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
            className="relative w-full max-w-xl bg-[#092215]/95 border border-white/10 rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden"
            id="search-palette-modal"
            ref={containerRef}
          >
            {/* Search Input Bar */}
            <div className="relative border-b border-white/10 flex items-center px-4 py-4">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search programs, stories, careers..."
                className="w-full bg-transparent border-none text-white placeholder-neutral-400 focus:outline-none focus:ring-0 pl-3 text-sm font-sans"
              />
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-neutral-400 font-sans">
                  ESC
                </span>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results Body */}
            <div className="max-h-[350px] overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {filteredItems.length > 0 ? (
                <>
                  {filteredItems.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex items-start justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                          isSelected
                            ? 'bg-accent/15 border-accent/20 text-white shadow-inner'
                            : 'bg-transparent border-transparent text-neutral-300 hover:text-white'
                        }`}
                        id={`search-item-${item.id}`}
                      >
                        <div className="flex flex-col gap-0.5 max-w-[85%]">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold font-serif leading-none">
                              {item.label}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-sans uppercase tracking-wider text-neutral-400">
                              {item.category}
                            </span>
                          </div>
                          <span className="text-[11px] text-neutral-400 font-sans leading-normal line-clamp-1">
                            {item.description}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="flex items-center gap-1 self-center animate-fade-in text-accent shrink-0">
                            <span className="text-[9px] font-sans tracking-wider">JUMP</span>
                            <CornerDownLeft className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                  <HelpCircle className="w-8 h-8 text-neutral-500 animate-pulse" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-300 font-serif">No matches found</p>
                    <p className="text-[11px] text-neutral-500 font-sans mt-0.5">Try searching for other terms like &quot;sanitation&quot;, &quot;clinic&quot;, or &quot;careers&quot;</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Commands */}
            <div className="px-4 py-3 bg-primary-dark/80 border-t border-white/5 flex items-center justify-between text-[10px] font-sans text-neutral-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="px-1 bg-white/5 rounded border border-white/10">↑↓</span> Move
                </span>
                <span className="flex items-center gap-1">
                  <span className="px-1 bg-white/5 rounded border border-white/10">↵</span> Select
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Command className="w-3.5 h-3.5" />
                <span>+ K</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
