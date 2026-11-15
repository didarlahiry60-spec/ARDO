import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { products as baseProducts } from '../data/content';

const CartContext = createContext();

const defaultSettings = {
  deliveryDhaka: 80,
  deliveryOutside: 130,
  freeDeliveryThreshold: 5000,
  bkashNumber: "01700-000000",
  nagadNumber: "01800-000000",
  whatsappNumber: "8801700000000",
  adminPin: "didar1122",
  telegramBotToken: "",
  telegramChatId: "",
  announcementText: {
    bn: "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি | ঢাকার ভেতরে ৮০৳, বাইরে ১৩০৳",
    en: "Cash on Delivery All Over Bangladesh | Dhaka 80৳, Outside 130৳"
  }
};

export const CartProvider = ({ children }) => {
  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ardo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lang, setLang] = useState('bn'); // 'bn' | 'en'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [sizeChartCategory, setSizeChartCategory] = useState('panjabi');
  const [deliveryLocation, setDeliveryLocation] = useState('dhaka'); // 'dhaka' | 'outside_dhaka'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Orders State (Synced with Backend API & persistent database)
  const [orders, setOrders] = useState([]);
  const [storeSettings, setStoreSettings] = useState(defaultSettings);
  const [productsList, setProductsList] = useState(baseProducts);

  // Fetch initial data from Server Backend API
  const refreshFromServer = async () => {
    try {
      const [resOrders, resSettings, resProducts] = await Promise.all([
        fetch('/api/orders').then(r => r.ok ? r.json() : null),
        fetch('/api/settings').then(r => r.ok ? r.json() : null),
        fetch('/api/products').then(r => r.ok ? r.json() : null)
      ]);

      if (resOrders && Array.isArray(resOrders)) setOrders(resOrders);
      if (resSettings && typeof resSettings === 'object') setStoreSettings(resSettings);
      if (resProducts && Array.isArray(resProducts) && resProducts.length > 0) {
        setProductsList(resProducts);
      }
    } catch (e) {
      console.warn('Backend API fetch error, using local fallback:', e);
    }
  };

  useEffect(() => {
    refreshFromServer();
    // Poll orders every 15 seconds so admin gets new orders automatically without refresh
    const interval = setInterval(refreshFromServer, 15000);
    return () => clearInterval(interval);
  }, []);

  // Admin View State - strictly derived from URL path or hash
  const checkIsAdmin = () => {
    if (typeof window === 'undefined') return false;
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    return pathname === '/admin' || pathname.startsWith('/admin/') || pathname.endsWith('/admin') || pathname.includes('/admin') || hash === '#admin';
  };

  const [isAdminOpen, setIsAdminOpenState] = useState(checkIsAdmin);

  const setIsAdminOpen = (open) => {
    setIsAdminOpenState(open);
    if (typeof window !== 'undefined') {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
      if (open) {
        try {
          window.history.pushState(null, '', cleanBase + 'admin');
        } catch (e) {
          window.location.hash = 'admin';
        }
      } else {
        try {
          window.history.pushState(null, '', cleanBase);
        } catch (e) {
          window.location.hash = '';
        }
      }
    }
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminOpenState(checkIsAdmin());
    };
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Persist cart locally
  useEffect(() => {
    try {
      localStorage.setItem('ardo_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Dynamic Products List from Database
  const products = productsList;

  const addToCart = (product, size, color) => {
    const chosenSize = size || '40';
    const chosenColor = color || (product.colors && product.colors[0]?.name[lang]) || 'Standard';

    setCart(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        item.size === chosenSize && 
        item.color === chosenColor
      );
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id && item.size === chosenSize && item.color === chosenColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size: chosenSize, color: chosenColor, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const buyNow = (product, size, color) => {
    const chosenSize = size || '40';
    const chosenColor = color || (product.colors && product.colors[0]?.name[lang]) || 'Standard';

    setCart(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        item.size === chosenSize && 
        item.color === chosenColor
      );
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id && item.size === chosenSize && item.color === chosenColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size: chosenSize, color: chosenColor, quantity: 1 }];
    });

    if (activeProductModal) {
      setActiveProductModal(null);
    }
    setIsCheckoutOpen(true);
  };

  const removeFromCart = (productId, size, color) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === productId && item.size === size && item.color === color)
    ));
  };

  const updateQuantity = (productId, size, color, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.size === size && item.color === color) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const openSizeChart = (category = 'panjabi') => {
    setSizeChartCategory(category);
    setIsSizeChartOpen(true);
  };

  const openProductModal = (product) => {
    setActiveProductModal(product);
  };

  const closeProductModal = () => {
    setActiveProductModal(null);
  };

  // ==========================================================================
  // REAL BACKEND ORDER MANAGEMENT API CALLS
  // ==========================================================================
  const createOrder = async (orderData) => {
    const newOrderId = 'ARDO-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: orderData.customer.name,
        phone: orderData.customer.phone,
        address: orderData.customer.address,
        district: orderData.customer.district || 'dhaka',
        note: orderData.customer.note || ''
      },
      items: orderData.items.map(item => {
        const matchingColor = item.product.colors?.find(
          c => c.name.bn === item.color || c.name.en === item.color
        );
        return {
          id: `${item.product.id}-${item.color}-${item.size}`,
          productId: item.product.id,
          name: item.product.name,
          color: item.color,
          colorCode: matchingColor?.hex || '#888',
          size: item.size,
          quantity: item.quantity,
          price: item.product.price,
          image: matchingColor?.image || item.product.image
        };
      }),
      pricing: {
        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee,
        grandTotal: orderData.grandTotal
      },
      payment: {
        method: orderData.paymentMethod, // 'cod' | 'bkash' | 'nagad'
        trxId: orderData.bkashTrxId || 'N/A',
        status: orderData.paymentMethod === 'cod' ? 'unpaid' : 'paid'
      },
      status: 'pending',
      courier: {
        provider: 'Steadfast Courier',
        trackingCode: ''
      }
    };

    // Optimistic local update
    setOrders(prev => [newOrder, ...prev]);

    // Send POST to server API
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (err) {
      console.error('Error saving order to backend API:', err);
    }

    return newOrderId;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const updateOrderCourier = async (orderId, courierData) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, courier: { ...o.courier, ...courierData } } : o));
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courier: courierData })
      });
    } catch (err) {
      console.error('Error updating courier info:', err);
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const resetOrdersToSeed = async () => {
    setOrders(initialOrders);
    try {
      await fetch('/api/orders/reset', { method: 'POST' });
    } catch (err) {
      console.error('Error resetting orders:', err);
    }
  };

  // Product CRUD Operations
  const createProduct = async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProductsList(prev => [data.product, ...prev]);
        return data.product;
      }
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      // Optimistic update
      setProductsList(prev => prev.map(p => String(p.id) === String(productId) ? { ...p, ...updates } : p));
      
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProductsList(prev => prev.map(p => String(p.id) === String(productId) ? data.product : p));
        return data.product;
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setProductsList(prev => prev.filter(p => String(p.id) !== String(productId)));
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error('Error deleting product:', err);
      return false;
    }
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dataUrl: reader.result,
              filename: file.name
            })
          });
          const data = await res.json();
          if (data.success && data.url) {
            resolve(data.url);
          } else {
            reject(new Error(data.error || 'Upload failed'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const updateProductOverride = async (productId, updates) => {
    return updateProduct(productId, updates);
  };

  const updateStoreSettings = async (newSettings) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  const deliveryFee = subtotal >= (storeSettings.freeDeliveryThreshold || 5000) 
    ? 0 
    : (deliveryLocation === 'dhaka' 
        ? (storeSettings.deliveryDhaka || 80) 
        : (storeSettings.deliveryOutside || 130));

  const grandTotal = subtotal + (cart.length > 0 ? deliveryFee : 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      buyNow,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      subtotal,
      deliveryFee,
      grandTotal,
      deliveryLocation,
      setDeliveryLocation,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isSizeChartOpen,
      setIsSizeChartOpen,
      activeProductModal,
      openProductModal,
      closeProductModal,
      sizeChartCategory,
      openSizeChart,
      lang,
      setLang,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      // Orders & Store Admin Management
      orders,
      createOrder,
      updateOrderStatus,
      updateOrderCourier,
      deleteOrder,
      resetOrdersToSeed,
      refreshFromServer,
      products,
      createProduct,
      updateProduct,
      deleteProduct,
      uploadImage,
      updateProductOverride,
      storeSettings,
      updateStoreSettings,
      isAdminOpen,
      setIsAdminOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
