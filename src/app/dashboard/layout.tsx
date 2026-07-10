'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  LayoutDashboard,
  FileText,
  Heart,
  MessageSquare,
  Mail,
  Settings,
  ArrowLeft,
  Coffee,
  Menu,
  X,
  BookOpen,
  Feather,
  LayoutGrid,
  PenTool
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream-dark/40">
        <Coffee className="h-8 w-8 text-coffee-light animate-spin" />
      </div>
    );
  }

  const isActive = (path: string) => {
    return pathname === path;
  };

  const menuItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/posts', label: 'All Posts', icon: FileText },
    { href: '/dashboard/stories', label: 'Stories', icon: PenTool },
    { href: '/dashboard/poetry', label: 'Poetry', icon: Feather },
    { href: '/dashboard/book-notes', label: 'Book Notes', icon: BookOpen },
    { href: '/dashboard/weekly-brew', label: 'Weekly Brews', icon: Mail },
    { href: '/dashboard/coffee-table', label: 'Coffee Table', icon: LayoutGrid },
    { href: '/dashboard/letters', label: 'Letters Moderation', icon: Heart },
    { href: '/dashboard/comments', label: 'Comments Moderation', icon: MessageSquare },
    { href: '/dashboard/newsletter', label: 'Newsletter List', icon: Mail },
    { href: '/dashboard/settings', label: 'Global Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-cream-dark/40 overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-coffee-dark text-cream-light border-r border-coffee-light/20 flex-shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-cream-light/10 flex items-center gap-2">
          <div className="p-1.5 bg-cream-light text-coffee-dark rounded-full">
            <Coffee className="h-4 w-4" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight block">
              Pen in Coffee
            </span>
            <span className="text-[9px] uppercase tracking-widest text-cream-dark/65 block font-bold">
              Admin CMS Console
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded text-xs font-semibold tracking-wide transition-all ${
                  isActive(item.href)
                    ? 'bg-cream-light text-coffee-dark'
                    : 'text-cream-dark/80 hover:bg-cream-light/5 hover:text-cream-light'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Go back */}
        <div className="p-4 border-t border-cream-light/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-cream-dark/80 hover:text-cream-light transition-colors py-2 px-3 hover:bg-cream-light/5 rounded"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>View Website</span>
          </Link>
          <button
            onClick={() => signOut(auth)}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors py-2 px-3 hover:bg-cream-light/5 rounded"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-coffee-dark/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          
          <aside className="relative flex flex-col w-64 max-w-xs bg-coffee-dark text-cream-light z-10 animate-slide-in">
            <div className="p-6 border-b border-cream-light/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-terracotta" />
                <span className="font-serif text-base font-bold">CMS Console</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-cream-light/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded text-xs font-bold transition-all ${
                      isActive(item.href)
                        ? 'bg-cream-light text-coffee-dark'
                        : 'text-cream-dark/80 hover:bg-cream-light/5 hover:text-cream-light'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-cream-light/10 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-xs font-bold text-cream-dark/80 hover:text-cream-light transition-colors py-2 px-3 rounded"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>View Website</span>
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signOut(auth);
                }}
                className="w-full flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors py-2 px-3 rounded"
              >
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Panel content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Mobile Header bar */}
        <header className="lg:hidden h-16 bg-coffee-dark text-cream-light flex items-center justify-between px-6 border-b border-cream-light/10 flex-shrink-0 z-40">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            <span className="font-serif text-md font-bold">Pen in Coffee CMS</span>
          </div>
          <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-cream-light/5 rounded">
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Scrollable contents panel */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8 bg-cream-light/45">
          {children}
        </main>
      </div>

    </div>
  );
}
