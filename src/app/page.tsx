'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, PenTool, BookOpen, Heart, ArrowRight, Star, MessageSquare, Sparkles } from 'lucide-react';
import Footer from '@/components/Footer';
import NewsletterForm from '@/components/NewsletterForm';
import { PostCard, PoemCard, ArticleCard, LetterCard, BookCard } from '@/components/ContentCards';
import { fdb } from '@/lib/firebaseDB';
import { db as localDb, isTemplatePost, getPostUrl } from '@/lib/db';
import { Post, Settings } from '@/types/database';

export default function Home() {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [latestStories, setLatestStories] = useState<Post[]>([]);
  const [latestPoems, setLatestPoems] = useState<Post[]>([]);
  const [latestBookNote, setLatestBookNote] = useState<Post | null>(null);
  const [latestBrew, setLatestBrew] = useState<Post | null>(null);
  const [randomLetter, setRandomLetter] = useState<any>(null);
  const [coffeeTableItems, setCoffeeTableItems] = useState<any[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    async function loadData() {
      // Parallel data fetching for better performance
      const [fetchedSettings, firebasePosts, approvedLetters, tableItems] = await Promise.all([
        fdb.getSettings(),
        fdb.getPosts(false).catch(err => {
          console.warn('Failed to load firebase posts on client:', err);
          return [];
        }),
        fdb.getLetters(false),
        fdb.getCoffeeTable()
      ]);

      setSettings(fetchedSettings);

      const localPosts = localDb.getPosts(false);
      const allPostsMap = new Map<string, Post>();
      localPosts.forEach(p => p && allPostsMap.set(p.id, p));
      firebasePosts.forEach(p => p && allPostsMap.set(p.id, p));
      const posts = Array.from(allPostsMap.values()).filter(p => !isTemplatePost(p) && p.published);
      posts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      // Featured Story
      const featured = posts.find(p => p.featured && p.type === 'story') || posts.find(p => p.type === 'story') || null;
      setFeaturedPost(featured);

      // Latest Stories (excluding featured if more stories exist, up to 4)
      const storyCandidates = posts.filter(p => p.type === 'story' && p.id !== featured?.id);
      const stories = storyCandidates.length > 0 
        ? storyCandidates.slice(0, 4) 
        : posts.filter(p => p.type === 'story').slice(0, 4);
      setLatestStories(stories);

      // Latest Articles & Poetry
      const poems = posts.filter(p => p.type === 'article' || p.type === 'poem').slice(0, 4);
      setLatestPoems(poems);

      // Latest Book Note
      const bookNotes = posts.filter(p => p.type === 'book-note').slice(0, 1);
      setLatestBookNote(bookNotes[0] || null);

      // Latest Weekly Brew
      const brews = posts.filter(p => p.type === 'weekly-brew').slice(0, 1);
      setLatestBrew(brews[0] || null);

      // Set letters and coffee table items
      if (approvedLetters.length > 0) {
        setRandomLetter(approvedLetters[0]);
      }
      setCoffeeTableItems(tableItems.slice(0, 2));

      setLoading(false);
    }
    loadData();
  }, [mounted]);

  if (!mounted || loading || !settings) return (
    <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-coffee-light/20 border-t-terracotta rounded-full mx-auto"></div>
        <p className="font-serif italic text-coffee-light">Brewing content...</p>
      </div>
    </main>
  );

  return (
    <>
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-20 sm:space-y-28">
        
        {/* HERO SECTION */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center py-6 sm:py-10">
          
          {/* Ambient Warm Backlight Glow */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs font-semibold uppercase tracking-widest shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>{settings.tagline}</span>
            </div>
            
            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-coffee-dark tracking-tight leading-[1.05] max-w-2xl mx-auto lg:mx-0">
              {settings.heroTitle || "I'm just a girl who writes... and a coffee that understands."}
            </h1>

            {/* Sub-description */}
            <p className="text-base sm:text-xl text-coffee-light/90 font-serif italic max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {settings.aboutText}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/stories"
                className="bg-coffee-dark text-cream-light hover:bg-coffee-medium transition-all duration-300 px-8 py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-xl hover:-translate-y-0.5 group border border-coffee-dark"
              >
                <span>Explore Stories</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/letters-to-strangers"
                className="bg-cream-dark/80 backdrop-blur-md text-coffee-dark hover:bg-cream-darker transition-all duration-300 px-8 py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 border border-coffee-light/20 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <span>Write a Letter</span>
                <Heart className="h-4 w-4 text-terracotta" />
              </Link>
            </div>

            {/* Stats Row */}
            <div className="pt-6 border-t border-coffee-light/10 flex items-center justify-center lg:justify-start gap-8 text-xs text-coffee-light font-medium">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-coffee-dark">100+</span>
                <span>Brewed Stories</span>
              </div>
              <span className="h-4 w-[1px] bg-coffee-light/20" />
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-coffee-dark">5k+</span>
                <span>Silent Readers</span>
              </div>
              <span className="h-4 w-[1px] bg-coffee-light/20" />
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-coffee-dark">Weekly</span>
                <span>Sunday Letters</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Art & Polaroid Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative bg-cream-dark/70 backdrop-blur-md border border-coffee-light/20 p-6 sm:p-7 rounded-2xl w-full max-w-md shadow-xl rotate-[1.5deg] hover:rotate-0 transition-all duration-500 group">
              
              {/* Floating Decorative Badge */}
              <div className="absolute -top-4 -right-3 bg-terracotta text-cream-light text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-20">
                <Coffee className="h-3.5 w-3.5" />
                <span>Daily Journal</span>
              </div>

              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-coffee-light/15 relative shadow-inner mb-6">
                <img
                  src="https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=600"
                  alt="Coffee cup on notebook"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="space-y-3 font-serif italic">
                <div className="flex items-center justify-between text-xs text-coffee-light border-b border-coffee-light/10 pb-2">
                  <span className="flex items-center gap-1.5 font-sans font-semibold uppercase tracking-wider text-[10px] text-terracotta">
                    <PenTool className="h-3.5 w-3.5" />
                    Freshly Brewed Thoughts
                  </span>
                  <span className="font-mono text-[10px]">Vol. 04</span>
                </div>
                <p className="text-sm sm:text-base text-coffee-dark leading-relaxed">
                  "Writing, at its best, is just the quiet steam arising from a cup of warm experiences."
                </p>
                <p className="text-xs text-right text-coffee-light font-semibold font-sans uppercase tracking-wider">— Aria Thorne</p>
              </div>
            </div>
          </div>

        </section>

        {/* COFFEE MENU SPEED DIAL */}
        <section className="relative bg-cream-dark/50 backdrop-blur-sm border border-coffee-light/15 rounded-2xl p-6 sm:p-8 shadow-sm overflow-hidden">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta">Curated Reading Lengths</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-dark">The Coffee Menu</h2>
            <p className="text-xs text-coffee-light font-serif italic max-w-md mx-auto">Select a read that perfectly matches the time it takes to sip your cup.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Espresso', min: 1, max: 3, desc: 'Quick reads (1-3 min)', badge: '1-3m', color: 'hover:border-amber-600/50' },
              { label: 'Americano', min: 3, max: 5, desc: 'Short reads (3-5 min)', badge: '3-5m', color: 'hover:border-amber-700/50' },
              { label: 'Cappuccino', min: 5, max: 10, desc: 'Medium reads (5-10 min)', badge: '5-10m', color: 'hover:border-amber-800/50' },
              { label: 'Latte', min: 10, max: 20, desc: 'Long reads (10-20 min)', badge: '10-20m', color: 'hover:border-amber-900/50' },
              { label: 'Mocha', min: 20, max: 999, desc: 'Deep reads (20+ min)', badge: '20m+', color: 'hover:border-terracotta' }
            ].map((menu) => (
              <Link
                key={menu.label}
                href={`/stories?minRead=${menu.min}&maxRead=${menu.max}`}
                className={`group relative p-5 bg-cream-light/90 hover:bg-cream-light rounded-xl border border-coffee-light/15 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between h-32 ${menu.color}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-coffee-dark group-hover:text-terracotta transition-colors">{menu.label}</p>
                    <Coffee className="h-3.5 w-3.5 text-coffee-light/40 group-hover:text-terracotta transition-colors" />
                  </div>
                  <p className="text-[11px] text-coffee-light mt-1 font-serif italic line-clamp-1">{menu.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-coffee-light/10 mt-auto">
                  <span className="text-[9px] font-bold text-coffee-light uppercase tracking-widest">
                    {menu.badge}
                  </span>
                  <span className="text-xs text-terracotta opacity-0 group-hover:opacity-100 transition-opacity font-bold">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED STORY BANNER */}
        {featuredPost && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-coffee-light/15 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-terracotta/10 text-terracotta rounded-lg">
                  <Coffee className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-dark">Featured Story</h2>
                  <p className="text-xs text-coffee-light">Handpicked piece from our central archive</p>
                </div>
              </div>
              <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-widest text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
                ★ Editor's Pick
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-stretch bg-cream-dark/60 backdrop-blur-md border border-coffee-light/15 rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300">
              {featuredPost.coverImage && (
                <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[420px] overflow-hidden border-b lg:border-b-0 lg:border-r border-coffee-light/15">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/40 via-transparent to-transparent opacity-60" />
                </div>
              )}
              
              <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-coffee-light font-semibold">
                    <span className="px-3 py-1 bg-cream-light border border-coffee-light/20 text-coffee-dark rounded-full text-[10px] uppercase font-bold tracking-wider">
                      {featuredPost.category}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Coffee className="h-3.5 w-3.5 text-terracotta" />
                      {featuredPost.readingTime} min read
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-dark leading-tight group-hover:text-terracotta transition-colors">
                    <Link href={getPostUrl(featuredPost)}>{featuredPost.title}</Link>
                  </h3>
                  
                  <p className="text-sm sm:text-base font-serif italic text-coffee-light/90 leading-relaxed border-l-2 border-terracotta pl-4 py-1">
                    "{featuredPost.excerpt}"
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-coffee-light/10 pt-6">
                  <Link
                    href={getPostUrl(featuredPost)}
                    className="bg-coffee-dark text-cream-light hover:bg-coffee-medium transition-all px-7 py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow hover:shadow-md flex items-center gap-2"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  
                  <div className="flex items-center gap-4 text-xs text-coffee-light">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Heart className="h-4 w-4 text-red-500 fill-red-500/20" />
                      {featuredPost.favorites || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* LATEST STORIES & ARTICLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          {/* Latest Stories */}
          <div className="space-y-6">
            <div className="flex justify-between items-baseline border-b border-coffee-light/15 pb-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-dark">Latest Stories</h2>
                <p className="text-xs text-coffee-light mt-0.5">Fiction & narrative prose</p>
              </div>
              <Link href="/stories" className="text-xs font-bold text-terracotta hover:underline uppercase tracking-wider flex items-center gap-1">
                <span>View All</span>
                <span>→</span>
              </Link>
            </div>

            {latestStories.length === 0 ? (
              <div className="bg-cream-dark/40 border border-coffee-light/15 rounded-xl p-8 text-center space-y-2 shadow-sm">
                <p className="text-sm font-serif italic text-coffee-light">No additional stories published yet.</p>
                <Link href="/stories" className="text-xs font-bold text-terracotta hover:underline inline-block">Browse Story Archive →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestStories.map((story) => (
                  <PostCard key={story.id} post={story} />
                ))}
              </div>
            )}
          </div>

          {/* Latest Articles */}
          <div className="space-y-6">
            <div className="flex justify-between items-baseline border-b border-coffee-light/15 pb-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-dark">Latest Articles</h2>
                <p className="text-xs text-coffee-light mt-0.5">Essays, guides & culture</p>
              </div>
              <Link href="/articles" className="text-xs font-bold text-terracotta hover:underline uppercase tracking-wider flex items-center gap-1">
                <span>View All</span>
                <span>→</span>
              </Link>
            </div>

            {latestPoems.length === 0 ? (
              <div className="bg-cream-dark/40 border border-coffee-light/15 rounded-xl p-8 text-center space-y-2 shadow-sm">
                <p className="text-sm font-serif italic text-coffee-light">No articles published yet.</p>
                <Link href="/articles" className="text-xs font-bold text-terracotta hover:underline inline-block">Explore Articles →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestPoems.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BRIGHT QUOTE BANNER */}
        <section className="relative bg-gradient-to-r from-coffee-dark via-coffee-medium to-coffee-dark text-cream-light rounded-2xl p-10 sm:p-14 text-center border border-coffee-dark shadow-xl overflow-hidden">
          
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-terracotta/20 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-4 relative z-10 font-serif">
            <div className="w-12 h-12 bg-terracotta/10 border border-terracotta/20 rounded-full flex items-center justify-center mx-auto text-terracotta mb-2">
              <PenTool className="h-5 w-5" />
            </div>

            <p className="text-2xl sm:text-4xl font-light italic leading-relaxed text-cream-light/95">
              “{settings.featuredQuote || "Some stories find you when you're quiet enough to hear them."}”
            </p>
            
            <div className="w-20 h-[1px] bg-terracotta/40 mx-auto my-4" />
            
            <p className="text-xs uppercase tracking-widest text-terracotta font-bold font-sans">
              Pen in Coffee Journal · Sanctuary of Words
            </p>
          </div>

          {/* Subtle watermark background icon */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-cream-light/5 text-9xl pointer-events-none select-none font-serif">
            ☕
          </div>
        </section>

        {/* BOOK NOTES PREVIEW & WEEKLY BREW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Book Notes */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-baseline border-b border-coffee-light/15 pb-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-dark">Book Note Reflections</h2>
                <p className="text-xs text-coffee-light mt-0.5">Annotations & literature thoughts</p>
              </div>
              <Link href="/book-notes" className="text-xs font-bold text-terracotta hover:underline">
                Read Book Notes →
              </Link>
            </div>
            {latestBookNote ? (
              <PostCard post={latestBookNote} />
            ) : (
              <p className="text-sm font-serif italic text-coffee-light">No book notes available.</p>
            )}
          </div>

          {/* Weekly Brew Sunday Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-b border-coffee-light/15 pb-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-dark">Weekly Brew</h2>
              <p className="text-xs text-coffee-light mt-0.5">Sunday morning letter archive</p>
            </div>

            {latestBrew ? (
              <div className="bg-cream-dark/60 backdrop-blur-md p-7 rounded-2xl border border-coffee-light/15 shadow-sm space-y-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
                  Sunday Gather
                </span>
                <h3 className="font-serif text-2xl font-bold text-coffee-dark leading-snug">
                  <Link href={`/weekly-brew/${latestBrew.slug}`} className="hover:text-terracotta transition-colors">
                    {latestBrew.title}
                  </Link>
                </h3>
                <p className="text-xs text-coffee-light font-serif italic line-clamp-3 leading-relaxed">
                  "{latestBrew.excerpt}"
                </p>
                <div className="border-t border-coffee-light/10 pt-4 flex justify-between items-center text-xs">
                  <Link
                    href={`/weekly-brew/${latestBrew.slug}`}
                    className="font-bold text-coffee-dark hover:text-terracotta transition-colors uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>Read Weekly Brew</span>
                    <span>→</span>
                  </Link>
                  <span className="text-[11px] font-mono text-coffee-light">
                    {mounted ? new Date(latestBrew.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : ''}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm font-serif italic text-coffee-light">No Sunday brews archived yet.</p>
            )}

            {/* Post-it Note Decor */}
            <div className="memo-pad p-6 rounded-xl relative rotate-[-1deg] text-center max-w-xs mx-auto shadow-sm">
              <p className="font-serif text-sm italic text-coffee-medium leading-relaxed">
                "A corner where we slow down, read, reflect, and grow together."
              </p>
              <span className="text-[10px] font-bold text-coffee-light block mt-3 font-sans uppercase tracking-wider">☕ Pen in Coffee Sanctuary</span>
            </div>
          </div>
        </div>

        {/* ARIA'S BOOKSHELF */}
        {settings.bookshelf && settings.bookshelf.length > 0 && (
          <section className="space-y-6">
            <div className="flex justify-between items-baseline border-b border-coffee-light/15 pb-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-dark flex items-center gap-2.5">
                  <BookOpen className="h-6 w-6 text-terracotta" />
                  <span>Aria's Bookshelf</span>
                </h2>
                <p className="text-xs text-coffee-light mt-0.5">Curated novels, poetry collections & non-fiction</p>
              </div>
              <Link href="/behind-the-pen" className="text-xs font-bold text-terracotta hover:underline">
                Reading Journey →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.bookshelf.slice(0, 2).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* LETTERS & COFFEE TABLE BOARD PREVIEWS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Letters Snippet */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex justify-between items-baseline border-b border-coffee-light/15 pb-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-dark">Letters to Strangers</h2>
                <p className="text-xs text-coffee-light mt-0.5">Anonymous confessions & unsaid words</p>
              </div>
              <Link href="/letters-to-strangers" className="text-xs font-bold text-terracotta hover:underline">
                Write a Letter →
              </Link>
            </div>
            
            {randomLetter ? (
              <div className="transform rotate-[-0.5deg]">
                <LetterCard letter={randomLetter} />
              </div>
            ) : (
              <p className="text-sm font-serif italic text-coffee-light">No letters posted yet.</p>
            )}
          </div>

          {/* Coffee Table board preview */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex justify-between items-baseline border-b border-coffee-light/15 pb-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-dark">Coffee Table Inspiration</h2>
                <p className="text-xs text-coffee-light mt-0.5">Quotes, playlists & writing prompts</p>
              </div>
              <Link href="/coffee-table" className="text-xs font-bold text-terracotta hover:underline">
                Pull up a chair →
              </Link>
            </div>
            
            {/* Displaying dynamic preview board */}
            {coffeeTableItems.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-cream-dark/60 border border-coffee-light/15 p-6 rounded-xl shadow-sm text-center">
                  <span className="text-[9px] uppercase tracking-widest text-terracotta font-bold">Writing Prompt</span>
                  <p className="font-serif text-sm italic text-coffee-dark mt-2 leading-relaxed">
                    "Write a scene set entirely inside a train station at 3:00 AM..."
                  </p>
                  <Link href="/coffee-table" className="text-[11px] text-terracotta font-semibold mt-3 block hover:underline">
                    See Board →
                  </Link>
                </div>

                <div className="bg-cream-dark/60 border border-coffee-light/15 p-6 rounded-xl shadow-sm text-center">
                  <span className="text-[9px] uppercase tracking-widest text-terracotta font-bold">Current Song Loop</span>
                  <p className="font-serif text-sm italic text-coffee-dark mt-2 font-bold">
                    "Rivers and Roads"
                  </p>
                  <p className="text-[11px] text-coffee-light font-serif">The Head and the Heart</p>
                  <Link href="/coffee-table" className="text-[11px] text-terracotta font-semibold mt-3 block hover:underline">
                    Listen over Coffee →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coffeeTableItems.map((item) => (
                  <div key={item.id} className="bg-cream-dark/60 border border-coffee-light/15 p-6 rounded-xl shadow-sm flex flex-col justify-between text-center min-h-[150px] group hover:border-terracotta transition-colors">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-terracotta font-bold">{item.type}</span>
                      <p className="font-serif text-sm italic text-coffee-dark mt-2 line-clamp-3 leading-relaxed">
                        "{item.content}"
                      </p>
                      {item.authorNickname && (
                        <p className="text-[10px] text-coffee-light font-sans mt-2 font-semibold">@{item.authorNickname}</p>
                      )}
                    </div>
                    <Link href="/coffee-table" className="text-[11px] text-terracotta font-semibold mt-3 block hover:underline">
                      View Board →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* NEWSLETTER FORM */}
        <NewsletterForm />

      </main>

      <Footer />
    </>
  );
}
