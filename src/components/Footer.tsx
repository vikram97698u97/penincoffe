'use client';

import Link from 'next/link';
import { Coffee, Mail, Heart } from 'lucide-react';
import { fdb as db } from '@/lib/firebaseDB';
import { useState, useEffect } from 'react';
import { Settings } from '@/types/database';

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    db.getSettings().then(setSettings);
  }, []);

  if (!settings) return null;

  return (
    <footer className="bg-cream-dark border-t border-coffee-light/20 text-coffee-dark mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-coffee-dark text-cream-light rounded-full">
                <Coffee className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-coffee-dark">
                {settings.siteName}
              </span>
            </Link>
            <p className="text-sm text-coffee-light max-w-sm font-serif italic">
              "{settings.mission}"
            </p>
            <div className="flex items-center gap-4 text-coffee-light">
              {settings.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-coffee-dark transition-colors"
                >
                  <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {settings.twitter && (
                <a
                  href={`https://twitter.com/${settings.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-coffee-dark transition-colors"
                >
                  <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
              )}
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-coffee-dark transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-coffee-light font-bold mb-4 font-serif">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/stories" className="text-coffee-light hover:text-coffee-dark transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/poetry" className="text-coffee-light hover:text-coffee-dark transition-colors">
                  Poetry
                </Link>
              </li>
              <li>
                <Link href="/book-notes" className="text-coffee-light hover:text-coffee-dark transition-colors">
                  Book Notes
                </Link>
              </li>
              <li>
                <Link href="/weekly-brew" className="text-coffee-light hover:text-coffee-dark transition-colors">
                  Weekly Brew
                </Link>
              </li>
              <li>
                <Link href="/coffee-table" className="text-coffee-light hover:text-coffee-dark transition-colors">
                  Coffee Table
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-coffee-light font-bold mb-4 font-serif">Sanctuary</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/letters-to-strangers" className="text-coffee-light hover:text-coffee-dark transition-colors">
                  Letters to Strangers
                </Link>
              </li>
              <li>
                <Link href="/behind-the-pen" className="text-coffee-light hover:text-coffee-dark transition-colors">
                  Behind the Pen
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-coffee-light hover:text-coffee-dark transition-colors">
                  Contact Aria
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-coffee-light hover:text-coffee-dark transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-coffee-light hover:text-coffee-dark transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-coffee-light/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-coffee-light">
          <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Brewed with <Heart className="h-3 w-3 text-terracotta fill-terracotta animate-pulse" /> and honesty for readers & writers.
          </p>
        </div>
      </div>
    </footer>
  );
}
