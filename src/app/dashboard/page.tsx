'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Mail,
  Heart,
  MessageSquare,
  Eye,
  ArrowRight,
  Coffee,
  Check,
  X,
  Plus
} from 'lucide-react';
import { fdb as db } from '@/lib/firebaseDB';
import { Comment, Letter } from '@/types/database';

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [pendingLetters, setPendingLetters] = useState<Letter[]>([]);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadData() {
      // Fetch metrics
      setStats(await db.getAnalytics());

      // Fetch unmoderated comments
      const comments = await db.getComments(undefined, true);
      setPendingComments(comments.filter(c => !c.approved).slice(0, 3));

      // Fetch unmoderated letters
      const letters = await db.getLetters(true);
      setPendingLetters(letters.filter(l => !l.approved).slice(0, 3));
    }
    loadData();
  }, [refreshToggle, mounted]);

  const approveComment = async (id: string) => {
    await db.approveComment(id);
    setRefreshToggle(!refreshToggle);
  };

  const rejectComment = async (id: string) => {
    await db.rejectOrDeleteComment(id);
    setRefreshToggle(!refreshToggle);
  };

  const approveLetter = async (id: string) => {
    await db.approveLetter(id);
    setRefreshToggle(!refreshToggle);
  };

  const rejectLetter = async (id: string) => {
    await db.rejectLetter(id);
    setRefreshToggle(!refreshToggle);
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-24">
        <Coffee className="h-8 w-8 text-coffee-light animate-spin" />
        <span className="text-sm font-serif italic text-coffee-light ml-2">Loading metrics...</span>
      </div>
    );
  }

  const metrics = [
    { label: 'Page Views', value: stats.views, icon: Eye, color: 'text-blue-600 bg-blue-50' },
    { label: 'Newsletter Subs', value: stats.subscribers, icon: Mail, color: 'text-purple-600 bg-purple-50' },
    { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'text-amber-600 bg-amber-50' },
    { label: 'Stories', value: stats.stories, icon: Coffee, color: 'text-green-600 bg-green-50' },
    { label: 'Articles', value: (stats as any).articles || stats.poems, icon: FeatherIcon, color: 'text-pink-600 bg-pink-50' },
    { label: 'Weekly Brews', value: stats.weeklyBrews, icon: Mail, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Letters Received', value: stats.letters, icon: Heart, color: 'text-red-600 bg-red-50' },
    { label: 'Comments Left', value: stats.comments, icon: MessageSquare, color: 'text-teal-600 bg-teal-50' }
  ];

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-coffee-dark">Overview Metrics</h1>
          <p className="text-xs text-coffee-light font-medium">Detailed usage statistics for Pen in Coffee.</p>
        </div>
        <Link
          href="/dashboard/posts?new=true"
          className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 vintage-border border-coffee-dark"
        >
          <Plus className="h-4 w-4" />
          <span>Write New Post</span>
        </Link>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-cream-dark/30 border border-coffee-light/10 p-5 rounded-lg flex items-center gap-4 shadow-sm">
              <div className={`p-3 rounded-full ${metric.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-coffee-light">{metric.label}</p>
                <p className="text-2xl font-bold text-coffee-dark mt-0.5">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODERATION REVIEWS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Letters Moderation */}
        <div className="bg-cream-dark/20 border border-coffee-light/10 rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-baseline border-b border-coffee-light/10 pb-2">
            <h3 className="font-serif text-lg font-bold text-coffee-dark">Letters Slipped in Box</h3>
            <Link href="/dashboard/letters" className="text-xs text-terracotta hover:underline font-semibold flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {pendingLetters.length === 0 ? (
            <p className="text-xs font-serif italic text-coffee-light py-4 text-center">
              All clear! No anonymous letters awaiting approval.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingLetters.map((l) => (
                <div key={l.id} className="bg-cream-light p-4 rounded border border-coffee-light/10 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-coffee-light border-b border-coffee-light/5 pb-1">
                    <span>FROM: {l.nickname} ({l.category})</span>
                    <span>{new Date(l.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-serif text-xs italic text-coffee-dark line-clamp-2">"{l.message}"</p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => rejectLetter(l.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Reject letter"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => approveLetter(l.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Approve letter"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments Moderation */}
        <div className="bg-cream-dark/20 border border-coffee-light/10 rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-baseline border-b border-coffee-light/10 pb-2">
            <h3 className="font-serif text-lg font-bold text-coffee-dark">Pending Reflections</h3>
            <Link href="/dashboard/comments" className="text-xs text-terracotta hover:underline font-semibold flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {pendingComments.length === 0 ? (
            <p className="text-xs font-serif italic text-coffee-light py-4 text-center">
              All clear! No comments awaiting moderation.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingComments.map((c) => (
                <div key={c.id} className="bg-cream-light p-4 rounded border border-coffee-light/10 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-coffee-light border-b border-coffee-light/5 pb-1">
                    <span>{c.nickname} (Felt: {c.feeling})</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-serif text-xs italic text-coffee-dark line-clamp-2">"{c.content}"</p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => rejectComment(c.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Reject reflection"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => approveComment(c.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Approve reflection"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// Simple placeholder feather icon since Lucide sometimes differs
function FeatherIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
      <line x1="16" y1="8" x2="2" y2="22"></line>
      <line x1="17.5" y1="15" x2="9" y2="15"></line>
    </svg>
  );
}
