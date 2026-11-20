import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#090909] text-white px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-[#111111] border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-radial-red opacity-20 blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-[#E50924]/10 text-[#E50924] border border-[#E50924]/20 flex items-center justify-center mx-auto shadow-lg shadow-[#E50924]/15">
          <Compass className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF3048]">
            404 &bull; Page Not Found
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Device Route Not Found
          </h1>
          <p className="text-xs text-[#8E8E93] mt-2 leading-relaxed font-sans">
            The electronics showroom page or flagship model you requested does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-primary py-2.5 px-5 text-xs font-semibold tracking-wider inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Showroom
          </Link>
          <Link
            href="/products"
            className="btn-secondary py-2.5 px-5 text-xs font-semibold tracking-wider inline-flex items-center gap-2"
          >
            Explore Catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
