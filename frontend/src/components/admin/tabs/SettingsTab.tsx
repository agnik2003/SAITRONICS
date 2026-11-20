'use client';

import React, { useState } from 'react';
import { 
  Settings, Save, RotateCcw, Download, Upload, Trash2, 
  ShieldCheck, MapPin, Phone, Mail, Clock, ExternalLink, 
  AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { useStoreSettingsStore } from '@/store/storeSettingsStore';
import { 
  seedProducts, seedOrders, seedCategories, seedBrands, 
  seedCoupons, seedReviews, seedCustomers, seedSiteContent, 
  seedStoreSettings 
} from '@/data/seedData';
import { useOrderStore } from '@/store/orderStore';
import toast from 'react-hot-toast';

export default function SettingsTab() {
  const { settings, updateSettings, resetToSeed } = useStoreSettingsStore();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [hours, setHours] = useState(settings.hours);
  const [mapsDirectionsUrl, setMapsDirectionsUrl] = useState(settings.mapsDirectionsUrl);
  const [instagramUrl, setInstagramUrl] = useState(settings.socialLinks?.instagram || '');
  const [defaultLowStock, setDefaultLowStock] = useState(settings.defaultLowStockThreshold || 5);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName: storeName.trim(),
      tagline: tagline.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      hours: hours.trim(),
      mapsDirectionsUrl: mapsDirectionsUrl.trim(),
      socialLinks: {
        ...settings.socialLinks,
        instagram: instagramUrl.trim(),
      },
      defaultLowStockThreshold: defaultLowStock,
    });
    toast.success('Store settings saved and synchronized with storefront.');
  };

  // Full Reset to Seed Data
  const handleFullReset = () => {
    if (
      confirm(
        'CAUTION: This will overwrite all products, categories, orders, customers, reviews and site content with the authentic Saitronics Uttarpara seed dataset. Proceed?'
      )
    ) {
      try {
        localStorage.setItem('saitronics-admin-products', JSON.stringify({ state: { products: seedProducts }, version: 1 }));
        localStorage.setItem('saitronics-orders', JSON.stringify({ state: { orders: seedOrders }, version: 1 }));
        localStorage.setItem('saitronics-taxonomy', JSON.stringify({ state: { categories: seedCategories, brands: seedBrands }, version: 1 }));
        localStorage.setItem('saitronics-coupons', JSON.stringify({ state: { coupons: seedCoupons }, version: 1 }));
        localStorage.setItem('saitronics-reviews', JSON.stringify({ state: { reviews: seedReviews }, version: 1 }));
        localStorage.setItem('saitronics-customers', JSON.stringify({ state: { customers: seedCustomers }, version: 1 }));
        localStorage.setItem('saitronics-site-content', JSON.stringify({ state: { content: seedSiteContent }, version: 1 }));
        localStorage.setItem('saitronics-store-settings', JSON.stringify({ state: { settings: seedStoreSettings }, version: 1 }));
        
        // Dispatch storage event to trigger immediate rehydration across all stores
        window.dispatchEvent(new Event('storage'));
        toast.success('System state successfully restored to clean seed dataset.');
        setTimeout(() => window.location.reload(), 500);
      } catch (err) {
        toast.error('Could not reset data: storage access failed.');
      }
    }
  };

  // Export Complete System Backup (JSON)
  const handleExportJSON = () => {
    const backup: Record<string, any> = {};
    const keys = [
      'saitronics-admin-products',
      'saitronics-orders',
      'saitronics-taxonomy',
      'saitronics-coupons',
      'saitronics-reviews',
      'saitronics-customers',
      'saitronics-site-content',
      'saitronics-store-settings'
    ];

    keys.forEach((k) => {
      try {
        const val = localStorage.getItem(k);
        if (val) backup[k] = JSON.parse(val);
      } catch (e) {}
    });

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Saitronics_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Complete system JSON backup downloaded.');
  };

  // Import JSON Backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed !== 'object') throw new Error('Invalid JSON format');

        Object.entries(parsed).forEach(([key, val]) => {
          if (key.startsWith('saitronics-')) {
            localStorage.setItem(key, JSON.stringify(val));
          }
        });

        window.dispatchEvent(new Event('storage'));
        toast.success('Backup imported successfully. Rehydrating system...');
        setTimeout(() => window.location.reload(), 600);
      } catch (err) {
        toast.error('Failed to parse backup file. Please ensure it is a valid JSON export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Clear orders only
  const handleClearOrders = () => {
    if (confirm('Clear all order records? This cannot be undone.')) {
      try {
        localStorage.setItem('saitronics-orders', JSON.stringify({ state: { orders: [] }, version: 1 }));
        window.dispatchEvent(new Event('storage'));
        toast.success('Order history cleared.');
      } catch (e) {
        toast.error('Could not clear orders.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Showroom & Storefront Configuration
          </h2>
          <p className="text-xs text-[#717171]">
            Physical showroom coordinates, working hours, and emergency data backup utilities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/[0.08] transition-all"
          >
            <Download className="w-4 h-4 text-[#A1A1A1]" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] space-y-5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Physical Showroom Coordinates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
              Showroom Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
              Brand Positioning Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
            Physical Showroom Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
              Showroom Contact Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
              Support Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
              Operating Hours
            </label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
              Google Maps Direction URL
            </label>
            <input
              type="text"
              value={mapsDirectionsUrl}
              onChange={(e) => setMapsDirectionsUrl(e.target.value)}
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
              Instagram Showcase URL
            </label>
            <input
              type="text"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/saitronics"
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
              Default Low-Stock Warning
            </label>
            <input
              type="number"
              value={defaultLowStock}
              onChange={(e) => setDefaultLowStock(Number(e.target.value))}
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#E50924]"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-white text-xs font-semibold shadow-lg shadow-[#E50924]/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Showroom Profile</span>
          </button>
        </div>
      </form>

      {/* Admin Demo Credentials Info Card */}
      <div className="p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#E50924]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Administrative Access Credentials
          </h3>
        </div>
        <p className="text-xs text-[#888]">
          Pre-configured for local evaluation and showroom demo sessions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
          <div className="p-3 rounded-xl bg-[#141414] border border-white/[0.04]">
            <span className="text-[10px] text-[#717171] uppercase block">Admin Identifier</span>
            <span className="font-mono text-xs font-bold text-white">saitronics</span>
          </div>

          <div className="p-3 rounded-xl bg-[#141414] border border-white/[0.04]">
            <span className="text-[10px] text-[#717171] uppercase block">Passcode</span>
            <span className="font-mono text-xs font-bold text-white">saitronics</span>
          </div>
        </div>
      </div>

      {/* Data Management & Emergency Reset Tools */}
      <div className="p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] space-y-4">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Data Backup & Showroom Factory Reset
          </h3>
          <p className="text-xs text-[#717171]">
            Manage client-side localStorage state, restore clean demo datasets, or clear test data
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Restore Seed Dataset */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.04] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-white block mb-1">
                Restore Clean Demo Dataset
              </span>
              <p className="text-[11px] text-[#888] mb-4">
                Re-seeds 25 verified devices, 15 realistic orders, and default categories.
              </p>
            </div>
            <button
              onClick={handleFullReset}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-[#E50924]/10 text-xs font-semibold text-white hover:text-[#E50924] border border-white/[0.06] hover:border-[#E50924]/30 transition-all text-center"
            >
              Reset to Factory Seed
            </button>
          </div>

          {/* Import JSON Backup */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.04] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-white block mb-1">
                Import System JSON Backup
              </span>
              <p className="text-[11px] text-[#888] mb-4">
                Upload a previously exported .json file to restore exact system state.
              </p>
            </div>
            <label className="w-full py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.06] transition-all text-center cursor-pointer block">
              <span>Upload Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>

          {/* Clear Orders */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.04] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-white block mb-1">
                Purge Test Orders
              </span>
              <p className="text-[11px] text-[#888] mb-4">
                Empty order queue for fresh test transactions while keeping catalog intact.
              </p>
            </div>
            <button
              onClick={handleClearOrders}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-[#FF4D4F]/10 text-xs font-semibold text-[#888] hover:text-[#FF4D4F] border border-white/[0.06] transition-all text-center"
            >
              Clear Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
