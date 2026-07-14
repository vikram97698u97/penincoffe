'use client';

import { useState, useEffect } from 'react';
import { Calendar, Coffee, Mail } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import NewsletterForm from '@/components/NewsletterForm';
import { fdb as db } from '@/lib/firebaseDB';
import { Post } from '@/types/database';

export default function WeeklyBrewIndex() {
  const [brews, setBrews] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadData() {
      const allBrews = await db.getPosts(false);
      setBrews(allBrews.filter(p => p.type === 'weekly-brew'));
    }
    loadData();
  }, [mounted]);

  return (
    <>

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
            Sunday Letters
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-coffee-dark tracking-tight">
            The Weekly Brew Archive
          </h1>
          <p className="text-sm font-serif italic text-coffee-light">
            Every Sunday morning, I sit down with a fresh mug of coffee and write a letter to my readers: what happened, what I learned, what I read, and a question to ponder.
          </p>
        </div>

        {/* Brew Letters timeline list */}
        {brews.length === 0 ? (
          <div className="text-center py-20 bg-cream-dark/30 border border-dashed border-coffee-light/20 rounded-lg">
            <Mail className="h-10 w-10 text-coffee-light/35 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-coffee-dark">No weekly brews yet</h3>
            <p className="text-xs text-coffee-light mt-1">
              Check back on Sunday morning for the first edition.
            </p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 sm:before:left-1/2 before:w-[1px] before:bg-coffee-light/20">
            {brews.map((brew, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={brew.id}
                  className={`flex flex-col sm:flex-row items-stretch sm:justify-between relative ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 w-3 h-3 bg-terracotta rounded-full border-2 border-cream-light z-10 top-6" />

                  {/* Spacer for desktop alignment */}
                  <div className="hidden sm:block w-[46%]" />

                  {/* Card content */}
                  <div className="w-full sm:w-[46%] pl-10 sm:pl-0">
                    <div className="bg-cream-dark border border-coffee-light/10 p-6 rounded-lg vintage-border space-y-4 hover:scale-[1.01] transition-transform">
                      <div className="flex items-center gap-1.5 text-xs text-coffee-light">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {mounted ? new Date(brew.createdAt).toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : ''}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-coffee-dark hover:text-terracotta transition-colors">
                        <Link href={`/weekly-brew/${brew.slug}`}>{brew.title}</Link>
                      </h3>

                      <p className="text-xs font-serif italic text-coffee-light line-clamp-3 leading-relaxed">
                        "{brew.excerpt}"
                      </p>

                      <div className="pt-2 flex justify-between items-center border-t border-coffee-light/5 text-xs">
                        <Link
                          href={`/weekly-brew/${brew.slug}`}
                          className="font-bold text-coffee-dark hover:text-terracotta uppercase tracking-wider transition-colors"
                        >
                          Read Letter →
                        </Link>
                        <span className="flex items-center gap-1 text-[10px] text-coffee-light">
                          <Coffee className="h-3 w-3" />
                          {brew.readingTime}m read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Newsletter Signup Box */}
        <NewsletterForm />
      </main>

      <Footer />
    </>
  );
}
