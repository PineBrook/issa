'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Lock, ChevronRight, Mail, Scale, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyViewProps {
  defaultSubTab?: 'privacy' | 'terms';
  [key: string]: unknown;
}

export default function PrivacyPolicyView({ defaultSubTab = 'privacy' }: PrivacyPolicyViewProps) {
  const [prevDefault, setPrevDefault] = useState(defaultSubTab);
  const [activeSubTab, setActiveSubTab] = useState<'privacy' | 'terms'>(defaultSubTab);

  if (prevDefault !== defaultSubTab) {
    setPrevDefault(defaultSubTab);
    setActiveSubTab(defaultSubTab);
  }

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-20">
      {/* Header Banner */}
      <section className="bg-primary-dark text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 space-y-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-sans text-neutral-400">
              <Link
                href="/"
                className="hover:text-accent transition-colors cursor-pointer"
              >
                Home
              </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-accent font-semibold">
              {activeSubTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">
                {activeSubTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-2 max-w-2xl">
                ISSA Foundation is committed to complete transparency, donor data integrity, and responsible digital governance.
              </p>
            </div>

            {/* Tab Switcher in Banner */}
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl shrink-0 self-start sm:self-center">
              <button
                onClick={() => setActiveSubTab('privacy')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  activeSubTab === 'privacy'
                    ? 'bg-accent text-primary font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveSubTab('terms')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  activeSubTab === 'terms'
                    ? 'bg-accent text-primary font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {activeSubTab === 'privacy' ? (
          /* PRIVACY POLICY CONTENT */
          <div id="privacy-policy-section" className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 sm:p-10 space-y-8 text-neutral-800 leading-relaxed font-sans">
            {/* Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-200/80">
              <div className="flex items-center gap-2 text-xs font-sans text-neutral-500">
                <FileText className="w-4 h-4 text-primary" />
                <span>Document Reference: ISSA-PP-2026</span>
              </div>
              <span className="text-xs font-sans bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full border border-neutral-200">
                Last updated: 23 July 2026
              </span>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              This Privacy Policy explains how ISSA Foundation (“we”, “us”, or “our”) collects, uses, stores, and discloses personal information from visitors to <a href="https://issafoundation.in/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">https://issafoundation.in/</a> (the “Website”). We have written this policy in simple, clear language so donors, volunteers, beneficiaries, and visitors can understand what we do with data.
            </p>

            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">1</span>
                Information we collect
              </h2>
              <p className="text-sm text-neutral-600">We collect two kinds of information:</p>
              
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 space-y-2">
                  <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-primary">a. Voluntary Information</h3>
                  <ul className="text-xs text-neutral-600 space-y-1.5 list-disc list-inside">
                    <li>Name, email address, postal address, and phone number.</li>
                    <li>Donation and payment details (processed securely by our payment provider).</li>
                    <li>Volunteer or beneficiary registrations for education and health programs.</li>
                    <li>Messages, inquiries, and uploaded documents when contacting us.</li>
                  </ul>
                </div>

                <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 space-y-2">
                  <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-primary">b. Automated Technical Data</h3>
                  <ul className="text-xs text-neutral-600 space-y-1.5 list-disc list-inside">
                    <li>IP address, browser specification, device type, and visit timestamps.</li>
                    <li>Server log activity and diagnostic diagnostics.</li>
                    <li>Anonymized web analytics data (see Cookies & tracking below).</li>
                    <li>Only information needed to deliver and improve services is retained.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 pt-4 border-t border-neutral-100">
              <h2 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">2</span>
                How we use your information
              </h2>
              <p className="text-sm text-neutral-600">We use personal data for transparent humanitarian and operational purposes:</p>
              <ul className="grid sm:grid-cols-2 gap-2 text-xs text-neutral-700 font-medium">
                <li className="flex items-start gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Processing donations, issuing 80G tax receipts, and sending acknowledgements.</span>
                </li>
                <li className="flex items-start gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Communicating about field programs, volunteer drives, and urgent impact updates.</span>
                </li>
                <li className="flex items-start gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Administering grassroots education, healthcare, and infrastructure initiatives.</span>
                </li>
                <li className="flex items-start gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fulfilling legal, statutory, and auditing requirements under Indian law.</span>
                </li>
              </ul>
              <p className="text-xs text-neutral-500 italic pt-1">
                We strictly do not use your personal data for unrelated commercial marketing, and we never sell your personal information.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 pt-4 border-t border-neutral-100">
              <h2 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">3</span>
                Legal basis and consent
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Where required by law, we obtain explicit consent to process personal data (for example, to send newsletters or volunteer announcements). You may withdraw your consent at any time by contacting our privacy team. Processing necessary for compliance with legal obligations or performance of a contract (such as processing a donation receipt) will continue as required by statutory law.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 pt-4 border-t border-neutral-100">
              <h2 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">4</span>
                Data sharing and third parties
              </h2>
              <p className="text-sm text-neutral-600">We share personal data only in limited, controlled circumstances:</p>
              <div className="space-y-2 text-xs text-neutral-700">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
                  <span className="font-bold text-primary">Service providers:</span> Trusted payment gateways, email delivery pipelines, and cloud hosting partners contractually obligated to safeguard information.
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
                  <span className="font-bold text-primary">Legal compliance:</span> Disclosure when mandatory under applicable Indian law, court order, or regulatory audit.
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
                  <span className="font-bold text-primary">Aggregated reporting:</span> Non-identifying statistical metrics shared for institutional impact assessment.
                </div>
              </div>
            </section>

            {/* Section 5 & 6 */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
              <section className="space-y-2">
                <h2 className="text-base font-serif font-bold text-primary flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">5</span>
                  Data storage & retention
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  We keep personal information only as long as necessary for financial tax rules and program operations. When data is no longer required, it is securely purged or anonymized.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-serif font-bold text-primary flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">6</span>
                  Security measures
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  We enforce technical measures including HTTPS encryption, strict server access controls, and firewall defenses to prevent unauthorized access or loss.
                </p>
              </section>
            </div>

            {/* Section 7 & 8 */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
              <section className="space-y-2">
                <h2 className="text-base font-serif font-bold text-primary flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">7</span>
                  Cookies & tracking
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  We use cookies solely to remember session state and track aggregate site analytics. You can block cookies via browser settings without affecting general page reading.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-serif font-bold text-primary flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">8</span>
                  Your rights
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  You have rights to inspect, update, or request deletion of your personal records. Contact our desk to initiate data access or erasure requests.
                </p>
              </section>
            </div>

            {/* Section 9, 10 & 11 */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <section className="space-y-1">
                  <h2 className="text-sm font-serif font-bold text-primary">9. Children’s Privacy</h2>
                  <p className="text-xs text-neutral-600">The website is not intended for unsupervised children under 13. We do not knowingly collect personal data from minors without legal guardian consent.</p>
                </section>

                <section className="space-y-1">
                  <h2 className="text-sm font-serif font-bold text-primary">10. Policy Updates</h2>
                  <p className="text-xs text-neutral-600">Material updates will be posted on this URL with an updated &quot;Last updated&quot; timestamp. Continued browsing confirms acceptance.</p>
                </section>
              </div>

              {/* Contact Box */}
              <div className="bg-primary-dark text-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                <div>
                  <h3 className="text-sm font-serif font-bold text-accent">11. Privacy Inquiries & Data Desk</h3>
                  <p className="text-xs text-neutral-300 mt-1">If you have questions regarding personal data processing or wish to exercise your data rights:</p>
                </div>
                <a
                  href="mailto:info@issafoundation.in"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-primary text-xs font-bold hover:bg-accent-dark transition-all shrink-0 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>info@issafoundation.in</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* TERMS & CONDITIONS CONTENT */
          <div id="terms-conditions-section" className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm p-6 sm:p-10 space-y-8 text-neutral-800 leading-relaxed font-sans">
            {/* Meta Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-200/80">
              <div className="flex items-center gap-2 text-xs font-sans text-neutral-500">
                <Scale className="w-4 h-4 text-primary" />
                <span>Document Reference: ISSA-TC-2026</span>
              </div>
              <span className="text-xs font-sans bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full border border-neutral-200">
                Last updated: 23 July 2026
              </span>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Welcome to <a href="https://issafoundation.in/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">https://issafoundation.in/</a> (the “Website”), operated by ISSA Foundation (“we”, “us”, or “our”). These Terms & Conditions (“Terms”) explain the rules for using the Website. By accessing or using the Website you agree to these Terms. If you do not agree, please do not use the Website.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* 1. Acceptance */}
              <section className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-2">
                <h2 className="text-sm font-serif font-bold text-primary flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">1</span>
                  Acceptance of Terms
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  By using the Website you confirm that you are at least 18 years old or using the Website under parental or guardian supervision. These Terms form a binding legal agreement.
                </p>
              </section>

              {/* 2. Permitted Use */}
              <section className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-2">
                <h2 className="text-sm font-serif font-bold text-primary flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">2</span>
                  Permitted Use
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  You may use the Website for lawful, non-commercial purposes related to our mission (learning about programs, making donations, volunteering, applying for support, contacting us).
                </p>
              </section>
            </div>

            {/* 3. User Conduct */}
            <section className="space-y-3 pt-4 border-t border-neutral-100">
              <h2 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">3</span>
                User conduct & prohibited acts
              </h2>
              <p className="text-xs text-neutral-600">You agree strictly not to engage in any of the following activities on our platforms:</p>
              <ul className="grid sm:grid-cols-2 gap-2 text-xs text-neutral-700">
                <li className="bg-red-50/50 border border-red-100 p-3 rounded-xl text-neutral-700">
                  <strong className="text-red-700 block mb-0.5">Illegal or Fraudulent Acts:</strong> Using the portal for unauthorized, deceptive, or malicious operations.
                </li>
                <li className="bg-red-50/50 border border-red-100 p-3 rounded-xl text-neutral-700">
                  <strong className="text-red-700 block mb-0.5">Offensive Transmissions:</strong> Posting defamatory, harassing, obscene, or privacy-invading materials.
                </li>
                <li className="bg-red-50/50 border border-red-100 p-3 rounded-xl text-neutral-700">
                  <strong className="text-red-700 block mb-0.5">System Intrusion:</strong> Attempting to gain unauthorized server access or disrupt services.
                </li>
                <li className="bg-red-50/50 border border-red-100 p-3 rounded-xl text-neutral-700">
                  <strong className="text-red-700 block mb-0.5">Automated Scraping:</strong> Deploying web spiders, bots, or harvesters without written consent.
                </li>
              </ul>
            </section>

            {/* 4. Donations & Payments */}
            <section className="space-y-3 pt-4 border-t border-neutral-100">
              <h2 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">4</span>
                Donations and payments
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                If you donate through the Website, your contribution is processed securely through licensed payment processors. Donations are generally non-refundable except where required by law or explicitly specified in campaign terms. Tax exemption receipts (80G) are issued against verified donor credentials.
              </p>
            </section>

            {/* 5 & 6. IP & User Content */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
              <section className="space-y-2">
                <h2 className="text-base font-serif font-bold text-primary flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">5</span>
                  Intellectual Property
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  All text, brand marks, photography, videos, and code assets are owned by or licensed to ISSA Foundation. Unauthorized reproduction or commercial distribution is prohibited.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-serif font-bold text-primary flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs font-sans flex items-center justify-center shrink-0">6</span>
                  User-Provided Content
                </h2>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Submitting testimonials, applications, or media grants ISSA Foundation a non-exclusive, royalty-free right to use the content for humanitarian and non-profit communications.
                </p>
              </section>
            </div>

            {/* 7, 8 & 9 */}
            <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
              <section className="space-y-1 bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
                <h2 className="text-xs font-sans font-bold uppercase text-primary">7. Third-Party Links</h2>
                <p className="text-[11px] text-neutral-600">External resource links are provided for convenience. We are not responsible for third-party privacy policies or accuracy.</p>
              </section>

              <section className="space-y-1 bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
                <h2 className="text-xs font-sans font-bold uppercase text-primary">8. Disclaimers</h2>
                <p className="text-[11px] text-neutral-600">The website is provided &quot;as is&quot;. While we strive for complete accuracy, content is supplied without warranties of any kind.</p>
              </section>

              <section className="space-y-1 bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
                <h2 className="text-xs font-sans font-bold uppercase text-primary">9. Limitation of Liability</h2>
                <p className="text-[11px] text-neutral-600">ISSA Foundation and its trustees are not liable for direct or indirect damages arising from platform usage to the max extent under law.</p>
              </section>
            </div>

            {/* 10, 11 & 12 */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 text-xs text-neutral-600">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
                  <strong className="text-primary block font-serif mb-1">10. Indemnification</strong>
                  You agree to hold harmless ISSA Foundation from any claims or legal costs arising from your breach of these Terms.
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60">
                  <strong className="text-primary block font-serif mb-1">11 & 12. Jurisdiction & Law</strong>
                  These Terms are governed by the laws of the Republic of India under exclusive jurisdiction of local courts in India.
                </div>
              </div>

              {/* Contact Box */}
              <div className="bg-primary-dark text-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                <div>
                  <h3 className="text-sm font-serif font-bold text-accent">14. Legal & Terms Questions</h3>
                  <p className="text-xs text-neutral-300 mt-1">For official queries regarding these Terms & Conditions or website operations:</p>
                </div>
                <a
                  href="mailto:info@issafoundation.in"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-primary text-xs font-bold hover:bg-accent-dark transition-all shrink-0 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>info@issafoundation.in</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
