'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, Plus, Trash, Save, X, Coffee } from 'lucide-react';
import { fdb as db } from '@/lib/firebaseDB';
import { CoffeeTableItem } from '@/types/database';

export default function CoffeeTableDashboard() {
  const [items, setItems] = useState<CoffeeTableItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form states
  const [type, setType] = useState<'quote' | 'prompt' | 'song' | 'photo' | 'observation'>('quote');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function load() {
      setItems(await db.getCoffeeTable());
    }
    load();
  }, [refreshToggle, mounted]);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item from the inspiration board?')) {
      await db.deleteCoffeeTableItem(id);
      setRefreshToggle(!refreshToggle);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await db.addCoffeeTableItem({
      type,
      content: content.trim(),
      mediaUrl: mediaUrl.trim() || undefined,
      authorNickname: 'Aria',
      tags: tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
    });

    setIsAdding(false);
    setContent('');
    setMediaUrl('');
    setTagsInput('');
    setRefreshToggle(!refreshToggle);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-coffee-light/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-coffee-dark">Manage Coffee Table</h1>
          <p className="text-xs text-coffee-light">Add or remove inspiration cards from the visual masonry board.</p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 vintage-border border-coffee-dark"
          >
            <Plus className="h-4 w-4" />
            <span>Add Board Item</span>
          </button>
        )}
      </div>

      {/* ADD ITEM FORM */}
      {isAdding && (
        <form onSubmit={handleSave} className="bg-cream-dark/20 border border-coffee-light/15 p-6 rounded-lg space-y-4 max-w-xl shadow-sm">
          <div className="flex justify-between items-center border-b border-coffee-light/10 pb-2">
            <h3 className="font-serif text-base font-bold text-coffee-dark">Add Board Item</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="p-1 rounded-full hover:bg-coffee-light/5 text-coffee-light">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Item Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark cursor-pointer"
              >
                <option value="quote">Quote I Love</option>
                <option value="prompt">Writing Prompt</option>
                <option value="song">Song on Repeat</option>
                <option value="photo">Photo & Moment</option>
                <option value="observation">Tiny Observation</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="inspiration, writing"
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
              />
            </div>
          </div>

          {(type === 'photo' || type === 'song') && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">
                {type === 'photo' ? 'Photo URL (from Unsplash, etc.)' : 'Spotify Track URL / Embed Link'}
              </label>
              <input
                type="text"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder={type === 'photo' ? 'https://images.unsplash.com/...' : 'https://open.spotify.com/embed/...'}
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-coffee-light block">Content / Message</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the quote text, prompt instructions, song details, or tiny daily reflections..."
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-xs text-coffee-dark font-serif italic"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-cream-light border border-coffee-light/20 rounded text-xs uppercase font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Item</span>
            </button>
          </div>
        </form>
      )}

      {/* ITEMS LIST */}
      <div className="bg-cream-dark/20 border border-coffee-light/10 rounded-lg overflow-hidden shadow-sm">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <LayoutGrid className="h-10 w-10 text-coffee-light/35 mx-auto mb-2" />
            <p className="text-sm font-serif italic text-coffee-light">No items on the coffee table.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-coffee-dark text-cream-light font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Content</th>
                  <th className="px-6 py-4">Tags</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-light/10 font-medium">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-cream-dark/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-coffee-light/10 text-coffee-dark rounded text-[9px] font-bold uppercase">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate font-serif italic text-coffee-dark">"{item.content}"</td>
                    <td className="px-6 py-4 text-coffee-light">{item.tags.join(', ') || 'none'}</td>
                    <td className="px-6 py-4 text-coffee-light">{mounted ? new Date(item.createdAt).toLocaleDateString() : ''}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Delete item"
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
  );
}
