'use client';

import { useState, useEffect } from 'react';
import { Search, FileText } from 'lucide-react';
import { ArticleCard } from '@/components/ContentCards';
import { fdb as db } from '@/lib/firebaseDB';
import { Post } from '@/types/database';

const CATEGORIES = [
  'All',
  'Technology',
  'Lifestyle',
  'Coffee',
  'Business',
  'Travel',
  'Food',
  'Guides',
  'Reviews',
  'Opinion',
  'News'
];

export default function ArticlesIndexPage() {
  const [articles, setArticles] = useState<Post[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadData() {
      const allPosts = await db.getPosts(false);
      const articleList = allPosts.filter(p => p.type === 'article' || p.type === 'poem');
      setArticles(articleList);
    }
    loadData();
  }, []);

  useEffect(() => {
    let result = [...articles];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(q) || 
             p.excerpt.toLowerCase().includes(q) || 
             (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
             (p.authorName && p.authorName.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    setFilteredArticles(result);
  }, [articles, searchQuery, selectedCategory]);

  return (
    <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
          Thoughts & Perspectives
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-coffee-dark tracking-tight">
          Articles
        </h1>
        <p className="text-sm font-serif italic text-coffee-light">
          Deep dives into technology, lifestyle, coffee culture, and modern life. Read, explore, and get inspired.
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
            placeholder="Search articles..."
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

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-cream-dark/50 rounded-lg border border-coffee-light/10 space-y-3">
          <FileText className="h-10 w-10 text-coffee-light mx-auto opacity-50" />
          <p className="text-coffee-light font-serif italic">No articles found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
