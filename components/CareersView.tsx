'use client';

import React, { useActionState, useTransition } from 'react';
import Link from 'next/link';
import { MapPin, FileText, CheckCircle2, ArrowRight, Heart, AlertCircle, Loader2, Briefcase, Sparkles } from 'lucide-react';
import type { JobOpening, ApplicationSubmissionState } from '@/lib/careers-types';
import { submitCareerApplicationAction } from '@/app/careers/actions';

const initialSubmissionState: ApplicationSubmissionState = {
  success: false,
  message: '',
};

interface CareersViewProps {
  initialJobs?: JobOpening[];
}

export default function CareersView({ initialJobs = [] }: CareersViewProps) {
  const [activeJobId, setActiveJobId] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const jobs = initialJobs;

  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    role: jobs.length > 0 ? jobs[0].slug : 'volunteer',
    experience: '1-3',
    statement: '',
    consent: false,
  });

  const [state, formAction] = useActionState(submitCareerApplicationAction, initialSubmissionState);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !['pdf', 'docx', 'doc'].includes(ext)) {
        setFileError('Please upload a PDF, DOC, or DOCX document.');
        setSelectedFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File exceeds the 5MB size limit.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!selectedFile) {
      e.preventDefault();
      setFileError('Please attach your CV / Resume file.');
      return;
    }
    if (!formState.consent) {
      e.preventDefault();
      return;
    }

    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="pb-24 bg-neutral-50 font-sans" id="careers-view">
      {/* HERO SECTION */}
      <section className="bg-teal-brand text-white pt-28 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:24px_24px]"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-wider text-accent font-sans font-bold">Work with us</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
              Invest your talent <br />
              <span className="italic font-normal text-accent font-serif">where it matters.</span>
            </h1>
            <p className="text-neutral-200 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
              We recruit professionals who are passionate about evidence-driven social change. Find remote-hub and
              on-site opportunities across Uttarakhand.
            </p>
          </div>
        </div>
      </section>

      {/* THREE VALUE CARDS */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        id="careers-values"
      >
        <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-primary flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-serif text-primary">Fair Pay and Meaningful Work</h3>
          <p className="text-sm text-neutral-700 leading-relaxed font-sans">
            We provide competitive salaries, rural field allowances, and comfortable shared housing units near program
            centers.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-primary flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-serif text-primary">Open Communication</h3>
          <p className="text-sm text-neutral-700 leading-relaxed font-sans">
            Every staff member has full access to project budgets and progress reports, aligning team effort with direct
            results.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-primary flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-serif text-primary">Work Based in Uttarakhand</h3>
          <p className="text-sm text-neutral-700 leading-relaxed font-sans">
            Work with local village heads and government officials, creating lasting structural improvements in your
            native state.
          </p>
        </div>
      </section>

      {/* ROLES & APPLICATION FORM SPLIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Job Listing */}
          <div className="lg:col-span-7 space-y-8" id="careers-openings">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wider text-primary font-sans font-bold">Open Positions</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary">Opportunities for Impact.</h2>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-10 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 text-primary flex items-center justify-center mx-auto">
                  <Briefcase className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary">
                    No Open Positions Right Now
                  </h3>
                </div>
                <div className="pt-2">
                  <p className="text-xs sm:text-sm text-neutral-600 font-sans flex items-center justify-center gap-1.5 font-medium">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Please check back later, or submit an expression of interest below.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <div
                    key={job.slug || job.id}
                    id={`job-${job.slug}`}
                    className={`bg-white rounded-3xl border p-6 sm:p-8 transition-all duration-300 ${
                      activeJobId === job.slug
                        ? 'border-rust shadow-md ring-1 ring-rust'
                        : 'border-neutral-200/80 hover:border-neutral-300 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-sans text-neutral-600 font-bold uppercase tracking-wider">
                          {job.dept || job.department}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-primary mt-0.5">{job.title}</h3>
                      </div>
                      <span className="bg-neutral-100 text-neutral-800 px-3.5 py-1.5 rounded-full text-xs font-sans font-bold shrink-0 self-start sm:self-auto border border-neutral-200">
                        {job.type || job.employmentType}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600 font-sans font-medium mt-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-rust" /> {job.location}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mt-4 font-sans">
                      {job.desc || job.description}
                    </p>

                    {/* Expandable Reqs */}
                    {activeJobId === job.slug ? (
                      <div className="mt-6 pt-6 border-t border-neutral-100 space-y-4 animate-fade-in">
                        <h4 className="text-sm font-sans uppercase tracking-wider text-neutral-800 font-bold">
                          Requirements:
                        </h4>
                        <ul className="space-y-2.5">
                          {(job.reqs || job.requirements || []).map((req, idx) => (
                            <li key={idx} className="text-sm text-neutral-700 flex items-start gap-2.5 font-sans">
                              <span className="w-2 h-2 bg-rust rounded-full shrink-0 mt-1.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => {
                            setFormState((prev) => ({ ...prev, role: job.slug }));
                            document.getElementById('application-form-card')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="bg-primary hover:bg-primary-light text-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-xl transition-all mt-4 cursor-pointer"
                        >
                          Select to Apply Below
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveJobId(job.slug)}
                        className="text-sm font-bold text-rust hover:text-rust-dark transition-colors mt-6 flex items-center gap-1.5 cursor-pointer"
                      >
                        VIEW REQUIREMENTS & APPLY <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-5" id="application-form-card">
            <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-md">
              {state.success ? (
                <div className="text-center py-12 space-y-4" role="status" aria-live="polite">
                  <div className="w-16 h-16 bg-accent/20 text-primary rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-primary">Application Received!</h3>
                  <p className="text-sm text-neutral-700 max-w-sm mx-auto leading-relaxed font-sans">
                    {state.message ||
                      'Thank you for applying to the ISSA Foundation. Our academic or clinical operations director will review your qualifications and contact you to schedule an initial interview.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="text-xs uppercase tracking-wider font-bold text-primary hover:underline mt-4 cursor-pointer"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form
                  action={formAction}
                  onSubmit={handleFormSubmit}
                  className="space-y-6"
                  noValidate
                >
                  {/* Honeypot field for spam prevention */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="website">Leave this field blank</label>
                    <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-sans uppercase tracking-wider text-neutral-600 block font-bold">
                      Join the cohort
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-primary">Apply Online</h3>
                  </div>

                  {state.message && !state.success && (
                    <div
                      className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-start gap-2.5"
                      role="alert"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <span>{state.message}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="text-xs font-sans uppercase tracking-wider text-neutral-700 block font-bold">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="John Doe"
                        className={`w-full bg-neutral-50 border rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-none focus:border-primary focus:bg-white transition-all font-sans ${
                          state.errors?.fullName ? 'border-red-400 bg-red-50/50' : 'border-neutral-300'
                        }`}
                      />
                      {state.errors?.fullName && (
                        <p className="text-xs text-red-600 mt-1 font-sans">{state.errors.fullName}</p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-sans uppercase tracking-wider text-neutral-700 block font-bold">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="john@example.com"
                        className={`w-full bg-neutral-50 border rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-none focus:border-primary focus:bg-white transition-all font-sans ${
                          state.errors?.email ? 'border-red-400 bg-red-50/50' : 'border-neutral-300'
                        }`}
                      />
                      {state.errors?.email && (
                        <p className="text-xs text-red-600 mt-1 font-sans">{state.errors.email}</p>
                      )}
                    </div>

                    {/* Role & Experience Split */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="role" className="text-xs font-sans uppercase tracking-wider text-neutral-700 block font-bold">
                          Target Role <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={formState.role}
                          onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                          className={`w-full bg-neutral-50 border rounded-xl px-3.5 py-3 text-sm text-neutral-800 focus:outline-none focus:border-primary focus:bg-white transition-all font-sans ${
                            state.errors?.role ? 'border-red-400 bg-red-50/50' : 'border-neutral-300'
                          }`}
                        >
                          {jobs.map((job) => (
                            <option key={job.slug} value={job.slug}>
                              {job.title}
                            </option>
                          ))}
                          <option value="volunteer">
                            {jobs.length === 0 ? 'General Expression of Interest / Volunteer' : 'General Volunteer'}
                          </option>
                        </select>
                        {state.errors?.role && (
                          <p className="text-xs text-red-600 mt-1 font-sans">{state.errors.role}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="experience" className="text-xs font-sans uppercase tracking-wider text-neutral-700 block font-bold">
                          Experience (Yrs) <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="experience"
                          name="experience"
                          value={formState.experience}
                          onChange={(e) => setFormState({ ...formState, experience: e.target.value })}
                          className={`w-full bg-neutral-50 border rounded-xl px-3.5 py-3 text-sm text-neutral-800 focus:outline-none focus:border-primary focus:bg-white transition-all font-sans ${
                            state.errors?.experience ? 'border-red-400 bg-red-50/50' : 'border-neutral-300'
                          }`}
                        >
                          <option value="0-1">Under 1 Year</option>
                          <option value="1-3">1 - 3 Years</option>
                          <option value="3-5">3 - 5 Years</option>
                          <option value="5+">5+ Years</option>
                        </select>
                        {state.errors?.experience && (
                          <p className="text-xs text-red-600 mt-1 font-sans">{state.errors.experience}</p>
                        )}
                      </div>
                    </div>

                    {/* CV / Resume upload */}
                    <div className="space-y-1.5">
                      <label htmlFor="resume" className="text-xs font-sans uppercase tracking-wider text-neutral-700 block font-bold">
                        CV / Resume (PDF / Doc) <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`border border-dashed rounded-xl p-4 bg-neutral-50 hover:bg-neutral-100/50 transition-all text-center relative cursor-pointer ${
                          fileError || state.errors?.resume
                            ? 'border-red-400 bg-red-50/30'
                            : 'border-neutral-300 hover:border-primary'
                        }`}
                      >
                        <input
                          id="resume"
                          name="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          required
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-1">
                          <FileText className="w-6 h-6 text-neutral-500 mx-auto" />
                          <p className="text-sm text-neutral-700 font-semibold">
                            {selectedFile ? selectedFile.name : 'Click to select or drag Resume file'}
                          </p>
                          <p className="text-xs text-neutral-500">PDF, DOC, DOCX up to 5MB</p>
                        </div>
                      </div>
                      {(fileError || state.errors?.resume) && (
                        <p className="text-xs text-red-600 mt-1 font-sans">
                          {fileError || state.errors?.resume}
                        </p>
                      )}
                    </div>

                    {/* Statement of Intent */}
                    <div className="space-y-1.5">
                      <label htmlFor="statement" className="text-xs font-sans uppercase tracking-wider text-neutral-700 block font-bold">
                        Statement of Intent
                      </label>
                      <textarea
                        id="statement"
                        name="statement"
                        rows={3}
                        value={formState.statement}
                        onChange={(e) => setFormState({ ...formState, statement: e.target.value })}
                        placeholder="Briefly state why you would like to serve Uttarakhand with us..."
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-none focus:border-primary focus:bg-white transition-all resize-none font-sans"
                      />
                    </div>

                    {/* Privacy Policy Consent */}
                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed font-sans cursor-pointer">
                        <input
                          type="checkbox"
                          name="consent"
                          checked={formState.consent}
                          onChange={(e) => setFormState({ ...formState, consent: e.target.checked })}
                          required
                          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
                        />
                        <span>
                          I consent to ISSA Foundation collecting and processing my application data and resume for
                          recruitment in accordance with the{' '}
                          <Link href="/privacy" className="text-primary font-bold hover:underline" target="_blank">
                            Privacy Policy
                          </Link>
                          . <span className="text-red-500">*</span>
                        </span>
                      </label>
                      {state.errors?.consent && (
                        <p className="text-xs text-red-600 mt-1 font-sans">{state.errors.consent}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-rust hover:bg-rust-dark disabled:opacity-75 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
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
