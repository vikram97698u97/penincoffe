'use client';

import { Suspense } from 'react';
import { Coffee } from 'lucide-react';
import ArticleManager from '@/components/ArticleManager';

export default function ArticlesDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Coffee className="h-8 w-8 text-coffee-light animate-spin" />
        <span className="text-sm font-serif italic text-coffee-light ml-2">Loading articles management...</span>
      </div>
    }>
      <ArticleManager />
    </Suspense>
  );
}
