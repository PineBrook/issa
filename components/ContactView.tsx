'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, HelpCircle, ArrowRight, CheckCircle2, Send, Loader2, Youtube, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useToast } from '@/components/Toast';
import Newsletter from '@/components/Newsletter';
import { submitContactAction } from '@/app/forms/actions';
import type { FaqItem, OfficeLocationItem, SiteSettings } from '@/lib/site-cms-types';

export default function ContactView({
  offices: initialOffices,
  faqs: initialFaqs,
  settings,
}: {
  offices?: OfficeLocationItem[];
  faqs?: FaqItem[];
  settings?: SiteSettings;
}) {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const defaultOffices = [
    {
      id: 1,
      city: 'Head Office (Dehradun)',
      role: 'Headquarters',
      address: '3F, Municipal No. 23/1 E.C. Road, New Municipal No. 107, Rajeev Gandhi Marg-II, Dehradun, Uttarakhand - 248001',
      phone: settings?.phone || '+91 135 430 8180',
      email: settings?.email || 'career.issafoundation@gmail.com',
      displayOrder: 1,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 2,
      city: 'Regional Office (Pauri)',
      role: 'Regional Administrative Hub',
      address: 'Ward No 6, House No 33, C/o USHA RAWAT Agency Chowk, Kandoliya Mandir Road, Pauri Garhwal District Hospital, Pauri, Pauri Garhwal, Uttarakhand - 246001',
      phone: settings?.phone || '+91 135 430 8180',
      email: settings?.email || 'career.issafoundation@gmail.com',
      displayOrder: 2,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
  ];

  const defaultFaqs = [
    {
      id: 1,
      category: 'contact',
      question: "Where is the ISSA Foundation located?",
      answer: "Our Head Office is located on E.C. Road in Dehradun, and our Regional Office is located near District Hospital in Pauri, Uttarakhand.",
      displayOrder: 1,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 2,
      category: 'contact',
      question: "Can I volunteer directly in Uttarakhand schools?",
      answer: "Absolutely. We run seasonal student tutoring and digital mentoring camps. Volunteers with backgrounds in computing, basic healthcare instruction, or physical therapy are welcome to submit applications through our Careers/Join Us page.",
      displayOrder: 2,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 3,
      category: 'contact',
      question: "Is ISSA audited by state authorities?",
      answer: "Yes. All school adoptions, classroom renovations, and medical device distributions are carried out under formal agreements with the relevant state departments and are subject to public auditing guidelines.",
      displayOrder: 3,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    }
  ];

  const offices = initialOffices && initialOffices.length > 0 ? initialOffices : defaultOffices;
  const faqs = initialFaqs && initialFaqs.length > 0 ? initialFaqs : defaultFaqs;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    const result = await submitContactAction(new FormData(e.currentTarget));
    if (result.success) {
      setIsSubmitting(false);
      toast(`Thank you, ${formData.name}! Your inquiry has been sent. We'll be in touch.`, 'success');
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    } else {
      setIsSubmitting(false);
      setFormError(result.message);
    }
  };

  return (
    <div className="pb-24 bg-neutral-50 font-sans" id="contact-view">
      {/* HERO SECTION */}
      <section className="bg-teal-brand text-white pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-wider text-accent font-sans font-bold">Connect With Us</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
              Get in Touch <br />
              <span className="italic font-normal text-accent font-serif">with our teams.</span>
            </h1>
            <p className="text-neutral-200 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
              Have questions regarding program adoptions, local partnerships, or student volunteering? Reach out to our regional offices directly.
            </p>
          </div>
        </div>
      </section>

      {/* OFFICE LOCATIONS CARD GRID & MAP EMBED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" id="contact-offices">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {offices.map((office, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between space-y-8 h-full">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-sans text-rust uppercase tracking-wider font-bold">{office.role}</span>
                  <h3 className="text-xl font-serif font-bold text-primary mt-1">{office.city}</h3>
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                  {office.address}
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-neutral-100 text-sm font-sans text-neutral-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>{office.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>{office.email}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Dehradun Office Google Map Embed Card */}
          <div className="bg-white p-2 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col h-full min-h-[350px] overflow-hidden">
            <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!4v1786174155665!6m8!1m7!1sTAZGtFoNFj2Vj1jzDOCRHA!2m2!1d30.32148139723212!2d78.05089332118985!3f0!4f0!5f1.1924812503605782"
                className="w-full h-full border-0 absolute inset-0 rounded-[1.25rem]"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Dehradun Office Google Street View & Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FORM & FAQ SPLIT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* CONTACT FORM */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/80 shadow-sm" id="contact-form">
            <div className="space-y-2 mb-8">
              <span className="text-xs uppercase tracking-wider text-neutral-600 font-sans font-bold block">Direct Channel</span>
              <h2 className="text-3xl font-serif font-bold text-primary">Send an Inquiry</h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                Our central operations desk responds to verified community and partner requests within 48 business hours.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <input name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
              <div>
                <label className="text-xs uppercase tracking-wider text-neutral-700 font-sans font-semibold block mb-2">
                  Full Name <span className="text-rust">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Aarav Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-sans focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-neutral-700 font-sans font-semibold block mb-2">
                  Official Email Address <span className="text-rust">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="aarav.sharma@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-sans focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-neutral-700 font-sans font-semibold block mb-2">
                  Inquiry Topic
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-sans focus:outline-none focus:border-primary transition-colors bg-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="School Adoption (CIAS)">School Adoption & EduTech (CIAS)</option>
                  <option value="Hospital & Mobile Health">Healthcare Programs & Mobile Unit</option>
                  <option value="EDP & Local Business">Entrepreneurship Development (EDP)</option>
                  <option value="Careers & Volunteering">Volunteering & Careers</option>
                  <option value="CSR Collaboration">Corporate Social Responsibility (CSR)</option>
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-neutral-700 font-sans font-semibold block mb-2">
                  Message Details <span className="text-rust">*</span>
                </label>
                <textarea
                  rows={5}
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Outline your proposal, school location, or specific questions..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-sans focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {formError && (
                <div role="status" className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl text-xs uppercase tracking-widest font-sans font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Official Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* FREQUENTLY ASKED QUESTIONS */}
          <div className="lg:col-span-6 space-y-8" id="contact-faq">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-neutral-600 font-sans font-bold block">Clarifications</span>
              <h2 className="text-3xl font-serif font-bold text-primary">Frequently Asked Questions</h2>
              <p className="text-sm text-neutral-700 leading-relaxed font-sans">
                Quick answers concerning our legal registrations, non-profit status, and operational footprints.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="font-serif font-bold text-base text-primary leading-snug">{faq.question}</span>
                    <span className="text-primary font-sans font-bold text-xl leading-none">{activeFaq === idx ? '−' : '+'}</span>
                  </button>
                  {activeFaq === idx && (
                    <div className="px-6 pb-6 text-sm text-neutral-700 leading-relaxed font-sans border-t border-neutral-100 pt-4 animate-in fade-in duration-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* DIRECT TELEPHONE & EMAIL CARD */}
            <div className="bg-primary text-white rounded-3xl p-8 space-y-6 mt-8">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-accent font-sans font-bold">Priority Contact</span>
                <h3 className="text-xl font-serif font-bold">Have an urgent community proposal?</h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                  Call our Dehradun administrative line during office hours (Monday – Friday, 9:30 AM – 5:30 PM IST).
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-sans pt-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <span className="font-bold">{settings?.phone || '+91 135 430 8180'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <span className="font-bold">{settings?.email || 'career.issafoundation@gmail.com'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* NEWSLETTER ENROLLMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <Newsletter />
      </section>
    </div>
  );
}
