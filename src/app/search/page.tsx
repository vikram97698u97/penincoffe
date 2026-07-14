'use client';

import { useState, useEffect } from 'react';
import { Search, Compass, BookOpen, Coffee, MessageSquare, Heart } from 'lucide-react';
import Footer from '@/components/Footer';
import { PostCard, PoemCard } from '@/components/ContentCards';
import { fdb as db } from '@/lib/firebaseDB';
import { Post } from '@/types/database';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'story' | 'poem' | 'book-note' | 'weekly-brew'>('all');
  const [results, setResults] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadData() {
      const allPosts = await db.getPosts(false);
      
      let filtered = allPosts;
      
      if (selectedType !== 'all') {
        filtered = filtered.filter(p => p.type === selectedType);
      }
      
      if (query.trim()) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          p => p.title.toLowerCase().includes(q) || 
               p.excerpt.toLowerCase().includes(q) || 
               p.tags.some(t => t.toLowerCase().includes(q))
        );
      } else {
        // If no query, show nothing or everything?
        // Let's show everything to make it a browse page as well!
      }

      setResults(filtered);
    }
    loadData();
  }, [query, selectedType, mounted]);

  return (
    <>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
            Global Search
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-coffee-dark tracking-tight">
            Search the Journal
          </h1>
          <p className="text-sm font-serif italic text-coffee-light">
            Search across stories, poetry, book reflections, and Sunday brews. Find the stanzas and sentences you need.
          </p>
        </div>

        {/* Search input box */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-coffee-light/60">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by titles, themes, tags (e.g. self-love, midnight, hope)..."
              className="w-full pl-11 pr-4 py-3.5 bg-cream-dark border border-coffee-light/20 rounded-lg focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm text-coffee-dark transition-all placeholder-coffee-light/35 shadow-inner"
            />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {[
              { type: 'all', label: 'All Content' },
              { type: 'story', label: 'Stories' },
              { type: 'poem', label: 'Poetry' },
              { type: 'book-note', label: 'Book Notes' },
              { type: 'weekly-brew', label: 'Weekly Brews' }
            ].map((btn) => (
              <button
                key={btn.type}
                onClick={() => setSelectedType(btn.type as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedType === btn.type
                    ? 'bg-coffee-dark text-cream-light border-coffee-dark'
                    : 'bg-cream-light text-coffee-light border-coffee-light/10 hover:border-coffee-light/25 hover:text-coffee-dark'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="border-b border-coffee-light/10 pb-3 flex justify-between items-baseline">
            <h2 className="font-serif text-2xl font-bold">Search Results</h2>
            <span className="text-xs text-coffee-light font-medium">{results.length} items found</span>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-20 bg-cream-dark/30 border border-dashed border-coffee-light/20 rounded-lg max-w-lg mx-auto">
              <Compass className="h-10 w-10 text-coffee-light/35 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-coffee-dark">No matches found</h3>
              <p className="text-xs text-coffee-light mt-1">
                Try using simpler search terms, checking spelling, or expanding type filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((post) => {
                if (post.type === 'poem') {
                  return <PoemCard key={post.id} poem={post} />;
                }
                return <PostCard key={post.id} post={post} />;
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
