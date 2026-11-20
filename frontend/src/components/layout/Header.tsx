'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingCart, Heart, Search, Menu, User, ShieldCheck, 
  ChevronDown, MapPin, Phone, Package, Tag, LayoutGrid,
  Clock, X, ArrowRight, Store
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSiteContentStore } from '@/store/siteContentStore';
import { useStoreSettingsStore } from '@/store/storeSettingsStore';
import { useTaxonomyStore } from '@/store/taxonomyStore';
import MobileMenu from './MobileMenu';

const navigationLinks = [
  { name: 'Home', href: '/' },
  { 
    name: 'Smartphones', 
    href: '/category/smartphones',
    children: [
      { name: 'All Flagships', href: '/category/smartphones', desc: 'Browse all verified smartphones' },
      { name: 'Apple iPhones', href: '/category/iphones', desc: 'iPhone 15 Pro Max & Pro series' },
      { name: 'Android Flagships', href: '/category/android-phones', desc: 'Snapdragon 8 Gen 3 & 200MP' },
      { name: 'Huawei Ultimate Design', href: '/products/huawei-mate-70-rs', desc: 'Master Octagonal Ceramic' },
      { name: 'Samsung Galaxy', href: '/products/samsung-galaxy-s24-ultra', desc: 'Titanium & Built-in S-Pen' },
    ]
  },
  { name: 'Laptops', href: '/category/laptops' },
  { name: 'Tablets', href: '/category/tablets' },
  { name: 'Audio', href: '/category/audio' },
  { name: 'Smartwatches', href: '/category/smartwatches' },
  { name: 'Accessories', href: '/category/accessories' },
  { name: 'New Launches', href: '/products?filter=new' },
];

const allCategoriesList = [
  { name: 'Smartphones & Flagships', href: '/category/smartphones', count: '10 Models' },
  { name: 'Apple iPhones', href: '/category/iphones', count: 'Pro & Pro Max' },
  { name: 'Android Flagships', href: '/category/android-phones', count: '8 Flagships' },
  { name: 'Laptops & MacBooks', href: '/category/laptops', count: 'M3 & OLED' },
  { name: 'Tablets & iPads', href: '/category/tablets', count: 'M4 Tandem OLED' },
  { name: 'Headphones & ANC', href: '/category/audio', count: 'Hi-Res Wireless' },
  { name: 'Spatial Earbuds', href: '/category/audio', count: 'Adaptive Audio' },
  { name: 'Smartwatches', href: '/category/smartwatches', count: 'Titanium & Sapphire' },
  { name: 'Hi-Fi Speakers', href: '/category/audio', count: 'Marshall & Studio' },
  { name: 'Fast Chargers & GaN', href: '/category/accessories', count: '240W Multi-Port' },
];

const popularSearches = [
  'iPhone 15 Pro Max',
  'Huawei Mate 70 RS',
  'Galaxy S24 Ultra',
  'Sony WH-1000XM5',
  'MacBook Pro 14',
  'AirPods Pro 2',
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const siteContent = useSiteContentStore((state) => state.content);
  const settings = useStoreSettingsStore((state) => state.settings);
  const categories = useTaxonomyStore((state) => state.categories);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolledPastTop, setIsScrolledPastTop] = useState(false);
  const lastScrollYRef = useRef(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const cartCount = useCartStore(state => state.items.reduce((acc, i) => acc + i.quantity, 0));
  const cartSubtotal = useCartStore(state => state.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0));
  const wishlistCount = useWishlistStore(state => state.items.length);



  // Smart Headroom Navbar: Hides smoothly on scroll down, reveals instantly on scroll up
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isMobileMenuOpen || isSearchFocused) return;
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const lastScrollY = lastScrollYRef.current;
          const diff = currentScrollY - lastScrollY;

          setIsScrolledPastTop(currentScrollY > 40);

          if (currentScrollY <= 20) {
            // At the top of the page: always visible
            setIsHeaderVisible(true);
          } else if (diff > 8 && currentScrollY > 80) {
            // Scrolling down: hide navbar
            setIsHeaderVisible(false);
            setActiveDropdown(null);
            setIsAccountOpen(false);
            setIsAllCategoriesOpen(false);
          } else if (diff < -5) {
            // Scrolling up even slightly: reveal navbar immediately
            setIsHeaderVisible(true);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen, isSearchFocused]);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleMouseEnter = (name: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && selectedSearchCategory === 'all') return;
    setIsSearchFocused(false);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedSearchCategory !== 'all') params.set('category', selectedSearchCategory);
    router.push(`/products?${params.toString()}`);
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    setIsSearchFocused(false);
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  return (
    <>
      {/* ===================== ANNOUNCEMENT BAR ===================== */}
      {siteContent?.sectionsVisibility?.announcementBar && siteContent?.announcementBar?.isVisible && (
        <div className="bg-[#E50924] text-white text-[11px] font-bold uppercase tracking-[0.16em] py-2 px-4 text-center select-none shadow-md">
          <div className="container-custom flex items-center justify-center gap-2">
            <span>{siteContent.announcementBar.text}</span>
            {siteContent.announcementBar.link && (
              <Link href={siteContent.announcementBar.link} className="underline ml-2 hover:text-black transition-colors font-black">
                Details →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ===================== TOP SERVICE & UTILITY RIBBON ===================== */}
      <div className="bg-[#050505] border-b border-white/[0.08] text-white text-xs py-2 px-4 select-none">
        <div className="container-custom flex items-center justify-between">
          
          {/* Left: Showroom Status & Helpline */}
          <div className="flex items-center gap-3 sm:gap-5 text-[11px] text-[#B8B8B8]">
            <Link 
              href="/contact" 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
              title="Showroom Location"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">{settings.storeName} Showroom</span>
              <span className="hidden sm:inline text-[#858585]">• {settings.address} ({settings.hours})</span>
            </Link>

            <span className="hidden md:inline text-white/10">|</span>

            <a 
              href={`tel:${settings.phone}`} 
              className="hidden md:flex items-center gap-1.5 text-[#B8B8B8] hover:text-[#FF3048] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#E50924]" />
              <span className="tabular-nums font-mono font-medium">{settings.phone}</span>
            </a>
          </div>

          {/* Right: Order Tracking & Support */}
          <div className="flex items-center gap-3 sm:gap-5 text-[#858585] text-[11px]">
            <Link 
              href="/my-orders" 
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5 text-[#E50924]" />
              <span className="hidden sm:inline">Track</span> Order
            </Link>

            <span className="text-white/10">|</span>

            <Link 
              href="/contact" 
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E50924]" />
              <span>Store Map</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ===================== MAIN HEADER ROW (SMART REVEAL NAVBAR) ===================== */}
      <header
        className={`sticky top-0 z-50 transition-transform duration-300 ease-in-out border-b border-white/[0.08] ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolledPastTop
            ? 'bg-[#090909]/95 backdrop-blur-md shadow-2xl shadow-black/80'
            : 'bg-[#090909]'
        } py-3 sm:py-3.5`}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setActiveDropdown(null);
            setIsAccountOpen(false);
            setIsAllCategoriesOpen(false);
            setIsSearchFocused(false);
          }
        }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            
            {/* BRAND LOGO */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#E50924] to-[#B90820] rounded-[4px] flex items-center justify-center shadow-md shadow-[#E50924]/20 group-hover:shadow-[#E50924]/40 transition-all duration-300">
                <span className="font-heading font-black text-white text-base sm:text-lg tracking-tighter">S</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-white leading-none">
                  SAI<span className="text-[#E50924]">TRONICS</span>
                </span>
                <span className="text-[8px] uppercase tracking-[0.25em] text-[#858585] font-semibold mt-0.5 hidden xs:block">
                  Technology. Style. Experience.
                </span>
              </div>
            </Link>

            {/* EXPANDED OMNI SEARCH BAR WITH CATEGORY SELECTOR & SUGGESTIONS */}
            <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl relative mx-2">
              <form 
                onSubmit={handleSearchSubmit}
                className="w-full flex items-center bg-[#141414] border border-white/[0.08] focus-within:border-[#E50924] rounded-[4px] overflow-hidden transition-all shadow-inner"
              >
                {/* Category Scope Selector */}
                <select
                  value={selectedSearchCategory}
                  onChange={e => setSelectedSearchCategory(e.target.value)}
                  className="bg-[#1A1A1A] text-[#B8B8B8] text-[11px] font-semibold uppercase tracking-wider px-3 py-2.5 border-r border-white/[0.08] focus:outline-none cursor-pointer hover:text-white transition-colors"
                >
                  <option value="all">All Store</option>
                  <option value="smartphones">Phones</option>
                  <option value="laptops">Laptops</option>
                  <option value="audio">Audio</option>
                  <option value="tablets">Tablets</option>
                  <option value="smartwatches">Watches</option>
                  <option value="accessories">Power</option>
                </select>

                {/* Input Field */}
                <div className="relative flex-1 flex items-center">
                  <Search className="w-4 h-4 text-[#858585] ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search flagship phones, OLED laptops, spatial audio..."
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-[#777] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 mr-2 text-[#858585] hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E50924] hover:bg-[#FF3048] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* SEARCH SUGGESTIONS & POPULAR QUERIES FLYOUT */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#111111] border border-white/[0.1] rounded-[4px] shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#858585]">
                      Popular Flagship Searches
                    </span>
                    <span className="text-[10px] text-[#FF3048] font-bold">Press Enter to Search</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {popularSearches.map(term => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleQuickSearch(term)}
                        className="px-2.5 py-1 rounded-[2px] bg-[#181818] hover:bg-[#E50924] hover:text-white text-[#B8B8B8] text-[11px] font-medium transition-colors cursor-pointer border border-white/[0.05]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT E-COMMERCE UTILITY ACTIONS */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Showroom Direct Pill */}
              <Link
                href="/contact"
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#161616] border border-white/[0.08] hover:border-[#E50924]/40 text-xs text-[#B8B8B8] hover:text-white transition-all group"
                title="Uttarpara Flagship Showroom"
              >
                <MapPin className="w-3.5 h-3.5 text-[#E50924] group-hover:scale-110 transition-transform" />
                <div className="text-left text-[11px] leading-tight">
                  <span className="font-bold text-white block">Uttarpara</span>
                  <span className="text-[9px] text-[#858585]">Showroom</span>
                </div>
              </Link>

              {/* USER ACCOUNT DROPDOWN */}
              <div 
                className="relative"
                onMouseEnter={() => setIsAccountOpen(true)}
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-[4px] hover:bg-white/[0.05] text-[#B8B8B8] hover:text-white transition-colors"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5 text-[#E50924]" />
                  <div className="hidden lg:flex flex-col text-left leading-tight">
                    <span className="text-[9px] text-[#858585] uppercase tracking-wider font-semibold">Account</span>
                    <span className="text-xs font-bold text-white flex items-center gap-0.5">
                      Sign In <ChevronDown className="w-3 h-3 opacity-60" />
                    </span>
                  </div>
                </Link>

                {/* Account Menu Dropdown with smooth hover bridge */}
                {isAccountOpen && (
                  <div className="absolute top-full right-0 pt-2 w-56 z-50 animate-in fade-in duration-150">
                    <div className="bg-[#111111] border border-white/[0.1] rounded-[4px] shadow-2xl p-2 backdrop-blur-xl">
                      <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                        <span className="text-[10px] text-[#858585] uppercase tracking-widest block font-bold">Welcome</span>
                        <span className="text-xs font-bold text-white">Saitronics Customer</span>
                      </div>
                      <Link
                        href="/my-orders"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[2px] text-xs font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-[#E50924]" /> My Orders & History
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[2px] text-xs font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#E50924]" /> Saved Wishlist ({wishlistCount})
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-[2px] text-xs font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#E50924]" /> VIP Member Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* WISHLIST BUTTON */}
              <Link
                href="/wishlist"
                className="relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-[4px] hover:bg-white/[0.05] text-[#B8B8B8] hover:text-white transition-colors"
                aria-label={`Wishlist (${wishlistCount})`}
              >
                <div className="relative">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#E50924] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md tabular-nums">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <div className="hidden lg:flex flex-col text-left leading-tight">
                  <span className="text-[9px] text-[#858585] uppercase tracking-wider font-semibold">Saved</span>
                  <span className="text-xs font-bold text-white">Wishlist</span>
                </div>
              </Link>

              {/* SHOPPING CART BUTTON WITH LIVE TOTAL */}
              <Link
                href="/cart"
                className="relative flex items-center gap-2 px-3 py-2 rounded-[4px] bg-[#161616] border border-white/[0.08] hover:border-[#E50924] hover:bg-[#1A1A1A] text-white transition-all group"
                aria-label={`Cart (${cartCount})`}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-[#FF3048]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#E50924] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md tabular-nums">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-[9px] text-[#858585] uppercase tracking-wider font-semibold">Your Bag</span>
                  <span className="text-xs font-bold text-white tabular-nums">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </Link>

              {/* MOBILE MENU TOGGLE */}
              <button
                className="p-2 rounded-[4px] hover:bg-white/[0.05] text-[#B8B8B8] hover:text-white lg:hidden transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>

          {/* ===================== SECONDARY CATEGORY & STORE BAR ===================== */}
          <div className="hidden lg:flex items-center justify-between pt-3 mt-2 border-t border-white/[0.06] text-xs font-semibold uppercase tracking-wider select-none">
            
            {/* Left Category Navigation with "All Categories" Button */}
            <div className="flex items-center gap-6">
              
              {/* ALL CATEGORIES FLYOUT BUTTON */}
              <div
                className="relative"
                onMouseEnter={() => setIsAllCategoriesOpen(true)}
                onMouseLeave={() => setIsAllCategoriesOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[3px] bg-[#E50924] text-white hover:bg-[#FF3048] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>All Categories</span>
                  <ChevronDown className="w-3 h-3 opacity-80" />
                </button>

                {/* All Categories Mega Dropdown */}
                {isAllCategoriesOpen && (
                  <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-in fade-in duration-150">
                    <div className="bg-[#111111] border border-white/[0.1] rounded-[4px] shadow-2xl p-2 backdrop-blur-xl">
                      <div className="px-3 py-1.5 border-b border-white/[0.08] mb-1">
                        <span className="text-[10px] text-[#FF3048] font-bold uppercase tracking-widest">
                          Electronics Showroom Index
                        </span>
                      </div>
                      {categories.filter(c => c.isVisible).map(cat => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          onClick={() => setIsAllCategoriesOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-[2px] text-xs font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04] transition-colors group/item"
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-[#858585] group-hover/item:text-[#FF3048]">
                            {cat.productCount ? `${cat.productCount} Models` : 'Browse'}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main Category Links with Dropdowns */}
              {navigationLinks.map(item => (
                <div 
                  key={item.name} 
                  className="relative py-1 group"
                  onMouseEnter={() => item.children && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-[#B8B8B8] group-hover:text-[#FF3048] hover:text-[#FF3048] transition-colors"
                  >
                    {item.name}
                    {item.children && <ChevronDown className="w-3 h-3 opacity-60 transition-transform group-hover:rotate-180" />}
                  </Link>

                  {/* Dropdown Menu with continuous invisible hit-box bridge & 150ms delay */}
                  {item.children && activeDropdown === item.name && (
                    <div 
                      className="absolute top-full left-0 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-[#111111] border border-white/[0.1] rounded-[4px] shadow-2xl p-2 backdrop-blur-xl">
                        {item.children.map(sub => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex flex-col px-3 py-2 rounded-[2px] text-xs font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04] hover:border-l-2 hover:border-[#E50924] transition-all group/sub"
                          >
                            <span className="font-semibold text-white group-hover/sub:text-[#FF3048] flex items-center justify-between">
                              {sub.name}
                              <span className="text-[10px] opacity-0 group-hover/sub:opacity-100 transition-opacity">→</span>
                            </span>
                            {sub.desc && (
                              <span className="text-[10px] text-[#858585] mt-0.5">{sub.desc}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

            </div>

            {/* Right Promotional & Store Links */}
            <div className="flex items-center gap-4">
              
              <Link
                href="/products?filter=offers"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#E50924]/10 border border-[#E50924]/30 text-[#FF3048] hover:bg-[#E50924] hover:text-white text-[11px] font-bold tracking-wider transition-colors"
              >
                <Tag className="w-3 h-3" />
                <span>HOT DEALS</span>
                <span className="text-[9px] bg-[#E50924] text-white px-1 rounded-sm ml-0.5">10% OFF</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center gap-1.5 text-[#B8B8B8] hover:text-white text-[11px] tracking-wider transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-[#E50924]" />
                <span>Showroom Map</span>
              </Link>

            </div>

          </div>

        </div>
      </header>

      {/* MOBILE SLIDE-OUT MENU */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigationLinks}
      />
    </>
  );
}
