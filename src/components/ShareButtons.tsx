'use client';

import { useState } from 'react';
import { Link2, Check, Share } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  slug: string;
  type: string; // e.g. 'stories', 'poetry', etc.
}

export default function ShareButtons({ title, slug, type }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/${type}/${slug}`;
  };

  const copyToClipboard = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getTwitterShareUrl = () => {
    const text = encodeURIComponent(`Reading "${title}" on Pen in Coffee ☕`);
    const url = encodeURIComponent(getShareUrl());
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  };

  const getFacebookShareUrl = () => {
    const url = encodeURIComponent(getShareUrl());
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase font-bold tracking-widest text-coffee-light mr-1 flex items-center gap-1">
        <Share className="h-3.5 w-3.5" />
        <span>Share:</span>
      </span>

      {/* Twitter */}
      <a
        href={getTwitterShareUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-cream-dark border border-coffee-light/10 hover:border-coffee-light/35 rounded-full hover:bg-coffee-light/5 text-coffee-light hover:text-coffee-dark transition-all"
        title="Share on Twitter"
      >
        <svg className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
      </a>

      {/* Facebook */}
      <a
        href={getFacebookShareUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-cream-dark border border-coffee-light/10 hover:border-coffee-light/35 rounded-full hover:bg-coffee-light/5 text-coffee-light hover:text-coffee-dark transition-all"
        title="Share on Facebook"
      >
        <svg className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
      </a>

      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        className="p-2 bg-cream-dark border border-coffee-light/10 hover:border-coffee-light/35 rounded-full hover:bg-coffee-light/5 text-coffee-light hover:text-coffee-dark transition-all flex items-center justify-center"
        title="Copy Link"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-sage" />
        ) : (
          <Link2 className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
