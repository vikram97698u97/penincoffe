'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, PenTool, BookOpen, Heart, ArrowRight, Star, MessageSquare } from 'lucide-react';
import Footer from '@/components/Footer';
import NewsletterForm from '@/components/NewsletterForm';
import { PostCard, PoemCard, ArticleCard, LetterCard, BookCard } from '@/components/ContentCards';
import { fdb as db } from '@/lib/firebaseDB';
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
      const fetchedSettings = await db.getSettings();
      setSettings(fetchedSettings);

      const posts = await db.getPosts(false);
      
      // Featured Story
      const featured = posts.find(p => p.featured && p.type === 'story') || posts.find(p => p.type === 'story') || null;
      setFeaturedPost(featured);

      // Latest Stories (excluding featured)
      const stories = posts.filter(p => p.type === 'story' && p.id !== featured?.id).slice(0, 3);
      setLatestStories(stories);

      // Latest Articles
      const poems = posts.filter(p => p.type === 'article' || p.type === 'poem').slice(0, 3);
      setLatestPoems(poems);

      // Latest Book Note
      const bookNotes = posts.filter(p => p.type === 'book-note').slice(0, 1);
      setLatestBookNote(bookNotes[0] || null);

      // Latest Weekly Brew
      const brews = posts.filter(p => p.type === 'weekly-brew').slice(0, 1);
      setLatestBrew(brews[0] || null);

      // Get an approved letter
      const approvedLetters = await db.getLetters(false);
      if (approvedLetters.length > 0) {
        setRandomLetter(approvedLetters[0]);
      }

      // Get coffee table items
      const tableItems = await db.getCoffeeTable();
      setCoffeeTableItems(tableItems.slice(0, 2));

      setLoading(false);
    }
    loadData();
  }, [mounted]);

  if (loading || !settings) return (
    <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center min-h-[60vh]">
      <p className="font-serif italic text-coffee-light">Brewing content...</p>
    </main>
  );

  return (
    <>
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-24">
        
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
              {settings.tagline}
            </span>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-coffee-dark tracking-tight leading-[1.08] max-w-2xl mx-auto lg:mx-0">
              {settings.heroTitle || "I'm just a girl who writes... and a coffee that understands."}
            </h1>

            <p className="text-base sm:text-lg text-coffee-light/95 font-serif italic max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {settings.aboutText}
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/stories"
                className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-all px-8 py-3.5 rounded font-medium text-sm flex items-center justify-center gap-2 vintage-border border-coffee-dark shadow-md"
              >
                <span>Explore Stories</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/letters-to-strangers"
                className="bg-cream-dark text-coffee-dark hover:bg-cream-darker transition-all px-8 py-3.5 rounded font-medium text-sm flex items-center justify-center gap-2 vintage-border border-coffee-light/20"
              >
                <span>Write a Letter</span>
                <Heart className="h-4 w-4 text-terracotta" />
              </Link>
            </div>
          </div>

          {/* Coffee Mug & Pen Illustration Art Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative bg-cream-dark border border-coffee-light/25 p-6 rounded-2xl w-full max-w-sm vintage-border rotate-[1deg] hover:rotate-0 transition-transform">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-coffee-light/10 relative shadow-inner mb-6">
                <img
                  src="https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=600"
                  alt="Coffee cup on notebook"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-3 font-serif italic">
                <div className="flex items-center gap-2 text-xs text-coffee-light border-b border-coffee-light/10 pb-2">
                  <PenTool className="h-3.5 w-3.5 text-terracotta" />
                  <span>Freshly Brewed Thoughts</span>
                </div>
                <p className="text-sm text-coffee-dark leading-relaxed">
                  "Writing, at its best, is just the quiet steam arising from a cup of warm experiences."
                </p>
                <p className="text-xs text-right text-coffee-light font-semibold">— Aria Thorne</p>
              </div>
            </div>
          </div>
        </section>

        {/* COFFEE MENU SPEED DIAL */}
        <section className="bg-cream-dark border border-coffee-light/15 rounded-xl p-6 vintage-border">
          <div className="text-center space-y-2 mb-6">
            <h3 className="font-serif text-lg font-bold text-coffee-dark">The Coffee Menu</h3>
            <p className="text-xs text-coffee-light">Select a reading length that fits your cup of time</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Espresso', min: 1, max: 3, desc: 'Quick reads (1-3 min)', color: 'border-amber-600/30' },
              { label: 'Americano', min: 3, max: 5, desc: 'Short reads (3-5 min)', color: 'border-amber-700/40' },
              { label: 'Cappuccino', min: 5, max: 10, desc: 'Medium reads (5-10 min)', color: 'border-amber-800/50' },
              { label: 'Latte', min: 10, max: 20, desc: 'Long reads (10-20 min)', color: 'border-amber-900/60' },
              { label: 'Mocha', min: 20, max: 999, desc: 'Deep reads (20+ min)', color: 'border-yellow-900/70' }
            ].map((menu) => (
              <Link
                key={menu.label}
                href={`/stories?minRead=${menu.min}&maxRead=${menu.max}`}
                className={`p-4 bg-cream-light rounded-lg border text-center transition-all hover:scale-[1.03] flex flex-col justify-between h-28 group hover:border-terracotta ${menu.color}`}
              >
                <div>
                  <p className="text-sm font-bold text-coffee-dark group-hover:text-terracotta transition-colors">{menu.label}</p>
                  <p className="text-[10px] text-coffee-light mt-1">{menu.desc}</p>
                </div>
                <span className="text-[9px] font-bold text-coffee-light uppercase tracking-widest block pt-2 border-t border-coffee-light/5">
                  {menu.max > 20 ? '20m+' : `${menu.min}-${menu.max}m`}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED STORY */}
        {featuredPost && (
          <section className="space-y-6">
            <h2 className="font-serif text-3xl font-bold border-b border-coffee-light/10 pb-3 flex items-center gap-2">
              <Coffee className="h-5 w-5 text-terracotta" />
              <span>Featured Story</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-cream-dark border border-coffee-light/10 rounded-xl overflow-hidden vintage-border">
              {featuredPost.coverImage && (
                <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-coffee-light/10">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-coffee-light font-semibold">
                    <span className="px-2.5 py-0.5 bg-coffee-light/10 rounded-full">{featuredPost.category}</span>
                    <span>{featuredPost.readingTime} min read</span>
                  </div>
                  
                  <h3 className="font-serif text-3xl font-bold leading-tight hover:text-coffee-light transition-colors">
                    <Link href={`/stories/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h3>
                  
                  <p className="text-sm font-serif italic text-coffee-light/90 leading-relaxed">
                    "{featuredPost.excerpt}"
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-coffee-light/10 pt-6">
                  <Link
                    href={`/stories/${featuredPost.slug}`}
                    className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-6 py-2.5 rounded text-xs uppercase tracking-wider font-bold"
                  >
                    Read Story
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-coffee-light">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {featuredPost.favorites}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* LATEST STORIES & POEMS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Latest Stories */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-baseline border-b border-coffee-light/10 pb-3">
              <h2 className="font-serif text-2xl font-bold">Latest Stories</h2>
              <Link href="/stories" className="text-xs font-bold text-terracotta hover:underline">
                View All Stories →
              </Link>
            </div>
            {latestStories.length === 0 ? (
              <p className="text-sm font-serif italic text-coffee-light">No additional stories published yet.</p>
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
            <div className="flex justify-between items-baseline border-b border-coffee-light/10 pb-3">
              <h2 className="font-serif text-2xl font-bold">Latest Articles</h2>
              <Link href="/articles" className="text-xs font-bold text-terracotta hover:underline">
                View All Articles →
              </Link>
            </div>
            <div className="space-y-6">
              {latestPoems.length === 0 ? (
                <p className="text-sm font-serif italic text-coffee-light">No articles published yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {latestPoems.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BRIGHT QUOTE BANNER */}
        <section className="bg-coffee-dark text-cream-light rounded-xl p-12 text-center vintage-border border-coffee-dark relative overflow-hidden shadow-lg">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10 font-serif">
            <p className="text-2xl sm:text-3xl font-light italic leading-relaxed text-cream-dark/95">
              “{settings.featuredQuote || "Some stories find you when you're quiet enough to hear them."}”
            </p>
            <div className="w-16 h-[1px] bg-terracotta mx-auto my-4" />
            <p className="text-xs uppercase tracking-widest text-terracotta font-bold">
              Pen in Coffee Journal
            </p>
          </div>
          {/* Subtle cup silhouette background */}
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-cream-light/5 text-9xl pointer-events-none select-none font-serif">
            🖋️
          </div>
        </section>

        {/* BOOK NOTES PREVIEW & WEEKLY BREW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Book Notes */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-baseline border-b border-coffee-light/10 pb-3">
              <h2 className="font-serif text-2xl font-bold">Book Note Reflections</h2>
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
            <h2 className="font-serif text-2xl font-bold border-b border-coffee-light/10 pb-3">
              Weekly Brew every Sunday
            </h2>
            {latestBrew ? (
              <div className="bg-cream-dark p-6 rounded-lg border border-coffee-light/15 vintage-border space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta">
                  Sunday Gather
                </span>
                <h3 className="font-serif text-xl font-bold text-coffee-dark">
                  <Link href={`/weekly-brew/${latestBrew.slug}`}>{latestBrew.title}</Link>
                </h3>
                <p className="text-xs text-coffee-light font-serif italic line-clamp-3">
                  "{latestBrew.excerpt}"
                </p>
                <div className="border-t border-coffee-light/10 pt-4 flex justify-between items-center">
                  <Link
                    href={`/weekly-brew/${latestBrew.slug}`}
                    className="text-xs font-bold text-coffee-dark hover:text-terracotta transition-colors uppercase tracking-wider"
                  >
                    Read Weekly Brew →
                  </Link>
                  <span className="text-[10px] text-coffee-light">
                    {mounted ? new Date(latestBrew.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : ''}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm font-serif italic text-coffee-light">No Sunday brews archived yet.</p>
            )}

            {/* Post-it Note Decor */}
            <div className="memo-pad p-6 rounded relative rotate-[-1deg] text-center max-w-xs mx-auto">
              <p className="font-serif text-sm italic text-coffee-medium leading-relaxed">
                "A corner where we slow down, read, reflect, and grow together."
              </p>
              <span className="text-[10px] font-bold text-coffee-light block mt-2">☕ Pen in Coffee</span>
            </div>
          </div>
        </div>

        {/* ARIA'S BOOKSHELF */}
        {settings.bookshelf && settings.bookshelf.length > 0 && (
          <section className="space-y-6">
            <div className="flex justify-between items-baseline border-b border-coffee-light/10 pb-3">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-terracotta" />
                <span>Aria's Bookshelf</span>
              </h2>
              <Link href="/behind-the-pen" className="text-xs font-bold text-terracotta hover:underline">
                View My Reading Journey →
              </Link>
            </div>
            <p className="text-sm text-coffee-light font-serif">
              A curated collection of novels, poetry collections, and essays that shape the stories and brews found on this platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.bookshelf.slice(0, 2).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* LETTERS & COFFEE TABLE BOARD PREVIEWS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Letters Snippet */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex justify-between items-baseline border-b border-coffee-light/10 pb-3">
              <h2 className="font-serif text-2xl font-bold">Letters to Strangers</h2>
              <Link href="/letters-to-strangers" className="text-xs font-bold text-terracotta hover:underline">
                Write a Letter →
              </Link>
            </div>
            <p className="text-sm text-coffee-light font-serif">
              An anonymous sanctuary for confessions, regrets, dreams, and thank-yous. Write what you cannot say aloud.
            </p>
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
            <div className="flex justify-between items-baseline border-b border-coffee-light/10 pb-3">
              <h2 className="font-serif text-2xl font-bold">Coffee Table Inspiration</h2>
              <Link href="/coffee-table" className="text-xs font-bold text-terracotta hover:underline">
                Pull up a chair →
              </Link>
            </div>
            <p className="text-sm text-coffee-light font-serif mb-4">
              Quotes, song recommendations, writing prompts, and observations scattered across the table.
            </p>
            
            {/* Displaying dynamic preview board */}
            {coffeeTableItems.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-cream-dark border border-coffee-light/10 p-5 rounded-lg vintage-border shadow-sm text-center">
                  <span className="text-[9px] uppercase tracking-wider text-coffee-light font-bold">Writing Prompt</span>
                  <p className="font-serif text-xs italic text-coffee-dark mt-2">
                    "Write a scene set entirely inside a train station at 3:00 AM..."
                  </p>
                  <Link href="/coffee-table" className="text-[10px] text-terracotta font-semibold mt-3 block hover:underline">
                    See Board →
                  </Link>
                </div>

                <div className="bg-cream-dark border border-coffee-light/10 p-5 rounded-lg vintage-border shadow-sm text-center">
                  <span className="text-[9px] uppercase tracking-wider text-coffee-light font-bold">Current Song Loop</span>
                  <p className="font-serif text-xs italic text-coffee-dark mt-2 font-bold">
                    "Rivers and Roads"
                  </p>
                  <p className="text-[10px] text-coffee-light font-serif">The Head and the Heart</p>
                  <Link href="/coffee-table" className="text-[10px] text-terracotta font-semibold mt-3 block hover:underline">
                    Listen over Coffee →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coffeeTableItems.map((item) => (
                  <div key={item.id} className="bg-cream-dark border border-coffee-light/10 p-5 rounded-lg vintage-border shadow-sm flex flex-col justify-between text-center min-h-[140px] group hover:border-terracotta transition-colors">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-coffee-light font-bold">{item.type}</span>
                      <p className="font-serif text-xs italic text-coffee-dark mt-2 line-clamp-3">
                        "{item.content}"
                      </p>
                      {item.authorNickname && (
                        <p className="text-[10px] text-coffee-light font-serif mt-1 font-semibold">@{item.authorNickname}</p>
                      )}
                    </div>
                    <Link href="/coffee-table" className="text-[10px] text-terracotta font-semibold mt-3 block hover:underline">
                      View Board →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* NEWSLETTER */}
        <NewsletterForm />

      </main>

      <Footer />
    </>
  );
}
