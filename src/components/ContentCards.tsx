'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Heart, Share2, MessageSquare, Coffee, Bookmark, Pin } from 'lucide-react';
import { Post, Letter, CoffeeTableItem, BookShelfItem } from '@/types/database';
import { fdb as db } from '@/lib/firebaseDB';

// ----------------------------------------------------
// POST CARD (FOR STORIES & ARTICLES)
// ----------------------------------------------------
export function PostCard({ post }: { post: Post }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(post.favorites);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isFavorited) {
      await db.incrementFavorites(post.id, post.favorites);
      setFavCount(prev => prev + 1);
      setIsFavorited(true);
    }
  };

  if (!mounted) {
    return (
      <article className="group bg-cream-dark border border-coffee-light/10 rounded-lg overflow-hidden vintage-border transition-all flex flex-col h-full">
        {post.coverImage && (
          <Link href={`/${post.type === 'book-note' ? 'book-notes' : post.type === 'weekly-brew' ? 'weekly-brew' : 'stories'}/${post.slug}`} className="block relative h-48 w-full overflow-hidden border-b border-coffee-light/10">
            <img
              src={post.coverImage}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </Link>
        )}
        <div className="p-5 flex flex-col flex-grow space-y-3">
          <div className="animate-pulse h-6 bg-coffee-light/10 rounded w-3/4"></div>
          <div className="animate-pulse h-4 bg-coffee-light/10 rounded w-full"></div>
          <div className="animate-pulse h-4 bg-coffee-light/10 rounded w-2/3"></div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-cream-dark border border-coffee-light/10 rounded-lg overflow-hidden vintage-border transition-all flex flex-col h-full">
      {post.coverImage && (
        <Link href={`/${post.type === 'book-note' ? 'book-notes' : post.type === 'weekly-brew' ? 'weekly-brew' : 'stories'}/${post.slug}`} className="block relative h-48 w-full overflow-hidden border-b border-coffee-light/10">
          <img
            src={post.coverImage}
            alt={post.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          {post.featured && (
            <div className="absolute top-3 left-3 bg-terracotta text-cream-light text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-1">
              <Pin className="h-3 w-3" />
              <span>Featured</span>
            </div>
          )}
        </Link>
      )}

      <div className="p-6 flex flex-col flex-grow space-y-3">
        {/* Category & Read Time */}
        <div className="flex items-center justify-between text-xs text-coffee-light font-medium">
          <span className="px-2 py-0.5 bg-coffee-light/5 border border-coffee-light/15 rounded-full text-[10px] uppercase tracking-wider">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Coffee className="h-3.5 w-3.5" />
            <span>{post.readingTime} min read</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-terracotta transition-colors line-clamp-2 break-words">
          <Link href={`/${post.type === 'book-note' ? 'book-notes' : post.type === 'weekly-brew' ? 'weekly-brew' : 'stories'}/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-coffee-light/90 line-clamp-3 font-serif italic">
          {post.excerpt}
        </p>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-coffee-light/5 mt-auto">
          <Link
            href={`/${post.type === 'book-note' ? 'book-notes' : post.type === 'weekly-brew' ? 'weekly-brew' : 'stories'}/${post.slug}`}
            className="text-xs font-bold text-coffee-dark hover:text-terracotta transition-colors uppercase tracking-wider flex items-center gap-1"
          >
            <span>Read More</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleFavorite}
              className={`flex items-center gap-1 text-xs transition-colors p-1.5 rounded-full hover:bg-coffee-light/5 ${
                isFavorited ? 'text-red-500' : 'text-coffee-light hover:text-coffee-dark'
              }`}
              title="Add to Favorites"
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              <span>{favCount}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ----------------------------------------------------
// POEM CARD (FOR POETRY LISTS & ARTICLES COMPAT)
// ----------------------------------------------------
export function PoemCard({ poem }: { poem: Post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(poem.favorites);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLiked) {
      await db.incrementFavorites(poem.id, poem.favorites);
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const isArticle = poem.type === 'article';
  const targetRoute = isArticle ? `/articles/${poem.slug}` : `/poetry/${poem.slug}`;

  return (
    <article className="bg-cream-dark border border-coffee-light/10 p-8 rounded-lg vintage-border flex flex-col justify-between h-80 text-center relative group">
      <div className="w-12 h-[1px] bg-coffee-light/30 mx-auto mb-4" />

      <div className="space-y-4 my-auto">
        <span className="text-[10px] uppercase tracking-widest text-coffee-light font-bold">
          {poem.category || 'Article'}
        </span>
        <h3 className="font-serif text-2xl font-bold tracking-tight text-coffee-dark group-hover:text-terracotta transition-colors line-clamp-2 break-words">
          <Link href={targetRoute}>{poem.title}</Link>
        </h3>
        <p className="text-sm font-serif italic text-coffee-light/80 line-clamp-3 max-w-xs mx-auto">
          {poem.excerpt}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-coffee-light/10 pt-4 mt-4 w-full">
        <Link
          href={targetRoute}
          className="text-xs font-bold text-coffee-dark hover:text-terracotta uppercase tracking-wider transition-colors"
        >
          {isArticle ? 'Read Article →' : 'Enter Poem →'}
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className={`p-1.5 rounded-full hover:bg-coffee-light/5 transition-colors ${
              isLiked ? 'text-red-500' : 'text-coffee-light hover:text-coffee-dark'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <span className="text-xs text-coffee-light">{likeCount}</span>
        </div>
      </div>
    </article>
  );
}

// ----------------------------------------------------
// ARTICLE CARD (FOR ARTICLES LISTING)
// ----------------------------------------------------
export function ArticleCard({ article }: { article: Post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.favorites || 0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLiked) {
      await db.incrementFavorites(article.id, article.favorites || 0);
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  if (!mounted) {
    return (
      <article className="bg-cream-dark border border-coffee-light/10 rounded-lg overflow-hidden vintage-border transition-all flex flex-col h-full">
        <div className="p-6 flex flex-col flex-grow space-y-4">
          <div className="animate-pulse h-6 bg-coffee-light/10 rounded w-3/4"></div>
          <div className="animate-pulse h-4 bg-coffee-light/10 rounded w-full"></div>
          <div className="animate-pulse h-4 bg-coffee-light/10 rounded w-2/3"></div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-cream-dark border border-coffee-light/15 rounded-xl overflow-hidden vintage-border flex flex-col justify-between group shadow-sm hover:shadow transition-shadow">
      {article.coverImage ? (
        <Link href={`/articles/${article.slug}`} className="block h-48 overflow-hidden relative">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {article.featured && (
            <span className="absolute top-3 right-3 bg-terracotta text-cream-light text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
              ★ Featured
            </span>
          )}
        </Link>
      ) : (
        article.featured && (
          <div className="px-6 pt-5 pb-0 flex justify-end">
            <span className="bg-terracotta text-cream-light text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
              ★ Featured
            </span>
          </div>
        )
      )}

      <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-coffee-light">
            <span className="bg-cream-light border border-coffee-light/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-coffee-dark">
              {article.category || 'Technology'}
            </span>
            <span className="font-mono text-[11px]">{article.readingTime || 3} min read</span>
          </div>

          <h3 className="font-serif text-xl font-bold tracking-tight text-coffee-dark group-hover:text-terracotta transition-colors leading-snug line-clamp-2 break-words">
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
          </h3>

          <p className="text-xs font-sans text-coffee-light line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-4 border-t border-coffee-light/10 flex items-center justify-between text-xs text-coffee-light gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-coffee-dark">{article.authorName || 'Aria Vance'}</span>
            <span>•</span>
            <span className="font-mono text-[11px]">
              {mounted ? new Date(article.scheduledDate || article.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) : ''}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleLike}
              className={`p-1.5 rounded-full hover:bg-coffee-light/10 transition-colors ${
                isLiked ? 'text-red-500' : 'text-coffee-light hover:text-coffee-dark'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-xs font-mono">{likeCount}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// ----------------------------------------------------
// BOOK CARD (FOR BOOKNOTES & BOOKSHELF)
// ----------------------------------------------------
export function BookCard({ book }: { book: BookShelfItem }) {
  return (
    <div className="bg-cream-dark border border-coffee-light/15 p-5 rounded-lg flex flex-col sm:flex-row gap-5 items-start vintage-border">
      {book.coverImage && (
        <div className="w-24 h-36 relative overflow-hidden rounded shadow border border-coffee-light/20 flex-shrink-0 mx-auto sm:mx-0">
          <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full" />
        </div>
      )}
      <div className="flex-grow space-y-2 text-center sm:text-left">
        <div>
          <h4 className="font-serif text-lg font-bold text-coffee-dark">{book.title}</h4>
          <p className="text-xs text-coffee-light font-medium">by {book.author}</p>
        </div>

        {/* Star Rating */}
        <div className="flex items-center justify-center sm:justify-start gap-0.5 text-terracotta">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${i < book.rating ? 'fill-current' : 'text-coffee-light/25'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {book.review && (
          <p className="text-xs text-coffee-light font-serif italic border-l-2 border-terracotta pl-3 py-1">
            "{book.review}"
          </p>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// LETTER CARD (FOR LETTERS TO STRANGERS)
// ----------------------------------------------------
export function LetterCard({ letter }: { letter: Letter }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="memo-pad p-6 rounded-md border border-coffee-light/20 relative rotate-[-0.5deg]">
        <div className="mt-2 space-y-4">
          <div className="animate-pulse h-4 bg-coffee-light/10 rounded w-1/4"></div>
          <div className="animate-pulse h-16 bg-coffee-light/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="memo-pad p-6 rounded-md border border-coffee-light/20 relative rotate-[-0.5deg] hover:rotate-0 transition-transform">
      {/* Tape decor */}
      <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-16 h-4 bg-amber-100/50 backdrop-blur-[1px] rotate-[2deg] border border-dashed border-coffee-light/10 shadow-sm flex items-center justify-center text-[8px] uppercase tracking-widest text-coffee-light/30">
        Anonymous
      </div>

      <div className="mt-2 space-y-4">
        {/* Category info */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-coffee-light font-bold border-b border-coffee-light/10 pb-1.5">
          <span>{letter.category}</span>
          <span>{mounted ? new Date(letter.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
        </div>

        {/* Message */}
        <p className="font-serif text-sm italic text-coffee-dark/95 leading-relaxed leading-extra whitespace-pre-wrap pl-1">
          "{letter.message}"
        </p>

        {/* Sign */}
        <div className="text-right">
          <span className="font-serif text-xs font-semibold text-coffee-light">— {letter.nickname}</span>
        </div>

        {/* Author Reply Panel */}
        {letter.reply && (
          <div className="bg-cream-light/60 p-4 rounded border-t border-coffee-light/10 mt-4 space-y-2">
            <p className="text-[10px] uppercase font-bold text-terracotta tracking-wider flex items-center gap-1">
              <Coffee className="h-3 w-3" />
              <span>Response from Aria</span>
            </p>
            <p className="font-serif text-xs italic text-coffee-light leading-relaxed pl-1">
              {letter.reply}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// QUOTE CARD (FOR COFFEE TABLE MASONRY)
// ----------------------------------------------------
export function QuoteCard({ item }: { item: CoffeeTableItem }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-cream-dark border border-coffee-light/10 p-6 rounded-lg vintage-border shadow-sm flex flex-col justify-between break-inside-avoid mb-4">
        <div className="space-y-4">
          <div className="animate-pulse h-3 bg-coffee-light/10 rounded w-1/4"></div>
          <div className="animate-pulse h-16 bg-coffee-light/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-dark border border-coffee-light/10 p-6 rounded-lg vintage-border shadow-sm flex flex-col justify-between break-inside-avoid mb-4 group hover:scale-[1.01] transition-transform">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-coffee-light font-bold border-b border-coffee-light/5 pb-2">
          <span>{item.type}</span>
          <span>{mounted ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
        </div>

        {item.type === 'photo' && item.mediaUrl && (
          <div className="relative rounded overflow-hidden border border-coffee-light/10 aspect-[4/3] w-full mb-3">
            <img src={item.mediaUrl} alt="Snippet image" className="object-cover w-full h-full" />
          </div>
        )}

        {item.type === 'song' && item.mediaUrl && (
          <div className="mb-3">
            <iframe
              src={item.mediaUrl}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-md border border-coffee-light/10"
            ></iframe>
          </div>
        )}

        <p className="font-serif text-sm italic text-coffee-dark/95 leading-relaxed">
          {item.type === 'quote' ? item.content : item.content}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-coffee-light/5 text-[10px] text-coffee-light">
        <span className="font-medium">@{item.authorNickname}</span>
        <div className="flex gap-1.5">
          {item.tags.map((tag) => (
            <span key={tag} className="hover:text-coffee-dark transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
