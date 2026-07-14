'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Coffee, Heart, MessageSquare, Tag, Smile, X } from 'lucide-react';
import Footer from '@/components/Footer';
import { PostCard } from '@/components/ContentCards';
import { fdb as db } from '@/lib/firebaseDB';
import { Post } from '@/types/database';

const CATEGORIES = [
  'All',
  'Literary Fiction',
  'Romance',
  'Mystery',
  'Slice of Life',
  'Psychological',
  'Fantasy'
];

const MOODS = [
  'All',
  'Love',
  'Loss',
  'Hope',
  'Nature',
  'Healing',
  'Reflection'
];

function StoriesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [stories, setStories] = useState<Post[]>([]);
  const [filteredStories, setFilteredStories] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMood, setSelectedMood] = useState('All');
  
  // Reading Time range states (from query params or slider)
  const [minRead, setMinRead] = useState<number | null>(null);
  const [maxRead, setMaxRead] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize and load stories
  useEffect(() => {
    if (!mounted) return;
    async function loadData() {
      const allPosts = await db.getPosts(false);
      setStories(allPosts.filter(p => p.type === 'story'));
    }
    loadData();
  }, [mounted]);

  // Sync state from query parameters (specifically for the Coffee Menu selections)
  useEffect(() => {
    const minParam = searchParams.get('minRead');
    const maxParam = searchParams.get('maxRead');
    
    if (minParam) setMinRead(parseInt(minParam, 10));
    else setMinRead(null);

    if (maxParam) setMaxRead(parseInt(maxParam, 10));
    else setMaxRead(null);
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...stories];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s => s.title.toLowerCase().includes(q) || 
             s.excerpt.toLowerCase().includes(q) || 
             s.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(s => s.category === selectedCategory);
    }

    // Mood filter
    if (selectedMood !== 'All') {
      result = result.filter(s => s.mood === selectedMood);
    }

    // Reading time range filter (Coffee Menu)
    if (minRead !== null && maxRead !== null) {
      result = result.filter(s => s.readingTime >= minRead && s.readingTime <= maxRead);
    }

    setFilteredStories(result);
  }, [stories, searchQuery, selectedCategory, selectedMood, minRead, maxRead]);

  const clearReadingTimeFilter = () => {
    // Navigate away query params
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minRead');
    params.delete('maxRead');
    router.push(`/stories?${params.toString()}`);
  };

  const getCoffeeMenuLabel = () => {
    if (minRead === null || maxRead === null) return '';
    if (minRead === 1 && maxRead === 3) return 'Espresso';
    if (minRead === 3 && maxRead === 5) return 'Americano';
    if (minRead === 5 && maxRead === 10) return 'Cappuccino';
    if (minRead === 10 && maxRead === 20) return 'Latte';
    if (minRead === 20) return 'Mocha';
    return `${minRead}-${maxRead} min`;
  };

  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
          The Cup of Tales
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-coffee-dark tracking-tight">
          Stories
        </h1>
        <p className="text-sm font-serif italic text-coffee-light">
          Pull up a cozy chair, wrap your hands around a warm mug, and lose yourself in short fiction, romance, mysteries, and slices of life.
        </p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-cream-dark p-6 rounded-xl border border-coffee-light/10 space-y-6 vintage-border shadow-sm">
        
        {/* Search input and Selected Length display */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-coffee-light/60">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories by title, keyword, or tag..."
              className="w-full pl-9 pr-4 py-2.5 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm text-coffee-dark transition-all placeholder-coffee-light/40"
            />
          </div>

          {/* Coffee menu query status */}
          {minRead !== null && maxRead !== null && (
            <div className="flex items-center gap-2 bg-coffee-dark text-cream-light px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm animate-fade-in self-start md:self-auto border border-coffee-dark vintage-border">
              <Coffee className="h-3.5 w-3.5 text-terracotta" />
              <span>Selected Brew: {getCoffeeMenuLabel()} ({minRead === 20 ? '20m+' : `${minRead}-${maxRead} min`})</span>
              <button
                onClick={clearReadingTimeFilter}
                className="hover:text-terracotta transition-colors ml-1.5 p-0.5 rounded-full hover:bg-cream-light/15"
                title="Clear reading time filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Categories filters */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-widest text-coffee-light flex items-center gap-1.5">
            <Tag className="h-3 w-3 text-terracotta" />
            <span>Filter by Category</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                  selectedCategory === cat
                    ? 'bg-coffee-dark text-cream-light border-coffee-dark shadow-sm'
                    : 'bg-cream-light text-coffee-light border-coffee-light/25 hover:border-coffee-light/40 hover:text-coffee-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mood filters */}
        <div className="space-y-2 pt-2 border-t border-coffee-light/5">
          <p className="text-[10px] uppercase font-bold tracking-widest text-coffee-light flex items-center gap-1.5">
            <Smile className="h-3 w-3 text-terracotta" />
            <span>Filter by Mood</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMood(m)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedMood === m
                    ? 'bg-terracotta text-cream-light border-terracotta shadow-sm'
                    : 'bg-cream-light text-coffee-light border-coffee-light/20 hover:border-coffee-light/40 hover:text-coffee-dark'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* STORY LIST GRID */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-20 bg-cream-dark/30 border border-dashed border-coffee-light/20 rounded-lg">
          <Coffee className="h-10 w-10 text-coffee-light/35 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-coffee-dark">No stories found</h3>
          <p className="text-xs text-coffee-light mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting different categories, or clearing the reading length filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <PostCard key={story.id} post={story} />
          ))}
        </div>
      )}

    </div>
  );
}

export default function Stories() {
  return (
    <>
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={
          <div className="flex items-center justify-center py-24">
            <Coffee className="h-8 w-8 text-coffee-light animate-spin" />
            <span className="text-sm font-serif italic text-coffee-light ml-2">Brewing list...</span>
          </div>
        }>
          <StoriesContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
