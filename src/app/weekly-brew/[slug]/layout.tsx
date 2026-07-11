import React from 'react';
import { db } from '@/lib/db';

export async function generateStaticParams() {
  const posts = db.getPosts(false).filter((p) => p.type === 'weekly-brew');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function WeeklyBrewSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
