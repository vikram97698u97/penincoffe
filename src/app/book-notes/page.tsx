'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, Star, Bookmark } from 'lucide-react';
import Footer from '@/components/Footer';
import { PostCard, BookCard } from '@/components/ContentCards';
import { fdb as db } from '@/lib/firebaseDB';
import { Post, Settings } from '@/types/database';

const NOTE_CATEGORIES = [
  'All',
  'Favorite Quotes',
  'Lessons Learned',
  'Character Analysis',
  'Books That Changed Me',
  'Reading Wrap-Ups'
];

export default function BookNotesIndex() {
  const [notes, setNotes] = useState<Post[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    async function loadData() {
      const allNotes = await db.getPosts(false);
      setNotes(allNotes.filter(p => p.type === 'book-note'));
      const s = await db.getSettings();
      setSettings(s);
    }
    loadData();
  }, []);

  const bookshelf = settings?.bookshelf || [];

  useEffect(() => {
    let result = [...notes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        n => n.title.toLowerCase().includes(q) || 
             n.excerpt.toLowerCase().includes(q) || 
             n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(n => n.category === selectedCategory);
    }

    setFilteredNotes(result);
  }, [notes, searchQuery, selectedCategory]);

  return (
    <>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
            Literary Compendium
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-coffee-dark tracking-tight">
            Book Notes
          </h1>
          <p className="text-sm font-serif italic text-coffee-light">
            Marginalia, highlights, key lessons, and personal reflections on books that shape thoughts, stories, and days.
          </p>
        </div>

        {/* BOOKSHELF SECTION */}
        {bookshelf.length > 0 && (
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-terracotta" />
              <span>Aria's Digital Bookshelf</span>
            </h2>
            <p className="text-xs text-coffee-light max-w-xl font-serif italic leading-relaxed">
              These are the physical volumes currently sitting on my bedside table, annotated in graphite and ink.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bookshelf.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* REFLECTIONS & FILTERS */}
        <section className="space-y-8">
          <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-terracotta" />
            <span>Reflections & Summaries</span>
          </h2>

          {/* Search & Categories */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-cream-dark p-6 rounded-lg border border-coffee-light/10 vintage-border w-full">
            <div className="relative w-full lg:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-coffee-light/60">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search book reflections..."
                className="w-full pl-9 pr-4 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm text-coffee-dark placeholder-coffee-light/40"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 w-full lg:w-auto">
              {NOTE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                    selectedCategory === cat
                      ? 'bg-coffee-dark text-cream-light border-coffee-dark shadow-sm'
                      : 'bg-cream-light text-coffee-light border-coffee-light/20 hover:border-coffee-light/40 hover:text-coffee-dark'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-20 bg-cream-dark/30 border border-dashed border-coffee-light/20 rounded-lg">
              <BookOpen className="h-10 w-10 text-coffee-light/35 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-coffee-dark">No book notes found</h3>
              <p className="text-xs text-coffee-light mt-1 max-w-sm mx-auto">
                No reflections match this query. Try clearing filters or typing another book title.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {filteredNotes.map((note) => (
                <PostCard key={note.id} post={note} />
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </>
  );
}
