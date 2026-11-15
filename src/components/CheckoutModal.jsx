import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, CheckCircle, ShieldCheck, Truck, Phone, User, MapPin } from 'lucide-react';

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    clearCart, 
    subtotal, 
    deliveryFee, 
    grandTotal, 
    deliveryLocation, 
    setDeliveryLocation,
    createOrder,
    storeSettings,
    lang 
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: 'dhaka',
    note: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'bkash' | 'nagad' | 'rocket'
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDistrictChange = (e) => {
    const dist = e.target.value;
    setFormData(prev => ({ ...prev, district: dist }));
    if (dist.toLowerCase() === 'dhaka' || dist === 'ঢাকা') {
      setDeliveryLocation('dhaka');
    } else {
      setDeliveryLocation('outside_dhaka');
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert(lang === 'bn' ? 'অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং ঠিকানা লিখুন।' : 'Please fill in name, phone number, and address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newOrderId = createOrder({
        customer: formData,
        items: cart,
        subtotal,
        deliveryFee,
        grandTotal,
        paymentMethod,
        bkashTrxId
      });
      setConfirmedOrderId(newOrderId);
      setIsSubmitting(false);
      setOrderComplete(true);
      clearCart();
    }, 1000);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderComplete(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ardo-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-ardo-ivory w-full max-w-2xl rounded-xl border border-ardo-gold/40 shadow-2xl overflow-hidden relative my-6">
        
        {/* Modal Header */}
        <div className="p-5 bg-ardo-soft-ivory border-b border-ardo-gold/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/ardo-logo-dp.webp" alt="ARDO" className="w-8 h-8 rounded-full border border-ardo-gold" />
            <div>
              <h3 className="font-serif text-lg font-bold text-ardo-charcoal leading-tight">
                {orderComplete 
                  ? (lang === 'bn' ? 'অর্ডার সফল হয়েছে!' : 'Order Placed Successfully!') 
                  : (lang === 'bn' ? 'নিরাপদ চেকআউট' : 'Secure Checkout')}
              </h3>
              <p className="text-[11px] text-ardo-gold font-medium uppercase tracking-widest">
                ARDO Premium Menswear
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 text-ardo-charcoal/70 hover:text-ardo-charcoal rounded hover:bg-ardo-ivory"
          >
            <X size={20} />
          </button>
        </div>

        {orderComplete ? (
          /* Order Confirmation Screen */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle size={36} />
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-2xl font-bold text-ardo-charcoal">
                {lang === 'bn' ? 'ধন্যবাদ, আপনার অর্ডারটি গ্রহণ করা হয়েছে!' : 'Thank you, your order is placed!'}
              </h4>
              <p className="text-xs text-ardo-charcoal/70">
                {lang === 'bn' 
                  ? 'আমাদের কাস্টমার রিলেশন প্রতিনিধি শীঘ্রই আপনার নম্বরে কল দিয়ে অর্ডারটি কনফার্ম করবেন।' 
                  : 'Our customer support representative will call you shortly to confirm delivery.'}
              </p>
            </div>

            <div className="bg-ardo-soft-ivory p-4 rounded-lg border border-ardo-gold/30 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-ardo-gold/20">
                <span className="text-ardo-charcoal/70">{lang === 'bn' ? 'অর্ডার আইডি:' : 'Order ID:'}</span>
                <span className="font-mono font-bold text-ardo-charcoal">{confirmedOrderId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ardo-gold/20">
                <span className="text-ardo-charcoal/70">{lang === 'bn' ? 'নাম ও মোবাইল:' : 'Customer:'}</span>
                <span className="font-medium text-ardo-charcoal">{formData.name} ({formData.phone})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ardo-gold/20">
                <span className="text-ardo-charcoal/70">{lang === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Method:'}</span>
                <span className="font-bold text-ardo-gold uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 pt-2 font-bold text-sm text-ardo-charcoal">
                <span>{lang === 'bn' ? 'পরিশোধযোগ্য মোট:' : 'Total Payable:'}</span>
                <span>৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3 bg-ardo-charcoal text-ardo-ivory hover:bg-ardo-gold hover:text-white rounded-sm text-xs font-semibold uppercase tracking-widest transition-all"
            >
              {lang === 'bn' ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Customer Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ardo-gold flex items-center gap-1.5 pb-2 border-b border-ardo-gold/20">
                <User size={14} />
                <span>{lang === 'bn' ? '১. কাস্টমার তথ্য ও ডেলিভারি ঠিকানা' : '1. Customer & Shipping Details'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ardo-charcoal mb-1">
                    {lang === 'bn' ? 'আপনার নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={lang === 'bn' ? 'উদা: মো. আসিফ চৌধুরী' : 'e.g. Asif Chowdhury'}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-ardo-soft-ivory border border-ardo-gold/30 rounded px-3 py-2 text-xs text-ardo-charcoal focus:border-ardo-charcoal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ardo-charcoal mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর (১১ ডিজিট) *' : 'Mobile Phone *'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-ardo-soft-ivory border border-ardo-gold/30 rounded px-3 py-2 text-xs text-ardo-charcoal focus:border-ardo-charcoal focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ardo-charcoal mb-1">
                    {lang === 'bn' ? 'জেলা / এলাকা *' : 'District *'}
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    className="w-full bg-ardo-soft-ivory border border-ardo-gold/30 rounded px-3 py-2 text-xs text-ardo-charcoal focus:border-ardo-charcoal focus:outline-none"
                  >
                    <option value="dhaka">ঢাকা (Dhaka) - ডেলিভারি ৮০৳</option>
                    <option value="chittagong">চট্টগ্রাম (Chittagong) - ডেলিভারি ১৩০৳</option>
                    <option value="sylhet">সিলেট (Sylhet) - ডেলিভারি ১৩০৳</option>
                    <option value="rajshahi">রাজশাহী (Rajshahi) - ডেলিভারি ১৩০৳</option>
                    <option value="khulna">খুলনা (Khulna) - ডেলিভারি ১৩০৳</option>
                    <option value="barishal">বরিশাল (Barishal) - ডেলিভারি ১৩০৳</option>
                    <option value="rangpur">রংপুর (Rangpur) - ডেলিভারি ১৩০৳</option>
                    <option value="mymensingh">ময়মনসিংহ (Mymensingh) - ডেলিভারি ১৩০৳</option>
                    <option value="outside">অন্যান্য জেলা (Other Districts) - ১৩০৳</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ardo-charcoal mb-1">
                    {lang === 'bn' ? 'পূর্ণাঙ্গ ঠিকানা (বাসা/রোড/এলাকা) *' : 'Full Street Address *'}
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder={lang === 'bn' ? 'হাউস # ১২, রোড # ৪, ব্লক # বি...' : 'House # 12, Road # 4...'}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-ardo-soft-ivory border border-ardo-gold/30 rounded px-3 py-2 text-xs text-ardo-charcoal focus:border-ardo-charcoal focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ardo-gold flex items-center gap-1.5 pb-2 border-b border-ardo-gold/20">
                <ShieldCheck size={14} />
                <span>{lang === 'bn' ? '২. পেমেন্ট পদ্ধতি বেছে নিন' : '2. Select Payment Method'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cash on Delivery */}
                <label 
                  className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-ardo-charcoal bg-ardo-soft-ivory shadow-sm'
                      : 'border-ardo-gold/30 bg-ardo-ivory hover:border-ardo-gold'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-ardo-charcoal">Cash On Delivery</span>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-ardo-charcoal" 
                    />
                  </div>
                  <p className="text-[11px] text-ardo-charcoal/70">
                    {lang === 'bn' ? 'পণ্য হাতে পেয়ে টাকা পরিশোধ করুন' : 'Pay when you receive the parcel'}
                  </p>
                </label>

                {/* bKash */}
                <label 
                  className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-[#E2136E] bg-pink-50/50 shadow-sm'
                      : 'border-ardo-gold/30 bg-ardo-ivory hover:border-[#E2136E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#E2136E]">bKash বিকাশ</span>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'bkash'} 
                      onChange={() => setPaymentMethod('bkash')}
                      className="accent-[#E2136E]" 
                    />
                  </div>
                  <p className="text-[11px] text-ardo-charcoal/70">
                    {lang === 'bn' ? 'বিকাশ মার্চেন্ট / পার্সোনাল সেন্ড মানি' : 'Instant bKash payment'}
                  </p>
                </label>

                {/* Nagad */}
                <label 
                  className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-[#F7941D] bg-amber-50/50 shadow-sm'
                      : 'border-ardo-gold/30 bg-ardo-ivory hover:border-[#F7941D]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#F7941D]">Nagad নগদ</span>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'nagad'} 
                      onChange={() => setPaymentMethod('nagad')}
                      className="accent-[#F7941D]" 
                    />
                  </div>
                  <p className="text-[11px] text-ardo-charcoal/70">
                    {lang === 'bn' ? 'নগদ ওয়ালেট পেমেন্ট' : 'Direct Nagad transfer'}
                  </p>
                </label>
              </div>

              {/* bKash / Nagad Trx Details if selected */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="bg-ardo-soft-ivory p-3.5 rounded border border-ardo-gold/40 text-xs space-y-2">
                  <p className="text-ardo-charcoal font-medium">
                    {lang === 'bn' 
                      ? `দয়া করে আমাদের ${paymentMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} নম্বরে ৳${grandTotal.toLocaleString()} সেন্ড করুন: ` 
                      : `Please send ৳${grandTotal.toLocaleString()} to our ${paymentMethod.toUpperCase()} number: `}
                    <strong className="text-ardo-charcoal font-mono ml-1 font-bold">
                      {paymentMethod === 'bkash' ? (storeSettings?.bkashNumber || '01700-000000') : (storeSettings?.nagadNumber || '01800-000000')}
                    </strong>
                  </p>
                  <div>
                    <label className="block text-[11px] text-ardo-charcoal/70 mb-1">
                      {lang === 'bn' ? 'ট্রানজ্যাকশন আইডি (TrxID) লিখুন:' : 'Enter Transaction ID (TrxID):'}
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. 9K72LM8Q"
                      value={bkashTrxId}
                      onChange={(e) => setBkashTrxId(e.target.value)}
                      className="w-full bg-ardo-ivory border border-ardo-gold/40 rounded px-2.5 py-1.5 font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Breakdown */}
            <div className="bg-ardo-soft-ivory p-4 rounded-lg border border-ardo-gold/30 space-y-2 text-xs">
              <div className="flex justify-between text-ardo-charcoal/70">
                <span>{lang === 'bn' ? 'পণ্য মূল্য:' : 'Subtotal:'}</span>
                <span className="font-semibold text-ardo-charcoal">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ardo-charcoal/70">
                <span>
                  {deliveryLocation === 'dhaka' 
                    ? (lang === 'bn' ? 'ডেলিভারি চার্জ (ঢাকা):' : 'Delivery Charge (Dhaka):')
                    : (lang === 'bn' ? 'ডেলিভারি চার্জ (ঢাকার বাইরে):' : 'Delivery Charge (Outside Dhaka):')}
                </span>
                <span className="font-semibold text-ardo-charcoal">৳{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-ardo-charcoal pt-2 border-t border-ardo-gold/20">
                <span>{lang === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Total Payable Amount:'}</span>
                <span className="text-base text-ardo-charcoal">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-ardo-charcoal text-ardo-ivory hover:bg-ardo-gold hover:text-white transition-all duration-300 font-semibold text-xs uppercase tracking-widest rounded-sm shadow-xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>{lang === 'bn' ? 'অর্ডার প্রক্রিয়াধীন হচ্ছে...' : 'Processing Order...'}</span>
              ) : (
                <span>{lang === 'bn' ? `কনফার্ম অর্ডার (৳${grandTotal.toLocaleString()})` : `Confirm Order (৳${grandTotal.toLocaleString()})`}</span>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
