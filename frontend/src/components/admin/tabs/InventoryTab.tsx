'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Warehouse, Plus, Minus, History, Download, AlertTriangle, 
  CheckCircle2, X, Search, Sliders, CheckSquare, Square, 
  ArrowUpDown, RefreshCw 
} from 'lucide-react';
import { Product, StockAdjustment } from '@/types';
import { useProductStore } from '@/store/productStore';
import toast from 'react-hot-toast';

export default function InventoryTab() {
  const products = useProductStore((state) => state.products);
  const adjustStock = useProductStore((state) => state.adjustStock);
  const updateProduct = useProductStore((state) => state.updateProduct);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  
  // Stock Adjustment Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState<StockAdjustment['reason']>('Restock');
  const [adjustNote, setAdjustNote] = useState('');

  // History Log Modal
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);

  // Bulk Edit
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStockVal, setBulkStockVal] = useState<number>(10);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  const filtered = products.filter((p) => {
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.brand.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    const threshold = p.lowStockThreshold || 5;
    if (filterStatus === 'out_of_stock' && p.stockCount > 0) return false;
    if (filterStatus === 'low_stock' && (p.stockCount === 0 || p.stockCount > threshold)) return false;
    if (filterStatus === 'in_stock' && p.stockCount === 0) return false;
    return true;
  });

  // Inline Quick Adjust (+1 / -1)
  const handleQuickDelta = (p: Product, delta: number) => {
    const newQty = Math.max(0, p.stockCount + delta);
    if (newQty === p.stockCount) return;
    adjustStock(p.id, delta, delta > 0 ? 'Restock' : 'Correction', `Quick inline adjustment (${delta > 0 ? '+1' : '-1'})`);
    toast.success(`${p.name} count updated to ${newQty}.`);
  };

  // Inline Direct Number Change
  const handleInlineInput = (p: Product, newTotalStr: string) => {
    const newTotal = parseInt(newTotalStr, 10);
    if (isNaN(newTotal) || newTotal < 0) return;
    const delta = newTotal - p.stockCount;
    if (delta === 0) return;
    adjustStock(p.id, delta, 'Correction', 'Direct inline count override');
    toast.success(`${p.name} updated to ${newTotal}.`);
  };

  // Submit Detailed Adjustment Dialog
  const handlePerformAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    // Amount can be positive or negative depending on reason
    const multiplier = (adjustReason === 'Damaged' || adjustReason === 'Correction' && adjustAmount < 0) ? -1 : 1;
    const finalChange = adjustAmount * multiplier;

    adjustStock(
      selectedProduct.id,
      finalChange,
      adjustReason,
      adjustNote.trim() || undefined
    );

    toast.success(`Inventory adjusted for ${selectedProduct.name}.`);
    setSelectedProduct(null);
    setAdjustAmount(5);
    setAdjustNote('');
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Product ID', 'Name', 'Brand', 'Category', 'Selling Price', 'Stock Count', 'Low Stock Threshold', 'Status'];
    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.brand}"`,
      `"${p.category}"`,
      p.price,
      p.stockCount,
      p.lowStockThreshold || 5,
      p.stockCount === 0 ? 'Out of Stock' : p.stockCount <= (p.lowStockThreshold || 5) ? 'Low Stock' : 'In Stock'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Saitronics_Inventory_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Inventory report exported as CSV.');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Showroom Real-Time Inventory
          </h2>
          <p className="text-xs text-[#717171]">
            Inline count controls, automated low-stock warnings, and historical adjustment logs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/[0.08] transition-all"
          >
            <Download className="w-4 h-4 text-[#A1A1A1]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inventory items..."
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E50924]"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-[#141414] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
          >
            <option value="all">All Levels</option>
            <option value="in_stock">In Stock (&gt;5)</option>
            <option value="low_stock">Low Stock (&le;5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>
        </div>

        <div className="text-xs text-[#717171]">
          Showing <strong className="text-white font-bold">{filtered.length}</strong> showroom devices
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#121212] text-[#717171] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Device / SKU</th>
                <th className="py-3.5 px-4 font-semibold">Brand / Category</th>
                <th className="py-3.5 px-4 font-semibold">Unit Price</th>
                <th className="py-3.5 px-4 font-semibold">Current Count</th>
                <th className="py-3.5 px-4 font-semibold">Threshold</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((p) => {
                const threshold = p.lowStockThreshold || 5;
                const isOut = p.stockCount === 0;
                const isLow = p.stockCount > 0 && p.stockCount <= threshold;

                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-[#080808] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                          <Image
                            src={p.images[0]?.url || '/products/apple/iphone-15-pro-max/front.webp'}
                            alt={p.name}
                            fill
                            className="object-contain p-1"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate max-w-[220px]">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-[#666] font-mono block">
                            SKU: {p.variants?.[0]?.sku || p.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-white font-medium block">{p.brand}</span>
                      <span className="text-[10px] text-[#717171] uppercase">{p.category}</span>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-white">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>

                    {/* Quick Inline Stock Editing */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickDelta(p, -1)}
                          disabled={p.stockCount === 0}
                          className="w-7 h-7 rounded-lg bg-[#181818] hover:bg-white/[0.1] text-white disabled:opacity-20 flex items-center justify-center transition-colors border border-white/[0.06]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="number"
                          value={p.stockCount}
                          onChange={(e) => handleInlineInput(p, e.target.value)}
                          className="w-16 bg-[#141414] border border-white/[0.08] rounded-lg py-1 text-center font-mono font-bold text-xs text-white focus:outline-none focus:border-[#E50924]"
                        />

                        <button
                          type="button"
                          onClick={() => handleQuickDelta(p, 1)}
                          className="w-7 h-7 rounded-lg bg-[#181818] hover:bg-white/[0.1] text-white flex items-center justify-center transition-colors border border-white/[0.06]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Low Stock Threshold Inline */}
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={threshold}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                          updateProduct(p.id, { lowStockThreshold: val });
                        }}
                        className="w-14 bg-[#141414] border border-white/[0.08] rounded-lg py-1 text-center font-mono text-xs text-[#888] focus:text-white focus:outline-none focus:border-[#E50924]"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isOut
                            ? 'bg-[#E50924]/20 text-[#FF4D4F] border border-[#E50924]/30'
                            : isLow
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="px-2.5 py-1 rounded-lg bg-[#E50924]/10 hover:bg-[#E50924]/20 text-[#E50924] border border-[#E50924]/20 text-xs font-semibold transition-colors"
                        >
                          Adjust
                        </button>

                        <button
                          onClick={() => setHistoryProduct(p)}
                          title="Adjustment Audit Log"
                          className="p-1.5 rounded-lg text-[#717171] hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Dialog */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md bg-[#121212] border border-white/[0.1] rounded-2xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  Adjust Inventory
                </h3>
                <p className="text-xs text-[#888]">{selectedProduct.name}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-[#666] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePerformAdjustment} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#181818] border border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-[#A1A1A1]">Current Showroom Stock:</span>
                <span className="text-sm font-black text-white font-mono">
                  {selectedProduct.stockCount} units
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Adjustment Reason
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                >
                  <option value="Restock">Restock (Received shipment)</option>
                  <option value="Correction">Correction (Inventory count discrepancy)</option>
                  <option value="Damaged">Damaged / Defective (Removed from floor)</option>
                  <option value="Returned">Customer Return (Restocked)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Quantity Units
                </label>
                <input
                  type="number"
                  min="1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Math.max(1, Number(e.target.value)))}
                  required
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Internal Showroom Note (Optional)
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="e.g. Verified by showroom manager"
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] text-xs font-semibold text-[#A1A1A1] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-xs font-semibold text-white"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Log Modal */}
      {historyProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setHistoryProduct(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-[#121212] border border-white/[0.1] rounded-2xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                  Stock Adjustment Audit Log
                </h3>
                <p className="text-xs text-[#888]">{historyProduct.name}</p>
              </div>
              <button
                onClick={() => setHistoryProduct(null)}
                className="text-[#666] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2.5 custom-scrollbar">
              {!historyProduct.stockAdjustments || historyProduct.stockAdjustments.length === 0 ? (
                <p className="text-xs text-[#717171] text-center py-6">
                  No adjustments recorded for this device yet.
                </p>
              ) : (
                historyProduct.stockAdjustments.map((adj) => (
                  <div
                    key={adj.id}
                    className="p-3 rounded-xl bg-[#161616] border border-white/[0.04] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{adj.reason}</span>
                        <span className="text-[10px] text-[#666]">{adj.date}</span>
                      </div>
                      {adj.note && (
                        <p className="text-[11px] text-[#888] mt-0.5">{adj.note}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-mono font-bold block ${
                          adj.change >= 0 ? 'text-emerald-400' : 'text-[#FF4D4F]'
                        }`}
                      >
                        {adj.change >= 0 ? `+${adj.change}` : adj.change} units
                      </span>
                      <span className="text-[10px] text-[#666]">
                        Result: {adj.resultingQuantity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
