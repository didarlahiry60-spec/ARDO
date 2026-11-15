import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    deliveryFee, 
    grandTotal, 
    deliveryLocation, 
    setDeliveryLocation, 
    setIsCheckoutOpen,
    lang 
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ardo-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ardo-ivory shadow-2xl flex flex-col border-l border-ardo-gold/40">
          
          {/* Header */}
          <div className="p-5 bg-ardo-soft-ivory border-b border-ardo-gold/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-ardo-gold" />
              <h3 className="font-serif text-lg font-bold text-ardo-charcoal">
                {lang === 'bn' ? 'আপনার শপিং ব্যাগ' : 'Your Shopping Bag'}
              </h3>
              <span className="text-xs bg-ardo-charcoal text-ardo-ivory px-2 py-0.5 rounded-full font-bold">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-ardo-charcoal/70 hover:text-ardo-charcoal hover:bg-ardo-ivory rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-ardo-charcoal/60 py-12">
                <div className="w-16 h-16 rounded-full bg-ardo-soft-ivory border border-ardo-gold/30 flex items-center justify-center mb-4">
                  <ShoppingBag size={28} className="text-ardo-gold" />
                </div>
                <h4 className="font-bold text-ardo-charcoal mb-1 text-base">
                  {lang === 'bn' ? 'আপনার ব্যাগটি খালি' : 'Your Bag is Empty'}
                </h4>
                <p className="text-xs max-w-xs mb-6">
                  {lang === 'bn' ? 'আমাদের নতুন কালেকশন থেকে আপনার পছন্দের পোশাক বেছে নিন।' : 'Explore our collection to add handcrafted menswear.'}
                </p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-ardo-charcoal text-ardo-ivory text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-ardo-gold hover:text-white transition-colors"
                >
                  {lang === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.product.id}-${item.size}`}
                  className="bg-ardo-soft-ivory p-3.5 rounded-lg border border-ardo-gold/25 flex gap-3 relative group"
                >
                  <img 
                    src={item.product.image} 
                    alt={item.product.name[lang]} 
                    className="w-20 h-24 object-cover rounded border border-ardo-gold/30 bg-ardo-ivory shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-ardo-charcoal line-clamp-1">
                          {item.product.name[lang]}
                        </h4>
                        <button 
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="text-ardo-charcoal/40 hover:text-ardo-maroon transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-[11px] text-ardo-charcoal/70">
                        <span className="bg-ardo-ivory px-2 py-0.5 rounded border border-ardo-gold/30 font-medium">
                          Size: {item.size}
                        </span>
                        <span className="font-bold text-ardo-charcoal">
                          ৳{item.product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-ardo-gold/40 rounded bg-ardo-ivory">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.size, -1)}
                          className="p-1 hover:bg-ardo-soft-ivory text-ardo-charcoal transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-ardo-charcoal">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.size, 1)}
                          className="p-1 hover:bg-ardo-soft-ivory text-ardo-charcoal transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="font-bold text-sm text-ardo-charcoal">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-ardo-soft-ivory border-t border-ardo-gold/30 space-y-4">
              
              {/* Delivery Zone Selector */}
              <div className="bg-ardo-ivory p-3 rounded border border-ardo-gold/30">
                <div className="flex items-center justify-between text-xs font-semibold text-ardo-charcoal mb-2">
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} className="text-ardo-gold" />
                    {lang === 'bn' ? 'ডেলিভারি এলাকা নির্বাচন করুন:' : 'Select Delivery Area:'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryLocation('dhaka')}
                    className={`py-2 px-2.5 rounded text-center border font-medium transition-all ${
                      deliveryLocation === 'dhaka'
                        ? 'bg-ardo-charcoal text-ardo-ivory border-ardo-charcoal font-bold'
                        : 'bg-ardo-soft-ivory text-ardo-charcoal/80 border-ardo-gold/30 hover:border-ardo-gold'
                    }`}
                  >
                    <span>{lang === 'bn' ? 'ঢাকা শহর' : 'Inside Dhaka'}</span>
                    <span className="block text-[11px] opacity-80">৳৮০</span>
                  </button>
                  <button
                    onClick={() => setDeliveryLocation('outside_dhaka')}
                    className={`py-2 px-2.5 rounded text-center border font-medium transition-all ${
                      deliveryLocation === 'outside_dhaka'
                        ? 'bg-ardo-charcoal text-ardo-ivory border-ardo-charcoal font-bold'
                        : 'bg-ardo-soft-ivory text-ardo-charcoal/80 border-ardo-gold/30 hover:border-ardo-gold'
                    }`}
                  >
                    <span>{lang === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}</span>
                    <span className="block text-[11px] opacity-80">৳১৩০</span>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-ardo-charcoal/80">
                <div className="flex justify-between">
                  <span>{lang === 'bn' ? 'পণ্য মূল্য (Subtotal)' : 'Subtotal'}</span>
                  <span className="font-semibold text-ardo-charcoal">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Fee'}</span>
                  <span className="font-semibold text-ardo-charcoal">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">{lang === 'bn' ? 'ফ্রি' : 'Free'}</span>
                    ) : (
                      `৳${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-ardo-gold/25 flex justify-between text-base font-bold text-ardo-charcoal">
                  <span>{lang === 'bn' ? 'সর্বমোট (Grand Total)' : 'Grand Total'}</span>
                  <span className="text-lg">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA (বাটন হবে Charcoal ব্যাকগ্রাউন্ড ও Ivory লেখা। হোভারে Gold) */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-ardo-charcoal text-ardo-ivory hover:bg-ardo-gold hover:text-white transition-all duration-300 rounded-sm font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{lang === 'bn' ? 'অর্ডার সম্পন্ন করুন' : 'Proceed to Checkout'}</span>
                <ArrowRight size={15} />
              </button>

              <p className="text-[10px] text-center text-ardo-charcoal/60">
                {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ সাপোর্টেড' : 'Supports Cash on Delivery, bKash & Nagad'}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
