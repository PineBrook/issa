-- migrate:statement
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name TEXT NOT NULL DEFAULT 'ISSA Foundation',
  site_tagline TEXT NOT NULL DEFAULT 'Grassroots Development Across Uttarakhand',
  logo_url TEXT NOT NULL DEFAULT '',
  announcement_enabled BOOLEAN NOT NULL DEFAULT false,
  announcement_text TEXT NOT NULL DEFAULT '',
  announcement_link TEXT NOT NULL DEFAULT '',
  announcement_button_text TEXT NOT NULL DEFAULT 'Learn More',
  phone TEXT NOT NULL DEFAULT '0135 430 8180',
  email TEXT NOT NULL DEFAULT 'career.issafoundation@gmail.com',
  head_office_address TEXT NOT NULL DEFAULT '3F, Municipal No. 23/1 E.C. Road, New Municipal No. 107, Rajeev Gandhi Marg-II, Dehradun, Uttarakhand - 248001',
  regional_office_address TEXT NOT NULL DEFAULT 'Ward No 6, House No 33, C/o USHA RAWAT Agency Chowk, Kandoliya Mandir Road, Pauri Garhwal District Hospital, Pauri, Pauri Garhwal, Uttarakhand - 246001',
  youtube_url TEXT NOT NULL DEFAULT 'https://www.youtube.com/@ISSAClasses',
  facebook_url TEXT NOT NULL DEFAULT 'https://www.facebook.com/profile.php?id=61592854956791&sk=about',
  instagram_url TEXT NOT NULL DEFAULT 'https://www.instagram.com/issa__foundation/',
  twitter_url TEXT NOT NULL DEFAULT 'https://x.com/ISSAfoundation1',
  linkedin_url TEXT NOT NULL DEFAULT 'https://www.linkedin.com/company/issa-foundation-uttarakhand/about/?viewAsMember=true',
  tax_exempt_info TEXT NOT NULL DEFAULT 'ISSA Foundation is a registered non-profit organization.',
  footer_tagline TEXT NOT NULL DEFAULT 'A grassroots non-profit committed to strengthening educational infrastructure, digital literacy, and clinical care systems across remote Himalayan communities.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
INSERT INTO site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- migrate:statement
CREATE TABLE IF NOT EXISTS hero_slides (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slide_key TEXT NOT NULL UNIQUE,
  eyebrow TEXT NOT NULL,
  title TEXT NOT NULL,
  highlight TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  cta_label TEXT NOT NULL,
  cta_href TEXT NOT NULL,
  donate_label TEXT NOT NULL DEFAULT 'Support Our Mission',
  donate_href TEXT NOT NULL DEFAULT '/contact',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
INSERT INTO hero_slides (slide_key, eyebrow, title, highlight, description, image, cta_label, cta_href, donate_label, donate_href, display_order, is_active)
VALUES
  ('ecosystem', 'Integrated Development', 'One Connected Ecosystem', 'for Holistic Impact.', 'Connecting Healthcare, Education, Entrepreneurship and Career Aspirations with Digital Inclusion to build a stronger Uttarakhand.', '/isssa-local-ownership-v2.png', 'Explore Ecosystem', '/programs', 'Support Our Mission', '/contact', 1, true),
  ('healthcare', 'Healthcare Systems', 'Care that reaches', 'to the last mile.', 'Connecting remote communities with specialist care, diagnostics and essential health services.', '/isssa-healthcare-program-v2.png', 'Explore Healthcare', '/programs/healthcare', 'Support Our Mission', '/contact', 2, true),
  ('education', 'Smart Classrooms & Education', 'Smart learning', 'for every student.', 'Bringing quality education, teacher support and better learning opportunities to students across Uttarakhand.', '/isssa-education-program-v2.png', 'Explore Education', '/programs/education', 'Support Our Mission', '/contact', 3, true),
  ('entrepreneurship', 'Entrepreneurship Development', 'Growing local businesses,', 'Creating local livelihoods.', 'Supporting rural entrepreneurs with financial assistance, mentorship, technology and market access to build sustainable businesses.', '/isssa-entrepreneurship-program-v2.png', 'Explore Entrepreneurship', '/programs/entrepreneurship', 'Support Our Mission', '/contact', 4, true),
  ('careers', 'Career & Opportunities', 'Turning aspirations', 'into opportunities.', 'Enabling people across Uttarakhand prepare for careers, access employment opportunities and build sustainable futures.', '/isssa-community-dispatch-v2.png', 'Explore Careers', '/careers', 'Support Our Mission', '/contact', 5, true),
  ('digital', 'Digital Transformation', 'Connecting technology', 'to community needs.', 'Building technology solutions that enable smarter healthcare, education and livelihoods across Uttarakhand.', '/isssa-digital-inclusion.png', 'Explore IT Solutions', 'https://pinebrooktechnologies.com/', 'Support Our Mission', '/contact', 6, true)
ON CONFLICT (slide_key) DO NOTHING;

-- migrate:statement
CREATE TABLE IF NOT EXISTS home_sections (
  section_key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
INSERT INTO home_sections (section_key, data)
VALUES
  ('stats', '[
    {"value": "11+", "label": "Schools Adopted", "order": 1},
    {"value": "600+", "label": "Students Reached", "order": 2},
    {"value": "20+", "label": "Hospital Beds", "order": 3},
    {"value": "1,200+", "label": "Patients Cared For", "order": 4},
    {"value": "20+", "label": "Entrepreneurs", "order": 5},
    {"value": "6+", "label": "Districts", "order": 6}
  ]'::jsonb),
  ('philosophy', '{
    "heading": "Development led by local communities",
    "image": "/isssa-school-community-v2.png",
    "imageAlt": "Himalayan village children happily reading books in an Indian mountain community",
    "badgeTitle": "Working with communities.",
    "badgeSub": "Working closely with government departments and local communities on long-term programs.",
    "p1": "ISSA Foundation was established to improve access to education and healthcare. We focus on practical support that helps communities become more independent.",
    "p2": "We design programs with village elders, local leaders, and state authorities so they respond to local needs.",
    "bullet1Title": "Integrated Education",
    "bullet1Sub": "Merging digital literacy with traditional government curriculum.",
    "bullet2Title": "Holistic Health",
    "bullet2Sub": "Bringing specialist hospital care to remote hill districts.",
    "ctaLabel": "LEARN ABOUT ISSA",
    "ctaHref": "/programs"
  }'::jsonb),
  ('strategic_interventions', '{
    "heading": "Targeted Work, Measurable Results",
    "items": [
      {"metric": "11+", "desc": "Smart boards and computers distributed across high-altitude government schools to improve classroom learning."},
      {"metric": "11+", "desc": "Specialist teachers appointed to mentor rural students and provide ongoing digital training."},
      {"metric": "20", "desc": "Hospital beds and high-tech equipment delivering critical, life-saving diagnostic care in Pauri Garhwal."}
    ]
  }'::jsonb),
  ('collaborate', '{
    "heading": "Partner with us to Transform Lives",
    "desc": "Volunteer, partner, or support the work bringing lasting opportunity and structural development to remote communities in Uttarakhand.",
    "phone": "0135 430 8180",
    "email": "career.issafoundation@gmail.com"
  }'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- migrate:statement
CREATE TABLE IF NOT EXISTS impact_content (
  section_key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
INSERT INTO impact_content (section_key, data)
VALUES
  ('hero', '{
    "eyebrow": "Measured Progress",
    "title": "Transforming Lives.",
    "highlight": "One Village At A Time.",
    "description": "We focus on measurable outputs. Our financial allocations and community programs are audited periodically to maintain rigorous performance ratios."
  }'::jsonb),
  ('metrics', '[
    {
      "title": "EduTech Infrastructure",
      "metric": "84%",
      "sub": "Student Attendance Surge",
      "details": "Evaluations indicate that smart classroom installations led to a direct 84% rise in consistent rural high school attendance rates.",
      "verifiedText": "Direct Impact Verified"
    },
    {
      "title": "Healthcare Coverage",
      "metric": "72%",
      "sub": "Reduced Travel Burdens",
      "details": "By deploying local mobile camp vans, over 72% of critical dental/diagnostic patients were saved from traveling 60+ km to cities.",
      "verifiedText": "Direct Impact Verified"
    },
    {
      "title": "IEDP Entrepreneurship",
      "metric": "20+",
      "sub": "Entrepreneurs Supported",
      "details": "Mentoring, technology support, and market connections across 6 districts and 10+ sectors, targeting 100+ local employment opportunities.",
      "verifiedText": "Direct Impact Verified"
    },
    {
      "title": "Accountability Model",
      "metric": "100%",
      "sub": "Direct Aid Sourcing",
      "details": "All purchases, classroom equipment, and doctor salaries are routed directly with no intermediary layers, assuring 100% budget efficacy.",
      "verifiedText": "Direct Impact Verified"
    }
  ]'::jsonb),
  ('milestones', '{
    "eyebrow": "Metrics Trend",
    "title": "Sustained Growth in Student Competency",
    "desc": "Independent assessment of rural primary and secondary students adopted into our CIAS digital classrooms showing competency increases over three school terms.",
    "bars": [
      {"label": "Pre-Adoption", "value": 35, "color": "primary"},
      {"label": "Term 1 (CIAS)", "value": 60, "color": "rust"},
      {"label": "Term 2 (CIAS)", "value": 88, "color": "accent"}
    ]
  }'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- migrate:statement
CREATE TABLE IF NOT EXISTS programs_content (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  badge TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  overview_p1 TEXT NOT NULL,
  overview_p2 TEXT NOT NULL,
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  approach_title TEXT NOT NULL,
  approach_desc TEXT NOT NULL,
  programmes JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  stats JSONB NOT NULL DEFAULT '[]'::jsonb,
  roadmap JSONB NOT NULL DEFAULT '[]'::jsonb,
  involvement JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
INSERT INTO programs_content (slug, title, subtitle, badge, hero_image, overview_p1, overview_p2, vision, mission, approach_title, approach_desc, programmes, skills, stats, roadmap, involvement)
VALUES
  (
    'education',
    'Empowering young minds.',
    'Building future leaders.',
    'Education initiative',
    '/isssa-education-program-v2.png',
    'Education is not limited to classrooms. It is about creating confident learners, responsible citizens, skilled professionals, and future entrepreneurs. Working with the Government of Uttarakhand, educators, communities, volunteers, and technology partners, ISSA is building an ecosystem that combines quality teaching, digital learning, career guidance, skill development, and real-world exposure.',
    'The initiative was created because many government schools in rural and hill regions face limited digital infrastructure, shortages of subject-specialist teachers, and restricted access to career guidance and modern learning opportunities. ISSA exists to bridge these gaps so every learner can access quality education and build a brighter future.',
    'An inclusive, technology-enabled, future-ready education ecosystem where every learner can realise their full potential.',
    'Strengthen schools, empower teachers, improve outcomes, promote digital inclusion, and connect students with opportunity.',
    'A connected model for stronger schools',
    'We combine school-level support with digital access, specialist teaching, guidance, and skills that make learning useful beyond the exam.',
    '[
      {"title": "CIAS: Cluster of ISSA Adopted Schools", "description": "In collaboration with the Uttarakhand Education Department, ISSA supports 12 government schools through a structured model of smart classrooms, subject-specialist teachers, academic support, and technology integration."},
      {"title": "Smart Classrooms & Digital Learning", "description": "Smart Boards, computers, and engaging digital resources help students and teachers access interactive, technology-enabled learning in their own schools."},
      {"title": "Academic Excellence", "description": "Subject-specialist teachers strengthen classroom learning, provide focused support in key subjects, and help government schools improve academic outcomes."},
      {"title": "Computer Education & Digital Literacy", "description": "Structured computer education prepares students for higher education, employment, and participation in the digital economy."},
      {"title": "Career & Competitive Exam Guidance", "description": "Students and young people receive coaching and career guidance for government examinations, future employment, and public service opportunities."},
      {"title": "Agniveer Preparation Programme", "description": "Structured guidance, training, and physical readiness support youth aspiring to serve the nation through the Agniveer recruitment process."}
    ]'::jsonb,
    '["Communication skills", "Leadership", "Digital skills", "Financial literacy", "Entrepreneurship awareness", "Innovation and problem solving", "Career readiness"]'::jsonb,
    '[
      {"value": "12", "label": "government schools adopted through CIAS"},
      {"value": "1", "label": "connected model for teaching, technology, and opportunity"}
    ]'::jsonb,
    '[
      "Strengthen and expand the CIAS network across Uttarakhand",
      "Add digital classrooms, STEM programmes, and practical learning experiences",
      "Create industry exposure, scholarships, and school-to-employment pathways",
      "Connect learners with higher education, careers, entrepreneurship, and lifelong learning"
    ]'::jsonb,
    '[
      {"title": "Schools", "description": "Partner with ISSA to strengthen learning environments, digital access, and academic support."},
      {"title": "Students", "description": "Use learning, digital literacy, career guidance, and skill-building opportunities to prepare for what comes next."},
      {"title": "Teachers", "description": "Bring subject expertise, mentorship, and classroom leadership to the government school ecosystem."},
      {"title": "Volunteers", "description": "Contribute time, knowledge, mentoring, and local support to help learners and schools move forward."},
      {"title": "Corporate Partners", "description": "Invest in scalable education infrastructure, teacher support, digital inclusion, and future-ready skills."}
    ]'::jsonb
  ),
  (
    'healthcare',
    'Care that reaches',
    'to the last mile.',
    'Healthcare initiative',
    '/isssa-healthcare-program-v2.png',
    'Access to quality healthcare should not depend on geography. In remote Himalayan villages, geographical distance and lack of specialist medical staff pose severe barriers to timely treatment. ISSA Foundation collaborates with local health authorities to bridge this divide.',
    'By equipping community hospitals, deploying mobile diagnostic clinics, and facilitating specialist teleconsultations, we ensure comprehensive primary and specialized medical care reaches the most isolated hill communities.',
    'Accessible, dependable, and high-standard healthcare for every mountain community in Uttarakhand.',
    'Deliver life-saving medical equipment, organize specialty health camps, and support rural hospitals to drastically reduce healthcare travel burdens.',
    'Bridging the healthcare divide in remote hills',
    'Our healthcare intervention focuses on immediate clinical support, diagnostic infrastructure, and specialized outreach.',
    '[
      {"title": "Hospital Infrastructure & Bed Enablement", "description": "Equipping district and block-level hospitals with advanced patient beds, diagnostic machinery, and critical medical supplies in Pauri Garhwal."},
      {"title": "Mobile Medical & Diagnostic Units", "description": "Deploying vans equipped for dental, ophthalmic, and general diagnostics to remote villages unreachable by conventional clinics."},
      {"title": "Specialist Teleconsultation", "description": "Connecting rural patients directly with expert doctors and medical consultants across top Indian healthcare institutions."}
    ]'::jsonb,
    '["Emergency Care", "Preventative Screening", "Maternal Health", "Digital Health Records", "Telemedicine"]'::jsonb,
    '[
      {"value": "20+", "label": "Hospital beds equipped with advanced monitors"},
      {"value": "1,200+", "label": "Patients treated in high-altitude communities"},
      {"value": "72%", "label": "Reduction in travel distance for routine diagnostics"}
    ]'::jsonb,
    '[
      "Expand mobile clinic coverage to 10 additional mountain blocks",
      "Integrate telemedicine kiosks in all CIAS school health corners",
      "Establish a 24/7 mountain ambulance network for emergency referrals"
    ]'::jsonb,
    '[
      {"title": "Doctors & Specialists", "description": "Volunteer your clinical expertise for mobile medical camps and teleconsultation sessions."},
      {"title": "Hospitals & Medical Chains", "description": "Partner with ISSA to sponsor equipment and medical diagnostics."},
      {"title": "Community Health Workers", "description": "Collaborate on local health surveillance and preventive education."}
    ]'::jsonb
  ),
  (
    'entrepreneurship',
    'Growing local businesses.',
    'Creating local livelihoods.',
    'Entrepreneurship Development Programme (IEDP)',
    '/isssa-entrepreneurship-program-v2.png',
    'Uttarakhand has immense potential in agro-processing, ecotourism, handloom, and digital services. However, rural entrepreneurs often lack seed capital, mentorship, digital tools, and market linkages required to scale.',
    'The ISSA Entrepreneurship Development Programme (IEDP) identifies ambitious rural and youth entrepreneurs, providing end-to-end incubation, business mentorship, digital marketing, and financial linkages.',
    'A vibrant, self-reliant rural economy where local youth build sustainable enterprises that create jobs in their own hometowns.',
    'Nurture and scale 100+ rural micro-enterprises across Uttarakhand through training, mentorship, and direct market access.',
    'From idea to sustainable mountain enterprise',
    'We provide practical, hands-on enterprise support tailored specifically to mountain economies and rural supply chains.',
    '[
      {"title": "Incubation & Seed Support", "description": "Providing early-stage validation, financial literacy, and initial grant/seed linkages for viable mountain business concepts."},
      {"title": "Digital Transformation for Rural Artisans", "description": "Helping local craftspeople, farmers, and entrepreneurs sell products nationwide through digital commerce and branding."},
      {"title": "Mentorship & Market Access", "description": "Pairing entrepreneurs with experienced business leaders and linking products directly to urban and institutional markets."}
    ]'::jsonb,
    '["Business Planning", "Financial Management", "E-commerce & Digital Marketing", "Supply Chain Logistics", "Regulatory Compliance"]'::jsonb,
    '[
      {"value": "20+", "label": "Entrepreneurs actively supported"},
      {"value": "6+", "label": "Districts covered across Garhwal and Kumaon"},
      {"value": "100+", "label": "Local direct and indirect jobs created"}
    ]'::jsonb,
    '[
      "Establish enterprise incubation centers in Dehradun and Pauri",
      "Launch a dedicated regional artisanal and organic marketplace",
      "Facilitate INR 1 Crore in micro-enterprise credit linkages for women entrepreneurs"
    ]'::jsonb,
    '[
      {"title": "Aspiring Entrepreneurs", "description": "Apply to join the IEDP cohort for structured incubation and mentorship."},
      {"title": "Industry Mentors", "description": "Guide emerging entrepreneurs in marketing, finance, and scaling operations."},
      {"title": "Impact Investors & CSR", "description": "Fund revolving micro-grant pools to catalyze high-impact mountain enterprises."}
    ]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

-- migrate:statement
CREATE TABLE IF NOT EXISTS faqs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'contact',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
INSERT INTO faqs (category, question, answer, display_order, is_active)
VALUES
  ('contact', 'Where is the ISSA Foundation located?', 'Our Head Office is located on E.C. Road in Dehradun, and our Regional Office is located near District Hospital in Pauri, Uttarakhand.', 1, true),
  ('contact', 'Can I volunteer directly in Uttarakhand schools?', 'Absolutely. We run seasonal student tutoring and digital mentoring camps. Volunteers with backgrounds in computing, basic healthcare instruction, or physical therapy are welcome to submit applications through our Careers/Join Us page.', 2, true),
  ('contact', 'Is ISSA audited by state authorities?', 'Yes. All school adoptions, classroom renovations, and medical device distributions are carried out under formal agreements with the relevant state departments and are subject to public auditing guidelines.', 3, true)
ON CONFLICT DO NOTHING;

-- migrate:statement
CREATE TABLE IF NOT EXISTS office_locations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  city TEXT NOT NULL,
  role TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
INSERT INTO office_locations (city, role, address, phone, email, display_order, is_active)
VALUES
  ('Head Office (Dehradun)', 'Headquarters', '3F, Municipal No. 23/1 E.C. Road, New Municipal No. 107, Rajeev Gandhi Marg-II, Dehradun, Uttarakhand - 248001', '+91 135 430 8180', 'career.issafoundation@gmail.com', 1, true),
  ('Regional Office (Pauri)', 'Regional Administrative Hub', 'Ward No 6, House No 33, C/o USHA RAWAT Agency Chowk, Kandoliya Mandir Road, Pauri Garhwal District Hospital, Pauri, Pauri Garhwal, Uttarakhand - 246001', '+91 135 430 8180', 'career.issafoundation@gmail.com', 2, true)
ON CONFLICT DO NOTHING;

-- migrate:statement
CREATE TABLE IF NOT EXISTS media_assets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_data BYTEA,
  file_url TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  alt_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
CREATE TABLE IF NOT EXISTS legal_pages (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  content_markdown TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- migrate:statement
INSERT INTO legal_pages (slug, title, subtitle, content_markdown)
VALUES
  (
    'privacy',
    'Privacy Policy',
    'How ISSA Foundation collects, uses, and safeguards your personal data.',
    '# Privacy Policy\n\n**Effective Date:** January 1, 2026\n\nISSA Foundation ("we", "our", or "us") is dedicated to safeguarding your personal data and upholding high transparency standards. This Privacy Policy details how we handle information collected through our official digital properties.\n\n## 1. Information We Collect\n\nWe collect personal information that you voluntarily submit to us, including:\n- Contact inquiries: Name, email address, message details\n- Career & Volunteer applications: Name, contact details, resume uploads, portfolio links\n- Newsletter subscriptions: Email address\n\n## 2. How We Use Information\n\nWe use the gathered information strictly for legitimate organizational operations:\n- Responding to public and stakeholder inquiries\n- Evaluating career and volunteer applications\n- Distributing requested newsletters and impact updates\n- Fulfilling statutory legal and regulatory compliance in India\n\n## 3. Data Protection and Security\n\nWe employ industry-standard encryption, strict access controls, and secure database configurations to protect all submitted data. We never sell, rent, or trade your personal data to third parties.\n\n## 4. Contact Us\n\nIf you have any questions or wish to request data correction/deletion, please contact us at career.issafoundation@gmail.com or call 0135 430 8180.'
  ),
  (
    'terms',
    'Terms & Conditions',
    'Terms of use and governance guidelines for ISSA Foundation digital platforms.',
    '# Terms & Conditions\n\n**Last Updated:** January 1, 2026\n\nBy accessing and utilizing the ISSA Foundation website, you agree to comply with and be bound by the following terms of use.\n\n## 1. Use of Content\n\nAll content, photographs, reports, and brand marks displayed on this website are the intellectual property of ISSA Foundation unless explicitly attributed otherwise. Unauthorized commercial reproduction is prohibited without prior written consent.\n\n## 2. Integrity of Submissions\n\nUsers submitting information through contact, donation, or job application forms agree to provide truthful, accurate, and up-to-date details.\n\n## 3. Disclaimers\n\nWhile ISSA Foundation makes every effort to keep all program metrics and organizational disclosures current and accurate, content is provided on an "as is" basis for informational and charitable engagement purposes.\n\n## 4. Governing Law\n\nThese terms shall be governed by and construed in accordance with the laws of India, under the jurisdiction of the courts of Uttarakhand.'
  )
ON CONFLICT (slug) DO NOTHING;
