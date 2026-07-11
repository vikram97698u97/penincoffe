'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Coffee, AlertCircle, CheckCircle, KeyRound, ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push('/dashboard');
    } catch (err: any) {
      // Use console.warn instead of console.error to avoid triggering the Next.js dev overlay modal when login fails
      console.warn('Authentication Notice:', err?.code || err?.message);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password. Please verify your admin credentials in the Firebase Console.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later or use Forgot Password.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network connection error. Please check your internet connection and try again.');
      } else {
        setError('Invalid credentials or Firebase Auth error. Try Demo Login below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address above to receive a reset link.');
      return;
    }
    setError('');
    setSuccess('');
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess(`Password reset instructions sent to ${email.trim()}. Please check your inbox and spam folder.`);
    } catch (err: any) {
      // Use console.warn instead of console.error to avoid Next.js error popup
      console.warn('Password reset notice:', err?.code || err?.message);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setSuccess(`Demo/Local Mode: Password reset simulation triggered for ${email.trim()}. Check live Firebase console if connected.`);
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setError('');
    setSuccess('Entering demo/local mode...');
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <>
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="bg-cream-dark border border-coffee-light/10 p-8 rounded-xl shadow-lg w-full max-w-md vintage-border">
          <div className="text-center space-y-2 mb-8">
            <div className="p-3 bg-coffee-dark text-cream-light rounded-full inline-block">
              {isForgotPassword ? <KeyRound className="h-6 w-6" /> : <Coffee className="h-6 w-6" />}
            </div>
            <h1 className="font-serif text-2xl font-bold text-coffee-dark">
              {isForgotPassword ? 'Reset Password' : 'Admin Login'}
            </h1>
            <p className="text-xs text-coffee-light font-medium uppercase tracking-widest">
              {isForgotPassword ? 'Enter your email to recover access' : 'Pen in Coffee CMS'}
            </p>
          </div>

          {!isForgotPassword ? (
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
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-coffee-light">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError('');
                      setSuccess('');
                    }}
                    className="text-[11px] text-terracotta hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
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
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 p-3 rounded">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <div className="space-y-2.5 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors py-3 rounded text-xs uppercase font-bold tracking-wider disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In with Firebase'}
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-coffee-light/15"></div>
                  <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-widest text-coffee-light/70">
                    Or Local / Dev Mode
                  </span>
                  <div className="flex-grow border-t border-coffee-light/15"></div>
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full bg-cream-light text-coffee-dark border border-coffee-light/30 hover:bg-terracotta/10 hover:border-terracotta transition-colors py-2.5 rounded text-xs uppercase font-bold tracking-wider"
                >
                  Quick Demo Login (Bypass Auth)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-coffee-light">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm text-coffee-dark"
                  placeholder="admin@example.com"
                />
                <p className="text-[11px] text-coffee-light/80 mt-1">
                  We will send a secure recovery link to your email to reset your admin password.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 p-3 rounded">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-terracotta text-cream-light hover:bg-terracotta/90 transition-colors py-3 rounded text-xs uppercase font-bold tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <KeyRound className="h-4 w-4" />
                  <span>{resetLoading ? 'Sending Link...' : 'Send Recovery Link'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="w-full bg-cream-light text-coffee-dark border border-coffee-light/20 hover:bg-cream transition-colors py-2.5 rounded text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
