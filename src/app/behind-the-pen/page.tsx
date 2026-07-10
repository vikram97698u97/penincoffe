'use client';

import { Calendar, BookOpen, Award, Compass, Feather, Book } from 'lucide-react';
import Footer from '@/components/Footer';
import { BookCard } from '@/components/ContentCards';
import { fdb as db } from '@/lib/firebaseDB';
import { useState, useEffect } from 'react';
import { Settings } from '@/types/database';

export default function BehindThePen() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    db.getSettings().then(setSettings);
  }, []);

  if (!settings) return (
    <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[50vh]">
      <p className="font-serif italic text-coffee-light">Loading...</p>
    </main>
  );

  const bookshelf = settings.bookshelf || [];
  const timeline = settings.timeline || [];

  return (
    <>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* HERO HEADER */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-coffee-light/10 pb-12">
          {/* Author avatar */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-coffee-dark shadow-lg p-2.5 bg-cream-dark vintage-border">
              <img
                src={settings.authorImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'}
                alt={`${settings.authorName} avatar`}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          </div>
          {/* Biography */}
          <div className="md:col-span-8 space-y-4 text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
              About the Creator
            </span>
            <h1 className="font-serif text-4xl font-bold text-coffee-dark tracking-tight">
              {settings.authorName}
            </h1>
            <p className="font-serif text-lg italic text-coffee-light leading-relaxed">
              "{settings.authorBio}"
            </p>
            {settings.authorBlurb && (
              <p className="text-sm text-coffee-light/95 leading-relaxed font-serif max-w-2xl">
                {settings.authorBlurb}
              </p>
            )}
            {settings.authorTagline && (
              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3 text-xs text-coffee-light font-bold uppercase tracking-wider">
                {settings.authorTagline.split('·').map((tag, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i === 0 ? <Feather className="h-4.5 w-4.5 text-terracotta" /> : <Book className="h-4.5 w-4.5 text-terracotta" />}
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* DETAILS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left panel: Philosophy & Motivation */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
                <Compass className="h-5 w-5 text-terracotta" />
                <span>Why I Started Writing</span>
              </h2>
              <p className="text-sm font-serif italic text-coffee-dark/95 leading-relaxed whitespace-pre-line pl-1">
                {settings.whyStartedText || `Writing was never a choice for me; it was a survival mechanism. Growing up in crowded cities, I always felt the rush of words in my chest that had no mouth. 

I bought my first typewriter at sixteen—a heavy metal Remington that clattered like a train. In that clatter, I found my voice. I realized that putting words onto a page changes their temperature. It takes the fire out of anger and the ice out of grief, turning them into something warm and shareable. 

I designed "Pen in Coffee" because the modern web has become too fast, too loud, and too commercialized. We need a digital coffeehouse where we can write for truth, not clicks.`}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
                <Feather className="h-5 w-5 text-terracotta" />
                <span>My Writing Philosophy</span>
              </h2>
              <p className="text-sm font-serif italic text-coffee-dark/95 leading-relaxed whitespace-pre-line pl-1">
                {settings.aboutPhilosophy}
                
                Every sentence should be brewed at its own pace. Sometimes a story needs to sit in a dark drawer for months before it is ready to be tasted. We must respect the process and give ourselves permission to write terrible first drafts, just as we must dump out the sour first pour-over to refine the grind.
              </p>
            </div>

            {/* Bookshelf */}
            {bookshelf.length > 0 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-terracotta" />
                  <span>Books that Shaped Me</span>
                </h2>
                <div className="space-y-4">
                  {bookshelf.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Timeline & Achievements */}
          <div className="lg:col-span-5 space-y-10">
            {/* Timeline */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-terracotta" />
                <span>My Journey Timeline</span>
              </h2>
              
              <div className="space-y-6 pl-4 border-l border-coffee-light/20 relative">
                {timeline.map((event) => (
                  <div key={event.id} className="space-y-1 relative">
                    {/* Bullet */}
                    <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full bg-terracotta border border-cream-light" />
                    <span className="text-[10px] font-bold text-terracotta uppercase">{event.year}</span>
                    <h4 className="font-serif text-sm font-bold text-coffee-dark">{event.title}</h4>
                    <p className="text-xs font-serif text-coffee-light italic leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            {((settings.publications && settings.publications.length > 0) || !settings.publications) && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-terracotta" />
                  <span>Selected Publications</span>
                </h2>
                <ul className="space-y-4 text-xs font-serif italic text-coffee-light pl-1">
                  {(settings.publications || [
                    { id: 'pub1', title: 'The Warmth of Autumn Coffee', source: 'Leaves Literary Review', year: '2022' },
                    { id: 'pub2', title: 'Silent Keyboards and Ink Stains', source: 'Pushcart Prize Nominee for Creative Non-Fiction', year: '2023' },
                    { id: 'pub3', title: 'Typewriter Ribbons in Prague', source: 'Anthology of slow-writing essayists', year: '2024' }
                  ]).map((pub) => (
                    <li key={pub.id} className="border-l-2 border-terracotta pl-3">
                      <p className="font-bold text-coffee-dark">"{pub.title}"</p>
                      <p className="text-[10px] text-coffee-light font-sans font-bold uppercase mt-0.5">
                        {pub.source}, {pub.year}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
