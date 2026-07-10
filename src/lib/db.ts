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

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    title: 'The Day I Finally Chose Myself',
    slug: 'the-day-i-finally-chose-myself',
    excerpt: 'There are days when you wake up and realize you\'ve been living for everyone else but yourself. This is the story of one such quiet Tuesday.',
    content: `There are days when you wake up and realize you've been living for everyone else but yourself. This is the story of one such quiet Tuesday.

I remember the exact temperature of the room: 68 degrees. The radiator was clinking a rhythmic, metal song. Beside my bed lay a stack of unchecked emails, unread contracts, and the weight of expectations I never agreed to carry but somehow inherited anyway.

I walked to the kitchen, poured cold water into the kettle, and watched the gas flame flicker blue. The kitchen was quiet. For the first time in three years, I had nothing to do for the next sixty minutes. 

It was a small rebellion, choosing to brew a slow pour-over instead of grabbing a quick, bitter espresso on the run. I watched the water bloom over the coffee grounds, releasing that deep, nutty aroma of roasted hazelnuts and dark soil. 

In that stream of steam, I saw the reflection of my last decade. I had chased achievements to prove my worth. I had said "yes" to projects that drained my soul just to keep the peace. I had written pieces for commercial success rather than emotional truth.

"No more," I whispered to the empty mugs on the shelf.

Chose myself. It didn\'t come with a grand declaration or a suitcase packed in the dark. It started with sitting in my armchair, feeling the warm porcelain cup against my palms, and writing a single honest paragraph. I wrote about the fear of letting people down. I wrote about the quiet, heavy joy of being alone.

If you are reading this over your own cup of coffee, consider this your gentle permission: it is okay to put down the weights you were never meant to carry. It is okay to be a little quiet today. It is okay to choose your own path.`,
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    type: 'story',
    category: 'Slice of Life',
    mood: 'Healing',
    tags: ['self-love', 'rebellion', 'slow-living'],
    readingTime: 6,
    featured: true,
    published: true,
    views: 1420,
    favorites: 312,
    authorId: 'author-aria',
    createdAt: '2026-05-20T10:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z'
  },
  {
    id: 'p2',
    title: 'The Silence We Never Talk About',
    slug: 'the-silence-we-never-talk-about',
    excerpt: 'We describe silence as empty, but anyone who has shared a cold kitchen with a loved one knows silence is the heaviest thing in the room.',
    content: `We describe silence as empty, but anyone who has shared a cold kitchen with a loved one knows silence is the heaviest thing in the room.

We sat across from each other. Between us sat two cups of black coffee, long gone cold. A thin skin of oil had formed on the surface, catching the amber light of the setting sun.

"Are you going?" she asked.

I looked down. I didn't want to answer because answering meant speaking, and speaking would break the fragile equilibrium we had built out of unsaid words. Silence was our shield, even if it was suffocating us.

In literary fiction, characters always have eloquent dialogues before they part. They say words that sound like poetry. In reality, we lose each other in the spaces between sentences. We lose each other because we are too tired to explain the sadness inside.

I took a sip of the cold coffee. It was bitter, clinging to the back of my throat. 

"I think I have to," I finally said.

The silence returned instantly, heavier this time, settling into the corners of the kitchen like dust. It was the silence of endings. The silence of a fire that had run out of wood.`,
    coverImage: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=800',
    type: 'story',
    category: 'Literary Fiction',
    mood: 'Loss',
    tags: ['silence', 'goodbyes', 'relationships'],
    readingTime: 4,
    featured: false,
    published: true,
    views: 890,
    favorites: 142,
    authorId: 'author-aria',
    createdAt: '2026-05-24T08:30:00Z',
    updatedAt: '2026-05-24T08:30:00Z'
  },
  {
    id: 'p3',
    title: 'Midnight Brewing',
    slug: 'midnight-brewing',
    excerpt: 'A poem on the quiet hours of midnight, the smell of dark roasts, and the ghosts of memory that visit us when the world is asleep.',
    content: `The clock strikes twelve,
and the kitchen is a stage of shadows.
The blue flame of the gas burner
casts a neon glow on the tiles.

I scoop dark beans,
black like obsidian,
smelling of charred wood
and old dreams.

The grinder screams,
shattering the night,
then subsides into a low hum.

Water falls like heavy rain,
washing away the dust of today.
In the steam, I see your face,
a specter made of hazelnut and smoke.

We drink to forget,
yet we brew to remember.`,
    coverImage: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800',
    type: 'poem',
    category: 'Free Verse',
    mood: 'Reflection',
    tags: ['poetry', 'midnight', 'longing'],
    readingTime: 2,
    featured: false,
    published: true,
    views: 520,
    favorites: 89,
    authorId: 'author-aria',
    createdAt: '2026-05-22T23:55:00Z',
    updatedAt: '2026-05-22T23:55:00Z'
  },
  {
    id: 'p4',
    title: 'A Quiet Corner',
    slug: 'a-quiet-corner',
    excerpt: 'Finding hope in the green leaves of a cafe plant, and the simple act of breathing in a crowded city.',
    content: `In the corner of the crowded cafe,
where the espresso machine roars
and voices clash like waves,
stands a small Monstera plant.

Its green leaves stretch outward,
catching the faint sunlight
through the steamed glass.

It does not compete for attention.
It does not rush to grow.
It simply sits,
breathing in our carbon confessions,
returning oxygen and peace.

Perhaps hope is not a loud banner.
Perhaps it is just a leaf,
unfolding in the corner of a noisy room,
waiting for its share of light.`,
    coverImage: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=800',
    type: 'poem',
    category: 'Healing',
    mood: 'Hope',
    tags: ['poetry', 'hope', 'peace'],
    readingTime: 2,
    featured: false,
    published: true,
    views: 430,
    favorites: 95,
    authorId: 'author-aria',
    createdAt: '2026-05-18T14:20:00Z',
    updatedAt: '2026-05-18T14:20:00Z'
  },
  {
    id: 'p5',
    title: 'The Book That Sat With Me All Week',
    slug: 'the-book-that-sat-with-me-all-week',
    excerpt: 'My reflections on "Letters to a Young Poet" and why Rilke\'s words are the ultimate comfort for lonely creatives.',
    content: `This week, a slim volume bound in faded linen sat on my coffee table, my desk, and eventually, my nightstand. It was Rainer Maria Rilke's *Letters to a Young Poet*.

If you are a writer, or indeed anyone attempting to build something out of nothing, this book is not just reading material; it is a mirror and a sanctuary.

### Favorite Quotes

> "Go into yourself. Search for the reason that bids you write; find out whether it is spreading its roots in the deepest place of your heart."

Rilke does not ask the young writer if his grammar is correct or if his plots are fast-paced. He asks: *Would you die if you were forbidden to write?* It is a terrifying, beautiful question that cuts through all commercial chatter.

### Lessons Learned

1. **Love your solitude.** Rilke suggests that loneliness is not a curse, but a spacious room where your creative soul can stretch.
2. **Be patient with doubts.** "Live the questions now," he writes. We want answers immediately, but some answers can only be lived, not spoken.

### Rating: 5/5 Cups of Coffee
Highly recommended for anyone feeling lost in their creative journey. Sit with it, read one letter a night, and let the quietness sink in.`,
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800',
    type: 'book-note',
    category: 'Books That Changed Me',
    tags: ['rilke', 'creativity', 'solitude', 'booknotes'],
    readingTime: 5,
    featured: false,
    published: true,
    views: 650,
    favorites: 110,
    authorId: 'author-aria',
    createdAt: '2026-05-17T09:15:00Z',
    updatedAt: '2026-05-17T09:15:00Z'
  },
  {
    id: 'p6',
    title: 'Weekly Brew #3 - Little lessons & tiny moments',
    slug: 'weekly-brew-3-little-lessons-tiny-moments',
    excerpt: 'Our weekly gather: lessons on slowing down, notes on vintage typewriter hunting, and a question on writing in cafes.',
    content: `Welcome back to your Sunday morning cup. Pour a fresh brew, find a cozy chair, and let\'s catch up.

### What happened this week
I spent Tuesday morning wandering through an old antique shop in the historic district. I found a 1964 Hermes Baby typewriter. Its keys were dusty, but they still struck the ribbon with a satisfying clack. I bought it, cleaned it with orange oil, and wrote my first letter on it (which I sent to a stranger).

### What I learned
Slowing down the physical act of writing changes the thoughts themselves. On a computer, I delete sentences before they are finished. On a typewriter, I am forced to commit to my mistakes. It is a terrifying and liberating lesson.

### What I read
I revisited Mary Oliver's poetry collection, *Devotions*. Her ability to find godliness in a common grasshopper is the ultimate antidote to digital burnout.

### What I wrote
I finished draft two of a story about a clockmaker who loses his sense of time. Look out for "The Watchmaker's Sunday" next month.

### One recommendation
Next time you brew coffee, try adding a tiny pinch of cardamom to the grounds before pouring water. It is a traditional Middle Eastern touch that turns an ordinary cup into a warm, spiced hug.

### One photo
*A photo of the vintage Hermes typewriter sitting on my wooden table, surrounded by eucalyptus leaves.*

### Question for readers
Do you write better in the public noise of a bustling cafe, or in the absolute silence of your own room? Reply below, I would love to hear your thoughts.`,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    type: 'weekly-brew',
    category: 'Weekly Brew',
    tags: ['weekly-brew', 'typewriters', 'slow-living'],
    readingTime: 3,
    featured: false,
    published: true,
    views: 740,
    favorites: 98,
    authorId: 'author-aria',
    createdAt: '2026-05-19T07:00:00Z',
    updatedAt: '2026-05-19T07:00:00Z'
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    postId: 'p1',
    nickname: 'Aanya ❤️',
    feeling: 'Inspired',
    content: 'This hit me so hard. Beautifully written! I have been carrying so much extra weight, and reading this over my morning cup felt like a sign to finally put it down.',
    approved: true,
    likes: 12,
    createdAt: '2026-05-20T11:30:00Z'
  },
  {
    id: 'c2',
    postId: 'p1',
    nickname: 'Rohan',
    feeling: 'Comforted',
    content: 'Thank you for writing this. Needed to read it today. The description of the kettle and the pour-over was so grounding.',
    approved: true,
    likes: 8,
    createdAt: '2026-05-20T12:05:00Z'
  },
  {
    id: 'c3',
    postId: 'p2',
    nickname: 'Maya',
    feeling: 'Melancholic',
    content: 'The cold coffee, the skin forming on top... what an incredible and painful metaphor. Some silences really do break you.',
    approved: true,
    likes: 5,
    createdAt: '2026-05-24T09:40:00Z'
  }
];

const INITIAL_LETTERS: Letter[] = [
  {
    id: 'l1',
    nickname: 'Lonely Sparrow',
    category: 'confessions',
    message: 'I still check your Spotify status to see what songs you are listening to. I know we said we needed clean breaks, but music was the only language we never argued in.',
    approved: true,
    reply: 'Dear Lonely Sparrow, music has a way of leaving footprints where words cannot tread. It is okay to look at those footprints sometimes, but remember to write your own new melodies too. Sending you warmth.',
    repliedAt: '2026-05-21T18:00:00Z',
    createdAt: '2026-05-20T22:15:00Z'
  },
  {
    id: 'l2',
    nickname: 'Stargazer',
    category: 'dreams',
    message: 'One day, I want to open a small bakery in a seaside town. It will smell like cinnamon, ocean salt, and fresh paper. I want to spend my mornings baking and my evenings writing under the lanterns.',
    approved: true,
    reply: 'Dear Stargazer, your dream smells beautiful. Hold onto it. Seaside ovens have a way of baking the most honest stories. I hope I get to visit your bakery one day.',
    repliedAt: '2026-05-22T19:30:00Z',
    createdAt: '2026-05-21T02:40:00Z'
  },
  {
    id: 'l3',
    nickname: 'Wandering Soul',
    category: 'regrets',
    message: 'I never told my grandmother how much I loved her handmade quilts before she passed. I thought I had more time. Now I sleep under them every night, feeling the weight of my unsaid thank you.',
    approved: true,
    createdAt: '2026-06-01T15:10:00Z'
  }
];

const INITIAL_COFFEE_TABLE: CoffeeTableItem[] = [
  {
    id: 'ct1',
    type: 'quote',
    content: '“We write to taste life twice, in the moment and in retrospect.” — Anaïs Nin',
    authorNickname: 'Aria',
    tags: ['writing', 'inspiration'],
    createdAt: '2026-05-15T12:00:00Z'
  },
  {
    id: 'ct2',
    type: 'song',
    content: 'Currently looping "Rivers and Roads" by The Head and the Heart. It feels like wood smoke, autumn leaves, and the ache of friends moving away.',
    mediaUrl: 'https://open.spotify.com/embed/track/25szRkJL58MInP594Z4H38',
    authorNickname: 'Aria',
    tags: ['indie-folk', 'autumn-vibes'],
    createdAt: '2026-05-16T14:30:00Z'
  },
  {
    id: 'ct3',
    type: 'prompt',
    content: 'Writing Prompt: Write a scene set entirely inside a train station at 3:00 AM. One character must be carrying a wet envelope, and another must be drinking chamomile tea.',
    authorNickname: 'Aria',
    tags: ['writing-prompt', 'creative'],
    createdAt: '2026-05-18T09:00:00Z'
  },
  {
    id: 'ct4',
    type: 'photo',
    content: 'Caught the morning sun hitting my journal just right. A cup of mocha, a blank page, and a quiet hour.',
    mediaUrl: 'https://images.unsplash.com/photo-1488998427799-e3362ed89d88?auto=format&fit=crop&q=80&w=600',
    authorNickname: 'Aria',
    tags: ['aesthetic', 'morning-routine'],
    createdAt: '2026-05-20T08:15:00Z'
  },
  {
    id: 'ct5',
    type: 'observation',
    content: 'Tiny Observation: The barista at my local cafe remembers my name but spells it differently every time. Today I was "Arya," yesterday I was "Area." It makes me feel like a minor character in several different novels.',
    authorNickname: 'Aria',
    tags: ['slice-of-life', 'funny'],
    createdAt: '2026-05-21T16:40:00Z'
  }
];

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
    const sorted = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    const filtered = postId ? comments.filter(c => c.postId === postId) : comments;
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
    const sorted = letters.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
      poems: posts.filter(p => p.type === 'poem').length,
      bookNotes: posts.filter(p => p.type === 'book-note').length,
      weeklyBrews: posts.filter(p => p.type === 'weekly-brew').length,
      subscribers: subs.length,
      comments: comments.length,
      letters: letters.length,
      views: totalViews
    };
  }
};
