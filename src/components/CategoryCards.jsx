import React from 'react';
import { useCart } from '../context/CartContext';
import { categoriesData } from '../data/content';
import { ArrowUpRight } from 'lucide-react';

export const CategoryCards = () => {
  const { lang, setSelectedCategory } = useCart();

  const handleSelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const section = document.getElementById('collection-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 bg-ardo-soft-ivory border-y border-ardo-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-ardo-gold font-semibold mb-1">
            {lang === 'bn' ? 'আমাদের মূল কালেকশন' : 'CURATED CATEGORIES'}
          </p>
          <h2 className="font-bengali-serif text-2xl sm:text-3xl font-bold text-ardo-charcoal">
            {lang === 'bn' ? 'স্বকীয় দুই আভিজাত্য' : 'Designed for Every Occasion'}
          </h2>
          <div className="w-16 h-[1.5px] bg-ardo-gold mx-auto mt-3"></div>
        </div>

        {/* 2 Category Cards (Panjabi & Shirt Only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categoriesData.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className="group cursor-pointer relative bg-ardo-ivory rounded-xl overflow-hidden border border-ardo-gold/30 hover:border-ardo-gold transition-all duration-300 shadow-md hover:shadow-2xl flex flex-col"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative aspect-[4/5] overflow-hidden bg-ardo-charcoal">
                <img 
                  src={cat.image} 
                  alt={cat.title[lang]} 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ardo-charcoal/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                
                {/* Category Count Tag */}
                <div className="absolute top-4 right-4 bg-ardo-charcoal/85 backdrop-blur-sm text-ardo-ivory text-xs px-3.5 py-1.5 rounded-sm border border-ardo-gold/40 font-medium">
                  {cat.count}
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-6 flex items-center justify-between bg-ardo-ivory border-t border-ardo-gold/20">
                <div>
                  <h3 className="font-bengali-serif text-xl sm:text-2xl font-bold text-ardo-charcoal group-hover:text-ardo-gold transition-colors">
                    {cat.title[lang]}
                  </h3>
                  <p className="text-xs text-ardo-charcoal/70 mt-1">
                    {cat.subtitle[lang]}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-ardo-charcoal text-ardo-ivory group-hover:bg-ardo-gold group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
