'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee, Heart, Calendar, Eye } from 'lucide-react';

import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import ShareButtons from '@/components/ShareButtons';
import { fdb as db } from '@/lib/firebaseDB';
import { Post } from '@/types/database';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PoemDetail({ params }: PageProps) {
  const { slug } = use(params);
  const [poem, setPoem] = useState<Post | null>(null);
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
      if (found && found.type === 'poem') {
        setPoem(found);
        setLikeCount(found.favorites);
        await db.incrementViews(found.id, found.views);
      }
    }
    loadData();
  }, [slug, mounted]);

  if (!poem) {
    return (
      <>
        <div className="flex-grow flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto px-4">
          <Coffee className="h-12 w-12 text-coffee-light/40 animate-pulse mb-4" />
          <h2 className="font-serif text-2xl font-bold text-coffee-dark">Poem Not Found</h2>
          <p className="text-sm text-coffee-light mt-1">This poem could not be found. Grab a fresh cup and search again.</p>
          <Link href="/poetry" className="mt-6 bg-coffee-dark text-cream-light px-6 py-2.5 rounded text-xs uppercase font-bold tracking-wider">
            Back to Poetry
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleLike = async () => {
    if (!isLiked && poem) {
      await db.incrementFavorites(poem.id, poem.favorites);
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <>
      <main className="flex-grow max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Back navigation */}
        <Link
          href="/poetry"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-coffee-light hover:text-coffee-dark transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Poetry</span>
        </Link>

        {/* Poem Canvas */}
        <article className="bg-cream-dark/40 border border-coffee-light/10 rounded-xl p-8 sm:p-12 vintage-border text-center space-y-8 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="w-16 h-[1px] bg-coffee-light/20 mx-auto" />

          {/* Header */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
              {poem.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-dark tracking-tight leading-tight">
              {poem.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-[10px] text-coffee-light pt-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(poem.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {poem.views + 1} reads
              </span>
            </div>
          </div>

          {/* Body (Distraction Free Serif Poem stanzas) */}
          <div className="font-serif text-lg sm:text-xl italic text-coffee-dark leading-extra-loose whitespace-pre-wrap py-6 max-w-md mx-auto tracking-wide pl-1 select-none">
            {poem.content}
          </div>

          <div className="w-16 h-[1px] bg-coffee-light/20 mx-auto" />
          
          <p className="text-xs text-coffee-light/50 font-serif italic">— Aria Thorne</p>
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
            <span>{likeCount} favorited</span>
          </button>
          
          <ShareButtons title={poem.title} slug={poem.slug} type="poetry" />
        </div>

        {/* COMMENTS SECTION */}
        <CommentSection postId={poem.id} />
      </main>

      <Footer />
    </>
  );
}
