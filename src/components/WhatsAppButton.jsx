import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { MessageCircle, Phone, X } from 'lucide-react';

export const WhatsAppButton = () => {
  const { lang } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Mini Popup */}
      {isOpen && (
        <div className="mb-3 bg-ardo-soft-ivory p-4 rounded-xl border border-ardo-gold/40 shadow-2xl w-64 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-ardo-gold/20 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-ardo-charcoal">ARDO Concierge</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-ardo-charcoal/60 hover:text-ardo-charcoal">
              <X size={15} />
            </button>
          </div>

          <p className="text-xs text-ardo-charcoal/80 mb-3">
            {lang === 'bn' 
              ? 'সাইজ বা অর্ডার সংক্রান্ত যেকোনো প্রয়োজনে সরাসরি মেসেজ বা কল করুন।' 
              : 'Direct consultation for sizing or ordering queries.'}
          </p>

          <div className="space-y-2">
            <a
              href="https://wa.me/8801631188500?text=Hello%20ARDO%2C%20I%20want%20to%20know%20about%20your%20collection"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 bg-[#25D366] text-white rounded flex items-center justify-center gap-2 text-xs font-bold shadow hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={15} />
              <span>WhatsApp চ্যাট</span>
            </a>

            <a
              href="tel:01631188500"
              className="w-full py-2 px-3 bg-ardo-charcoal text-ardo-ivory rounded flex items-center justify-center gap-2 text-xs font-semibold hover:bg-ardo-gold transition-colors"
            >
              <Phone size={13} />
              <span>{lang === 'bn' ? 'সরাসরি কল দিন (০১৬৩১-১৮৮৫০০)' : 'Call Directly (01631188500)'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 p-3.5 bg-ardo-charcoal hover:bg-ardo-gold text-ardo-ivory rounded-full shadow-2xl border border-ardo-gold/50 flex items-center justify-center transition-all duration-300 transform hover:scale-110 group relative"
        title="WhatsApp Support"
      >
        <MessageCircle size={24} className="text-ardo-gold group-hover:text-white transition-colors" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-ardo-charcoal"></span>
      </button>
    </div>
  );
};
