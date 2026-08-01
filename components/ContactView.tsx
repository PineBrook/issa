'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, HelpCircle, ArrowRight, CheckCircle2, Send, Loader2, Youtube, Facebook, Instagram } from 'lucide-react';
import { useToast } from '@/components/Toast';

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
      city: 'Dehradun Headquarters',
      role: 'Operations & Sourcing',
      address: '22/4, Rajpur Road, Jakhan, Dehradun, Uttarakhand - 248001',
      phone: '+91 135 430 8180',
      email: 'operations.issa@gmail.com',
    },
    {
      city: 'Srinagar Garhwal Medical Ward',
      role: 'Clinical Coordination',
      address: 'Near Uttara Care Clinic, Srinagar Garhwal, Uttarakhand - 246174',
      phone: '+91 8180 430 135',
      email: 'clinical.issa@gmail.com',
    },
    {
      city: 'Pauri Education Center',
      role: 'School Hub & Volunteer Station',
      address: 'Near Government High School Cluster, Pauri, Uttarakhand - 246001',
      phone: '+91 135 8180 430',
      email: 'edu.issa@gmail.com',
    }
  ];

  const faqs = [
    {
      q: "Where is the ISSA Foundation located?",
      a: "Our central administrative office is located in Dehradun, with specialized medical hubs in Srinagar Garhwal and dedicated smart-classroom mentoring teams operating directly in Pauri Garhwal government schools."
    },
    {
      q: "Can I volunteer directly in Uttarakhand schools?",
      a: "Absolutely. We run seasonal student tutoring and digital mentoring camps. Volunteers with backgrounds in computing, basic healthcare instruction, or physical therapy are welcome to submit applications through our Careers/Join Us page."
    },
    {
      q: "Is ISSA audited by state authorities?",
      a: "Yes. All school adoptions, classroom renovations, and medical device distributions are executed under formal MoUs with respective state departments, subject to public auditing guidelines."
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
    <div className="pt-24 pb-24 bg-neutral-50 font-sans" id="contact-view">
      {/* HERO SECTION */}
      <section className="bg-[#092822] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-widest text-accent font-sans font-bold">Connect With Us</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
              Get in Touch <br />
              <span className="italic font-normal text-accent font-serif">with our teams.</span>
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed font-light">
              Have questions regarding program adoptions, local partnerships, or student volunteering? Reach out to our regional offices directly.
            </p>
          </div>
        </div>
      </section>

      {/* OFFICE LOCATIONS CARD GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16" id="contact-offices">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {offices.map((office, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-sans text-rust uppercase tracking-wider font-bold">{office.role}</span>
                  <h3 className="text-lg font-serif font-bold text-primary mt-1">{office.city}</h3>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  {office.address}
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-neutral-100 text-xs font-sans text-neutral-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{office.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{office.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPLIT CONTACT FORM & FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-md space-y-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-primary font-sans font-bold">Send a Message</p>
              <h2 className="text-3xl font-serif font-bold text-primary">Regional Sourcing Desk</h2>
              <p className="text-xs text-neutral-500 font-sans max-w-lg leading-relaxed">
                Fill out the secure form below to log a direct inquiry with our staff. Field representatives will verify details and reach out within 48 operational hours.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6" id="contact-inquiry-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="block text-[11px] font-sans uppercase tracking-wider text-neutral-500 font-bold">Your Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="Enter your full name"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-sans disabled:opacity-55"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="block text-[11px] font-sans uppercase tracking-wider text-neutral-500 font-bold">Email Address</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="your.name@domain.com"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-sans disabled:opacity-55"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-subject" className="block text-[11px] font-sans uppercase tracking-wider text-neutral-500 font-bold">Subject / Area of Interest</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-sans disabled:opacity-55"
                >
                  <option value="General Inquiry">General Inquiry & Info</option>
                  <option value="School Volunteer">School Volunteering & Digital Mentorship</option>
                  <option value="Clinical Support">Clinical & Medical Camp Coordination</option>
                  <option value="CSR Partnership">CSR Foundations & State MoUs</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="block text-[11px] font-sans uppercase tracking-wider text-neutral-500 font-bold">Detailed Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={4}
                  placeholder="How can our Uttarakhand teams assist you? Please share relevant context..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-sans resize-none disabled:opacity-55"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-light text-white font-sans font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 hover:shadow-lg hover:shadow-primary/10"
                id="contact-form-submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span className="text-xs">Dispatching message...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs tracking-wider uppercase">Send Message</span>
                    <Send className="w-3.5 h-3.5 text-accent" />
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
                <h3 className="text-lg font-serif font-bold text-primary">Office Hours</h3>
                <p className="text-xs text-neutral-500 font-sans mt-1">Our coordinators are available in the field during these IST hours.</p>
              </div>

              <div className="space-y-3 text-xs font-sans text-neutral-600">
                <div className="flex items-center gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="block font-bold text-neutral-700">Monday - Friday</span>
                    <span className="text-neutral-400">09:00 AM - 06:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="block font-bold text-neutral-700">Saturday</span>
                    <span className="text-neutral-400">10:00 AM - 02:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-4" id="contact-social">
              <div>
                <h3 className="text-lg font-serif font-bold text-primary">Official Channels</h3>
                <p className="text-xs text-neutral-500 font-sans mt-1">Follow our field dispatches and educational video series across official platforms.</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-2">
                <a
                  href="https://www.youtube.com/@ISSAClasses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-red-50/60 border border-neutral-200/60 hover:border-red-200 text-neutral-800 hover:text-red-600 transition-all duration-300 text-xs font-medium group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <Youtube className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold">YouTube</span>
                      <span className="text-[10px] text-neutral-400 font-sans">@ISSAClasses</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                </a>

                <a
                  href="https://www.facebook.com/people/ISSA-Foundation/61582300538326/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-blue-50/60 border border-neutral-200/60 hover:border-blue-200 text-neutral-800 hover:text-blue-600 transition-all duration-300 text-xs font-medium group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Facebook className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold">Facebook</span>
                      <span className="text-[10px] text-neutral-400 font-sans">ISSA Foundation Page</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </a>

                <a
                  href="https://www.instagram.com/issa.foundation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-pink-50/60 border border-neutral-200/60 hover:border-pink-200 text-neutral-800 hover:text-pink-600 transition-all duration-300 text-xs font-medium group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold">Instagram</span>
                      <span className="text-[10px] text-neutral-400 font-sans">@issa.foundation</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>
            </div>

            {/* Compact FAQ Accordion */}
            <div className="space-y-4" id="contact-faq">
              <h3 className="text-sm font-sans uppercase tracking-wider text-primary font-bold pl-1">Operational Q&A</h3>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-neutral-200/60 overflow-hidden shadow-sm">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full text-left p-5 flex justify-between items-center font-serif text-xs font-semibold text-primary focus:outline-none cursor-pointer"
                    >
                      <span className="pr-4 leading-normal">{faq.q}</span>
                      <span className="text-rust text-base shrink-0">{activeFaq === idx ? '−' : '+'}</span>
                    </button>

                    {activeFaq === idx && (
                      <div className="px-5 pb-5 text-[11px] text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 animate-fade-in">
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
