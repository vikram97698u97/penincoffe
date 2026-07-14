'use client';

import { useState, useEffect } from 'react';
import { Search, Compass, BookOpen, Star, RefreshCw } from 'lucide-react';
import Footer from '@/components/Footer';
import { PoemCard } from '@/components/ContentCards';
import { fdb as db } from '@/lib/firebaseDB';
import { Post } from '@/types/database';

const CATEGORIES = [
  'All',
  'Love',
  'Nature',
  'Healing',
  'Self Reflection',
  'Free Verse'
];

export default function PoetryIndex() {
  const [poems, setPoems] = useState<Post[]>([]);
  const [filteredPoems, setFilteredPoems] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadData() {
      const allPosts = await db.getPosts(false);
      setPoems(allPosts.filter(p => p.type === 'poem'));
    }
    loadData();
  }, [mounted]);

  useEffect(() => {
    let result = [...poems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(q) || 
             p.excerpt.toLowerCase().includes(q) || 
             p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    setFilteredPoems(result);
  }, [poems, searchQuery, selectedCategory]);

  return (
    <>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
            Ink & Stanzas
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-coffee-dark tracking-tight">
            Poetry
          </h1>
          <p className="text-sm font-serif italic text-coffee-light">
            Distraction-free stanzas captured in quiet hours. Simple reflections on love, healing, nature, and the self.
          </p>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-cream-dark p-6 rounded-lg border border-coffee-light/10 vintage-border shadow-sm w-full">
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-coffee-light/60">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search poems..."
              className="w-full pl-9 pr-4 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm text-coffee-dark placeholder-coffee-light/40"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
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

        {/* Poems Grid */}
        {filteredPoems.length === 0 ? (
          <div className="text-center py-20 bg-cream-dark/30 border border-dashed border-coffee-light/20 rounded-lg">
            <BookOpen className="h-10 w-10 text-coffee-light/35 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-coffee-dark">No poems found</h3>
            <p className="text-xs text-coffee-light mt-1 max-w-sm mx-auto">
              No stanzas match your filter. Try changing category tags or searching another keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPoems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
