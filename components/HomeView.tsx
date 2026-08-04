'use client';

import React from 'react';
import Link from 'next/link';
import BlurImage from './BlurImage';
import { ArrowRight, BookOpen, Stethoscope, Briefcase, Cpu, CheckCircle2, Calendar } from 'lucide-react';
import { HeroImpactCard, ImpactCategory } from './HeroSocialImpactAnimation';
import HeroSlideshow, { HERO_SLIDES } from './HeroSlideshow';

export default function HomeView() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [isHeroPaused, setIsHeroPaused] = React.useState(false);

  React.useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHeroPaused]);

  const activePillar = HERO_SLIDES[activeSlide].pillar;

  const handleSelectSlide = (index: number) => {
    setActiveSlide(index);
  };

  const handleSelectPillar = (pillar: ImpactCategory) => {
    const idx = HERO_SLIDES.findIndex((s) => s.pillar === pillar);
    if (idx >= 0) {
      setActiveSlide(idx);
    }
  };

  const stories = [
    {
      id: 1,
      category: 'Education',
      date: 'March 2024',
      title: 'Digital empowerment in remote Pauri.',
      desc: 'Launching our fifth smart-classroom cluster in rural Uttarakhand, bringing computer training and high-speed satellite learning to over 350 students.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800',
    },
    {
      id: 2,
      category: 'Healthcare',
      date: 'February 2024',
      title: 'Reaching the unreachable peaks.',
      desc: 'Free medical camps provide essential diagnostic care, dental checkups, and optical health tools to remote, high-altitude villages.',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800',
    },
    {
      id: 3,
      category: 'Entrepreneurship',
      date: 'January 2024',
      title: 'Future-proofing youth skills.',
      desc: 'A new cohort completes industry-ready digital and technical certification, linking local Himalayan graduates to remote job opportunities.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800',
    }
  ];

  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 5000);
    }
  };

  return (
    <div className="bg-page" id="home-view">
      {/* 1. HERO SECTION — full-viewport photo slideshow + light network overlay */}
      <section className="relative w-full text-white bg-ink overflow-hidden" id="home-hero" aria-label="Homepage hero">
        <HeroSlideshow
          activeIndex={activeSlide}
          onSelect={handleSelectSlide}
          isPaused={isHeroPaused}
          onTogglePause={() => setIsHeroPaused(!isHeroPaused)}
          rightContent={
            <HeroImpactCard
              activeTab={activePillar}
              onSelectTab={handleSelectPillar}
              isPaused={isHeroPaused}
              onTogglePause={() => setIsHeroPaused(!isHeroPaused)}
            />
          }
        />
      </section>

      {/* 2. STATS STRIP */}
      <section className="bg-white border-b border-neutral-200" id="home-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            <div className="text-center pt-4 md:pt-0">
              <p className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">11+</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600 font-sans mt-2">Schools Adopted</p>
            </div>
            <div className="text-center pt-4 md:pt-0">
              <p className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">20+</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600 font-sans mt-2">Hospital Beds</p>
            </div>
            <div className="text-center pt-4 md:pt-0">
              <p className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">1,200+</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600 font-sans mt-2">Patients Cared For</p>
            </div>
            <div className="text-center pt-4 md:pt-0">
              <p className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">20+</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600 font-sans mt-2">Entrepreneurs Onboarded</p>
            </div>
            <div className="text-center pt-4 md:pt-0 col-span-2 md:col-span-1">
              <p className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">6</p>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600 font-sans mt-2">Districts Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR PHILOSOPHY SECTION */}
      <section className="py-24 bg-white overflow-hidden" id="home-philosophy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative border border-neutral-200/80">
                <BlurImage 
                  src="/local-ownership.jpg" 
                  alt="Himalayan village children happily reading books in an Indian mountain community" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-6 -right-6 md:-right-10 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-neutral-200/80 max-w-xs hidden sm:block">
                <p className="text-primary font-serif font-semibold text-base mb-1">Restoring Trust.</p>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
                  Working closely with government departments to ensure sustainable community impact and trust.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight leading-tight">
                  Development Rooted in Local Ownership
                </h2>
              </div>

              <div className="space-y-6 text-neutral-700 leading-relaxed font-sans text-base sm:text-lg">
                <p>
                  ISSA Foundation was established with a singular vision: to bridge systemic gaps in education and healthcare. We believe true progress isn&apos;t about charity, but about building resilience.
                </p>
                <p>
                  We collaborate with village elders, local leaders, and state authorities to customize programs that empower rather than impose.
                </p>
              </div>

              <div className="space-y-5 pt-4 border-t border-neutral-200">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-primary mt-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">Integrated Education</h3>
                    <p className="text-sm text-neutral-600 mt-0.5">Merging digital literacy with traditional government curriculum.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-primary mt-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">Holistic Health</h3>
                    <p className="text-sm text-neutral-600 mt-0.5">Bringing tertiary-level care to the remotest hill districts.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link 
                  href="/programs"
                  className="inline-flex items-center gap-2 text-primary hover:text-rust font-bold text-sm sm:text-base transition-colors group cursor-pointer"
                >
                  LEARN ABOUT ISSA
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUR FOCUSED PILLARS SECTION */}
      <section className="py-24 bg-neutral-100 border-t border-b border-neutral-200" id="home-pillars">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">
              Four Areas of Sustainable Progress
            </h2>
            <p className="text-neutral-700 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Integrated programs that meet urgent needs while creating durable pathways forward for remote Himalayan families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full">Education</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-primary">Education Empowerment</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                    Smart classrooms, trained teachers, and academic support through the CIAS school initiative.
                  </p>
                </div>
              </div>
              <Link 
                href="/programs?pillar=education" 
                className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors text-left pt-6 flex items-center gap-1 cursor-pointer"
              >
                DISCOVER EDUCATION <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full">Healthcare</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-primary">Healthcare Access</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                    Affordable care, mobile outreach, and Uttara Care Hospital support for remote mountain districts.
                  </p>
                </div>
              </div>
              <Link 
                href="/programs?pillar=healthcare" 
                className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors text-left pt-6 flex items-center gap-1 cursor-pointer"
              >
                DISCOVER HEALTHCARE <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full">Livelihoods</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-primary">Entrepreneurship (EDP)</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                    Structured mentoring, tech enablement, and market access across 6 districts & 10+ business sectors.
                  </p>
                </div>
              </div>
              <Link 
                href="/programs/entrepreneurship" 
                className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors text-left pt-6 flex items-center gap-1 cursor-pointer"
              >
                DISCOVER EDP <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full">Digital Inclusion</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-primary">Digital Inclusion</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                    Village-level technology labs that make modern learning opportunities accessible to everyone.
                  </p>
                </div>
              </div>
              <Link 
                href="https://classes.issafoundation.in" 
                className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors text-left pt-6 flex items-center gap-1 cursor-pointer"
              >
                DISCOVER INCLUSION <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STRATEGIC INTERVENTIONS SECTION */}
      <section className="py-24 bg-primary text-white" id="home-strategic-interventions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Targeted Interventions, Measurable Regional Impact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-white/10">
            <div className="space-y-4">
              <p className="text-4xl font-serif font-bold text-accent">11+</p>
              <p className="text-base sm:text-lg text-neutral-200 leading-relaxed">
                Smart boards and computers distributed across high-altitude government schools to revolutionize local learning.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-4xl font-serif font-bold text-accent">11+</p>
              <p className="text-base sm:text-lg text-neutral-200 leading-relaxed">
                Specialist teachers appointed to mentor rural students and deliver high-quality, continuous digital training.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-4xl font-serif font-bold text-accent">20</p>
              <p className="text-base sm:text-lg text-neutral-200 leading-relaxed">
                Hospital beds and high-tech equipment delivering critical, life-saving diagnostic care in Pauri Garhwal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STORIES OF CHANGE */}
      <section className="py-24 bg-white" id="home-stories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">
                Dispatches from Himalayan Communities
              </h2>
            </div>
            <Link 
              href="/stories"
              className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-primary px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors cursor-pointer"
            >
              ALL STORIES <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div key={story.id} className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <BlurImage 
                      src={story.image} 
                      alt={story.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                      {story.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                      <Calendar className="w-4 h-4 text-primary/70" />
                      <span>{story.date}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-primary group-hover:text-rust transition-colors leading-snug">
                      {story.title}
                    </h3>
                    <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3">
                      {story.desc}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <Link 
                    href="/stories"
                    className="text-xs sm:text-sm font-bold text-primary hover:text-rust transition-colors flex items-center gap-1 group/btn cursor-pointer"
                  >
                    READ JOURNAL <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COLLABORATE & IMPACT FORM SECTION */}
      <section className="py-24 bg-teal-brand text-white" id="home-collaborate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  Partner with Us to Transform Lives
                </h2>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Volunteer, partner, or support the work bringing lasting opportunity and structural development to remote communities in Uttarakhand.
              </p>
              
              <div className="pt-6 border-t border-white/10 space-y-2">
                <span className="text-xs text-neutral-400 block font-sans uppercase tracking-widest">Call Any Time</span>
                <p className="text-3xl font-serif text-accent font-bold tracking-tight">0135 430 8180</p>
                <p className="text-xs text-neutral-400 font-sans">career.issafoundation@gmail.com</p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white text-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-primary">Thank you for reaching out!</h3>
                  <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                    We appreciate your interest in the ISSA Foundation. Our team will review your submission and get back to you within 3 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-sans uppercase tracking-wider text-neutral-500 block">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe" 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-sans uppercase tracking-wider text-neutral-500 block">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com" 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-sans uppercase tracking-wider text-neutral-500 block">How would you like to help?</label>
                    <textarea 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us a little about yourself or how you would like to collaborate..." 
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-accent hover:bg-accent-dark text-primary font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 tracking-wide text-sm shadow-md cursor-pointer"
                  >
                    Send message
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
