import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Zap, Star, Ruler, Truck, ShieldCheck, Check } from 'lucide-react';

export const ProductDetailsModal = () => {
  const { 
    activeProductModal, 
    closeProductModal, 
    addToCart, 
    buyNow, 
    openSizeChart, 
    lang 
  } = useCart();

  const [selectedSize, setSelectedSize] = useState('40');
  const [selectedColor, setSelectedColor] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (activeProductModal) {
      setSelectedSize('40');
      setSelectedColor(activeProductModal.colors ? activeProductModal.colors[0] : null);
      setIsAdded(false);
    }
  }, [activeProductModal]);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const currentImage = selectedColor?.image || product.image;
  const currentFilter = selectedColor?.cssFilter || 'none';

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor?.name[lang]);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuy = () => {
    buyNow(product, selectedSize, selectedColor?.name[lang]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ardo-charcoal/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-ardo-ivory w-full max-w-4xl rounded-2xl border border-ardo-gold/40 shadow-2xl overflow-hidden relative my-6 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={closeProductModal}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-ardo-ivory/80 backdrop-blur-sm border border-ardo-gold/40 flex items-center justify-center text-ardo-charcoal hover:bg-ardo-charcoal hover:text-ardo-ivory transition-colors shadow"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Left Column: Interactive Product Image that shifts color */}
        <div className="md:w-1/2 bg-ardo-charcoal relative flex items-center justify-center overflow-hidden min-h-[350px] md:min-h-full">
          <img 
            key={`${product.id}-${selectedColor?.id}`}
            src={currentImage} 
            alt={product.name[lang]} 
            className="w-full h-full object-cover object-top max-h-[550px] transition-all duration-500 ease-out"
            style={{ filter: currentFilter }}
          />

          {/* Color Blend Overlay if defined */}
          {selectedColor?.overlayColor && (
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-500"
              style={{
                backgroundColor: selectedColor.overlayColor,
                mixBlendMode: selectedColor.overlayBlend || 'color',
                opacity: selectedColor.overlayOpacity || 0.4
              }}
            />
          )}

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-4 left-4 bg-ardo-maroon text-white text-xs font-bold tracking-widest px-3 py-1 rounded-sm uppercase shadow">
              {product.badge[lang]}
            </div>
          )}

          {/* Active Color Tag on image */}
          {selectedColor && (
            <div className="absolute bottom-4 left-4 bg-ardo-charcoal/85 backdrop-blur-md border border-ardo-gold/50 px-3 py-1 rounded-full text-xs text-ardo-ivory flex items-center gap-2 shadow-lg">
              <span 
                className="w-3 h-3 rounded-full border border-white/50 shrink-0" 
                style={{ backgroundColor: selectedColor.hex }}
              />
              <span className="font-medium text-[11px]">
                {lang === 'bn' ? `কালার: ${selectedColor.name.bn}` : `Color: ${selectedColor.name.en}`}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-ardo-soft-ivory">
          
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-ardo-gold font-bold">
                {product.categoryLabel[lang]}
              </span>
              <div className="flex items-center gap-1 text-xs text-ardo-charcoal/80 font-medium">
                <Star size={14} className="text-ardo-gold fill-ardo-gold" />
                <span>{product.rating} ({product.reviewsCount} {lang === 'bn' ? 'রিভিউ' : 'reviews'})</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-bengali-serif text-2xl sm:text-3xl font-bold text-ardo-charcoal leading-snug">
              {product.name[lang]}
            </h2>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pb-3 border-b border-ardo-gold/25">
              <span className="font-bold text-2xl text-ardo-charcoal">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-ardo-charcoal/50 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash On Delivery'}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-ardo-charcoal/80 leading-relaxed font-normal">
              {product.description[lang]}
            </p>

            {/* 3 Color Variants Selector with Live Color Change */}
            <div className="pt-2 bg-ardo-ivory/60 p-3.5 rounded-lg border border-ardo-gold/30">
              <div className="flex items-center justify-between text-xs font-semibold text-ardo-charcoal mb-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-ardo-gold animate-pulse"></span>
                  {product.colors && product.colors.length > 1
                    ? (lang === 'bn' ? `কালার পরিবর্তন করুন (${product.colors.length}টি কালার):` : `Switch Color (${product.colors.length} Colors):`)
                    : (lang === 'bn' ? 'কালার:' : 'Color:')
                  }
                </span>
                <span className="text-ardo-gold font-bold bg-ardo-soft-ivory px-2 py-0.5 rounded border border-ardo-gold/20">
                  {selectedColor?.name[lang]}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {product.colors && product.colors.map(col => {
                  const isSelected = selectedColor?.id === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => setSelectedColor(col)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        isSelected 
                          ? 'border-ardo-charcoal bg-ardo-charcoal text-ardo-ivory shadow-md font-bold ring-2 ring-ardo-gold' 
                          : 'border-ardo-gold/40 bg-ardo-soft-ivory text-ardo-charcoal hover:border-ardo-gold'
                      }`}
                    >
                      <span 
                        className={`w-4 h-4 rounded-full border shrink-0 shadow-sm ${isSelected ? 'border-white' : 'border-ardo-charcoal/30'}`}
                        style={{ backgroundColor: col.hex }}
                      ></span>
                      <span>{col.name[lang]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-ardo-charcoal mb-2">
                <span>{lang === 'bn' ? 'সাইজ বেছে নিন:' : 'Select Size:'}</span>
                <button 
                  onClick={() => openSizeChart(product.category)}
                  className="flex items-center gap-1 text-ardo-gold hover:underline text-xs"
                >
                  <Ruler size={13} />
                  <span>{lang === 'bn' ? 'সাইজ চার্ট (ইঞ্চি)' : 'Size Guide (Inches)'}</span>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-bold rounded border transition-all ${
                      selectedSize === size
                        ? 'bg-ardo-charcoal text-ardo-ivory border-ardo-charcoal shadow-sm'
                        : 'bg-ardo-ivory text-ardo-charcoal/80 border-ardo-gold/30 hover:border-ardo-gold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric & Fit Pills */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-ardo-charcoal/70">
              <div className="bg-ardo-ivory p-2 rounded border border-ardo-gold/20">
                <span className="font-semibold block text-ardo-charcoal">{lang === 'bn' ? 'ফেব্রিক:' : 'Fabric:'}</span>
                {product.fabric[lang]}
              </div>
              <div className="bg-ardo-ivory p-2 rounded border border-ardo-gold/20">
                <span className="font-semibold block text-ardo-charcoal">{lang === 'bn' ? 'ফিটিং:' : 'Fit:'}</span>
                {product.fit[lang]}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-3 text-xs text-ardo-charcoal/70 pt-2 border-t border-ardo-gold/20">
              <span className="flex items-center gap-1 text-ardo-charcoal">
                <Truck size={14} className="text-ardo-gold" />
                {lang === 'bn' ? 'ঢাকা ৮০৳ | বাইরে ১৩০৳' : 'Dhaka 80৳ | Outside 130৳'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-ardo-charcoal">
                <ShieldCheck size={14} className="text-ardo-gold" />
                {lang === 'bn' ? '৭ দিনের এক্সচেঞ্জ' : '7 Days Exchange'}
              </span>
            </div>

          </div>

          {/* TWO ACTION BUTTONS (ব্যাগে যুক্ত করুন & অর্ডার করুন) */}
          <div className="pt-6">
            {product.isOutOfStock ? (
              <div className="w-full py-4 bg-slate-200 text-slate-600 text-center rounded font-bold text-xs uppercase tracking-widest border border-slate-300">
                {lang === 'bn' ? 'এই পণ্যটির স্টক শেষ (Out of Stock)' : 'This item is currently Out of Stock'}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  className={`py-3.5 px-4 rounded-sm flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold border transition-all duration-300 shadow-sm ${
                    isAdded 
                      ? 'bg-emerald-700 text-white border-emerald-700' 
                      : 'bg-ardo-ivory text-ardo-charcoal border-ardo-charcoal hover:bg-ardo-charcoal hover:text-ardo-ivory'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} />
                      <span>{lang === 'bn' ? 'যুক্ত হয়েছে' : 'Added'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>{lang === 'bn' ? 'ব্যাগে যুক্ত করুন' : 'Add to Bag'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuy}
                  className="py-3.5 px-4 bg-ardo-charcoal text-ardo-ivory hover:bg-ardo-gold hover:text-white transition-all duration-300 rounded-sm flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold shadow-lg"
                >
                  <Zap size={16} className="text-ardo-gold fill-ardo-gold" />
                  <span>{lang === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
