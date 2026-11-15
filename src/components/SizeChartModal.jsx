import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Ruler, HelpCircle } from 'lucide-react';

export const SizeChartModal = () => {
  const { isSizeChartOpen, setIsSizeChartOpen, sizeChartCategory, lang } = useCart();
  const [activeTab, setActiveTab] = useState(sizeChartCategory || 'panjabi');

  if (!isSizeChartOpen) return null;

  const panjabiSizes = [
    { size: '38 (S)', chest: '40"', length: '40"', shoulder: '17.5"', collar: '15.5"' },
    { size: '40 (M)', chest: '42"', length: '42"', shoulder: '18.0"', collar: '16.0"' },
    { size: '42 (L)', chest: '44"', length: '44"', shoulder: '18.5"', collar: '16.5"' },
    { size: '44 (XL)', chest: '46"', length: '45"', shoulder: '19.0"', collar: '17.0"' }
  ];

  const shirtSizes = [
    { size: '38 (S)', chest: '39"', length: '29"', shoulder: '17.5"', sleeve: '32.5"' },
    { size: '40 (M)', chest: '41"', length: '30"', shoulder: '18.0"', sleeve: '33.5"' },
    { size: '42 (L)', chest: '43"', length: '31"', shoulder: '18.75"', sleeve: '34.5"' },
    { size: '44 (XL)', chest: '45"', length: '31.5"', shoulder: '19.5"', sleeve: '35.5"' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ardo-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-ardo-ivory w-full max-w-xl rounded-xl border border-ardo-gold/40 shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 bg-ardo-soft-ivory border-b border-ardo-gold/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler size={20} className="text-ardo-gold" />
            <div>
              <h3 className="font-serif text-lg font-bold text-ardo-charcoal">
                {lang === 'bn' ? 'অফিসিয়াল সাইজ গাইড (ইঞ্চিতে)' : 'Official Size Guide (Inches)'}
              </h3>
              <p className="text-[11px] text-ardo-charcoal/60">
                {lang === 'bn' ? 'বাংলাদেশি ফিটিং অনুসারে পরিমাপ করা' : 'Standard Bangladeshi Body Proportions'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsSizeChartOpen(false)}
            className="p-1.5 text-ardo-charcoal/70 hover:text-ardo-charcoal rounded hover:bg-ardo-ivory"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-2 p-1 bg-ardo-soft-ivory rounded-lg border border-ardo-gold/30 mb-6">
            <button
              onClick={() => setActiveTab('panjabi')}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all ${
                activeTab === 'panjabi'
                  ? 'bg-ardo-charcoal text-ardo-ivory shadow'
                  : 'text-ardo-charcoal/70 hover:text-ardo-charcoal'
              }`}
            >
              {lang === 'bn' ? 'পাঞ্জাবি' : 'Panjabi'}
            </button>
            <button
              onClick={() => setActiveTab('shirt')}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all ${
                activeTab === 'shirt'
                  ? 'bg-ardo-charcoal text-ardo-ivory shadow'
                  : 'text-ardo-charcoal/70 hover:text-ardo-charcoal'
              }`}
            >
              {lang === 'bn' ? 'ফরমাল শার্ট' : 'Shirt'}
            </button>
          </div>

          {/* Size Tables */}
          <div className="overflow-x-auto rounded-lg border border-ardo-gold/30">
            {activeTab === 'panjabi' && (
              <table className="w-full text-xs text-left text-ardo-charcoal">
                <thead className="bg-ardo-charcoal text-ardo-ivory uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">সাইজ</th>
                    <th className="p-3">চেস্ট (বুক)</th>
                    <th className="p-3">লম্বা (Length)</th>
                    <th className="p-3">শোল্ডার</th>
                    <th className="p-3">কলার</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ardo-gold/20 bg-ardo-soft-ivory">
                  {panjabiSizes.map((row, i) => (
                    <tr key={i} className="hover:bg-ardo-ivory transition-colors">
                      <td className="p-3 font-bold text-ardo-charcoal">{row.size}</td>
                      <td className="p-3">{row.chest}</td>
                      <td className="p-3">{row.length}</td>
                      <td className="p-3">{row.shoulder}</td>
                      <td className="p-3">{row.collar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'shirt' && (
              <table className="w-full text-xs text-left text-ardo-charcoal">
                <thead className="bg-ardo-charcoal text-ardo-ivory uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">সাইজ</th>
                    <th className="p-3">চেস্ট (বুক)</th>
                    <th className="p-3">লম্বা (Length)</th>
                    <th className="p-3">শোল্ডার</th>
                    <th className="p-3">হাতা (Sleeve)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ardo-gold/20 bg-ardo-soft-ivory">
                  {shirtSizes.map((row, i) => (
                    <tr key={i} className="hover:bg-ardo-ivory transition-colors">
                      <td className="p-3 font-bold text-ardo-charcoal">{row.size}</td>
                      <td className="p-3">{row.chest}</td>
                      <td className="p-3">{row.length}</td>
                      <td className="p-3">{row.shoulder}</td>
                      <td className="p-3">{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Advice Pill */}
          <div className="mt-5 p-3.5 bg-ardo-soft-ivory rounded border border-ardo-gold/30 flex items-start gap-2.5 text-xs text-ardo-charcoal/80">
            <HelpCircle size={16} className="text-ardo-gold shrink-0 mt-0.5" />
            <p>
              {lang === 'bn' 
                ? 'পরামর্শ: নিজের চেস্ট সাইজ থেকে পাঞ্জাবিতে ২ ইঞ্চি লুজ মাপ বেছে নেওয়া উত্তম। যেমন: বুকের মাপ ৩৮ হলে ৪০ সাইজ পাঞ্জাবি পারফেক্ট হবে।' 
                : 'Tip: For panjabis, a 2-inch allowance over your actual body chest measurement gives the best drape.'}
            </p>
          </div>

          <button
            onClick={() => setIsSizeChartOpen(false)}
            className="mt-5 w-full py-2.5 bg-ardo-charcoal text-ardo-ivory hover:bg-ardo-gold rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            {lang === 'bn' ? 'বুঝেছি / বন্ধ করুন' : 'Got it / Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
