'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee, Calendar, Eye, Heart, BookOpen } from 'lucide-react';

import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import RatingStars from '@/components/RatingStars';
import ShareButtons from '@/components/ShareButtons';
import { PostCard } from '@/components/ContentCards';
import { fdb as db } from '@/lib/firebaseDB';
import { Post } from '@/types/database';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BookNoteDetail({ params }: PageProps) {
  const { slug } = use(params);
  const [note, setNote] = useState<Post | null>(null);
  const [relatedNotes, setRelatedNotes] = useState<Post[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadData() {
      const found = await db.getPostBySlug(slug);
      if (found && found.type === 'book-note') {
        setNote(found);
        setFavCount(found.favorites);
        await db.incrementViews(found.id, found.views);

        // Fetch related book notes
        const all = await db.getPosts(false);
        const related = all
          .filter(p => p.type === 'book-note' && p.id !== found.id)
          .slice(0, 2);
        setRelatedNotes(related);
      }
    }
    loadData();
  }, [slug, mounted]);

  if (!note) {
    return (
      <>
        <div className="flex-grow flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto px-4">
          <BookOpen className="h-12 w-12 text-coffee-light/40 animate-pulse mb-4" />
          <h2 className="font-serif text-2xl font-bold text-coffee-dark">Book Note Not Found</h2>
          <p className="text-sm text-coffee-light mt-1">This book reflection could not be found. Pull up a chair and try another search.</p>
          <Link href="/book-notes" className="mt-6 bg-coffee-dark text-cream-light px-6 py-2.5 rounded text-xs uppercase font-bold tracking-wider">
            Back to Book Notes
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleFavorite = async () => {
    if (!isFavorited && note) {
      await db.incrementFavorites(note.id, note.favorites);
      setFavCount(prev => prev + 1);
      setIsFavorited(true);
    }
  };

  return (
    <>
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Back navigation */}
        <Link
          href="/book-notes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-coffee-light hover:text-coffee-dark transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Book Notes</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-coffee-light">
            <span className="px-3 py-1 bg-coffee-light/5 border border-coffee-light/10 rounded-full">
              {note.category}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-coffee-dark tracking-tight leading-tight">
            {note.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-coffee-light pt-2 border-y border-coffee-light/10 py-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Coffee className="h-3.5 w-3.5" />
              {note.readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {note.views + 1} views
            </span>
            <button
              onClick={handleFavorite}
              className={`flex items-center gap-1 p-0.5 rounded transition-colors hover:text-red-500 ${
                isFavorited ? 'text-red-500 font-bold' : ''
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isFavorited ? 'fill-current' : ''}`} />
              <span>{favCount} favorites</span>
            </button>
          </div>
        </header>

        {/* Cover Image */}
        {note.coverImage && (
          <div className="rounded-xl overflow-hidden border border-coffee-light/10 aspect-[21/9] w-full shadow-md vintage-border">
            <img
              src={note.coverImage}
              alt={note.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Main Content Body */}
        <article className="prose prose-coffee max-w-none text-base sm:text-lg leading-relaxed text-coffee-dark/95 font-serif space-y-6 whitespace-pre-wrap pl-1">
          {/* Support formatting quotes in markdown: we render Markdown headings and lists */}
          <div className="prose-headings:font-serif prose-headings:font-bold prose-h3:text-xl prose-h3:text-coffee-dark prose-blockquote:border-l-4 prose-blockquote:border-terracotta prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-coffee-light prose-ol:list-decimal prose-ol:pl-6 prose-ul:list-disc prose-ul:pl-6">
            {note.content}
          </div>
        </article>

        {/* Interaction Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-b border-coffee-light/15 py-6 gap-6">
          <RatingStars postId={note.id} />
          <ShareButtons title={note.title} slug={note.slug} type="book-notes" />
        </div>

        {/* RELATED BOOK NOTES */}
        {relatedNotes.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="font-serif text-2xl font-bold">More Book Reflections</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedNotes.map((related) => (
                <PostCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        )}

        {/* COMMENTS SECTION */}
        <CommentSection postId={note.id} />

      </main>

      <Footer />
    </>
  );
}
