import React from 'react';
import { useCart } from '../../context/CartContext';
import { Shield, ArrowLeft, LogOut } from 'lucide-react';

export const OwnerFloatingBar = () => {
  const { isAdminOpen, setIsAdminOpen } = useCart();

  // Only render if admin is currently authenticated in session AND currently viewing storefront
  const isAuthenticated = typeof window !== 'undefined' && sessionStorage.getItem('ardo_admin_auth') === 'true';

  if (isAdminOpen || !isAuthenticated) {
    return null; // 100% invisible to regular customers
  }

  const handleLogout = () => {
    sessionStorage.removeItem('ardo_admin_auth');
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-ardo-gold/60 rounded-full px-4 py-2 shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-1.5 text-ardo-gold font-bold">
          <Shield size={14} className="text-ardo-gold" />
          <span className="hidden sm:inline">অ্যাডমিন প্রিভিউ মোড</span>
          <span className="sm:hidden">প্রিভিউ</span>
        </div>

        <div className="h-3.5 w-px bg-slate-700"></div>

        <button
          onClick={() => setIsAdminOpen(true)}
          className="bg-ardo-gold hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1 transition-colors shadow"
          title="অ্যাডমিন পোর্টালে ফেরত যান"
        >
          <ArrowLeft size={13} />
          <span>অ্যাডমিন ড্যাশবোর্ডে ফিরুন</span>
        </button>

        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
          title="অ্যাডমিন সেশন সমাপ্ত (লগআউট)"
        >
          <LogOut size={13} />
        </button>
      </div>
    </div>
  );
};
