'use client';

import React from 'react';
import { Briefcase, MapPin, Calendar, FileText, CheckCircle2, ArrowRight, Heart } from 'lucide-react';

export default function CareersView() {
  const [activeJobId, setActiveJobId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    role: 'education',
    experience: '1-3',
    resumeName: '',
    statement: ''
  });
  const [submitted, setSubmitted] = React.useState(false);

  const jobs = [
    {
      id: 'edu-expert',
      title: 'Senior Education Expert',
      dept: 'Academic Programs',
      location: 'Srinagar Garhwal, Uttarakhand',
      type: 'Full-time (On-site)',
      salary: 'Competitive & Housing Provided',
      desc: 'Lead the classroom curriculum implementation, smart board deployment, and monthly teacher evaluation circles across our adopt school clusters in Pauri and Chamoli districts.',
      reqs: [
        'Master’s degree in Education, Social Work, or a related computer field.',
        'At least 3 years of teaching or training experience, ideally in rural districts.',
        'Fluency in Hindi and local Garhwali/Kumaoni dialects is highly preferred.',
        'Ready to travel to remote, high-altitude village classrooms.'
      ]
    },
    {
      id: 'health-practitioner',
      title: 'Healthcare Camp Coordinator',
      dept: 'Clinical Outreach',
      location: 'Pauri Garhwal, Uttarakhand',
      type: 'Full-time (On-site / Mobile)',
      salary: 'Competitive & Travel Allowances',
      desc: 'Supervise the schedule, logistics, equipment stocking, and specialist medical doctor rosters for our Himalayan Mobile Health Camps across rural blocks.',
      reqs: [
        'Bachelor’s or Master’s in Public Health, Nursing, or Hospital Administration.',
        'Strong management experience organizing rural medical camps or logistics.',
        'Familiarity with medical emergency diagnostic machines.',
        'Compassionate mindset to serve senior populations in cold terrains.'
      ]
    },
    {
      id: 'program-manager',
      title: 'Program Operations Manager',
      dept: 'Administration',
      location: 'Dehradun / Field visits',
      type: 'Full-time (Hybrid)',
      desc: 'Act as the core bridge coordinating operational budgets, material purchase audits, and Memorandums of Understanding (MoUs) with local state government departments.',
      reqs: [
        'MBA or Post Graduate Degree in Rural Development or Operations.',
        'At least 5 years experience managing social impact initiatives at scale.',
        'Excellent proposal writing, budgeting, and English-Hindi communication.',
        'Proactive relationship builder with government officials and village authorities.'
      ]
    }
  ];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          role: 'education',
          experience: '1-3',
          resumeName: '',
          statement: ''
        });
      }, 5000);
    }
  };

  const simulateResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resumeName: e.target.files[0].name });
    }
  };

  return (
    <div className="pt-24 pb-24 bg-neutral-50 font-sans" id="careers-view">
      {/* HERO HERO SECTION */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-widest text-accent font-sans font-bold">Work with us</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
              Invest your talent <br />
              <span className="italic font-normal text-accent font-serif">where it matters.</span>
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed font-light">
              We recruit professionals who are passionate about evidence-driven social change. Find remote-hub and on-site opportunities across Uttarakhand.
            </p>
          </div>
        </div>
      </section>

      {/* THREE VALUE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8" id="careers-values">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-primary flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-serif text-primary">Purpose-Led Compensation</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            We provide competitive salaries, rural field allowances, and comfortable shared housing units near program centers.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-primary flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-serif text-primary">Absolute Transparency</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Every staff member has full access to project budgets and progress reports, aligning team effort with direct results.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-primary flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-serif text-primary">Rooted in Uttarakhand</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Work with local village heads and government officials, creating lasting structural improvements in your native state.
          </p>
        </div>
      </section>

      {/* ROLES & APPLICATION FORM SPLIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Job Listing */}
          <div className="lg:col-span-7 space-y-8" id="careers-openings">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-primary font-sans font-bold font-semibold">Open Positions</p>
              <h2 className="text-3xl font-serif font-bold text-primary">Opportunities for Impact.</h2>
            </div>

            <div className="space-y-6">
              {jobs.map((job) => (
                <div 
                  key={job.id}
                  id={`job-${job.id}`}
                  className={`bg-white rounded-3xl border p-6 sm:p-8 transition-all duration-300 ${
                    activeJobId === job.id 
                      ? 'border-rust shadow-md ring-1 ring-rust' 
                      : 'border-neutral-200/80 hover:border-neutral-300 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-sans text-neutral-400 uppercase tracking-wider">{job.dept}</span>
                      <h3 className="text-lg font-serif font-bold text-primary mt-0.5">{job.title}</h3>
                    </div>
                    <span className="bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-full text-[10px] font-sans font-bold shrink-0 self-start sm:self-auto">
                      {job.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-neutral-400 font-sans mt-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  </div>

                  <p className="text-xs text-neutral-500 leading-relaxed mt-4 font-sans">
                    {job.desc}
                  </p>

                  {/* Expandable Reqs */}
                  {activeJobId === job.id ? (
                    <div className="mt-6 pt-6 border-t border-neutral-100 space-y-4 animate-fade-in">
                      <h4 className="text-xs font-sans uppercase tracking-wider text-neutral-700 font-bold">Requirements:</h4>
                      <ul className="space-y-2.5">
                        {job.reqs.map((req, idx) => (
                          <li key={idx} className="text-xs text-neutral-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-rust rounded-full shrink-0 mt-1.5"></span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => {
                          setFormData({ ...formData, role: job.id });
                          // Scroll to form on mobile
                          document.getElementById('application-form-card')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-primary hover:bg-primary-light text-white font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all mt-4 cursor-pointer"
                      >
                        Select to Apply Below
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveJobId(job.id)}
                      className="text-xs font-bold text-rust hover:text-rust-dark transition-colors mt-6 flex items-center gap-1 cursor-pointer"
                    >
                      VIEW REQUIREMENTS & APPLY <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-5" id="application-form-card">
            <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-md">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-accent/20 text-primary rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-primary">Application Received!</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    Thank you for applying to the ISSA Foundation. Our academic or clinical operations director will review your qualifications and contact you to schedule an initial interview.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[9px] font-sans uppercase tracking-widest text-neutral-400 block font-semibold">Join the cohort</span>
                    <h3 className="text-xl font-serif font-bold text-primary">Apply Online</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-sans uppercase text-neutral-500 block">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe" 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-sans uppercase text-neutral-500 block">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com" 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-sans uppercase text-neutral-500 block">Target Role</label>
                        <select 
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                        >
                          <option value="edu-expert">Education Expert</option>
                          <option value="health-practitioner">Healthcare Coordinator</option>
                          <option value="program-manager">Operations Manager</option>
                          <option value="volunteer">General Volunteer</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-sans uppercase text-neutral-500 block">Experience (Yrs)</label>
                        <select 
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                        >
                          <option value="0-1">Under 1 Year</option>
                          <option value="1-3">1 - 3 Years</option>
                          <option value="3-5">3 - 5 Years</option>
                          <option value="5+">5+ Years</option>
                        </select>
                      </div>
                    </div>

                    {/* Drag and Drop CV upload */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-sans uppercase text-neutral-500 block">CV / Resume (PDF / Doc)</label>
                      <div className="border border-dashed border-neutral-200 hover:border-primary rounded-xl p-4 bg-neutral-50 hover:bg-neutral-100/50 transition-all text-center relative cursor-pointer">
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={simulateResumeUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-1">
                          <FileText className="w-6 h-6 text-neutral-400 mx-auto" />
                          <p className="text-xs text-neutral-600 font-medium">
                            {formData.resumeName || 'Click to select or drag Resume file'}
                          </p>
                          <p className="text-[10px] text-neutral-400">PDF, DOC, DOCX up to 5MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-sans uppercase text-neutral-500 block">Statement of Intent</label>
                      <textarea 
                        rows={3}
                        value={formData.statement}
                        onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                        placeholder="Briefly state why you would like to serve Uttarakhand with us..." 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-rust hover:bg-rust-dark text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    Submit Application
                    <ArrowRight className="w-3.5 h-3.5" />
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
