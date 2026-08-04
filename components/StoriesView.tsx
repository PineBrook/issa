'use client';

import React from 'react';
import BlurImage from './BlurImage';
import { Calendar, Clock, ArrowRight, BookOpen, Share2, Search, CheckCircle2 } from 'lucide-react';

export default function StoriesView() {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [readingStory, setReadingStory] = React.useState<any | null>(null);

  const journals = [
    {
      id: 1,
      category: 'Education',
      date: 'March 14, 2024',
      readTime: '4 min read',
      title: 'Digital empowerment in remote Pauri.',
      subtitle: 'Bringing computer education to over 350 rural students.',
      desc: 'Our latest smart classroom cluster is official. In partnership with school authorities, we successfully completed the installation of five interactive smart boards and high-capacity computers. Students now engage in daily interactive coding modules and video-lectures.',
      fullContent: 'For years, students in high-altitude Pauri Garhwal had minimal exposure to digital infrastructure. Traditional blackboard teaching was the only pedagogical mode. Today, with the collaboration of village heads and government school boards, ISSA has equipped three high-altitude clusters with interactive satellite-connected classrooms. The response is unprecedented: student retention rates rose by 84%, and children frequently remain after school to explore digital map tools, code logic puzzles, and science videos.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800',
      author: 'Aarti Rawat, Education Lead'
    },
    {
      id: 2,
      category: 'Healthcare',
      date: 'February 28, 2024',
      readTime: '6 min read',
      title: 'Reaching the unreachable peaks.',
      subtitle: 'Free medical camps delivering diagnostic checkups.',
      desc: 'Healthcare in high altitudes is often a luxury. This month, our mobile clinics visited three remote hamlets, bringing custom dental checkup rigs, vision scanners, and physical therapy aids directly to elder community weavers.',
      fullContent: 'Due to severe weather and steep terrain, seniors and children in remote Uttarakhand often postpone essential healthcare needs. ISSA’s Mobile Medical Camps provide on-site diagnostics, dental procedures, and optical prescriptions completely free of cost. Our team travels up to 40 kilometers off-paved roads to reach isolated villages. During this camp, over 300 individuals were screened, and 45 advanced cataract patients were scheduled for free transport and surgery at our partner hospital.',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800',
      author: 'Dr. Vivek Negi, Chief Medical Officer'
    },
    {
      id: 3,
      category: 'Skills',
      date: 'January 15, 2024',
      readTime: '5 min read',
      title: 'Future-proofing youth skills.',
      subtitle: 'Local Himalayan graduates completing industry technical certifications.',
      desc: 'Connecting mountain talent to digital livelihoods. Our vocational computer labs completed training for another cohort of 40 local girls and boys, focusing on office administration and software tools.',
      fullContent: 'Himalayan youth frequently migrate to cities looking for basic manual labor due to a lack of technical training. ISSA’s Vocational Skill Labs seek to reverse this by offering certified computer literacy, accounting systems training, and basic software development directly in the hills. Working alongside regional industries, we help link top-performing graduates with remote data-entry and online administrative opportunities, allowing them to support their families without leaving their ancestral homes.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800',
      author: 'Rajesh Bist, Vocational Coordinator'
    },
    {
      id: 4,
      category: 'Communities',
      date: 'December 10, 2023',
      readTime: '3 min read',
      title: 'Reclaiming ancestral water bodies.',
      subtitle: 'Restoring traditional village springs for reliable winter supply.',
      desc: 'Sustained climate disruptions dried out natural water tables. Working with local groups, we helped clean and secure three natural mountain springs, safeguarding supply for 80+ families.',
      fullContent: 'In high altitudes, clean water relies on natural underground springs. Silt collection and climatic shifts have reduced output. By organizing local youth groups and funding safe masonry surrounds, we restored clean, constant supply to three farming hamlets. The water is tested regularly and filtered using local gravel filters to ensure purity.',
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800',
      author: 'Sohan Singh, Field Supervisor'
    }
  ];

  const filteredJournals = journals.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-24 bg-neutral-50 font-sans" id="stories-view">
      {/* HERO SECTION */}
      <section className="bg-teal-brand text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-widest text-accent font-sans font-bold">Field Journals</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
              Stories of <span className="italic font-normal text-accent">change.</span>
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed font-light">
              Direct dispatches, technical studies, and personal experiences from our educators, medical professionals, and local community organizers.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-200 pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {['all', 'education', 'healthcare', 'skills', 'communities'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-accent shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-primary border border-neutral-200'
                }`}
              >
                {cat === 'all' ? 'All Dispatches' : cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search field reports..."
              className="w-full bg-white border border-neutral-200 rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
      </section>

      {/* JOURNAL LISTING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredArticlesCount(filteredJournals)}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          {filteredJournals.map((story) => (
            <article 
              key={story.id}
              id={
                story.id === 1 ? 'story-digital-pauri' :
                story.id === 2 ? 'story-medical-peaks' :
                story.id === 3 ? 'story-youth-skills' :
                story.id === 4 ? 'story-water-bodies' :
                `story-${story.id}`
              }
              className="bg-white rounded-3xl overflow-hidden border border-neutral-200/60 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                  <BlurImage 
                    src={story.image} 
                    alt={story.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-sans uppercase tracking-widest px-3 py-1.5 rounded-full font-bold">
                    {story.category}
                  </span>
                </div>

                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4 text-xs text-neutral-400 font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {story.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {story.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary group-hover:text-rust transition-colors leading-snug">
                    {story.title}
                  </h3>
                  
                  <p className="text-xs uppercase tracking-widest text-rust font-sans font-bold">
                    {story.subtitle}
                  </p>

                  <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                    {story.desc}
                  </p>
                </div>
              </div>

              <div className="px-8 pb-8 pt-2 flex items-center justify-between border-t border-neutral-100 mt-4">
                <span className="text-xs font-semibold text-neutral-500 italic">By {story.author}</span>
                <button
                  onClick={() => setReadingStory(story)}
                  className="text-xs font-bold text-primary hover:text-rust transition-colors flex items-center gap-1 cursor-pointer"
                >
                  READ REPORT <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* DETAILED JOURNAL READING MODAL DRAWER */}
      {readingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-neutral-200 p-8 sm:p-10 relative">
            <button
              onClick={() => setReadingStory(null)}
              className="absolute top-4 right-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-6">
              <span className="bg-primary/10 text-primary px-3 py-1 text-[9px] font-sans font-bold uppercase tracking-widest rounded-full inline-block">
                {readingStory.category}
              </span>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary leading-tight">{readingStory.title}</h2>
                <p className="text-sm text-rust font-sans uppercase tracking-wider font-bold">{readingStory.subtitle}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-neutral-400 font-sans py-2 border-y border-neutral-100">
                <span>Published: {readingStory.date}</span>
                <span>•</span>
                <span>Estimate: {readingStory.readTime}</span>
                <span>•</span>
                <span>Report by: {readingStory.author}</span>
              </div>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden relative">
                <BlurImage 
                  src={readingStory.image} 
                  alt={readingStory.title} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-sm text-neutral-700 leading-relaxed font-sans space-y-4 pt-2">
                <p className="font-semibold text-primary">{readingStory.desc}</p>
                <p>{readingStory.fullContent}</p>
                <p className="text-xs text-neutral-500 italic bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  Transparency Notice: All reports published in ISSA Journals represent verified local initiatives. Budgets, materials, and participant indices are available to approved program sponsors.
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => {
                    alert('Share link copied to clipboard.');
                  }}
                  className="bg-primary hover:bg-primary-light text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function filteredArticlesCount(list: any[]) {
  if (list.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-400 font-sans text-xs">
        No field journals found matching the filters. Try another tab!
      </div>
    );
  }
  return null;
}
