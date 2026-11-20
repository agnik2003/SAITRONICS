'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('darina@saitronics.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('saitronics-user', JSON.stringify({ email, name: 'Darina V.', role: 'customer' }));
    toast.success('Welcome back to Saitronics!', {
      style: { background: '#111111', color: '#FFFFFF', border: '1px solid #E50924' },
    });
    router.push('/account');
  };

  return (
    <div className="bg-[#090909] text-white min-h-[85vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-[#111111] border border-white/[0.08] rounded-[4px] p-8 sm:p-10 relative overflow-hidden">
        
        {/* Subtle Ambient Red Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial-red opacity-50 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-[#E50924] to-[#B90820] rounded-[2px] flex items-center justify-center">
              <span className="font-heading font-black text-white text-base">S</span>
            </div>
            <span className="font-heading font-bold text-lg text-white">SAI<span className="text-[#E50924]">TRONICS</span></span>
          </div>

          <h1 className="font-heading text-2xl font-black text-white">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-[#858585] mt-1 mb-8 font-sans">
            Access your order history, saved wishlist, and showroom privileges.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#858585] block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#161616] border border-white/[0.08] rounded-[4px] text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#858585] block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#161616] border border-white/[0.08] rounded-[4px] text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#858585]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#E50924]" />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:text-white uppercase tracking-wider text-[10px]">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-[#858585] mt-6 font-sans">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#FF3048] font-bold hover:underline">
              Create One
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
