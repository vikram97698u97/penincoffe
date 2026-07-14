'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Check, X, Coffee } from 'lucide-react';
import { fdb as db } from '@/lib/firebaseDB';
import { Comment } from '@/types/database';

export default function CommentsDashboard() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [postsCache, setPostsCache] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function load() {
      const all = await db.getComments(undefined, true);
      const posts = await db.getPosts(true);
      setPostsCache(posts);
      
      let result = all;
      if (filter === 'pending') {
        result = all.filter(c => !c.approved);
      } else if (filter === 'approved') {
        result = all.filter(c => c.approved);
      }

      setComments(result);
    }
    load();
  }, [filter, refreshToggle, mounted]);

  const handleApprove = async (id: string) => {
    await db.approveComment(id);
    setRefreshToggle(!refreshToggle);
  };

  const handleReject = async (id: string) => {
    if (confirm('Delete this comment permanently?')) {
      await db.rejectOrDeleteComment(id);
      setRefreshToggle(!refreshToggle);
    }
  };

  const getPostTitle = (postId: string) => {
    const post = postsCache.find(p => p.id === postId);
    return post ? post.title : 'Unknown Post';
  };

  const getPostSlug = (postId: string) => {
    const post = postsCache.find(p => p.id === postId);
    if (!post) return '';
    return `/${post.type === 'book-note' ? 'book-notes' : post.type === 'weekly-brew' ? 'weekly-brew' : 'stories'}/${post.slug}`;
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-coffee-light/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-coffee-dark">Comments Moderation</h1>
          <p className="text-xs text-coffee-light">Approve or moderate feelings reflections posted by readers under writing pieces.</p>
        </div>

        {/* Filters */}
        <div className="flex bg-cream-dark p-0.5 rounded border border-coffee-light/15 text-xs font-semibold">
          {[
            { value: 'pending', label: 'Pending Approval' },
            { value: 'approved', label: 'Approved' },
            { value: 'all', label: 'All Comments' }
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as any)}
              className={`px-3 py-1.5 rounded transition-all ${
                filter === opt.value
                  ? 'bg-coffee-dark text-cream-light'
                  : 'text-coffee-light hover:text-coffee-dark'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div className="bg-cream-dark/20 border border-coffee-light/10 rounded-lg overflow-hidden shadow-sm">
        {comments.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-10 w-10 text-coffee-light/30 mx-auto mb-2" />
            <p className="text-sm font-serif italic text-coffee-light">No comments found in this queue.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-coffee-dark text-cream-light font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Reader</th>
                  <th className="px-6 py-4">Reflection Message</th>
                  <th className="px-6 py-4">Article Target</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-light/10 font-medium">
                {comments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-cream-dark/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-coffee-dark">{comment.nickname}</p>
                        <p className="mt-1 flex items-center">
                          <span className="px-2 py-0.5 bg-terracotta/10 text-terracotta border border-terracotta/15 rounded-full text-[9px] font-bold">
                            Felt {comment.feeling}
                          </span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-sm truncate font-serif italic text-coffee-dark">"{comment.content}"</td>
                    <td className="px-6 py-4">
                      <a
                        href={getPostSlug(comment.postId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-terracotta hover:underline font-serif font-bold text-xs"
                      >
                        {getPostTitle(comment.postId)}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-coffee-light">{mounted ? new Date(comment.createdAt).toLocaleDateString() : ''}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {!comment.approved && (
                        <button
                          onClick={() => handleApprove(comment.id)}
                          className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded transition-colors border border-green-200"
                          title="Approve comment"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(comment.id)}
                        className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded transition-colors border border-red-200"
                        title="Delete comment"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
