'use client';

import React, { useState } from 'react';
import { useAdminSessionStore } from '@/store/adminSessionStore';
import { useProductStore } from '@/store/productStore';
import { Product } from '@/types';

import AdminLogin from '@/components/admin/AdminLogin';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';

// Modular Tabs
import DashboardTab from '@/components/admin/tabs/DashboardTab';
import ProductsTab from '@/components/admin/tabs/ProductsTab';
import ProductEditorDrawer from '@/components/admin/tabs/ProductEditorDrawer';
import CategoriesTab from '@/components/admin/tabs/CategoriesTab';
import BrandsTab from '@/components/admin/tabs/BrandsTab';
import InventoryTab from '@/components/admin/tabs/InventoryTab';
import OrdersTab from '@/components/admin/tabs/OrdersTab';
import CustomersTab from '@/components/admin/tabs/CustomersTab';
import CouponsTab from '@/components/admin/tabs/CouponsTab';
import ReviewsTab from '@/components/admin/tabs/ReviewsTab';
import WebContentTab from '@/components/admin/tabs/WebContentTab';
import ReportsTab from '@/components/admin/tabs/ReportsTab';
import SettingsTab from '@/components/admin/tabs/SettingsTab';

export default function AdminPage() {
  const isAuthenticated = useAdminSessionStore((state) => state.isAuthenticated);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Product Editor Drawer State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // If unauthenticated, display the login gate
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleOpenEditor = (prod?: Product) => {
    setEditingProduct(prod || null);
    setEditorOpen(true);
  };

  const handleSaveProduct = (saved: Product) => {
    if (editingProduct) {
      updateProduct(saved.id, saved);
    } else {
      addProduct(saved);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex">
      {/* 1. Admin Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setMobileSidebarOpen(false);
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Control Header */}
        <AdminTopBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenMobile={() => setMobileSidebarOpen(true)}
          searchTerm={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Dynamic Tab Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardTab
              onNavigateTab={setActiveTab}
              onOpenProductEditor={() => handleOpenEditor()}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              onOpenEditor={handleOpenEditor}
              searchTerm={globalSearch}
            />
          )}

          {activeTab === 'categories' && <CategoriesTab />}

          {activeTab === 'brands' && <BrandsTab />}

          {activeTab === 'inventory' && <InventoryTab />}

          {activeTab === 'orders' && (
            <OrdersTab searchTerm={globalSearch} />
          )}

          {activeTab === 'customers' && <CustomersTab />}

          {activeTab === 'coupons' && <CouponsTab />}

          {activeTab === 'reviews' && <ReviewsTab />}

          {activeTab === 'content' && <WebContentTab />}

          {activeTab === 'reports' && <ReportsTab />}

          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>

      {/* 3. Slide-out 9-Tab Product Editor Drawer */}
      <ProductEditorDrawer
        product={editingProduct}
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSaved={handleSaveProduct}
      />
    </div>
  );
}
