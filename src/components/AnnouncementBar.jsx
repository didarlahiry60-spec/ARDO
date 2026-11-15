import React from 'react';
import { useCart } from '../context/CartContext';
import { Truck, ShieldCheck, Globe } from 'lucide-react';

export const AnnouncementBar = () => {
  const { lang, setLang, storeSettings } = useCart();

  const announcement = storeSettings?.announcementText?.[lang] || 
    (lang === 'bn' 
      ? 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি | ঢাকার ভেতরে ৮০৳, বাইরে ১৩০৳' 
      : 'Cash on Delivery All Over Bangladesh | Dhaka 80৳, Outside 130৳');

  return (
    <div className="bg-ardo-charcoal text-ardo-ivory py-2 px-4 text-xs font-medium border-b border-ardo-charcoal-light/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <span className="flex items-center gap-1.5 tracking-wide">
            <Truck size={14} className="text-ardo-gold" />
            {announcement}
          </span>
          <span className="hidden md:inline-block text-ardo-gold/60">•</span>
          <span className="hidden md:flex items-center gap-1 text-ardo-ivory/80">
            <ShieldCheck size={14} className="text-ardo-gold" />
            {lang === 'bn' ? '৭ দিনের সহজ এক্সচেঞ্জ গ্যারান্টি' : '7 Days Easy Exchange Guarantee'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 text-[11px] uppercase tracking-widest px-2.5 py-0.5 rounded border border-ardo-gold/40 hover:border-ardo-gold hover:text-ardo-gold transition-colors"
          >
            <Globe size={12} className="text-ardo-gold" />
            <span className={lang === 'bn' ? 'font-semibold text-ardo-gold' : 'text-ardo-ivory/70'}>বাং</span>
            <span className="text-ardo-ivory/40">/</span>
            <span className={lang === 'en' ? 'font-semibold text-ardo-gold' : 'text-ardo-ivory/70'}>EN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
