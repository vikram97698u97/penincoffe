'use client';

import { useState, useEffect } from 'react';
import { Heart, Check, X, MessageSquare, ChevronDown, ChevronUp, Coffee } from 'lucide-react';
import { fdb as db } from '@/lib/firebaseDB';
import { Letter } from '@/types/database';

export default function LettersDashboard() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    async function load() {
      const all = await db.getLetters(true);
      
      let result = all;
      if (filter === 'pending') {
        result = all.filter(l => !l.approved);
      } else if (filter === 'approved') {
        result = all.filter(l => l.approved);
      }

      setLetters(result);
    }
    load();
  }, [filter, refreshToggle]);

  const handleApprove = async (id: string) => {
    await db.approveLetter(id);
    setRefreshToggle(!refreshToggle);
  };

  const handleReject = async (id: string) => {
    if (confirm('Delete this letter permanently?')) {
      await db.rejectLetter(id);
      setRefreshToggle(!refreshToggle);
    }
  };

  const handleSaveReply = async (id: string) => {
    if (!replyText.trim()) return;
    
    await db.replyToLetter(id, replyText.trim());
    setReplyingId(null);
    setReplyText('');
    setRefreshToggle(!refreshToggle);
  };

  const toggleReplyBox = (id: string, currentReply = '') => {
    if (replyingId === id) {
      setReplyingId(null);
      setReplyText('');
    } else {
      setReplyingId(id);
      setReplyText(currentReply);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-coffee-light/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-coffee-dark">Letters Moderation</h1>
          <p className="text-xs text-coffee-light">Review and reply to anonymous confessions, regrets, dreams, and goodbyes.</p>
        </div>

        {/* Filters */}
        <div className="flex bg-cream-dark p-0.5 rounded border border-coffee-light/15 text-xs font-semibold">
          {[
            { value: 'pending', label: 'Pending Approval' },
            { value: 'approved', label: 'Approved' },
            { value: 'all', label: 'All Letters' }
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

      {/* LETTERS GRID FEED */}
      {letters.length === 0 ? (
        <div className="text-center py-16 bg-cream-dark/20 border border-dashed border-coffee-light/10 rounded-lg">
          <Heart className="h-10 w-10 text-coffee-light/30 mx-auto mb-2" />
          <p className="text-sm font-serif italic text-coffee-light">No letters found in this queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {letters.map((letter) => (
            <div
              key={letter.id}
              className={`bg-cream-dark/15 border rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-sm ${
                letter.approved ? 'border-coffee-light/10' : 'border-dashed border-terracotta/40 bg-amber-50/20'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-coffee-light border-b border-coffee-light/5 pb-2">
                  <span>FROM: {letter.nickname} ({letter.category})</span>
                  <span>{new Date(letter.createdAt).toLocaleDateString()}</span>
                </div>
                
                <p className="font-serif text-xs italic text-coffee-dark/90 leading-relaxed whitespace-pre-wrap">
                  "{letter.message}"
                </p>

                {letter.reply && (
                  <div className="bg-cream-light/60 p-3.5 rounded border border-coffee-light/5 text-xs text-coffee-light font-serif italic space-y-1 mt-3">
                    <p className="text-[9px] uppercase font-bold text-terracotta tracking-wider">Aria's Reply</p>
                    <p className="pl-1">"{letter.reply}"</p>
                  </div>
                )}
              </div>

              {/* Actions & Reply box toggler */}
              <div className="border-t border-coffee-light/5 pt-3 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase">
                    Status: {letter.approved ? <span className="text-green-700">Approved</span> : <span className="text-amber-700">Pending</span>}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleReplyBox(letter.id, letter.reply)}
                      className={`px-2.5 py-1.5 bg-cream-light border border-coffee-light/15 hover:bg-cream-dark rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        replyingId === letter.id ? 'border-terracotta text-terracotta' : 'text-coffee-light hover:text-coffee-dark'
                      }`}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{letter.reply ? 'Edit Reply' : 'Write Reply'}</span>
                      {replyingId === letter.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    
                    {!letter.approved && (
                      <button
                        onClick={() => handleApprove(letter.id)}
                        className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded transition-colors flex items-center justify-center border border-green-200"
                        title="Approve letter"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleReject(letter.id)}
                      className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded transition-colors flex items-center justify-center border border-red-200"
                      title="Delete letter"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Reply text box */}
                {replyingId === letter.id && (
                  <div className="space-y-2 p-2 bg-cream-light border border-coffee-light/10 rounded animate-fade-in">
                    <label className="text-[9px] uppercase font-bold text-coffee-light block">Compose Gentle Response</label>
                    <textarea
                      rows={3}
                      required
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your response to the stranger..."
                      className="w-full px-3 py-2 bg-cream-dark/10 border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark font-serif italic"
                    ></textarea>
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setReplyingId(null)}
                        className="px-2 py-1 bg-cream-dark/20 text-coffee-dark hover:bg-cream-dark/30 rounded text-[9px] font-bold uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveReply(letter.id)}
                        className="px-2 py-1 bg-coffee-dark text-cream-light hover:bg-coffee-light rounded text-[9px] font-bold uppercase"
                      >
                        Save Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
