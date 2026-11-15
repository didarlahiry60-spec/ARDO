import React from 'react';
import { useCart } from '../context/CartContext';
import { reviews } from '../data/content';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const Reviews = () => {
  const { lang } = useCart();

  return (
    <section className="py-20 bg-ardo-ivory border-t border-ardo-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-widest text-ardo-gold font-bold mb-2">
            {lang === 'bn' ? 'বিশ্বস্ত কাস্টমারদের মতামত' : 'TESTIMONIALS'}
          </p>
          <h2 className="font-bengali-serif text-3xl sm:text-4xl font-bold text-ardo-charcoal">
            {lang === 'bn' ? 'ARDO পরিবারের অভিজ্ঞতা' : 'Reflections of Trust'}
          </h2>
          <div className="w-16 h-[1.5px] bg-ardo-gold mx-auto mt-3"></div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map(item => (
            <div 
              key={item.id}
              className="bg-ardo-soft-ivory p-7 rounded-xl border border-ardo-gold/30 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative"
            >
              <Quote className="absolute top-6 right-6 text-ardo-gold/30" size={36} />

              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={15} className="text-ardo-gold fill-ardo-gold" />
                  ))}
                </div>

                <p className="text-sm text-ardo-charcoal/85 leading-relaxed mb-6 font-normal">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-ardo-gold/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-ardo-charcoal flex items-center gap-1.5">
                      {item.name}
                      <CheckCircle2 size={13} className="text-emerald-700" title="Verified Buyer" />
                    </h4>
                    <p className="text-xs text-ardo-charcoal/60">{item.location}</p>
                  </div>
                  <span className="text-[11px] text-ardo-gold font-medium bg-ardo-ivory px-2 py-1 rounded border border-ardo-gold/20">
                    {item.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
