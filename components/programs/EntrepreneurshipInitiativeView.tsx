import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Handshake,
  Lightbulb,
  LineChart,
  MapPin,
  PiggyBank,
  Rocket,
  Users,
} from 'lucide-react';

const supportOffers = [
  ['Business assessment', 'A clear view of the current business, constraints, and growth opportunities.'],
  ['Growth planning', 'A jointly prepared roadmap with practical priorities for the next stage.'],
  ['One-to-one mentorship', 'Ongoing guidance from people who understand the entrepreneur’s context.'],
  ['Business management training', 'Practical capability development for stronger day-to-day decisions.'],
  ['Product and industry guidance', 'Access to relevant expertise to improve products and operations.'],
  ['Branding and packaging', 'Support to present products with greater clarity and market readiness.'],
  ['Market access and buyer connect', 'Introductions and pathways to reach new customers and buyers.'],
  ['Digital marketing', 'Help building a credible online presence and reaching customers digitally.'],
  ['Business website development', 'A stronger digital home for the enterprise and its products.'],
  ['Technology through PineBrook', 'Technology enablement matched to the needs and maturity of the business.'],
  ['Financial advisory', 'Responsible guidance to make better financing and cash-flow decisions.'],
  ['0% interest soft loans', 'Eligible cases may receive patient, responsible financial support.'],
  ['Business growth grants', 'Eligible cases may receive grants to unlock defined growth opportunities.'],
  ['Continuous monitoring', 'Regular follow-up, problem solving, and support beyond onboarding.'],
];

const ecosystemPartners = [
  'Experienced mentors',
  'Industry specialists',
  'Technology partners',
  'Financial advisors',
  'Academic institutions',
  'Government agencies',
  'Market partners',
  'CSR organisations',
];

const entrepreneurProfiles = [
  { sector: 'Agriculture', detail: 'Growing local value through better products, planning, and market access.' },
  { sector: 'Horticulture', detail: 'Building stronger rural enterprises around Uttarakhand’s natural strengths.' },
  { sector: 'Food processing', detail: 'Helping local producers move from raw materials to market-ready products.' },
  { sector: 'Manufacturing', detail: 'Supporting businesses working to improve capacity, systems, and reach.' },
  { sector: 'Handicrafts and natural products', detail: 'Connecting distinctive local work with stronger brands and buyers.' },
  { sector: 'Rural services and women-led enterprises', detail: 'Backing inclusive businesses that create livelihoods close to home.' },
];

const outcomes = [
  'Business expansion',
  'Increased revenue',
  'Employment generation',
  'Market access',
  'Product improvement',
  'Digital adoption',
  'Long-term sustainability',
];

const roadmap = [
  ['2026', 'Launch and first cohort', 'Identify promising entrepreneurs, complete assessments, and onboard the first 19 businesses.'],
  ['Next', 'Deepen the support network', 'Grow the mentor and partner network around the needs of entrepreneurs across the state.'],
  ['Scale', 'Expand across Uttarakhand', 'Support hundreds of entrepreneurs, create local employment, and strengthen rural value chains.'],
  ['Long term', 'Build a trusted ecosystem', 'Make knowledge, partnerships, technology, and opportunity easier to access for every entrepreneur.'],
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rust">{children}</p>;
}

function ActionLink({ href, children, dark = false }: { href: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all hover:-translate-y-0.5 ${
        dark ? 'bg-accent text-primary hover:bg-accent-dark' : 'border border-white/25 text-white hover:border-accent hover:text-accent'
      }`}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

export default function EntrepreneurshipInitiativeView() {
  return (
    <section id="entrepreneurship-initiative" className="bg-neutral-50 font-sans text-neutral-800">
      <header className="relative overflow-hidden bg-primary-dark text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-28">
          <div className="lg:col-span-8">
            <SectionLabel>ISSA Entrepreneurship Development Program</SectionLabel>
            <h1 className="mt-5 max-w-4xl font-serif text-4xl font-bold leading-tight sm:text-6xl">
              Businesses grow stronger when entrepreneurs do not grow alone.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              IEDP is ISSA Foundation’s Business Growth Partnership for entrepreneurs and local enterprises across Uttarakhand.
              We combine guidance, practical capability, market connections, technology, and responsible financial support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ActionLink href="#join-iedp" dark>Join IEDP</ActionLink>
              <ActionLink href="#partner-iedp">Partner with us</ActionLink>
            </div>
          </div>
          <div className="flex items-end lg:col-span-4">
            <div className="w-full border-l-2 border-accent pl-6">
              <p className="font-serif text-2xl italic text-accent">A long-term partnership</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                From understanding a business and identifying opportunities to measuring growth, ISSA works alongside each entrepreneur.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-neutral-200 sm:grid-cols-4 px-4 sm:px-6 lg:px-8">
          {[
            ['2026', 'Programme launched'],
            ['40', 'Entrepreneurs identified'],
            ['19', 'First cohort shortlisted'],
            ['1', 'Business growth partnership'],
          ].map(([value, label]) => (
            <div key={label} className="px-3 py-7 text-center first:pl-0 last:pr-0 sm:py-9">
              <p className="font-serif text-3xl font-bold text-primary sm:text-4xl">{value}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <section className="grid gap-12 lg:grid-cols-12" id="iedp-overview">
          <div className="lg:col-span-5">
            <SectionLabel>Why IEDP exists</SectionLabel>
            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-primary sm:text-4xl">Good products and determination need a support system.</h2>
          </div>
          <div className="space-y-5 text-sm leading-relaxed text-neutral-600 lg:col-span-7">
            <p>Many talented entrepreneurs struggle to grow because they lack access to business guidance, industry expertise, branding, digital capabilities, markets, and professional networks.</p>
            <p>IEDP was created to bring mentorship, capability development, technology, market access, and responsible financial support into one integrated ecosystem.</p>
            <p>Our goal is not simply to support individual businesses. It is to create employment, strengthen rural economies, and inspire the next generation of entrepreneurs in Uttarakhand.</p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-12" id="iedp-journey">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 lg:col-span-5 lg:p-10">
            <SectionLabel>Our journey</SectionLabel>
            <h2 className="mt-4 font-serif text-3xl font-bold text-primary">The first cohort began in 2026.</h2>
            <div className="mt-8 space-y-6 border-l border-accent pl-6">
              <div><p className="font-bold text-primary">Launch</p><p className="mt-1 text-sm leading-relaxed text-neutral-600">IEDP launched in 2026 to identify and support promising entrepreneurs across Uttarakhand.</p></div>
              <div><p className="font-bold text-primary">MuY partnership</p><p className="mt-1 text-sm leading-relaxed text-neutral-600">ISSA partnered with Mukhyamantri Udyam Shala (MuY) to identify aspiring and existing entrepreneurs from different regions.</p></div>
              <div><p className="font-bold text-primary">40 identified</p><p className="mt-1 text-sm leading-relaxed text-neutral-600">The first phase identified 40 entrepreneurs working across diverse sectors.</p></div>
              <div><p className="font-bold text-primary">4 June 2026</p><p className="mt-1 text-sm leading-relaxed text-neutral-600">ISSA and MuY held an Entrepreneur Orientation Programme at the ISSA Foundation office in Dehradun.</p></div>
              <div><p className="font-bold text-primary">19 shortlisted</p><p className="mt-1 text-sm leading-relaxed text-neutral-600">After personal business visits and detailed assessments, 19 entrepreneurs were shortlisted for the first cohort. Formal onboarding is underway.</p></div>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-3xl bg-primary p-8 text-white lg:col-span-7 lg:p-10">
            <div>
              <SectionLabel>Assessment before action</SectionLabel>
              <h3 className="mt-4 max-w-xl font-serif text-3xl font-bold">Support starts with understanding the entrepreneur, not just the business.</h3>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-300">Following orientation, the ISSA team personally visited shortlisted entrepreneurs at their business locations. These visits explored operations, challenges, growth aspirations, and support requirements through a detailed business assessment.</p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {['Understand the business', 'Identify opportunities', 'Agree a growth roadmap'].map((item, index) => (
                <div key={item} className="border-t border-white/20 pt-4"><p className="text-2xl font-serif text-accent">0{index + 1}</p><p className="mt-2 text-xs font-semibold text-neutral-200">{item}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section id="iedp-offers">
          <div className="max-w-3xl"><SectionLabel>What we offer</SectionLabel><h2 className="mt-4 font-serif text-3xl font-bold text-primary sm:text-4xl">Comprehensive support, tailored to the business stage.</h2><p className="mt-4 text-sm leading-relaxed text-neutral-600">Every support intervention is customized based on the entrepreneur’s business needs and growth stage. Financial support is offered only in eligible cases and within a responsible growth plan.</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {supportOffers.map(([title, description], index) => (
              <article key={title} className={`rounded-2xl border p-5 transition-shadow hover:shadow-md ${index > 10 ? 'border-accent/50 bg-amber-50/40' : 'border-neutral-200 bg-white'}`}>
                <div className="flex items-start justify-between gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" /><span className="text-[10px] font-bold text-neutral-400">{String(index + 1).padStart(2, '0')}</span></div>
                <h3 className="mt-5 text-sm font-bold text-primary">{title}</h3><p className="mt-2 text-xs leading-relaxed text-neutral-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-12 lg:grid-cols-12" id="iedp-model">
          <div className="lg:col-span-5"><SectionLabel>How we work</SectionLabel><h2 className="mt-4 font-serif text-3xl font-bold text-primary sm:text-4xl">A practical partnership that continues after onboarding.</h2><p className="mt-5 text-sm leading-relaxed text-neutral-600">We work closely with each entrepreneur to understand the current business, identify opportunities, assess challenges, and jointly prepare a roadmap for development. We continue monitoring progress, measuring outcomes, solving challenges, and supporting long-term growth.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {[
              [BriefcaseBusiness, 'Assess', 'Understand operations, context, challenges, and growth aspirations.'],
              [Lightbulb, 'Plan', 'Turn the assessment into a clear, shared business development roadmap.'],
              [Handshake, 'Enable', 'Connect the right mentors, expertise, technology, markets, and finance.'],
              [LineChart, 'Measure', 'Monitor progress against jointly agreed goals and measurable outcomes.'],
            ].map(([Icon, title, description]) => {
              const IconComponent = Icon as typeof BriefcaseBusiness;
              return <article key={title as string} className="rounded-2xl border border-neutral-200 bg-white p-6"><IconComponent className="h-6 w-6 text-rust" /><h3 className="mt-5 font-serif text-xl font-bold text-primary">{title as string}</h3><p className="mt-2 text-xs leading-relaxed text-neutral-600">{description as string}</p></article>;
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-neutral-100 p-8 sm:p-10" id="iedp-ecosystem">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5"><SectionLabel>Building an ecosystem</SectionLabel><h2 className="mt-4 font-serif text-3xl font-bold text-primary">Entrepreneurship cannot succeed in isolation.</h2><p className="mt-4 text-sm leading-relaxed text-neutral-600">IEDP connects entrepreneurs with people and institutions that can provide knowledge, networks, and opportunity to build sustainable businesses.</p></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">{ecosystemPartners.map((partner) => <div key={partner} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-4 text-sm font-semibold text-primary"><ChevronRight className="h-4 w-4 shrink-0 text-accent" />{partner}</div>)}</div>
          </div>
        </section>

        <section id="iedp-entrepreneurs">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><SectionLabel>Meet our entrepreneurs</SectionLabel><h2 className="mt-4 font-serif text-3xl font-bold text-primary sm:text-4xl">One cohort. Many local visions for growth.</h2></div><p className="max-w-sm text-xs leading-relaxed text-neutral-500">The first cohort represents entrepreneurs from different regions of Uttarakhand. Profiles can be expanded with consent while protecting personal and confidential information.</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{entrepreneurProfiles.map((profile, index) => <article key={profile.sector} className="group rounded-2xl border border-neutral-200 bg-white p-6 hover:border-accent transition-colors"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-accent"><Users className="h-5 w-5" /></div><p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-rust">Cohort profile 0{index + 1}</p><h3 className="mt-2 font-serif text-xl font-bold text-primary">{profile.sector}</h3><p className="mt-2 text-xs leading-relaxed text-neutral-600">{profile.detail}</p></article>)}</div>
        </section>

        <section className="grid gap-12 lg:grid-cols-12" id="iedp-measurement">
          <div className="lg:col-span-5"><SectionLabel>Measuring success</SectionLabel><h2 className="mt-4 font-serif text-3xl font-bold text-primary sm:text-4xl">Growth is more than the amount of finance provided.</h2><p className="mt-5 text-sm leading-relaxed text-neutral-600">ISSA measures success through the growth of the entrepreneur and the business. Each entrepreneur’s progress is monitored through jointly agreed business goals and measurable outcomes.</p></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">{outcomes.map((outcome) => <div key={outcome} className="flex items-center gap-3 border-b border-neutral-200 py-4 text-sm font-semibold text-primary"><BarChart3 className="h-4 w-4 shrink-0 text-rust" />{outcome}</div>)}</div>
        </section>

        <section id="iedp-roadmap">
          <SectionLabel>Looking ahead</SectionLabel><h2 className="mt-4 max-w-2xl font-serif text-3xl font-bold text-primary sm:text-4xl">The first cohort is only the beginning.</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-4">{roadmap.map(([phase, title, description]) => <article key={phase} className="relative border-t-2 border-accent pt-5"><p className="text-xs font-bold uppercase tracking-widest text-rust">{phase}</p><h3 className="mt-3 font-serif text-xl font-bold text-primary">{title}</h3><p className="mt-2 text-xs leading-relaxed text-neutral-600">{description}</p></article>)}</div>
        </section>
      </main>

      <section className="bg-primary-dark text-white" id="join-iedp">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl"><SectionLabel>Join the movement</SectionLabel><h2 className="mt-4 font-serif text-3xl font-bold sm:text-5xl">Build a stronger business. Strengthen a stronger Uttarakhand.</h2><p className="mt-5 text-sm leading-relaxed text-neutral-300">If you are starting a new venture or looking to expand an existing enterprise, IEDP offers the guidance, mentorship, ecosystem, and support needed to help you grow.</p></div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Rocket, 'Entrepreneurs', 'Apply to join IEDP and grow with a long-term business partner.', '#iedp-apply'],
              [Handshake, 'Partners', 'Work with us across government, CSR, corporate, academic, technology, and market partnerships.', '#partner-iedp'],
              [Users, 'Mentors', 'Share your experience as a successful entrepreneur, leader, specialist, or domain expert.', 'mailto:career.issafoundation@gmail.com?subject=IEDP%20Mentor%20Network'],
              [PiggyBank, 'Supporters', 'Contribute funding, expertise, technology, market access, training, or volunteering.', 'mailto:career.issafoundation@gmail.com?subject=Support%20IEDP'],
            ].map(([Icon, title, description, href]) => { const IconComponent = Icon as typeof Rocket; return <a key={title as string} href={href as string} className="group rounded-2xl border border-white/15 bg-white/5 p-6 transition-colors hover:border-accent hover:bg-white/10"><IconComponent className="h-6 w-6 text-accent" /><h3 className="mt-6 font-serif text-xl font-bold">{title as string}</h3><p className="mt-2 min-h-12 text-xs leading-relaxed text-neutral-300">{description as string}</p><span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-accent">{title === 'Entrepreneurs' ? 'Apply to join' : title === 'Partners' ? 'Become a partner' : title === 'Mentors' ? 'Join mentor network' : 'Connect with ISSA'}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></a>; })}
          </div>
          <div className="mt-8 flex flex-wrap gap-3" id="partner-iedp"><ActionLink href="mailto:career.issafoundation@gmail.com?subject=IEDP%20Partnership" dark>Start a partnership</ActionLink><ActionLink href="mailto:career.issafoundation@gmail.com?subject=IEDP%20Enquiry">Connect with ISSA</ActionLink></div>
          <p id="iedp-apply" className="mt-8 text-xs text-neutral-400">To apply, partner, mentor, or support IEDP, contact career.issafoundation@gmail.com with your interest and a short introduction.</p>
        </div>
      </section>
    </section>
  );
}
