'use client';

import { useState, useEffect } from 'react';
import { MailOpen, Check, Heart, Feather, AlertCircle } from 'lucide-react';
import Footer from '@/components/Footer';
import { LetterCard } from '@/components/ContentCards';
import { fdb as db } from '@/lib/firebaseDB';
import { Letter } from '@/types/database';

const CATEGORY_OPTIONS = [
  { value: 'confessions', label: 'Confession' },
  { value: 'regrets', label: 'Regret' },
  { value: 'dreams', label: 'Dream' },
  { value: 'thank-you', label: 'Thank You' },
  { value: 'goodbyes', label: 'Goodbye' }
];

export default function LettersToStrangers() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [filteredLetters, setFilteredLetters] = useState<Letter[]>([]);
  
  // Tab states: 'all' | 'replied'
  const [activeTab, setActiveTab] = useState<'all' | 'replied'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Form states
  const [nickname, setNickname] = useState('');
  const [category, setCategory] = useState<any>('confessions');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const loadLetters = async () => {
    // Load approved letters
    setLetters(await db.getLetters(false));
  };

  useEffect(() => {
    loadLetters();
  }, [submitted]);

  useEffect(() => {
    let result = [...letters];

    // Filter by tab
    if (activeTab === 'replied') {
      result = result.filter(l => l.reply !== undefined && l.reply.trim() !== '');
    }

    // Filter by Category
    if (selectedCategoryFilter !== 'All') {
      result = result.filter(l => l.category === selectedCategoryFilter);
    }

    setFilteredLetters(result);
  }, [letters, activeTab, selectedCategoryFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !message.trim()) {
      setError('Please fill in both a nickname and a message.');
      return;
    }

    if (message.length < 10) {
      setError('Your letter is a bit short. Share a few more words with the stranger.');
      return;
    }

    setError('');
    await db.addLetter({
      nickname: nickname.trim(),
      category,
      message: message.trim()
    });

    setSubmitted(true);
    setNickname('');
    setCategory('confessions');
    setMessage('');

    // Reload list (though it's unapproved, so it won't show up yet - which is correct!)
    await loadLetters();

    setTimeout(() => {
      setSubmitted(false);
    }, 8000);
  };

  return (
    <>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
            Signature Sanctuary
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-coffee-dark tracking-tight">
            Letters to Strangers
          </h1>
          <p className="text-sm font-serif italic text-coffee-light">
            A safe, anonymous mailbox for the words you carry. Submit a confession, a regret, a dream, a goodbye, or a simple thank you. I read them all, and reply to those that cry out for a gentle answer.
          </p>
        </div>

        {/* Double Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Submission Form (Lined notepad sliding out) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
              <Feather className="h-5 w-5 text-terracotta" />
              <span>Write to a Stranger</span>
            </h2>

            <div className="bg-amber-50/50 p-6 rounded-lg border border-coffee-light/25 relative shadow-md vintage-border">
              {/* Card top binding decor */}
              <div className="absolute top-0 left-0 w-full h-3 bg-coffee-light/20 rounded-t-md" />

              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-fade-in">
                  <div className="h-12 w-12 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto border border-sage/20">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-coffee-dark">Letter Slipped in Mailbox</h3>
                  <p className="text-xs text-coffee-light font-serif italic max-w-xs mx-auto leading-relaxed">
                    "Thank you, traveler. Your letter has been sealed and placed in the drawer. To protect this sanctuary, letters go through approval. If approved, it will appear in the stranger's archive."
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[10px] uppercase font-bold text-terracotta hover:underline mt-4"
                  >
                    Write another letter
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                  {/* Nickname */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-coffee-light block">
                      Stranger's Nickname
                    </label>
                    <input
                      type="text"
                      required
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="e.g., Lonely Sparrow, Stargazer..."
                      className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark placeholder-coffee-light/30"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-coffee-light block">
                      Select Letter Category
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setCategory(opt.value)}
                          className={`p-2 rounded text-xs font-semibold border flex items-center justify-center transition-all ${
                            category === opt.value
                              ? 'bg-coffee-dark text-cream-light border-coffee-dark'
                              : 'bg-cream-light text-coffee-light border-coffee-light/10 hover:border-coffee-light/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message content */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-coffee-light block">
                      Your Sealed Words
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setError('');
                      }}
                      placeholder="Write what you can't say out loud. Pour your heart onto this paper..."
                      className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark font-serif italic placeholder-coffee-light/30 leading-relaxed border-t-0 border-r-0 border-l-0 border-b border-dashed border-coffee-light/30 rounded-none shadow-none focus:ring-0 focus:border-dashed"
                    ></textarea>
                  </div>

                  {error && (
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors py-2.5 rounded text-xs uppercase font-bold tracking-wider vintage-border border-coffee-dark"
                  >
                    Slip into the Mailbox
                  </button>
                </form>
              )}
            </div>

            {/* Info panel */}
            <div className="p-4 bg-cream-dark border border-coffee-light/10 rounded text-xs text-coffee-light font-serif italic flex items-start gap-2.5">
              <MailOpen className="h-5 w-5 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Letters submitted here are strictly anonymous. We collect no IP logs or personal accounts. Aria reviews every letter and drafts response replies weekly.
              </p>
            </div>
          </div>

          {/* Letter Board Feed */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-coffee-light/10 pb-3 gap-4">
              <h2 className="font-serif text-2xl font-bold">The Stranger's Drawer</h2>

              {/* Tab toggles */}
              <div className="flex bg-cream-dark p-0.5 rounded border border-coffee-light/15 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded transition-all ${
                    activeTab === 'all'
                      ? 'bg-coffee-dark text-cream-light'
                      : 'text-coffee-light hover:text-coffee-dark'
                  }`}
                >
                  All Letters
                </button>
                <button
                  onClick={() => setActiveTab('replied')}
                  className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
                    activeTab === 'replied'
                      ? 'bg-coffee-dark text-cream-light'
                      : 'text-coffee-light hover:text-coffee-dark'
                  }`}
                >
                  <Heart className="h-3 w-3 text-terracotta fill-terracotta" />
                  <span>Aria's Replies</span>
                </button>
              </div>
            </div>

            {/* Category filter board */}
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[9px] uppercase font-bold tracking-wider text-coffee-light mr-1">Filter category:</span>
              {['All', 'confessions', 'regrets', 'dreams', 'thank-you', 'goodbyes'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                    selectedCategoryFilter === cat
                      ? 'bg-coffee-light text-cream-light border-coffee-light'
                      : 'bg-cream-light text-coffee-light border-coffee-light/10 hover:border-coffee-light/20 hover:text-coffee-dark'
                  }`}
                >
                  {cat === 'All' ? 'All Drawer' : cat}
                </button>
              ))}
            </div>

            {/* Cards Feed */}
            {filteredLetters.length === 0 ? (
              <div className="text-center py-20 bg-cream-dark/30 border border-dashed border-coffee-light/20 rounded-lg">
                <MailOpen className="h-10 w-10 text-coffee-light/35 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-coffee-dark">Drawer is empty</h3>
                <p className="text-xs text-coffee-light mt-1">
                  {activeTab === 'replied' 
                    ? 'Aria has not replied to letters in this category yet.'
                    : 'No approved letters in this category yet. Be the first to slip one in!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {filteredLetters.map((letter) => (
                  <LetterCard key={letter.id} letter={letter} />
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}
