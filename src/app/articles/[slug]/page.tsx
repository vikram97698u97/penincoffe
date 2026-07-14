'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee, Heart, Calendar, Eye, Clock, User, Share2 } from 'lucide-react';

import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import ShareButtons from '@/components/ShareButtons';
import { fdb as db } from '@/lib/firebaseDB';
import { Post } from '@/types/database';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticleDetail({ params }: PageProps) {
  const { slug } = use(params);
  const [article, setArticle] = useState<Post | null>(null);
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
      if (found && (found.type === 'article' || found.type === 'poem')) {
        setArticle(found);
        setLikeCount(found.favorites || 0);
        await db.incrementViews(found.id, found.views || 0);
      }
    }
    loadData();
  }, [slug, mounted]);

  if (!article) {
    return (
      <>
        <div className="flex-grow flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto px-4">
          <Coffee className="h-12 w-12 text-coffee-light/40 animate-pulse mb-4" />
          <h2 className="font-serif text-2xl font-bold text-coffee-dark">Article Not Found</h2>
          <p className="text-sm text-coffee-light mt-1">This article could not be found. Grab a fresh cup and explore all articles.</p>
          <Link href="/articles" className="mt-6 bg-coffee-dark text-cream-light px-6 py-2.5 rounded text-xs uppercase font-bold tracking-wider">
            Back to Articles
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleLike = async () => {
    if (!isLiked && article) {
      await db.incrementFavorites(article.id, article.favorites || 0);
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <>
      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Back navigation */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-coffee-light hover:text-coffee-dark transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Link>

        {/* Article Header */}
        <article className="space-y-8">
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
                {article.category || 'Technology'}
              </span>
              {article.featured && (
                <span className="text-[10px] uppercase font-bold tracking-widest text-cream-light bg-terracotta px-3 py-1 rounded-full shadow-sm">
                  ★ Featured
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-coffee-dark tracking-tight leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 text-xs text-coffee-light pt-2 border-b border-coffee-light/10 pb-6 font-medium">
              <span className="flex items-center gap-1.5 text-coffee-dark">
                <User className="h-3.5 w-3.5 text-terracotta" />
                <span>{article.authorName || 'Aria Vance'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(article.scheduledDate || article.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{article.readingTime || 3} min read</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>{(article.views || 0) + 1} views</span>
              </span>
            </div>
          </div>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-coffee-light/20 relative">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt callout */}
          {article.excerpt && (
            <div className="bg-cream-dark/60 border-l-4 border-terracotta p-6 rounded-r-xl font-serif italic text-coffee-dark text-base sm:text-lg leading-relaxed">
              {article.excerpt}
            </div>
          )}

          {/* Body Content */}
          <div className="font-serif text-lg sm:text-xl text-coffee-dark leading-relaxed whitespace-pre-wrap py-4 tracking-wide space-y-6 select-text">
            {article.content}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t border-coffee-light/15">
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-cream-dark border border-coffee-light/20 text-coffee-dark px-3 py-1 rounded-full font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Interaction Panel */}
        <div className="flex items-center justify-between border-t border-b border-coffee-light/10 py-5 px-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-xs font-bold transition-all px-4 py-2 rounded-full border ${
              isLiked
                ? 'text-red-500 border-red-200 bg-red-50 scale-105'
                : 'text-coffee-dark border-coffee-light/20 bg-cream-dark hover:bg-coffee-light/10'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount} likes</span>
          </button>

          <ShareButtons title={article.title} slug={article.slug} type="articles" />
        </div>

        {/* COMMENTS SECTION */}
        <CommentSection postId={article.id} />
      </main>

      <Footer />
    </>
  );
}
