'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee, Calendar, Eye, Mail, Heart } from 'lucide-react';

import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import ShareButtons from '@/components/ShareButtons';
import { fdb as db } from '@/lib/firebaseDB';
import { Post } from '@/types/database';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function WeeklyBrewDetail({ params }: PageProps) {
  const { slug } = use(params);
  const [brew, setBrew] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadData() {
      const found = await db.getPostBySlug(slug);
      if (found && found.type === 'weekly-brew') {
        setBrew(found);
        setLikeCount(found.favorites);
        await db.incrementViews(found.id, found.views);
      }
    }
    loadData();
  }, [slug, mounted]);

  if (!brew) {
    return (
      <>
        <div className="flex-grow flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto px-4">
          <Mail className="h-12 w-12 text-coffee-light/40 animate-pulse mb-4" />
          <h2 className="font-serif text-2xl font-bold text-coffee-dark">Letter Not Found</h2>
          <p className="text-sm text-coffee-light mt-1">This weekly brew could not be found. Check back on Sunday mornings for the latest update.</p>
          <Link href="/weekly-brew" className="mt-6 bg-coffee-dark text-cream-light px-6 py-2.5 rounded text-xs uppercase font-bold tracking-wider">
            Back to Archive
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleLike = async () => {
    if (!isLiked && brew) {
      await db.incrementFavorites(brew.id, brew.favorites);
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <>
      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Back navigation */}
        <Link
          href="/weekly-brew"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-coffee-light hover:text-coffee-dark transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Archive</span>
        </Link>

        {/* Letter Frame */}
        <article className="bg-cream-dark/30 border border-coffee-light/10 rounded-xl p-6 sm:p-10 vintage-border space-y-8 relative">
          
          {/* Top Stamp decor */}
          <div className="absolute top-4 right-4 sm:right-8 bg-amber-100/40 border border-dashed border-coffee-light/35 p-3 rounded rotate-[4deg] text-center select-none shadow-sm">
            <span className="text-[8px] uppercase tracking-widest text-coffee-light block font-bold">Sunday Mail</span>
            <span className="font-serif text-xs font-bold text-coffee-dark">{mounted ? new Date(brew.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }) : ''}</span>
          </div>

          {/* Header */}
          <div className="space-y-3 pt-6 sm:pt-0 max-w-sm sm:max-w-md">
            <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta">
              Sunday Morning Brew
            </span>
            <h1 className="font-serif text-3xl font-bold text-coffee-dark tracking-tight leading-tight">
              {brew.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-coffee-light">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {mounted ? new Date(brew.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              </span>
              <span className="flex items-center gap-1">
                <Coffee className="h-3.5 w-3.5" />
                {brew.readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {brew.views + 1} views
              </span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-coffee-light/10" />

          {/* Letter Body (with custom headings styling) */}
          <div className="font-serif text-base leading-relaxed text-coffee-dark/95 space-y-6 whitespace-pre-wrap pl-1 prose-headings:font-serif prose-headings:font-bold prose-headings:text-lg prose-headings:text-coffee-dark prose-headings:mt-6 prose-headings:border-b prose-headings:border-coffee-light/5 prose-headings:pb-1">
            {brew.content}
          </div>

          {/* Photo illustration placeholder if there's coverImage */}
          {brew.coverImage && (
            <div className="relative rounded overflow-hidden border border-coffee-light/10 aspect-[4/3] w-full max-w-md mx-auto shadow-inner bg-cream-light p-2.5 rotate-[-0.5deg]">
              <div className="w-full h-full rounded overflow-hidden relative">
                <img src={brew.coverImage} alt="Weekly photo" className="object-cover w-full h-full" />
              </div>
              <p className="text-center font-serif text-[10px] text-coffee-light italic mt-1.5">
                A snapshot from this week
              </p>
            </div>
          )}

          <div className="border-t border-coffee-light/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-serif text-xs italic text-coffee-light">Write to me by leaving a reflection below...</span>
            <span className="font-serif text-sm font-semibold text-coffee-dark">— Aria Thorne</span>
          </div>

        </article>

        {/* Interaction Panel */}
        <div className="flex items-center justify-between border-t border-b border-coffee-light/10 py-4 px-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs font-bold transition-all ${
              isLiked ? 'text-red-500 scale-105' : 'text-coffee-light hover:text-coffee-dark'
            }`}
          >
            <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount} likes</span>
          </button>
          
          <ShareButtons title={brew.title} slug={brew.slug} type="weekly-brew" />
        </div>

        {/* COMMENTS SECTION */}
        <CommentSection postId={brew.id} />
      </main>

      <Footer />
    </>
  );
}
