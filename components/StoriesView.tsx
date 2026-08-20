'use client';

import React from 'react';
import BlurImage from './BlurImage';
import { Calendar, Clock, ArrowRight, BookOpen, Search, CheckCircle2 } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-types';

export default function StoriesView({ journals }: { journals: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [readingStory, setReadingStory] = React.useState<any | null>(null);

  const filteredJournals = journals.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-24 bg-neutral-50 font-sans" id="stories-view">
      {/* HERO SECTION */}
      <section className="bg-teal-brand text-white pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E8B94C_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden="true"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
      <p className="text-xs uppercase tracking-widest text-accent font-sans font-bold">Program Stories</p>
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
              placeholder="Search program stories..."
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
              key={story.slug}
              id={
                `story-${story.slug}`
              }
              className="bg-white rounded-3xl overflow-hidden border border-neutral-200/60 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                  <BlurImage 
                    src={story.coverImagePath}
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
                      {story.displayDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {story.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary group-hover:text-rust transition-colors leading-snug">
                    {story.title}
                  </h3>
                  
                  <p className="text-xs uppercase tracking-widest text-rust font-sans font-bold">
                    {story.subtitle}
                  </p>

                  <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                    {story.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-8 pb-8 pt-2 flex items-center justify-between border-t border-neutral-100 mt-4">
                <span className="text-xs font-semibold text-neutral-500 italic">By {story.authorName}</span>
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
                <span>Published: {readingStory.displayDate}</span>
                <span>•</span>
                <span>Estimate: {readingStory.readingTimeMinutes} min read</span>
                <span>•</span>
                <span>Report by: {readingStory.authorName}</span>
              </div>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden relative">
                <BlurImage 
                  src={readingStory.coverImagePath}
                  alt={readingStory.title} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-sm text-neutral-700 leading-relaxed font-sans space-y-4 pt-2">
                <p className="font-semibold text-primary">{readingStory.excerpt}</p>
                <p>{readingStory.content}</p>
                <p className="text-xs text-neutral-500 italic bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  Transparency Notice: All reports published in ISSA Journals represent verified local initiatives. Budgets, materials, and participant indices are available to approved program sponsors.
                </p>
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
        No program stories match these filters. Try another category.
      </div>
    );
  }
  return null;
}
