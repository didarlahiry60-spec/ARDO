import React, { useState } from 'react';
import { 
  X, Printer, Phone, MessageSquare, Copy, Check, 
  Truck, ShieldCheck, MapPin, Calendar, CreditCard, PackageCheck, AlertCircle 
} from 'lucide-react';

export const OrderDetailsModal = ({ order, isOpen, onClose, onUpdateStatus, onUpdateCourier }) => {
  if (!isOpen || !order) return null;

  const [copied, setCopied] = useState(false);
  const [courierInput, setCourierInput] = useState(order.courier?.trackingCode || '');
  const [courierProvider, setCourierProvider] = useState(order.courier?.provider || 'Steadfast Courier');
  const [savedCourier, setSavedCourier] = useState(false);

  const statusConfig = {
    pending: { label: 'অপেক্ষমাণ (Pending)', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    confirmed: { label: 'নিশ্চিত (Confirmed)', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    processing: { label: 'প্যাকিং হচ্ছে (Packaging)', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    shipped: { label: 'কুরিয়ারে হস্তান্তর (In Transit)', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
    delivered: { label: 'ডেলিভার্ড (Delivered)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    cancelled: { label: 'বাতিল (Cancelled)', color: 'bg-red-100 text-red-900 border-red-300' }
  };

  const handleCopyCourierData = () => {
    const text = `নাম: ${order.customer.name}\nমোবাইল: ${order.customer.phone}\nঠিকানা: ${order.customer.address} (${order.customer.district === 'dhaka' ? 'ঢাকা' : 'ঢাকার বাইরে'})\nকালেকশন পরিমাণ: ${order.payment.method === 'cod' ? order.pricing.grandTotal : 0} ৳\nনোট: ${order.customer.note || 'ARDO প্রিমিয়াম প্যাকেজ'}\nপণ্য: ${order.items.map(i => `${i.name.bn} (${i.color}, সাইজ ${i.size}) x${i.quantity}`).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCourier = (e) => {
    e.preventDefault();
    if (onUpdateCourier) {
      onUpdateCourier(order.id, {
        provider: courierProvider,
        trackingCode: courierInput
      });
      setSavedCourier(true);
      setTimeout(() => setSavedCourier(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `আসসালামু আলাইকুম ${order.customer.name}, ARDO Premium Menswear থেকে আপনার অর্ডার #${order.id} টি গ্রহণ করা হয়েছে। মোট বিল: ${order.pricing.grandTotal}৳। কোনো প্রশ্ন থাকলে আমাদের জানাতে পারেন। ধন্যবাদ!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-ardo-gold/40 overflow-hidden relative my-6 text-slate-800 print:shadow-none print:border-none print:my-0 print:max-w-full">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-ardo-charcoal text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b border-ardo-gold/40 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm bg-ardo-charcoal-light px-2.5 py-1 rounded border border-ardo-gold/30 text-ardo-gold font-bold">
              {order.id}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${statusConfig[order.status]?.color}`}>
              {statusConfig[order.status]?.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ardo-charcoal-light hover:bg-ardo-gold hover:text-ardo-charcoal text-ardo-ivory text-xs font-semibold rounded transition-colors border border-ardo-gold/30"
              title="ইনভয়েস প্রিন্ট করুন"
            >
              <Printer size={15} />
              <span>প্রিন্ট চালান</span>
            </button>
            <button
              onClick={handleCopyCourierData}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors shadow"
              title="Steadfast বা Pathao-তে এন্ট্রি করার জন্য তথ্য কপি করুন"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? 'কপি হয়েছে!' : 'কুরিয়ার ডেটা কপি'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 space-y-6 print:p-6" id="printable-invoice">
          
          {/* Header & Logo */}
          <div className="flex justify-between items-start pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5">
                <img 
                  src="/images/ardo-logo-dp.webp" 
                  alt="ARDO" 
                  className="w-10 h-10 rounded-full border border-ardo-gold"
                />
                <div>
                  <h1 className="font-serif text-2xl font-bold tracking-[0.2em] text-ardo-charcoal leading-none">
                    ARDO
                  </h1>
                  <p className="text-[10px] tracking-[0.25em] text-ardo-gold uppercase font-semibold">
                    PREMIUM MENSWEAR
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                উত্তর বাড্ডা, ঢাকা, বাংলাদেশ<br />
                হটলাইন: 01631188500
              </p>
            </div>

            <div className="text-right">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                ক্যাশ মেমো / ইনভয়েস
              </h2>
              <p className="font-mono text-xs font-bold text-ardo-charcoal mt-1">
                অর্ডার নং: {order.id}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                তারিখ: {new Date(order.createdAt).toLocaleString('bn-BD', { 
                  dateStyle: 'medium', 
                  timeStyle: 'short' 
                })}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <p className="text-[11px] font-bold text-ardo-gold uppercase tracking-wider mb-1">
                গ্রাহকের তথ্য (Customer Details)
              </p>
              <p className="text-sm font-bold text-slate-900">{order.customer.name}</p>
              <p className="text-xs font-mono text-slate-700 font-semibold flex items-center gap-1.5 mt-0.5">
                <Phone size={13} className="text-slate-400" />
                {order.customer.phone}
              </p>
              <p className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{order.customer.address}</span>
              </p>
              <span className="inline-block mt-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                {order.customer.district === 'dhaka' ? 'ঢাকার ভেতরে (Dhaka Metro)' : 'ঢাকার বাইরে (Outside Dhaka)'}
              </span>
              {order.customer.note && (
                <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                  <span className="font-bold">নোট:</span> {order.customer.note}
                </p>
              )}
            </div>

            <div className="space-y-3 sm:border-l sm:border-slate-200 sm:pl-4">
              <div>
                <p className="text-[11px] font-bold text-ardo-gold uppercase tracking-wider mb-1">
                  পেমেন্ট মাধ্যম (Payment Details)
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    {order.payment.method === 'cod' ? 'ক্যাশ অন ডেলিভারি (Cash on Delivery)' : 
                     order.payment.method === 'bkash' ? 'বিকাশ অনলাইন (bKash)' : 'নগদ অনলাইন (Nagad)'}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    order.payment.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.payment.status === 'paid' ? 'পরিশোধিত (Paid)' : 'বাকি (Due COD)'}
                  </span>
                </div>
                {order.payment.trxId && order.payment.trxId !== 'N/A' && (
                  <p className="text-xs font-mono text-slate-600 mt-1">
                    TrxID: <span className="font-bold text-slate-900">{order.payment.trxId}</span>
                  </p>
                )}
              </div>

              {/* Quick Communication Actions (Hidden on Print) */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2 print:hidden">
                <a
                  href={`tel:${order.customer.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold transition-colors"
                >
                  <Phone size={13} />
                  <span>সরাসরি কল দিন</span>
                </a>
                <a
                  href={`https://wa.me/88${order.customer.phone.replace(/^0/, '')}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded text-xs font-semibold transition-colors"
                >
                  <MessageSquare size={13} />
                  <span>হোয়াটসঅ্যাপ মেসেজ</span>
                </a>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <p className="text-[11px] font-bold text-ardo-gold uppercase tracking-wider mb-2">
              অর্ডারের আইটেমসমূহ
            </p>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">পণ্য</th>
                    <th className="py-2.5 px-3">কালার ও সাইজ</th>
                    <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                    <th className="py-2.5 px-3 text-right">একক মূল্য</th>
                    <th className="py-2.5 px-3 text-right">মোট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name?.bn || item.name} 
                              onError={(e) => { e.target.src = '/images/products/shirt-black-model.jpg'; }}
                              className="w-10 h-12 object-cover rounded border border-slate-200 shrink-0" 
                            />
                          )}
                          <div>
                            <p className="font-bold text-slate-900">{item.name?.bn || item.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">ID: {item.productId || idx+1}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-[11px] font-medium">
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-black/20" 
                              style={{ backgroundColor: item.colorCode || '#888' }} 
                            />
                            {item.color}
                          </span>
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">
                              সাইজ: {item.size}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {item.quantity} টি
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">
                        ৳{item.price}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        ৳{item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-full max-w-xs space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>পণ্য উপমোট (Subtotal):</span>
                <span className="font-mono font-semibold">৳{order.pricing.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-mono font-semibold">
                  {order.pricing.deliveryFee === 0 ? 'ফ্রি' : `৳${order.pricing.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-300">
                <span>সর্বমোট প্রদেয়:</span>
                <span className="font-mono text-ardo-charcoal font-black">৳{order.pricing.grandTotal}</span>
              </div>
              {order.payment.method === 'cod' && (
                <p className="text-[10px] text-right text-emerald-800 font-semibold">
                  * ডেলিভারি ম্যানের কাছে ৳{order.pricing.grandTotal} কালেকশনযোগ্য
                </p>
              )}
            </div>
          </div>

          {/* Status & Courier Controls (Hidden on Print) */}
          <div className="bg-ardo-soft-ivory p-4 rounded-lg border border-ardo-gold/30 space-y-4 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-ardo-charcoal uppercase tracking-wider mb-1">
                  অর্ডার স্ট্যাটাস আপডেট করুন:
                </label>
                <p className="text-[11px] text-ardo-charcoal/70">
                  গ্রাহক বা কুরিয়ারের বর্তমান অবস্থা অনুযায়ী স্ট্যাটাস পরিবর্তন করুন
                </p>
              </div>
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                className="bg-white border border-ardo-gold/40 rounded px-3 py-2 text-xs font-bold text-ardo-charcoal focus:outline-none focus:ring-1 focus:ring-ardo-gold"
              >
                <option value="pending">⏳ অপেক্ষমাণ (Pending)</option>
                <option value="confirmed">📞 নিশ্চিত (Confirmed)</option>
                <option value="processing">📦 প্যাকিং হচ্ছে (Packaging)</option>
                <option value="shipped">🚚 কুরিয়ারে হস্তান্তর (In Transit)</option>
                <option value="delivered">✅ সফলভাবে ডেলিভার্ড (Delivered)</option>
                <option value="cancelled">❌ বাতিল (Cancelled)</option>
              </select>
            </div>

            {/* Courier Tracking Input */}
            <form onSubmit={handleSaveCourier} className="pt-3 border-t border-ardo-gold/20 flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-48">
                <select
                  value={courierProvider}
                  onChange={(e) => setCourierProvider(e.target.value)}
                  className="w-full bg-white border border-ardo-gold/40 rounded px-2.5 py-1.5 text-xs text-ardo-charcoal focus:outline-none"
                >
                  <option value="Steadfast Courier">Steadfast Courier</option>
                  <option value="Pathao Courier">Pathao Courier</option>
                  <option value="RedX Logistics">RedX Logistics</option>
                  <option value="Paperfly">Paperfly</option>
                  <option value="সুন্দরবন কুরিয়ার">সুন্দরবন কুরিয়ার</option>
                </select>
              </div>

              <div className="w-full sm:flex-1">
                <input
                  type="text"
                  placeholder="কুরিয়ার ট্র্যাকিং / কনসাইনমেন্ট নম্বর (যেমন: ST-829102)"
                  value={courierInput}
                  onChange={(e) => setCourierInput(e.target.value)}
                  className="w-full bg-white border border-ardo-gold/40 rounded px-3 py-1.5 text-xs text-ardo-charcoal font-mono placeholder-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-1.5 bg-ardo-charcoal hover:bg-ardo-gold text-ardo-ivory hover:text-ardo-charcoal text-xs font-bold rounded transition-colors"
              >
                {savedCourier ? 'সংরক্ষিত!' : 'ট্র্যাকিং সংরক্ষণ'}
              </button>
            </form>
          </div>

          {/* Footer note for Print */}
          <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
            <p className="font-serif tracking-wider font-semibold text-slate-700">
              ARDO Premium Menswear - বাংলাদেশি আভিজাত্য, নিজস্ব পরিচয়
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন: ফেসবুক পেজ fb.com/ardo.menswear অথবা হটলাইনে।
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
