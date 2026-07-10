'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Plus, Trash, Book, Calendar, Info, Globe, Award } from 'lucide-react';
import { fdb as db } from '@/lib/firebaseDB';
import { Settings as SettingsType, TimelineEvent, BookShelfItem, PublicationItem } from '@/types/database';

export default function SettingsDashboard() {
  const [config, setConfig] = useState<SettingsType | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'about' | 'timeline' | 'bookshelf' | 'publications'>('general');
  const [refreshToggle, setRefreshToggle] = useState(false);

  // General States
  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');
  const [mission, setMission] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [featuredQuote, setFeaturedQuote] = useState('');

  // Bio States
  const [aboutText, setAboutText] = useState('');
  const [aboutPhilosophy, setAboutPhilosophy] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorImage, setAuthorImage] = useState('');
  const [authorTagline, setAuthorTagline] = useState('');
  const [authorBlurb, setAuthorBlurb] = useState('');
  const [whyStartedText, setWhyStartedText] = useState('');

  // Timeline Helper States
  const [timeYear, setTimeYear] = useState('');
  const [timeTitle, setTimeTitle] = useState('');
  const [timeDesc, setTimeDesc] = useState('');

  // Bookshelf Helper States
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookCover, setBookCover] = useState('');
  const [bookRating, setBookRating] = useState(5);
  const [bookReview, setBookReview] = useState('');

  // Publications Helper States
  const [pubTitle, setPubTitle] = useState('');
  const [pubSource, setPubSource] = useState('');
  const [pubYear, setPubYear] = useState('');

  useEffect(() => {
    async function load() {
      const data = await db.getSettings();
      setConfig(data);

      setSiteName(data.siteName);
      setTagline(data.tagline);
      setMission(data.mission);
      setEmail(data.email);
      setInstagram(data.instagram || '');
      setTwitter(data.twitter || '');
      setHeroTitle(data.heroTitle || '');
      setFeaturedQuote(data.featuredQuote || '');

      setAboutText(data.aboutText);
      setAboutPhilosophy(data.aboutPhilosophy);
      setAuthorName(data.authorName);
      setAuthorBio(data.authorBio);
      setAuthorImage(data.authorImage || '');
      setAuthorTagline(data.authorTagline || '');
      setAuthorBlurb(data.authorBlurb || '');
      setWhyStartedText(data.whyStartedText || '');
    }
    load();
  }, [refreshToggle]);

  if (!config) return null;

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...config,
      siteName,
      tagline,
      mission,
      email,
      instagram,
      twitter,
      heroTitle,
      featuredQuote
    } as SettingsType;
    await db.saveSettings(updated);
    alert('General settings saved!');
    setRefreshToggle(!refreshToggle);
  };

  const handleSaveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...config,
      aboutText,
      aboutPhilosophy,
      authorName,
      authorBio,
      authorImage,
      authorTagline,
      authorBlurb,
      whyStartedText
    } as SettingsType;
    await db.saveSettings(updated);
    alert('Biography and writing philosophy saved!');
    setRefreshToggle(!refreshToggle);
  };

  const handleAddPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim() || !pubSource.trim() || !pubYear.trim()) return;

    const newPub: PublicationItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: pubTitle.trim(),
      source: pubSource.trim(),
      year: pubYear.trim()
    };

    const updated = {
      ...config,
      publications: [...(config!.publications || []), newPub]
    } as SettingsType;

    await db.saveSettings(updated);
    setPubTitle('');
    setPubSource('');
    setPubYear('');
    setRefreshToggle(!refreshToggle);
  };

  const handleDeletePublication = async (id: string) => {
    const updated = {
      ...config,
      publications: (config!.publications || []).filter(p => p.id !== id)
    } as SettingsType;
    await db.saveSettings(updated);
    setRefreshToggle(!refreshToggle);
  };

  const handleAddTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeYear.trim() || !timeTitle.trim()) return;

    const newEvent: TimelineEvent = {
      id: Math.random().toString(36).substr(2, 9),
      year: timeYear.trim(),
      title: timeTitle.trim(),
      description: timeDesc.trim()
    };

    const updated = {
      ...config,
      timeline: [...(config!.timeline || []), newEvent]
    } as SettingsType;
    
    await db.saveSettings(updated);
    setTimeYear('');
    setTimeTitle('');
    setTimeDesc('');
    setRefreshToggle(!refreshToggle);
  };

  const handleDeleteTimeline = async (id: string) => {
    const updated = {
      ...config,
      timeline: config!.timeline.filter(e => e.id !== id)
    } as SettingsType;
    await db.saveSettings(updated);
    setRefreshToggle(!refreshToggle);
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !bookAuthor.trim() || !bookCover.trim()) return;

    const newBook: BookShelfItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: bookTitle.trim(),
      author: bookAuthor.trim(),
      coverImage: bookCover.trim(),
      rating: bookRating,
      review: bookReview.trim() || undefined
    };

    const updated = {
      ...config,
      bookshelf: [...(config!.bookshelf || []), newBook]
    } as SettingsType;
    
    await db.saveSettings(updated);
    setBookTitle('');
    setBookAuthor('');
    setBookCover('');
    setBookRating(5);
    setBookReview('');
    setRefreshToggle(!refreshToggle);
  };

  const handleDeleteBook = async (id: string) => {
    const updated = {
      ...config,
      bookshelf: config!.bookshelf.filter(b => b.id !== id)
    } as SettingsType;
    await db.saveSettings(updated);
    setRefreshToggle(!refreshToggle);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <div className="border-b border-coffee-light/10 pb-4">
        <h1 className="font-serif text-2xl font-bold text-coffee-dark">Global Settings</h1>
        <p className="text-xs text-coffee-light">Configure profile details, timeline logs, and book lists across the website.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-coffee-light/15 text-xs font-semibold">
        {[
          { id: 'general', label: 'General Config', icon: Globe },
          { id: 'about', label: 'About & Bio', icon: Info },
          { id: 'timeline', label: 'Timeline Logs', icon: Calendar },
          { id: 'bookshelf', label: 'Bookshelf Setup', icon: Book },
          { id: 'publications', label: 'Publications', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'border-terracotta text-coffee-dark font-bold'
                  : 'border-transparent text-coffee-light hover:text-coffee-dark'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* GENERAL TAB */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-cream-dark/20 border border-coffee-light/15 p-6 rounded-lg space-y-4">
          <h3 className="font-serif text-base font-bold text-coffee-dark">Branding & Socials</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Platform Name</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Tagline</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Homepage Hero Title</label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Homepage Banner Quote</label>
              <input
                type="text"
                required
                value={featuredQuote}
                onChange={(e) => setFeaturedQuote(e.target.value)}
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-coffee-light block">Mission Statement</label>
            <input
              type="text"
              required
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Contact Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Instagram Handle (no @)</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Twitter Handle (no @)</label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-5 py-2 rounded text-xs font-bold uppercase flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            <span>Save General Settings</span>
          </button>
        </form>
      )}

      {/* ABOUT & BIO TAB */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveBio} className="bg-cream-dark/20 border border-coffee-light/15 p-6 rounded-lg space-y-4">
          <h3 className="font-serif text-base font-bold text-coffee-dark">Biography & Writing philosophy</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-coffee-light block">Author Name</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-coffee-light block">About Welcome Text (homepage)</label>
            <textarea
              rows={3}
              required
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark font-serif italic"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-coffee-light block">Author Biography (Behind the pen page)</label>
            <textarea
              rows={4}
              required
              value={authorBio}
              onChange={(e) => setAuthorBio(e.target.value)}
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark font-serif italic"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-coffee-light block">Writing Philosophy (Behind the pen page)</label>
            <textarea
              rows={3}
              required
              value={aboutPhilosophy}
              onChange={(e) => setAboutPhilosophy(e.target.value)}
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark font-serif italic"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-coffee-light block">Author Photo URL (Behind the pen page)</label>
            <input
              type="text"
              value={authorImage}
              onChange={(e) => setAuthorImage(e.target.value)}
              placeholder="https://...your-photo-url.jpg"
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
            />
            {authorImage && (
              <img src={authorImage} alt="Author preview" className="mt-2 w-16 h-16 rounded-full object-cover border border-coffee-light/20" />
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-coffee-light block">Author Role / Tagline (e.g. Essayist & Poet)</label>
            <input
              type="text"
              value={authorTagline}
              onChange={(e) => setAuthorTagline(e.target.value)}
              placeholder="Essayist & Poet · Anthology Editor"
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-coffee-light block">Author Blurb Paragraph (Behind the pen page)</label>
            <textarea
              rows={3}
              value={authorBlurb}
              onChange={(e) => setAuthorBlurb(e.target.value)}
              placeholder="I spend my days grinding coffee beans..."
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark font-serif italic"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-coffee-light block">Why I Started Writing (Behind the pen page)</label>
            <textarea
              rows={4}
              required
              value={whyStartedText}
              onChange={(e) => setWhyStartedText(e.target.value)}
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark font-serif italic"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-5 py-2 rounded text-xs font-bold uppercase flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            <span>Save Biography</span>
          </button>
        </form>
      )}

      {/* TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Add timeline form */}
          <form onSubmit={handleAddTimeline} className="bg-cream-dark/20 border border-coffee-light/15 p-6 rounded-lg space-y-4">
            <h3 className="font-serif text-base font-bold text-coffee-dark">Add Timeline Milestone</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Year</label>
                <input
                  type="text"
                  required
                  value={timeYear}
                  onChange={(e) => setTimeYear(e.target.value)}
                  placeholder="e.g. 2024"
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={timeTitle}
                  onChange={(e) => setTimeTitle(e.target.value)}
                  placeholder="e.g. Platform Launched"
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Description</label>
              <input
                type="text"
                required
                value={timeDesc}
                onChange={(e) => setTimeDesc(e.target.value)}
                placeholder="Describe this milestone..."
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
              />
            </div>
            <button
              type="submit"
              className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Milestone</span>
            </button>
          </form>

          {/* Timeline events list */}
          <div className="bg-cream-dark/10 border border-coffee-light/10 rounded-lg p-5 space-y-4">
            <h3 className="font-serif text-sm font-bold text-coffee-dark border-b border-coffee-light/5 pb-1">Current Milestones</h3>
            {(!config.timeline || config.timeline.length === 0) ? (
              <p className="text-xs font-serif italic text-coffee-light">No milestones added yet.</p>
            ) : (
              <div className="divide-y divide-coffee-light/10">
                {config.timeline.map((event) => (
                  <div key={event.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-coffee-dark">[{event.year}] {event.title}</p>
                      <p className="text-coffee-light font-serif italic mt-0.5">{event.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteTimeline(event.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete event"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOOKSHELF TAB */}
      {activeTab === 'bookshelf' && (
        <div className="space-y-6">
          {/* Add book form */}
          <form onSubmit={handleAddBook} className="bg-cream-dark/20 border border-coffee-light/15 p-6 rounded-lg space-y-4">
            <h3 className="font-serif text-base font-bold text-coffee-dark">Add Book Recommendation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Book Title</label>
                <input
                  type="text"
                  required
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="Letters to a Young Poet..."
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Author Name</label>
                <input
                  type="text"
                  required
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  placeholder="Rainer Maria Rilke"
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Cover Image URL</label>
                <input
                  type="text"
                  required
                  value={bookCover}
                  onChange={(e) => setBookCover(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Your Rating (1-5)</label>
                <select
                  value={bookRating}
                  onChange={(e) => setBookRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark cursor-pointer"
                >
                  <option value={5}>5 stars</option>
                  <option value={4}>4 stars</option>
                  <option value={3}>3 stars</option>
                  <option value={2}>2 stars</option>
                  <option value={1}>1 star</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Tiny Review / Notes</label>
              <input
                type="text"
                value={bookReview}
                onChange={(e) => setBookReview(e.target.value)}
                placeholder="A masterclass in isolation and patience..."
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark font-serif italic"
              />
            </div>

            <button
              type="submit"
              className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Recommend Book</span>
            </button>
          </form>

          {/* Recommended books list */}
          <div className="bg-cream-dark/10 border border-coffee-light/10 rounded-lg p-5 space-y-4">
            <h3 className="font-serif text-sm font-bold text-coffee-dark border-b border-coffee-light/5 pb-1">Recommended Shelf</h3>
            {(!config.bookshelf || config.bookshelf.length === 0) ? (
              <p className="text-xs font-serif italic text-coffee-light">No books on the shelf yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.bookshelf.map((book) => (
                  <div key={book.id} className="bg-cream-light border border-coffee-light/5 p-3 rounded flex justify-between items-center text-xs">
                    <div className="flex gap-3 items-center">
                      <img src={book.coverImage} className="w-8 h-12 object-cover rounded shadow" alt="Book cover" />
                      <div>
                        <p className="font-bold text-coffee-dark">{book.title}</p>
                        <p className="text-[10px] text-coffee-light">by {book.author} ({book.rating}★)</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove book"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PUBLICATIONS TAB */}
      {activeTab === 'publications' && (
        <div className="space-y-6">
          <form onSubmit={handleAddPublication} className="bg-cream-dark/20 border border-coffee-light/15 p-6 rounded-lg space-y-4">
            <h3 className="font-serif text-base font-bold text-coffee-dark">Add Selected Publication</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Publication Title</label>
                <input
                  type="text"
                  required
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  placeholder="e.g. The Warmth of Autumn Coffee"
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Year</label>
                <input
                  type="text"
                  required
                  value={pubYear}
                  onChange={(e) => setPubYear(e.target.value)}
                  placeholder="e.g. 2022"
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Source / Publisher / Details</label>
              <input
                type="text"
                required
                value={pubSource}
                onChange={(e) => setPubSource(e.target.value)}
                placeholder="e.g. Published in Leaves Literary Review"
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
              />
            </div>
            <button
              type="submit"
              className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Publication</span>
            </button>
          </form>

          <div className="bg-cream-dark/10 border border-coffee-light/10 rounded-lg p-5 space-y-4">
            <h3 className="font-serif text-sm font-bold text-coffee-dark border-b border-coffee-light/5 pb-1">Current Publications</h3>
            {(!config.publications || config.publications.length === 0) ? (
              <p className="text-xs font-serif italic text-coffee-light">No publications added yet.</p>
            ) : (
              <div className="divide-y divide-coffee-light/10">
                {config.publications.map((pub) => (
                  <div key={pub.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-coffee-dark">"{pub.title}" ({pub.year})</p>
                      <p className="text-coffee-light font-serif italic mt-0.5">{pub.source}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePublication(pub.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove publication"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
