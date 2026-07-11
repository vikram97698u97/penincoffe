import React from 'react';
import { db } from '@/lib/db';

export async function generateStaticParams() {
  const posts = db.getPosts(false).filter((p) => p.type === 'article' || p.type === 'poem');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function ArticlesSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
