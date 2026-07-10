'use client';

import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { fdb as db } from '@/lib/firebaseDB';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simple email regex validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    const success = await db.subscribeNewsletter(email);
    if (success) {
      setSubscribed(true);
      setEmail('');
    } else {
      setError('You are already subscribed to the newsletter!');
    }
  };

  return (
    <section className="bg-cream-dark border border-coffee-light/10 rounded-xl p-8 md:p-12 vintage-border text-center max-w-4xl mx-auto my-12 relative overflow-hidden">
      {/* Decorative coffee bean graphic */}
      <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] text-coffee-dark font-serif text-[180px] pointer-events-none select-none select-none select-none select-none select-none">
        ☕
      </div>

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
          Weekly Letters
        </span>

        <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-coffee-dark">
          Stay for another cup.
        </h2>

        <p className="text-sm md:text-base text-coffee-light font-serif italic max-w-lg mx-auto">
          Receive stories, poems, reflections, and weekly brews directly in your inbox every Sunday morning.
        </p>

        {subscribed ? (
          <div className="bg-sage/10 border border-sage/20 rounded-lg p-6 max-w-md mx-auto flex flex-col items-center gap-2 animate-fade-in">
            <CheckCircle2 className="h-8 w-8 text-sage" />
            <p className="text-sm font-semibold text-coffee-dark">You've been added to the brew list!</p>
            <p className="text-xs text-coffee-light">Check your inbox next Sunday for the fresh newsletter.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto items-stretch">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-coffee-light/60">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Write your email here..."
                className="w-full pl-9 pr-4 py-3 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm text-coffee-dark transition-all placeholder-coffee-light/40"
              />
            </div>
            <button
              type="submit"
              className="bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors px-6 py-3 rounded font-medium text-sm vintage-border border-coffee-dark"
            >
              Subscribe
            </button>
          </form>
        )}

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
        
        <p className="text-[10px] text-coffee-light/60">
          No spam, ever. Just hot, fresh words. Unsubscribe with a single click at any time.
        </p>
      </div>
    </section>
  );
}
