import { Post, Comment, Letter, CoffeeTableItem, Settings, User } from '@/types/database';

// ----------------------------------------------------
// INITIAL MOCK DATA DEFINITIONS
// ----------------------------------------------------

const INITIAL_SETTINGS: Settings = {
  id: 'global',
  siteName: 'Pen in Coffee',
  tagline: 'Words brewed, stories shared.',
  mission: 'Create a warm online space where readers can enjoy stories, poetry, reflections, book notes, weekly letters, and meaningful conversations.',
  aboutText: 'Welcome to my little corner of the internet where thoughts meet ink and every story is brewed with honesty. I am a writer, a reader, and a caffeine enthusiast trying to capture the transient beauty of everyday life in words.',
  aboutPhilosophy: 'I believe writing is like brewing coffee: it takes patience, the right temperature, and a willingness to sit with the bitterness to find the sweetness.',
  authorName: 'Aria Thorne',
  authorBio: 'Aria Thorne is an essayist and poet. After working in corporate journalism for years, she left the rush of newsrooms to open a slow-styled digital sanctuary.',
  email: 'hello@penincoffee.com',
  instagram: 'penincoffee.journal',
  twitter: 'penincoffee',
  timeline: [
    { id: 't1', year: '2020', title: 'The First Spark', description: 'Bought a vintage fountain pen and began journaling in a cozy cafe in Prague.' },
    { id: 't2', year: '2022', title: 'Coffee House Columns', description: 'Began sharing short slice-of-life snippets online, building a small community of readers.' },
    { id: 't3', year: '2024', title: 'Pen in Coffee Launches', description: 'Created this dedicated sanctuary to merge literature, book notes, and anonymous letters.' }
  ],
  bookshelf: [
    { id: 'b1', title: 'Letters to a Young Poet', author: 'Rainer Maria Rilke', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300', rating: 5, review: 'A masterclass in isolation, patience, and creative truth.' },
    { id: 'b2', title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón', coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300', rating: 5, review: 'An atmospheric love letter to books, writing, and memory.' },
    { id: 'b3', title: 'Kafka on the Shore', author: 'Haruki Murakami', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300', rating: 4, review: 'Dreamlike, musical, and filled with deep loneliness.' }
  ]
};

export const TEMPLATE_POST_IDS = new Set(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);
export const TEMPLATE_COMMENT_IDS = new Set(['c1', 'c2', 'c3']);
export const TEMPLATE_LETTER_IDS = new Set(['l1', 'l2', 'l3']);
export const TEMPLATE_COFFEE_TABLE_IDS = new Set(['ct1', 'ct2', 'ct3', 'ct4', 'ct5']);

export function isTemplatePost(p: any): boolean {
  if (!p) return true;
  if (p.id && TEMPLATE_POST_IDS.has(p.id)) return true;
  return false;
}

const INITIAL_POSTS: Post[] = [];
const INITIAL_COMMENTS: Comment[] = [];
const INITIAL_LETTERS: Letter[] = [];
const INITIAL_COFFEE_TABLE: CoffeeTableItem[] = [];

// ----------------------------------------------------
// DATABASE SERVICE METHODS (MOCKS FIRESTORE/LOCALSTORAGE)
// ----------------------------------------------------

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export const db = {
  // Config / Settings
  getSettings(): Settings {
    return getStorageItem<Settings>('pen_coffee_settings', INITIAL_SETTINGS);
  },
  saveSettings(settings: Settings): void {
    setStorageItem('pen_coffee_settings', settings);
  },

  // Posts (Stories, Poems, Book Notes, Weekly Brews)
  getPosts(includeUnpublished = false): Post[] {
    const posts = getStorageItem<Post[]>('pen_coffee_posts', INITIAL_POSTS);
    const filtered = posts.filter(p => !isTemplatePost(p));
    const sorted = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return includeUnpublished ? sorted : sorted.filter(p => p.published);
  },
  getPostBySlug(slug: string): Post | undefined {
    return this.getPosts(true).find(p => p.slug === slug);
  },
  savePost(post: Post): void {
    const posts = this.getPosts(true);
    const index = posts.findIndex(p => p.id === post.id);
    if (index > -1) {
      posts[index] = { ...post, updatedAt: new Date().toISOString() };
    } else {
      posts.push({ ...post, id: post.id || Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    setStorageItem('pen_coffee_posts', posts);
  },
  deletePost(id: string): void {
    const posts = this.getPosts(true).filter(p => p.id !== id);
    setStorageItem('pen_coffee_posts', posts);
  },
  incrementViews(idOrSlug: string, currentViews?: number): void {
    const posts = this.getPosts(true);
    const index = posts.findIndex(p => p.slug === idOrSlug || p.id === idOrSlug);
    if (index > -1) {
      posts[index].views = currentViews !== undefined ? currentViews + 1 : posts[index].views + 1;
      setStorageItem('pen_coffee_posts', posts);
    }
  },
  incrementFavorites(idOrSlug: string, currentFavorites?: number): void {
    const posts = this.getPosts(true);
    const index = posts.findIndex(p => p.slug === idOrSlug || p.id === idOrSlug);
    if (index > -1) {
      posts[index].favorites = currentFavorites !== undefined ? currentFavorites + 1 : posts[index].favorites + 1;
      setStorageItem('pen_coffee_posts', posts);
    }
  },

  // Comments
  getComments(postId?: string, includeUnapproved = false): Comment[] {
    const comments = getStorageItem<Comment[]>('pen_coffee_comments', INITIAL_COMMENTS);
    const nonTemplate = comments.filter(c => c && !TEMPLATE_COMMENT_IDS.has(c.id));
    const filtered = postId ? nonTemplate.filter(c => c.postId === postId) : nonTemplate;
    const sorted = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return includeUnapproved ? sorted : sorted.filter(c => c.approved);
  },
  addComment(comment: Omit<Comment, 'id' | 'likes' | 'approved' | 'createdAt'>): Comment {
    const comments = getStorageItem<Comment[]>('pen_coffee_comments', INITIAL_COMMENTS);
    const newComment: Comment = {
      ...comment,
      id: Math.random().toString(36).substr(2, 9),
      likes: 0,
      approved: false, // Moderation-ready by default
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    setStorageItem('pen_coffee_comments', comments);
    return newComment;
  },
  approveComment(id: string): void {
    const comments = this.getComments(undefined, true);
    const index = comments.findIndex(c => c.id === id);
    if (index > -1) {
      comments[index].approved = true;
      setStorageItem('pen_coffee_comments', comments);
    }
  },
  rejectOrDeleteComment(id: string): void {
    const comments = this.getComments(undefined, true);
    const filtered = comments.filter(c => c.id !== id);
    setStorageItem('pen_coffee_comments', filtered);
  },
  likeComment(id: string, currentLikes?: number): void {
    const comments = this.getComments(undefined, true);
    const index = comments.findIndex(c => c.id === id);
    if (index > -1) {
      comments[index].likes = currentLikes !== undefined ? currentLikes + 1 : comments[index].likes + 1;
      setStorageItem('pen_coffee_comments', comments);
    }
  },

  // Letters to Strangers
  getLetters(includeUnapproved = false): Letter[] {
    const letters = getStorageItem<Letter[]>('pen_coffee_letters', INITIAL_LETTERS);
    const filtered = letters.filter(l => l && !TEMPLATE_LETTER_IDS.has(l.id));
    const sorted = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return includeUnapproved ? sorted : sorted.filter(l => l.approved);
  },
  addLetter(letter: Omit<Letter, 'id' | 'approved' | 'createdAt'>): Letter {
    const letters = getStorageItem<Letter[]>('pen_coffee_letters', INITIAL_LETTERS);
    const newLetter: Letter = {
      ...letter,
      id: Math.random().toString(36).substr(2, 9),
      approved: false, // Await moderation
      createdAt: new Date().toISOString()
    };
    letters.push(newLetter);
    setStorageItem('pen_coffee_letters', letters);
    return newLetter;
  },
  approveLetter(id: string): void {
    const letters = this.getLetters(true);
    const index = letters.findIndex(l => l.id === id);
    if (index > -1) {
      letters[index].approved = true;
      setStorageItem('pen_coffee_letters', letters);
    }
  },
  rejectLetter(id: string): void {
    const letters = this.getLetters(true).filter(l => l.id !== id);
    setStorageItem('pen_coffee_letters', letters);
  },
  replyToLetter(id: string, replyText: string): void {
    const letters = this.getLetters(true);
    const index = letters.findIndex(l => l.id === id);
    if (index > -1) {
      letters[index].reply = replyText;
      letters[index].repliedAt = new Date().toISOString();
      setStorageItem('pen_coffee_letters', letters);
    }
  },

  // Coffee Table Items
  getCoffeeTable(): CoffeeTableItem[] {
    const items = getStorageItem<CoffeeTableItem[]>('pen_coffee_coffeetable', INITIAL_COFFEE_TABLE);
    const filtered = items.filter(i => i && !TEMPLATE_COFFEE_TABLE_IDS.has(i.id));
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  addCoffeeTableItem(item: Omit<CoffeeTableItem, 'id' | 'createdAt'>): CoffeeTableItem {
    const items = getStorageItem<CoffeeTableItem[]>('pen_coffee_coffeetable', INITIAL_COFFEE_TABLE);
    const newItem: CoffeeTableItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    setStorageItem('pen_coffee_coffeetable', items);
    return newItem;
  },
  deleteCoffeeTableItem(id: string): void {
    const items = this.getCoffeeTable().filter(item => item.id !== id);
    setStorageItem('pen_coffee_coffeetable', items);
  },

  // Newsletter Subscriptions
  getNewsletterSubscribers(): string[] {
    return getStorageItem<string[]>('pen_coffee_newsletter', ['reader.clara@gmail.com', 'wordsandbeans@outlook.com']);
  },
  subscribeNewsletter(email: string): boolean {
    const list = this.getNewsletterSubscribers();
    if (list.includes(email)) return false;
    list.push(email);
    setStorageItem('pen_coffee_newsletter', list);
    return true;
  },
  unsubscribeNewsletter(email: string): void {
    const list = this.getNewsletterSubscribers().filter(e => e !== email);
    setStorageItem('pen_coffee_newsletter', list);
  },

  // Simple Analytics Dashboard
  getAnalytics(): {
    totalPosts: number;
    stories: number;
    poems: number;
    articles: number;
    bookNotes: number;
    weeklyBrews: number;
    subscribers: number;
    comments: number;
    letters: number;
    views: number;
  } {
    const posts = this.getPosts(true);
    const comments = this.getComments(undefined, true);
    const letters = this.getLetters(true);
    const subs = this.getNewsletterSubscribers();
    const totalViews = posts.reduce((sum, p) => sum + p.views, 12050); // baseline static analytics

    return {
      totalPosts: posts.length,
      stories: posts.filter(p => p.type === 'story').length,
      poems: posts.filter(p => p.type === 'poem' || p.type === 'article').length,
      articles: posts.filter(p => p.type === 'article' || p.type === 'poem').length,
      bookNotes: posts.filter(p => p.type === 'book-note').length,
      weeklyBrews: posts.filter(p => p.type === 'weekly-brew').length,
      subscribers: subs.length,
      comments: comments.length,
      letters: letters.length,
      views: totalViews
    };
  }
};
