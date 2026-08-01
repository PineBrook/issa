'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, X, CornerDownLeft, Command, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  { id: 'home-hero-sec', label: 'Lasting Change Close to Home', description: 'Dynamic animation showcasing social work, NGO action, education, healthcare, and entrepreneurship', category: 'Home', href: '/', elementId: 'home-hero', keywords: 'hero animation social work ngo education healthcare primary healthcare entrepreneurship village trust' },
  { id: 'home-stats', label: 'Key Impact Snapshot', description: '11+ schools adopted, 20+ hospital beds, 600+ students trained, 100% local sourcing', category: 'Home', href: '/', elementId: 'home-stats', keywords: 'stats metrics numbers schools beds students' },
  { id: 'home-philo', label: 'Development Rooted in Local Ownership', description: 'Collaborate with village elders, leaders, and state authorities to build resilience', category: 'Home', href: '/', elementId: 'home-philosophy', keywords: 'philosophy grassroots integrated education holistic health' },
  { id: 'home-4pillars', label: 'Four Pillars of Sustainable Progress', description: 'Education, Healthcare, Entrepreneurship, and Digital Inclusion', category: 'Home', href: '/', elementId: 'home-pillars', keywords: 'pillars cias uttara care skills digital labs' },
  { id: 'home-strategic', label: 'Targeted Interventions', description: 'Smart boards, specialist teachers, and hospital beds delivering regional impact', category: 'Home', href: '/', elementId: 'home-strategic-interventions', keywords: 'strategic interventions smart boards teachers pauri' },
  { id: 'home-journals', label: 'Dispatches from Himalayan Communities', description: 'Recent field stories on smart classrooms, medical camps, and youth skills', category: 'Home', href: '/', elementId: 'home-stories', keywords: 'stories journals dispatches pauri medical skills' },
  { id: 'home-collab', label: 'Partner With Us', description: 'Volunteer, partner, or support structural development — 0135 430 8180', category: 'Home', href: '/', elementId: 'home-collaborate', keywords: 'collaborate volunteer partner form phone email career' },

  // ── Programs overview + sub-pages ─────────────────────────────────────
  { id: 'prog-overview', label: 'Core Programs Overview', description: 'Three connected pillars: Education, Healthcare, and Entrepreneurship', category: 'Programs', href: '/programs', elementId: 'programs-view', keywords: 'programs pillars overview' },

  // Education (/programs/education)
  { id: 'prog-edu', label: 'ISSA Education Initiative', description: 'Transform government schools, digital classrooms, and teacher support in Uttarakhand', category: 'Education', href: '/programs/education', elementId: 'program-education', keywords: 'education school learning teachers digital' },
  { id: 'prog-cias', label: 'CIAS – Cluster of ISSA Adopted Schools', description: '12 government schools adopted with the Uttarakhand Education Department', category: 'Education', href: '/programs/education', elementId: 'program-cias', keywords: 'cias adopted schools cluster government' },
  { id: 'prog-smart', label: 'Smart Classrooms & Digital Learning', description: 'Smart Boards, computers, and interactive technology-enabled education', category: 'Education', href: '/programs/education', elementId: 'program-smart-classrooms', keywords: 'smart board classroom digital lab computer' },
  { id: 'prog-academic', label: 'Academic Excellence', description: 'Subject-specialist teachers improving outcomes in key subjects', category: 'Education', href: '/programs/education', elementId: 'program-academic-excellence', keywords: 'academic excellence specialist teachers' },
  { id: 'prog-computer', label: 'Computer Education & Digital Literacy', description: 'Structured computer learning for higher education and employment', category: 'Education', href: '/programs/education', elementId: 'program-computer-edu', keywords: 'computer literacy digital skills coding' },
  { id: 'prog-career', label: 'Career Guidance & Competitive Exams', description: 'Coaching for government exams, employment, and public service careers', category: 'Education', href: '/programs/education', elementId: 'program-career-guidance', keywords: 'career guidance competitive exam coaching' },
  { id: 'prog-agniveer', label: 'Agniveer Preparation Programme', description: 'Structured training and physical readiness for Agniveer recruitment', category: 'Education', href: '/programs/education', elementId: 'program-agniveer', keywords: 'agniveer military army recruitment youth' },
  { id: 'prog-future', label: 'Future Ready Education', description: 'Communication, leadership, digital skills, financial literacy, entrepreneurship', category: 'Education', href: '/programs/education', elementId: 'program-future-skills', keywords: 'future ready soft skills leadership innovation' },

  // Healthcare (/programs/healthcare)
  { id: 'prog-health', label: 'ISSA Rural Healthcare Initiative', description: 'Hospitals, rural hubs, mobile units, telemedicine, and community outreach', category: 'Healthcare', href: '/programs/healthcare', elementId: 'program-healthcare', keywords: 'healthcare health rural medical clinic hospital' },
  { id: 'prog-uttara', label: 'UttaraCare Hospital (Pauri Garhwal)', description: 'Specialist consultations, inpatient care, diagnostics, and referral backbone', category: 'Healthcare', href: '/programs/healthcare', elementId: 'program-uttaracare', keywords: 'uttaracare uttara care hospital pauri' },
  { id: 'prog-bironkhal', label: 'Bironkhal Rural Health Hub', description: 'OPD, diagnostics, pharmacy, day-care, telemedicine in a remote block', category: 'Healthcare', href: '/programs/healthcare', elementId: 'program-bironkhal', keywords: 'bironkhal polyclinic hub spoke' },
  { id: 'prog-mobile', label: 'Mobile Healthcare Units & Camps', description: 'Weekly village visits, health camps, sample collection, medicine delivery', category: 'Healthcare', href: '/programs/healthcare', elementId: 'program-mobile-health', keywords: 'mobile medical unit camp village outreach' },
  { id: 'prog-beyond', label: 'Beyond Treatment – Preventive Care', description: 'Maternal care, school health, nutrition, elderly care, vaccination awareness', category: 'Healthcare', href: '/programs/healthcare', elementId: 'program-beyond-treatment', keywords: 'preventive screening maternal nutrition elderly vaccination' },

  // Entrepreneurship (/programs/entrepreneurship)
  { id: 'prog-iedp', label: 'Entrepreneurship Program (IEDP)', description: 'Business Growth Partnership: mentorship, tech, markets, and soft loans', category: 'Entrepreneurship', href: '/programs/entrepreneurship', elementId: 'program-entrepreneurship', keywords: 'iedp entrepreneurship business livelihood' },
  { id: 'prog-iedp-eco', label: 'IEDP Growth Ecosystem', description: 'Mentors, industry specialists, PineBrook tech, finance, and CSR partners', category: 'Entrepreneurship', href: '/programs/entrepreneurship', elementId: 'program-iedp-ecosystem', keywords: 'ecosystem pinebrook mentor market branding' },
  { id: 'prog-iedp-ent', label: 'Meet Our Rural Entrepreneurs', description: 'First cohort: 19 of 40 shortlisted across agri, food, craft, and services', category: 'Entrepreneurship', href: '/programs/entrepreneurship', elementId: 'program-iedp-entrepreneurs', keywords: 'entrepreneurs cohort agriculture horticulture handicrafts women' },
  { id: 'prog-iedp-offers', label: 'What IEDP Offers', description: '0% interest soft loans, branding, digital marketing, websites, monitoring', category: 'Entrepreneurship', href: '/programs/entrepreneurship', elementId: 'program-iedp-offers', keywords: 'soft loan grant mentorship packaging digital marketing' },

  // ── Impact ────────────────────────────────────────────────────────────
  { id: 'impact-root', label: 'Evidence-Led Impact Overview', description: 'Measurable outputs, audited allocations, and community program performance', category: 'Impact', href: '/impact', elementId: 'impact-view', keywords: 'impact evidence audit metrics' },
  { id: 'impact-metrics-sec', label: 'Quantified Impact Metrics', description: '84% attendance surge, 72% reduced travel, 100% direct aid sourcing', category: 'Impact', href: '/impact', elementId: 'impact-metrics', keywords: '84 72 attendance travel sourcing accountability' },
  { id: 'impact-milestones-sec', label: 'Student Competency Growth', description: 'CIAS digital classroom competency trends: 35% → 60% → 88%', category: 'Impact', href: '/impact', elementId: 'impact-milestones', keywords: 'competency chart literacy coding terms cias' },
  { id: 'impact-highlights-sec', label: 'Key Impact Highlights', description: '3+ Edtech village labs, 15k+ lives impacted, 100% transparency audit', category: 'Impact', href: '/impact', elementId: 'impact-highlights', keywords: 'labs lives transparency audit edtech' },
  { id: 'impact-stories-sec', label: 'Story of the Month', description: 'Meera’s cataract journey in Mana and Renu’s academic ascent in Pauri', category: 'Impact', href: '/impact', elementId: 'impact-story-month', keywords: 'meera renu mana cataract weaver computer' },

  // ── Stories ───────────────────────────────────────────────────────────
  { id: 'stories-root', label: 'Field Journals & Dispatches', description: 'Reports from educators, medical professionals, and community organizers', category: 'Stories', href: '/stories', elementId: 'stories-view', keywords: 'stories journals field reports dispatches' },
  { id: 'story-digital-pauri', label: 'Digital Empowerment in Pauri', description: 'Smart classrooms for 350+ rural students — Education, March 2024', category: 'Stories', href: '/stories', elementId: 'story-digital-pauri', keywords: 'pauri smart classroom aarti rawat digital' },
  { id: 'story-medical-peaks', label: 'Reaching the Unreachable Peaks', description: 'Free mobile medical camps in high altitudes — Healthcare, Feb 2024', category: 'Stories', href: '/stories', elementId: 'story-medical-peaks', keywords: 'medical camp peaks vivek negi cataract dental' },
  { id: 'story-youth-skills', label: 'Future-Proofing Youth Skills', description: 'Industry technical certifications for Himalayan graduates — Skills, Jan 2024', category: 'Stories', href: '/stories', elementId: 'story-youth-skills', keywords: 'skills vocational rajesh bist certification' },
  { id: 'story-water', label: 'Reclaiming Ancestral Water Bodies', description: 'Restoring mountain springs for 80+ families — Communities, Dec 2023', category: 'Stories', href: '/stories', elementId: 'story-water-bodies', keywords: 'water springs sanitation climate sohan singh' },

  // ── Careers ───────────────────────────────────────────────────────────
  { id: 'careers-root', label: 'Careers & Field Opportunities', description: 'Purpose-led roles across Dehradun, Pauri, Srinagar, and field hubs', category: 'Careers', href: '/careers', elementId: 'careers-view', keywords: 'careers jobs hire join team work' },
  { id: 'careers-values', label: 'Why Work at ISSA', description: 'Purpose-led compensation, absolute transparency, rooted in Uttarakhand', category: 'Careers', href: '/careers', elementId: 'careers-values', keywords: 'salary housing transparency values culture' },
  { id: 'careers-list-sec', label: 'Open Staff Positions', description: 'Education Expert, Healthcare Camp Coordinator, Program Operations Manager', category: 'Careers', href: '/careers', elementId: 'careers-openings', keywords: 'openings vacancies positions hiring' },
  { id: 'careers-edu', label: 'Senior Education Expert', description: 'Curriculum, smart boards, teacher evaluation — Srinagar Garhwal, full-time', category: 'Careers', href: '/careers', elementId: 'job-edu-expert', keywords: 'education expert teacher curriculum pauri chamoli' },
  { id: 'careers-health', label: 'Healthcare Camp Coordinator', description: 'Mobile health camp logistics and specialist rosters — Pauri Garhwal', category: 'Careers', href: '/careers', elementId: 'job-health-practitioner', keywords: 'healthcare coordinator camp clinical outreach' },
  { id: 'careers-ops', label: 'Program Operations Manager', description: 'Budgets, MoUs, and operations bridge — Dehradun / field hybrid', category: 'Careers', href: '/careers', elementId: 'job-program-manager', keywords: 'program manager operations mou budget admin' },
  { id: 'careers-form-sec', label: 'Apply Online Form', description: 'Submit resume and statement of intent for open roles or volunteering', category: 'Careers', href: '/careers', elementId: 'application-form-card', keywords: 'apply application resume cv volunteer form' },

  // ── Contact ───────────────────────────────────────────────────────────
  { id: 'contact-root', label: 'Contact Us', description: 'Program adoptions, partnerships, volunteering — reach regional teams', category: 'Contact', href: '/contact', elementId: 'contact-view', keywords: 'contact reach inquire help' },
  { id: 'contact-offices-sec', label: 'Regional Office Locations', description: 'Dehradun HQ, Srinagar Medical Ward, Pauri Education Center', category: 'Contact', href: '/contact', elementId: 'contact-offices', keywords: 'office dehradun srinagar pauri address phone' },
  { id: 'contact-form-sec', label: 'Regional Sourcing Desk Form', description: 'Send a secure inquiry — response within 48 operational hours', category: 'Contact', href: '/contact', elementId: 'contact-inquiry-form', keywords: 'message form inquiry csr volunteer clinical' },
  { id: 'contact-hours', label: 'Office Hours', description: 'Mon–Fri 09:00–18:00 IST, Saturday 10:00–14:00 IST', category: 'Contact', href: '/contact', elementId: 'contact-hours', keywords: 'hours schedule timing ist' },
  { id: 'contact-social', label: 'Official Social Channels', description: 'YouTube @ISSAClasses, Facebook ISSA Foundation, Instagram @issa.foundation', category: 'Contact', href: '/contact', elementId: 'contact-social', keywords: 'youtube facebook instagram social media' },
  { id: 'contact-faq-sec', label: 'Operational FAQ', description: 'Locations, school volunteering, and state audit / MoU questions', category: 'Contact', href: '/contact', elementId: 'contact-faq', keywords: 'faq questions volunteer audit mou' },

  // ── Governance ────────────────────────────────────────────────────────
  { id: 'gov-privacy', label: 'Privacy Policy', description: 'How ISSA collects, uses, and protects personal data (ISSA-PP-2026)', category: 'Governance', href: '/privacy', elementId: 'privacy-policy-section', keywords: 'privacy data protection donor volunteer 80g' },
  { id: 'gov-terms', label: 'Terms & Conditions', description: 'Website use, donations, and statutory compliance under Indian law', category: 'Governance', href: '/terms', elementId: 'terms-conditions-section', keywords: 'terms conditions legal donation compliance' },

  // ── Site-wide / footer ────────────────────────────────────────────────
  { id: 'newsletter', label: 'Newsletter Signup', description: 'Subscribe for field dispatches and program updates from the footer', category: 'Site', href: '/', elementId: 'newsletter-section', keywords: 'newsletter email subscribe updates' },
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

  // Filter items based on query (label, description, category, keywords)
  const filteredItems = query.trim() === ''
    ? SEARCH_ITEMS.slice(0, 8) // Show featured items when empty
    : SEARCH_ITEMS.filter(item => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.keywords?.toLowerCase().includes(q) ?? false) ||
          item.href.toLowerCase().includes(q)
        );
      });

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
                    <p className="text-[11px] text-neutral-500 font-sans mt-0.5">Try &quot;CIAS&quot;, &quot;UttaraCare&quot;, &quot;IEDP&quot;, &quot;Agniveer&quot;, or &quot;careers&quot;</p>
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
