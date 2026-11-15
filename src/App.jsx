import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryCards } from './components/CategoryCards';
import { ProductGrid } from './components/ProductGrid';
import { BrandStory } from './components/BrandStory';
import { WhyArdo } from './components/WhyArdo';
import { Lookbook } from './components/Lookbook';
import { Reviews } from './components/Reviews';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SizeChartModal } from './components/SizeChartModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminDashboard } from './components/admin/AdminDashboard';

export function AppContent() {
  const { isAdminOpen } = useCart();

  if (isAdminOpen) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-ardo-ivory flex flex-col font-sans selection:bg-ardo-gold selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <CategoryCards />
        <ProductGrid />
        <BrandStory />
        <WhyArdo />
        <Lookbook />
        <Reviews />
      </main>
      <Footer />
      
      {/* Overlays & Portals */}
      <ProductDetailsModal />
      <CartDrawer />
      <CheckoutModal />
      <SizeChartModal />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
