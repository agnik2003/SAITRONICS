import { 
  Product, Order, Category, Brand, Coupon, Review, 
  Customer, SiteContent, StoreSettings 
} from '@/types';
import { products as baseProducts } from './products';

// Default Demo Credentials
export const DEFAULT_ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID || 'saitronics';
export const DEFAULT_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'saitronics';

// Expand base products to 25 verified flagship devices
export const seedProducts: Product[] = [
  ...baseProducts.map(p => ({
    ...p,
    status: (p.status || 'published') as 'published' | 'draft' | 'archived',
    lowStockThreshold: p.lowStockThreshold || 5,
    taxNote: 'Inclusive of 18% GST with Official Brand Warranty',
    highlights: p.highlights || p.features?.slice(0, 4) || [],
    isNewLaunch: p.badge === 'new' || ['huawei-mate-70-rs', 'iphone-15-pro-max', 'samsung-galaxy-s24-ultra', 'xiaomi-14-ultra'].includes(p.id),
    isFeatured: ['huawei-mate-70-rs', 'iphone-15-pro-max', 'samsung-galaxy-s24-ultra', 'macbook-pro-14-m3', 'sony-wh1000xm5'].includes(p.id),
    isBestSeller: p.badge === 'bestseller' || ['iphone-15-pro-max', 'samsung-galaxy-s24-ultra', 'airpods-pro-2', 'macbook-pro-14-m3'].includes(p.id),
    isPremiumAudio: p.category === 'audio',
    showInHero: ['huawei-mate-70-rs', 'iphone-15-pro-max', 'samsung-galaxy-s24-ultra'].includes(p.id),
    heroSlideOrder: p.id === 'huawei-mate-70-rs' ? 1 : p.id === 'iphone-15-pro-max' ? 2 : p.id === 'samsung-galaxy-s24-ultra' ? 3 : undefined,
    collection: p.id.includes('iphone') || p.id.includes('mate') || p.id.includes('ultra') ? 'flagship' :
                p.category === 'audio' ? 'audio' :
                p.category === 'laptops' || p.category === 'tablets' ? 'everyday' :
                p.category === 'smartwatches' ? 'smart-living' : 'accessories',
    stockAdjustments: [
      {
        id: `adj-${p.id}-init`,
        date: '10 Nov 2026',
        change: p.stockCount,
        reason: 'Restock',
        resultingQuantity: p.stockCount,
        note: 'Showroom showroom opening inventory verification'
      }
    ],
    variants: (p.storageVariants || ['256GB', '512GB', '1TB']).map((v, i) => ({
      id: `${p.id}-v${i+1}`,
      name: v,
      price: p.price + (i * 10000),
      originalPrice: p.originalPrice ? p.originalPrice + (i * 12000) : undefined,
      sku: `${p.brand.substring(0,3).toUpperCase()}-${p.id.substring(0,6).toUpperCase()}-${v.replace(/\s+/g,'')}`,
      stockCount: Math.max(1, p.stockCount - (i * 2))
    }))
  })),

  // Additional 6 Flagship Models to exceed 24 items
  {
    id: 'samsung-galaxy-z-fold-6',
    name: 'Samsung Galaxy Z Fold 6',
    slug: 'samsung-galaxy-z-fold-6',
    brand: 'Samsung',
    category: 'smartphones',
    subCategory: 'Foldables',
    price: 164999,
    originalPrice: 179999,
    rating: 4.8,
    reviewCount: 38,
    inStock: true,
    stockCount: 8,
    lowStockThreshold: 4,
    status: 'published',
    taxNote: 'Inclusive of 18% GST',
    description: 'Ultra-thin titanium fold architecture powered by Snapdragon 8 Gen 3 for Galaxy, IP48 water resistance and dual Dynamic AMOLED 2X displays.',
    shortDescription: 'Snapdragon 8 Gen 3. Dual Dynamic AMOLED. S-Pen Fold Edition.',
    features: ['7.6" Main Dynamic AMOLED 2X', 'Armor Aluminum Frame', 'Galaxy AI Productivity Suite', 'Dual Periscope Zoom'],
    highlights: ['Ultra Light 239g Foldable', 'Integrated S-Pen Support', 'Ray Tracing Gaming Engine'],
    specifications: {
      'Main Display': '7.6-inch Dynamic AMOLED 2X (1-120Hz LTPO)',
      'Cover Screen': '6.3-inch Dynamic AMOLED 2X (2600 nits)',
      'Processor': 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
      'Battery': '4400 mAh Dual Cell'
    },
    images: [
      { id: 'zfold6-1', url: '/products/samsung/galaxy-s24-ultra/front.webp', alt: 'Samsung Galaxy Z Fold 6 Front View', angle: 'front', isPrimary: true },
      { id: 'zfold6-2', url: '/products/samsung/galaxy-s24-ultra/back.webp', alt: 'Samsung Galaxy Z Fold 6 Rear Panel', angle: 'back' }
    ],
    colorVariants: [
      { name: 'Silver Shadow', hex: '#C0C0C0' },
      { name: 'Navy Blue', hex: '#1C2951' }
    ],
    variants: [
      { id: 'zf6-256', name: '12GB + 256GB', price: 164999, sku: 'SAM-ZF6-256', stockCount: 5 },
      { id: 'zf6-512', name: '12GB + 512GB', price: 176999, sku: 'SAM-ZF6-512', stockCount: 3 }
    ],
    storageVariants: ['12GB + 256GB', '12GB + 512GB', '12GB + 1TB'],
    badge: 'new',
    isNewLaunch: true,
    isFeatured: true,
    collection: 'flagship',
    tags: ['Samsung', 'Foldable', '5G', 'Flagship']
  },
  {
    id: 'sony-wf1000xm5',
    name: 'Sony WF-1000XM5 True Wireless',
    slug: 'sony-wf1000xm5',
    brand: 'Sony',
    category: 'audio',
    subCategory: 'Earbuds',
    price: 23990,
    originalPrice: 29990,
    rating: 4.9,
    reviewCount: 94,
    inStock: true,
    stockCount: 16,
    lowStockThreshold: 5,
    status: 'published',
    taxNote: 'Inclusive of 18% GST',
    description: 'Industry leading active noise cancellation featuring dual processors V2 & QN2e, Dynamic Driver X, and AI voice pickup.',
    shortDescription: 'Dual Processor ANC. LDAC Hi-Res Audio. 24h Battery.',
    features: ['Integrated Processor V2 + HD Noise Cancelling QN2e', 'Dynamic Driver X 8.4mm', 'LDAC and DSEE Extreme', 'Multipoint Connection'],
    highlights: ['Best in Class Noise Cancelling', 'Glossy Ergonomic Polish', 'Bone Conduction Sensors'],
    specifications: {
      'Audio Driver': '8.4mm Dynamic Driver X',
      'Battery Life': '8h Earbuds + 16h Case (ANC ON)',
      'Codecs': 'SBC, AAC, LDAC, LC3'
    },
    images: [
      { id: 'wfxm5-1', url: '/products/apple/airpods-pro-2/front.webp', alt: 'Sony WF-1000XM5 Earbuds Front', angle: 'front', isPrimary: true }
    ],
    colorVariants: [
      { name: 'Black Velvet', hex: '#111111' },
      { name: 'Platinum Silver', hex: '#D1D5DB' }
    ],
    storageVariants: ['Standard Edition'],
    badge: 'hot',
    isPremiumAudio: true,
    collection: 'audio',
    tags: ['Sony', 'Audio', 'ANC', 'Earbuds']
  },
  {
    id: 'marshall-emberton-2',
    name: 'Marshall Emberton II Portable Bluetooth Speaker',
    slug: 'marshall-emberton-2',
    brand: 'Marshall',
    category: 'audio',
    subCategory: 'Speakers',
    price: 17499,
    originalPrice: 19999,
    rating: 4.8,
    reviewCount: 62,
    inStock: true,
    stockCount: 11,
    lowStockThreshold: 4,
    status: 'published',
    taxNote: 'Inclusive of 18% GST',
    description: 'Tough and resilient portable speaker delivering signature Marshall room-filling sound with 30+ hours of playback and IP67 dust/water resistance.',
    shortDescription: '30+ Hours Portable Playtime. True Stereophonic 360 Sound.',
    features: ['True Stereophonic multi-directional sound', '30+ hours portable playtime', 'IP67 dust and waterproof rating', 'Stack Mode pairing'],
    highlights: ['Rugged Iconic Design', 'Quick 20-min Charge = 4h Play', 'Brass Multi-Directional Knob'],
    specifications: {
      'Frequency Response': '60 Hz – 20 kHz',
      'Battery': '30+ hours (Li-ion)',
      'Water Resistance': 'IP67'
    },
    images: [
      { id: 'ember2-1', url: '/products/marshall/marshall-stanmore-3/front.webp', alt: 'Marshall Emberton II Speaker', angle: 'front', isPrimary: true }
    ],
    colorVariants: [
      { name: 'Black & Brass', hex: '#1C1917' },
      { name: 'Cream Vintage', hex: '#F5F5DC' }
    ],
    storageVariants: ['Standard Edition'],
    badge: 'bestseller',
    isPremiumAudio: true,
    collection: 'audio',
    tags: ['Marshall', 'Speaker', 'Bluetooth', 'Waterproof']
  },
  {
    id: 'apple-ipad-air-m2',
    name: 'Apple iPad Air 11" M2',
    slug: 'apple-ipad-air-m2',
    brand: 'Apple',
    category: 'tablets',
    subCategory: 'iPads',
    price: 59900,
    originalPrice: 64900,
    rating: 4.9,
    reviewCount: 78,
    inStock: true,
    stockCount: 14,
    lowStockThreshold: 5,
    status: 'published',
    taxNote: 'Inclusive of 18% GST',
    description: 'Supercharged by Apple M2 chip with 8-core CPU and 10-core GPU, Liquid Retina display, landscape 12MP front camera with Center Stage.',
    shortDescription: 'Apple M2 Chip. Liquid Retina Display. Touch ID.',
    features: ['Apple M2 Silicon with Neural Engine', '11-inch Liquid Retina Display with P3 Wide Color', 'Supports Apple Pencil Pro & Magic Keyboard'],
    highlights: ['All-Day Battery Life', 'Landscape Stereo Speakers', 'Sub-500g Lightweight Design'],
    specifications: {
      'Chipset': 'Apple M2 (8-core CPU, 10-core GPU)',
      'Display': '11-inch LED-backlit IPS (500 nits)',
      'Biometrics': 'Touch ID in Top Button'
    },
    images: [
      { id: 'ipair-1', url: '/products/apple/ipad-pro-13-m4/front.webp', alt: 'iPad Air 11 M2 Front', angle: 'front', isPrimary: true }
    ],
    colorVariants: [
      { name: 'Space Gray', hex: '#4B5563' },
      { name: 'Starlight', hex: '#E5E7EB' },
      { name: 'Purple', hex: '#D8B4FE' },
      { name: 'Blue', hex: '#93C5FD' }
    ],
    variants: [
      { id: 'air-128', name: '128GB Wi-Fi', price: 59900, sku: 'APP-AIRM2-128', stockCount: 8 },
      { id: 'air-256', name: '256GB Wi-Fi', price: 69900, sku: 'APP-AIRM2-256', stockCount: 6 }
    ],
    storageVariants: ['128GB Wi-Fi', '256GB Wi-Fi', '512GB Wi-Fi'],
    collection: 'everyday',
    tags: ['Apple', 'iPad', 'Tablet', 'M2']
  },
  {
    id: 'oneplus-watch-2',
    name: 'OnePlus Watch 2 Flagship Smartwatch',
    slug: 'oneplus-watch-2',
    brand: 'OnePlus',
    category: 'smartwatches',
    subCategory: 'Watches',
    price: 24999,
    originalPrice: 27999,
    rating: 4.7,
    reviewCount: 45,
    inStock: true,
    stockCount: 9,
    lowStockThreshold: 4,
    status: 'published',
    taxNote: 'Inclusive of 18% GST',
    description: 'Dual-Engine Architecture featuring Snapdragon W5 + BES2700 processors, Wear OS by Google, sapphire crystal glass and up to 100 hours of battery life.',
    shortDescription: 'Dual-Engine Architecture. Wear OS by Google. 100h Smart Battery.',
    features: ['100-hour Smart Mode battery life', 'Snapdragon W5 Gen 1 + BES2700 dual chipset', 'Sapphire Crystal & Stainless Steel', 'Dual-frequency GPS'],
    highlights: ['MIL-STD-810H Military Grade Durability', 'VOOC Fast Charging (10m = 1 Day)', 'Precision Heart & VO2 Max Sensor'],
    specifications: {
      'Display': '1.43-inch AMOLED (1000 nits)',
      'Battery': '500 mAh (100h in Smart Mode, 12 days Power Saver)',
      'Water Rating': '5ATM + IP68'
    },
    images: [
      { id: 'opw2-1', url: '/products/apple/apple-watch-ultra-2/display.webp', alt: 'OnePlus Watch 2 Sapphire Face', angle: 'front', isPrimary: true }
    ],
    colorVariants: [
      { name: 'Radiant Steel', hex: '#9CA3AF' },
      { name: 'Black Steel', hex: '#1F2937' }
    ],
    storageVariants: ['Standard 32GB Edition'],
    collection: 'smart-living',
    tags: ['OnePlus', 'Smartwatch', 'WearOS', 'AMOLED']
  },
  {
    id: 'asus-rog-phone-8-pro',
    name: 'ASUS ROG Phone 8 Pro Edition',
    slug: 'asus-rog-phone-8-pro',
    brand: 'Asus',
    category: 'smartphones',
    subCategory: 'Gaming',
    price: 94999,
    originalPrice: 104999,
    rating: 4.9,
    reviewCount: 31,
    inStock: true,
    stockCount: 5,
    lowStockThreshold: 3,
    status: 'published',
    taxNote: 'Inclusive of 18% GST',
    description: 'The definitive gaming powerhouse engineered with Snapdragon 8 Gen 3, AniMe Vision programmable mini-LED rear matrix, 165Hz AMOLED, and AirTrigger ultrasonic controls.',
    shortDescription: 'Snapdragon 8 Gen 3. 165Hz Samsung AMOLED. AniMe Vision Display.',
    features: ['Snapdragon 8 Gen 3 with 360-degree GameCool 8', '6.78" Samsung flexible AMOLED 165Hz (2500 nits)', 'AniMe Vision 341 programmable mini-LED display', '6-Axis Hybrid Gimbal Stabilizer 3.0'],
    highlights: ['IP68 Submersion Resistance', 'AirTrigger Ultrasonic Shoulder Buttons', '5500 mAh Dual Battery with 65W HyperCharge'],
    specifications: {
      'Display': '6.78-inch FHD+ 165Hz LTPO AMOLED',
      'Processor': 'Qualcomm Snapdragon 8 Gen 3 (3.3 GHz)',
      'Rear Camera': '50MP Sony IMX890 Gimbal + 32MP Telephoto + 13MP Ultrawide',
      'Battery': '5500 mAh with Quick Charge 5.0'
    },
    images: [
      { id: 'rog8-1', url: '/products/xiaomi/xiaomi-14-ultra/front.webp', alt: 'ASUS ROG Phone 8 Pro Front', angle: 'front', isPrimary: true }
    ],
    colorVariants: [
      { name: 'Phantom Black', hex: '#090909' }
    ],
    variants: [
      { id: 'rog8-16', name: '16GB + 512GB', price: 94999, sku: 'ASU-ROG8-512', stockCount: 3 },
      { id: 'rog8-24', name: '24GB + 1TB', price: 119999, sku: 'ASU-ROG8-1TB', stockCount: 2 }
    ],
    storageVariants: ['16GB + 512GB', '24GB + 1TB'],
    badge: 'new',
    isNewLaunch: true,
    collection: 'flagship',
    tags: ['Asus', 'Gaming', 'Snapdragon', '165Hz']
  }
];

// Seed Categories
export const seedCategories: Category[] = [
  { id: 'cat-1', name: 'Smartphones', slug: 'smartphones', description: 'Titanium & Foldable Flagships', image: '/images/cat-smartphones.jpg', icon: 'Smartphone', order: 1, isVisible: true, productCount: 12 },
  { id: 'cat-2', name: 'iPhones', slug: 'iphones', description: 'Apple Pro & Pro Max Flagships', image: '/images/cat-iphones.jpg', icon: 'Apple', order: 2, isVisible: true, productCount: 2 },
  { id: 'cat-3', name: 'Android Phones', slug: 'android-phones', description: 'Snapdragon 8 Gen 3 & 200MP Cameras', image: '/images/cat-android.jpg', icon: 'Cpu', order: 3, isVisible: true, productCount: 10 },
  { id: 'cat-4', name: 'Laptops', slug: 'laptops', description: 'MacBook Pro & OLED Ultrabooks', image: '/images/cat-laptops.jpg', icon: 'Laptop', order: 4, isVisible: true, productCount: 2 },
  { id: 'cat-5', name: 'Tablets', slug: 'tablets', description: 'M4 Tandem OLED & Canvas Pads', image: '/images/cat-tablets.jpg', icon: 'Tablet', order: 5, isVisible: true, productCount: 2 },
  { id: 'cat-6', name: 'Headphones', slug: 'audio', description: 'Audiophile ANC & Wireless Hi-Res', image: '/images/cat-headphones.jpg', icon: 'Headphones', order: 6, isVisible: true, productCount: 4 },
  { id: 'cat-7', name: 'Earbuds', slug: 'audio', description: 'Spatial Sound & Active Noise Cancellation', image: '/images/cat-earbuds.jpg', icon: 'Volume2', order: 7, isVisible: true, productCount: 2 },
  { id: 'cat-8', name: 'Smartwatches', slug: 'smartwatches', description: 'Titanium, Sapphire & Health Monitors', image: '/images/cat-smartwatches.jpg', icon: 'Watch', order: 8, isVisible: true, productCount: 3 },
  { id: 'cat-9', name: 'Speakers', slug: 'audio', description: 'Marshall Vintage & Studio Acoustics', image: '/images/cat-speakers.jpg', icon: 'Speaker', order: 9, isVisible: true, productCount: 2 },
  { id: 'cat-10', name: 'Accessories', slug: 'accessories', description: '240W GaN Charging & Studio Hubs', image: '/images/cat-accessories.jpg', icon: 'Zap', order: 10, isVisible: true, productCount: 1 }
];

// Seed Brands
export const seedBrands: Brand[] = [
  { id: 'br-1', name: 'Apple', slug: 'apple', country: 'United States', isActive: true, order: 1, productCount: 5 },
  { id: 'br-2', name: 'Huawei', slug: 'huawei', country: 'China', isActive: true, order: 2, productCount: 1 },
  { id: 'br-3', name: 'Samsung', slug: 'samsung', country: 'South Korea', isActive: true, order: 3, productCount: 3 },
  { id: 'br-4', name: 'OnePlus', slug: 'oneplus', country: 'China', isActive: true, order: 4, productCount: 2 },
  { id: 'br-5', name: 'Google', slug: 'google', country: 'United States', isActive: true, order: 5, productCount: 1 },
  { id: 'br-6', name: 'Xiaomi', slug: 'xiaomi', country: 'China', isActive: true, order: 6, productCount: 1 },
  { id: 'br-7', name: 'Vivo', slug: 'vivo', country: 'China', isActive: true, order: 7, productCount: 1 },
  { id: 'br-8', name: 'Oppo', slug: 'oppo', country: 'China', isActive: true, order: 8, productCount: 1 },
  { id: 'br-9', name: 'Realme', slug: 'realme', country: 'China', isActive: true, order: 9, productCount: 1 },
  { id: 'br-10', name: 'Motorola', slug: 'motorola', country: 'United States', isActive: true, order: 10, productCount: 1 },
  { id: 'br-11', name: 'Sony', slug: 'sony', country: 'Japan', isActive: true, order: 11, productCount: 2 },
  { id: 'br-12', name: 'Dell', slug: 'dell', country: 'United States', isActive: true, order: 12, productCount: 1 },
  { id: 'br-13', name: 'Marshall', slug: 'marshall', country: 'United Kingdom', isActive: true, order: 13, productCount: 2 },
  { id: 'br-14', name: 'Anker', slug: 'anker', country: 'United States', isActive: true, order: 14, productCount: 1 },
  { id: 'br-15', name: 'Asus', slug: 'asus', country: 'Taiwan', isActive: true, order: 15, productCount: 1 }
];

// Seed Orders (15 realistic orders spread over past 60 days)
export const seedOrders: Order[] = [
  {
    id: 'ST-9421',
    date: '18 Nov 2026',
    customerName: 'Marcus Arilius',
    customerEmail: 'marcus@arilius.luxury',
    customerPhone: '09831250575',
    shippingAddress: 'Showroom Pickup: 58/3 New GT Road, Uttarpara, West Bengal - 712258',
    total: 139999,
    discount: 0,
    shipping: 0,
    grandTotal: 139999,
    status: 'shipped',
    paymentMethod: 'upi',
    isNew: false,
    trackingNumber: 'BLUEDART-ST9421-WB',
    internalNotes: 'Client opted for Uttarpara demo inspection prior to courier seal.',
    items: [
      { product: seedProducts[1], quantity: 1, selectedColor: 'Rui Red (瑞红)', selectedStorage: '16GB + 512GB' }
    ],
    timeline: [
      { id: 't1', date: '18 Nov 2026', time: '11:15 AM', status: 'placed', title: 'Order Placed', description: 'Order confirmed and verified via UPI payment' },
      { id: 't2', date: '18 Nov 2026', time: '01:30 PM', status: 'processing', title: 'Quality Inspection', description: 'Showroom technicians completed serial verification' },
      { id: 't3', date: '18 Nov 2026', time: '04:45 PM', status: 'shipped', title: 'Dispatched via Blue Dart', description: 'Tracking ID BLUEDART-ST9421-WB assigned' }
    ]
  },
  {
    id: 'ST-9420',
    date: '18 Nov 2026',
    customerName: 'Elena S. Wright',
    customerEmail: 'elena.wright@studio.in',
    customerPhone: '09831250576',
    shippingAddress: 'Flat 4B, Tower 2, Urbana Luxury Residences, Anandapur, Kolkata - 700107',
    total: 134900,
    discount: 5000,
    couponCode: 'FLAGSHIP5000',
    shipping: 0,
    grandTotal: 129900,
    status: 'processing',
    paymentMethod: 'card',
    isNew: true,
    internalNotes: 'Priority dispatch requested for client wedding gift.',
    items: [
      { product: seedProducts[0], quantity: 1, selectedColor: 'Natural Titanium', selectedStorage: '256GB' }
    ],
    timeline: [
      { id: 't1', date: '18 Nov 2026', time: '02:20 PM', status: 'placed', title: 'Order Placed', description: 'Authorized via HDFC Bank Corporate Credit Card' },
      { id: 't2', date: '18 Nov 2026', time: '03:00 PM', status: 'processing', title: 'Processing at Showroom', description: 'Packaged in tamper-proof security box' }
    ]
  },
  {
    id: 'ST-9419',
    date: '17 Nov 2026',
    customerName: 'Jordan Taylor',
    customerEmail: 'jordan.t@audioengineer.org',
    customerPhone: '09831250577',
    shippingAddress: '14 Park Street, Near Stephen Court, Kolkata - 700016',
    total: 29999,
    discount: 2999,
    couponCode: 'AUDIO20',
    shipping: 0,
    grandTotal: 27000,
    status: 'delivered',
    paymentMethod: 'cod',
    isNew: false,
    trackingNumber: 'DELHIVERY-JT9419',
    items: [
      { product: seedProducts[13], quantity: 1, selectedColor: 'Silver' }
    ],
    timeline: [
      { id: 't1', date: '17 Nov 2026', time: '09:00 AM', status: 'placed', title: 'Order Placed', description: 'Cash on Delivery verified via phone OTP' },
      { id: 't2', date: '17 Nov 2026', time: '10:30 AM', status: 'processing', title: 'Packaged', description: 'Sony warranty registered' },
      { id: 't3', date: '17 Nov 2026', time: '01:00 PM', status: 'shipped', title: 'Out for Local Delivery', description: 'Assigned to Saitronics Dedicated Courier' },
      { id: 't4', date: '17 Nov 2026', time: '04:20 PM', status: 'delivered', title: 'Delivered Successfully', description: 'Received by customer with signature' }
    ]
  },
  {
    id: 'ST-9418',
    date: '16 Nov 2026',
    customerName: 'Aarav Patel',
    customerEmail: 'aarav.patel@techcorp.in',
    customerPhone: '09831250578',
    shippingAddress: '88 GT Road, Howrah AC Market Commercial Complex, Howrah - 711101',
    total: 129999,
    discount: 0,
    shipping: 0,
    grandTotal: 129999,
    status: 'delivered',
    paymentMethod: 'upi',
    isNew: false,
    trackingNumber: 'BD-S24U-9418',
    items: [
      { product: seedProducts[2], quantity: 1, selectedColor: 'Titanium Gray', selectedStorage: '256GB' }
    ],
    timeline: [
      { id: 't1', date: '16 Nov 2026', time: '10:00 AM', status: 'placed', title: 'Order Placed', description: 'Confirmed' },
      { id: 't2', date: '16 Nov 2026', time: '05:30 PM', status: 'delivered', title: 'Delivered', description: 'Delivered' }
    ]
  },
  {
    id: 'ST-9417',
    date: '15 Nov 2026',
    customerName: 'Priya Sen',
    customerEmail: 'priya.sen@bally.net',
    customerPhone: '09831250579',
    shippingAddress: '23 Bally Station Road, Bally, Howrah - 711201',
    total: 24900,
    discount: 0,
    shipping: 0,
    grandTotal: 24900,
    status: 'processing',
    paymentMethod: 'upi',
    isNew: false,
    items: [
      { product: seedProducts[14], quantity: 1, selectedColor: 'White' }
    ],
    timeline: [
      { id: 't1', date: '15 Nov 2026', time: '04:15 PM', status: 'placed', title: 'Order Placed', description: 'Confirmed' }
    ]
  },
  {
    id: 'ST-9416',
    date: '14 Nov 2026',
    customerName: 'Vikramaditya Roy',
    customerEmail: 'v.roy@barrister.in',
    customerPhone: '09831250580',
    shippingAddress: 'High Court Chambers, Kolkata - 700001',
    total: 199900,
    discount: 10000,
    couponCode: 'VIPLUXURY',
    shipping: 0,
    grandTotal: 189900,
    status: 'delivered',
    paymentMethod: 'card',
    isNew: false,
    trackingNumber: 'PREMIUM-MAC-9416',
    items: [
      { product: seedProducts[10], quantity: 1, selectedColor: 'Space Black', selectedStorage: '1TB SSD' }
    ],
    timeline: [
      { id: 't1', date: '14 Nov 2026', time: '11:00 AM', status: 'placed', title: 'Order Placed', description: 'Verified' },
      { id: 't2', date: '14 Nov 2026', time: '03:00 PM', status: 'delivered', title: 'Executive White-Glove Handover', description: 'Delivered in chamber' }
    ]
  },
  {
    id: 'ST-9415',
    date: '12 Nov 2026',
    customerName: 'Ananya Mukherjee',
    customerEmail: 'ananya.m@iitkgp.ac.in',
    customerPhone: '09831250581',
    shippingAddress: 'Professor Quarters, Salt Lake Sector 1, Kolkata - 700064',
    total: 129999,
    discount: 0,
    shipping: 0,
    grandTotal: 129999,
    status: 'delivered',
    paymentMethod: 'upi',
    isNew: false,
    items: [
      { product: seedProducts[12], quantity: 1, selectedColor: 'Space Black', selectedStorage: '256GB' }
    ],
    timeline: [{ id: 't1', date: '12 Nov 2026', time: '01:00 PM', status: 'delivered', title: 'Delivered', description: 'Received' }]
  },
  {
    id: 'ST-9414',
    date: '10 Nov 2026',
    customerName: 'Devang Mehta',
    customerEmail: 'devang@mehtafin.com',
    customerPhone: '09831250582',
    shippingAddress: 'New Alipore Block D, Kolkata - 700053',
    total: 89999,
    discount: 0,
    shipping: 0,
    grandTotal: 89999,
    status: 'delivered',
    paymentMethod: 'card',
    isNew: false,
    items: [{ product: seedProducts[16], quantity: 1, selectedColor: 'Titanium' }],
    timeline: [{ id: 't1', date: '10 Nov 2026', time: '12:00 PM', status: 'delivered', title: 'Delivered', description: 'Received' }]
  },
  {
    id: 'ST-9413',
    date: '08 Nov 2026',
    customerName: 'Rohan Ganguly',
    customerEmail: 'rohan.g@sounddesign.co',
    customerPhone: '09831250583',
    shippingAddress: 'Southern Avenue, Lake Terrace, Kolkata - 700029',
    total: 34999,
    discount: 0,
    shipping: 0,
    grandTotal: 34999,
    status: 'delivered',
    paymentMethod: 'upi',
    isNew: false,
    items: [{ product: seedProducts[15], quantity: 1, selectedColor: 'Black & Brass' }],
    timeline: [{ id: 't1', date: '08 Nov 2026', time: '02:00 PM', status: 'delivered', title: 'Delivered', description: 'Received' }]
  },
  {
    id: 'ST-9412',
    date: '06 Nov 2026',
    customerName: 'Sanjay Agarwal',
    customerEmail: 'sanjay@agarwalmotors.in',
    customerPhone: '09831250584',
    shippingAddress: 'Konnagar Municipality Ward 4, Hooghly - 712235',
    total: 69999,
    discount: 0,
    shipping: 0,
    grandTotal: 69999,
    status: 'delivered',
    paymentMethod: 'cod',
    isNew: false,
    items: [{ product: seedProducts[4], quantity: 1, selectedColor: 'Flowy Emerald', selectedStorage: '256GB' }],
    timeline: [{ id: 't1', date: '06 Nov 2026', time: '04:00 PM', status: 'delivered', title: 'Delivered', description: 'Received' }]
  },
  {
    id: 'ST-9411',
    date: '03 Nov 2026',
    customerName: 'Subir Banerjee',
    customerEmail: 'subir@bengaltrade.org',
    customerPhone: '09831250585',
    shippingAddress: 'Serampore Court Compound, Hooghly - 712201',
    total: 89999,
    discount: 0,
    shipping: 0,
    grandTotal: 89999,
    status: 'delivered',
    paymentMethod: 'upi',
    isNew: false,
    items: [{ product: seedProducts[6], quantity: 1, selectedColor: 'Sunset Orange', selectedStorage: '256GB' }],
    timeline: [{ id: 't1', date: '03 Nov 2026', time: '11:00 AM', status: 'delivered', title: 'Delivered', description: 'Received' }]
  },
  {
    id: 'ST-9410',
    date: '01 Nov 2026',
    customerName: 'Meenakshi Iyer',
    customerEmail: 'meenakshi@musicverse.in',
    customerPhone: '09831250586',
    shippingAddress: 'Behala Chowrasta, Kolkata - 700034',
    total: 14999,
    discount: 0,
    shipping: 0,
    grandTotal: 14999,
    status: 'cancelled',
    paymentMethod: 'upi',
    isNew: false,
    internalNotes: 'Customer requested cancellation due to duplicate order placed by spouse.',
    items: [{ product: seedProducts[18], quantity: 1 }],
    timeline: [
      { id: 't1', date: '01 Nov 2026', time: '02:00 PM', status: 'placed', title: 'Order Placed', description: 'Confirmed' },
      { id: 't2', date: '01 Nov 2026', time: '03:15 PM', status: 'cancelled', title: 'Order Cancelled', description: 'Refund initiated via UPI source' }
    ]
  },
  {
    id: 'ST-9409',
    date: '28 Oct 2026',
    customerName: 'Debjit Paul',
    customerEmail: 'debjit.paul@technoindia.edu',
    customerPhone: '09831250587',
    shippingAddress: 'Rishra Station Road, Hooghly - 712248',
    total: 64999,
    discount: 0,
    shipping: 0,
    grandTotal: 64999,
    status: 'delivered',
    paymentMethod: 'cod',
    isNew: false,
    items: [{ product: seedProducts[8], quantity: 1, selectedColor: 'Red Rock' }],
    timeline: [{ id: 't1', date: '28 Oct 2026', time: '04:00 PM', status: 'delivered', title: 'Delivered', description: 'Received' }]
  },
  {
    id: 'ST-9408',
    date: '24 Oct 2026',
    customerName: 'Tanvi Sharma',
    customerEmail: 'tanvi@sharmainteriors.com',
    customerPhone: '09831250588',
    shippingAddress: 'Ballygunge Circular Road, Kolkata - 700019',
    total: 169900,
    discount: 0,
    shipping: 0,
    grandTotal: 169900,
    status: 'delivered',
    paymentMethod: 'card',
    isNew: false,
    items: [{ product: seedProducts[11], quantity: 1, selectedColor: 'Platinum' }],
    timeline: [{ id: 't1', date: '24 Oct 2026', time: '03:00 PM', status: 'delivered', title: 'Delivered', description: 'Received' }]
  },
  {
    id: 'ST-9407',
    date: '20 Oct 2026',
    customerName: 'Kunal Roychowdhury',
    customerEmail: 'kunal.rc@bengalpharma.in',
    customerPhone: '09831250589',
    shippingAddress: 'Uttarpara Peerless Housing Complex, Uttarpara - 712258',
    total: 99999,
    discount: 5000,
    couponCode: 'FLAGSHIP5000',
    shipping: 0,
    grandTotal: 94999,
    status: 'delivered',
    paymentMethod: 'upi',
    isNew: false,
    items: [{ product: seedProducts[5], quantity: 1, selectedColor: 'Black' }],
    timeline: [{ id: 't1', date: '20 Oct 2026', time: '05:00 PM', status: 'delivered', title: 'Delivered', description: 'Showroom delivery handover' }]
  }
];

// Seed Coupons
export const seedCoupons: Coupon[] = [
  {
    id: 'cp-1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrder: 15000,
    maxDiscount: 5000,
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    usageLimit: 500,
    usageCount: 42,
    isActive: true,
    description: '10% Welcome Discount for First-Time Showroom Patrons (Max ₹5,000)'
  },
  {
    id: 'cp-2',
    code: 'FLAGSHIP5000',
    type: 'flat',
    value: 5000,
    minOrder: 80000,
    startDate: '2026-10-01',
    endDate: '2027-06-30',
    usageLimit: 200,
    usageCount: 19,
    isActive: true,
    description: 'Flat ₹5,000 Off on Titanium & Ceramic Flagships'
  },
  {
    id: 'cp-3',
    code: 'FESTIVE15',
    type: 'percentage',
    value: 15,
    minOrder: 30000,
    maxDiscount: 10000,
    startDate: '2026-11-01',
    endDate: '2026-12-31',
    usageLimit: 150,
    usageCount: 28,
    isActive: true,
    description: 'Exclusive 15% Festive Privilege on Computing & Displays'
  },
  {
    id: 'cp-4',
    code: 'AUDIO20',
    type: 'percentage',
    value: 20,
    minOrder: 10000,
    maxDiscount: 4000,
    startDate: '2026-09-01',
    endDate: '2027-03-31',
    usageLimit: 300,
    usageCount: 57,
    isActive: true,
    description: '20% Off Sony & Marshall Audiophile Acoustics (Max ₹4,000)'
  },
  {
    id: 'cp-5',
    code: 'VIPLUXURY',
    type: 'flat',
    value: 10000,
    minOrder: 150000,
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    usageLimit: 50,
    usageCount: 6,
    isActive: true,
    description: 'Ultra High-Value Private Client Rebate on MacBook Pro & Mate 70 RS'
  }
];

// Seed Reviews
export const seedReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'huawei-mate-70-rs',
    productName: 'HUAWEI Mate 70 RS Ultimate Design',
    productSlug: 'huawei-mate-70-rs',
    customerName: 'Marcus Arilius',
    rating: 5,
    title: 'The octagonal Rui Red ceramic is a masterpiece',
    comment: 'Collected from the Uttarpara showroom in person. The dual-layer OLED and variable aperture camera surpass any phone I have owned. Exceptional service by Saitronics specialists.',
    date: '18 Nov 2026',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'iphone-15-pro-max',
    productName: 'Apple iPhone 15 Pro Max',
    productSlug: 'iphone-15-pro-max',
    customerName: 'Elena S. Wright',
    rating: 5,
    title: 'Titanium unibody feels noticeably lighter',
    comment: 'The 5x optical telephoto lens captures incredible low light studio footage. Pristine brand packaging with official Indian warranty card.',
    date: '16 Nov 2026',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'samsung-galaxy-s24-ultra',
    productName: 'Samsung Galaxy S24 Ultra',
    productSlug: 'samsung-galaxy-s24-ultra',
    customerName: 'Aarav Patel',
    rating: 5,
    title: 'Gorilla Armor reduces reflections dramatically',
    comment: 'The 200MP camera and low-latency S Pen make this the best productivity tool for executive workflows. Fast courier delivery to Howrah.',
    date: '14 Nov 2026',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-4',
    productId: 'sony-wh1000xm5',
    productName: 'Sony WH-1000XM5 ANC Headphones',
    productSlug: 'sony-wh1000xm5',
    customerName: 'Jordan Taylor',
    rating: 5,
    title: 'Unrivalled noise cancellation on metro commute',
    comment: 'LDAC wireless codec clarity is extraordinary. Battery life easily exceeds 30 hours. Authenticity verified.',
    date: '12 Nov 2026',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-5',
    productId: 'macbook-pro-14-m3',
    productName: 'MacBook Pro 14" M3 Pro',
    productSlug: 'macbook-pro-14-m3',
    customerName: 'Vikramaditya Roy',
    rating: 5,
    title: 'Space Black anodization resists fingerprints beautifully',
    comment: 'Handles 4K ProRes timeline rendering without thermal throttling. The Liquid Retina XDR display is studio accurate.',
    date: '10 Nov 2026',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-6',
    productId: 'marshall-stanmore-3',
    productName: 'Marshall Stanmore III Speaker',
    productSlug: 'marshall-stanmore-3',
    customerName: 'Rohan Ganguly',
    rating: 4,
    title: 'Legendary room-filling soundstage',
    comment: 'The brass rotary knobs give physical tactile control over treble and bass. Looks stunning in my living room.',
    date: '08 Nov 2026',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-7',
    productId: 'apple-watch-ultra-2',
    productName: 'Apple Watch Ultra 2',
    productSlug: 'apple-watch-ultra-2',
    customerName: 'Devang Mehta',
    rating: 5,
    title: '3000-nit screen legible under harsh direct sunlight',
    comment: 'Action button setup for trail running is flawless. Rugged grade 5 titanium case survives rigorous workouts.',
    date: '05 Nov 2026',
    status: 'approved',
    verifiedPurchase: true
  },
  {
    id: 'rev-8',
    productId: 'huawei-mate-70-rs',
    productName: 'HUAWEI Mate 70 RS Ultimate Design',
    productSlug: 'huawei-mate-70-rs',
    customerName: 'Rajesh K.',
    rating: 5,
    title: 'Exceptional phone build quality',
    comment: 'Pending review queue demonstration item for admin moderation verification.',
    date: '18 Nov 2026',
    status: 'pending',
    verifiedPurchase: false
  }
];

// Seed Customers (derived from orders and showroom accounts)
export const seedCustomers: Customer[] = [
  { id: 'c-1', name: 'Marcus Arilius', email: 'marcus@arilius.luxury', phone: '09831250575', address: 'Uttarpara Showroom Store Pickup', totalOrders: 2, totalSpend: 279998, lastOrderDate: '18 Nov 2026', createdAt: '01 Oct 2026' },
  { id: 'c-2', name: 'Elena S. Wright', email: 'elena.wright@studio.in', phone: '09831250576', address: 'Urbana Luxury Residences, Kolkata', totalOrders: 1, totalSpend: 129900, lastOrderDate: '18 Nov 2026', createdAt: '10 Oct 2026' },
  { id: 'c-3', name: 'Jordan Taylor', email: 'jordan.t@audioengineer.org', phone: '09831250577', address: '14 Park Street, Kolkata', totalOrders: 1, totalSpend: 27000, lastOrderDate: '17 Nov 2026', createdAt: '15 Oct 2026' },
  { id: 'c-4', name: 'Aarav Patel', email: 'aarav.patel@techcorp.in', phone: '09831250578', address: 'Howrah AC Market Complex', totalOrders: 1, totalSpend: 129999, lastOrderDate: '16 Nov 2026', createdAt: '12 Oct 2026' },
  { id: 'c-5', name: 'Vikramaditya Roy', email: 'v.roy@barrister.in', phone: '09831250580', address: 'High Court Chambers, Kolkata', totalOrders: 2, totalSpend: 319899, lastOrderDate: '14 Nov 2026', createdAt: '05 Sep 2026' },
  { id: 'c-6', name: 'Ananya Mukherjee', email: 'ananya.m@iitkgp.ac.in', phone: '09831250581', address: 'Salt Lake Sector 1, Kolkata', totalOrders: 1, totalSpend: 129999, lastOrderDate: '12 Nov 2026', createdAt: '20 Oct 2026' },
  { id: 'c-7', name: 'Priya Sen', email: 'priya.sen@bally.net', phone: '09831250579', address: '23 Bally Station Road, Howrah', totalOrders: 1, totalSpend: 24900, lastOrderDate: '15 Nov 2026', createdAt: '28 Oct 2026' },
  { id: 'c-8', name: 'Kunal Roychowdhury', email: 'kunal.rc@bengalpharma.in', phone: '09831250589', address: 'Peerless Housing, Uttarpara', totalOrders: 1, totalSpend: 94999, lastOrderDate: '20 Oct 2026', createdAt: '14 Sep 2026' }
];

// Seed Site Content
export const seedSiteContent: SiteContent = {
  announcementBar: {
    text: 'AUTHENTIC GLOBAL FLAGSHIPS • UTTARPARA SHOWROOM: 58/3 NEW GT ROAD • DIRECT ENQUIRIES: 09831250575',
    link: '/contact',
    isVisible: true
  },
  heroSlides: [
    {
      id: 'slide-1',
      eyebrow: 'NEW LAUNCH • FLAGSHIP ARCHITECTURE',
      brand: 'HUAWEI',
      title: 'POWER MEETS',
      highlight: 'PERFECTION.',
      subtitle: 'HUAWEI Mate 70 RS Ultimate Design',
      description: 'Forged in master octagonal ceramic with dual-layer Tandem OLED display and signature Rui Red craftsmanship.',
      price: '₹1,39,999',
      originalPrice: '₹1,54,999',
      discount: '10% OFF',
      slug: 'huawei-mate-70-rs',
      image: '/products/huawei/mate-70-rs/front.webp',
      badgeDisplay: 'Tandem OLED • 120Hz LTPO',
      badgeCamera: 'Variable Aperture XMAGE',
      specs: ['Kirin 9020 Flagship', 'Dual-Layer OLED', 'Rui Red Ceramic'],
      buttonText: 'Order Mate 70 RS',
      buttonLink: '/products/huawei-mate-70-rs',
      glowColor: '#E50924',
      stageTilt: { x: -6, y: 16 },
      callout: { label: 'CAMERA SYSTEM', text: 'Variable Aperture XMAGE', anchor: 'camera' },
      isActive: true,
      order: 1
    },
    {
      id: 'slide-2',
      eyebrow: 'TITANIUM INNOVATION • PRO MAX',
      brand: 'APPLE',
      title: 'FORGED IN',
      highlight: 'TITANIUM.',
      subtitle: 'Apple iPhone 15 Pro Max',
      description: 'Aerospace-grade titanium unibody powered by the groundbreaking 3nm A17 Pro chip and 5x optical telephoto.',
      price: '₹1,34,900',
      originalPrice: '₹1,49,900',
      discount: '10% OFF',
      slug: 'iphone-15-pro-max',
      image: '/products/apple/iphone-15-pro-max/front.webp',
      badgeDisplay: 'Super Retina XDR • ProMotion',
      badgeCamera: '48MP 5x Optical Telephoto',
      specs: ['A17 Pro 3nm Silicon', 'Grade 5 Titanium', 'Action Button'],
      buttonText: 'Explore iPhone 15 Pro Max',
      buttonLink: '/products/iphone-15-pro-max',
      glowColor: '#FF3048',
      stageTilt: { x: -5, y: -18 },
      callout: { label: 'CAMERA SYSTEM', text: '48MP 5x Optical Telephoto', anchor: 'camera' },
      isActive: true,
      order: 2
    },
    {
      id: 'slide-3',
      eyebrow: 'GALAXY AI SUITE • 200MP OPTICS',
      brand: 'SAMSUNG',
      title: 'INTELLIGENCE',
      highlight: 'REDEFINED.',
      subtitle: 'Samsung Galaxy S24 Ultra',
      description: 'Empowered with Galaxy AI suite, Corning Gorilla Armor anti-reflective glass, and low-latency integrated S Pen.',
      price: '₹1,29,999',
      originalPrice: '₹1,44,999',
      discount: '10% OFF',
      slug: 'samsung-galaxy-s24-ultra',
      image: '/products/samsung/galaxy-s24-ultra/front.webp',
      badgeDisplay: 'Dynamic AMOLED 2X • 2600 nits',
      badgeCamera: '200MP Quad Tele System',
      specs: ['Galaxy AI Built-in', 'Corning Gorilla Armor', 'Integrated S Pen'],
      buttonText: 'Discover S24 Ultra',
      buttonLink: '/products/samsung-galaxy-s24-ultra',
      glowColor: '#E50924',
      stageTilt: { x: -7, y: 14 },
      callout: { label: 'VISION ENGINE', text: '200MP Quad Tele System', anchor: 'camera' },
      isActive: true,
      order: 3
    }
  ],
  sectionsVisibility: {
    announcementBar: true,
    hero: true,
    trustServices: true,
    categories: true,
    newLaunches: true,
    collections: true,
    bestsellers: true,
    audioBanner: true,
    showroom: true
  },
  newLaunchesHeading: {
    title: 'New Flagship Launches',
    subtitle: 'Cutting-edge engineering and next-generation mobile silicon, now in stock.',
    label: '02 / EDITORIAL LAUNCHES',
    productIds: ['huawei-mate-70-rs', 'iphone-15-pro-max', 'samsung-galaxy-s24-ultra', 'xiaomi-14-ultra', 'samsung-galaxy-z-fold-6']
  },
  featuredCollections: [
    {
      id: 'fc-1',
      key: 'flagship',
      title: 'Flagship Smartphones',
      description: 'Titanium chassis, 1-inch camera sensors, and groundbreaking 3nm mobile silicon.',
      image: '/images/cat-smartphones.jpg',
      productIds: ['huawei-mate-70-rs', 'iphone-15-pro-max', 'samsung-galaxy-s24-ultra', 'xiaomi-14-ultra'],
      order: 1,
      isVisible: true
    },
    {
      id: 'fc-2',
      key: 'everyday',
      title: 'Everyday Essentials',
      description: 'Ultra-thin computing and high-efficiency laptops for seamless workflow execution.',
      image: '/images/cat-laptops.jpg',
      productIds: ['macbook-pro-14-m3', 'dell-xps-15', 'apple-ipad-air-m2'],
      order: 2,
      isVisible: true
    },
    {
      id: 'fc-3',
      key: 'audio',
      title: 'Premium Audio & ANC',
      description: 'Audiophile acoustic drivers and dual-processor noise-cancelling systems.',
      image: '/images/cat-headphones.jpg',
      productIds: ['sony-wh1000xm5', 'airpods-pro-2', 'marshall-stanmore-3', 'sony-wf1000xm5', 'marshall-emberton-2'],
      order: 3,
      isVisible: true
    },
    {
      id: 'fc-4',
      key: 'smart-living',
      title: 'Smart Living & Wearables',
      description: 'Sapphire glass timepieces, precision biometrics, and multi-day health monitoring.',
      image: '/images/cat-smartwatches.jpg',
      productIds: ['apple-watch-ultra-2', 'samsung-galaxy-watch-7', 'oneplus-watch-2'],
      order: 4,
      isVisible: true
    },
    {
      id: 'fc-5',
      key: 'accessories',
      title: 'Accessories & GaN Power',
      description: '240W high-speed charging stations and braided aerospace-grade connectors.',
      image: '/images/cat-accessories.jpg',
      productIds: ['anker-prime-240w-gan'],
      order: 5,
      isVisible: true
    }
  ],
  bestsellersHeading: {
    title: 'Most Acclaimed Electronics',
    subtitle: 'Verified by over 1,200+ satisfied clients across West Bengal and nationwide.',
    productIds: ['iphone-15-pro-max', 'samsung-galaxy-s24-ultra', 'macbook-pro-14-m3', 'sony-wh1000xm5', 'airpods-pro-2', 'marshall-stanmore-3']
  },
  audioBanner: {
    title: 'ACOUSTIC ENGINEERING',
    subtitle: 'Sony WH-1000XM5 Studio ANC & High-Resolution LDAC',
    highlight: 'PURE SOUND.',
    link: '/products/sony-wh1000xm5',
    specs: ['30h Battery Life', 'Dual QN1 Processor', 'Multipoint Bluetooth 5.2']
  },
  promoBlock: {
    title: 'Experience Flagship Tech In Person',
    desc: 'Touch, test, and compare the latest titanium devices at our exclusive showroom.',
    phone: '09831250575',
    location: '58/3, New GT Road, Near College Bus Stop, Uttarpara, WB - 712258'
  }
};

// Seed Store Settings
export const seedStoreSettings: StoreSettings = {
  storeName: 'Saitronics',
  tagline: 'Technology • Style • Experience',
  logoUrl: '/images/saitronics-logo.png',
  address: '58/3, New GT Road, Near College Bus Stop',
  city: 'Uttarpara',
  state: 'West Bengal',
  pincode: '712258',
  phone: '09831250575',
  email: 'support@saitronics.com',
  hours: 'Monday – Sunday: 10:30 AM – 9:00 PM',
  mapsDirectionsUrl: 'https://maps.google.com/?q=58/3+New+GT+Road+Uttarpara+West+Bengal+712258',
  currencySymbol: '₹',
  currencyCode: 'INR',
  defaultLowStockThreshold: 5,
  orderIdPrefix: 'ST-',
  adminId: DEFAULT_ADMIN_ID,
  adminPassword: DEFAULT_ADMIN_PASSWORD,
  socialLinks: {
    facebook: 'https://facebook.com/saitronics',
    instagram: 'https://instagram.com/saitronics',
    twitter: 'https://twitter.com/saitronics',
    youtube: 'https://youtube.com/saitronics'
  }
};
