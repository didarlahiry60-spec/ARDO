import React from 'react';
import { useCart } from '../context/CartContext';
import { Feather, Scissors, BadgePercent, RefreshCw } from 'lucide-react';

export const WhyArdo = () => {
  const { lang } = useCart();

  const reasons = [
    {
      icon: Feather,
      title: { bn: "প্রিমিয়াম ফেব্রিক কোয়ালিটি", en: "Curated Fabric Quality" },
      desc: {
        bn: "১০০% পিওর হ্যান্ডলুম লিনেন ও লং-স্ট্যাপল মিসরীয় তুলা। আমাদের আর্দ্র আবহাওয়ায় যা সারাদিন দেয় স্বস্তি ও শীতল অনুভূতি।",
        en: "100% natural Egyptian long-staple cotton and pure linens designed to breathe effortlessly in Bangladesh's humidity."
      }
    },
    {
      icon: Scissors,
      title: { bn: "বাংলাদেশি ফিটিং", en: "Bespoke Bangladeshi Fit" },
      desc: {
        bn: "বিদেশি সাইজের অসঙ্গতি দূর করে দেশীয় পুরুষদের শারীরিক গঠনের নিখুঁত অনুপাত মেনে আমাদের কাটিং ও সাইজিং তৈরি।",
        en: "Engineered specifically for South Asian body proportions—eradicating tight shoulders and overly long sleeves."
      }
    },
    {
      icon: BadgePercent,
      title: { bn: "সাশ্রয়ী দাম", en: "Fair Honest Pricing" },
      desc: {
        bn: "কোনো মধ্যস্বত্বভোগী বা অযৌক্তিক লাক্সারি মার্কআপ ছাড়াই সরাসরি ফ্যাক্টরি থেকে আপনার দরজায় ন্যায্য মূল্যে।",
        en: "Direct-to-consumer model eliminating luxury brand markups, offering five-star menswear at fair transparent prices."
      }
    },
    {
      icon: RefreshCw,
      title: { bn: "সহজ এক্সচেঞ্জ পলিসি", en: "Hassle-Free Exchange" },
      desc: {
        bn: "সাইজ বা ফিটিংয়ে অমিল? চিন্তার কিছু নেই! ৭ দিনের মধ্যে সারা বাংলাদেশে হোম ডেলিভারি এক্সচেঞ্জের সুবিধা।",
        en: "Not the right size? Enjoy doorstep 7-day hassle-free size exchange anywhere across Bangladesh."
      }
    }
  ];

  return (
    <section className="py-20 bg-ardo-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-ardo-gold font-bold mb-2">
            {lang === 'bn' ? 'আমাদের অঙ্গীকার' : 'OUR DISTINCTIONS'}
          </p>
          <h2 className="font-bengali-serif text-3xl sm:text-4xl font-bold text-ardo-charcoal">
            {lang === 'bn' ? 'কেন বেছে নেবেন ARDO?' : 'Why Discerning Men Choose ARDO'}
          </h2>
          <div className="w-16 h-[1.5px] bg-ardo-gold mx-auto mt-4"></div>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-ardo-soft-ivory p-8 rounded-xl border border-ardo-gold/30 hover:border-ardo-gold hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-ardo-ivory border border-ardo-gold/60 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-ardo-charcoal group-hover:text-ardo-ivory transition-all duration-300 shadow-sm">
                  <Icon size={26} className="text-ardo-gold group-hover:text-ardo-ivory transition-colors" />
                </div>

                <h3 className="font-bengali-serif text-lg font-bold text-ardo-charcoal mb-3">
                  {item.title[lang]}
                </h3>

                <p className="text-xs sm:text-sm text-ardo-charcoal/75 leading-relaxed">
                  {item.desc[lang]}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
