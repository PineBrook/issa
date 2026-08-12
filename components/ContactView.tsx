'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, HelpCircle, ArrowRight, CheckCircle2, Send, Loader2, Youtube, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useToast } from '@/components/Toast';
import Newsletter from '@/components/Newsletter';

export default function ContactView() {
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

  const offices = [
    {
      city: 'Head Office (Dehradun)',
      role: 'Headquarters',
      address: '3F, Municipal No. 23/1 E.C. Road, New Municipal No. 107, Rajeev Gandhi Marg-II, Dehradun, Uttarakhand - 248001',
      phone: '+91 135 430 8180',
      email: 'career.issafoundation@gmail.com',
    },
    {
      city: 'Regional Office (Pauri)',
      role: 'Regional Administrative Hub',
      address: 'Ward No 6, House No 33, C/o USHA RAWAT Agency Chowk, Kandoliya Mandir Road, Pauri Garhwal District Hospital, Pauri, Pauri Garhwal, Uttarakhand - 246001',
      phone: '+91 135 430 8180',
      email: 'career.issafoundation@gmail.com',
    },
  ];

  const faqs = [
    {
      q: "Where is the ISSA Foundation located?",
      a: "Our Head Office is located on E.C. Road in Dehradun, and our Regional Office is located near District Hospital in Pauri, Uttarakhand."
    },
    {
      q: "Can I volunteer directly in Uttarakhand schools?",
      a: "Absolutely. We run seasonal student tutoring and digital mentoring camps. Volunteers with backgrounds in computing, basic healthcare instruction, or physical therapy are welcome to submit applications through our Careers/Join Us page."
    },
    {
      q: "Is ISSA audited by state authorities?",
      a: "Yes. All school adoptions, classroom renovations, and medical device distributions are carried out under formal agreements with the relevant state departments and are subject to public auditing guidelines."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast('Please enter your name.', 'error');
      return;
    }

    if (!formData.email.trim()) {
      toast('Please enter your email address.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast('Please enter a valid email address.', 'error');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      toast('Message must be at least 10 characters long.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      toast(`Thank you, ${formData.name}! Your inquiry has been sent. We'll be in touch.`, 'success');
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    }, 1500);
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

      {/* SPLIT CONTACT FORM & FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-md space-y-8">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wider text-primary font-sans font-bold">Send a Message</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary">Contact Our Team</h2>
              <p className="text-sm text-neutral-700 font-sans max-w-lg leading-relaxed">
                Fill out the secure form below to send an inquiry. Our team will review your message and respond within two working days.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6" id="contact-inquiry-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="block text-xs font-sans uppercase tracking-wider text-neutral-700 font-bold">Your Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="Enter your full name"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-sans disabled:opacity-55"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="block text-xs font-sans uppercase tracking-wider text-neutral-700 font-bold">Email Address</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="your.name@domain.com"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-sans disabled:opacity-55"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-subject" className="block text-xs font-sans uppercase tracking-wider text-neutral-700 font-bold">Subject / Area of Interest</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-sans disabled:opacity-55"
                >
                  <option value="General Inquiry">General Inquiry & Info</option>
                  <option value="School Volunteer">School Volunteering & Digital Mentorship</option>
                  <option value="Clinical Support">Clinical & Medical Camp Coordination</option>
                    <option value="CSR Partnership">Corporate Partnerships & Government Agreements</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="block text-xs font-sans uppercase tracking-wider text-neutral-700 font-bold">Detailed Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={4}
                  placeholder="How can our Uttarakhand teams assist you? Please share relevant context..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-sans resize-none disabled:opacity-55"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-light text-white font-sans font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 hover:shadow-lg hover:shadow-primary/10"
                id="contact-form-submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span className="text-sm font-bold">Dispatching message...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm tracking-wider uppercase font-bold">Send Message</span>
                    <Send className="w-4 h-4 text-accent" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Working Hours & FAQs Stacked */}
          <div className="lg:col-span-5 space-y-8">
            {/* Hours */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-6" id="contact-hours">
              <div>
                <h3 className="text-xl font-serif font-bold text-primary">Office Hours</h3>
                <p className="text-sm text-neutral-700 font-sans mt-1">Our coordinators are available in the field during these IST hours.</p>
              </div>

              <div className="space-y-3 text-sm font-sans text-neutral-700">
                <div className="flex items-center gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <Clock className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="block font-bold text-neutral-800">Monday - Friday</span>
                    <span className="text-neutral-600 font-medium">09:00 AM - 06:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <Clock className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="block font-bold text-neutral-800">Saturday</span>
                    <span className="text-neutral-600 font-medium">10:00 AM - 02:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Dispatch Newsletter Subscription */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm" id="contact-newsletter-card">
              <Newsletter 
                variant="light" 
                title="Subscribe for Newsletter"
                subtitle="Get monthly progress updates, smart classroom milestones, and clinical camp reports directly in your inbox."
                id="contact-newsletter-form"
              />
            </div>

            {/* Official Social Media Channels */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-4" id="contact-social">
              <div>
                <h3 className="text-xl font-serif font-bold text-primary">Official Channels</h3>
                <p className="text-sm text-neutral-700 font-sans mt-1">Follow our program stories and educational video series on our official platforms.</p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                <a
                  href="https://www.youtube.com/@ISSAClasses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-red-50/60 border border-neutral-200 hover:border-red-200 text-neutral-800 hover:text-red-600 transition-all duration-300 text-sm font-semibold group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-bold text-neutral-900">YouTube</span>
                      <span className="text-xs text-neutral-600 font-sans font-medium">@ISSAClasses</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61592854956791&sk=about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-blue-50/60 border border-neutral-200 hover:border-blue-200 text-neutral-800 hover:text-blue-600 transition-all duration-300 text-sm font-semibold group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Facebook className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-bold text-neutral-900">Facebook</span>
                      <span className="text-xs text-neutral-600 font-sans font-medium">ISSA Foundation Page</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </a>

                <a
                  href="https://www.instagram.com/issa__foundation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-pink-50/60 border border-neutral-200 hover:border-pink-200 text-neutral-800 hover:text-pink-600 transition-all duration-300 text-sm font-semibold group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-bold text-neutral-900">Instagram</span>
                      <span className="text-xs text-neutral-600 font-sans font-medium">@issa__foundation</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all" />
                </a>

                <a href="https://x.com/ISSAfoundation1" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-sky-50/60 border border-neutral-200 hover:border-sky-200 text-neutral-800 hover:text-sky-600 transition-all duration-300 text-sm font-semibold group">
                  <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0"><Twitter className="w-5 h-5" /></div><div><span className="block font-bold text-neutral-900">Twitter / X</span><span className="text-xs text-neutral-600 font-sans font-medium">@ISSAfoundation1</span></div></div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                </a>

                <a href="https://www.linkedin.com/company/issa-foundation-uttarakhand/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-blue-50/60 border border-neutral-200 hover:border-blue-200 text-neutral-800 hover:text-blue-600 transition-all duration-300 text-sm font-semibold group">
                  <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Linkedin className="w-5 h-5" /></div><div><span className="block font-bold text-neutral-900">LinkedIn</span><span className="text-xs text-neutral-600 font-sans font-medium">ISSA Foundation Uttarakhand</span></div></div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>
            </div>

            {/* Compact FAQ Accordion */}
            <div className="space-y-4" id="contact-faq">
              <h3 className="text-base font-sans uppercase tracking-wider text-primary font-bold pl-1">Operational Q&A</h3>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full text-left p-5 flex justify-between items-center font-serif text-sm font-bold text-primary focus:outline-none cursor-pointer"
                    >
                      <span className="pr-4 leading-normal">{faq.q}</span>
                      <span className="text-rust text-lg font-bold shrink-0">{activeFaq === idx ? '−' : '+'}</span>
                    </button>

                    {activeFaq === idx && (
                      <div className="px-5 pb-5 text-sm text-neutral-700 font-sans leading-relaxed border-t border-neutral-100 pt-3 animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
