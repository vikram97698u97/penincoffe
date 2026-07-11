'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Coffee, PenTool, Search, Menu, X, Heart, Settings } from 'lucide-react';

const COFFEE_MENU_ITEMS = [
  { name: 'Espresso', label: 'Espresso', desc: 'Quick reads (1-3 min)', range: [1, 3] },
  { name: 'Americano', label: 'Americano', desc: 'Short reads (3-5 min)', range: [3, 5] },
  { name: 'Cappuccino', label: 'Cappuccino', desc: 'Medium reads (5-10 min)', range: [5, 10] },
  { name: 'Latte', label: 'Latte', desc: 'Long reads (10-20 min)', range: [10, 20] },
  { name: 'Mocha', label: 'Mocha', desc: 'Deep reads (20+ min)', range: [20, 999] }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coffeeDropdownOpen, setCoffeeDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/stories', label: 'Stories' },
    { href: '/articles', label: 'Articles' },
    { href: '/book-notes', label: 'Book Notes' },
    { href: '/weekly-brew', label: 'Weekly Brew' },
    { href: '/coffee-table', label: 'Coffee Table' },
    { href: '/letters-to-strangers', label: 'Letters' },
    { href: '/behind-the-pen', label: 'Behind the Pen' },
  ];

  const handleCoffeeFilter = (range: number[]) => {
    setCoffeeDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push(`/stories?minRead=${range[0]}&maxRead=${range[1]}`);
  };

  return (
    <nav className="sticky top-0 z-40 bg-cream-light/95 backdrop-blur-md border-b border-coffee-light/10 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2.5 bg-coffee-dark text-cream-light rounded-full transition-transform group-hover:rotate-12">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-coffee-dark block leading-none">
                  Pen in Coffee
                </span>
                <span className="text-[10px] uppercase tracking-widest text-coffee-light font-medium block mt-0.5">
                  words brewed, stories shared.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium text-sm transition-colors relative py-1 px-0.5 ${
                  isActive(link.href)
                    ? 'text-coffee-dark font-semibold'
                    : 'text-coffee-light hover:text-coffee-dark'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-terracotta rounded-full" />
                )}
              </Link>
            ))}

            {/* Coffee Menu Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCoffeeDropdownOpen(!coffeeDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-coffee-light/5 text-coffee-light hover:bg-coffee-light/10 hover:text-coffee-dark transition-all rounded-full font-medium text-xs border border-coffee-light/10"
              >
                <Coffee className="h-3.5 w-3.5" />
                <span>Coffee Menu</span>
              </button>

              {coffeeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCoffeeDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-cream-light border border-coffee-light/20 shadow-xl rounded-lg overflow-hidden z-20 vintage-border">
                    <div className="p-3 bg-coffee-dark text-cream-light">
                      <p className="font-serif text-sm font-semibold">Choose Your Brew</p>
                      <p className="text-[10px] text-cream-dark/80">Select reading length</p>
                    </div>
                    <div className="p-1 divide-y divide-coffee-light/10 bg-cream-light">
                      {COFFEE_MENU_ITEMS.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleCoffeeFilter(item.range)}
                          className="w-full text-left px-4 py-2 hover:bg-cream-dark transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-xs font-semibold text-coffee-dark group-hover:text-terracotta transition-colors">{item.label}</p>
                            <p className="text-[10px] text-coffee-light">{item.desc}</p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-coffee-light/10 text-coffee-light text-right">
                            {item.range[1] > 20 ? '20m+' : `${item.range[0]}-${item.range[1]}m`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden lg:flex items-center gap-4 border-l border-coffee-light/10 pl-6">
            <Link
              href="/search"
              className="p-2 hover:bg-coffee-light/5 text-coffee-light hover:text-coffee-dark transition-all rounded-full"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="p-2 hover:bg-coffee-light/5 text-coffee-light hover:text-coffee-dark transition-all rounded-full"
              title="Admin Panel"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden gap-3">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-coffee-light/5 text-coffee-light hover:text-coffee-dark transition-all rounded-full"
            >
              <Search className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-coffee-light/5 text-coffee-light hover:text-coffee-dark transition-all rounded-full"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-coffee-light/10 bg-cream-light py-4 px-4 shadow-inner space-y-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-coffee-light/10 text-coffee-dark font-semibold'
                    : 'text-coffee-light hover:bg-coffee-light/5 hover:text-coffee-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Coffee Menu on Mobile */}
          <div className="border-t border-coffee-light/10 pt-4">
            <p className="text-xs font-serif font-bold text-coffee-dark px-3 mb-2 flex items-center gap-1.5">
              <Coffee className="h-3.5 w-3.5 text-terracotta" />
              <span>Coffee Menu (Reading Length)</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-2">
              {COFFEE_MENU_ITEMS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleCoffeeFilter(item.range)}
                  className="p-2 text-left bg-cream-dark rounded border border-coffee-light/10 hover:border-terracotta transition-all"
                >
                  <p className="text-xs font-semibold text-coffee-dark">{item.label}</p>
                  <p className="text-[9px] text-coffee-light leading-none mt-0.5">{item.range[1] > 20 ? '20m+' : `${item.range[0]}-${item.range[1]}m`}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Settings / Admin Link */}
          <div className="border-t border-coffee-light/10 pt-4 flex gap-3 px-3">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-coffee-light hover:text-coffee-dark font-medium"
            >
              <Settings className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
