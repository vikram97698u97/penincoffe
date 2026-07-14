'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Coffee, Heart, Calendar, Eye, Bookmark, MessageSquare } from 'lucide-react';

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

export default function StoryDetail({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadData() {
      const foundPost = await db.getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        setFavCount(foundPost.favorites);
        await db.incrementViews(foundPost.id, foundPost.views);

        // Fetch related posts (same type, matching category, excluding current post)
        const all = await db.getPosts(false);
        const related = all
          .filter(p => p.type === 'story' && p.id !== foundPost.id && p.category === foundPost.category)
          .slice(0, 2);
        
        // Fallback to general stories if none share the category
        if (related.length === 0) {
          setRelatedPosts(all.filter(p => p.type === 'story' && p.id !== foundPost.id).slice(0, 2));
        } else {
          setRelatedPosts(related);
        }
      }
    }
    loadData();
  }, [slug, mounted]);

  // Scroll Progress Listener
  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  if (!post) {
    return (
      <>
        <div className="flex-grow flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto px-4">
          <Coffee className="h-12 w-12 text-coffee-light/40 animate-pulse mb-4" />
          <h2 className="font-serif text-2xl font-bold text-coffee-dark">Story Not Found</h2>
          <p className="text-sm text-coffee-light mt-1">This story might have been removed, drafted, or brewed under a different name.</p>
          <Link href="/stories" className="mt-6 bg-coffee-dark text-cream-light px-6 py-2.5 rounded text-xs uppercase font-bold tracking-wider">
            Back to Stories
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleFavorite = async () => {
    if (!isFavorited && post) {
      await db.incrementFavorites(post.id, post.favorites);
      setFavCount(prev => prev + 1);
      setIsFavorited(true);
    }
  };

  return (
    <>
      {/* Scroll Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-terracotta z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Back navigation */}
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-coffee-light hover:text-coffee-dark transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Stories</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-6 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-coffee-light">
            <span className="px-3 py-1 bg-coffee-light/5 border border-coffee-light/10 rounded-full">
              {post.category}
            </span>
            {post.mood && (
              <span className="px-3 py-1 bg-terracotta/10 text-terracotta border border-terracotta/10 rounded-full">
                {post.mood}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-coffee-dark tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-coffee-light pt-2 border-y border-coffee-light/10 py-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {mounted ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
            </span>
            <span className="flex items-center gap-1">
              <Coffee className="h-3.5 w-3.5 animate-pulse" />
              {post.readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.views + 1} views
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
        {post.coverImage && (
          <div className="rounded-xl overflow-hidden border border-coffee-light/10 aspect-[21/9] w-full shadow-md vintage-border">
            <img
              src={post.coverImage}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Main Content Body */}
        <article className="prose prose-coffee max-w-none text-base sm:text-lg leading-relaxed text-coffee-dark/95 font-serif space-y-6 whitespace-pre-wrap pl-1">
          {/* Custom style logic: apply special class to first paragraph for drop-caps */}
          <div className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-terracotta first-letter:font-serif first-letter:mt-1">
            {post.content}
          </div>
        </article>

        {/* Interaction Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-b border-coffee-light/15 py-6 gap-6">
          <RatingStars postId={post.id} />
          <ShareButtons title={post.title} slug={post.slug} type="stories" />
        </div>

        {/* RELATED STORIES */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="font-serif text-2xl font-bold">Related Brews</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <PostCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        )}

        {/* COMMENTS SECTION */}
        <CommentSection postId={post.id} />

      </main>

      <Footer />
    </>
  );
}
