import { ref, get, set as firebaseSet, push, update as firebaseUpdate, remove, query, orderByChild } from 'firebase/database';
import { database } from './firebase';
import { db } from './db';
import { Post, Comment, Letter, CoffeeTableItem, Settings } from '@/types/database';

// Helper to recursively remove undefined properties from an object for Firebase compatibility
function cleanUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanUndefined(item)) as any;
  }
  if (typeof obj === 'object') {
    const newObj = {} as any;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        if (val !== undefined) {
          newObj[key] = cleanUndefined(val);
        }
      }
    }
    return newObj;
  }
  return obj;
}

// Wrap set and update to ensure undefined fields are removed before sending to Firebase
function set(ref: any, value: any): Promise<void> {
  return firebaseSet(ref, cleanUndefined(value));
}

function update(ref: any, values: Record<string, any>): Promise<void> {
  return firebaseUpdate(ref, cleanUndefined(values));
}

// Helper to convert Firebase object to array and ensure IDs are set
function toArray<T>(obj: Record<string, T> | null): (T & { id: string })[] {
  if (!obj) return [];
  return Object.keys(obj).map(key => ({
    ...obj[key],
    id: key
  })) as (T & { id: string })[];
}
const INITIAL_SETTINGS: Settings = {
  id: 'global',
  siteName: 'Pen in Coffee',
  tagline: 'Words brewed, stories shared.',
  mission: 'Create a warm online space where readers can enjoy stories, poetry, reflections, book notes, weekly letters, and meaningful conversations.',
  aboutText: 'Welcome to my little corner of the internet where thoughts meet ink and every story is brewed with honesty. I am a writer, a reader, and a caffeine enthusiast trying to capture the transient beauty of everyday life in words.',
  aboutPhilosophy: 'I believe writing is like brewing coffee: it takes patience, the right temperature, and a willingness to sit with the bitterness to find the sweetness.',
  authorName: 'Aria Thorne',
  authorBio: 'Aria Thorne is an essayist and poet. After working in corporate journalism for years, she left the rush of newsrooms to open a slow-styled digital sanctuary.',
  authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  authorTagline: 'Essayist & Poet · Anthology Editor',
  authorBlurb: 'I spend my days grinding coffee beans, annotations, drafts of essays, and listening to rain. This platform is a sanctuary I designed for people who wish to slow down, read deeply, and share their unsaid words with the world.',
  email: 'hello@penincoffee.com',
  instagram: 'penincoffee.journal',
  twitter: 'penincoffee',
  heroTitle: "I'm just a girl who writes... and a coffee that understands.",
  featuredQuote: "Some stories find you when you're quiet enough to hear them.",
  whyStartedText: "Writing was never a choice for me; it was a survival mechanism. Growing up in crowded cities, I always felt the rush of words in my chest that had no mouth.\n\nI bought my first typewriter at sixteen—a heavy metal Remington that clattered like a train. In that clatter, I found my voice. I realized that putting words onto a page changes their temperature. It takes the fire out of anger and the ice out of grief, turning them into something warm and shareable.\n\nI designed \"Pen in Coffee\" because the modern web has become too fast, too loud, and too commercialized. We need a digital coffeehouse where we can write for truth, not clicks.",
  timeline: [
    { id: 't1', year: '2020', title: 'The First Spark', description: 'Bought a vintage fountain pen and began journaling in a cozy cafe in Prague.' },
    { id: 't2', year: '2022', title: 'Coffee House Columns', description: 'Began sharing short slice-of-life snippets online, building a small community of readers.' },
    { id: 't3', year: '2024', title: 'Pen in Coffee Launches', description: 'Created this dedicated sanctuary to merge literature, book notes, and anonymous letters.' }
  ],
  bookshelf: [
    { id: 'b1', title: 'Letters to a Young Poet', author: 'Rainer Maria Rilke', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300', rating: 5, review: 'A masterclass in isolation, patience, and creative truth.' },
    { id: 'b2', title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón', coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300', rating: 5, review: 'An atmospheric love letter to books, writing, and memory.' },
    { id: 'b3', title: 'Kafka on the Shore', author: 'Haruki Murakami', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300', rating: 4, review: 'Dreamlike, musical, and filled with deep loneliness.' }
  ],
  publications: [
    { id: 'pub1', title: 'The Warmth of Autumn Coffee', source: 'Leaves Literary Review', year: '2022' },
    { id: 'pub2', title: 'Silent Keyboards and Ink Stains', source: 'Pushcart Prize Nominee for Creative Non-Fiction', year: '2023' },
    { id: 'pub3', title: 'Typewriter Ribbons in Prague', source: 'Anthology of slow-writing essayists', year: '2024' }
  ]
};

export const fdb = {
  // Settings
  async getSettings(): Promise<Settings> {
    try {
      const snapshot = await get(ref(database, 'settings/global'));
      if (snapshot.exists() && snapshot.val()) {
        return { ...snapshot.val(), id: 'global' };
      }
    } catch (err) {
      console.warn('Firebase getSettings failed/offline, using fallback:', err);
    }
    return db.getSettings();
  },
  async saveSettings(settings: Settings): Promise<void> {
    try {
      await set(ref(database, 'settings/global'), settings);
    } catch (err) {
      console.warn('Firebase saveSettings failed/offline, using local db:', err);
      db.saveSettings(settings);
    }
  },

  // Posts
  async getPosts(includeUnpublished = false): Promise<Post[]> {
    try {
      const snapshot = await get(ref(database, 'posts'));
      if (snapshot.exists() && snapshot.val()) {
        let posts = toArray<Post>(snapshot.val());
        if (!includeUnpublished) {
          posts = posts.filter(p => p.published);
        }
        return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (err) {
      console.warn('Firebase getPosts failed/offline, using fallback:', err);
    }
    return db.getPosts(includeUnpublished);
  },
  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const posts = await this.getPosts(true);
    return posts.find(p => p.slug === slug);
  },
  async getPostById(id: string): Promise<Post | undefined> {
    const posts = await this.getPosts(true);
    return posts.find(p => p.id === id);
  },
  async savePost(post: Post): Promise<void> {
    try {
      const isNew = !post.id || post.id.startsWith('new-');
      let postRef;
      if (isNew) {
        postRef = push(ref(database, 'posts'));
        post.id = postRef.key as string;
        post.createdAt = new Date().toISOString();
      } else {
        postRef = ref(database, `posts/${post.id}`);
      }
      post.updatedAt = new Date().toISOString();
      await set(postRef, post);
    } catch (err) {
      console.warn('Firebase savePost failed/offline, falling back to local db:', err);
      db.savePost(post);
    }
  },
  async deletePost(id: string): Promise<void> {
    try {
      await remove(ref(database, `posts/${id}`));
    } catch (err) {
      console.warn('Firebase deletePost failed/offline, falling back to local db:', err);
      db.deletePost(id);
    }
  },
  async incrementViews(id: string, currentViews?: number): Promise<void> {
    try {
      if (currentViews !== undefined) {
        await update(ref(database, `posts/${id}`), { views: currentViews + 1 });
      } else {
        const snapshot = await get(ref(database, `posts/${id}`));
        const current = snapshot.exists() ? (snapshot.val().views || 0) : 0;
        await update(ref(database, `posts/${id}`), { views: current + 1 });
      }
    } catch (err) {
      console.warn('Firebase incrementViews failed/offline, falling back to local db:', err);
      db.incrementViews(id, currentViews);
    }
  },
  async incrementFavorites(id: string, currentFavorites?: number): Promise<void> {
    try {
      if (currentFavorites !== undefined) {
        await update(ref(database, `posts/${id}`), { favorites: currentFavorites + 1 });
      } else {
        const snapshot = await get(ref(database, `posts/${id}`));
        const current = snapshot.exists() ? (snapshot.val().favorites || 0) : 0;
        await update(ref(database, `posts/${id}`), { favorites: current + 1 });
      }
    } catch (err) {
      console.warn('Firebase incrementFavorites failed/offline, falling back to local db:', err);
      db.incrementFavorites(id, currentFavorites);
    }
  },

  // Comments
  async getComments(postId?: string, includeUnapproved = false): Promise<Comment[]> {
    try {
      const snapshot = await get(ref(database, 'comments'));
      if (snapshot.exists() && snapshot.val()) {
        let comments = toArray<Comment>(snapshot.val());
        if (postId) comments = comments.filter(c => c.postId === postId);
        if (!includeUnapproved) comments = comments.filter(c => c.approved);
        return comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (err) {
      console.warn('Firebase getComments failed/offline, using fallback:', err);
    }
    return db.getComments(postId, includeUnapproved);
  },
  async addComment(comment: Omit<Comment, 'id' | 'likes' | 'approved' | 'createdAt'>): Promise<Comment> {
    try {
      const newRef = push(ref(database, 'comments'));
      const newComment: Comment = {
        ...comment,
        id: newRef.key as string,
        likes: 0,
        approved: false,
        createdAt: new Date().toISOString()
      };
      await set(newRef, newComment);
      return newComment;
    } catch (err) {
      console.warn('Firebase addComment failed/offline, falling back to local db:', err);
      return db.addComment(comment);
    }
  },
  async approveComment(id: string): Promise<void> {
    try {
      await update(ref(database, `comments/${id}`), { approved: true });
    } catch (err) {
      console.warn('Firebase approveComment failed/offline, falling back to local db:', err);
      db.approveComment(id);
    }
  },
  async rejectOrDeleteComment(id: string): Promise<void> {
    try {
      await remove(ref(database, `comments/${id}`));
    } catch (err) {
      console.warn('Firebase rejectOrDeleteComment failed/offline, falling back to local db:', err);
      db.rejectOrDeleteComment(id);
    }
  },
  async likeComment(id: string, currentLikes?: number): Promise<void> {
    try {
      if (currentLikes !== undefined) {
        await update(ref(database, `comments/${id}`), { likes: currentLikes + 1 });
      } else {
        const snapshot = await get(ref(database, `comments/${id}`));
        const current = snapshot.exists() ? (snapshot.val().likes || 0) : 0;
        await update(ref(database, `comments/${id}`), { likes: current + 1 });
      }
    } catch (err) {
      console.warn('Firebase likeComment failed/offline, falling back to local db:', err);
      db.likeComment(id, currentLikes);
    }
  },

  // Letters
  async getLetters(includeUnapproved = false): Promise<Letter[]> {
    try {
      const snapshot = await get(ref(database, 'letters'));
      if (snapshot.exists() && snapshot.val()) {
        let letters = toArray<Letter>(snapshot.val());
        if (!includeUnapproved) letters = letters.filter(l => l.approved);
        return letters.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (err) {
      console.warn('Firebase getLetters failed/offline, using fallback:', err);
    }
    return db.getLetters(includeUnapproved);
  },
  async addLetter(letter: Omit<Letter, 'id' | 'approved' | 'createdAt'>): Promise<Letter> {
    try {
      const newRef = push(ref(database, 'letters'));
      const newLetter: Letter = {
        ...letter,
        id: newRef.key as string,
        approved: false,
        createdAt: new Date().toISOString()
      };
      await set(newRef, newLetter);
      return newLetter;
    } catch (err) {
      console.warn('Firebase addLetter failed/offline, falling back to local db:', err);
      return db.addLetter(letter);
    }
  },
  async approveLetter(id: string): Promise<void> {
    try {
      await update(ref(database, `letters/${id}`), { approved: true });
    } catch (err) {
      console.warn('Firebase approveLetter failed/offline, falling back to local db:', err);
      db.approveLetter(id);
    }
  },
  async rejectLetter(id: string): Promise<void> {
    try {
      await remove(ref(database, `letters/${id}`));
    } catch (err) {
      console.warn('Firebase rejectLetter failed/offline, falling back to local db:', err);
      db.rejectLetter(id);
    }
  },
  async replyToLetter(id: string, replyText: string): Promise<void> {
    try {
      await update(ref(database, `letters/${id}`), {
        reply: replyText,
        repliedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Firebase replyToLetter failed/offline, falling back to local db:', err);
      db.replyToLetter(id, replyText);
    }
  },

  // Coffee Table
  async getCoffeeTable(): Promise<CoffeeTableItem[]> {
    try {
      const snapshot = await get(ref(database, 'coffeeTable'));
      if (snapshot.exists() && snapshot.val()) {
        return toArray<CoffeeTableItem>(snapshot.val()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (err) {
      console.warn('Firebase getCoffeeTable failed/offline, using fallback:', err);
    }
    return db.getCoffeeTable();
  },
  async addCoffeeTableItem(item: Omit<CoffeeTableItem, 'id' | 'createdAt'>): Promise<CoffeeTableItem> {
    try {
      const newRef = push(ref(database, 'coffeeTable'));
      const newItem: CoffeeTableItem = {
        ...item,
        id: newRef.key as string,
        createdAt: new Date().toISOString()
      };
      await set(newRef, newItem);
      return newItem;
    } catch (err) {
      console.warn('Firebase addCoffeeTableItem failed/offline, falling back to local db:', err);
      return db.addCoffeeTableItem(item);
    }
  },
  async deleteCoffeeTableItem(id: string): Promise<void> {
    try {
      await remove(ref(database, `coffeeTable/${id}`));
    } catch (err) {
      console.warn('Firebase deleteCoffeeTableItem failed/offline, falling back to local db:', err);
      db.deleteCoffeeTableItem(id);
    }
  },

  // Newsletter
  async getNewsletterSubscribers(): Promise<string[]> {
    try {
      const snapshot = await get(ref(database, 'newsletter'));
      if (snapshot.exists() && snapshot.val()) {
        const data = snapshot.val();
        return Object.keys(data).map(k => data[k].email);
      }
    } catch (err) {
      console.warn('Firebase getNewsletterSubscribers failed/offline, using fallback:', err);
    }
    return db.getNewsletterSubscribers();
  },
  async subscribeNewsletter(email: string): Promise<boolean> {
    try {
      const subs = await this.getNewsletterSubscribers();
      if (subs.includes(email)) return false;
      const newRef = push(ref(database, 'newsletter'));
      await set(newRef, { email });
      return true;
    } catch (err) {
      console.warn('Firebase subscribeNewsletter failed/offline, falling back to local db:', err);
      return db.subscribeNewsletter(email);
    }
  },
  async unsubscribeNewsletter(email: string): Promise<void> {
    try {
      const snapshot = await get(ref(database, 'newsletter'));
      if (snapshot.exists() && snapshot.val()) {
        const data = snapshot.val();
        for (const key in data) {
          if (data[key].email === email) {
            await remove(ref(database, `newsletter/${key}`));
          }
        }
      }
    } catch (err) {
      console.warn('Firebase unsubscribeNewsletter failed/offline, falling back to local db:', err);
    }
    db.unsubscribeNewsletter(email);
  },

  // Analytics (Dynamic calculation since real-time)
  async getAnalytics(): Promise<{
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
  }> {
    const posts = await this.getPosts(true);
    const comments = await this.getComments(undefined, true);
    const letters = await this.getLetters(true);
    const subs = await this.getNewsletterSubscribers();
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

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
