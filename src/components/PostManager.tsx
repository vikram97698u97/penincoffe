'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  FileText,
  Plus,
  Edit,
  Trash,
  Check,
  X,
  Eye,
  Calendar,
  Save,
  Globe,
  Settings,
  ArrowLeft,
  Coffee
} from 'lucide-react';
import { fdb as db } from '@/lib/firebaseDB';
import { Post, PostType } from '@/types/database';

interface PostManagerProps {
  filterType: 'all' | PostType;
}

export default function PostManager({ filterType }: PostManagerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [mood, setMood] = useState<any>('');
  const [tagsInput, setTagsInput] = useState('');
  const [readingTime, setReadingTime] = useState(3);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [scheduleDate, setScheduleDate] = useState('');

  // Load and refresh list
  useEffect(() => {
    async function load() {
      const all = await db.getPosts(true);
      const filtered = filterType === 'all' ? all : all.filter(p => p.type === filterType);
      setPosts(filtered);
    }
    load();

    // If query string has ?new=true, trigger new post creator immediately
    if (searchParams.get('new') === 'true') {
      setIsCreatingNew(true);
    }
  }, [filterType, refreshToggle, searchParams]);

  // Handle auto slug generations
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsCreatingNew(false);

    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage || '');
    setCategory(post.category);
    setMood(post.mood || '');
    setTagsInput(post.tags.join(', '));
    setReadingTime(post.readingTime);
    setFeatured(post.featured);
    setPublished(post.published);
    setScheduleDate('');
  };

  const handleCreateNewClick = () => {
    setEditingPost(null);
    setIsCreatingNew(true);

    // Set sensible defaults based on target filter type
    const defaultCat = filterType === 'story' ? 'Literary Fiction' : filterType === 'poem' ? 'Free Verse' : filterType === 'book-note' ? 'Books That Changed Me' : 'Weekly Brew';
    
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setCategory(defaultCat);
    setMood(filterType === 'story' || filterType === 'poem' ? 'Hope' : '');
    setTagsInput('');
    setReadingTime(filterType === 'poem' ? 2 : 5);
    setFeatured(false);
    setPublished(true);
    setScheduleDate('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      await db.deletePost(id);
      setRefreshToggle(!refreshToggle);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const postData: Post = {
      id: editingPost?.id || Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || content.trim().substring(0, 120) + '...',
      content: content.trim(),
      coverImage: coverImage.trim() || undefined,
      type: editingPost?.type || (filterType === 'all' ? 'story' : filterType),
      category: category.trim(),
      mood: mood ? mood : undefined,
      tags: tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0),
      readingTime: Number(readingTime) || 3,
      featured,
      published,
      views: editingPost?.views || 0,
      favorites: editingPost?.favorites || 0,
      authorId: editingPost?.authorId || 'author-aria',
      createdAt: editingPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.savePost(postData);
    
    // Clear editor
    setEditingPost(null);
    setIsCreatingNew(false);
    setRefreshToggle(!refreshToggle);
    
    // Remove query param
    router.replace(`/dashboard/${filterType === 'all' ? 'posts' : filterType === 'weekly-brew' ? 'weekly-brew' : filterType === 'book-note' ? 'book-notes' : filterType + 's'}`);
  };

  const getTypeName = () => {
    if (filterType === 'all') return 'Posts';
    if (filterType === 'book-note') return 'Book Notes';
    if (filterType === 'weekly-brew') return 'Weekly Brews';
    if (filterType === 'poem' || filterType === 'article') return 'Articles';
    return filterType.charAt(0).toUpperCase() + filterType.slice(1) + 's';
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER CONTROLS */}
      <div className="flex justify-between items-center border-b border-coffee-light/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-coffee-dark">Manage {getTypeName()}</h1>
          <p className="text-xs text-coffee-light">Draft, schedule, create, or publish literary posts.</p>
        </div>
        
        {!isCreatingNew && !editingPost && (
          <button
            onClick={handleCreateNewClick}
            className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 vintage-border border-coffee-dark"
          >
            <Plus className="h-4 w-4" />
            <span>Create {filterType === 'all' ? 'Post' : getTypeName().slice(0, -1)}</span>
          </button>
        )}
      </div>

      {/* EDITOR FORM VIEW */}
      {(isCreatingNew || editingPost) && (
        <form onSubmit={handleSave} className="bg-cream-dark/20 border border-coffee-light/15 p-6 rounded-lg space-y-6 shadow-sm animate-fade-in max-w-4xl">
          
          <div className="flex items-center justify-between border-b border-coffee-light/10 pb-2">
            <h3 className="font-serif text-lg font-bold text-coffee-dark">
              {isCreatingNew ? 'Create New Post' : `Edit Post: ${title}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingPost(null);
                setIsCreatingNew(false);
              }}
              className="p-1 text-coffee-light hover:text-coffee-dark rounded-full hover:bg-coffee-light/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="The Silent Kettle..."
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Slug * (URLs identifier)</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="the-silent-kettle"
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Excerpt (Short description)</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary to display on feeds..."
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark font-serif italic"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-light block">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Slice of Life, Free Verse"
                    className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-light block">Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark cursor-pointer"
                  >
                    <option value="">No Mood Badge</option>
                    <option value="Love">Love</option>
                    <option value="Loss">Loss</option>
                    <option value="Hope">Hope</option>
                    <option value="Nature">Nature</option>
                    <option value="Healing">Healing</option>
                    <option value="Reflection">Reflection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-light block">Reading Time (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={readingTime}
                    onChange={(e) => setReadingTime(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-coffee-light block">Schedule Date</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark text-coffee-light cursor-pointer"
                  />
                </div>
              </div>

            </div>

            {/* Right Fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Cover Image URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark"
                />
                {coverImage.trim() && (
                  <div className="relative mt-2 rounded overflow-hidden aspect-[21/9] border border-coffee-light/10 shadow-sm max-h-24">
                    <img src={coverImage.trim()} alt="Cover preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-coffee-light block">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="slow-living, coffee, stanzas"
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark"
                />
              </div>

              {/* Status toggles */}
              <div className="bg-cream-light p-4 rounded border border-coffee-light/10 space-y-3">
                <p className="text-[10px] uppercase font-bold text-coffee-light border-b border-coffee-light/5 pb-1">Publication Options</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-coffee-dark">Publish Immediately</span>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 text-terracotta focus:ring-terracotta rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-coffee-dark">Feature on Frontpage</span>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 text-terracotta focus:ring-terracotta rounded"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Full-width editor content */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-bold text-coffee-light block">Writing Canvas *</label>
              <span className="text-[10px] text-coffee-light italic">Markdown spacing supported</span>
            </div>
            <textarea
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your story stanzas or reflection lessons here..."
              className="w-full px-4 py-3 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark font-serif italic leading-relaxed"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingPost(null);
                setIsCreatingNew(false);
              }}
              className="px-5 py-2.5 bg-cream-light border border-coffee-light/25 hover:bg-cream-dark transition-all rounded text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 vintage-border border-coffee-dark shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Post</span>
            </button>
          </div>

        </form>
      )}

      {/* TABLE POSTS VIEW LIST */}
      {!isCreatingNew && !editingPost && (
        <div className="bg-cream-dark/20 border border-coffee-light/10 rounded-lg overflow-hidden shadow-sm">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-10 w-10 text-coffee-light/30 mx-auto mb-2" />
              <p className="text-sm font-serif italic text-coffee-light">No posts found in this category.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-coffee-dark text-cream-light font-bold uppercase tracking-wider text-[10px] border-b border-coffee-light/10">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Length</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Views</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-light/10 font-medium">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-cream-dark/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-serif text-sm font-bold text-coffee-dark">{post.title}</p>
                          <p className="text-[10px] text-coffee-light mt-0.5 uppercase tracking-wide">type: {post.type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-coffee-light">{post.category}</td>
                      <td className="px-6 py-4 text-coffee-light">{post.readingTime}m read</td>
                      <td className="px-6 py-4">
                        {post.published ? (
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-bold text-[9px] uppercase border border-green-200">Published</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full font-bold text-[9px] uppercase border border-yellow-200">Draft</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-coffee-light">{post.views}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-1.5 text-coffee-light hover:text-coffee-dark hover:bg-cream-light rounded transition-colors"
                          title="Edit post"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Delete post"
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
      )}

    </div>
  );
}
