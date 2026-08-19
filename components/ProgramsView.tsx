'use client';

import React from 'react';
import Link from 'next/link';
import BlurImage from './BlurImage';
import { BookOpen, Stethoscope, Briefcase, Compass, CheckCircle2, ArrowRight, Sparkles, GraduationCap, Laptop, ShieldCheck } from 'lucide-react';

interface ProgramsViewProps {
  initialPillar?: 'education' | 'healthcare' | 'entrepreneurship' | 'careers';
  view?: 'overview' | 'detail';
}

export default function ProgramsView({ initialPillar = 'education', view = 'detail' }: ProgramsViewProps) {
  const [activePillar, setActivePillar] = React.useState<'education' | 'healthcare' | 'entrepreneurship' | 'careers'>(initialPillar);

  React.useEffect(() => {
    const handleJump = (e: CustomEvent) => {
      if (e.detail?.pillar) {
        setActivePillar(e.detail.pillar);
      }
    };
    window.addEventListener('jump-to-section', handleJump as EventListener);
    return () => window.removeEventListener('jump-to-section', handleJump as EventListener);
  }, []);

  if (view === 'overview') {
    const pillars = [
      { href: '/programs/education', title: 'Education', description: 'Empowering every learner through stronger schools, digital access, and future-ready skills.', Icon: BookOpen },
      { href: '/programs/healthcare', title: 'Healthcare', description: 'Bringing connected, affordable healthcare closer to rural communities across Uttarakhand.', Icon: Stethoscope },
      { href: '/programs/entrepreneurship', title: 'Entrepreneurship', description: 'Helping local entrepreneurs build sustainable businesses, jobs, and livelihoods.', Icon: Briefcase },
      { href: '/careers', title: 'Career & Opportunities', description: 'Enabling youth across Uttarakhand prepare for careers, Agniveer, and IT job pathways.', Icon: Compass },
    ];

    return (
      <div className="pb-24 bg-neutral-50 font-sans" id="programs-view">
        <section className="bg-teal-brand text-white pt-28 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden="true"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-widest text-accent font-sans font-bold">Our Programs</p>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">Four connected pillars of ISSA&apos;s mission.</h1>
              <p className="text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed font-light">Explore the programs that help communities learn, live healthier, build sustainable livelihoods, and access career opportunities.</p>
            </div>
          </div>
        </section>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ href, title, description, Icon }) => (
              <Link key={href} href={href} className="group bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <Icon className="w-7 h-7 text-primary mb-6" aria-hidden="true" />
                  <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                  <p className="text-sm text-neutral-600 leading-relaxed mt-3">{description}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-primary mt-8 group-hover:gap-3 transition-all">Explore program <ArrowRight className="w-4 h-4" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-neutral-50 font-sans" id="programs-view">
      {/* HEADER SECTION */}
      <section className="bg-teal-brand text-white pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-widest text-accent font-sans font-bold">Our Pillars</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
              Four Connected Pillars <br />
              <span className="italic font-normal text-accent">of ISSA&apos;s Mission.</span>
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed font-light">
              We provide long-term community support in Uttarakhand through education, healthcare, entrepreneurship, career opportunities, and digital inclusion programs.
            </p>
          </div>
        </div>
      </section>

      {/* PILLAR NAVIGATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-neutral-200 pb-6">
          <button
            onClick={() => setActivePillar('education')}
            className={`text-left sm:text-center p-4 rounded-2xl border transition-all ${
              activePillar === 'education'
                ? 'bg-white border-primary shadow-sm ring-1 ring-primary/20'
                : 'bg-neutral-50 border-neutral-200 hover:border-primary/50 text-neutral-600 hover:bg-white'
            }`}
          >
            <BookOpen className={`w-6 h-6 mb-3 mx-auto hidden sm:block ${activePillar === 'education' ? 'text-primary' : 'text-neutral-500'}`} />
            <h3 className={`font-serif font-bold text-base sm:text-lg ${activePillar === 'education' ? 'text-primary' : 'text-neutral-800'}`}>Education</h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider font-sans mt-1 text-neutral-600">Empowering Learners</p>
          </button>
          
          <button
            onClick={() => setActivePillar('healthcare')}
            className={`text-left sm:text-center p-4 rounded-2xl border transition-all ${
              activePillar === 'healthcare'
                ? 'bg-white border-primary shadow-sm ring-1 ring-primary/20'
                : 'bg-neutral-50 border-neutral-200 hover:border-primary/50 text-neutral-600 hover:bg-white'
            }`}
          >
            <Stethoscope className={`w-6 h-6 mb-3 mx-auto hidden sm:block ${activePillar === 'healthcare' ? 'text-primary' : 'text-neutral-500'}`} />
            <h3 className={`font-serif font-bold text-base sm:text-lg ${activePillar === 'healthcare' ? 'text-primary' : 'text-neutral-800'}`}>Healthcare</h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider font-sans mt-1 text-neutral-600">Healthy Communities</p>
          </button>

          <button
            onClick={() => setActivePillar('entrepreneurship')}
            className={`text-left sm:text-center p-4 rounded-2xl border transition-all ${
              activePillar === 'entrepreneurship'
                ? 'bg-white border-primary shadow-sm ring-1 ring-primary/20'
                : 'bg-neutral-50 border-neutral-200 hover:border-primary/50 text-neutral-600 hover:bg-white'
            }`}
          >
            <Briefcase className={`w-6 h-6 mb-3 mx-auto hidden sm:block ${activePillar === 'entrepreneurship' ? 'text-primary' : 'text-neutral-500'}`} />
            <h3 className={`font-serif font-bold text-base sm:text-lg ${activePillar === 'entrepreneurship' ? 'text-primary' : 'text-neutral-800'}`}>Entrepreneurship</h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider font-sans mt-1 text-neutral-600">Sustainable Livelihoods</p>
          </button>

          <button
            onClick={() => setActivePillar('careers')}
            className={`text-left sm:text-center p-4 rounded-2xl border transition-all ${
              activePillar === 'careers'
                ? 'bg-white border-primary shadow-sm ring-1 ring-primary/20'
                : 'bg-neutral-50 border-neutral-200 hover:border-primary/50 text-neutral-600 hover:bg-white'
            }`}
          >
            <Compass className={`w-6 h-6 mb-3 mx-auto hidden sm:block ${activePillar === 'careers' ? 'text-primary' : 'text-neutral-500'}`} />
            <h3 className={`font-serif font-bold text-base sm:text-lg ${activePillar === 'careers' ? 'text-primary' : 'text-neutral-800'}`}>Careers & Opportunities</h3>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider font-sans mt-1 text-neutral-600">Aspirations to Reality</p>
          </button>
        </div>
      </section>

      {/* PILLAR CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* EDUCATION */}
        {activePillar === 'education' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500" id="program-education">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">ISSA Education Initiative</h2>
                <h3 className="text-xl sm:text-2xl font-semibold text-primary/90">Empowering Young Minds. Building Future Leaders. Strengthening Uttarakhand.</h3>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-sans">
                  The ISSA Education Initiative is a flagship programme of ISSA Foundation dedicated to transforming education in Uttarakhand by improving learning outcomes, strengthening government schools, empowering teachers, and preparing young people with the knowledge, skills, and opportunities they need to succeed.
                </p>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-sans">
                  We believe education is not limited to classrooms. It is about creating confident learners, responsible citizens, skilled professionals, and future entrepreneurs. Working closely with the Government of Uttarakhand, educators, communities, volunteers, and technology partners, ISSA is building an education ecosystem that combines quality teaching, digital learning, career guidance, skill development, and real-world exposure.
                </p>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-neutral-200/80 relative">
                  <BlurImage
                    src="/isssa-education-program-v2.png"
                    alt="Smart classroom and computer lab in rural Uttarakhand school"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-b from-white to-amber-50/30 p-8 rounded-2xl border border-amber-200/80 border-t-4 border-t-accent shadow-sm hover:shadow-md transition-all space-y-4">
                <h4 className="text-xl font-serif font-bold text-primary">Why We Started</h4>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                  Many government schools in rural and hill regions face challenges such as limited digital infrastructure, shortage of subject-specialist teachers, and restricted access to career guidance and modern learning opportunities.
                  At the same time, students often lack exposure to technology, professional careers, entrepreneurship, and practical learning experiences.
                  The ISSA Education Initiative was created to bridge these gaps and ensure that every learner has access to quality education and opportunities to build a brighter future.
                </p>
              </div>
              <div className="bg-gradient-to-b from-white to-amber-50/30 p-8 rounded-2xl border border-amber-200/80 border-t-4 border-t-accent shadow-sm hover:shadow-md transition-all space-y-4">
                <h4 className="text-xl font-serif font-bold text-primary">Our Vision & Mission</h4>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                  <strong>Vision:</strong> To create an inclusive, technology-enabled, and future-ready education ecosystem where every learner in Uttarakhand has access to quality education, practical skills, and opportunities to realise their full potential.
                </p>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                  <strong>Mission:</strong> To strengthen government schools, empower teachers, improve learning outcomes, promote digital inclusion, develop future-ready skills, and connect students with higher education, careers, entrepreneurship, and lifelong learning opportunities.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Our Programmes</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: 'program-cias', title: 'Cluster of ISSA-Adopted Schools (CIAS)', desc: 'In collaboration with the Uttarakhand Education Department, we support government schools through a structured model. Highlights: 12 government schools adopted, smart classrooms, subject-specialist teachers, academic support, and technology integration.' },
                  { id: 'program-smart-classrooms', title: 'Smart Classrooms & Digital Learning', desc: 'ISSA supports schools by providing digital learning infrastructure including Smart Boards and computers, helping students and teachers access engaging, interactive, and technology-enabled education.' },
                  { id: 'program-academic-excellence', title: 'Academic Excellence', desc: 'To strengthen classroom learning, ISSA supports government schools through the appointment of subject-specialist teachers who help improve academic outcomes and provide focused support in key subjects.' },
                  { id: 'program-computer-edu', title: 'Computer Education & Digital Literacy', desc: 'ISSA promotes computer education and digital literacy by providing structured learning opportunities that prepare students for higher education, employment, and the digital economy.' },
                  { id: 'program-career-guidance', title: 'Career Guidance & Competitive Exams', desc: 'ISSA supports young people by providing coaching and guidance for government examinations and career development, helping them prepare for future employment and public service opportunities.' },
                  { id: 'program-agniveer', title: 'Agniveer Preparation Programme', desc: 'ISSA also supports youth aspiring to serve the nation by providing structured preparation programmes for the Agniveer recruitment process, including guidance, training, and physical readiness.' }
                ].map((prog, idx) => (
                  <div key={idx} id={prog.id} className="bg-gradient-to-b from-white to-amber-50/20 p-6 rounded-2xl border border-neutral-200/80 border-t-2 border-t-accent shadow-sm hover:shadow-md transition-all group">
                    <h5 className="font-bold text-primary text-base sm:text-lg mb-2.5 group-hover:text-amber-900 transition-colors">{prog.title}</h5>
                    <p className="text-sm text-neutral-700 leading-relaxed font-sans">{prog.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary-dark text-white p-8 md:p-12 rounded-3xl space-y-8" id="program-future-skills">
              <div className="max-w-2xl">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-accent mb-4">Future Ready Education</h3>
                <p className="text-base text-neutral-200 mb-6">Beyond academics, ISSA aims to prepare learners with capabilities that help them succeed in higher education, employment, entrepreneurship, and life:</p>
                <div className="grid grid-cols-2 gap-4">
                  {['Communication Skills', 'Leadership', 'Digital Skills', 'Financial Literacy', 'Entrepreneurship Awareness', 'Innovation & Problem Solving', 'Career Readiness'].map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      <span className="text-sm sm:text-base font-semibold text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-w-3xl space-y-6">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Looking Ahead & Get Involved</h3>
              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-sans">
                Our vision extends beyond strengthening schools. Over the coming years, ISSA aims to build a comprehensive education ecosystem that includes digital classrooms, STEM programmes, industry exposure, scholarships, and school-to-employment pathways.
              </p>
              <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-bold font-sans">
                Join us: Whether you are a teacher, student, parent, volunteer, corporate organisation, corporate social responsibility (CSR) partner, or technology provider, you can help improve education. Together, we can help learners succeed in school and prepare for work and life.
              </p>
            </div>
          </div>
        )}

        {/* HEALTHCARE */}
        {activePillar === 'healthcare' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500" id="program-healthcare">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">ISSA Rural Healthcare Initiative</h2>
                <h3 className="text-xl sm:text-2xl font-semibold text-primary/90">Transforming Rural Healthcare Through Connected Communities</h3>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-sans">
                  Healthcare should never be limited by geography. Yet thousands of families living in the remote hills of Uttarakhand continue to travel long distances for even basic medical care. Limited medical infrastructure, shortage of specialists, delayed diagnosis and difficult terrain often prevent timely treatment.
                </p>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-sans">
                  The ISSA Rural Healthcare Initiative was established to bridge this gap by creating an integrated healthcare ecosystem that combines hospitals, rural health hubs, mobile healthcare, telemedicine and community outreach into one connected model. Rather than expecting patients to travel to healthcare, we bring healthcare closer to every village.
                </p>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-neutral-200/80 relative">
                  <BlurImage
                    src="/isssa-healthcare-program-v2.png"
                    alt="Doctor providing compassionate care in remote Uttarakhand medical camp"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-b from-white to-emerald-50/30 p-8 rounded-2xl border border-emerald-200/80 border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all space-y-4">
                <h4 className="text-xl font-serif font-bold text-primary">Why We Started</h4>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans">
                  For many families living in rural Uttarakhand, access to healthcare remains one of the biggest challenges. A simple consultation may require travelling several hours. Diagnostic facilities are often unavailable, specialist doctors are concentrated in cities, emergency response is delayed, and preventive healthcare receives little attention.
                </p>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans">
                  ISSA believes every family deserves access to quality healthcare regardless of where they live. Our Rural Healthcare Initiative is designed to ensure that quality healthcare reaches even the most remote communities through a connected and scalable healthcare network.
                </p>
              </div>
              <div className="bg-gradient-to-b from-white to-emerald-50/30 p-8 rounded-2xl border border-emerald-200/80 border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all space-y-4">
                <h4 className="text-xl font-serif font-bold text-primary">Our Vision & Mission</h4>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans">
                  <strong>Vision:</strong> To build Uttarakhand&apos;s most trusted rural healthcare ecosystem by connecting hospitals, primary healthcare centres, telemedicine, mobile medical units and community health programmes into one integrated network that delivers affordable, accessible and quality healthcare for everyone.
                </p>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans">
                  <strong>Mission:</strong> To improve healthcare accessibility, reduce unnecessary travel, strengthen preventive healthcare, and enable technology-driven medical services for underserved communities across Uttarakhand.
                </p>
              </div>
            </div>

            <div className="bg-neutral-100 p-8 md:p-12 rounded-3xl space-y-8">
              <div className="max-w-2xl mx-auto text-center space-y-4">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Our Rural Healthcare Model</h3>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
                  Hospital Care Alone is Not Enough. We focus on the entire healthcare journey rather than isolated medical facilities. We connect healthcare services through multiple levels.
                </p>
              </div>
              
              <div className="max-w-xl mx-auto">
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-300 before:to-transparent">
                  {[
                    { title: 'Community & Villages', desc: 'Health awareness, preventive healthcare, early screening' },
                    { title: 'Mobile Healthcare Unit', desc: 'Weekly visits, emergency response, health camps, medicine delivery' },
                    { title: 'Rural Health Hub (Polyclinic)', desc: 'Doctor consultation, diagnostics, day-care procedures, stabilization' },
                    { title: 'UttaraCare Hospital', desc: 'Specialist consultation, advanced diagnostics, surgical care, admissions' },
                    { title: 'Digital Health Platform', desc: 'Tele-consultation, Electronic Health Records, analytics, monitoring' }
                  ].map((level, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        {idx + 1}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                        <h4 className="font-bold text-primary text-base">{level.title}</h4>
                        <p className="text-sm text-neutral-700 mt-1 font-sans">{level.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div id="program-uttaracare" className="bg-gradient-to-b from-white to-emerald-50/20 p-6 rounded-2xl border border-neutral-200/80 border-t-2 border-t-primary shadow-sm hover:shadow-md transition-all group">
                <h5 className="font-bold text-primary text-base sm:text-lg mb-2 group-hover:text-emerald-900 transition-colors">UttaraCare Hospital</h5>
                <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                  ISSA established UttaraCare Hospital in Pauri Garhwal to improve access to affordable healthcare for surrounding communities. The hospital is the main hospital supporting our network, providing specialist consultations, inpatient care, diagnostics, and referrals for rural health centres.
                </p>
              </div>
              <div id="program-bironkhal" className="bg-gradient-to-b from-white to-emerald-50/20 p-6 rounded-2xl border border-neutral-200/80 border-t-2 border-t-primary shadow-sm hover:shadow-md transition-all group">
                <h5 className="font-bold text-primary text-base sm:text-lg mb-2 group-hover:text-emerald-900 transition-colors">Bironkhal Rural Health Hub</h5>
                <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                  Located in one of the remote blocks of Uttarakhand, the Bironkhal Polyclinic provides outpatient consultations, diagnostics, pharmacy services, day-care procedures, telemedicine, and referrals. The hub coordinates mobile healthcare services for surrounding villages.
                </p>
              </div>
              <div id="program-mobile-health" className="bg-gradient-to-b from-white to-emerald-50/20 p-6 rounded-2xl border border-neutral-200/80 border-t-2 border-t-primary shadow-sm hover:shadow-md transition-all group">
                <h5 className="font-bold text-primary text-base sm:text-lg mb-2 group-hover:text-emerald-900 transition-colors">Mobile Healthcare</h5>
                <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                  Healthcare should reach every village. Our Mobile Medical Unit extends healthcare beyond the clinic by providing weekly village visits, preventive health camps, sample collection, and medicine delivery to ensure elderly patients and remote communities receive care closer to home.
                </p>
              </div>
              <div id="program-beyond-treatment" className="bg-gradient-to-b from-white to-emerald-50/20 p-6 rounded-2xl border border-neutral-200/80 border-t-2 border-t-primary shadow-sm hover:shadow-md transition-all group">
                <h5 className="font-bold text-primary text-base sm:text-lg mb-2 group-hover:text-emerald-900 transition-colors">Beyond Treatment</h5>
                <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                  We believe healthcare should focus equally on prevention. Our programmes include Community Health Awareness, Maternal & Child Health, School Health, Preventive Screenings, Nutrition Awareness, Lifestyle Disease Management, Elderly Care, and Vaccination Awareness.
                </p>
              </div>
            </div>
            
            <div className="max-w-3xl space-y-6">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Partner With Us</h3>
              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-sans">
                Improving rural healthcare requires collaboration. We invite hospitals, doctors, healthcare professionals, technology providers, educational institutions, corporate partners, volunteers, and donors to help expand healthcare access across Uttarakhand.
              </p>
              <p className="text-base sm:text-lg text-neutral-800 leading-relaxed font-bold font-sans">
                At ISSA Foundation, we are committed to building a connected rural healthcare ecosystem that delivers quality healthcare closer to every home.
              </p>
            </div>
          </div>
        )}

        {/* ENTREPRENEURSHIP */}
        {activePillar === 'entrepreneurship' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500" id="program-entrepreneurship">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">Entrepreneurship Development Program (EDP)</h2>
                <h3 className="text-xl sm:text-2xl font-semibold text-rust">Creating Entrepreneurs. Generating Employment. Building a Self-Reliant Uttarakhand.</h3>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-sans">
                  Employment is not created only by offering jobs—it is created by empowering individuals to become entrepreneurs who build businesses, create opportunities, and inspire others.
                </p>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-sans">
                  The ISSA Foundation Entrepreneurship Development Program (EDP) is a flagship initiative designed to identify, mentor, and support aspiring and existing entrepreneurs across Uttarakhand. Our mission is to transform innovative ideas and local skills into sustainable enterprises that generate employment, strengthen local economies, and improve livelihoods.
                </p>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-neutral-200/80 relative">
                  <BlurImage
                    src="/isssa-entrepreneurship-program-v2.png"
                    alt="Rural entrepreneurs and local businesses in Uttarakhand"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* IMPACT COUNTERS STRIP */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-neutral-200">
                <div className="pt-2 sm:pt-0 sm:px-2">
                  <p className="font-serif text-3xl font-bold text-primary">20+</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Entrepreneurs Supported</p>
                </div>
                <div className="pt-2 sm:pt-0 sm:px-2">
                  <p className="font-serif text-3xl font-bold text-primary">6</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Districts Covered</p>
                </div>
                <div className="pt-2 sm:pt-0 sm:px-2">
                  <p className="font-serif text-3xl font-bold text-primary">10+</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Sectors Supported</p>
                </div>
                <div className="pt-2 sm:pt-0 sm:px-2">
                  <p className="font-serif text-3xl font-bold text-primary">100+</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Livelihoods Targeted</p>
                </div>
                <div className="pt-2 sm:pt-0 sm:px-2">
                  <p className="font-serif text-3xl font-bold text-primary">100%</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Structured Mentorship</p>
                </div>
                <div className="pt-2 sm:pt-0 sm:px-2">
                  <p className="font-serif text-xl font-bold text-rust">1 Mission</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Sustainable Livelihoods</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-b from-white to-orange-50/30 p-8 rounded-2xl border border-orange-200/80 border-t-4 border-t-rust shadow-sm hover:shadow-md transition-all space-y-4">
                <h4 className="text-xl font-serif font-bold text-primary">Why This Initiative?</h4>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans">
                  Many talented individuals possess the passion and capability to build successful businesses but often lack access to mentoring, technical guidance, market opportunities, financial resources, and professional networks. The ISSA Entrepreneurship Development Program bridges this gap by providing structured support that enables entrepreneurs to build sustainable enterprises capable of creating long-term employment within their communities.
                </p>
              </div>
              <div className="bg-gradient-to-b from-white to-orange-50/30 p-8 rounded-2xl border border-orange-200/80 border-t-4 border-t-rust shadow-sm hover:shadow-md transition-all space-y-4">
                <h4 className="text-xl font-serif font-bold text-primary">Beyond Funding</h4>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans">
                  Financial assistance alone cannot create successful enterprises. Every entrepreneur in the IEDP receives ongoing mentorship, strategic guidance, technology support, business reviews, and continuous engagement. Our relationship with entrepreneurs begins at onboarding—it does not end there.
                </p>
              </div>
            </div>

            {/* 6 DISTRICTS & SECTORS */}
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Where We Work and What We Support</h3>
              <p className="text-sm text-neutral-600 font-sans">
                Active in 6 districts: <strong>Pauri Garhwal, Tehri Garhwal, Rudraprayag, Uttarkashi, Dehradun, and Haridwar</strong>.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  'Food Processing & Value Addition',
                  'Organic & Herbal Products',
                  'Agriculture & Horticulture',
                  'Women’s Enterprises',
                  'Traditional Foods & Local Products',
                  'Manufacturing',
                  'Tourism & Homestays',
                  'Service-Based Businesses',
                  'Digital & Technology-Enabled Enterprises',
                  'Rural Innovation'
                ].map((sector, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-neutral-200">
                    <CheckCircle2 className="w-5 h-5 text-rust shrink-0" />
                    <span className="text-sm font-semibold text-neutral-800 font-sans">{sector}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 SUPPORT PILLARS */}
            <div className="bg-primary-dark text-white p-8 md:p-12 rounded-3xl space-y-8">
              <div className="max-w-3xl space-y-4">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-accent">How We Support Entrepreneurs (4 Pillars)</h3>
                <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-sans">
                  Rather than offering one-time financial assistance, ISSA has built an integrated support ecosystem across four vital capabilities:
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 p-6 rounded-2xl border border-white/15 space-y-2">
                  <h4 className="font-serif text-lg font-bold text-accent">1. Business Development</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">Business Planning, Growth Strategy, Financial Planning, Business Model Refinement, and Compliance Guidance.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl border border-white/15 space-y-2">
                  <h4 className="font-serif text-lg font-bold text-accent">2. Technology & Digital Enablement</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">Branding, Website Development, Digital Marketing, Social Media Strategy, Business Automation, and Tech Adoption.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl border border-white/15 space-y-2">
                  <h4 className="font-serif text-lg font-bold text-accent">3. Customer and Buyer Connections</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">Customer Networks, Business Partnerships, Industry Connections, Market Exposure, and Promotional Platforms.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl border border-white/15 space-y-2">
                  <h4 className="font-serif text-lg font-bold text-accent">4. Funding and Financial Guidance</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">Responsible financial assistance supported by continuous monitoring, mentoring, and performance-based guidance.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAREER & OPPORTUNITIES */}
        {activePillar === 'careers' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500" id="program-careers">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight">ISSA Career & Opportunities Initiative</h2>
                <h3 className="text-xl sm:text-2xl font-semibold text-primary/90">Turning Aspirations into Opportunities. Preparing Youth for Employment, Public Service, and the Digital Economy.</h3>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-sans">
                  Talent and ambition exist in abundance across the hills and valleys of Uttarakhand. What young people often lack is access to structured guidance, high-quality coaching for competitive examinations, modern technical skills, and reliable bridges to sustainable employment.
                </p>
                <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-sans">
                  The ISSA Career & Opportunities Initiative connects youth with structured career coaching, defence preparation, technical upskilling, and direct employment pathways—empowering them to build rewarding careers while strengthening the economic foundation of Uttarakhand.
                </p>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-neutral-200/80 relative">
                  <BlurImage
                    src="/isssa-career-program-v2.png"
                    alt="Students attending interactive career coaching and technology workshop in Pauri Garhwal"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* IMPACT SNAPSHOT */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-neutral-200">
                <div className="pt-2 sm:pt-0 sm:px-2">
                  <p className="font-serif text-3xl font-bold text-primary">3</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Core Pathways</p>
                </div>
                <div className="pt-2 sm:pt-0 sm:px-2">
                  <p className="font-serif text-3xl font-bold text-primary">100%</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Guidance & Support</p>
                </div>
                <div className="pt-2 sm:pt-0 sm:px-2">
                  <p className="font-serif text-3xl font-bold text-primary">Pauri</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Coaching Hub</p>
                </div>
                <div className="pt-2 sm:pt-0 sm:px-2">
                  <p className="font-serif text-xl font-bold text-primary">PineBrook</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Tech Industry Linkage</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-b from-white to-amber-50/30 p-8 rounded-2xl border border-amber-200/80 border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all space-y-4">
                <h4 className="text-xl font-serif font-bold text-primary">Why We Started</h4>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans">
                  Youth in remote hill districts often travel long distances or migrate to distant cities to access coaching centres and job opportunities, incurring high financial burdens. Without localized career mentorship, many struggle to navigate competitive exam processes or access high-growth industries like software, digital operations, and modern services.
                </p>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans">
                  ISSA bridges this gap by bringing world-class career coaching, physical training, and industry linkages directly to mountain communities.
                </p>
              </div>
              <div className="bg-gradient-to-b from-white to-amber-50/30 p-8 rounded-2xl border border-amber-200/80 border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all space-y-4">
                <h4 className="text-xl font-serif font-bold text-primary">Our Vision & Mission</h4>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans">
                  <strong>Vision:</strong> A thriving Uttarakhand where every young person has the skills, guidance, and direct opportunity pathways to secure sustainable livelihoods and achieve their career potential without involuntary distress migration.
                </p>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-sans">
                  <strong>Mission:</strong> To provide accessible coaching for defence and government exams, industry-aligned technical training, soft skill development, and employment linkages through trusted industry partners.
                </p>
              </div>
            </div>

            {/* KEY PROGRAMMES */}
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Key Focus Areas & Programmes</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-b from-white to-amber-50/20 p-6 rounded-2xl border border-neutral-200/80 border-t-2 border-t-primary shadow-sm hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 text-primary flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-primary text-base sm:text-lg mb-2.5 group-hover:text-amber-900 transition-colors">Agniveer & Defence Services</h5>
                  <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                    Structured preparation programmes for youth aspiring to serve in the armed forces, covering physical fitness regimens, mock tests, written exam strategies, and expert defence mentorship.
                  </p>
                </div>

                <div className="bg-gradient-to-b from-white to-amber-50/20 p-6 rounded-2xl border border-neutral-200/80 border-t-2 border-t-primary shadow-sm hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 text-primary flex items-center justify-center mb-4">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-primary text-base sm:text-lg mb-2.5 group-hover:text-amber-900 transition-colors">Career Coaching at Pauri</h5>
                  <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                    Specialized guidance and regular study cohorts for state civil services, banking, SSC, and central government examinations, helping local candidates prepare with confidence right from Pauri.
                  </p>
                </div>

                <div className="bg-gradient-to-b from-white to-amber-50/20 p-6 rounded-2xl border border-neutral-200/80 border-t-2 border-t-primary shadow-sm hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 text-primary flex items-center justify-center mb-4">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-primary text-base sm:text-lg mb-2.5 group-hover:text-amber-900 transition-colors">IT Jobs via PineBrook</h5>
                  <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                    Direct technical upskilling and placement pathways connecting Uttarakhand graduates to software development, data operations, and IT support careers in partnership with PineBrook Technologies.
                  </p>
                </div>
              </div>
            </div>

            {/* INDUSTRY READINESS BANNER */}
            <div className="bg-primary-dark text-white p-8 md:p-12 rounded-3xl space-y-8">
              <div className="max-w-3xl space-y-4">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-accent">Career Readiness & Future Skills</h3>
                <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-sans">
                  We ensure candidates are fully prepared for competitive corporate and government hiring environments:
                </p>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'Resume Building & Portfolio',
                  'Mock Interviews & GDs',
                  'Digital Communication',
                  'Aptitude & Logical Reasoning',
                  'Technical Problem Solving',
                  'Workplace Ethics & Leadership',
                  'Govt Scheme Navigation',
                  'Job Application Support'
                ].map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 bg-white/10 p-3.5 rounded-xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-white">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION LINKS */}
            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h4 className="text-xl font-serif font-bold text-primary">Explore Open Opportunities</h4>
                <p className="text-sm text-neutral-600 font-sans">
                  Looking to join our field teams, apply for coaching cohorts, or partner with us to hire local talent from Uttarakhand?
                </p>
              </div>
              <div className="flex flex-wrap gap-4 shrink-0">
                <Link
                  href="/careers"
                  className="bg-primary hover:bg-primary-light text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all inline-flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  View Open Roles <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="border border-neutral-300 hover:border-primary text-primary font-bold text-sm px-6 py-3.5 rounded-xl transition-all inline-flex items-center gap-2 hover:bg-neutral-50 cursor-pointer"
                >
                  Partner With Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
