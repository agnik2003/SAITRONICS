'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    productInterest: 'Smartphones & Flagships',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please provide your name and phone number');
      return;
    }
    setSubmitted(true);
    toast.success('Inquiry submitted! Our Uttarpara showroom team will call you shortly.', {
      style: { background: '#111111', color: '#FFFFFF', border: '1px solid #E50924' },
    });
  };

  const googleMapsUrl = "https://www.google.com/maps/place/Saitronics+-+Uttarpara/@22.656358,88.3483971,17z/data=!3m1!4b1!4m6!3m5!1s0x39f89ce6bfffffe7:0xf9cc18239ca26bfa!8m2!3d22.656358!4d88.3483971!16s%2Fg%2F11r9ny3b0?entry=ttu&g_ep=EgoyMDI2MTExNS4wIKXMDSoASAFQAw%3D%3D";

  return (
    <div className="bg-[#090909] text-white min-h-screen py-10 px-4">
      <div className="container-custom">

        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/[0.08]">
          <Link href="/" className="p-2 bg-[#161616] border border-white/[0.08] rounded-[4px] hover:text-[#FF3048] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Saitronics Showroom & Contact
            </h1>
            <p className="text-xs text-[#858585] mt-0.5 font-sans">
              Visit our premier electronics retail experience center in Uttarpara, Hooghly
            </p>
          </div>
        </div>

        {/* Main Grid: Details & Map vs Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* LEFT: Showroom Location, Contact Info & Map (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Showroom Details Card */}
            <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <span className="text-[10px] text-[#FF3048] font-bold uppercase tracking-widest block">
                    Flagship Store
                  </span>
                  <h2 className="font-heading text-xl font-bold text-white mt-0.5">
                    Saitronics Uttarpara
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Open Today
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#858585] tracking-wider block">Showroom Address</span>
                  <p className="text-white font-medium flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#E50924] flex-shrink-0 mt-0.5" />
                    <span>58/3, New GT Road, Near College Bus Stop, Uttarpara, West Bengal – 712258</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#858585] tracking-wider block">Store Timings</span>
                  <p className="text-white font-medium flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#E50924] flex-shrink-0 mt-0.5" />
                    <span>Monday – Sunday: 10:00 AM – 9:00 PM (All 7 Days Open)</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#858585] tracking-wider block">Direct Phone Line</span>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#E50924] flex-shrink-0" />
                    <a href="tel:09831250575" className="text-[#FF3048] font-bold hover:underline tabular-nums">09831250575</a>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#858585] tracking-wider block">Customer Support</span>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#E50924] flex-shrink-0" />
                    <span className="text-[#B8B8B8]">support@saitronics.com</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="tel:09831250575"
                  className="btn-primary"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Showroom Now
                </a>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FF3048]" /> Open Google Maps Directions
                </a>
              </div>
            </div>

            {/* Embedded Interactive Google Map */}
            <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] overflow-hidden shadow-2xl">
              <div className="px-4 py-3 bg-[#161616] border-b border-white/[0.08] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E50924]" />
                  <span className="font-heading font-bold text-white text-[11px] tracking-wide uppercase">
                    Live Satellite & Street Location (Uttarpara)
                  </span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[#FF3048] hover:underline font-semibold uppercase tracking-wider"
                >
                  View on Google Maps ↗
                </a>
              </div>

              <div className="w-full h-[360px] sm:h-[400px] bg-[#141414]">
                <iframe
                  src="https://maps.google.com/maps?q=Saitronics+-+Uttarpara,+58/3,+New+GT+Road,+near+College+Bus+Stop,+Uttarpara,+West+Bengal+712258&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Saitronics Uttarpara Google Map"
                  className="w-full h-full filter contrast-[1.05]"
                />
              </div>
            </div>

          </div>

          {/* RIGHT: Quick Showroom Inquiry Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 sm:p-8 space-y-6 sticky top-24">
              <div>
                <span className="text-[10px] text-[#E50924] font-bold uppercase tracking-widest block">
                  Express Inquiry
                </span>
                <h2 className="font-heading text-lg font-bold text-white mt-0.5">
                  Request Demonstration / Stock Reservation
                </h2>
                <p className="text-xs text-[#858585] mt-1 font-sans">
                  Let us know what flagship model or audio gear you are looking for. We will have it ready for demo at our Uttarpara store.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-[#161616] border border-[#E50924]/30 rounded-[4px] text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#FF3048] mx-auto" />
                  <h3 className="font-heading font-bold text-base text-white">Inquiry Received</h3>
                  <p className="text-xs text-[#858585] font-sans">
                    Thank you, <span className="text-white font-semibold">{formData.name}</span>. Our store manager will call you at <span className="text-white font-semibold">{formData.phone}</span> with stock reservation details.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#FF3048] hover:underline font-bold uppercase tracking-wider pt-2 block mx-auto"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#858585] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sen"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#161616] border border-white/[0.08] rounded-[4px] text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#E50924]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#858585] block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 09831250575"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#161616] border border-white/[0.08] rounded-[4px] text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#E50924] tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#858585] block mb-1">
                      Product of Interest
                    </label>
                    <select
                      value={formData.productInterest}
                      onChange={e => setFormData({ ...formData, productInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#161616] border border-white/[0.08] rounded-[4px] text-xs text-white focus:outline-none focus:border-[#E50924]"
                    >
                      <option>Smartphones & Flagships</option>
                      <option>Huawei Mate 70 RS Ultimate Design</option>
                      <option>Apple iPhone 15 Pro Max</option>
                      <option>Samsung Galaxy S24 Ultra</option>
                      <option>MacBooks & OLED Laptops</option>
                      <option>Audiophile Headphones & Marshall Speakers</option>
                      <option>Smartwatches & GaN Fast Chargers</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#858585] block mb-1">
                      Message / Special Request
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify color variant, storage, or estimated visit timing..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#161616] border border-white/[0.08] rounded-[4px] text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#E50924]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Showroom Inquiry
                  </button>
                </form>
              )}

              <div className="pt-2 border-t border-white/[0.06] text-[11px] text-[#858585] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E50924] flex-shrink-0" />
                <span>Authorized retail warranty & factory sealed inventory guaranteed.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
