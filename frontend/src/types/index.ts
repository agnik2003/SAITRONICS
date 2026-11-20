export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  angle: 'front' | 'back' | 'side' | 'camera' | 'detail' | 'lifestyle' | 'box';
  colorName?: string;
  isPrimary?: boolean;
}

export interface ColorVariant {
  name: string;
  hex: string;
  images?: ProductImage[];
  imageIds?: string[];
  stockCount?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  sku: string;
  stockCount: number;
}

export interface StockAdjustment {
  id: string;
  date: string;
  change: number;
  reason: 'Restock' | 'Correction' | 'Damaged' | 'Returned' | 'Order Placed' | 'Order Cancelled' | string;
  resultingQuantity: number;
  note?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: 'smartphones' | 'laptops' | 'tablets' | 'accessories' | 'smartwatches' | 'audio' | string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  lowStockThreshold?: number;
  status?: 'published' | 'draft' | 'archived';
  taxNote?: string;
  description: string;
  shortDescription: string;
  features: string[];
  highlights?: string[];
  specifications: Record<string, string>;
  images: ProductImage[];
  colorVariants?: ColorVariant[];
  variants?: ProductVariant[];
  storageVariants?: string[];
  badge?: 'new' | 'sale' | 'hot' | 'bestseller';
  isNewLaunch?: boolean;
  newLaunchDate?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isPremiumAudio?: boolean;
  showInHero?: boolean;
  heroSlideOrder?: number;
  collection?: 'flagship' | 'everyday' | 'audio' | 'smart-living' | 'accessories' | string;
  collectionOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  stockAdjustments?: StockAdjustment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
  variantId?: string;
}

export interface OrderTimelineEvent {
  id: string;
  date: string;
  time: string;
  status: string;
  title: string;
  description: string;
}

export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: CartItem[];
  total: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  isNew?: boolean;
  couponCode?: string;
  couponDiscount?: number;
  trackingNumber?: string;
  courierName?: string;
  internalNotes?: string;
  timeline?: OrderTimelineEvent[];
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  description?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'hidden';
  verifiedPurchase?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  productCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  country?: string;
  founded?: number;
  isActive: boolean;
  order: number;
  productCount?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate?: string;
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  brand: string;
  title: string;
  highlight: string;
  subtitle: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  slug: string;
  image: string;
  badgeDisplay: string;
  badgeCamera: string;
  specs: string[];
  buttonText?: string;
  buttonLink?: string;
  glowColor?: string;
  stageTilt?: { x: number; y: number };
  callout?: { label: string; text: string; anchor?: 'camera' | 'screen' | 'side' };
  isActive: boolean;
  order: number;
}

export interface FeaturedCollection {
  id: string;
  key: 'flagship' | 'everyday' | 'audio' | 'smart-living' | 'accessories';
  title: string;
  description: string;
  image: string;
  productIds: string[];
  order: number;
  isVisible: boolean;
}

export interface SiteContent {
  announcementBar: {
    text: string;
    link?: string;
    isVisible: boolean;
  };
  heroSlides: HeroSlide[];
  sectionsVisibility: {
    announcementBar: boolean;
    hero: boolean;
    trustServices: boolean;
    categories: boolean;
    newLaunches: boolean;
    collections: boolean;
    bestsellers: boolean;
    audioBanner: boolean;
    showroom: boolean;
  };
  newLaunchesHeading: {
    title: string;
    subtitle: string;
    label: string;
    productIds: string[];
  };
  featuredCollections: FeaturedCollection[];
  bestsellersHeading: {
    title: string;
    subtitle: string;
    productIds: string[];
  };
  audioBanner: {
    title: string;
    subtitle: string;
    highlight: string;
    link: string;
    specs: string[];
  };
  promoBlock: {
    title: string;
    desc: string;
    phone: string;
    location: string;
  };
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  hours: string;
  mapsDirectionsUrl: string;
  currencySymbol: string;
  currencyCode: string;
  defaultLowStockThreshold: number;
  orderIdPrefix: string;
  adminId: string;
  adminPassword: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface AdminSession {
  isAuthenticated: boolean;
  username: string | null;
  loginTimestamp: string | null;
}
