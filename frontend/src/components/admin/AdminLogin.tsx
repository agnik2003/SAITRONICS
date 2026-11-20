'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdminSessionStore } from '@/store/adminSessionStore';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useAdminSessionStore((state) => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const success = login(adminId.trim(), password.trim());
      if (success) {
        toast.success('Admin authentication verified. Access granted.');
      } else {
        setError('Invalid administrative credentials. Use demo credentials.');
        toast.error('Authentication failed');
      }
      setIsLoading(false);
    }, 400);
  };

  const handleUseDemo = () => {
    setAdminId('saitronics');
    setPassword('saitronics');
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E50924]/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1C1C1C] to-[#0D0D0D] border border-white/[0.08] shadow-2xl mb-4">
            <ShieldCheck className="w-7 h-7 text-[#E50924]" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl font-black tracking-[0.25em] text-white uppercase">SAITRONICS</span>
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-[#E50924]/15 text-[#E50924] border border-[#E50924]/30 rounded">
              CONTROL
            </span>
          </div>
          <p className="text-xs text-[#7A7A7A] uppercase tracking-wider font-medium">
            Flagship Retail Management Portal
          </p>
        </div>

        {/* Login Panel */}
        <div className="bg-[#0E0E0E] border border-white/[0.08] rounded-2xl p-7 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-[#E50924]/10 border border-[#E50924]/20 text-[#FF4D4F] text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#E50924]" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-[#A1A1A1] uppercase mb-2">
                Administrator Identifier
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#555]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="Enter admin ID"
                  required
                  autoFocus
                  className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#4A4A4A] focus:outline-none focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-[#A1A1A1] uppercase mb-2">
                Secure Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#555]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode"
                  required
                  className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#4A4A4A] focus:outline-none focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#E50924] hover:bg-[#C8081F] active:scale-[0.99] text-white font-semibold py-3.5 px-4 rounded-xl text-sm tracking-wide transition-all shadow-lg shadow-[#E50924]/20 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Discreet Demo Credential Hint */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#6E6E6E] mb-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Demo access credentials pre-configured:</span>
            </div>
            <button
              type="button"
              onClick={handleUseDemo}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/10 text-xs text-[#B5B5B5] transition-all"
            >
              <span className="font-mono text-white group-hover:text-[#E50924] transition-colors">
                saitronics
              </span>
              <span className="text-[#555]">/</span>
              <span className="font-mono text-white group-hover:text-[#E50924] transition-colors">
                saitronics
              </span>
              <span className="text-[10px] text-[#666] ml-1 uppercase tracking-wider font-semibold">
                (Click to autofill)
              </span>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-[#4A4A4A] mt-6 tracking-wide">
          Saitronics Luxury Retail Systems &copy; 2026. Authorized showroom access only.
        </p>
      </div>
    </div>
  );
}
