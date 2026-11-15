import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Search, Menu, X, Ruler } from 'lucide-react';

export const Navbar = () => {
  const { 
    cartCount, 
    setIsCartOpen, 
    lang, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    openSizeChart
  } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { id: 'all', label: { bn: 'সকল কালেকশন', en: 'All Collection' } },
    { id: 'panjabi', label: { bn: 'পাঞ্জাবি', en: 'Panjabi' } },
    { id: 'shirt', label: { bn: 'ফরমাল শার্ট', en: 'Formal Shirts' } },
    { id: 'new-arrivals', label: { bn: 'নতুন আগমন', en: 'New Arrivals' } }
  ];

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setIsMobileMenuOpen(false);
    const section = document.getElementById('collection-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-ardo-ivory/95 backdrop-blur-md border-b border-ardo-gold/25 transition-all">
      {/* Search Input Bar Dropdown */}
      {isSearchOpen && (
        <div className="bg-ardo-soft-ivory border-b border-ardo-gold/30 py-3 px-4 transition-all">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search size={18} className="text-ardo-gold shrink-0" />
            <input 
              type="text"
              placeholder={lang === 'bn' ? "পাঞ্জাবি, লিনেন শার্ট বা ট্রাউজার খুঁজুন..." : "Search panjabi, shirts, trousers..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-ardo-charcoal placeholder-ardo-charcoal/40 text-sm font-medium"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-ardo-charcoal/60 hover:text-ardo-charcoal text-xs">
                {lang === 'bn' ? 'মুছুন' : 'Clear'}
              </button>
            )}
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-ardo-charcoal/70 hover:text-ardo-charcoal"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Mobile Toggle & Desktop Nav */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-ardo-charcoal hover:text-ardo-gold transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleCategoryClick(link.id)}
                  className={`text-sm tracking-wider uppercase transition-all duration-200 relative py-1 ${
                    selectedCategory === link.id 
                      ? 'text-ardo-charcoal font-semibold' 
                      : 'text-ardo-charcoal/75 hover:text-ardo-charcoal font-normal'
                  }`}
                >
                  {link.label[lang]}
                  {selectedCategory === link.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-ardo-gold"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Center: ARDO Logo */}
          <div className="flex flex-col items-center justify-center cursor-pointer group" onClick={() => handleCategoryClick('all')}>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img 
                src="/images/ardo-logo-new.webp" 
                alt="ARDO Seal" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-ardo-gold/60 object-cover shadow-sm group-hover:scale-105 transition-transform" 
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.22em] font-semibold text-ardo-charcoal group-hover:text-ardo-gold transition-colors leading-none">
                  ARDO
                </span>
                <span className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.35em] text-ardo-gold font-medium mt-1">
                  PREMIUM MENSWEAR
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions (Search, Size Chart, Cart) */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-ardo-charcoal hover:text-ardo-gold transition-colors"
              aria-label="Search"
              title={lang === 'bn' ? 'অনুসন্ধান' : 'Search'}
            >
              <Search size={20} />
            </button>

            <button 
              onClick={() => openSizeChart('panjabi')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ardo-charcoal/80 hover:text-ardo-gold px-2.5 py-1.5 rounded border border-ardo-gold/30 hover:border-ardo-gold transition-all"
              title={lang === 'bn' ? 'সাইজ চার্ট দেখুন' : 'View Size Chart'}
            >
              <Ruler size={14} className="text-ardo-gold" />
              <span>{lang === 'bn' ? 'সাইজ গাইড' : 'Size Guide'}</span>
            </button>

            {/* Shopping Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-ardo-charcoal text-ardo-ivory hover:bg-ardo-gold transition-all duration-300 rounded-sm flex items-center gap-2 shadow-sm"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline text-xs tracking-wider uppercase font-medium">
                {lang === 'bn' ? 'ব্যাগ' : 'Cart'}
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-ardo-maroon text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-ardo-soft-ivory border-b border-ardo-gold/30 px-6 py-6 transition-all shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 pb-3 border-b border-ardo-gold/20">
              <img src="/images/ardo-logo-dp.webp" alt="ARDO Logo" className="w-10 h-10 rounded-full border border-ardo-gold" />
              <div>
                <h4 className="font-serif font-bold text-lg tracking-widest text-ardo-charcoal">ARDO</h4>
                <p className="text-[10px] text-ardo-gold tracking-widest uppercase">Made for Bangladesh</p>
              </div>
            </div>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleCategoryClick(link.id)}
                className={`text-left text-base uppercase tracking-wider py-2 flex items-center justify-between border-b border-ardo-charcoal/5 ${
                  selectedCategory === link.id ? 'font-bold text-ardo-charcoal pl-2 border-l-2 border-ardo-gold' : 'text-ardo-charcoal/80'
                }`}
              >
                <span>{link.label[lang]}</span>
                <span className="text-ardo-gold text-sm">→</span>
              </button>
            ))}

            <button 
              onClick={() => {
                openSizeChart('panjabi');
                setIsMobileMenuOpen(false);
              }}
              className="mt-2 flex items-center justify-center gap-2 text-sm uppercase tracking-wider bg-ardo-ivory border border-ardo-gold/50 text-ardo-charcoal py-2.5 rounded-sm"
            >
              <Ruler size={16} className="text-ardo-gold" />
              <span>{lang === 'bn' ? 'সাইজ চার্ট (ইঞ্চিতে)' : 'Size Guide (Inches)'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
