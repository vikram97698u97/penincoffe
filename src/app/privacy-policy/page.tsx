import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <>

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-serif leading-relaxed text-coffee-dark/95">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-coffee-light hover:text-coffee-dark transition-colors uppercase tracking-widest font-sans"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back Home</span>
        </Link>

        <h1 className="font-serif text-3xl font-bold text-coffee-dark tracking-tight">Privacy Policy</h1>
        
        <p className="text-xs text-coffee-light font-sans font-medium uppercase">Last Updated: June 24, 2026</p>

        <p className="text-sm">
          Welcome to Pen in Coffee. Your privacy is critical to us. This Privacy Policy describes how we handle information across the platform.
        </p>

        <h3 className="font-serif text-lg font-bold text-coffee-dark mt-6 border-b border-coffee-light/10 pb-1">1. Information We Collect</h3>
        <p className="text-sm font-light">
          <strong>Anonymous Letters:</strong> When you submit a letter to strangers, we do not log your IP address, browser information, or geolocation. Submissions are strictly anonymous. We only store the nickname, category, and message text you provide.
        </p>
        <p className="text-sm font-light">
          <strong>Reflections / Comments:</strong> When you leave a comment reflection on stories, we store the nickname, comment text, and selected feeling category you input.
        </p>
        <p className="text-sm font-light">
          <strong>Newsletter Subscriptions:</strong> If you sign up to "Stay for another cup," we collect your email address solely to deliver weekly Sunday Morning brews. You can unsubscribe at any time using the link in the footer of our newsletters.
        </p>

        <h3 className="font-serif text-lg font-bold text-coffee-dark mt-6 border-b border-coffee-light/10 pb-1">2. Cookies</h3>
        <p className="text-sm font-light">
          We use simple localStorage records inside your browser to remember your liked posts, rated stories, and newsletter subscription state locally. No commercial tracking cookies or advertising scripts are loaded.
        </p>

        <h3 className="font-serif text-lg font-bold text-coffee-dark mt-6 border-b border-coffee-light/10 pb-1">3. Data Sharing</h3>
        <p className="text-sm font-light">
          We do not sell, rent, or trade your information with any third-party marketing companies. 
        </p>

        <h3 className="font-serif text-lg font-bold text-coffee-dark mt-6 border-b border-coffee-light/10 pb-1">4. Contact</h3>
        <p className="text-sm font-light">
          If you have questions about this policy, please reach out to us at <a href="mailto:hello@penincoffee.com" className="text-terracotta underline">hello@penincoffee.com</a>.
        </p>
      </main>

      <Footer />
    </>
  );
}
