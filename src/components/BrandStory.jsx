import React from 'react';
import { useCart } from '../context/CartContext';

export const BrandStory = () => {
  const { lang } = useCart();

  return (
    <section className="py-20 bg-ardo-soft-ivory border-y border-ardo-gold/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Crest Motif */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full border border-ardo-gold/50 flex items-center justify-center p-1 bg-ardo-ivory shadow-inner">
            <img src="/images/ardo-logo-dp.webp" alt="ARDO Emblem" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-ardo-gold font-semibold mb-2">
          {lang === 'bn' ? 'ব্র্যান্ড দর্শন' : 'THE PHILOSOPHY'}
        </p>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-ardo-charcoal tracking-wide mb-6">
          "Made for Bangladesh. Defined by Our Identity."
        </h2>

        <div className="w-24 h-[1.5px] bg-ardo-gold mx-auto mb-8"></div>

        <div className="max-w-3xl mx-auto space-y-4 text-ardo-charcoal/85 text-sm sm:text-base leading-relaxed font-normal">
          <p>
            {lang === 'bn' 
              ? 'ইউরোপীয় কোল্ড ফ্যাশনের অন্ধ অনুকরণ নয়, ARDO দাঁড়িয়ে আছে বাংলাদেশি ঐতিহ্যের স্বকীয়তায়। আমাদের আর্দ্র ও উষ্ণ আবহাওয়া, উৎসবের রঙিন আমেজ এবং প্রাত্যহিক ফরমাল লাইফস্টাইলের নিখুঁত ভারসাম্য নিয়ে আমাদের প্রতিটি সৃষ্টি।'
              : 'Rejecting sterile, foreign fashion templates, ARDO is rooted firmly in Bengali identity. Designed for our humid climate, festive gatherings, and sharp executive modernism.'}
          </p>
          <p>
            {lang === 'bn'
              ? 'আমরা বেছে নিই আইভরির স্নিগ্ধতা—যা তীব্র সাদার চেয়ে বেশি উষ্ণ ও দেশীয় চামড়ার রঙের সাথে সবচেয়ে সুন্দর মানায়। সূক্ষ্ম কারুকাজ, টেকসই সুতো আর নিখুঁত টেইলারিং—এটাই ARDO।'
              : 'We embrace the warmth of Ivory over stark cold whites—a palette naturally complementary to our heritage and skin tones. Finely woven, impeccably stitched.'}
          </p>
        </div>

        {/* Small Quote Banner */}
        <div className="mt-10 inline-block bg-ardo-ivory px-6 py-3 rounded-full border border-ardo-gold/40 text-xs text-ardo-charcoal font-medium tracking-wide">
          <span className="text-ardo-gold font-serif mr-2">❝</span>
          {lang === 'bn' ? 'আভিজাত্য কোনো প্রদর্শন নয়, এটি একটি রুচিবোধ।' : 'Elegance is not about being noticed, it is about being remembered.'}
          <span className="text-ardo-gold font-serif ml-2">❞</span>
        </div>

      </div>
    </section>
  );
};
