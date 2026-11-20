interface BadgeProps {
  type: 'new' | 'sale' | 'hot' | 'bestseller';
}

const config = {
  new: { label: 'New Launch', className: 'bg-[#E50924] text-white border-none shadow-sm' },
  sale: { label: 'Special Offer', className: 'bg-[#B90820] text-white border-none' },
  hot: { label: 'Flagship', className: 'bg-[#191919] text-[#FF3048] border border-[#E50924]/40' },
  bestseller: { label: 'Top Choice', className: 'bg-white text-[#090909] font-black' },
};

export default function Badge({ type }: BadgeProps) {
  const item = config[type] || config.new;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-[0.14em] ${item.className}`}>
      {item.label}
    </span>
  );
}
