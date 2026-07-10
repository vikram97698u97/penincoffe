'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle2, Coffee, Sparkles } from 'lucide-react';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Say Hello');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Simulate sending message
    setSubmitted(true);
    setName('');
    setEmail('');
    setTopic('Say Hello');
    setMessage('');
  };

  return (
    <>

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
            Say Hello
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-coffee-dark tracking-tight">
            Contact Aria
          </h1>
          <p className="text-sm font-serif italic text-coffee-light">
            Want to collaborate, give feedback, share a story of your own, or simply say hello? Drop a line and let's chat.
          </p>
        </div>

        {/* Contact Grids */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Information cards */}
          <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="bg-cream-dark p-6 rounded-lg border border-coffee-light/10 vintage-border space-y-4">
              <h3 className="font-serif text-lg font-bold text-coffee-dark flex items-center gap-1.5">
                <Coffee className="h-4.5 w-4.5 text-terracotta" />
                <span>Slow Correspondence</span>
              </h3>
              <p className="text-xs font-serif italic text-coffee-light leading-relaxed">
                "I read all letters over my morning coffee. I aim to reply within 3-4 business days, depending on how quiet my writing hours are. I look forward to reading your thoughts."
              </p>
            </div>

            <div className="bg-cream-dark p-6 rounded-lg border border-coffee-light/10 vintage-border space-y-4">
              <h3 className="font-serif text-lg font-bold text-coffee-dark flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-terracotta" />
                <span>Collaborations</span>
              </h3>
              <p className="text-xs font-serif italic text-coffee-light leading-relaxed">
                If you are a publisher, fellow writer, poet, or illustrator interested in collaborative work, please select 'Collab Opportunities' in the contact form.
              </p>
            </div>

            <div className="p-4 border border-coffee-light/20 rounded-lg text-[10px] text-coffee-light flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 text-terracotta" />
              <span>Direct: hello@penincoffee.com</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="md:col-span-7 bg-cream-dark p-6 sm:p-8 rounded-lg border border-coffee-light/10 vintage-border">
            {submitted ? (
              <div className="py-16 text-center space-y-4 animate-fade-in">
                <CheckCircle2 className="h-10 w-10 text-sage mx-auto" />
                <h3 className="font-serif text-lg font-bold text-coffee-dark">Message Slipped Under Door</h3>
                <p className="text-xs text-coffee-light font-serif italic max-w-xs mx-auto leading-relaxed">
                  "Thank you! Your words have been delivered. I will read them soon. Go grab a fresh cup of coffee while I work on my reply."
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[10px] uppercase font-bold text-terracotta hover:underline mt-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-coffee-light block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Write your name..."
                    className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark placeholder-coffee-light/35"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-coffee-light block">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Write your email address..."
                    className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark placeholder-coffee-light/35"
                  />
                </div>

                {/* Topic selector */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-coffee-light block">
                    Subject Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark cursor-pointer"
                  >
                    <option value="Say Hello">Just saying hello</option>
                    <option value="Feedback">Feedback on a writing piece</option>
                    <option value="Collab">Collab opportunities</option>
                    <option value="Other">Other inquiries</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-coffee-light block">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your letter content here..."
                    className="w-full px-3 py-2 bg-cream-light border border-coffee-light/20 rounded focus:outline-none focus:border-terracotta text-sm text-coffee-dark font-serif italic placeholder-coffee-light/35 leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-coffee-dark text-cream-light hover:bg-coffee-light transition-colors py-2.5 rounded text-xs uppercase font-bold tracking-wider vintage-border border-coffee-dark flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}
