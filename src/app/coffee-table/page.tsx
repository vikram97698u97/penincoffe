'use client';

import { useState, useEffect } from 'react';
import { QuoteCard } from '@/components/ContentCards';
import Footer from '@/components/Footer';
import { fdb as db } from '@/lib/firebaseDB';
import { CoffeeTableItem } from '@/types/database';
import { Coffee, Search, PlusCircle, MessageSquare } from 'lucide-react';

const FILTER_TYPES = [
  { value: 'All', label: 'All Board' },
  { value: 'quote', label: 'Quotes I Love' },
  { value: 'prompt', label: 'Writing Prompts' },
  { value: 'song', label: 'Songs on Repeat' },
  { value: 'photo', label: 'Photos & Moments' },
  { value: 'observation', label: 'Tiny Observations' }
];

export default function CoffeeTable() {
  const [boardItems, setBoardItems] = useState<CoffeeTableItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CoffeeTableItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      setBoardItems(await db.getCoffeeTable());
    }
    loadData();
  }, []);

  useEffect(() => {
    let result = [...boardItems];

    if (selectedFilter !== 'All') {
      result = result.filter(item => item.type === selectedFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        item => item.content.toLowerCase().includes(q) || 
                item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    setFilteredItems(result);
  }, [boardItems, selectedFilter, searchQuery]);

  return (
    <>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
            Inspiration Board
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-coffee-dark tracking-tight">
            The Coffee Table
          </h1>
          <p className="text-sm font-serif italic text-coffee-light">
            A scattering of notes, quotes, songwriting, polaroids, and tiny thoughts that caught my attention today.
          </p>
        </div>

        {/* Board Controls */}
        <div className="bg-cream-dark p-6 rounded-xl border border-coffee-light/10 space-y-4 vintage-border shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
              {FILTER_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedFilter(type.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedFilter === type.value
                      ? 'bg-coffee-dark text-cream-light border-coffee-dark shadow-sm'
                      : 'bg-cream-light text-coffee-light border-coffee-light/20 hover:border-coffee-light/40 hover:text-coffee-dark'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Search query */}
            <div className="relative w-full md:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-coffee-light/60">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search table board..."
                className="w-full pl-9 pr-4 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm text-coffee-dark placeholder-coffee-light/40"
              />
            </div>
          </div>
        </div>

        {/* MASONRY GRID LAYOUT */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-cream-dark/30 border border-dashed border-coffee-light/20 rounded-lg">
            <Coffee className="h-10 w-10 text-coffee-light/35 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-coffee-dark">Nothing on the table</h3>
            <p className="text-xs text-coffee-light mt-1">
              No items match this filter category or search keyword.
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_auto] w-full">
            {filteredItems.map((item) => (
              <QuoteCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
