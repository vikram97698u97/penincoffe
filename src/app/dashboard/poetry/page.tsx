'use client';

import { Suspense } from 'react';
import { Coffee } from 'lucide-react';
import PostManager from '@/components/PostManager';

export default function PoetryDashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Coffee className="h-8 w-8 text-coffee-light animate-spin" />
        <span className="text-sm font-serif italic text-coffee-light ml-2">Loading poetry...</span>
      </div>
    }>
      <PostManager filterType="poem" />
    </Suspense>
  );
}
