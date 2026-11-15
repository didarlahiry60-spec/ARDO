import React from 'react';
import { useCart } from '../context/CartContext';
import { lookbookImages } from '../data/content';
import { Eye } from 'lucide-react';

export const Lookbook = () => {
  const { lang, setSelectedCategory } = useCart();

  return (
    <section className="py-20 bg-ardo-soft-ivory border-t border-ardo-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-ardo-gold font-bold">
              {lang === 'bn' ? 'স্টাইল গাইড' : 'EDITORIAL LOOKBOOK'}
            </span>
            <h2 className="font-bengali-serif text-3xl sm:text-4xl font-bold text-ardo-charcoal mt-1">
              {lang === 'bn' ? 'সিগনেচার লুকবুক ২০২৬' : 'Signature Aesthetics 2026'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ardo-charcoal/70 max-w-md">
            {lang === 'bn' 
              ? 'আমাদের সাম্প্রতিক ফটোশুট ও স্টাইলিং ইন্সপিরেশন থেকে বেছে নিন আপনার পছন্দের আউটফিট।' 
              : 'Curated styling references reflecting the quiet dignity of contemporary Bangladeshi men.'}
          </p>
        </div>

        {/* 4 Image Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lookbookImages.map((item, idx) => (
            <div 
              key={idx}
              className="group relative h-96 rounded-xl overflow-hidden border border-ardo-gold/30 cursor-pointer shadow-md"
              onClick={() => {
                setSelectedCategory('all');
                document.getElementById('collection-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <img 
                src={item.url} 
                alt={item.caption[lang]} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ardo-charcoal/90 via-ardo-charcoal/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
              
              {/* Content overlay */}
              <div className="absolute bottom-5 left-5 right-5 text-ardo-ivory">
                <span className="text-[10px] uppercase tracking-widest text-ardo-gold font-semibold block mb-1">
                  {item.tag[lang]}
                </span>
                <h4 className="font-serif text-lg font-bold text-ardo-ivory mb-2">
                  {item.caption[lang]}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-ardo-ivory/80 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  <Eye size={13} className="text-ardo-gold" />
                  <span>{lang === 'bn' ? 'কালেকশন দেখুন' : 'Explore Looks'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
