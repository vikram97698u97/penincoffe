export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'author' | 'reader';
  createdAt: string;
  updatedAt: string;
}

export type PostType = 'story' | 'poem' | 'book-note' | 'weekly-brew';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  type: PostType;
  category: string; // e.g., 'Literary Fiction', 'Romance', 'Love', 'Nature', 'Takeaways', 'Reading Wrap-Up'
  mood?: 'Love' | 'Loss' | 'Hope' | 'Nature' | 'Healing' | 'Reflection';
  tags: string[];
  readingTime: number; // in minutes
  featured: boolean;
  published: boolean;
  views: number;
  favorites: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  nickname: string;
  feeling: string; // "What did this piece make you feel?" (e.g., 'Comforted', 'Inspired', 'Melancholic', 'Warm')
  content: string;
  approved: boolean;
  likes: number;
  createdAt: string;
}

export interface Rating {
  id: string;
  postId: string;
  rating: number; // 1 to 5
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface Newsletter {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface Letter {
  id: string;
  nickname: string;
  category: 'confessions' | 'regrets' | 'dreams' | 'thank-you' | 'goodbyes';
  message: string;
  approved: boolean;
  reply?: string; // Thoughtful response written by the author
  repliedAt?: string;
  createdAt: string;
}

export interface CoffeeTableItem {
  id: string;
  type: 'quote' | 'prompt' | 'song' | 'photo' | 'observation';
  content: string;
  mediaUrl?: string; // For photos, spotify embed URLs, etc.
  authorNickname: string;
  tags: string[];
  createdAt: string;
}

export interface Analytics {
  id: string;
  pageViews: number;
  storiesCount: number;
  poemsCount: number;
  lettersCount: number;
  subscribersCount: number;
  commentsCount: number;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface BookShelfItem {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  review?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  source: string;
  year: string;
}

export interface Settings {
  id: string;
  siteName: string;
  tagline: string;
  mission: string;
  aboutText: string;
  aboutPhilosophy: string;
  authorName: string;
  authorBio: string;
  authorImage?: string;
  authorTagline?: string;
  authorBlurb?: string;
  timeline: TimelineEvent[];
  bookshelf: BookShelfItem[];
  email: string;
  instagram?: string;
  twitter?: string;
  heroTitle?: string;
  featuredQuote?: string;
  whyStartedText?: string;
  publications?: PublicationItem[];
}
