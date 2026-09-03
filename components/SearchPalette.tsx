'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, X, CornerDownLeft, Command, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchItem {
  id: string;
  label: string;
  description: string;
  category: string;
  href: string;
  elementId: string;
  keywords?: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  // ── Home ──────────────────────────────────────────────────────────────
  { id: 'home-root', label: 'Home & About Us', description: 'ISSA Foundation overview and grassroots mission in Uttarakhand', category: 'Home', href: '/', elementId: 'home-view', keywords: 'about mission foundation uttarakhand himalaya' },
  { id: 'home-hero-sec', label: 'Our Community Programs', description: 'Healthcare, education, entrepreneurship, and community programs across Uttarakhand', category: 'Home', href: '/', elementId: 'home-hero', keywords: 'hero animation social work ngo education healthcare primary healthcare entrepreneurship village trust' },
  { id: 'home-stats', label: 'Key Impact Snapshot', description: '11+ schools adopted, 20+ hospital beds, 600+ students trained, 100% local sourcing', category: 'Home', href: '/', elementId: 'home-stats', keywords: 'stats metrics numbers schools beds students' },
  { id: 'home-philo', label: 'Development Led by Local Communities', description: 'Work with village elders, leaders, and state authorities on local programs', category: 'Home', href: '/', elementId: 'home-philosophy', keywords: 'philosophy grassroots integrated education holistic health' },
  { id: 'home-4pillars', label: 'One Connected Ecosystem for Holistic Impact', description: 'Healthcare, Education, Entrepreneurship, Career & Opportunities, and Digital Transformation', category: 'Home', href: '/', elementId: 'home-pillars', keywords: 'pillars ecosystem healthcare education entrepreneurship careers agniveer pinebrook digital transformation' },
  { id: 'home-strategic', label: 'Targeted Work and Results', description: 'Smart boards, specialist teachers, and hospital beds supporting communities', category: 'Home', href: '/', elementId: 'home-strategic-interventions', keywords: 'strategic interventions smart boards teachers pauri' },
  { id: 'home-journals', label: 'Stories from Himalayan Communities', description: 'Recent stories about smart classrooms, medical camps, and youth skills', category: 'Home', href: '/', elementId: 'home-stories', keywords: 'stories journals dispatches pauri medical skills' },
  { id: 'home-collab', label: 'Partner With Us', description: 'Volunteer, partner, or support structural development — 0135 430 8180', category: 'Home', href: '/', elementId: 'home-collaborate', keywords: 'collaborate volunteer partner form phone email career' },

  // ── Programs overview + sub-pages ─────────────────────────────────────
  { id: 'prog-overview', label: 'Core Programs Overview', description: 'Four connected pillars: Education, Healthcare, Entrepreneurship, and Career & Opportunities', category: 'Programs', href: '/programs', elementId: 'programs-view', keywords: 'programs pillars overview career opportunities' },

  // Education (/programs/education)
  { id: 'prog-edu', label: 'ISSA Education Initiative', description: 'Transform government schools, digital classrooms, and teacher support in Uttarakhand', category: 'Education', href: '/programs/education', elementId: 'education-initiative', keywords: 'education school learning teachers digital' },
  { id: 'prog-cias', label: 'Cluster of ISSA-Adopted Schools (CIAS)', description: '12 government schools supported with the Uttarakhand Education Department', category: 'Education', href: '/programs/education', elementId: 'program-cias', keywords: 'cias adopted schools cluster government' },
  { id: 'prog-smart', label: 'Smart Classrooms & Digital Learning', description: 'Smart Boards, computers, and interactive technology-enabled education', category: 'Education', href: '/programs/education', elementId: 'program-smart-classrooms', keywords: 'smart board classroom digital lab computer' },
  { id: 'prog-academic', label: 'Academic Excellence', description: 'Subject-specialist teachers improving outcomes in key subjects', category: 'Education', href: '/programs/education', elementId: 'program-academic-excellence', keywords: 'academic excellence specialist teachers' },
  { id: 'prog-computer', label: 'Computer Education & Digital Literacy', description: 'Structured computer learning for higher education and employment', category: 'Education', href: '/programs/education', elementId: 'program-computer-edu', keywords: 'computer literacy digital skills coding' },
  { id: 'prog-career', label: 'Career Guidance & Competitive Exams', description: 'Coaching for government exams, employment, and public service careers', category: 'Education', href: '/programs/education', elementId: 'program-career-guidance', keywords: 'career guidance competitive exam coaching' },
  { id: 'prog-agniveer', label: 'Agniveer Preparation Programme', description: 'Structured training and physical readiness for Agniveer recruitment', category: 'Education', href: '/programs/education', elementId: 'program-agniveer', keywords: 'agniveer military army recruitment youth' },
  { id: 'prog-future', label: 'Future Ready Education', description: 'Communication, leadership, digital skills, financial literacy, entrepreneurship', category: 'Education', href: '/programs/education', elementId: 'program-future-skills', keywords: 'future ready soft skills leadership innovation' },

  // Healthcare (/programs/healthcare)
  { id: 'prog-health', label: 'ISSA Rural Healthcare Initiative', description: 'Hospitals, rural hubs, mobile units, telemedicine, and community outreach', category: 'Healthcare', href: '/programs/healthcare', elementId: 'healthcare-initiative', keywords: 'healthcare health rural medical clinic hospital' },
  { id: 'prog-uttara', label: 'UttaraCare Hospital (Pauri Garhwal)', description: 'Specialist consultations, inpatient care, diagnostics, and referral backbone', category: 'Healthcare', href: '/programs/healthcare', elementId: 'program-uttaracare', keywords: 'uttaracare uttara care hospital pauri' },
  { id: 'prog-bironkhal', label: 'Bironkhal Rural Health Hub', description: 'Outpatient consultations, diagnostics, pharmacy, day-care, and telemedicine in a remote block', category: 'Healthcare', href: '/programs/healthcare', elementId: 'program-bironkhal', keywords: 'bironkhal polyclinic hub spoke opd' },
  { id: 'prog-mobile', label: 'Mobile Healthcare Units & Camps', description: 'Weekly village visits, health camps, sample collection, medicine delivery', category: 'Healthcare', href: '/programs/healthcare', elementId: 'program-mobile-health', keywords: 'mobile medical unit camp village outreach' },
  { id: 'prog-beyond', label: 'Beyond Treatment – Preventive Care', description: 'Maternal care, school health, nutrition, elderly care, vaccination awareness', category: 'Healthcare', href: '/programs/healthcare', elementId: 'program-beyond-treatment', keywords: 'preventive screening maternal nutrition elderly vaccination' },

  // Entrepreneurship (/programs/entrepreneurship)
  { id: 'prog-iedp', label: 'Entrepreneurship Development Program (EDP)', description: 'Mentorship, technology support, customer connections, and soft loans', category: 'Entrepreneurship', href: '/programs/entrepreneurship', elementId: 'entrepreneurship-initiative', keywords: 'iedp edp entrepreneurship business livelihood' },
  { id: 'prog-iedp-eco', label: 'EDP Business Support', description: 'Mentors, industry specialists, technology, finance, and corporate partners', category: 'Entrepreneurship', href: '/programs/entrepreneurship', elementId: 'program-iedp-ecosystem', keywords: 'iedp edp ecosystem pinebrook mentor market branding' },
  { id: 'prog-iedp-ent', label: 'Meet Our Rural Entrepreneurs', description: 'First cohort: 19 of 40 shortlisted across agri, food, craft, and services', category: 'Entrepreneurship', href: '/programs/entrepreneurship', elementId: 'program-iedp-entrepreneurs', keywords: 'entrepreneurs cohort agriculture horticulture handicrafts women' },
  { id: 'prog-iedp-offers', label: 'What EDP Offers', description: 'Soft loans, branding, digital marketing, websites, and monitoring', category: 'Entrepreneurship', href: '/programs/entrepreneurship', elementId: 'program-iedp-offers', keywords: 'soft loan grant mentorship packaging digital marketing' },

  // ── Impact ────────────────────────────────────────────────────────────
  { id: 'impact-root', label: 'Measured Impact Overview', description: 'Measured results, audited allocations, and community program performance', category: 'Impact', href: '/impact', elementId: 'impact-view', keywords: 'impact evidence audit metrics' },
  { id: 'impact-metrics-sec', label: 'Quantified Impact Metrics', description: '84% attendance surge, 72% reduced travel, 100% direct aid sourcing', category: 'Impact', href: '/impact', elementId: 'impact-metrics', keywords: '84 72 attendance travel sourcing accountability' },
  { id: 'impact-milestones-sec', label: 'Student Competency Growth', description: 'CIAS digital classroom competency trends: 35% → 60% → 88%', category: 'Impact', href: '/impact', elementId: 'impact-milestones', keywords: 'competency chart literacy coding terms cias' },
  { id: 'impact-highlights-sec', label: 'Key Impact Highlights', description: '3+ Edtech village labs, 15k+ lives impacted, 100% transparency audit', category: 'Impact', href: '/impact', elementId: 'impact-highlights', keywords: 'labs lives transparency audit edtech' },

  // ── Stories ───────────────────────────────────────────────────────────
  { id: 'stories-root', label: 'Program Stories', description: 'Reports from educators, medical professionals, and community organizers', category: 'Stories', href: '/stories', elementId: 'stories-view', keywords: 'stories journals field reports dispatches' },

  // ── Careers ───────────────────────────────────────────────────────────
  { id: 'careers-root', label: 'Careers & Field Opportunities', description: 'Purpose-led roles across Dehradun, Pauri, Srinagar, and field hubs', category: 'Careers', href: '/careers', elementId: 'careers-view', keywords: 'careers jobs hire join team work' },
  { id: 'careers-values', label: 'Why Work at ISSA', description: 'Fair pay, open communication, and work based in Uttarakhand', category: 'Careers', href: '/careers', elementId: 'careers-values', keywords: 'salary housing transparency values culture' },
  { id: 'careers-list-sec', label: 'Open Staff Positions', description: 'Active job openings and career opportunities in Uttarakhand', category: 'Careers', href: '/careers', elementId: 'careers-openings', keywords: 'openings vacancies positions hiring' },
  { id: 'careers-form-sec', label: 'Apply Online Form', description: 'Submit resume and statement of intent for open roles or volunteering', category: 'Careers', href: '/careers', elementId: 'application-form-card', keywords: 'apply application resume cv volunteer form' },

  // ── Contact ───────────────────────────────────────────────────────────
  { id: 'contact-root', label: 'Contact Us', description: 'Program adoptions, partnerships, volunteering — reach regional teams', category: 'Contact', href: '/contact', elementId: 'contact-view', keywords: 'contact reach inquire help' },
  { id: 'contact-offices-sec', label: 'Regional Office Locations', description: 'Dehradun HQ, Srinagar Medical Ward, Pauri Education Center', category: 'Contact', href: '/contact', elementId: 'contact-offices', keywords: 'office dehradun srinagar pauri address phone' },
  { id: 'contact-form-sec', label: 'Contact Our Team', description: 'Send an inquiry — response within two working days', category: 'Contact', href: '/contact', elementId: 'contact-inquiry-form', keywords: 'message form inquiry csr volunteer clinical' },
  { id: 'contact-hours', label: 'Office Hours', description: 'Mon–Fri 09:00–18:00 IST, Saturday 10:00–14:00 IST', category: 'Contact', href: '/contact', elementId: 'contact-hours', keywords: 'hours schedule timing ist' },
  { id: 'contact-social', label: 'Official Social Channels', description: 'YouTube, Facebook, Instagram, Twitter / X, and LinkedIn', category: 'Contact', href: '/contact', elementId: 'contact-social', keywords: 'youtube facebook instagram twitter x linkedin social media' },
  { id: 'contact-faq-sec', label: 'Contact FAQ', description: 'Locations, school volunteering, and state audit questions', category: 'Contact', href: '/contact', elementId: 'contact-faq', keywords: 'faq questions volunteer audit mou' },

  // ── Governance ────────────────────────────────────────────────────────
  { id: 'gov-privacy', label: 'Privacy Policy', description: 'How ISSA collects, uses, and protects personal data (ISSA-PP-2026)', category: 'Governance', href: '/privacy', elementId: 'privacy-policy-section', keywords: 'privacy data protection donor volunteer 80g' },
  { id: 'gov-terms', label: 'Terms & Conditions', description: 'Website use, donations, and statutory compliance under Indian law', category: 'Governance', href: '/terms', elementId: 'terms-conditions-section', keywords: 'terms conditions legal donation compliance' },

  // ── Site-wide / footer ────────────────────────────────────────────────
  { id: 'newsletter', label: 'Newsletter Signup', description: 'Subscribe for program updates from the footer', category: 'Site', href: '/', elementId: 'newsletter-section', keywords: 'newsletter email subscribe updates' },
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
  const [dynamicItems, setDynamicItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch live stories and jobs from DB
  useEffect(() => {
    let isMounted = true;
    fetch('/api/search')
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (isMounted && Array.isArray(data.items)) {
          setDynamicItems(data.items);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

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

  const allItems = React.useMemo(() => {
    return [...dynamicItems, ...SEARCH_ITEMS];
  }, [dynamicItems]);

  // Keep the complete site index searchable, but show only five suggestions at once.
  const matchingItems = query.trim() === ''
    ? allItems
    : allItems.filter(item => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.keywords?.toLowerCase().includes(q) ?? false) ||
          item.href.toLowerCase().includes(q)
        );
      });
  const filteredItems = matchingItems.slice(0, 5);

  // Handle key navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredItems.length === 0) return;
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredItems.length === 0) return;
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

    const targetPath = item.href.split('?')[0];
    if (targetPath !== pathname) {
      router.push(`${item.href}#${item.elementId}`);
      return;
    }

    // Same page: scroll + temporary highlight
    setTimeout(() => {
      const element = document.getElementById(item.elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            className="fixed inset-0 bg-primary-dark/35 backdrop-blur-md cursor-pointer"
            id="search-palette-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
            className="relative w-full max-w-2xl bg-white/95 border border-white/80 rounded-2xl shadow-[0_32px_80px_rgba(13,49,31,0.2)] overflow-hidden backdrop-blur-2xl backdrop-saturate-150"
            id="search-palette-modal"
            ref={containerRef}
          >
            {/* Search Input Bar */}
            <div className="relative border-b border-primary/10 flex items-center px-5 py-4 bg-white/55">
              <Search className="w-5 h-5 text-accent shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search programs, stories, careers, healthcare..."
                className="w-full bg-transparent border-none text-primary placeholder-primary/45 focus:outline-none focus:ring-0 pl-3.5 text-base sm:text-lg font-sans font-medium"
              />
              <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/5 border border-primary/10 text-xs text-primary/65 font-mono font-semibold">
                  ESC
                </span>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-primary/60 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results Body */}
            <div className="max-h-[420px] overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
              {filteredItems.length > 0 ? (
                <>
                  {filteredItems.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                          isSelected
                            ? 'bg-accent/20 border-accent/50 text-primary shadow-md'
                            : 'bg-primary/[0.02] hover:bg-primary/[0.05] border-primary/10 text-primary/85'
                        }`}
                        id={`search-item-${item.id}`}
                      >
                        <div className="flex flex-col gap-1 max-w-[82%]">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-base sm:text-lg font-bold font-serif text-primary leading-tight">
                              {item.label}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-accent/15 border border-accent/30 text-xs font-sans uppercase tracking-wider text-accent font-bold">
                              {item.category}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-primary/65 font-sans leading-relaxed line-clamp-1 font-normal">
                            {item.description}
                          </span>
                        </div>

                        {isSelected ? (
                          <div className="flex items-center gap-1.5 self-center animate-fade-in text-accent shrink-0 font-bold bg-accent/20 px-2.5 py-1 rounded-lg border border-accent/30">
                            <span className="text-xs font-sans tracking-wider uppercase font-extrabold">GO</span>
                            <CornerDownLeft className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="text-primary/35 hover:text-primary/60 shrink-0">
                            <CornerDownLeft className="w-4 h-4 opacity-40" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="py-14 flex flex-col items-center justify-center text-center gap-3">
                  <HelpCircle className="w-10 h-10 text-accent animate-pulse" />
                  <div className="space-y-1">
                  <p className="text-base font-bold text-primary font-serif">No matches found</p>
                    <p className="text-xs sm:text-sm text-primary/65 font-sans max-w-xs mx-auto">
                      Try searching for &quot;CIAS&quot;, &quot;UttaraCare&quot;, &quot;EDP&quot;, &quot;Agniveer&quot;, or &quot;careers&quot;.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Commands */}
            <div className="px-5 py-3.5 bg-primary/[0.04] border-t border-primary/10 flex items-center justify-between text-xs font-sans text-primary/65 font-medium">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-primary/5 rounded border border-primary/10 font-mono text-primary text-xs font-bold">↑↓</span> Move
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-primary/5 rounded border border-primary/10 font-mono text-primary text-xs font-bold">↵</span> Select
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-primary/65 font-semibold">
                <Command className="w-4 h-4 text-accent" />
                <span>+ K</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
