import React, { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { OrderDetailsModal } from './OrderDetailsModal';
import { ProductFormModal } from './ProductFormModal';
import { 
  ShoppingBag, Package, Truck, CheckCircle2, Clock, 
  Search, Filter, Download, Plus, Eye, Phone, MessageSquare, 
  Copy, Check, Trash2, Printer, Settings, DollarSign, 
  BarChart3, RefreshCw, LogOut, Lock, Key, Shield, ArrowLeft,
  ChevronRight, ExternalLink, AlertTriangle, Layers, Tag, Edit3, Save,
  Users, Bell, Send, CheckSquare, Square, Smartphone, MapPin, ChevronDown,
  LayoutGrid, List
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    orders, 
    updateOrderStatus, 
    updateOrderCourier, 
    deleteOrder, 
    createOrder,
    resetOrdersToSeed,
    refreshFromServer,
    products, 
    createProduct,
    updateProduct,
    deleteProduct,
    openProductModal,
    updateProductOverride,
    storeSettings, 
    updateStoreSettings, 
    setIsAdminOpen,
    lang 
  } = useCart();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ardo_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Password Recovery States
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('orders'); 
  // 'dashboard' | 'orders' | 'customers' | 'products' | 'courier' | 'notifications' | 'settings'

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Product management states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all');
  const [productViewMode, setProductViewMode] = useState('grid'); // 'grid' | 'table'

  // Legacy product edit state
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductForm, setEditProductForm] = useState({});

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    deliveryDhaka: storeSettings?.deliveryDhaka || 80,
    deliveryOutside: storeSettings?.deliveryOutside || 130,
    freeDeliveryThreshold: storeSettings?.freeDeliveryThreshold || 5000,
    bkashNumber: storeSettings?.bkashNumber || '01700-000000',
    nagadNumber: storeSettings?.nagadNumber || '01800-000000',
    whatsappNumber: storeSettings?.whatsappNumber || '8801700000000',
    adminPin: storeSettings?.adminPin || 'didar1122',
    securityQuestion: storeSettings?.securityQuestion || 'আপনার প্রিয় মানুষের নাম কী?',
    securityAnswer: storeSettings?.securityAnswer || 'didaroshi',
    telegramBotToken: storeSettings?.telegramBotToken || '',
    telegramChatId: storeSettings?.telegramChatId || '',
    announcementBn: storeSettings?.announcementText?.bn || 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি | ঢাকার ভেতরে ৮০৳, বাইরে ১৩০৳',
    announcementEn: storeSettings?.announcementText?.en || 'Cash on Delivery All Over Bangladesh | Dhaka 80৳, Outside 130৳'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [telegramTestStatus, setTelegramTestStatus] = useState('');

  // Status mapping
  const statusLabels = {
    pending: { label: 'অপেক্ষমাণ', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    confirmed: { label: 'নিশ্চিত', color: 'bg-sky-100 text-sky-800 border-sky-300' },
    processing: { label: 'প্যাকিং', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    shipped: { label: 'কুরিয়ারে', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    delivered: { label: 'ডেলিভার্ড', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    cancelled: { label: 'বাতিল', color: 'bg-rose-100 text-rose-800 border-rose-300' }
  };

  // Login Handler (Strict Secure Check)
  const handleLogin = (e) => {
    e.preventDefault();
    const correctPin = storeSettings?.adminPin || 'didar1122';
    if (passwordInput === correctPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('ardo_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক সিকিউরিটি কোড দিন।');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ardo_admin_auth');
  };

  // Password Recovery Handler via Security Question
  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    const answer = recoveryAnswer.trim();
    if (!answer) {
      setRecoveryError('অনুগ্রহ করে নিরাপত্তা প্রশ্নের উত্তরটি লিখুন।');
      return;
    }

    if (!recoveryNewPassword.trim() || recoveryNewPassword.trim().length < 4) {
      setRecoveryError('নতুন পাসওয়ার্ড ন্যূনতম ৪ অক্ষরের হতে হবে।');
      return;
    }

    try {
      setIsRecovering(true);
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: answer,
          newPassword: recoveryNewPassword.trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        setRecoverySuccess('পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...');
        sessionStorage.setItem('ardo_admin_auth', 'true');
        setTimeout(() => {
          setIsAuthenticated(true);
          setShowRecovery(false);
          setRecoveryAnswer('');
          setRecoveryNewPassword('');
          setRecoverySuccess('');
        }, 900);
      } else {
        setRecoveryError(data.error || 'ভুল উত্তর! সঠিক নিরাপত্তা উত্তর দিন।');
      }
    } catch (err) {
      // Local check fallback
      if (answer.toLowerCase() === 'didaroshi') {
        const cleanPin = recoveryNewPassword.trim();
        updateStoreSettings({ adminPin: cleanPin });
        sessionStorage.setItem('ardo_admin_auth', 'true');
        setRecoverySuccess('পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!');
        setTimeout(() => {
          setIsAuthenticated(true);
          setShowRecovery(false);
          setRecoveryAnswer('');
          setRecoveryNewPassword('');
          setRecoverySuccess('');
        }, 900);
      } else {
        setRecoveryError('ভুল উত্তর! সঠিক নিরাপত্তা উত্তর দিন।');
      }
    } finally {
      setIsRecovering(false);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        order.id.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.phone.includes(q) ||
        order.customer.address.toLowerCase().includes(q) ||
        (order.payment.trxId && order.payment.trxId.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesDistrict = districtFilter === 'all' || order.customer.district === districtFilter;

      return matchesSearch && matchesStatus && matchesDistrict;
    });
  }, [orders, searchQuery, statusFilter, districtFilter]);

  // Filtered Products
  const filteredProductsList = useMemo(() => {
    return products.filter(p => {
      const q = productSearch.toLowerCase().trim();
      const matchesSearch = !q || 
        p.name?.bn?.toLowerCase().includes(q) ||
        p.name?.en?.toLowerCase().includes(q) ||
        String(p.id).includes(q);
      const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const matchesStock = productStockFilter === 'all' || 
        (productStockFilter === 'in_stock' && !p.isOutOfStock) ||
        (productStockFilter === 'out_of_stock' && p.isOutOfStock);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
    const inTransitOrders = orders.filter(o => o.status === 'shipped' || o.status === 'processing').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);
    
    // Today's stats
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const todayRevenue = todayOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      inTransitOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      todayOrders: todayOrders.length,
      todayRevenue
    };
  }, [orders]);

  // Customers calculation
  const customersList = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      const phone = o.customer.phone;
      if (!map[phone]) {
        map[phone] = {
          name: o.customer.name,
          phone: o.customer.phone,
          address: o.customer.address,
          district: o.customer.district,
          totalSpent: 0,
          ordersCount: 0,
          lastOrderDate: o.createdAt
        };
      }
      map[phone].ordersCount += 1;
      map[phone].totalSpent += o.pricing?.grandTotal || 0;
      if (new Date(o.createdAt) > new Date(map[phone].lastOrderDate)) {
        map[phone].lastOrderDate = o.createdAt;
      }
    });
    return Object.values(map);
  }, [orders]);

  const activeOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  // Export to CSV (Formatted for Courier Merchant Portals)
  const handleExportCSV = () => {
    const headers = [
      "Order ID", "Date", "Customer Name", "Customer Phone", 
      "Delivery Address", "District", "Items Summary", 
      "Subtotal", "Delivery Fee", "Grand Total (Collection Amount)", 
      "Payment Method", "TrxID", "Order Status", "Courier Provider", "Tracking Code"
    ];
    
    const rows = filteredOrders.map(o => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${o.customer.name}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.address.replace(/"/g, '""')}"`,
      `"${o.customer.district === 'dhaka' ? 'Dhaka' : 'Outside Dhaka'}"`,
      `"${o.items.map(i => `${i.name?.bn || i.name} (${i.color} ${i.size}) x${i.quantity}`).join('; ')}"`,
      o.pricing.subtotal,
      o.pricing.deliveryFee,
      o.payment.method === 'cod' ? o.pricing.grandTotal : 0, // COD collection amount
      `"${o.payment.method}"`,
      `"${o.payment.trxId || ''}"`,
      `"${o.status}"`,
      `"${o.courier?.provider || ''}"`,
      `"${o.courier?.trackingCode || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ARDO_Courier_Manifest_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick Courier Copy (Formatted for Steadfast / Pathao portal)
  const handleQuickCopyCourier = (order, e) => {
    e.stopPropagation();
    const text = `গ্রাহক: ${order.customer.name}\nফোন: ${order.customer.phone}\nঠিকানা: ${order.customer.address} (${order.customer.district === 'dhaka' ? 'ঢাকা' : 'ঢাকার বাইরে'})\nকালেকশন: ${order.payment.method === 'cod' ? order.pricing.grandTotal : 0} ৳\nপণ্য: ${order.items.map(i => `${i.name?.bn || i.name} (${i.color}, ${i.size}) x${i.quantity}`).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Product Editing
  const startEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setEditProductForm({
      price: prod.price,
      originalPrice: prod.originalPrice,
      isOutOfStock: prod.isOutOfStock || false
    });
  };

  const saveEditProduct = (prodId) => {
    updateProductOverride(prodId, editProductForm);
    setEditingProductId(null);
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateStoreSettings({
      deliveryDhaka: Number(settingsForm.deliveryDhaka),
      deliveryOutside: Number(settingsForm.deliveryOutside),
      freeDeliveryThreshold: Number(settingsForm.freeDeliveryThreshold),
      bkashNumber: settingsForm.bkashNumber,
      nagadNumber: settingsForm.nagadNumber,
      whatsappNumber: settingsForm.whatsappNumber,
      adminPin: settingsForm.adminPin,
      telegramBotToken: settingsForm.telegramBotToken,
      telegramChatId: settingsForm.telegramChatId,
      announcementText: {
        bn: settingsForm.announcementBn,
        en: settingsForm.announcementEn
      }
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Test Telegram Bot
  const handleTestTelegram = async () => {
    if (!settingsForm.telegramBotToken || !settingsForm.telegramChatId) {
      setTelegramTestStatus('দয়া করে Bot Token ও Chat ID প্রদান করুন।');
      return;
    }
    setTelegramTestStatus('মেসেজ পাঠানো হচ্ছে...');
    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: settingsForm.telegramBotToken,
          chatId: settingsForm.telegramChatId
        })
      });
      const data = await res.json();
      if (data.ok) {
        setTelegramTestStatus('✅ টেস্ট মেসেজ সফলভাবে আপনার টেলিগ্রামে পৌঁছেছে!');
      } else {
        setTelegramTestStatus(`❌ এরর: ${data.description || 'টেলিগ্রাম কানেক্ট করা যায়নি'}`);
      }
    } catch (err) {
      setTelegramTestStatus(`❌ ব্যর্থ হয়েছে: ${err.message}`);
    }
  };

  // ============================================================================
  // 1. LOGIN SCREEN
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 text-white w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ardo-gold via-amber-300 to-ardo-gold"></div>
          
          <img 
            src="/images/ardo-logo-dp.webp" 
            alt="ARDO" 
            className="w-16 h-16 rounded-full border-2 border-ardo-gold mx-auto shadow-md mb-4" 
          />
          
          <h2 className="font-serif text-2xl font-bold tracking-[0.2em] text-white">
            ARDO
          </h2>
          <p className="text-xs tracking-[0.25em] text-ardo-gold uppercase font-semibold mb-6">
            Merchant Control Center
          </p>

          {!showRecovery ? (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Lock size={14} className="text-ardo-gold" />
                  অ্যাডমিন সিকিউরিটি পাসওয়ার্ড:
                </label>
                <input
                  type="password"
                  placeholder="পাসওয়ার্ড লিখুন..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ardo-gold"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowRecovery(true);
                    setAuthError('');
                    setRecoveryError('');
                    setRecoverySuccess('');
                  }}
                  className="text-xs text-ardo-gold hover:underline font-semibold"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>

              {authError && (
                <p className="text-xs text-rose-400 bg-rose-950/60 p-2.5 rounded border border-rose-800 font-medium">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-ardo-gold hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-md"
              >
                লগইন করুন
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <Shield size={12} className="text-ardo-gold" />
                  <span>শুধুমাত্র অনুমোদিত অ্যাডমিন অ্যাক্সেস সুরক্ষিত</span>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordRecovery} className="space-y-4 text-left">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-ardo-gold uppercase tracking-wider block">
                  নিরাপত্তা প্রশ্ন (Security Question)
                </span>
                <p className="text-xs font-semibold text-slate-200">
                  {storeSettings?.securityQuestion || 'আপনার প্রিয় মানুষের নাম কী?'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  নিরাপত্তা উত্তর লিখুন: <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="উত্তর লিখুন..."
                  value={recoveryAnswer}
                  onChange={(e) => setRecoveryAnswer(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-ardo-gold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  নতুন পাসওয়ার্ড দিন: <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="ন্যূনতম ৪ অক্ষরের নতুন পাসওয়ার্ড..."
                  value={recoveryNewPassword}
                  onChange={(e) => setRecoveryNewPassword(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-ardo-gold"
                />
              </div>

              {recoveryError && (
                <p className="text-xs text-rose-400 bg-rose-950/60 p-2.5 rounded border border-rose-800 font-medium">
                  {recoveryError}
                </p>
              )}

              {recoverySuccess && (
                <p className="text-xs text-emerald-400 bg-emerald-950/60 p-2.5 rounded border border-emerald-800 font-medium flex items-center gap-1.5">
                  <Check size={14} />
                  <span>{recoverySuccess}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isRecovering}
                className="w-full py-3 bg-ardo-gold hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-md disabled:opacity-50"
              >
                {isRecovering ? 'যাচাই করা হচ্ছে...' : 'যাচাই ও পাসওয়ার্ড রিসেট করুন'}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowRecovery(false);
                    setRecoveryError('');
                    setRecoverySuccess('');
                  }}
                  className="text-xs text-slate-400 hover:text-white underline transition-colors"
                >
                  ← লগইন স্ক্রিনে ফিরে যান
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-700/80 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
              className="w-full py-2.5 px-4 bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-slate-600 transition-colors shadow-sm"
            >
              <ArrowLeft size={14} className="text-ardo-gold" />
              <span>মূল কাস্টমার ওয়েবসাইটে ফিরে যান (View Storefront)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. REALISTIC ENTERPRISE ADMIN PORTAL (SHOPIFY / MEDUSA STYLE)
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* -------------------------------------------------------------------- */}
      {/* LEFT SIDEBAR (Dark Enterprise Slate: #0F172A)                        */}
      {/* -------------------------------------------------------------------- */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        
        {/* Brand & Store Status Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src="/images/ardo-logo-dp.webp" 
              alt="ARDO" 
              className="w-10 h-10 rounded-full border border-ardo-gold shadow" 
            />
            <div>
              <h1 className="font-serif text-lg font-bold tracking-widest text-white leading-none">
                ARDO
              </h1>
              <p className="text-[10px] tracking-wider text-ardo-gold uppercase font-bold mt-0.5">
                Merchant Portal
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              লাইভ স্টোর সচল
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-ardo-gold hover:underline flex items-center gap-1 font-semibold"
              title="গ্রাহকদের মূল ওয়েবসাইট নতুন ট্যাবে দেখুন"
            >
              <span>স্টোর দেখুন</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="p-3 space-y-1 flex-1">
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            কোর ম্যানেজমেন্ট
          </p>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'orders' 
                ? 'bg-ardo-gold text-slate-950 font-bold shadow' 
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package size={17} />
              <span>সকল অর্ডারসমূহ</span>
            </div>
            {stats.pendingOrders > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'orders' ? 'bg-slate-950 text-white' : 'bg-amber-500 text-slate-950'
              }`}>
                {stats.pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-ardo-gold text-slate-950 font-bold shadow' 
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <BarChart3 size={17} />
            <span>অ্যানালিটিক্স ও সেলস</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'customers' 
                ? 'bg-ardo-gold text-slate-950 font-bold shadow' 
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users size={17} />
              <span>গ্রাহক ডিরেক্টরি</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
              {customersList.length}
            </span>
          </button>

          <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            স্টোর ও লজিস্টিকস
          </p>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'products' 
                ? 'bg-ardo-gold text-slate-950 font-bold shadow' 
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tag size={17} />
              <span>পণ্য ও স্টক নিয়ন্ত্রণ</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
              {products.length}টি
            </span>
          </button>

          <button
            onClick={() => setActiveTab('courier')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'courier' 
                ? 'bg-ardo-gold text-slate-950 font-bold shadow' 
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Truck size={17} />
            <span>কুরিয়ার ও পার্সেল বুকিং</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-ardo-gold text-slate-950 font-bold shadow' 
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Smartphone size={17} />
              <span>মোবাইল নোটিফিকেশন</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-ardo-gold"></span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'settings' 
                ? 'bg-ardo-gold text-slate-950 font-bold shadow' 
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Settings size={17} />
            <span>স্টোর সেটিংস ও চার্জ</span>
          </button>
        </nav>

        {/* Sidebar Footer with User Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-ardo-gold font-bold text-xs">
              AD
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">এডমিন প্যানেল</p>
              <p className="text-[10px] text-slate-400">Master Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
            title="লগআউট"
          >
            <LogOut size={16} />
          </button>
        </div>

      </aside>

      {/* -------------------------------------------------------------------- */}
      {/* MAIN VIEW AREA                                                       */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {activeTab === 'orders' && 'অর্ডার ম্যানেজমেন্ট (Order Control)'}
              {activeTab === 'dashboard' && 'বিক্রয় ও বিজনেস অ্যানালিটিক্স'}
              {activeTab === 'customers' && 'কাস্টমার ডিরেক্টরি (Customer Directory)'}
              {activeTab === 'products' && 'প্রোডাক্ট ও ইনভেন্টরি কন্ট্রোল'}
              {activeTab === 'courier' && 'কুরিয়ার বুকিং ও ডেলিভারি লগ'}
              {activeTab === 'notifications' && 'রিয়েল-টাইম মোবাইল নোটিফিকেশন সেটআপ'}
              {activeTab === 'settings' && 'স্টোর কনফিগারেশন ও সেটিংস'}
            </h2>
            <p className="text-xs text-slate-500">
              ARDO Premium Menswear • রিয়েল-টাইম ক্লাউড ডেটাবেস
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={refreshFromServer}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
              title="সার্ভার থেকে রিয়েল-টাইম রিফ্রেশ"
            >
              <RefreshCw size={13} />
              <span>রিফ্রেশ</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              title="Steadfast বা Pathao-তে একবারে আপলোডের জন্য CSV ডাউনলোড"
            >
              <Download size={13} />
              <span>কুরিয়ার ম্যানিফেস্ট CSV</span>
            </button>
          </div>
        </header>

        {/* Content Tab Pages */}
        <main className="p-4 sm:p-6 space-y-6">

          {/* ================================================================ */}
          {/* TAB: ORDERS (DEFAULT)                                            */}
          {/* ================================================================ */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Metric Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">মোট অর্ডার</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalOrders}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Package size={20} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">অপেক্ষমাণ কনফার্মেশন</p>
                    <p className="text-2xl font-black text-amber-600 mt-1">{stats.pendingOrders}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">কুরিয়ারে আছে</p>
                    <p className="text-2xl font-black text-indigo-600 mt-1">{stats.inTransitOrders}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">মোট বিক্রয় রেভিনিউ</p>
                    <p className="text-2xl font-black text-emerald-700 mt-1 font-mono">৳{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <DollarSign size={20} />
                  </div>
                </div>
              </div>

              {/* Filter, Search & Status Strip */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  
                  {/* Search Input */}
                  <div className="relative w-full sm:w-96">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="অর্ডার আইডি, গ্রাহকের নাম, ফোন বা ঠিকানা..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* District & Reset */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <select
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none"
                    >
                      <option value="all">সকল জেলা / এলাকা</option>
                      <option value="dhaka">ঢাকার ভেতরে (৮০৳)</option>
                      <option value="outside_dhaka">ঢাকার বাইরে (১৩০৳)</option>
                    </select>

                    <button
                      onClick={refreshFromServer}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs border border-slate-300 flex items-center gap-1.5 font-medium transition-colors"
                      title="অর্ডার তালিকা রিফ্রেশ করুন"
                    >
                      <RefreshCw size={13} />
                      রিফ্রেশ
                    </button>
                  </div>
                </div>

                {/* Status Filter Badges */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-semibold text-[11px] mr-1 shrink-0">ফিল্টার:</span>
                  {[
                    { id: 'all', label: `সকল (${orders.length})` },
                    { id: 'pending', label: `অপেক্ষমাণ (${orders.filter(o => o.status === 'pending').length})` },
                    { id: 'confirmed', label: `নিশ্চিত (${orders.filter(o => o.status === 'confirmed').length})` },
                    { id: 'processing', label: `প্যাকিং (${orders.filter(o => o.status === 'processing').length})` },
                    { id: 'shipped', label: `কুরিয়ারে (${orders.filter(o => o.status === 'shipped').length})` },
                    { id: 'delivered', label: `ডেলিভার্ড (${orders.filter(o => o.status === 'delivered').length})` },
                    { id: 'cancelled', label: `বাতিল (${orders.filter(o => o.status === 'cancelled').length})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                        statusFilter === tab.id
                          ? 'bg-slate-900 text-white font-bold shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Realistic Orders Data Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">অর্ডার আইডি</th>
                        <th className="py-3.5 px-4">গ্রাহকের নাম ও ফোন</th>
                        <th className="py-3.5 px-4">ডেলিভারি ঠিকানা</th>
                        <th className="py-3.5 px-4">অর্ডারের পণ্যসমূহ</th>
                        <th className="py-3.5 px-4 text-right">কালেকশন বিল</th>
                        <th className="py-3.5 px-4">পেমেন্ট</th>
                        <th className="py-3.5 px-4">অর্ডার স্ট্যাটাস</th>
                        <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-16 text-center text-slate-400">
                            <Package size={40} className="mx-auto mb-3 opacity-40 text-slate-400" />
                            <p className="text-base font-semibold text-slate-700">এখনো কোনো অর্ডার আসেনি</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                              গ্রাহক ওয়েবসাইট থেকে অর্ডার প্লেস করলেই এখানে রিয়েল-টাইমে দেখতে পাবেন।
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(order => (
                          <tr 
                            key={order.id} 
                            className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            {/* Order ID & Date */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="font-mono font-bold text-slate-900 block">
                                {order.id}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                                  day: 'numeric',
                                  month: 'short'
                                })}, {new Date(order.createdAt).toLocaleTimeString('bn-BD', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </td>

                            {/* Customer Info */}
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-900">{order.customer.name}</p>
                              <a 
                                href={`tel:${order.customer.phone}`} 
                                onClick={(e) => e.stopPropagation()}
                                className="text-slate-600 hover:text-slate-900 font-mono text-[11px] flex items-center gap-1 mt-0.5"
                              >
                                <Phone size={11} className="text-slate-400" />
                                {order.customer.phone}
                              </a>
                            </td>

                            {/* Delivery Address */}
                            <td className="py-3 px-4 max-w-xs">
                              <p className="text-slate-700 text-[11px] line-clamp-2" title={order.customer.address}>
                                {order.customer.address}
                              </p>
                              <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                {order.customer.district === 'dhaka' ? 'ঢাকা মেট্রো' : 'ঢাকার বাইরে'}
                              </span>
                            </td>

                            {/* Items Preview */}
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    {item.image && (
                                      <img 
                                        src={item.image} 
                                        alt={item.name?.bn || item.name} 
                                        onError={(e) => { e.target.src = '/images/products/shirt-black-model.jpg'; }}
                                        className="w-7 h-8 object-cover rounded border border-slate-200 shrink-0" 
                                      />
                                    )}
                                    <div className="text-[11px] leading-tight">
                                      <span className="font-semibold text-slate-800">{item.name?.bn || item.name}</span>
                                      <span className="text-slate-500 ml-1">
                                        ({item.color}, {item.size}) x{item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Collection Bill */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <p className="font-mono font-black text-sm text-slate-900">
                                ৳{order.pricing.grandTotal}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {order.pricing.deliveryFee === 0 ? 'ফ্রি ডেলিভারি' : `চার্জ: ৳${order.pricing.deliveryFee}`}
                              </p>
                            </td>

                            {/* Payment */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                order.payment.method === 'cod' 
                                  ? 'bg-slate-100 text-slate-700' 
                                  : order.payment.method === 'bkash' 
                                    ? 'bg-pink-100 text-[#E2136E]' 
                                    : 'bg-amber-100 text-[#F7941D]'
                              }`}>
                                {order.payment.method === 'cod' ? 'COD (বাকি)' : order.payment.method}
                              </span>
                              {order.payment.trxId && order.payment.trxId !== 'N/A' && (
                                <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                                  Trx: {order.payment.trxId}
                                </p>
                              )}
                            </td>

                            {/* Status Dropdown */}
                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className={`text-xs font-bold rounded px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                                  statusLabels[order.status]?.color || 'bg-slate-100'
                                }`}
                              >
                                <option value="pending">⏳ অপেক্ষমাণ (Pending)</option>
                                <option value="confirmed">📞 নিশ্চিত (Confirmed)</option>
                                <option value="processing">📦 প্যাকিং (Packaging)</option>
                                <option value="shipped">🚚 কুরিয়ারে (In Transit)</option>
                                <option value="delivered">✅ ডেলিভার্ড (Delivered)</option>
                                <option value="cancelled">❌ বাতিল (Cancelled)</option>
                              </select>
                              {order.courier?.trackingCode && (
                                <p className="text-[10px] text-slate-500 font-mono mt-1">
                                  {order.courier.trackingCode}
                                </p>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                
                                {/* View Details Modal */}
                                <button
                                  onClick={() => setSelectedOrderId(order.id)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                                  title="ইনভয়েস ও বিস্তারিত দেখুন"
                                >
                                  <Eye size={14} />
                                </button>

                                {/* Copy for Steadfast/Pathao */}
                                <button
                                  onClick={(e) => handleQuickCopyCourier(order, e)}
                                  className={`p-1.5 rounded transition-colors ${
                                    copiedOrderId === order.id
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                                  }`}
                                  title="Steadfast বা Pathao-তে এন্ট্রি করার জন্য তথ্য কপি করুন"
                                >
                                  {copiedOrderId === order.id ? <Check size={14} /> : <Copy size={14} />}
                                </button>

                                {/* WhatsApp direct */}
                                <a
                                  href={`https://wa.me/88${order.customer.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                                    `আসসালামু আলাইকুম ${order.customer.name}, ARDO Premium Menswear থেকে আপনার অর্ডার #${order.id} টি নিশ্চিত করতে যোগাযোগ করা হয়েছে।`
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded transition-colors"
                                  title="হোয়াটসঅ্যাপ মেসেজ"
                                >
                                  <MessageSquare size={14} />
                                </a>

                                {/* Delete */}
                                <button
                                  onClick={() => {
                                    if (confirm(`অর্ডার ${order.id} মুছে ফেলতে চান?`)) {
                                      deleteOrder(order.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="অর্ডার মুছুন"
                                >
                                  <Trash2 size={14} />
                                </button>

                              </div>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB: DASHBOARD ANALYTICS                                         */}
          {/* ================================================================ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">সর্বমোট বিক্রয়</span>
                    <DollarSign size={18} className="text-emerald-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 font-mono">
                    ৳{stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    আজকের বিক্রয়: <span className="font-bold text-emerald-700">৳{stats.todayRevenue.toLocaleString()}</span>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">মোট অর্ডার</span>
                    <Package size={18} className="text-blue-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-900">{stats.totalOrders}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    আজকে নতুন: <span className="font-bold text-blue-700">{stats.todayOrders} টি</span>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">কনফার্মেশন বাকি</span>
                    <Clock size={18} className="text-amber-600" />
                  </div>
                  <p className="text-3xl font-black text-amber-600">{stats.pendingOrders}</p>
                  <p className="text-xs text-slate-500 mt-2">গ্রাহককে কল দেওয়া প্রয়োজন</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">ডেলিভারি সাফল্য</span>
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  </div>
                  <p className="text-3xl font-black text-emerald-700">{stats.deliveredOrders}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    সাকসেস রেট: <span className="font-bold">{stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%</span>
                  </p>
                </div>
              </div>

              {/* Analytics Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Payment Breakdown */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <DollarSign size={16} className="text-ardo-gold" />
                    পেমেন্ট মেথড অনুপাত
                  </h3>
                  <div className="space-y-4">
                    {['cod', 'bkash', 'nagad'].map(m => {
                      const count = orders.filter(o => o.payment.method === m).length;
                      const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                      return (
                        <div key={m} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{m === 'cod' ? 'Cash on Delivery' : m.toUpperCase()}</span>
                            <span>{count} টি ({pct}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${m === 'cod' ? 'bg-slate-700' : m === 'bkash' ? 'bg-[#E2136E]' : 'bg-[#F7941D]'}`} 
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Zone Breakdown */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-ardo-gold" />
                    ডেলিভারি এলাকা
                  </h3>
                  <div className="space-y-4">
                    {['dhaka', 'outside_dhaka'].map(z => {
                      const count = orders.filter(o => o.customer.district === z).length;
                      const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                      return (
                        <div key={z} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{z === 'dhaka' ? 'ঢাকার ভেতরে (মেট্রো)' : 'ঢাকার বাইরে (সারাদেশ)'}</span>
                            <span>{count} টি ({pct}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB: CUSTOMERS DIRECTORY                                         */}
          {/* ================================================================ */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">গ্রাহক তালিকা (Customer Directory)</h3>
                  <p className="text-xs text-slate-500">আপনার ব্র্যান্ডের নিয়মিত কাস্টমারদের ডাটাবেস ও হিস্ট্রি।</p>
                </div>
                <span className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg font-bold">
                  মোট গ্রাহক: {customersList.length} জন
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">গ্রাহক</th>
                      <th className="py-3 px-4">মোবাইল নম্বর</th>
                      <th className="py-3 px-4">ঠিকানা</th>
                      <th className="py-3 px-4 text-center">অর্ডার সংখ্যা</th>
                      <th className="py-3 px-4 text-right">সর্বমোট কেনাকাটা</th>
                      <th className="py-3 px-4 text-right">যোগাযোগ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customersList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-slate-400">
                          <Users size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                          <p className="text-sm font-semibold text-slate-700">এখনো কোনো গ্রাহকের তথ্য নেই</p>
                          <p className="text-xs text-slate-400 mt-1">কাস্টমারদের অর্ডার আসার সাথে সাথে এখানে তাদের হিস্ট্রি যুক্ত হবে।</p>
                        </td>
                      </tr>
                    ) : (
                      customersList.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{c.phone}</td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{c.address}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">{c.ordersCount} টি</td>
                        <td className="py-3 px-4 text-right font-mono font-black text-emerald-700">৳{c.totalSpent.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a href={`tel:${c.phone}`} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700" title="কল দিন">
                              <Phone size={13} />
                            </a>
                            <a href={`https://wa.me/88${c.phone.replace(/^0/, '')}`} target="_blank" rel="noreferrer" className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded" title="হোয়াটসঅ্যাপ">
                              <MessageSquare size={13} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB: PRODUCTS & INVENTORY                                        */}
          {/* ================================================================ */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Top Banner & Header */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Tag size={18} className="text-ardo-gold" />
                    <span>পণ্য ও ইনভেন্টরি ম্যানেজমেন্ট (Product Catalog)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    আপনার শপের সকল পাঞ্জাবি ও শার্ট কালেকশন পরিচালনা করুন, নতুন পোশাক যুক্ত করুন অথবা যেকোনো পণ্য ডিলিট করুন।
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      setProductToEdit(null);
                      setIsProductModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all border border-ardo-gold/30 hover:border-ardo-gold"
                  >
                    <Plus size={16} className="text-ardo-gold" />
                    <span>+ নতুন পণ্য যুক্ত করুন</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Toolbar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Search */}
                  <div className="relative w-full sm:w-72">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="পণ্যের নাম বা আইডি দিয়ে খুঁজুন..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                    />
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Category & Stock Filters + View Toggle */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none"
                    >
                      <option value="all">সকল কালেকশন</option>
                      <option value="panjabi">প্রিমিয়াম পাঞ্জাবি</option>
                      <option value="shirt">ফরমাল শার্ট</option>
                    </select>

                    <select
                      value={productStockFilter}
                      onChange={(e) => setProductStockFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none"
                    >
                      <option value="all">সকল স্টক স্ট্যাটাস</option>
                      <option value="in_stock">স্টকে আছে</option>
                      <option value="out_of_stock">স্টক শেষ (Sold Out)</option>
                    </select>

                    {/* View Switcher */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button
                        onClick={() => setProductViewMode('grid')}
                        className={`p-1.5 rounded text-xs transition-colors ${
                          productViewMode === 'grid' 
                            ? 'bg-white text-slate-900 shadow-sm font-bold' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="গ্রিড ভিউ"
                      >
                        <LayoutGrid size={14} />
                      </button>
                      <button
                        onClick={() => setProductViewMode('table')}
                        className={`p-1.5 rounded text-xs transition-colors ${
                          productViewMode === 'table' 
                            ? 'bg-white text-slate-900 shadow-sm font-bold' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="টেবিল ভিউ"
                      >
                        <List size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub-counter */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>মোট পণ্য: <strong className="text-slate-800 font-mono">{products.length}টি</strong> | প্রদর্শিত হচ্ছে: <strong className="text-slate-800 font-mono">{filteredProductsList.length}টি</strong></span>
                  {filteredProductsList.length !== products.length && (
                    <button
                      onClick={() => {
                        setProductSearch('');
                        setProductCategoryFilter('all');
                        setProductStockFilter('all');
                      }}
                      className="text-ardo-gold hover:underline font-semibold"
                    >
                      ফিল্টার রিসেট করুন
                    </button>
                  )}
                </div>
              </div>

              {/* Products Display (Grid or Table) */}
              {filteredProductsList.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                  <Tag size={40} className="mx-auto mb-3 opacity-40 text-slate-400" />
                  <h4 className="text-base font-bold text-slate-800">কোনো পণ্য পাওয়া যায়নি</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    আপনার সার্চ কিওয়ার্ড পরিবর্তন করুন অথবা আপনার শপে নতুন কোনো পণ্য যুক্ত করুন।
                  </p>
                  <button
                    onClick={() => {
                      setProductToEdit(null);
                      setIsProductModalOpen(true);
                    }}
                    className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>নতুন পণ্য যুক্ত করুন</span>
                  </button>
                </div>
              ) : productViewMode === 'grid' ? (
                /* GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProductsList.map(prod => (
                    <div 
                      key={prod.id} 
                      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
                    >
                      <div>
                        {/* Image & Overlays */}
                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                          <img 
                            src={prod.image || prod.colors?.[0]?.image || '/images/products/shirt-black-model.jpg'} 
                            alt={prod.name?.bn} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = '/images/products/shirt-black-model.jpg'; }}
                          />

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 bg-slate-900/90 text-white font-bold text-[10px] uppercase tracking-wider rounded border border-ardo-gold/40 shadow-sm">
                              {prod.category === 'shirt' ? 'ফরমাল শার্ট' : 'প্রিমিয়াম পাঞ্জাবি'}
                            </span>
                            {prod.badge && (
                              <span className="px-2 py-0.5 bg-ardo-gold text-slate-950 font-bold text-[10px] rounded shadow-sm">
                                {prod.badge.bn}
                              </span>
                            )}
                          </div>

                          {/* Stock Status Badge */}
                          {prod.isOutOfStock && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="px-3.5 py-1.5 bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-lg">
                                স্টক আউট (SOLD OUT)
                              </span>
                            </div>
                          )}

                          {/* Quick Action Overlay (View on site) */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openProductModal(prod)}
                              className="p-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-lg shadow transition-colors"
                              title="সাইটে প্রিভিউ দেখুন"
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                              <span className="font-mono">ID: #{prod.id}</span>
                              <span className="capitalize">{prod.category}</span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{prod.name?.bn}</h4>
                            <p className="text-xs text-slate-500 font-serif italic line-clamp-1">{prod.name?.en}</p>
                          </div>

                          {/* Color Swatches */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-slate-500">কালার ({prod.colors?.length || 0}):</span>
                              <div className="flex items-center gap-1">
                                {prod.colors?.map((col, idx) => (
                                  <span 
                                    key={col.id || idx} 
                                    className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs" 
                                    style={{ backgroundColor: col.hex || '#18181B' }} 
                                    title={col.name?.bn || col.name} 
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Sizes */}
                            <div className="text-[10px] text-slate-500 font-mono">
                              সাইজ: {prod.sizes?.join(', ')}
                            </div>
                          </div>

                          {/* Pricing & Stock status */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div>
                              <span className="font-mono text-base font-black text-slate-900">৳{prod.price?.toLocaleString()}</span>
                              {prod.originalPrice && prod.originalPrice > prod.price && (
                                <span className="font-mono text-xs text-slate-400 line-through ml-2">৳{prod.originalPrice?.toLocaleString()}</span>
                              )}
                            </div>

                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              prod.isOutOfStock ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {prod.isOutOfStock ? 'স্টক শেষ' : 'স্টকে আছে'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                        <div className="flex items-center gap-2 pt-3">
                          {/* Edit button */}
                          <button
                            onClick={() => {
                              setProductToEdit(prod);
                              setIsProductModalOpen(true);
                            }}
                            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                            title="সম্পূর্ণ তথ্য এডিট করুন"
                          >
                            <Edit3 size={14} />
                            <span>এডিট করুন</span>
                          </button>

                          {/* Stock Toggle Button */}
                          <button
                            onClick={() => {
                              updateProduct(prod.id, { isOutOfStock: !prod.isOutOfStock });
                            }}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors border ${
                              prod.isOutOfStock 
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                                : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                            }`}
                            title={prod.isOutOfStock ? 'পণ্যটি স্টকে ফিরিয়ে আনুন' : 'পণ্যটি স্টক আউট করুন'}
                          >
                            {prod.isOutOfStock ? 'ইন-স্টক' : 'স্টক আউট'}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              if (window.confirm(`আপনি কি নিশ্চিতভাবে "${prod.name?.bn}" পণ্যটি আপনার শপ থেকে ডিলিট করতে চান?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors"
                            title="পণ্য ডিলিট করুন"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* TABLE VIEW */
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3.5 px-4">ছবি ও নাম</th>
                          <th className="py-3.5 px-4">ক্যাটাগরি</th>
                          <th className="py-3.5 px-4">কালার ভ্যারিয়েন্ট</th>
                          <th className="py-3.5 px-4">সাইজ</th>
                          <th className="py-3.5 px-4 text-right">মূল্য (৳)</th>
                          <th className="py-3.5 px-4 text-center">স্টক স্ট্যাটাস</th>
                          <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProductsList.map(prod => (
                          <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                            {/* Product Image & Name */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                  <img 
                                    src={prod.image || prod.colors?.[0]?.image || '/images/products/shirt-black-model.jpg'} 
                                    alt={prod.name?.bn} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = '/images/products/shirt-black-model.jpg'; }}
                                  />
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block">{prod.name?.bn}</span>
                                  <span className="text-[11px] text-slate-500 italic block">{prod.name?.en}</span>
                                  <span className="font-mono text-[10px] text-slate-400">ID: #{prod.id}</span>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-[10px] rounded border border-slate-200">
                                {prod.category === 'shirt' ? 'ফরমাল শার্ট' : 'প্রিমিয়াম পাঞ্জাবি'}
                              </span>
                            </td>

                            {/* Colors */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                {prod.colors?.map((col, idx) => (
                                  <span 
                                    key={col.id || idx} 
                                    className="w-3.5 h-3.5 rounded-full border border-black/30" 
                                    style={{ backgroundColor: col.hex }} 
                                    title={col.name?.bn} 
                                  />
                                ))}
                                <span className="text-[11px] text-slate-500 ml-1">({prod.colors?.length || 0})</span>
                              </div>
                            </td>

                            {/* Sizes */}
                            <td className="py-3 px-4 font-mono text-slate-600">
                              {prod.sizes?.join(', ')}
                            </td>

                            {/* Price */}
                            <td className="py-3 px-4 text-right">
                              <span className="font-mono font-bold text-slate-900 block">৳{prod.price?.toLocaleString()}</span>
                              {prod.originalPrice && (
                                <span className="font-mono text-[10px] text-slate-400 line-through">৳{prod.originalPrice?.toLocaleString()}</span>
                              )}
                            </td>

                            {/* Stock Status */}
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => updateProduct(prod.id, { isOutOfStock: !prod.isOutOfStock })}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                                  prod.isOutOfStock
                                    ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                }`}
                              >
                                {prod.isOutOfStock ? 'স্টক শেষ' : 'স্টকে আছে'}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openProductModal(prod)}
                                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded"
                                  title="প্রিভিউ"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    setProductToEdit(prod);
                                    setIsProductModalOpen(true);
                                  }}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold"
                                  title="এডিট"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`আপনি কি নিশ্চিতভাবে "${prod.name?.bn}" ডিলিট করতে চান?`)) {
                                      deleteProduct(prod.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                  title="ডিলিট"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB: COURIER & LOGISTICS                                         */}
          {/* ================================================================ */}
          {activeTab === 'courier' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">কুরিয়ার লজিস্টিকস (Steadfast & Pathao)</h3>
                  <p className="text-xs text-slate-500">
                    এখানে আপনি পার্সেলের জন্য কুরিয়ার ডেটা সরাসরি কপি বা বাল্ক CSV ডাউনলোড করতে পারবেন।
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Download size={14} />
                  <span>কুরিয়ার শিট ডাউনলোড (Excel/CSV)</span>
                </button>
              </div>

              {/* Courier Instruction Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                    Steadfast Courier পার্সেল এন্ট্রি নিয়ম:
                  </div>
                  <p className="text-slate-600">
                    Steadfast Merchant পোর্টালে ঢুকে "Single Order Entry"-তে প্রতিটি অর্ডারের পাশের <strong className="text-emerald-700">"কুরিয়ার কপি"</strong> বাটনে চাপলেই গ্রাহকের নাম, মোবাইল, পুরো ঠিকানা এবং ক্যাশ কালেকশন পরিমাণ স্বয়ংক্রিয়ভাবে ক্লিপবোর্ডে কপি হয়ে যাবে।
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
                    বাল্ক আপলোড (Bulk CSV Upload):
                  </div>
                  <p className="text-slate-600">
                    একসাথে ১০-২০টি পার্সেল এন্ট্রি করতে উপরের "কুরিয়ার শিট ডাউনলোড" বাটন থেকে CSV ফাইল ডাউনলোড করে সরাসরি কুরিয়ার পোর্টালে Import/Upload করে দিন।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB: MOBILE NOTIFICATIONS & TELEGRAM ALERTS                      */}
          {/* ================================================================ */}
          {activeTab === 'notifications' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">রিয়েল-টাইম মোবাইল নোটিফিকেশন</h3>
                    <p className="text-xs text-slate-500">গ্রাহক ওয়েবসাইটে অর্ডার দেওয়া মাত্রই আপনার ফোনে তাৎক্ষণিক নোটিফিকেশন মেসেজ আসবে।</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                  <p className="font-bold text-slate-800">টেলিগ্রাম বট কীভাবে কানেক্ট করবেন (১ মিনিট সময় লাগবে):</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>টেলিগ্রামে গিয়ে সার্চ করুন <code className="bg-slate-200 px-1 py-0.5 rounded">@BotFather</code> এবং <code className="bg-slate-200 px-1 py-0.5 rounded">/newbot</code> লিখে একটি ফ্রি বট তৈরি করুন।</li>
                    <li>বট তৈরির পর প্রাপ্ত <strong className="text-slate-900">Bot Token</strong> টি নিচে পেস্ট করুন।</li>
                    <li>এরপর টেলিগ্রামে <code className="bg-slate-200 px-1 py-0.5 rounded">@userinfobot</code> এ স্টার্ট চেপে আপনার নিজের <strong className="text-slate-900">Chat ID</strong> নম্বরটি কপি করে নিচে বসান।</li>
                  </ol>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Telegram Bot Token:</label>
                    <input
                      type="text"
                      placeholder="e.g. 7192834012:AAH9bK2-ExampleToken"
                      value={settingsForm.telegramBotToken}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, telegramBotToken: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Telegram Chat ID:</label>
                    <input
                      type="text"
                      placeholder="e.g. 192837465"
                      value={settingsForm.telegramChatId}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, telegramChatId: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleTestTelegram}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
                    >
                      <Send size={14} />
                      <span>টেস্ট মেসেজ পাঠান</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition-colors"
                    >
                      টোকেন সংরক্ষণ করুন
                    </button>
                  </div>

                  {telegramTestStatus && (
                    <p className="p-3 bg-slate-100 rounded border border-slate-200 font-semibold text-xs text-slate-800">
                      {telegramTestStatus}
                    </p>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB: SETTINGS                                                    */}
          {/* ================================================================ */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Settings size={18} className="text-ardo-gold" />
                  স্টোর ও পেমেন্ট কনফিগারেশন
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  ক্যাশ অন ডেলিভারি চার্জ, বিকাশ/নগদ নম্বর এবং সিকিউরিটি পিন নিয়ন্ত্রণ করুন।
                </p>

                <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
                  
                  {/* Delivery Charges */}
                  <div className="space-y-3 pb-6 border-b border-slate-200">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Truck size={14} className="text-ardo-gold" />
                      ডেলিভারি চার্জ নির্ধারণ
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">ঢাকার ভেতরে ডেলিভারি চার্জ (৳):</label>
                        <input
                          type="number"
                          value={settingsForm.deliveryDhaka}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, deliveryDhaka: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">ঢাকার বাইরে ডেলিভারি চার্জ (৳):</label>
                        <input
                          type="number"
                          value={settingsForm.deliveryOutside}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, deliveryOutside: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">ফ্রি ডেলিভারি মিনিমাম বিল (৳):</label>
                        <input
                          type="number"
                          value={settingsForm.freeDeliveryThreshold}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, freeDeliveryThreshold: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Numbers */}
                  <div className="space-y-3 pb-6 border-b border-slate-200">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <DollarSign size={14} className="text-ardo-gold" />
                      মোবাইল ব্যাংকিং অ্যাকাউন্ট নম্বরসমূহ
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">বিকাশ পার্সোনাল / মার্চেন্ট নম্বর:</label>
                        <input
                          type="text"
                          value={settingsForm.bkashNumber}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, bkashNumber: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">নগদ পার্সোনাল / মার্চেন্ট নম্বর:</label>
                        <input
                          type="text"
                          value={settingsForm.nagadNumber}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, nagadNumber: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Support & Admin PIN */}
                  <div className="space-y-3 pb-6 border-b border-slate-200">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Shield size={14} className="text-ardo-gold" />
                      সাপোর্ট ও সিকিউরিটি
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">হোয়াটসঅ্যাপ সাপোর্ট নম্বর (যেমন: 8801700000000):</label>
                        <input
                          type="text"
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">অ্যাডমিন সিক্রেট পিন / পাসওয়ার্ড:</label>
                        <input
                          type="text"
                          value={settingsForm.adminPin}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, adminPin: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">নিরাপত্তা প্রশ্ন (পাসওয়ার্ড ভুলে গেলে):</label>
                        <input
                          type="text"
                          value={settingsForm.securityQuestion}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, securityQuestion: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">নিরাপত্তা প্রশ্নের গোপন উত্তর:</label>
                        <input
                          type="text"
                          value={settingsForm.securityAnswer}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, securityAnswer: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Announcement Bar */}
                  <div className="space-y-3 pb-6 border-b border-slate-200">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-ardo-gold" />
                      শীর্ষ নোটিস টেক্সট
                    </h4>
                    <input
                      type="text"
                      value={settingsForm.announcementBn}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, announcementBn: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md"
                    >
                      সেটিংস সংরক্ষণ করুন
                    </button>

                    {settingsSaved && (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
                        <Check size={14} />
                        সফলভাবে সংরক্ষিত হয়েছে!
                      </span>
                    )}
                  </div>

                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Order Details & Printable Invoice Modal */}
      <OrderDetailsModal
        order={activeOrder}
        isOpen={Boolean(activeOrder)}
        onClose={() => setSelectedOrderId(null)}
        onUpdateStatus={updateOrderStatus}
        onUpdateCourier={updateOrderCourier}
      />

      {/* Product Add / Edit Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSaved={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
      />

    </div>
  );
};
