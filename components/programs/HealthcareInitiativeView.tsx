import {
  Activity,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  HeartPulse,
  Hospital,
  MapPin,
  Network,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Users,
} from 'lucide-react';

const healthcareModel = [
  {
    title: 'Communities & Villages',
    icon: Users,
    items: ['Health awareness', 'Preventive healthcare', 'Village outreach', 'Early screening'],
  },
  {
    title: 'Mobile Healthcare Unit',
    icon: Smartphone,
    items: ['Weekly village visits', 'Emergency response', 'Medicine delivery', 'Health camps', 'Sample collection', 'Follow-up care'],
  },
  {
    title: 'Rural Health Hub',
    icon: Stethoscope,
    items: ['Doctor consultation', 'Diagnostics and laboratory', 'Pharmacy', 'Day-care procedures', 'Emergency stabilization'],
  },
  {
    title: 'UttaraCare Hospital',
    icon: Hospital,
    items: ['Specialist consultation', 'Advanced diagnostics', 'Hospital admission', 'Surgical care', 'Referral management'],
  },
  {
    title: 'Digital Health Platform',
    icon: Network,
    items: ['Tele-consultation', 'Electronic health records', 'Diagnostic reporting', 'Analytics', 'Continuous monitoring'],
  },
];

const accessPoints = [
  {
    title: 'UttaraCare Hospital',
    icon: Hospital,
    description: 'Established in Pauri Garhwal, UttaraCare is the clinical backbone of the network, providing specialist consultation, inpatient care, diagnostics, and referral support for rural health centres.',
  },
  {
    title: 'Bironkhal Rural Health Hub',
    icon: MapPin,
    description: 'The first Rural Health Hub under ISSA\'s Hub-and-Spoke model, bringing OPD consultation, diagnostics, pharmacy, laboratory services, day-care procedures, telemedicine, follow-up, and referrals closer to remote communities.',
  },
  {
    title: 'Mobile Healthcare',
    icon: Smartphone,
    description: 'Mobile medical units extend care beyond the clinic through weekly village visits, preventive camps, basic diagnostics, sample collection, medicine delivery, emergency support, and health education.',
  },
  {
    title: 'Digital Healthcare',
    icon: Activity,
    description: 'Tele-consultation, electronic health records, digital diagnostic reports, patient monitoring, clinical analytics, and referral coordination connect rural patients with the care they need.',
  },
];

const preventionPrograms = [
  'Community health awareness',
  'Maternal & child health',
  'School health',
  'Preventive screenings',
  'Nutrition awareness',
  'Lifestyle disease management',
  'Elderly care',
  'Vaccination awareness',
];

const roadmap = [
  'Additional Rural Health Hubs',
  'Village Health Centres',
  'More Mobile Medical Units',
  'Specialist Outreach Clinics',
  'Digital Health Platform',
  'AI-assisted Community Health Monitoring',
  "School and Women's Health Programmes",
  'Senior Citizen and Home Healthcare Services',
];

export default function HealthcareInitiativeView() {
  return (
    <main id="healthcare-initiative" className="bg-neutral-50 font-sans text-neutral-800">
      <section className="relative overflow-hidden bg-primary py-20 text-white sm:py-28">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Healthcare | Healthy Communities, Better Futures</p>
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-6xl">
              ISSA Rural Healthcare Initiative
            </h1>
            <p className="font-serif text-xl text-accent sm:text-2xl">Transforming rural healthcare through connected communities.</p>
            <p className="max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">
              Healthcare should never be limited by geography. ISSA is building an integrated ecosystem of hospitals, rural health hubs, mobile healthcare, telemedicine, and community outreach that brings quality care closer to every village in Uttarakhand.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <article className="space-y-4 rounded-2xl border border-emerald-200/70 border-t-4 border-t-primary bg-white p-8 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-primary">Why We Started</h2>
          <p className="text-sm leading-relaxed text-neutral-600">For many families in rural Uttarakhand, a simple consultation can require several hours of travel. Diagnostic facilities are often unavailable, specialist doctors are concentrated in cities, emergency response is delayed, and preventive healthcare receives little attention.</p>
          <p className="text-sm leading-relaxed text-neutral-600">ISSA believes every family deserves quality healthcare regardless of where they live. This initiative is designed to reach remote communities through a connected and scalable healthcare network.</p>
        </article>
        <article className="space-y-4 rounded-2xl border border-emerald-200/70 border-t-4 border-t-primary bg-white p-8 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-primary">Vision & Mission</h2>
          <p className="text-sm leading-relaxed text-neutral-600"><strong className="text-primary">Vision:</strong> To build Uttarakhand&apos;s most trusted rural healthcare ecosystem by connecting hospitals, primary healthcare centres, telemedicine, mobile medical units, and community health programmes.</p>
          <p className="text-sm leading-relaxed text-neutral-600"><strong className="text-primary">Mission:</strong> To improve healthcare accessibility, reduce unnecessary travel, strengthen preventive healthcare, and enable technology-driven medical services for underserved communities.</p>
        </article>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">One connected network</p>
            <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">Our Rural Healthcare Model</h2>
            <p className="text-sm leading-relaxed text-neutral-600">Hospital care alone is not enough. Healthcare begins with awareness, continues through early diagnosis, and succeeds through accessible primary care, specialist guidance, and follow-up.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-5">
            {healthcareModel.map(({ title, icon: Icon, items }, index) => (
              <div key={title} className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="mb-5 flex items-center gap-3 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-serif text-base font-bold">{title}</h3>
                </div>
                <ul className="space-y-2">
                  {items.map((item) => <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-neutral-600"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />{item}</li>)}
                </ul>
                {index < healthcareModel.length - 1 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-1 text-primary md:block" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Care where it is needed</p>
          <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">From village outreach to specialist care.</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {accessPoints.map(({ title, icon: Icon, description }) => (
            <article key={title} className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
              <Icon className="mb-6 h-7 w-7 text-primary" aria-hidden="true" />
              <h3 className="font-serif text-xl font-bold text-primary">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary-dark py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-5">
            <HeartPulse className="h-8 w-8 text-accent" aria-hidden="true" />
            <h2 className="font-serif text-3xl font-bold text-accent">Beyond Treatment</h2>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-300">We believe healthcare should focus equally on prevention. Community programmes help people recognise risks earlier and build healthier lives.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {preventionPrograms.map((program) => <div key={program} className="flex items-center gap-2 text-sm text-neutral-200"><CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />{program}</div>)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="font-serif text-2xl font-bold text-white">Current Impact</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">Our healthcare network is steadily expanding across Uttarakhand.</p>
            <ul className="mt-6 space-y-3">
              {['UttaraCare Hospital, Pauri', 'Affordable community healthcare', 'Bironkhal Hub-and-Spoke model', 'Mobile healthcare services', 'Digital health and telemedicine', 'Community outreach'].map((item) => <li key={item} className="flex items-center gap-3 text-sm text-neutral-200"><ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Looking ahead</p>
            <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">A healthier Uttarakhand, village by village.</h2>
            <p className="text-sm leading-relaxed text-neutral-600">Every new centre will strengthen the same connected healthcare network and extend timely, affordable, and compassionate care closer to home.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {roadmap.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700"><CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />{item}</div>)}
          </div>
        </div>
      </section>

      <section className="bg-accent py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <HeartHandshake className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
          <h2 className="mt-5 font-serif text-3xl font-bold text-primary sm:text-4xl">Help build a connected rural healthcare ecosystem.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary/80">We invite hospitals, doctors, healthcare professionals, technology providers, educational institutions, CSR organisations, volunteers, donors, and development partners to work with us.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary-light">Partner With Us <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-white/50">Support Our Mission <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
