import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductFormModal = ({ isOpen, onClose, productToEdit, onSaved }) => {
  const { createProduct, updateProduct, uploadImage } = useCart();

  const isEditing = Boolean(productToEdit);

  // Form State
  const [formData, setFormData] = useState({
    nameBn: '',
    nameEn: '',
    category: 'panjabi',
    price: '',
    originalPrice: '',
    badgeType: 'new',
    badgeTextBn: 'নতুন আগমন',
    badgeTextEn: 'NEW',
    fabricBn: '১০০% ফাইন কটন লিনেন',
    fabricEn: '100% Fine Cotton Linen',
    fitBn: 'টেইলর্ড স্লিম ফিট',
    fitEn: 'Tailored Slim Fit',
    sizes: ['38', '40', '42', '44'],
    image: '',
    descriptionBn: '',
    descriptionEn: '',
    isOutOfStock: false,
    colors: [
      {
        id: 'c1',
        nameBn: 'মূল কালার',
        nameEn: 'Primary Color',
        hex: '#18181B',
        image: ''
      }
    ]
  });

  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [uploadingColorIdx, setUploadingColorIdx] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [newSizeInput, setNewSizeInput] = useState('');

  // Populate when editing
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nameBn: productToEdit.name?.bn || '',
        nameEn: productToEdit.name?.en || '',
        category: productToEdit.category || 'panjabi',
        price: productToEdit.price || '',
        originalPrice: productToEdit.originalPrice || '',
        badgeType: productToEdit.badge?.type || 'none',
        badgeTextBn: productToEdit.badge?.bn || '',
        badgeTextEn: productToEdit.badge?.en || '',
        fabricBn: productToEdit.fabric?.bn || '',
        fabricEn: productToEdit.fabric?.en || '',
        fitBn: productToEdit.fit?.bn || '',
        fitEn: productToEdit.fit?.en || '',
        sizes: productToEdit.sizes || ['38', '40', '42', '44'],
        image: productToEdit.image || '',
        descriptionBn: productToEdit.description?.bn || '',
        descriptionEn: productToEdit.description?.en || '',
        isOutOfStock: Boolean(productToEdit.isOutOfStock),
        colors: productToEdit.colors?.length > 0 ? productToEdit.colors.map((c, i) => ({
          id: c.id || `c_${i}`,
          nameBn: c.name?.bn || c.name || '',
          nameEn: c.name?.en || '',
          hex: c.hex || '#000000',
          image: c.image || ''
        })) : [
          {
            id: 'c1',
            nameBn: 'মূল কালার',
            nameEn: 'Primary Color',
            hex: '#18181B',
            image: productToEdit.image || ''
          }
        ]
      });
    } else {
      // Default blank form
      setFormData({
        nameBn: '',
        nameEn: '',
        category: 'panjabi',
        price: '',
        originalPrice: '',
        badgeType: 'new',
        badgeTextBn: 'নতুন আগমন',
        badgeTextEn: 'NEW',
        fabricBn: '১০০% ফাইন প্রিমিয়াম কটন',
        fabricEn: '100% Fine Premium Cotton',
        fitBn: 'টেইলর্ড স্লিম ফিট',
        fitEn: 'Tailored Slim Fit',
        sizes: ['38', '40', '42', '44'],
        image: '',
        descriptionBn: '',
        descriptionEn: '',
        isOutOfStock: false,
        colors: [
          {
            id: 'c1',
            nameBn: '',
            nameEn: '',
            hex: '#18181B',
            image: ''
          }
        ]
      });
    }
    setErrorMsg('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle Main Image Upload
  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingMain(true);
      setErrorMsg('');
      const uploadedUrl = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        image: uploadedUrl,
        // Also set first color image if empty
        colors: prev.colors.map((c, idx) => idx === 0 && !c.image ? { ...c, image: uploadedUrl } : c)
      }));
    } catch (err) {
      setErrorMsg('ছবি আপলোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsUploadingMain(false);
    }
  };

  // Handle Color Variant Image Upload
  const handleColorImageUpload = async (file, index) => {
    if (!file) return;
    try {
      setUploadingColorIdx(index);
      setErrorMsg('');
      const uploadedUrl = await uploadImage(file);
      setFormData(prev => {
        const nextColors = [...prev.colors];
        nextColors[index] = { ...nextColors[index], image: uploadedUrl };
        return {
          ...prev,
          colors: nextColors,
          // If main image is empty and this is the first color, also set main
          image: index === 0 && !prev.image ? uploadedUrl : prev.image
        };
      });
    } catch (err) {
      setErrorMsg('কালার ভেরিয়েন্টের ছবি আপলোড করতে সমস্যা হয়েছে।');
    } finally {
      setUploadingColorIdx(null);
    }
  };

  // Add Color Variant
  const handleAddColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          id: `c_${Date.now()}`,
          nameBn: '',
          nameEn: '',
          hex: '#25231F',
          image: ''
        }
      ]
    }));
  };

  // Remove Color Variant
  const handleRemoveColor = (index) => {
    if (formData.colors.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== index)
    }));
  };

  // Toggle Size
  const handleToggleSize = (size) => {
    setFormData(prev => {
      const exists = prev.sizes.includes(size);
      const nextSizes = exists ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: nextSizes };
    });
  };

  // Add Custom Size
  const handleAddCustomSize = (e) => {
    e.preventDefault();
    if (!newSizeInput.trim()) return;
    const clean = newSizeInput.trim();
    if (!formData.sizes.includes(clean)) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, clean] }));
    }
    setNewSizeInput('');
  };

  // Badge preset change
  const handleBadgeChange = (type) => {
    const presets = {
      new: { bn: 'নতুন আগমন', en: 'NEW' },
      bestseller: { bn: 'বেস্টসেলার', en: 'BESTSELLER' },
      exclusive: { bn: 'প্রিমিয়াম', en: 'EXCLUSIVE' },
      signature: { bn: 'সিগনেচার', en: 'SIGNATURE' },
      none: { bn: '', en: '' }
    };
    const chosen = presets[type] || { bn: '', en: '' };
    setFormData(prev => ({
      ...prev,
      badgeType: type,
      badgeTextBn: chosen.bn,
      badgeTextEn: chosen.en
    }));
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nameBn.trim()) {
      setErrorMsg('পণ্যের বাংলা নাম দেওয়া আবশ্যক।');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMsg('পণ্যের একটি সঠিক বিক্রয় মূল্য দিন।');
      return;
    }
    if (!formData.image && (!formData.colors[0] || !formData.colors[0].image)) {
      setErrorMsg('পণ্যটির অন্তত একটি প্রধান ছবি আপলোড করুন বা লিংক দিন।');
      return;
    }

    const payload = {
      name: {
        bn: formData.nameBn.trim(),
        en: formData.nameEn.trim() || formData.nameBn.trim()
      },
      category: formData.category,
      categoryLabel: {
        bn: formData.category === 'shirt' ? 'ফরমাল শার্ট' : 'প্রিমিয়াম পাঞ্জাবি',
        en: formData.category === 'shirt' ? 'Formal Shirt' : 'Premium Panjabi'
      },
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Math.round(Number(formData.price) * 1.15),
      badge: formData.badgeType !== 'none' ? {
        bn: formData.badgeTextBn || 'নতুন কালেকশন',
        en: formData.badgeTextEn || 'NEW',
        type: formData.badgeType
      } : null,
      image: formData.image || formData.colors[0]?.image,
      fabric: {
        bn: formData.fabricBn || '১০০% ফাইন ফেব্রিক',
        en: formData.fabricEn || '100% Fine Fabric'
      },
      fit: {
        bn: formData.fitBn || 'টেইলর্ড স্লিম ফিট',
        en: formData.fitEn || 'Tailored Slim Fit'
      },
      sizes: formData.sizes.length > 0 ? formData.sizes : ['38', '40', '42', '44'],
      colors: formData.colors.map((c, i) => ({
        id: c.id || `color_${i + 1}`,
        name: {
          bn: c.nameBn || `কালার ${i + 1}`,
          en: c.nameEn || `Color ${i + 1}`
        },
        hex: c.hex || '#18181B',
        image: c.image || formData.image
      })),
      description: {
        bn: formData.descriptionBn || 'ARDO-র আধুনিক কালেকশন। আরামদায়ক ও নিখুঁত ফিনিশিং।',
        en: formData.descriptionEn || 'Modern luxury collection crafted with exceptional comfort and finish.'
      },
      isOutOfStock: formData.isOutOfStock,
      isNew: formData.badgeType === 'new'
    };

    try {
      setIsSubmitting(true);
      if (isEditing) {
        await updateProduct(productToEdit.id, payload);
      } else {
        await createProduct(payload);
      }
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('পণ্য সংরক্ষণ করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ardo-gold/20 border border-ardo-gold/40 flex items-center justify-center text-ardo-gold font-bold">
              {isEditing ? '✏️' : '✨'}
            </div>
            <div>
              <h2 className="font-bold text-base text-white">
                {isEditing ? `পণ্য সম্পাদন: ${productToEdit.name?.bn}` : 'নতুন পণ্য যুক্ত করুন'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? 'পণ্যের নাম, ছবি, ভ্যারিয়েন্ট ও মূল্য পরিবর্তন করুন' : 'আপনার স্টোরে একটি নতুন পাঞ্জাবি বা শার্ট যুক্ত করুন'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-700">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <span>১. মৌলিক তথ্য ও পরিচয়</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পণ্যের নাম (বাংলা) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: সিগনেচার রয়েল জরি পাঞ্জাবি"
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পণ্যের নাম (English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Signature Royal Zari Panjabi"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  <option value="panjabi">প্রিমিয়াম পাঞ্জাবি (Panjabi)</option>
                  <option value="shirt">ফরমাল শার্ট (Formal Shirt)</option>
                </select>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাজ / হাইলাইট</label>
                <select
                  value={formData.badgeType}
                  onChange={(e) => handleBadgeChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  <option value="none">কোনো ব্যাজ নেই</option>
                  <option value="new">নতুন আগমন (NEW)</option>
                  <option value="bestseller">বেস্টসেলার (BESTSELLER)</option>
                  <option value="exclusive">প্রিমিয়াম (EXCLUSIVE)</option>
                  <option value="signature">সিগনেচার (SIGNATURE)</option>
                </select>
              </div>

              {/* Stock Status Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">স্টক স্ট্যাটাস</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isOutOfStock: !formData.isOutOfStock })}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    formData.isOutOfStock
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${formData.isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  {formData.isOutOfStock ? 'স্টক আউট (অর্ডার বন্ধ)' : 'স্টকে আছে (ইন-স্টক)'}
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Fabric */}
          <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              ২. মূল্য, ফেব্রিক ও মাপ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিক্রয় মূল্য (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="যেমন: ৩৪৫০"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  কাটা মূল্য / রেগুলার (৳)
                </label>
                <input
                  type="number"
                  placeholder="যেমন: ৩৯৫০ (ঐচ্ছিক)"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-500 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ফেব্রিক উপাদান</label>
                <input
                  type="text"
                  placeholder="১০০% কটন লিনেন"
                  value={formData.fabricBn}
                  onChange={(e) => setFormData({ ...formData, fabricBn: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ফিটিং ধরণ</label>
                <input
                  type="text"
                  placeholder="টেইলর্ড স্লিম ফিট"
                  value={formData.fitBn}
                  onChange={(e) => setFormData({ ...formData, fitBn: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            {/* Sizes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">উপলব্ধ সাইজসমূহ:</label>
              <div className="flex flex-wrap items-center gap-2">
                {['38', '40', '42', '44', '46', '48'].map((size) => {
                  const isChecked = formData.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleToggleSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        isChecked 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                          : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}

                {/* Custom size input */}
                <div className="flex items-center gap-1.5 ml-2">
                  <input
                    type="text"
                    placeholder="+ নতুন সাইজ"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    className="w-24 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSize(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-xs text-slate-700 font-bold"
                  >
                    যোগ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Main Product Image */}
          <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              ৩. পণ্যের প্রধান ডিসপ্লে ছবি (Main Image)
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Image Preview Box */}
              <div className="w-24 h-28 rounded-xl bg-white border border-slate-300 overflow-hidden flex items-center justify-center shrink-0 shadow-inner relative group">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <ImageIcon size={24} className="mx-auto mb-1 opacity-50" />
                    <span className="text-[10px] block">ছবি নেই</span>
                  </div>
                )}
                {isUploadingMain && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
                    আপলোড...
                  </div>
                )}
              </div>

              {/* Upload or URL input */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow">
                    <Upload size={14} />
                    <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleMainImageUpload}
                    />
                  </label>
                  <span className="text-xs text-slate-400">অথবা</span>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="ইমেজ URL লিংক পেস্ট করুন (যেমন: /images/products/shirt.jpg বা ওয়েব লিংক)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Color Variants */}
          <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  ৪. কালার ভ্যারিয়েন্ট ও ভ্যারিয়েন্ট ছবি ({formData.colors.length}টি)
                </h3>
                <p className="text-[11px] text-slate-400">
                  কাস্টমার কালার সোয়াচে ক্লিক করলে এই নির্দিষ্ট ছবিটি ওয়েবসাইটে বড় আকারে দেখতে পাবেন।
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 bg-ardo-gold hover:bg-ardo-gold-light text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus size={14} />
                <span>+ কালার যোগ করুন</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.colors.map((color, index) => (
                <div 
                  key={color.id || index}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Color Swatch / Color Picker */}
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => {
                          const hex = e.target.value;
                          setFormData(prev => {
                            const next = [...prev.colors];
                            next[index] = { ...next[index], hex };
                            return { ...prev, colors: next };
                          });
                        }}
                        className="w-8 h-8 rounded-full border border-slate-300 cursor-pointer overflow-hidden p-0"
                        title="কালার নির্বাচন করুন"
                      />
                      <input
                        type="text"
                        value={color.hex}
                        onChange={(e) => {
                          const hex = e.target.value;
                          setFormData(prev => {
                            const next = [...prev.colors];
                            next[index] = { ...next[index], hex };
                            return { ...prev, colors: next };
                          });
                        }}
                        className="w-20 font-mono text-[11px] bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700"
                        placeholder="#18181B"
                      />
                    </div>

                    {/* Color Name */}
                    <div className="flex-1 md:w-44">
                      <input
                        type="text"
                        placeholder="কালারের নাম (বাংলা)"
                        value={color.nameBn}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => {
                            const next = [...prev.colors];
                            next[index] = { ...next[index], nameBn: val };
                            return { ...prev, colors: next };
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Color Image Upload & Preview */}
                  <div className="flex items-center gap-2 w-full md:w-auto flex-1 justify-end">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                      {color.image ? (
                        <img src={color.image} alt={color.nameBn} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={16} className="text-slate-400" />
                      )}
                      {uploadingColorIdx === index && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[8px] font-bold">
                          ...
                        </div>
                      )}
                    </div>

                    <label className="cursor-pointer px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0">
                      <Upload size={12} />
                      <span>ছবি আপলোড</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleColorImageUpload(e.target.files?.[0], index)}
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="বা ছবির URL লিংক"
                      value={color.image}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => {
                          const next = [...prev.colors];
                          next[index] = { ...next[index], image: val };
                          return { ...prev, colors: next };
                        });
                      }}
                      className="flex-1 min-w-[140px] bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-600"
                    />

                    {/* Delete Color */}
                    {formData.colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(index)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors shrink-0"
                        title="এই কালার মুছে ফেলুন"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Description */}
          <div className="bg-slate-50/70 p-4.5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              ৫. পণ্যের বিস্তারিত বিবরণ (Description)
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                বিবরণ (বাংলা)
              </label>
              <textarea
                rows={3}
                placeholder="কাপড়ের বৈশিষ্ট্য, বোতামের ডিটেইলস এবং ব্যবহারের উপযুক্ত ক্ষেত্রসমূহ..."
                value={formData.descriptionBn}
                onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEditing ? 'পরিবর্তন সংরক্ষণ করুন' : 'নতুন পণ্যটি যুক্ত করুন'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
