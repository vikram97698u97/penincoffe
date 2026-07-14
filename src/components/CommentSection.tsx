'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Heart, CheckCircle2 } from 'lucide-react';
import { Comment } from '@/types/database';
import { fdb as db } from '@/lib/firebaseDB';

const FEELING_OPTIONS = [
  { emoji: '❤️', name: 'Inspired' },
  { emoji: '☕', name: 'Comforted' },
  { emoji: '🍂', name: 'Melancholic' },
  { emoji: '☀️', name: 'Warm' },
  { emoji: '💭', name: 'Pensive' },
  { emoji: '🌿', name: 'Healed' }
];

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState('Inspired');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Load approved comments
    async function load() {
      setComments(await db.getComments(postId, false));
    }
    load();

    // Load liked comments state from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`liked_comments_${postId}`);
      if (stored) setLikedComments(JSON.parse(stored));
    }
  }, [postId, submitted, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;

    await db.addComment({
      postId,
      nickname: nickname.trim(),
      feeling: selectedFeeling,
      content: content.trim()
    });

    setSubmitted(true);
    setNickname('');
    setContent('');
    setSelectedFeeling('Inspired');

    // Auto-clear success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const handleLike = async (id: string) => {
    if (likedComments.includes(id)) return;

    await db.likeComment(id);
    const updatedLikes = [...likedComments, id];
    setLikedComments(updatedLikes);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`liked_comments_${postId}`, JSON.stringify(updatedLikes));
    }
    
    // Increment count locally
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  if (!mounted) {
    return (
      <div className="space-y-6 py-8">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-coffee-light/10 rounded w-1/4"></div>
          <div className="h-16 bg-coffee-light/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-cream-dark/50 border border-coffee-light/10 p-6 md:p-8 rounded-lg">
      <div className="flex items-center gap-2 border-b border-coffee-light/10 pb-4">
        <MessageSquare className="h-5 w-5 text-terracotta" />
        <h3 className="font-serif text-xl font-bold text-coffee-dark">
          Let's talk over coffee
        </h3>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs uppercase font-bold tracking-widest text-coffee-light">
          What did this piece make you feel?
        </p>

        {/* Feelings selector */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {FEELING_OPTIONS.map((option) => (
            <button
              key={option.name}
              type="button"
              onClick={() => setSelectedFeeling(option.name)}
              className={`p-2 rounded text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                selectedFeeling === option.name
                  ? 'bg-coffee-dark text-cream-light border-coffee-dark shadow-sm'
                  : 'bg-cream-light text-coffee-light border-coffee-light/20 hover:border-coffee-light/50'
              }`}
            >
              <span>{option.emoji}</span>
              <span>{option.name}</span>
            </button>
          ))}
        </div>

        {/* Input Details */}
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            required
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Your name or nickname..."
            className="w-full px-4 py-2.5 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm text-coffee-dark transition-all placeholder-coffee-light/40"
          />

          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your reflection here..."
            className="w-full px-4 py-2.5 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm text-coffee-dark transition-all placeholder-coffee-light/40 font-serif italic"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-6 py-2.5 rounded font-medium text-xs uppercase tracking-wider vintage-border border-coffee-dark"
          >
            Leave a Reflection
          </button>
        </div>
      </form>

      {/* Submission Confirmation */}
      {submitted && (
        <div className="bg-sage/10 border border-sage/20 rounded-md p-4 flex items-start gap-3 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-sage mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-coffee-dark">Reflection received!</p>
            <p className="text-[11px] text-coffee-light">Thank you. Your thoughts have been submitted for moderation. They will appear here once approved by the author to keep this space warm and safe.</p>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 pt-6 border-t border-coffee-light/10">
        <p className="text-xs uppercase font-bold tracking-widest text-coffee-light">
          Reader Reflections ({comments.length})
        </p>

        {comments.length === 0 ? (
          <p className="text-xs text-coffee-light font-serif italic py-4">
            No reflections yet. Be the first to share what you felt over this cup.
          </p>
        ) : (
          <div className="space-y-4 divide-y divide-coffee-light/5">
            {comments.map((comment) => (
              <div key={comment.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-coffee-dark">{comment.nickname}</span>
                    <span className="px-2 py-0.5 bg-terracotta/10 text-terracotta border border-terracotta/10 rounded-full text-[9px] font-semibold">
                      Felt {comment.feeling}
                    </span>
                  </div>
                  <span className="text-[10px] text-coffee-light">
                    {mounted ? new Date(comment.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                
                <p className="text-sm font-serif italic text-coffee-light leading-relaxed pl-1">
                  "{comment.content}"
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${
                      likedComments.includes(comment.id)
                        ? 'text-red-500'
                        : 'text-coffee-light hover:text-coffee-dark'
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${likedComments.includes(comment.id) ? 'fill-current' : ''}`} />
                    <span>{comment.likes} {comment.likes === 1 ? 'like' : 'likes'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
