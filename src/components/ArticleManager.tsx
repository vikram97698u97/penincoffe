'use client';

import { useState, useEffect } from 'react';
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
  Copy,
  Archive,
  Search,
  Filter,
  ArrowLeft,
  Coffee,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  Tag
} from 'lucide-react';
import { fdb as db } from '@/lib/firebaseDB';
import { Post, PostType } from '@/types/database';

const ARTICLE_CATEGORIES = [
  'Technology',
  'Lifestyle',
  'Coffee',
  'Business',
  'Travel',
  'Food',
  'Guides',
  'Reviews',
  'Opinion',
  'News',
  'Other'
];

export default function ArticleManager() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tagsInput, setTagsInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [scheduleDate, setScheduleDate] = useState('');
  
  // New Article specific fields
  const [authorName, setAuthorName] = useState('Aria Vance');
  const [status, setStatus] = useState<'Draft' | 'Scheduled' | 'Published' | 'Archived'>('Published');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');

  // UI helpers inside form
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('');

  // Listing Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterAuthor, setFilterAuthor] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [filterSort, setFilterSort] = useState<'newest' | 'oldest'>('newest');

  // Automatically calculate reading time from content
  const calculatedReadingTime = Math.max(
    1,
    Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200)
  );

  // Load posts
  useEffect(() => {
    if (!mounted) return;
    
    async function load() {
      const all = await db.getPosts(true);
      // Get all article and legacy poem posts
      const articles = all.filter(p => p.type === 'article' || p.type === 'poem');
      setPosts(articles);
    }
    load();

    if (searchParams.get('new') === 'true') {
      handleCreateNewClick();
    }
  }, [refreshToggle, searchParams, mounted]);

  // Auto-save draft inside localStorage while editing or creating
  useEffect(() => {
    if (!mounted) return;
    if (!isCreatingNew && !editingPost) return;
    if (!title && !content) return;

    const timer = setTimeout(() => {
      const draftObj = {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category,
        tagsInput,
        featured,
        authorName,
        status,
        seoTitle,
        metaDescription,
        focusKeyword
      };
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('penincoffe_article_autosave', JSON.stringify(draftObj));
          setAutoSaveStatus('Draft auto-saved ✨');
          setTimeout(() => setAutoSaveStatus(''), 3000);
        }
      } catch (e) {
        // ignore storage errors
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, slug, excerpt, content, coverImage, category, tagsInput, featured, authorName, status, seoTitle, metaDescription, focusKeyword, isCreatingNew, editingPost, mounted]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
      if (!seoTitle) setSeoTitle(val);
    }
  };

  const handleCreateNewClick = () => {
    setEditingPost(null);
    setIsCreatingNew(true);
    setEditorTab('write');

    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setCategory('Technology');
    setTagsInput('');
    setFeatured(false);
    setPublishImmediately(true);
    setScheduleDate('');
    setAuthorName('Aria Vance');
    setStatus('Published');
    setSeoTitle('');
    setMetaDescription('');
    setFocusKeyword('');

    // Check if auto-saved draft exists
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('penincoffe_article_autosave');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.title || parsed.content) {
            if (confirm('An auto-saved article draft was found. Do you want to restore it?')) {
              setTitle(parsed.title || '');
              setSlug(parsed.slug || '');
              setExcerpt(parsed.excerpt || '');
              setContent(parsed.content || '');
              setCoverImage(parsed.coverImage || '');
              setCategory(parsed.category || 'Technology');
              setTagsInput(parsed.tagsInput || '');
              setFeatured(parsed.featured || false);
              setAuthorName(parsed.authorName || 'Aria Vance');
              setStatus(parsed.status || 'Draft');
              setSeoTitle(parsed.seoTitle || '');
              setMetaDescription(parsed.metaDescription || '');
              setFocusKeyword(parsed.focusKeyword || '');
            }
          }
        }
      }
    } catch (e) {}
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsCreatingNew(false);
    setEditorTab('write');

    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage || '');
    setCategory(post.category || 'Technology');
    setTagsInput((post.tags || []).join(', '));
    setFeatured(post.featured || false);
    setPublishImmediately(post.published || false);
    setScheduleDate(post.scheduledDate || '');
    setAuthorName(post.authorName || 'Aria Vance');
    setStatus(post.status || (post.published ? 'Published' : 'Draft'));
    setSeoTitle(post.seoTitle || post.title);
    setMetaDescription(post.metaDescription || post.excerpt);
    setFocusKeyword(post.focusKeyword || '');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      await db.deletePost(id);
      setRefreshToggle(!refreshToggle);
    }
  };

  const handleDuplicate = async (post: Post) => {
    const duplicateData: Post = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      title: `${post.title} (Copy)`,
      slug: `${post.slug}-copy-${Math.random().toString(36).substr(2, 4)}`,
      status: 'Draft',
      published: false,
      views: 0,
      favorites: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await db.savePost(duplicateData);
    setRefreshToggle(!refreshToggle);
  };

  const handleArchive = async (post: Post) => {
    const archivedData: Post = {
      ...post,
      status: 'Archived',
      published: false,
      updatedAt: new Date().toISOString()
    };
    await db.savePost(archivedData);
    setRefreshToggle(!refreshToggle);
  };

  const saveArticleWithStatus = async (targetStatus: 'Draft' | 'Scheduled' | 'Published' | 'Archived') => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      alert('Please fill out the Title, Slug, and Article Content fields.');
      return;
    }

    const isPublished = targetStatus === 'Published';
    const postData: Post = {
      id: editingPost?.id || Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || content.trim().substring(0, 140) + '...',
      content: content.trim(),
      coverImage: coverImage.trim() || undefined,
      type: 'article',
      category: category.trim() || 'Technology',
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      readingTime: calculatedReadingTime,
      featured,
      published: isPublished,
      authorId: editingPost?.authorId || 'author-admin',
      authorName: authorName.trim() || 'Aria Vance',
      status: targetStatus,
      scheduledDate: targetStatus === 'Scheduled' ? scheduleDate : undefined,
      seoTitle: seoTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim().substring(0, 160),
      focusKeyword: focusKeyword.trim() || undefined,
      views: editingPost?.views || 0,
      favorites: editingPost?.favorites || 0,
      createdAt: editingPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.savePost(postData);

    // Clear auto-saved draft
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('penincoffe_article_autosave');
      }
    } catch (e) {}

    setEditingPost(null);
    setIsCreatingNew(false);
    setRefreshToggle(!refreshToggle);
    router.replace('/dashboard/articles');
  };

  // Filtered and Sorted list
  const uniqueAuthors = Array.from(new Set(posts.map(p => p.authorName || 'Aria Vance')));

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.authorName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || post.category === filterCategory;
    const matchesAuthor = filterAuthor === 'All' || (post.authorName || 'Aria Vance') === filterAuthor;
    
    const postStatus = post.status || (post.published ? 'Published' : 'Draft');
    const matchesStatus = filterStatus === 'All' || postStatus === filterStatus;
    const matchesFeatured = !filterFeatured || post.featured;

    return matchesSearch && matchesCategory && matchesAuthor && matchesStatus && matchesFeatured;
  }).sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return filterSort === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-coffee-light/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-coffee-dark">Manage Articles</h1>
          <p className="text-xs text-coffee-light">Create, edit, schedule, and publish articles.</p>
        </div>
        
        {!isCreatingNew && !editingPost && (
          <button
            onClick={handleCreateNewClick}
            className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Article</span>
          </button>
        )}
      </div>

      {/* CREATE / EDIT FORM */}
      {(isCreatingNew || editingPost) && (
        <div className="bg-cream-dark/60 border border-coffee-light/20 p-6 sm:p-8 rounded-xl shadow-sm space-y-6 vintage-border">
          <div className="flex justify-between items-center border-b border-coffee-light/10 pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setEditingPost(null); setIsCreatingNew(false); }}
                className="p-1 hover:bg-cream-light rounded text-coffee-dark"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="font-serif text-xl font-bold text-coffee-dark">
                {editingPost ? `Edit Article: ${editingPost.title}` : 'Create New Article'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {autoSaveStatus && (
                <span className="text-xs font-semibold text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <Sparkles className="h-3 w-3" />
                  {autoSaveStatus}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  if (editingPost) {
                    window.open(`/articles/${editingPost.slug}`, '_blank');
                  } else {
                    setEditorTab(editorTab === 'write' ? 'preview' : 'write');
                  }
                }}
                className="bg-cream-light text-coffee-dark border border-coffee-light/30 hover:bg-coffee-dark hover:text-cream-light px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>{editingPost ? 'View Live' : editorTab === 'write' ? 'Preview' : 'Edit'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); saveArticleWithStatus(status); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] uppercase tracking-widest font-bold text-coffee-light">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream-light border border-coffee-light/30 rounded text-coffee-dark focus:outline-none focus:border-terracotta font-serif text-lg font-semibold"
                  placeholder="e.g. The Future of Specialty Coffee Roasting in 2026"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-widest font-bold text-coffee-light">
                  URL Slug <span className="text-xs text-coffee-light/60 font-normal">(Auto-generated from title)</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-sm font-mono text-coffee-dark focus:outline-none focus:border-terracotta"
                  placeholder="the-future-of-specialty-coffee"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-widest font-bold text-coffee-light">
                  Article Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-sm text-coffee-dark focus:outline-none focus:border-terracotta"
                >
                  {ARTICLE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Author */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-widest font-bold text-coffee-light">
                  Author Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-coffee-light/60" />
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-sm text-coffee-dark focus:outline-none focus:border-terracotta"
                    placeholder="Aria Vance"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-widest font-bold text-coffee-light">
                  Article Status
                </label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-sm text-coffee-dark font-medium focus:outline-none focus:border-terracotta"
                >
                  <option value="Draft">Draft (Hidden from public)</option>
                  <option value="Published">Published (Live immediately)</option>
                  <option value="Scheduled">Scheduled (Set release date below)</option>
                  <option value="Archived">Archived (Unlisted)</option>
                </select>
              </div>

              {/* Schedule Date (if status === Scheduled) */}
              {status === 'Scheduled' && (
                <div className="space-y-1 md:col-span-2 bg-amber-50/60 p-3.5 border border-amber-200 rounded">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-amber-800 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Schedule Release Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-cream-light border border-amber-300 rounded text-sm text-coffee-dark"
                  />
                </div>
              )}

              {/* Cover Image */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-widest font-bold text-coffee-light">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-sm text-coffee-dark focus:outline-none focus:border-terracotta"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-widest font-bold text-coffee-light">
                  Tags <span className="text-xs text-coffee-light/60 font-normal">(Comma separated)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-sm text-coffee-dark focus:outline-none focus:border-terracotta"
                  placeholder="coffee, technology, guide, 2026"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-widest font-bold text-coffee-light">
                Article Excerpt <span className="text-xs text-coffee-light/60 font-normal">(Brief summary shown on cards)</span>
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-sm text-coffee-dark focus:outline-none focus:border-terracotta"
                placeholder="A comprehensive guide to understanding modern trends and techniques..."
              />
            </div>

            {/* ARTICLE CONTENT (Markdown / Rich Text) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase tracking-widest font-bold text-coffee-light flex items-center gap-2">
                  <span>Article Content</span>
                  <span className="text-[10px] bg-coffee-dark/10 text-coffee-dark px-2 py-0.5 rounded font-mono">
                    Auto calculated reading time: ~{calculatedReadingTime} min read
                  </span>
                </label>

                <div className="flex gap-1 bg-cream-light p-1 rounded border border-coffee-light/20">
                  <button
                    type="button"
                    onClick={() => setEditorTab('write')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${editorTab === 'write' ? 'bg-coffee-dark text-cream-light' : 'text-coffee-dark hover:bg-coffee-light/10'}`}
                  >
                    Write Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('preview')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${editorTab === 'preview' ? 'bg-coffee-dark text-cream-light' : 'text-coffee-dark hover:bg-coffee-light/10'}`}
                  >
                    Markdown Preview
                  </button>
                </div>
              </div>

              {editorTab === 'write' ? (
                <textarea
                  required
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 bg-cream-light border border-coffee-light/30 rounded text-sm font-mono text-coffee-dark focus:outline-none focus:border-terracotta leading-relaxed"
                  placeholder="Write your article content here using Markdown or clean paragraphs...&#10;&#10;# The Rise of Specialty Brewing&#10;In recent years, the intersection of craftsmanship and precision..."
                />
              ) : (
                <div className="w-full min-h-[320px] max-h-[500px] overflow-y-auto px-6 py-5 bg-cream-light border border-coffee-light/30 rounded prose prose-stone max-w-none text-coffee-dark">
                  {content ? (
                    <div className="space-y-4 whitespace-pre-wrap leading-relaxed font-serif">
                      <h1 className="text-2xl font-bold border-b pb-2">{title || 'Untitled Article'}</h1>
                      {content}
                    </div>
                  ) : (
                    <p className="text-coffee-light italic">Nothing written yet. Switch to Write Content tab to start typing.</p>
                  )}
                </div>
              )}
            </div>

            {/* SEO SETTINGS BOX */}
            <div className="bg-cream-light/80 p-5 rounded-xl border border-coffee-light/25 space-y-4">
              <h3 className="font-serif text-sm font-bold text-coffee-dark flex items-center gap-1.5 border-b border-coffee-light/10 pb-2">
                <Globe className="h-4 w-4 text-terracotta" />
                <span>Search Engine Optimization (SEO) Settings</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-coffee-light">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-coffee-light/30 rounded text-xs text-coffee-dark"
                    placeholder="Article Title | Pen in Coffee"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-coffee-light">
                    Focus Keyword
                  </label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-coffee-light/30 rounded text-xs text-coffee-dark font-mono"
                    placeholder="e.g. specialty coffee trends, essay writing"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-coffee-light">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-coffee-light/30 rounded text-xs text-coffee-dark"
                    placeholder="Write an engaging summary for search engines (up to 160 characters)..."
                  />
                </div>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-coffee-dark">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-terracotta focus:ring-terracotta h-4 w-4"
                />
                <span>Mark as Featured Article</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-coffee-dark">
                <input
                  type="checkbox"
                  checked={status === 'Published'}
                  onChange={(e) => setStatus(e.target.checked ? 'Published' : 'Draft')}
                  className="rounded text-terracotta focus:ring-terracotta h-4 w-4"
                />
                <span>Publish Immediately</span>
              </label>
            </div>

            {/* ACTION BUTTONS (Preview, Save Draft, Publish) */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-coffee-light/10">
              <button
                type="button"
                onClick={() => { setEditingPost(null); setIsCreatingNew(false); }}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-coffee-light hover:text-coffee-dark transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => saveArticleWithStatus('Draft')}
                className="bg-cream-light border border-coffee-dark/40 text-coffee-dark hover:bg-coffee-dark hover:text-cream-light px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={() => saveArticleWithStatus('Published')}
                className="bg-coffee-dark text-cream-light hover:bg-terracotta px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Publish Article</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER AND SEARCH BAR */}
      <div className="bg-cream-dark/40 border border-coffee-light/20 p-4 rounded-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-coffee-light/60" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, excerpt, author..."
              className="w-full pl-9 pr-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-xs text-coffee-dark focus:outline-none focus:border-terracotta"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-xs text-coffee-dark focus:outline-none focus:border-terracotta"
            >
              <option value="All">All Categories</option>
              {ARTICLE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div>
            <select
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-xs text-coffee-dark focus:outline-none focus:border-terracotta"
            >
              <option value="All">All Authors</option>
              {uniqueAuthors.map(auth => (
                <option key={auth} value={auth}>{auth}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-xs text-coffee-dark focus:outline-none focus:border-terracotta"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <select
              value={filterSort}
              onChange={(e: any) => setFilterSort(e.target.value)}
              className="w-full px-3 py-2 bg-cream-light border border-coffee-light/30 rounded text-xs text-coffee-dark focus:outline-none focus:border-terracotta"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-coffee-light pt-1 border-t border-coffee-light/10">
          <div className="flex items-center gap-4">
            <span>Showing {filteredPosts.length} of {posts.length} articles</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-coffee-dark font-medium">
              <input
                type="checkbox"
                checked={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.checked)}
                className="rounded text-terracotta focus:ring-terracotta h-3.5 w-3.5"
              />
              <span>Featured Only</span>
            </label>
          </div>

          {(searchTerm || filterCategory !== 'All' || filterAuthor !== 'All' || filterStatus !== 'All' || filterFeatured) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('All');
                setFilterAuthor('All');
                setFilterStatus('All');
                setFilterFeatured(false);
              }}
              className="text-terracotta hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ARTICLE LISTING TABLE */}
      {filteredPosts.length === 0 ? (
        <div className="bg-cream-dark/30 border border-coffee-light/20 p-12 text-center rounded-xl space-y-3">
          <FileText className="h-10 w-10 text-coffee-light mx-auto opacity-50" />
          <h3 className="font-serif text-lg font-bold text-coffee-dark">No articles found</h3>
          <p className="text-xs text-coffee-light max-w-sm mx-auto">
            {posts.length === 0
              ? "You haven't created any articles yet. Click 'Create New Article' above to get started!"
              : 'No articles match your current search and filter settings.'}
          </p>
        </div>
      ) : (
        <div className="bg-cream-dark/40 border border-coffee-light/20 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-coffee-light/15 bg-coffee-dark text-cream-light text-[10px] uppercase tracking-wider font-bold">
                  <th className="p-4">Article & Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Read Time</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee-light/10 text-xs">
                {filteredPosts.map(post => {
                  const postStatus = post.status || (post.published ? 'Published' : 'Draft');
                  return (
                    <tr key={post.id} className="hover:bg-cream-light/40 transition-colors">
                      {/* Title + Cover + Category + Featured Badge */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="h-10 w-12 object-cover rounded border border-coffee-light/20 flex-shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-12 bg-coffee-dark/10 rounded flex items-center justify-center text-coffee-dark flex-shrink-0">
                              <FileText className="h-5 w-5" />
                            </div>
                          )}
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-serif font-bold text-coffee-dark text-sm line-clamp-1">
                                {post.title}
                              </span>
                              {post.featured && (
                                <span className="bg-terracotta/15 text-terracotta text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider shrink-0">
                                  ★ Featured
                                </span>
                              )}
                            </div>
                            <span className="inline-block bg-cream-light border border-coffee-light/20 text-coffee-dark/80 px-2 py-0.5 rounded text-[10px] font-semibold">
                              {post.category || 'Technology'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="p-4 font-medium text-coffee-dark">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-coffee-light" />
                          <span>{post.authorName || 'Aria Vance'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                          postStatus === 'Published'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : postStatus === 'Scheduled'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : postStatus === 'Archived'
                            ? 'bg-stone-200 text-stone-700 border border-stone-300'
                            : 'bg-cream-light text-coffee-light border border-coffee-light/30'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            postStatus === 'Published' ? 'bg-green-600' : postStatus === 'Scheduled' ? 'bg-amber-600' : 'bg-stone-500'
                          }`}></span>
                          {postStatus}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-coffee-light font-mono text-[11px]">
                        {mounted ? new Date(post.scheduledDate || post.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : ''}
                      </td>

                      {/* Reading Time */}
                      <td className="p-4 text-coffee-dark font-medium">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-coffee-light" />
                          <span>{post.readingTime || 3} min read</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(post)}
                            title="Edit Article"
                            className="p-1.5 text-coffee-dark hover:bg-cream-light rounded transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => window.open(`/articles/${post.slug}`, '_blank')}
                            title="Preview Article"
                            className="p-1.5 text-coffee-light hover:text-coffee-dark hover:bg-cream-light rounded transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(post)}
                            title="Duplicate Article"
                            className="p-1.5 text-coffee-light hover:text-coffee-dark hover:bg-cream-light rounded transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>

                          {postStatus !== 'Archived' && (
                            <button
                              onClick={() => handleArchive(post)}
                              title="Archive Article"
                              className="p-1.5 text-coffee-light hover:text-amber-700 hover:bg-cream-light rounded transition-colors"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(post.id)}
                            title="Delete Article"
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
