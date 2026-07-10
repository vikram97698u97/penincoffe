import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export default function TermsOfService() {
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

        <h1 className="font-serif text-3xl font-bold text-coffee-dark tracking-tight">Terms of Service</h1>
        
        <p className="text-xs text-coffee-light font-sans font-medium uppercase">Last Updated: June 24, 2026</p>

        <p className="text-sm">
          Welcome to Pen in Coffee ("Platform"). By entering this digital coffeehouse, reading, or submitting letters/comments, you agree to these Terms of Service.
        </p>

        <h3 className="font-serif text-lg font-bold text-coffee-dark mt-6 border-b border-coffee-light/10 pb-1">1. Acceptable Use</h3>
        <p className="text-sm font-light">
          We designed this space to be safe, warm, comforting, and intimate. When writing reflections or submitting anonymous letters, you agree to refrain from posting:
        </p>
        <ul className="text-sm font-light list-disc pl-6 space-y-1">
          <li>Harassment, threatening statements, or hate speech targeting individuals.</li>
          <li>Commercial spam, advertisement, or promotion.</li>
          <li>Personally identifiable information of other people without their consent.</li>
        </ul>

        <h3 className="font-serif text-lg font-bold text-coffee-dark mt-6 border-b border-coffee-light/10 pb-1">2. Letter & Comment Moderation</h3>
        <p className="text-sm font-light">
          To maintain the warm visual style and emotional safety of the platform, the author reserves the right to approve, reject, delete, or reply to any anonymous letter or comment reflection. Submitting content does not guarantee publication on the public boards.
        </p>

        <h3 className="font-serif text-lg font-bold text-coffee-dark mt-6 border-b border-coffee-light/10 pb-1">3. Intellectual Property</h3>
        <p className="text-sm font-light">
          The stories, poems, book notes, and weekly letters published by Aria Thorne are owned by the author. You may share links to these writings, but reproducing entire texts elsewhere without permission is prohibited.
        </p>
        <p className="text-sm font-light">
          By submitting anonymous letters, you grant the platform a license to display them publicly and compose responses.
        </p>

        <h3 className="font-serif text-lg font-bold text-coffee-dark mt-6 border-b border-coffee-light/10 pb-1">4. Disclaimer</h3>
        <p className="text-sm font-light">
          Anonymous letters and response replies are meant for comfort and creative expression. They do not constitute professional counseling, medical advice, or psychiatric therapy.
        </p>
      </main>

      <Footer />
    </>
  );
}
