import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Laptop,
  Lightbulb,
  School,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

const programmes = [
  {
    icon: School,
    title: 'CIAS: Cluster of ISSA Adopted Schools',
    description:
      'In collaboration with the Uttarakhand Education Department, ISSA supports 12 government schools through a structured model of smart classrooms, subject-specialist teachers, academic support, and technology integration.',
  },
  {
    icon: Laptop,
    title: 'Smart Classrooms & Digital Learning',
    description:
      'Smart Boards, computers, and engaging digital resources help students and teachers access interactive, technology-enabled learning in their own schools.',
  },
  {
    icon: GraduationCap,
    title: 'Academic Excellence',
    description:
      'Subject-specialist teachers strengthen classroom learning, provide focused support in key subjects, and help government schools improve academic outcomes.',
  },
  {
    icon: Laptop,
    title: 'Computer Education & Digital Literacy',
    description:
      'Structured computer education prepares students for higher education, employment, and participation in the digital economy.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Career & Competitive Exam Guidance',
    description:
      'Students and young people receive coaching and career guidance for government examinations, future employment, and public service opportunities.',
  },
  {
    icon: ShieldCheck,
    title: 'Agniveer Preparation Programme',
    description:
      'Structured guidance, training, and physical readiness support youth aspiring to serve the nation through the Agniveer recruitment process.',
  },
];

const futureReadySkills = [
  'Communication skills',
  'Leadership',
  'Digital skills',
  'Financial literacy',
  'Entrepreneurship awareness',
  'Innovation and problem solving',
  'Career readiness',
];

const roadmap = [
  'Strengthen and expand the CIAS network across Uttarakhand',
  'Add digital classrooms, STEM programmes, and practical learning experiences',
  'Create industry exposure, scholarships, and school-to-employment pathways',
  'Connect learners with higher education, careers, entrepreneurship, and lifelong learning',
];

const involvementPaths = [
  {
    icon: School,
    title: 'Schools',
    description: 'Partner with ISSA to strengthen learning environments, digital access, and academic support.',
  },
  {
    icon: GraduationCap,
    title: 'Students',
    description: 'Use learning, digital literacy, career guidance, and skill-building opportunities to prepare for what comes next.',
  },
  {
    icon: Users,
    title: 'Teachers',
    description: 'Bring subject expertise, mentorship, and classroom leadership to the government school ecosystem.',
  },
  {
    icon: HeartHandshake,
    title: 'Volunteers',
    description: 'Contribute time, knowledge, mentoring, and local support to help learners and schools move forward.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'CSR Partners',
    description: 'Invest in scalable education infrastructure, teacher support, digital inclusion, and future-ready skills.',
  },
];

function HeartHandshake(props: React.ComponentProps<typeof Users>) {
  return <Sparkles {...props} />;
}

export default function EducationInitiativeView() {
  return (
    <main id="education-initiative" className="bg-neutral-50 font-sans text-neutral-800">
      <section className="relative overflow-hidden bg-primary-dark pt-28 pb-20 text-white sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-6">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> Education initiative
            </p>
            <h1 className="max-w-3xl font-serif text-4xl font-bold tracking-tight sm:text-6xl">
              Empowering young minds.{' '}
              <span className="font-normal italic text-accent">Building future leaders.</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-neutral-300">
              ISSA Foundation is transforming education in Uttarakhand by improving learning outcomes, strengthening government schools, empowering teachers, and preparing young people with the knowledge, skills, and opportunities they need to succeed.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Overview</p>
          <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">Education beyond the classroom</h2>
          <p className="leading-8 text-neutral-600">
            Education is not limited to classrooms. It is about creating confident learners, responsible citizens, skilled professionals, and future entrepreneurs. Working with the Government of Uttarakhand, educators, communities, volunteers, and technology partners, ISSA is building an ecosystem that combines quality teaching, digital learning, career guidance, skill development, and real-world exposure.
          </p>
          <p className="leading-8 text-neutral-600">
            The initiative was created because many government schools in rural and hill regions face limited digital infrastructure, shortages of subject-specialist teachers, and restricted access to career guidance and modern learning opportunities. ISSA exists to bridge these gaps so every learner can access quality education and build a brighter future.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <div className="border-t-4 border-accent bg-white p-7 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">Vision</p>
            <p className="font-serif text-xl leading-8 text-primary">An inclusive, technology-enabled, future-ready education ecosystem where every learner can realise their full potential.</p>
          </div>
          <div className="border-t-4 border-primary bg-white p-7 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">Mission</p>
            <p className="font-serif text-xl leading-8 text-primary">Strengthen schools, empower teachers, improve outcomes, promote digital inclusion, and connect students with opportunity.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Our approach</p>
          <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">A connected model for stronger schools</h2>
          <p className="leading-7 text-neutral-600">We combine school-level support with digital access, specialist teaching, guidance, and skills that make learning useful beyond the exam.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.map(({ icon: Icon, title, description }) => (
            <article key={title} className="group border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-accent hover:shadow-md">
              <div className="mb-5 flex h-11 w-11 items-center justify-center bg-accent/20 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold text-primary">{title}</h3>
              <p className="text-sm leading-7 text-neutral-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary-dark text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Future-ready skills</p>
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">Preparing learners for study, work, and life</h2>
            <p className="leading-8 text-neutral-300">Beyond academics, ISSA aims to build the capabilities students need for higher education, employment, entrepreneurship, and responsible citizenship.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {futureReadySkills.map((skill) => (
              <div key={skill} className="flex items-center gap-3 border-b border-white/10 py-4 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="border-l-4 border-accent bg-white p-8 shadow-sm sm:p-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Impact so far</p>
          <h2 className="mb-6 font-serif text-3xl font-bold text-primary">Building the foundation for lasting change</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div><p className="font-serif text-4xl font-bold text-primary">12</p><p className="mt-1 text-sm text-neutral-600">government schools adopted through CIAS</p></div>
            <div><p className="font-serif text-4xl font-bold text-primary">1</p><p className="mt-1 text-sm text-neutral-600">connected model for teaching, technology, and opportunity</p></div>
          </div>
          <p className="mt-8 text-sm leading-7 text-neutral-600">Through smart classroom enablement, subject-specialist support, computer education, and guidance, ISSA is laying the groundwork for stronger learning outcomes across rural and hill communities.</p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3"><Lightbulb className="h-5 w-5 text-accent" aria-hidden="true" /><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Roadmap</p></div>
          <h2 className="font-serif text-3xl font-bold text-primary">From stronger classrooms to clearer pathways</h2>
          <div className="space-y-4">
            {roadmap.map((item, index) => (
              <div key={item} className="flex gap-4 border-b border-neutral-200 pb-4">
                <span className="font-serif text-xl font-bold text-accent">0{index + 1}</span>
                <p className="pt-1 text-sm leading-7 text-neutral-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4efe3]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 max-w-2xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Get involved</p>
            <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">Every learner needs a community behind them</h2>
            <p className="leading-7 text-neutral-600">Whether you teach, learn, volunteer, or invest in communities, there is a practical way to help expand meaningful educational opportunity.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {involvementPaths.map(({ icon: Icon, title, description }) => (
              <article key={title} className="bg-white p-5 shadow-sm">
                <Icon className="mb-5 h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mb-2 font-serif text-lg font-bold text-primary">{title}</h3>
                <p className="text-sm leading-6 text-neutral-600">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-4 border-t border-primary/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl font-serif text-xl leading-8 text-primary">Together, we can prepare every learner not only to succeed academically, but also to thrive in life.</p>
            <a href="#contact" className="inline-flex items-center gap-2 text-sm font-bold text-primary underline decoration-accent decoration-2 underline-offset-4">
              Join the movement <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
