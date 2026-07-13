'use client';

import { BookOpen, Compass, Feather, Book, Coffee, Map } from 'lucide-react';
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

  return (
    <>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* HERO HEADER - Without Picture */}
        <section className="text-center border-b border-coffee-light/10 pb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Behind the Pen
          </span>
          <h1 className="font-serif text-4xl font-bold text-coffee-dark tracking-tight mb-4">
            {settings.authorName}
          </h1>
          <p className="font-serif text-lg italic text-coffee-light leading-relaxed max-w-2xl mx-auto">
            "{settings.authorBio}"
          </p>
          {settings.authorBlurb && (
            <p className="text-sm text-coffee-light/95 leading-relaxed font-serif max-w-2xl mx-auto mt-4">
              {settings.authorBlurb}
            </p>
          )}
          {settings.authorTagline && (
            <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs text-coffee-light font-bold uppercase tracking-wider">
              {settings.authorTagline.split('·').map((tag, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i === 0 ? <Feather className="h-4.5 w-4.5 text-terracotta" /> : <Book className="h-4.5 w-4.5 text-terracotta" />}
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* NEW SECTIONS */}
        <div className="space-y-12">
          {/* What You Will Find Here */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
              <Compass className="h-5 w-5 text-terracotta" />
              <span>What You Will Find Here</span>
            </h2>
            <p className="text-sm font-serif italic text-coffee-dark/95 leading-relaxed whitespace-pre-line pl-1">
              {settings.whatYouWillFindHere || `Welcome to a space where words are brewed slowly and deliberately. Here you'll find essays that explore the quiet corners of life, poetry that captures fleeting moments, and reflections on the art of slow writing in a fast world.`}
            </p>
          </div>

          {/* Before You Read */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-terracotta" />
              <span>Before You Read</span>
            </h2>
            <p className="text-sm font-serif italic text-coffee-dark/95 leading-relaxed whitespace-pre-line pl-1">
              {settings.beforeYouRead || `These pieces are meant to be savored, not scrolled through. Take your time. Let the words settle. Some may resonate immediately, others may need time to breathe. That's entirely okay.`}
            </p>
          </div>

          {/* My Writing Ritual */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
              <Coffee className="h-5 w-5 text-terracotta" />
              <span>My Writing Ritual</span>
            </h2>
            <p className="text-sm font-serif italic text-coffee-dark/95 leading-relaxed whitespace-pre-line pl-1">
              {settings.writingRitual || `Every morning, I grind fresh beans—the ritual of preparing coffee mirrors the ritual of preparing words. I write in longhand first, letting the ink flow without judgment. Only when the piece feels complete does it move to the screen. This slow process is essential to the work.`}
            </p>
          </div>

          {/* My Journey */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
              <Map className="h-5 w-5 text-terracotta" />
              <span>My Journey</span>
            </h2>
            <p className="text-sm font-serif italic text-coffee-dark/95 leading-relaxed whitespace-pre-line pl-1">
              {settings.myJourney || `The path hasn't been linear. There were years of silence, years of doubt, and years of writing in obscurity. Each phase taught something valuable about patience and persistence. This platform is the culmination of those lessons—a place where slow writing can find its audience.`}
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

      </main>

      <Footer />
    </>
  );
}
