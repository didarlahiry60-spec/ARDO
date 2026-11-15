import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Star, Ruler, Check, Eye, Zap, AlertCircle } from 'lucide-react';

export const ProductGrid = () => {
  const { 
    products,
    lang, 
    addToCart, 
    buyNow,
    openSizeChart, 
    openProductModal, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery 
  } = useCart();

  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [addedItemEffect, setAddedItemEffect] = useState(null);

  const categories = [
    { id: 'all', label: { bn: 'সকল পণ্য (৫টি)', en: 'All Items (5)' } },
    { id: 'panjabi', label: { bn: 'পাঞ্জাবি (৩টি)', en: 'Panjabi (3)' } },
    { id: 'shirt', label: { bn: 'ফরমাল শার্ট (২টি)', en: 'Formal Shirts (2)' } }
  ];

  // Filtering products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSizeSelect = (productId, size, e) => {
    e.stopPropagation();
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleColorSelect = (productId, color, e) => {
    e.stopPropagation();
    setSelectedColors(prev => ({ ...prev, [productId]: color }));
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const chosenSize = selectedSizes[product.id] || product.sizes[1] || product.sizes[0];
    const chosenColor = (selectedColors[product.id] || product.colors[0])?.name[lang];
    addToCart(product, chosenSize, chosenColor);
    
    setAddedItemEffect(product.id);
    setTimeout(() => setAddedItemEffect(null), 1500);
  };

  const handleOrderNow = (product, e) => {
    e.stopPropagation();
    const chosenSize = selectedSizes[product.id] || product.sizes[1] || product.sizes[0];
    const chosenColor = (selectedColors[product.id] || product.colors[0])?.name[lang];
    buyNow(product, chosenSize, chosenColor);
  };

  return (
    <section id="collection-section" className="py-16 bg-ardo-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-ardo-gold/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-[1.5px] bg-ardo-gold"></span>
              <p className="text-xs uppercase tracking-widest text-ardo-gold font-bold">
                {lang === 'bn' ? 'সিগনেচার ক্যাটালগ' : 'SIGNATURE CATALOG'}
              </p>
            </div>
            <h2 className="font-bengali-serif text-3xl sm:text-4xl font-bold text-ardo-charcoal">
              {lang === 'bn' ? 'আমাদের মূল কালেকশন' : 'The Core Collection'}
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 text-xs uppercase tracking-wider rounded-sm transition-all duration-200 border ${
                  selectedCategory === cat.id
                    ? 'bg-ardo-charcoal text-ardo-ivory border-ardo-charcoal font-semibold shadow-sm'
                    : 'bg-ardo-soft-ivory text-ardo-charcoal/80 border-ardo-gold/30 hover:border-ardo-gold'
                }`}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const activeSize = selectedSizes[product.id] || product.sizes[1] || product.sizes[0];
            const activeColor = selectedColors[product.id] || product.colors[0];
            const isAdded = addedItemEffect === product.id;

            const cardImage = activeColor?.image || product.image;
            const cardFilter = activeColor?.cssFilter || 'none';

            return (
              <div 
                key={product.id}
                onClick={() => openProductModal(product)}
                className="group cursor-pointer bg-ardo-soft-ivory rounded-xl overflow-hidden border border-ardo-gold/30 hover:border-ardo-gold hover:shadow-xl transition-all duration-300 flex flex-col relative"
              >
                {/* Image Container with Live Color Changing */}
                <div className="relative aspect-[3/4] overflow-hidden bg-ardo-charcoal">
                  <img 
                    key={`${product.id}-${activeColor?.id}`}
                    src={cardImage} 
                    alt={product.name[lang]} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-500 ease-out"
                    style={{ filter: cardFilter }}
                    loading="lazy"
                  />

                  {/* Blend Overlay for subtle card tints */}
                  {activeColor?.overlayColor && (
                    <div 
                      className="absolute inset-0 pointer-events-none transition-all duration-500"
                      style={{
                        backgroundColor: activeColor.overlayColor,
                        mixBlendMode: activeColor.overlayBlend || 'color',
                        opacity: activeColor.overlayOpacity || 0.4
                      }}
                    />
                  )}

                  {/* Badge & Out of stock banner */}
                  {product.isOutOfStock ? (
                    <div className="absolute top-3 left-3 bg-red-700 text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-sm uppercase shadow">
                      {lang === 'bn' ? 'স্টক শেষ' : 'OUT OF STOCK'}
                    </div>
                  ) : product.badge && (
                    <div className="absolute top-3 left-3 bg-ardo-maroon text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-sm uppercase shadow">
                      {product.badge[lang]}
                    </div>
                  )}

                  {product.isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="px-4 py-1.5 bg-red-600/90 text-white font-bold text-xs uppercase tracking-widest rounded shadow border border-white/20">
                        {lang === 'bn' ? 'স্টক আউট' : 'SOLD OUT'}
                      </span>
                    </div>
                  )}

                  {/* Click to View Details Overlay Button */}
                  <div className="absolute inset-0 bg-ardo-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 bg-ardo-ivory text-ardo-charcoal px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye size={15} />
                      {lang === 'bn' ? 'ভিতরে ঢুকে দেখুন' : 'View Details'}
                    </span>
                  </div>

                  {/* Fabric Pill */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-ardo-charcoal/85 backdrop-blur-sm px-3 py-1.5 rounded text-[11px] text-ardo-ivory/90 flex items-center justify-between opacity-95">
                    <span>{product.fabric[lang]}</span>
                    <span className="text-ardo-gold font-medium">{product.fit[lang]}</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs text-ardo-charcoal/60 mb-2">
                      <span className="uppercase tracking-wider text-[11px] font-bold text-ardo-gold">
                        {product.categoryLabel[lang]}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-ardo-charcoal/80">
                        <Star size={12} className="text-ardo-gold fill-ardo-gold" />
                        {product.rating} ({product.reviewsCount})
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bengali-serif font-bold text-base sm:text-lg text-ardo-charcoal mb-2 line-clamp-1 group-hover:text-ardo-gold transition-colors">
                      {product.name[lang]}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-bold text-xl text-ardo-charcoal">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-ardo-charcoal/40 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Color Swatches / Info */}
                    <div className="mb-3.5 pb-3 border-b border-ardo-gold/20" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-[11px] text-ardo-charcoal/70 mb-1.5">
                        <span className="font-medium">
                          {product.colors && product.colors.length > 1 
                            ? (lang === 'bn' ? 'কালার পরিবর্তন:' : 'Change Color:')
                            : (lang === 'bn' ? 'কালার:' : 'Color:')
                          }
                        </span>
                        <span className="text-ardo-gold font-bold text-[10.5px]">{activeColor?.name[lang]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.colors.map(col => {
                          const isSelected = activeColor?.id === col.id;
                          return (
                            <button
                              key={col.id}
                              onClick={(e) => handleColorSelect(product.id, col, e)}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[10.5px] transition-all ${
                                isSelected 
                                  ? 'border-ardo-charcoal bg-ardo-charcoal text-white font-bold shadow ring-1 ring-ardo-gold' 
                                  : 'border-ardo-gold/30 bg-ardo-soft-ivory hover:border-ardo-gold text-ardo-charcoal'
                              }`}
                              title={col.name[lang]}
                            >
                              <span 
                                className={`w-3.5 h-3.5 rounded-full border shrink-0 ${isSelected ? 'border-white' : 'border-ardo-charcoal/30'}`}
                                style={{ backgroundColor: col.hex }}
                              ></span>
                              <span>{col.name[lang]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Size Selector */}
                    <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-[11px] text-ardo-charcoal/70 mb-1.5">
                        <span>{lang === 'bn' ? 'সাইজ বেছে নিন:' : 'Select Size:'}</span>
                        <button 
                          onClick={() => openSizeChart(product.category)}
                          className="text-ardo-gold hover:underline flex items-center gap-1"
                        >
                          <Ruler size={11} />
                          <span>{lang === 'bn' ? 'সাইজ চার্ট' : 'Guide'}</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {product.sizes.map(size => (
                          <button
                            key={size}
                            onClick={(e) => handleSizeSelect(product.id, size, e)}
                            className={`py-1 text-xs font-semibold rounded-sm border transition-all ${
                              activeSize === size
                                ? 'bg-ardo-charcoal text-ardo-ivory border-ardo-charcoal shadow-sm'
                                : 'bg-ardo-ivory text-ardo-charcoal/80 border-ardo-gold/30 hover:border-ardo-gold'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* TWO BUTTONS: ব্যাগে যুক্ত করুন (Add to Bag) & অর্ডার করুন (Order Now) */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ardo-gold/20" onClick={(e) => e.stopPropagation()}>
                    {product.isOutOfStock ? (
                      <div className="col-span-2 py-2.5 bg-slate-200 text-slate-500 text-center rounded-sm font-bold text-xs uppercase tracking-wider">
                        {lang === 'bn' ? 'স্টক শেষ (সাময়িক অনুপলব্ধ)' : 'Out of Stock'}
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className={`py-2.5 rounded-sm flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider font-bold transition-all duration-300 border ${
                            isAdded 
                              ? 'bg-emerald-700 text-white border-emerald-700' 
                              : 'bg-ardo-ivory text-ardo-charcoal border-ardo-charcoal hover:bg-ardo-charcoal hover:text-ardo-ivory'
                          }`}
                          title={lang === 'bn' ? 'কার্টে রাখুন' : 'Add to Bag'}
                        >
                          {isAdded ? (
                            <>
                              <Check size={14} />
                              <span>{lang === 'bn' ? 'যুক্ত হয়েছে' : 'Added'}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} />
                              <span>{lang === 'bn' ? 'অ্যাড টু কার্ট' : 'Add to Bag'}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => handleOrderNow(product, e)}
                          className="py-2.5 bg-ardo-charcoal text-ardo-ivory hover:bg-ardo-gold hover:text-white transition-all duration-300 rounded-sm flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider font-bold shadow-md"
                          title={lang === 'bn' ? 'সরাসরি অর্ডার পেজে যান' : 'Order Now'}
                        >
                          <Zap size={14} className="text-ardo-gold fill-ardo-gold" />
                          <span>{lang === 'bn' ? 'অর্ডার নাও' : 'Order Now'}</span>
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
