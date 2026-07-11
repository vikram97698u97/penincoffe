import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://penincoffee.com';
  
  // Static pages
  const staticPaths = [
    '',
    '/stories',
    '/poetry',
    '/book-notes',
    '/weekly-brew',
    '/coffee-table',
    '/letters-to-strangers',
    '/behind-the-pen',
    '/contact',
    '/privacy-policy',
    '/terms',
  ];

  const staticUrls = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  // Dynamic posts slugs
  const posts = db.getPosts(false);
  const dynamicUrls = posts.map((post) => {
    let folder = 'stories';
    if (post.type === 'poem') folder = 'poetry';
    else if (post.type === 'book-note') folder = 'book-notes';
    else if (post.type === 'weekly-brew') folder = 'weekly-brew';

    return {
      url: `${baseUrl}/${folder}/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [...staticUrls, ...dynamicUrls];
}
