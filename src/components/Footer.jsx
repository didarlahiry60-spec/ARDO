import React from 'react';
import { useCart } from '../context/CartContext';
import { Phone, MapPin, Facebook, Instagram, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  const { lang, setSelectedCategory, openSizeChart } = useCart();

  const handleNav = (cat) => {
    setSelectedCategory(cat);
    document.getElementById('collection-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-ardo-charcoal text-ardo-ivory pt-16 pb-12 border-t border-ardo-gold/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-ardo-charcoal-light/60">
          
          {/* Brand Info (Cols 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/images/ardo-logo-dp.webp" 
                alt="ARDO Brand" 
                className="w-12 h-12 rounded-full border border-ardo-gold object-cover shadow"
              />
              <div>
                <span className="font-serif text-3xl tracking-[0.25em] font-semibold text-ardo-ivory block leading-none">
                  ARDO
                </span>
                <span className="text-[10px] tracking-[0.35em] text-ardo-gold uppercase font-medium">
                  PREMIUM MENSWEAR
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ardo-ivory/70 leading-relaxed max-w-sm pt-2">
              {lang === 'bn' 
                ? 'বাংলাদেশি ফ্যাশন ও স্বকীয় পরিচয়ের প্রতীক। উচ্চমানের ফেব্রিক, দেশীয় পারফেক্ট ফিটিং এবং খাঁটি আভিজাত্য।' 
                : 'A celebration of modern Bangladeshi menswear. Defined by identity, pure fabrics, and bespoke local craft.'}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-ardo-charcoal-light border border-ardo-gold/40 flex items-center justify-center text-ardo-ivory hover:text-ardo-gold hover:border-ardo-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-ardo-charcoal-light border border-ardo-gold/40 flex items-center justify-center text-ardo-ivory hover:text-ardo-gold hover:border-ardo-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wider text-ardo-ivory mb-4 flex items-center gap-2">
              <span className="w-3 h-[1px] bg-ardo-gold"></span>
              {lang === 'bn' ? 'কালেকশন' : 'COLLECTIONS'}
            </h4>
            <ul className="space-y-2.5 text-xs text-ardo-ivory/75">
              <li>
                <button onClick={() => handleNav('panjabi')} className="hover:text-ardo-gold transition-colors">
                  {lang === 'bn' ? 'প্রিমিয়াম পাঞ্জাবি' : 'Premium Panjabi'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shirt')} className="hover:text-ardo-gold transition-colors">
                  {lang === 'bn' ? 'ফরমাল শার্ট' : 'Formal Shirts'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('all')} className="hover:text-ardo-gold transition-colors">
                  {lang === 'bn' ? 'নতুন আগমন (New Arrivals)' : 'New Arrivals'}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wider text-ardo-ivory mb-4 flex items-center gap-2">
              <span className="w-3 h-[1px] bg-ardo-gold"></span>
              {lang === 'bn' ? 'সহায়তা' : 'SUPPORT'}
            </h4>
            <ul className="space-y-2.5 text-xs text-ardo-ivory/75">
              <li>
                <button onClick={() => openSizeChart('panjabi')} className="hover:text-ardo-gold transition-colors">
                  {lang === 'bn' ? 'সাইজ চার্ট গাইড' : 'Size Chart Guide'}
                </button>
              </li>
              <li>
                <span className="hover:text-ardo-gold transition-colors cursor-pointer">
                  {lang === 'bn' ? 'এক্সচেঞ্জ ও রিটার্ন পলিসি' : 'Exchange & Returns'}
                </span>
              </li>
              <li>
                <span className="hover:text-ardo-gold transition-colors cursor-pointer">
                  {lang === 'bn' ? 'ডেলিভারি তথ্য ও চার্জ' : 'Shipping & Tracking'}
                </span>
              </li>
              <li>
                <span className="hover:text-ardo-gold transition-colors cursor-pointer">
                  {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি নিয়ম' : 'Cash On Delivery FAQ'}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-base font-semibold tracking-wider text-ardo-ivory mb-4 flex items-center gap-2">
              <span className="w-3 h-[1px] bg-ardo-gold"></span>
              {lang === 'bn' ? 'যোগাযোগ' : 'CONTACT'}
            </h4>
            <div className="space-y-3 text-xs text-ardo-ivory/75">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-ardo-gold shrink-0 mt-0.5" />
                <span>{lang === 'bn' ? 'উত্তর বাড্ডা, ঢাকা' : 'Uttar Badda, Dhaka'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-ardo-gold shrink-0" />
                <a href="tel:01631188500" className="hover:text-ardo-gold transition-colors font-medium">
                  {lang === 'bn' ? '০১৬৩১-১৮৮৫০০' : '01631188500'}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Payment Methods Section (Bangladeshi Specific: bKash, Nagad, Rocket, COD) */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-ardo-charcoal-light/40">
          <div>
            <span className="text-xs uppercase tracking-wider text-ardo-gold font-semibold block mb-2 text-center md:text-left">
              {lang === 'bn' ? 'নিরাপদ লেনদেন ও পেমেন্ট পার্টনার' : 'Accepted Payment Gateways'}
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {/* bKash */}
              <div className="bg-white px-3 py-1.5 rounded flex items-center shadow-sm">
                <span className="text-[#E2136E] font-bold text-xs tracking-tight">bKash বিকাশ</span>
              </div>
              {/* Nagad */}
              <div className="bg-white px-3 py-1.5 rounded flex items-center shadow-sm">
                <span className="text-[#F7941D] font-bold text-xs tracking-tight">Nagad নগদ</span>
              </div>
              {/* Rocket */}
              <div className="bg-white px-3 py-1.5 rounded flex items-center shadow-sm">
                <span className="text-[#8C3494] font-bold text-xs tracking-tight">Rocket</span>
              </div>
              {/* COD */}
              <div className="bg-ardo-charcoal-light border border-ardo-gold/40 px-3 py-1.5 rounded text-xs text-ardo-ivory font-semibold">
                Cash On Delivery
              </div>
              {/* Visa / Master */}
              <div className="bg-white px-3 py-1.5 rounded text-xs text-slate-800 font-bold">
                VISA / Master
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <span className="text-xs text-ardo-ivory/60 flex items-center justify-center md:justify-end gap-1.5">
              <ShieldCheck size={14} className="text-ardo-gold" />
              {lang === 'bn' ? '১০০% অরিজিনাল পণ্য ও সিকিউর চেকআউট' : '100% Authentic Menswear & Secure Checkout'}
            </span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ardo-ivory/50 gap-4">
          <p>© {new Date().getFullYear()} ARDO Premium Menswear. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1">
              Made with <Heart size={12} className="text-ardo-maroon fill-ardo-maroon" /> for Bangladesh
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
