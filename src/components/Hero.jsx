import React from 'react';
import { useCart } from '../context/CartContext';

export const Hero = () => {
  const { lang, setSelectedCategory } = useCart();

  const handleShopNow = () => {
    setSelectedCategory('all');
    const target = document.getElementById('collection-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-ardo-ivory pt-2 pb-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Card Container */}
        <div 
          onClick={handleShopNow}
          className="relative rounded-2xl overflow-hidden border border-ardo-gold/40 shadow-2xl bg-ardo-charcoal group cursor-pointer"
        >
          {/* Hero Banner Image */}
          <div className="relative w-full aspect-[16/9] max-h-[640px] min-h-[380px]">
            <img 
              src="/images/ardo-hero-banner-clean.webp?v=1794745800" 
              alt="ARDO Menswear - বাংলাদেশি ফ্যাশন, নিজস্ব পরিচয়" 
              className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
            />
          </div>
        </div>

        {/* 4 Feature Badges below Hero */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-ardo-soft-ivory p-4 rounded-lg border border-ardo-gold/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ardo-ivory flex items-center justify-center border border-ardo-gold/40 shrink-0">
              <span className="text-ardo-gold font-bold text-xs">100%</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-ardo-charcoal">
                {lang === 'bn' ? 'খাঁটি কটন ও লিনেন' : 'Pure Cotton & Linen'}
              </h4>
              <p className="text-[11px] text-ardo-charcoal/70">
                {lang === 'bn' ? 'উচ্চমানের শ্বাসপ্রশ্বাসযোগ্য ফেব্রিক' : 'Breathable natural weave'}
              </p>
            </div>
          </div>

          <div className="bg-ardo-soft-ivory p-4 rounded-lg border border-ardo-gold/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ardo-ivory flex items-center justify-center border border-ardo-gold/40 shrink-0">
              <span className="text-ardo-gold font-bold text-xs">FIT</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-ardo-charcoal">
                {lang === 'bn' ? 'বাংলাদেশি বডি সাইজিং' : 'Bangladeshi Body Fit'}
              </h4>
              <p className="text-[11px] text-ardo-charcoal/70">
                {lang === 'bn' ? 'আমাদের গড়নের নিখুঁত মাপ' : 'Tailored for local comfort'}
              </p>
            </div>
          </div>

          <div className="bg-ardo-soft-ivory p-4 rounded-lg border border-ardo-gold/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ardo-ivory flex items-center justify-center border border-ardo-gold/40 shrink-0">
              <span className="text-ardo-gold font-bold text-xs">COD</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-ardo-charcoal">
                {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash On Delivery'}
              </h4>
              <p className="text-[11px] text-ardo-charcoal/70">
                {lang === 'bn' ? 'দেখে ট্রায়াল দিয়ে নিন' : 'Try & pay at doorstep'}
              </p>
            </div>
          </div>

          <div className="bg-ardo-soft-ivory p-4 rounded-lg border border-ardo-gold/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ardo-ivory flex items-center justify-center border border-ardo-gold/40 shrink-0">
              <span className="text-ardo-gold font-bold text-xs">7D</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-ardo-charcoal">
                {lang === 'bn' ? '৭ দিনের সহজ এক্সচেঞ্জ' : '7 Days Easy Exchange'}
              </h4>
              <p className="text-[11px] text-ardo-charcoal/70">
                {lang === 'bn' ? 'নিশ্চিন্ত কেনাকাটা' : 'Hassle-free replacement'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
