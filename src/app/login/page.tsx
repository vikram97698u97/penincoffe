'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Coffee, AlertCircle } from 'lucide-react';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="bg-cream-dark border border-coffee-light/10 p-8 rounded-xl shadow-lg w-full max-w-md vintage-border">
          <div className="text-center space-y-2 mb-8">
            <div className="p-3 bg-coffee-dark text-cream-light rounded-full inline-block">
              <Coffee className="h-6 w-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-coffee-dark">Admin Login</h1>
            <p className="text-xs text-coffee-light font-medium uppercase tracking-widest">
              Pen in Coffee CMS
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-coffee-light">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm text-coffee-dark"
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-coffee-light">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm text-coffee-dark"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors py-3 rounded text-xs uppercase font-bold tracking-wider disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
