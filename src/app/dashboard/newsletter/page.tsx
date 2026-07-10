'use client';

import { useState, useEffect } from 'react';
import { Mail, Trash, Clipboard, Check, Search, Coffee } from 'lucide-react';
import { fdb as db } from '@/lib/firebaseDB';

export default function NewsletterDashboard() {
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);

  useEffect(() => {
    async function load() {
      setSubscribers(await db.getNewsletterSubscribers());
    }
    load();
  }, [refreshToggle]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      setFilteredSubs(subscribers.filter(email => email.toLowerCase().includes(q)));
    } else {
      setFilteredSubs(subscribers);
    }
  }, [subscribers, searchQuery]);

  const handleDelete = async (email: string) => {
    if (confirm(`Remove ${email} from the newsletter list?`)) {
      await db.unsubscribeNewsletter(email);
      setRefreshToggle(!refreshToggle);
    }
  };

  const copyToClipboard = () => {
    if (subscribers.length === 0) return;
    const text = subscribers.join(', ');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-coffee-light/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-coffee-dark">Newsletter List</h1>
          <p className="text-xs text-coffee-light">View and export email addresses subscribed to "Stay for another cup".</p>
        </div>

        {subscribers.length > 0 && (
          <button
            onClick={copyToClipboard}
            className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 vintage-border border-coffee-dark"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
            <span>{copied ? 'Emails Copied!' : 'Copy All Emails'}</span>
          </button>
        )}
      </div>

      {/* METRIC BOX */}
      <div className="bg-cream-dark/30 border border-coffee-light/10 p-5 rounded-lg flex items-center gap-4 max-w-sm">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-coffee-light">Active Subscribers</p>
          <p className="text-2xl font-bold text-coffee-dark mt-0.5">{subscribers.length}</p>
        </div>
      </div>

      {/* SEARCH AND TABLE */}
      <div className="space-y-4">
        <div className="relative w-full max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-coffee-light/60">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search email address..."
            className="w-full pl-9 pr-4 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark placeholder-coffee-light/40"
          />
        </div>

        <div className="bg-cream-dark/20 border border-coffee-light/10 rounded-lg overflow-hidden shadow-sm">
          {filteredSubs.length === 0 ? (
            <div className="text-center py-16">
              <Mail className="h-10 w-10 text-coffee-light/30 mx-auto mb-2" />
              <p className="text-sm font-serif italic text-coffee-light">No subscribers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-coffee-dark text-cream-light font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-light/10 font-medium text-coffee-dark">
                  {filteredSubs.map((email, idx) => (
                    <tr key={idx} className="hover:bg-cream-dark/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm">{email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-bold text-[9px] uppercase border border-green-200">Active</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(email)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Remove subscriber"
                        >
                          <Trash className="h-4 w-4" />
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

    </div>
  );
}
