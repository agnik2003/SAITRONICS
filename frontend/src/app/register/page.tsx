'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('saitronics-user', JSON.stringify({ email: form.email, name: form.name, role: 'customer' }));
    toast.success('Account created successfully!', {
      style: { background: '#111111', color: '#FFFFFF', border: '1px solid #E50924' },
    });
    router.push('/account');
  };

  return (
    <div className="bg-[#090909] text-white min-h-[85vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-[#111111] border border-white/[0.08] rounded-[4px] p-8 sm:p-10 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial-red opacity-50 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-[#E50924] to-[#B90820] rounded-[2px] flex items-center justify-center">
              <span className="font-heading font-black text-white text-base">S</span>
            </div>
            <span className="font-heading font-bold text-lg text-white">SAI<span className="text-[#E50924]">TRONICS</span></span>
          </div>

          <h1 className="font-heading text-2xl font-black text-white">
            Create Member Account
          </h1>
          <p className="text-xs text-[#858585] mt-1 mb-6 font-sans">
            Register to receive exclusive launch invitations and express showroom servicing.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#858585] block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Darina V."
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#161616] border border-white/[0.08] rounded-[4px] text-xs text-white focus:outline-none focus:border-[#E50924]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#858585] block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="darina@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#161616] border border-white/[0.08] rounded-[4px] text-xs text-white focus:outline-none focus:border-[#E50924]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#858585] block mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="09831250575"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#161616] border border-white/[0.08] rounded-[4px] text-xs text-white focus:outline-none focus:border-[#E50924] tabular-nums"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#858585] block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 bg-[#161616] border border-white/[0.08] rounded-[4px] text-xs text-white focus:outline-none focus:border-[#E50924]"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
            >
              Register Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-[#858585] mt-6 font-sans">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF3048] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
