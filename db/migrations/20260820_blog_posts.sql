-- migrate:statement
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  cover_image_path TEXT NOT NULL,
  author_name TEXT NOT NULL,
  reading_time_minutes SMALLINT NOT NULL CHECK (reading_time_minutes > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((status = 'published') = (published_at IS NOT NULL)),
  CHECK (cover_image_path LIKE '/%')
);

-- migrate:statement
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx
  ON blog_posts (published_at DESC)
  WHERE status = 'published';

-- migrate:statement
INSERT INTO blog_posts (
  slug, category, title, subtitle, excerpt, content_markdown,
  cover_image_path, author_name, reading_time_minutes, status, published_at
)
VALUES
  (
    'digital-empowerment-in-remote-pauri',
    'Education',
    'Digital empowerment in remote Pauri.',
    'Bringing computer education to over 350 rural students.',
    'Our latest smart classroom cluster is official. In partnership with school authorities, we successfully completed the installation of five interactive smart boards and high-capacity computers. Students now engage in daily interactive coding modules and video-lectures.',
    $$For years, students in high-altitude Pauri Garhwal had minimal exposure to digital infrastructure. Traditional blackboard teaching was the only pedagogical mode. Today, with the collaboration of village heads and government school boards, ISSA has equipped three high-altitude clusters with interactive satellite-connected classrooms. The response is unprecedented: student retention rates rose by 84%, and children frequently remain after school to explore digital map tools, code logic puzzles, and science videos.$$,
    '/isssa-story-digital-inclusion-v2.png',
    'Aarti Rawat, Education Lead',
    4,
    'published',
    '2024-03-14T00:00:00+05:30'
  ),
  (
    'reaching-remote-mountain-villages',
    'Healthcare',
    'Reaching remote mountain villages.',
    'Free medical camps delivering diagnostic checkups.',
    'Healthcare in high altitudes is often a luxury. This month, our mobile clinics visited three remote hamlets, bringing custom dental checkup rigs, vision scanners, and physical therapy aids directly to elder community weavers.',
    $$Due to severe weather and steep terrain, seniors and children in remote Uttarakhand often postpone essential healthcare needs. ISSA’s Mobile Medical Camps provide on-site diagnostics, dental procedures, and optical prescriptions completely free of cost. Our team travels up to 40 kilometers off-paved roads to reach isolated villages. During this camp, over 300 individuals were screened, and 45 advanced cataract patients were scheduled for free transport and surgery at our partner hospital.$$,
    '/isssa-healthcare-program-v2.png',
    'Dr. Vivek Negi, Chief Medical Officer',
    6,
    'published',
    '2024-02-28T00:00:00+05:30'
  ),
  (
    'preparing-young-people-for-work',
    'Skills',
    'Preparing young people for work.',
    'Local Himalayan graduates completing industry technical certifications.',
    'Connecting mountain talent to digital livelihoods. Our vocational computer labs completed training for another cohort of 40 local girls and boys, focusing on office administration and software tools.',
    $$Himalayan youth frequently migrate to cities looking for basic manual labor due to a lack of technical training. ISSA’s Vocational Skill Labs seek to reverse this by offering certified computer literacy, accounting systems training, and basic software development directly in the hills. Working alongside regional industries, we help link top-performing graduates with remote data-entry and online administrative opportunities, allowing them to support their families without leaving their ancestral homes.$$,
    '/isssa-entrepreneurship-program-v2.png',
    'Rajesh Bist, Vocational Coordinator',
    5,
    'published',
    '2024-01-15T00:00:00+05:30'
  ),
  (
    'reclaiming-ancestral-water-bodies',
    'Communities',
    'Reclaiming ancestral water bodies.',
    'Restoring traditional village springs for reliable winter supply.',
    'Sustained climate disruptions dried out natural water tables. Working with local groups, we helped clean and secure three natural mountain springs, safeguarding supply for 80+ families.',
    $$In high altitudes, clean water relies on natural underground springs. Silt collection and climatic shifts have reduced output. By organizing local youth groups and funding safe masonry surrounds, we restored clean, constant supply to three farming hamlets. The water is tested regularly and filtered using local gravel filters to ensure purity.$$,
    '/isssa-story-water-v2.png',
    'Sohan Singh, Field Supervisor',
    3,
    'published',
    '2023-12-10T00:00:00+05:30'
  ),
  (
    'agniveer-physical-training-camp-2026',
    'Career & Opportunities',
    'अग्निवीर भर्ती तैयारी के लिए निःशुल्क शारीरिक प्रशिक्षण कैंप',
    'लिखित परीक्षा उत्तीर्ण युवाओं के लिए पाबौ और गैरसैंण में लगभग दो माह का प्रशिक्षण।',
    'ISSA Foundation अग्निवीर योजना की लिखित परीक्षा उत्तीर्ण कर चुके युवाओं के लिए भारतीय सेना भर्ती की तैयारी हेतु निःशुल्क शारीरिक प्रशिक्षण कैंप आयोजित कर रहा है।',
    $$नमस्कार सभी सदस्यों को,

ISSA Foundation द्वारा अग्निवीर योजना की लिखित परीक्षा उत्तीर्ण कर चुके युवाओं के लिए भारतीय सेना भर्ती की तैयारी हेतु निःशुल्क शारीरिक प्रशिक्षण कैंप आयोजित किया जा रहा है।

पिछले कैंप में 28 उम्मीदवार सफलतापूर्वक भारतीय सेना में भर्ती हुए थे। इसी उद्देश्य से इस वर्ष भी योग्य युवाओं को भर्ती तक प्रशिक्षण एवं मार्गदर्शन देने का प्रयास किया जा रहा है।

## कैंप स्थान

- पाबौ, पौड़ी गढ़वाल
- गैरसैंण, चमोली

**अवधि:** लगभग 2 माह

**भर्ती प्रक्रिया:** अक्टूबर 2026 के प्रथम सप्ताह से संभावित

आपसे अनुरोध है कि अपने आसपास ऐसे योग्य उम्मीदवारों तक यह जानकारी जरूर पहुँचाएँ, जिन्होंने अग्निवीर की लिखित परीक्षा उत्तीर्ण की है और भारतीय सेना में भर्ती होने की तैयारी कर रहे हैं।

हो सकता है आपके द्वारा साझा की गई यह जानकारी किसी युवा के सेना में जाने के सपने को साकार करने में मदद करे।

**पाबौ कैंप:** 7454954904

**गैरसैंण कैंप:** 7063917273$$,
    '/isssa-career-program-v2.png',
    'ISSA Foundation',
    3,
    'published',
    '2026-08-20T00:00:00+05:30'
  )
ON CONFLICT (slug) DO UPDATE SET
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content_markdown = EXCLUDED.content_markdown,
  cover_image_path = EXCLUDED.cover_image_path,
  author_name = EXCLUDED.author_name,
  reading_time_minutes = EXCLUDED.reading_time_minutes,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  updated_at = NOW();
