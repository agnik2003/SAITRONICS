import { Product } from '@/types';
import { PRODUCT_IMAGE_REGISTRY, getProductImages } from './productImages';

export const products: Product[] = [
  // ============================================================
  // MAJOR SMARTPHONES (Apple, Huawei, Samsung, OnePlus, Google, Xiaomi, Vivo, Oppo, Realme, Motorola)
  // ============================================================
  {
    id: 'iphone-15-pro-max',
    name: 'Apple iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    brand: 'Apple',
    category: 'smartphones',
    subCategory: 'iphones',
    price: 134900,
    originalPrice: 149900,
    rating: 4.9,
    reviewCount: 3840,
    inStock: true,
    stockCount: 16,
    description: 'Forged in aerospace-grade titanium, featuring the revolutionary A17 Pro chip, customizable Action button, and the most versatile 48MP Pro camera system with 5x telephoto optical zoom.',
    shortDescription: 'Aerospace-Grade Titanium. A17 Pro. 5x Optical Zoom.',
    features: [
      'A17 Pro chip with 6-core GPU delivering console-level gaming',
      'Aerospace-grade titanium design with textured matte glass back',
      '48MP Main camera with 5x telephoto optical zoom',
      'Action Button for instant access to your favorite feature',
      'All-day battery life with up to 29 hours video playback',
      'USB-C with USB 3 speeds for pro workflows'
    ],
    specifications: {
      'Display': '6.7-inch Super Retina XDR OLED, 2796×1290, 120Hz ProMotion',
      'Processor': 'Apple A17 Pro (3nm)',
      'Camera System': '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto',
      'Front Camera': '12MP TrueDepth with Photonic Engine',
      'Battery': '4422 mAh, Fast Charging & MagSafe wireless',
      'Storage': '256GB / 512GB / 1TB',
      'Build': 'Titanium frame with Ceramic Shield front',
      'Water Resistance': 'IP68 (6 meters up to 30 mins)',
      'Dimensions & Weight': '159.9 × 76.7 × 8.25 mm, 221g'
    },
    images: PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'],
    colorVariants: [
      { name: 'Black Titanium', hex: '#1C1C1E', images: PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'] },
      { name: 'Natural Titanium', hex: '#9C968A', images: PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'] },
      { name: 'White Titanium', hex: '#E2E0D8', images: PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'] }
    ],
    storageVariants: ['256GB', '512GB', '1TB'],
    badge: 'hot',
    collection: 'flagship',
    tags: ['apple', 'iphone', 'titanium', '5g', 'flagship', 'pro']
  },

  {
    id: 'huawei-mate-70-rs',
    name: 'HUAWEI Mate 70 RS Ultimate Design',
    slug: 'huawei-mate-70-rs',
    brand: 'Huawei',
    category: 'smartphones',
    subCategory: 'flagship',
    price: 139999,
    originalPrice: 154999,
    rating: 5.0,
    reviewCount: 1420,
    inStock: true,
    stockCount: 8,
    description: 'The pinnacle of luxury smartphone engineering. Featuring the iconic octagonal ceramic star-ring camera architecture, titanium structural frame, dual-layer tandem OLED screen, and signature Rui Red craftsmanship.',
    shortDescription: 'Ultimate Luxury. Rui Red Ceramic. Dual-Layer OLED.',
    features: [
      'Masterpiece octagonal ceramic star-ring design in signature Rui Red',
      'Dual-layer Tandem OLED display with 3500 nits peak brightness',
      'XMAGE Ultra-Lighting camera with variable physical aperture',
      'High-brightness titanium structural skeleton with basalt tempered glass',
      'Two-way satellite communication technology',
      '100W SuperCharge wired & 80W wireless charging'
    ],
    specifications: {
      'Display': '6.82-inch Dual-layer Tandem OLED, 2844×1260, 1-120Hz LTPO',
      'Processor': 'Kirin 9100 Flagship AI Processor',
      'Rear Camera': '50MP Ultra-Lighting Variable (f/1.4-f/4.0) + 40MP Ultrawide + 48MP Macro Telephoto',
      'Front Camera': '13MP Ultra-Wide + 3D Depth Sensing',
      'Battery': '5700 mAh, 100W Wired, 80W Wireless SuperCharge',
      'RAM & Storage': '16GB RAM + 512GB / 1TB ROM',
      'Craftsmanship': 'Nano-microcrystalline ceramic + Titanium frame',
      'OS': 'HarmonyOS NEXT Ultra',
      'Weight': '242g'
    },
    images: PRODUCT_IMAGE_REGISTRY['huawei-mate-70-rs'],
    colorVariants: [
      { name: 'Rui Red (瑞红)', hex: '#B90820', images: PRODUCT_IMAGE_REGISTRY['huawei-mate-70-rs'] },
      { name: 'Xuan Black (玄黑)', hex: '#111111', images: PRODUCT_IMAGE_REGISTRY['huawei-mate-70-rs'] },
      { name: 'Hao White (皓白)', hex: '#F0F0F0', images: PRODUCT_IMAGE_REGISTRY['huawei-mate-70-rs'] }
    ],
    storageVariants: ['16GB+512GB', '16GB+1TB'],
    badge: 'new',
    collection: 'flagship',
    tags: ['huawei', 'luxury', 'ceramic', 'rui-red', 'ultimate-design', 'satellite']
  },

  {
    id: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    brand: 'Samsung',
    category: 'smartphones',
    subCategory: 'android-phones',
    price: 129999,
    originalPrice: 144999,
    rating: 4.8,
    reviewCount: 2950,
    inStock: true,
    stockCount: 19,
    description: 'Empowered by Galaxy AI, the Galaxy S24 Ultra features a titanium shield, 200MP camera with 100x Space Zoom, built-in S Pen, and Qualcomm Snapdragon 8 Gen 3 for Galaxy.',
    shortDescription: 'Galaxy AI. 200MP Quad Tele System. Titanium Armor.',
    features: [
      'Galaxy AI suite: Circle to Search, Live Translate, and Generative Photo Edit',
      '200MP main sensor paired with 50MP 5x optical periscope telephoto',
      'Corning Gorilla Armor anti-reflective glass display',
      'Snapdragon 8 Gen 3 for Galaxy processor',
      'Integrated S Pen stylus with low-latency Bluetooth controls',
      '5000 mAh battery with intelligent all-day power management'
    ],
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X, 3120×1440, 2600 nits, 120Hz',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
      'Rear Camera': '200MP Main + 50MP 5x Periscope + 10MP 3x Tele + 12MP Ultrawide',
      'Front Camera': '12MP Dual Pixel AF',
      'Battery': '5000 mAh, 45W Fast Charging',
      'Storage': '256GB / 512GB / 1TB',
      'Protection': 'Titanium Frame & IP68 Dust/Water resistance',
      'Dimensions & Weight': '162.3 × 79.0 × 8.6 mm, 232g'
    },
    images: PRODUCT_IMAGE_REGISTRY['samsung-galaxy-s24-ultra'],
    colorVariants: [
      { name: 'Titanium Black', hex: '#1C1C1E', images: PRODUCT_IMAGE_REGISTRY['samsung-galaxy-s24-ultra'] },
      { name: 'Titanium Gray', hex: '#68676C', images: PRODUCT_IMAGE_REGISTRY['samsung-galaxy-s24-ultra'] }
    ],
    storageVariants: ['256GB', '512GB', '1TB'],
    badge: 'bestseller',
    collection: 'flagship',
    tags: ['samsung', 'galaxy', 'ai', 'spen', '200mp', '5g']
  },

  {
    id: 'google-pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    slug: 'google-pixel-8-pro',
    brand: 'Google',
    category: 'smartphones',
    subCategory: 'android-phones',
    price: 89999,
    originalPrice: 99999,
    rating: 4.7,
    reviewCount: 1840,
    inStock: true,
    stockCount: 14,
    description: 'Engineered by Google with the Tensor G3 chip, leading mobile computational photography, exclusive Google AI Magic Editor tools, and guaranteed 7 years of full OS upgrades.',
    shortDescription: 'Google Tensor G3. Pro Camera System. 7 Years OS Updates.',
    features: [
      'Google Tensor G3 processor with next-generation Titan M2 security',
      'Super Actua display with 2400 nits peak outdoor brightness',
      '50MP main sensor with multi-spectral color sensor & object temperature sensor',
      'Best Take, Magic Audio Eraser, and Video Boost computational AI',
      '7 full years of Android OS and Feature Drop updates'
    ],
    specifications: {
      'Display': '6.7-inch Super Actua LTPO OLED, 2992×1344, 1-120Hz',
      'Processor': 'Google Tensor G3',
      'Rear Camera': '50MP Octa PD + 48MP Quad PD Ultrawide + 48MP 5x Telephoto',
      'Battery': '5050 mAh, 30W Wired, Fast Wireless Charging',
      'Storage': '128GB / 256GB / 512GB',
      'Build': 'Polished aluminum frame with matte back glass'
    },
    images: PRODUCT_IMAGE_REGISTRY['google-pixel-8-pro'],
    colorVariants: [
      { name: 'Obsidian Black', hex: '#1F2022', images: PRODUCT_IMAGE_REGISTRY['google-pixel-8-pro'] },
      { name: 'Porcelain White', hex: '#EBE5DC', images: PRODUCT_IMAGE_REGISTRY['google-pixel-8-pro'] }
    ],
    storageVariants: ['128GB', '256GB', '512GB'],
    badge: 'sale',
    collection: 'everyday',
    tags: ['google', 'pixel', 'ai', 'tensor', 'camera']
  },

  {
    id: 'oneplus-12',
    name: 'OnePlus 12',
    slug: 'oneplus-12',
    brand: 'OnePlus',
    category: 'smartphones',
    subCategory: 'android-phones',
    price: 64999,
    originalPrice: 69999,
    rating: 4.7,
    reviewCount: 1620,
    inStock: true,
    stockCount: 22,
    description: 'The definitive performance flagship featuring Qualcomm Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System, 5400 mAh high-capacity battery, and lightning 100W SUPERVOOC charging.',
    shortDescription: 'Snapdragon 8 Gen 3. 4th Gen Hasselblad. 100W SUPERVOOC.',
    features: [
      'Snapdragon 8 Gen 3 with up to 16GB LPDDR5X RAM',
      '2K 120Hz ProXDR display with revolutionary 4500 nits peak brightness',
      'Sony LYT-808 50MP sensor with 64MP periscope telephoto (3x optical, 120x digital)',
      '100W SUPERVOOC wired + 50W AIRVOOC wireless fast charging',
      'Dual Cryo-velocity VC cooling system for unthrottled gaming'
    ],
    specifications: {
      'Display': '6.82-inch 2K ProXDR AMOLED, 3168×1440, 1-120Hz LTPO 3.0',
      'Processor': 'Qualcomm Snapdragon 8 Gen 3',
      'Camera': '50MP Main + 64MP 3x Periscope + 48MP Ultrawide',
      'Battery': '5400 mAh with 100W Flash Charging',
      'Storage': '256GB / 512GB',
      'OS': 'OxygenOS 14 (Android 14)'
    },
    images: PRODUCT_IMAGE_REGISTRY['oneplus-12'],
    colorVariants: [
      { name: 'Silky Black', hex: '#191919', images: PRODUCT_IMAGE_REGISTRY['oneplus-12'] },
      { name: 'Flowy Emerald', hex: '#264A3F', images: PRODUCT_IMAGE_REGISTRY['oneplus-12'] }
    ],
    storageVariants: ['256GB', '512GB'],
    badge: 'bestseller',
    collection: 'everyday',
    tags: ['oneplus', 'fast-charging', 'hasselblad', 'snapdragon']
  },

  {
    id: 'xiaomi-14-ultra',
    name: 'Xiaomi 14 Ultra',
    slug: 'xiaomi-14-ultra',
    brand: 'Xiaomi',
    category: 'smartphones',
    subCategory: 'android-phones',
    price: 99999,
    originalPrice: 109999,
    rating: 4.8,
    reviewCount: 920,
    inStock: true,
    stockCount: 10,
    description: 'Legendary mobile imagery co-engineered with Leica. Features a 1-inch Sony LYT-900 sensor with stepless variable aperture f/1.63-f/4.0 and all-around liquid curved AMOLED display.',
    shortDescription: 'Leica Summilux Optics. 1-inch LYT-900. Variable Aperture.',
    features: [
      'Leica Summilux optical lenses with Quad 50MP camera array',
      '1-inch Sony LYT-900 sensor with stepless variable aperture f/1.63 - f/4.0',
      'Snapdragon 8 Gen 3 with dual-channel IceLoop cooling',
      '90W HyperCharge wired + 80W wireless HyperCharge',
      'Xiaomi Guardian Structure with high-strength aluminum & vegan leather'
    ],
    specifications: {
      'Display': '6.73-inch WQHD+ AMOLED, 3200×1440, 3000 nits',
      'Processor': 'Qualcomm Snapdragon 8 Gen 3',
      'Rear Camera': '50MP 1-inch Main + 50MP 75mm Floating Tele + 50MP 120mm Periscope + 50MP Ultrawide',
      'Battery': '5000 mAh, 90W Wired, 80W Wireless',
      'Storage': '512GB ROM, 16GB RAM'
    },
    images: PRODUCT_IMAGE_REGISTRY['xiaomi-14-ultra'],
    colorVariants: [
      { name: 'Black Vegan Leather', hex: '#111111', images: PRODUCT_IMAGE_REGISTRY['xiaomi-14-ultra'] },
      { name: 'White Ceramic', hex: '#F5F5F5', images: PRODUCT_IMAGE_REGISTRY['xiaomi-14-ultra'] }
    ],
    storageVariants: ['512GB'],
    badge: 'new',
    collection: 'flagship',
    tags: ['xiaomi', 'leica', 'camera', '1-inch', 'flagship']
  },

  {
    id: 'vivo-x100-pro',
    name: 'Vivo X100 Pro',
    slug: 'vivo-x100-pro',
    brand: 'Vivo',
    category: 'smartphones',
    subCategory: 'android-phones',
    price: 89999,
    originalPrice: 96999,
    rating: 4.7,
    reviewCount: 780,
    inStock: true,
    stockCount: 12,
    description: 'Co-engineered with ZEISS optics featuring the revolutionary APO Floating Telephoto camera, MediaTek Dimensity 9300 flagship chip, and custom V3 imaging chip.',
    shortDescription: 'ZEISS APO Telephoto. Dimensity 9300. V3 Imaging Chip.',
    features: [
      'ZEISS 1-inch main camera with T* lens coating',
      'ZEISS APO Floating Telephoto with certified chromatic aberration control',
      'MediaTek Dimensity 9300 all-big-core flagship processor',
      '100W Dual-Cell FlashCharge + 50W wireless charging'
    ],
    specifications: {
      'Display': '6.78-inch 8T LTPO AMOLED, 2800×1260, 3000 nits, 120Hz',
      'Processor': 'MediaTek Dimensity 9300',
      'Camera': '50MP 1-inch Main + 50MP ZEISS APO Telephoto + 50MP Ultrawide',
      'Battery': '5400 mAh with 100W Fast Charging',
      'Storage': '512GB ROM, 16GB RAM'
    },
    images: PRODUCT_IMAGE_REGISTRY['vivo-x100-pro'],
    storageVariants: ['256GB', '512GB'],
    badge: 'hot',
    collection: 'flagship',
    tags: ['vivo', 'zeiss', 'camera', 'telephoto']
  },

  {
    id: 'oppo-find-x7-ultra',
    name: 'Oppo Find X7 Ultra',
    slug: 'oppo-find-x7-ultra',
    brand: 'Oppo',
    category: 'smartphones',
    subCategory: 'android-phones',
    price: 94999,
    originalPrice: 104999,
    rating: 4.8,
    reviewCount: 650,
    inStock: true,
    stockCount: 7,
    description: 'The worlds first dual periscope camera flagship featuring Hasselblad Master Camera System, Sony LYT-900 1-inch sensor, and dual-tone vegan leather design.',
    shortDescription: 'World First Dual Periscope. Sony LYT-900. Hasselblad Master.',
    features: [
      'Quad 50MP Main camera system featuring 2 independent periscope lenses (65mm & 135mm)',
      'Sony 1-inch second-generation LYT-900 sensor',
      'Dual-tone luxury glass and vegan leather unibody finish',
      'Qualcomm Snapdragon 8 Gen 3 with 100W SUPERVOOC charging'
    ],
    specifications: {
      'Display': '6.82-inch Quad HD+ AMOLED, 3168×1440, 4500 nits peak',
      'Processor': 'Snapdragon 8 Gen 3',
      'Rear Camera': '50MP 1-inch LYT-900 + 50MP 3x Periscope + 50MP 6x Periscope + 50MP Ultrawide',
      'Battery': '5000 mAh, 100W wired, 50W wireless'
    },
    images: PRODUCT_IMAGE_REGISTRY['oppo-find-x7-ultra'],
    storageVariants: ['256GB', '512GB'],
    badge: 'new',
    collection: 'flagship',
    tags: ['oppo', 'dual-periscope', 'hasselblad', 'camera']
  },

  {
    id: 'realme-gt-5-pro',
    name: 'Realme GT 5 Pro',
    slug: 'realme-gt-5-pro',
    brand: 'Realme',
    category: 'smartphones',
    subCategory: 'android-phones',
    price: 49999,
    originalPrice: 56999,
    rating: 4.6,
    reviewCount: 1120,
    inStock: true,
    stockCount: 25,
    description: 'Peak performance value with Snapdragon 8 Gen 3, Sony IMX890 periscope telephoto, 144Hz 1.5K display, and high-texture Red Rock vegan leather back.',
    shortDescription: 'Snapdragon 8 Gen 3. IMX890 Periscope. 5400mAh Battery.',
    features: [
      'Snapdragon 8 Gen 3 with 3VC iceberg heat dissipation',
      'Sony IMX890 periscope telephoto with optical image stabilization',
      '144Hz 1.5K 8T LTPO display with 4500 nits peak brightness',
      '5400 mAh high-density battery with 100W flash charging'
    ],
    specifications: {
      'Display': '6.78-inch 1.5K AMOLED, 2780×1264, 144Hz',
      'Processor': 'Qualcomm Snapdragon 8 Gen 3',
      'Camera': '50MP Sony LYT-808 + 50MP IMX890 Periscope + 8MP Ultrawide',
      'Battery': '5400 mAh, 100W Wired, 50W Wireless'
    },
    images: PRODUCT_IMAGE_REGISTRY['realme-gt-5-pro'],
    storageVariants: ['256GB', '512GB'],
    badge: 'sale',
    collection: 'everyday',
    tags: ['realme', 'performance', 'gaming', 'snapdragon']
  },

  {
    id: 'motorola-edge-50-ultra',
    name: 'Motorola Edge 50 Ultra',
    slug: 'motorola-edge-50-ultra',
    brand: 'Motorola',
    category: 'smartphones',
    subCategory: 'android-phones',
    price: 59999,
    originalPrice: 64999,
    rating: 4.6,
    reviewCount: 540,
    inStock: true,
    stockCount: 18,
    description: 'Art meets engineering. Handcrafted real Nordic wood and vegan leather surfaces with Pantone Validated 144Hz pOLED display, 50MP triple cameras, and 125W TurboPower.',
    shortDescription: 'Real Wood & Leather. Pantone Validated. 125W TurboPower.',
    features: [
      'Authentic real Nordic wood and vegan leather natural finishes',
      'Pantone Validated camera and display color accuracy',
      'Snapdragon 8s Gen 3 processor with Moto AI camera enhancement',
      '125W wired TurboPower + 50W wireless charging'
    ],
    specifications: {
      'Display': '6.7-inch Super HD pOLED, 2712×1220, 144Hz, 2500 nits',
      'Processor': 'Qualcomm Snapdragon 8s Gen 3',
      'Camera': '50MP Main OIS + 64MP 3x Periscope Telephoto + 50MP Ultrawide',
      'Battery': '4500 mAh, 125W TurboPower'
    },
    images: PRODUCT_IMAGE_REGISTRY['motorola-edge-50-ultra'],
    storageVariants: ['512GB'],
    badge: 'new',
    collection: 'everyday',
    tags: ['motorola', 'pantone', 'wood', 'fast-charging']
  },

  // ============================================================
  // LAPTOPS & COMPUTING
  // ============================================================
  {
    id: 'macbook-pro-14-m3',
    name: 'MacBook Pro 14" M3 Pro',
    slug: 'macbook-pro-14-m3-pro',
    brand: 'Apple',
    category: 'laptops',
    subCategory: 'laptops',
    price: 199900,
    originalPrice: 219900,
    rating: 4.9,
    reviewCount: 1456,
    inStock: true,
    stockCount: 12,
    description: 'MacBook Pro 14-inch with M3 Pro chip delivers extraordinary performance for demanding workflows. With up to 22 hours of battery life and a stunning Liquid Retina XDR display.',
    shortDescription: 'Apple M3 Pro. Liquid Retina XDR. 22h Battery.',
    features: [
      'M3 Pro chip with 12-core CPU and 18-core GPU',
      'Liquid Retina XDR display with 1600 nits peak HDR brightness',
      'Up to 22 hours battery life — highest in Mac history',
      'Hardware-accelerated ray tracing and dynamic caching'
    ],
    specifications: {
      'Display': '14.2-inch Liquid Retina XDR, 3024×1964, 120Hz ProMotion',
      'Processor': 'Apple M3 Pro (3nm)',
      'Memory': '18GB Unified Memory',
      'Storage': '512GB / 1TB SSD',
      'Battery': 'Up to 22 hours'
    },
    images: PRODUCT_IMAGE_REGISTRY['macbook-pro-14-m3'],
    badge: 'hot',
    collection: 'flagship',
    tags: ['apple', 'macbook', 'm3', 'laptop', 'pro']
  },

  {
    id: 'dell-xps-15',
    name: 'Dell XPS 15 (2024 OLED)',
    slug: 'dell-xps-15-2024',
    brand: 'Dell',
    category: 'laptops',
    subCategory: 'laptops',
    price: 159900,
    originalPrice: 174900,
    rating: 4.7,
    reviewCount: 890,
    inStock: true,
    stockCount: 9,
    description: 'Precision-crafted from CNC machined aluminum with carbon fiber palm rest, 3.5K OLED InfinityEdge touch screen, Intel Core Ultra 9, and NVIDIA GeForce RTX 4070 graphics.',
    shortDescription: 'Intel Core Ultra 9. RTX 4070. 3.5K OLED Touch.',
    features: [
      'Intel Core Ultra 9 185H with integrated Intel AI Boost NPU',
      'NVIDIA GeForce RTX 4070 8GB GDDR6 dedicated graphics',
      '15.6-inch 3.5K OLED touch display with 100% DCI-P3 color gamut',
      'Quad-speaker sound with Waves Nx 3D audio'
    ],
    specifications: {
      'Display': '15.6-inch 3.5K OLED Touch, 3456×2160, 400 nits',
      'Processor': 'Intel Core Ultra 9 185H',
      'GPU': 'NVIDIA GeForce RTX 4070 8GB',
      'RAM & Storage': '32GB DDR5 + 1TB NVMe SSD'
    },
    images: PRODUCT_IMAGE_REGISTRY['dell-xps-15'],
    badge: 'new',
    collection: 'flagship',
    tags: ['dell', 'xps', 'oled', 'laptop', 'rtx']
  },

  // ============================================================
  // TABLETS
  // ============================================================
  {
    id: 'ipad-pro-13-m4',
    name: 'iPad Pro 13" M4',
    slug: 'ipad-pro-13-m4',
    brand: 'Apple',
    category: 'tablets',
    subCategory: 'tablets',
    price: 119900,
    originalPrice: 129900,
    rating: 4.9,
    reviewCount: 890,
    inStock: true,
    stockCount: 15,
    description: 'The thinnest Apple product ever made at just 5.1mm. Features the revolutionary M4 chip, Ultra Retina XDR Tandem OLED display, and Apple Pencil Pro barrel roll and haptic feedback support.',
    shortDescription: 'Apple M4 Chip. Ultra Retina Tandem OLED. 5.1mm Thin.',
    features: [
      'Next-generation Apple M4 chip with 38 TOPS Neural Engine',
      'Ultra Retina XDR Tandem OLED with 1000 nits full-screen brightness',
      'Ultra-thin 5.1mm aerospace aluminum unibody',
      'Support for Apple Pencil Pro with barrel roll and squeeze sensors'
    ],
    specifications: {
      'Display': '13-inch Ultra Retina XDR Tandem OLED, 2752×2064, 120Hz',
      'Processor': 'Apple M4 chip (3nm)',
      'Storage': '256GB / 512GB / 1TB',
      'Weight': '579g, 5.1mm depth'
    },
    images: PRODUCT_IMAGE_REGISTRY['ipad-pro-13-m4'],
    badge: 'hot',
    collection: 'smart-living',
    tags: ['apple', 'ipad', 'm4', 'oled', 'tablet']
  },

  // ============================================================
  // AUDIO & SOUND
  // ============================================================
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless ANC',
    slug: 'sony-wh1000xm5',
    brand: 'Sony',
    category: 'audio',
    subCategory: 'headphones',
    price: 29999,
    originalPrice: 34999,
    rating: 4.9,
    reviewCount: 3820,
    inStock: true,
    stockCount: 30,
    description: 'Industry-leading noise cancellation powered by two dedicated processors and eight microphones. Delivers exceptional high-resolution audio with LDAC, crystal-clear hands-free calling, and up to 30 hours of battery life.',
    shortDescription: 'Dual Processor ANC. 30h Battery. Hi-Res LDAC Audio.',
    features: [
      'Integrated Processor V1 and HD Noise Cancelling Processor QN1',
      'Auto NC Optimizer adjusting noise cancellation based on wearing conditions',
      'Specially designed 30mm carbon fiber driver unit',
      'Multipoint Bluetooth connection to pair two devices simultaneously',
      '30-hour battery life with 3-minute quick charge giving 3 hours playback'
    ],
    specifications: {
      'Drivers': '30mm Carbon Fiber Composite',
      'Frequency Response': '4Hz – 40,000Hz (Hi-Res Audio)',
      'Battery Life': '30 hours (ANC on), 40 hours (ANC off)',
      'Codecs': 'LDAC, AAC, SBC',
      'Weight': '250g'
    },
    images: PRODUCT_IMAGE_REGISTRY['sony-wh1000xm5'],
    badge: 'bestseller',
    collection: 'audio',
    tags: ['sony', 'anc', 'headphones', 'wireless', 'audio']
  },

  {
    id: 'airpods-pro-2',
    name: 'Apple AirPods Pro (2nd Gen with USB-C)',
    slug: 'airpods-pro-2',
    brand: 'Apple',
    category: 'audio',
    subCategory: 'earbuds',
    price: 24900,
    rating: 4.8,
    reviewCount: 5200,
    inStock: true,
    stockCount: 45,
    description: 'Powered by the Apple H2 chip for up to 2x more Active Noise Cancellation, Adaptive Audio that automatically blends Transparency and ANC, and Personalized Spatial Audio with dynamic head tracking.',
    shortDescription: 'Apple H2 Chip. 2x Active Noise Cancellation. Adaptive Audio.',
    features: [
      'Apple H2 chip driving smarter noise cancellation and 3D sound',
      'Adaptive Audio blending ANC and Transparency to match your environment',
      'Personalized Spatial Audio with dynamic head tracking',
      'MagSafe Charging Case (USB-C) with speaker and lanyard loop',
      'Dust, sweat, and water resistance (IP54)'
    ],
    specifications: {
      'Processor': 'Apple H2 headphone chip, Apple U1 in case',
      'Battery': 'Up to 6 hours listening (30 hours total with case)',
      'Connectivity': 'Bluetooth 5.3, USB-C Charging',
      'Sensors': 'Skin-detect sensor, motion & speech accelerometers'
    },
    images: PRODUCT_IMAGE_REGISTRY['airpods-pro-2'],
    badge: 'hot',
    collection: 'audio',
    tags: ['apple', 'airpods', 'anc', 'earbuds', 'wireless']
  },

  {
    id: 'marshall-stanmore-3',
    name: 'Marshall Stanmore III Bluetooth Speaker',
    slug: 'marshall-stanmore-3',
    brand: 'Marshall',
    category: 'audio',
    subCategory: 'speakers',
    price: 36999,
    originalPrice: 41999,
    rating: 4.9,
    reviewCount: 940,
    inStock: true,
    stockCount: 14,
    description: 'Iconic Marshall rock-and-roll heritage. The Stanmore III delivers a wider soundstage than its predecessor with outward-angled tweeters, dynamic loudness, and signature brass control knobs.',
    shortDescription: 'Wider Stereo Soundstage. Iconic Brass Details. 80W Output.',
    features: [
      'Redesigned wider stereo soundstage filling any room with immersive sound',
      '50W Class D amplifier for woofer and two 15W Class D amplifiers for tweeters',
      'Iconic Marshall brass analogue control knobs for bass, treble, and volume',
      'Next-generation Bluetooth 5.2 with 3.5mm and RCA audio inputs'
    ],
    specifications: {
      'Power Output': '80W total output (1×50W + 2×15W Class D)',
      'Frequency Range': '45 – 20,000 Hz',
      'Inputs': 'Bluetooth 5.2, 3.5mm Aux, RCA',
      'Dimensions': '350 × 203 × 188 mm, 4.25 kg'
    },
    images: PRODUCT_IMAGE_REGISTRY['marshall-stanmore-3'],
    badge: 'new',
    collection: 'audio',
    tags: ['marshall', 'speaker', 'bluetooth', 'audio', 'luxury']
  },

  // ============================================================
  // WEARABLES & ACCESSORIES
  // ============================================================
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 (Titanium)',
    slug: 'apple-watch-ultra-2',
    brand: 'Apple',
    category: 'smartwatches',
    subCategory: 'smartwatches',
    price: 89900,
    rating: 4.9,
    reviewCount: 1210,
    inStock: true,
    stockCount: 20,
    description: 'The most capable and rugged Apple Watch ever. Crafted from lightweight aerospace titanium with a 3000-nit sapphire display, precision dual-frequency GPS, and up to 36 hours of battery life.',
    shortDescription: 'Aerospace Titanium. 3000-nit Always-On Display. Dual-GPS.',
    features: [
      '49mm aerospace-grade titanium case with raised sapphire crystal bezel',
      '3000-nit Always-On Retina display — brightest Apple display ever',
      'Precision dual-frequency GPS (L1 and L5) with Oceanic+ dive computer app',
      'Customizable high-visibility international orange Action button',
      'Up to 36 hours standard battery life, 72 hours in Low Power Mode'
    ],
    specifications: {
      'Case': '49mm Aerospace Titanium',
      'Water Resistance': '100m water resistant, 40m recreational dive (EN13319)',
      'Processor': 'S9 SiP with 4-core Neural Engine',
      'Battery': 'Up to 36h normal use, 72h low power mode'
    },
    images: PRODUCT_IMAGE_REGISTRY['apple-watch-ultra-2'],
    badge: 'hot',
    collection: 'smart-living',
    tags: ['apple', 'smartwatch', 'ultra', 'titanium', 'gps']
  },

  {
    id: 'samsung-galaxy-watch-7',
    name: 'Samsung Galaxy Watch 7',
    slug: 'samsung-galaxy-watch-7',
    brand: 'Samsung',
    category: 'smartwatches',
    subCategory: 'smartwatches',
    price: 32999,
    originalPrice: 37999,
    rating: 4.6,
    reviewCount: 840,
    inStock: true,
    stockCount: 28,
    description: 'Powered by a 3nm processor with Galaxy AI health insights, new BioActive sensor for heart rate and sleep apnea monitoring, and dual-frequency GPS in a streamlined aluminum case.',
    shortDescription: 'Galaxy AI Wellness. BioActive Sensor. 3nm Processor.',
    features: [
      'Industry-first 3nm processor for smartwatches with 3x faster performance',
      'Enhanced BioActive Sensor delivering Energy Score and sleep monitoring',
      'Dual-frequency GPS tracking across high-density urban environments',
      'Sapphire crystal glass screen with armor aluminum chassis'
    ],
    specifications: {
      'Display': '1.5-inch Super AMOLED, 480×480, Sapphire Crystal',
      'Processor': 'Exynos W1000 (3nm, 5-core)',
      'Water Resistance': '5ATM + IP68, MIL-STD-810H',
      'Battery': 'Up to 40 hours'
    },
    images: PRODUCT_IMAGE_REGISTRY['samsung-galaxy-watch-7'],
    badge: 'sale',
    collection: 'smart-living',
    tags: ['samsung', 'smartwatch', 'health', 'galaxy-ai']
  },

  {
    id: 'anker-prime-240w-gan',
    name: 'Anker Prime 240W GaN Desktop Power Station',
    slug: 'anker-prime-240w-gan',
    brand: 'Anker',
    category: 'accessories',
    subCategory: 'accessories',
    price: 14999,
    originalPrice: 17999,
    rating: 4.8,
    reviewCount: 650,
    inStock: true,
    stockCount: 40,
    description: 'The ultimate desktop power station. Powered by Anker GaNPrime technology, offering 240W total output across 3 USB-C and 1 USB-A ports to fast-charge 2 laptops and 2 phones simultaneously.',
    shortDescription: '240W Total Power. GaNPrime. Dual 140W USB-C Outputs.',
    features: [
      '240W maximum output with single USB-C port delivering up to 140W',
      'Charge two MacBook Pro laptops at rapid speed simultaneously',
      'ActiveShield 2.0 temperature monitoring safeguarding connected devices',
      'Ultra-compact vertical desktop stand design with braided detachable power cord'
    ],
    specifications: {
      'Total Wattage': '240W Max',
      'Ports': '3× USB-C + 1× USB-A',
      'Output Split': 'USB-C1: 140W, USB-C2: 100W, USB-C3: 65W, USB-A: 22.5W',
      'Technology': 'GaNPrime & ActiveShield 2.0'
    },
    images: PRODUCT_IMAGE_REGISTRY['anker-prime-240w-gan'],
    badge: 'new',
    collection: 'accessories',
    tags: ['anker', 'gan', 'charger', 'usb-c', 'power']
  }
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find(p => p.slug === slug);

export const getProductsByCategory = (category: string): Product[] => {
  const cat = category.toLowerCase();
  return products.filter(p =>
    p.category.toLowerCase() === cat ||
    p.subCategory?.toLowerCase() === cat ||
    p.tags.includes(cat)
  );
};

export const getProductsByCollection = (collection: string): Product[] =>
  products.filter(p => p.collection === collection);

export const getFeaturedProducts = (): Product[] =>
  products.filter(p => p.badge).slice(0, 8);

export const getNewLaunches = (): Product[] =>
  products.filter(p => p.badge === 'new' || p.badge === 'hot').slice(0, 4);

export const getBestsellers = (): Product[] =>
  products.filter(p => p.badge === 'bestseller' || p.rating >= 4.8).slice(0, 8);

export const getRelatedProducts = (product: Product, limit = 4): Product[] =>
  products
    .filter(p => (p.category === product.category || p.brand === product.brand) && p.id !== product.id)
    .slice(0, limit);
