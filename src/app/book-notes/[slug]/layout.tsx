import React from 'react';
import { db } from '@/lib/db';
import { fdb } from '@/lib/firebaseDB';

export async function generateStaticParams() {
  let firebasePosts: any[] = [];
  try {
    firebasePosts = await fdb.getPosts(true);
  } catch (err) {
    console.warn('Failed to fetch firebase posts for generateStaticParams:', err);
  }
  const localPosts = db.getPosts(true);
  const allPosts = [...localPosts, ...firebasePosts].filter((p) => p && p.type === 'book-note');

  const uniqueSlugs = Array.from(new Set(allPosts.map((p) => p.slug))).filter(Boolean);
  return uniqueSlugs.map((slug) => ({
    slug,
  }));
}

export default function BookNoteSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
