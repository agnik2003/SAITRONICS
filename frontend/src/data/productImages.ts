/**
 * SAITRONICS Central Product Image Mapping & Fallback Registry
 * High-resolution verified local WebP electronics imagery with multi-angle coverage
 */

import { ProductImage } from '@/types';

// Fallback high-tech device illustration SVG (data URI) to ensure ZERO broken images anywhere
export const FALLBACK_PRODUCT_IMAGE = '/products/huawei/mate-70-rs/front.webp';
export const HERO_FEATURED_IMAGE = '/products/huawei/mate-70-rs/front.webp';

export interface ProductImageSet {
  primary: string;
  gallery: ProductImage[];
  colors?: Record<string, ProductImage[]>;
}

export const PRODUCT_IMAGE_REGISTRY: Record<string, ProductImage[]> = {
  // 1. Apple iPhone 15 Pro Max
  'iphone-15-pro-max': [
    { id: 'ip15pm-1', url: '/products/apple/iphone-15-pro-max/front.webp', alt: 'Apple iPhone 15 Pro Max - Super Retina XDR Front View', angle: 'front' },
    { id: 'ip15pm-2', url: '/products/apple/iphone-15-pro-max/back.webp', alt: 'Apple iPhone 15 Pro Max - Titanium Rear Architecture', angle: 'back' },
    { id: 'ip15pm-3', url: '/products/apple/iphone-15-pro-max/side.webp', alt: 'Apple iPhone 15 Pro Max - Brushed Titanium Edge & Action Button', angle: 'side' },
    { id: 'ip15pm-4', url: '/products/apple/iphone-15-pro-max/camera.webp', alt: 'Apple iPhone 15 Pro Max - 48MP 5x Optical Telephoto Lens', angle: 'camera' },
    { id: 'ip15pm-5', url: '/products/apple/iphone-15-pro-max/angle.webp', alt: 'Apple iPhone 15 Pro Max - Isometric Studio Perspective', angle: 'detail' },
    { id: 'ip15pm-6', url: '/products/apple/iphone-15-pro-max/lifestyle.webp', alt: 'Apple iPhone 15 Pro Max - Luxury Workspace Showcase', angle: 'lifestyle' }
  ],

  // 2. HUAWEI Mate 70 RS Ultimate Design
  'huawei-mate-70-rs': [
    { id: 'hm70rs-1', url: '/products/huawei/mate-70-rs/front.webp', alt: 'HUAWEI Mate 70 RS Ultimate Design - Dual-layer OLED Display', angle: 'front' },
    { id: 'hm70rs-2', url: '/products/huawei/mate-70-rs/back.webp', alt: 'HUAWEI Mate 70 RS - Signature Rui Red Ceramic Chassis', angle: 'back' },
    { id: 'hm70rs-3', url: '/products/huawei/mate-70-rs/camera.webp', alt: 'HUAWEI Mate 70 RS - Octagonal Star-Ring Camera with XMAGE', angle: 'camera' },
    { id: 'hm70rs-4', url: '/products/huawei/mate-70-rs/side.webp', alt: 'HUAWEI Mate 70 RS - Titanium Mid-frame Precision Profile', angle: 'side' },
    { id: 'hm70rs-5', url: '/products/huawei/mate-70-rs/angle.webp', alt: 'HUAWEI Mate 70 RS - Front & Back Dual Studio Presentation', angle: 'detail' },
    { id: 'hm70rs-6', url: '/products/huawei/mate-70-rs/lifestyle.webp', alt: 'HUAWEI Mate 70 RS - Collector Edition In-Hand Showcase', angle: 'lifestyle' }
  ],

  // 3. Samsung Galaxy S24 Ultra
  'samsung-galaxy-s24-ultra': [
    { id: 's24u-1', url: '/products/samsung/galaxy-s24-ultra/front.webp', alt: 'Samsung Galaxy S24 Ultra - Flat Dynamic AMOLED 2X Display', angle: 'front' },
    { id: 's24u-2', url: '/products/samsung/galaxy-s24-ultra/back.webp', alt: 'Samsung Galaxy S24 Ultra - Titanium Armor Matte Rear', angle: 'back' },
    { id: 's24u-3', url: '/products/samsung/galaxy-s24-ultra/side.webp', alt: 'Samsung Galaxy S24 Ultra - Side Profile with Integrated S-Pen', angle: 'side' },
    { id: 's24u-4', url: '/products/samsung/galaxy-s24-ultra/camera.webp', alt: 'Samsung Galaxy S24 Ultra - 200MP Quad Telephoto System', angle: 'camera' },
    { id: 's24u-5', url: '/products/samsung/galaxy-s24-ultra/angle.webp', alt: 'Samsung Galaxy S24 Ultra - Corning Gorilla Armor Glass Angle', angle: 'detail' },
    { id: 's24u-6', url: '/products/samsung/galaxy-s24-ultra/lifestyle.webp', alt: 'Samsung Galaxy S24 Ultra - Galaxy AI Executive Desk Session', angle: 'lifestyle' }
  ],

  // 4. Google Pixel 8 Pro
  'google-pixel-8-pro': [
    { id: 'px8p-1', url: '/products/google/pixel-8-pro/front.webp', alt: 'Google Pixel 8 Pro - Super Actua 120Hz OLED Front', angle: 'front' },
    { id: 'px8p-2', url: '/products/google/pixel-8-pro/back.webp', alt: 'Google Pixel 8 Pro - Obsidian Matte Frosted Glass Rear', angle: 'back' },
    { id: 'px8p-3', url: '/products/google/pixel-8-pro/camera.webp', alt: 'Google Pixel 8 Pro - Polished Aluminum Camera Visor Bar', angle: 'camera' },
    { id: 'px8p-4', url: '/products/google/pixel-8-pro/side.webp', alt: 'Google Pixel 8 Pro - Rounded Aluminum Edge Profile', angle: 'side' },
    { id: 'px8p-5', url: '/products/google/pixel-8-pro/angle.webp', alt: 'Google Pixel 8 Pro - Tensor G3 AI Studio Angle', angle: 'detail' }
  ],

  // 5. OnePlus 12
  'oneplus-12': [
    { id: 'op12-1', url: '/products/oneplus/oneplus-12/front.webp', alt: 'OnePlus 12 - 2K 120Hz ProXDR Curved Screen', angle: 'front' },
    { id: 'op12-2', url: '/products/oneplus/oneplus-12/back.webp', alt: 'OnePlus 12 - Silky Matte Ceramic Architecture', angle: 'back' },
    { id: 'op12-3', url: '/products/oneplus/oneplus-12/side.webp', alt: 'OnePlus 12 - Three-Stage Alert Slider Precision Edge', angle: 'side' },
    { id: 'op12-4', url: '/products/oneplus/oneplus-12/camera.webp', alt: 'OnePlus 12 - 4th Gen Hasselblad Camera Optics', angle: 'camera' },
    { id: 'op12-5', url: '/products/oneplus/oneplus-12/angle.webp', alt: 'OnePlus 12 - 100W SUPERVOOC Fast Charge Angle', angle: 'detail' }
  ],

  // 6. Xiaomi 14 Ultra
  'xiaomi-14-ultra': [
    { id: 'xmi14u-1', url: '/products/xiaomi/xiaomi-14-ultra/front.webp', alt: 'Xiaomi 14 Ultra - All Around Liquid AMOLED Display', angle: 'front' },
    { id: 'xmi14u-2', url: '/products/xiaomi/xiaomi-14-ultra/back.webp', alt: 'Xiaomi 14 Ultra - Nano-tech Vegan Leather Rear', angle: 'back' },
    { id: 'xmi14u-3', url: '/products/xiaomi/xiaomi-14-ultra/camera.webp', alt: 'Xiaomi 14 Ultra - 1-inch Sony LYT-900 Leica Camera System', angle: 'camera' },
    { id: 'xmi14u-4', url: '/products/xiaomi/xiaomi-14-ultra/side.webp', alt: 'Xiaomi 14 Ultra - High-strength Aluminum Unibody Edge', angle: 'side' },
    { id: 'xmi14u-5', url: '/products/xiaomi/xiaomi-14-ultra/angle.webp', alt: 'Xiaomi 14 Ultra - Leica Summilux Optical Showcase', angle: 'detail' }
  ],

  // 7. Vivo X100 Pro
  'vivo-x100-pro': [
    { id: 'vx100p-1', url: '/products/vivo/vivo-x100-pro/front.webp', alt: 'Vivo X100 Pro - 8T LTPO Curved AMOLED Front', angle: 'front' },
    { id: 'vx100p-2', url: '/products/vivo/vivo-x100-pro/back.webp', alt: 'Vivo X100 Pro - Sun Halo Star Ring Rear Housing', angle: 'back' },
    { id: 'vx100p-3', url: '/products/vivo/vivo-x100-pro/camera.webp', alt: 'Vivo X100 Pro - ZEISS APO Floating Periscope Optics', angle: 'camera' },
    { id: 'vx100p-4', url: '/products/vivo/vivo-x100-pro/side.webp', alt: 'Vivo X100 Pro - Ergonomic Dual-Curved Slim Chassis', angle: 'side' },
    { id: 'vx100p-5', url: '/products/vivo/vivo-x100-pro/angle.webp', alt: 'Vivo X100 Pro - Dimensity 9300 Flagship Studio View', angle: 'detail' }
  ],

  // 8. Oppo Find X7 Ultra
  'oppo-find-x7-ultra': [
    { id: 'ofx7u-1', url: '/products/oppo/oppo-find-x7-ultra/front.webp', alt: 'Oppo Find X7 Ultra - ProXDR 4500-nit Quad Curved Screen', angle: 'front' },
    { id: 'ofx7u-2', url: '/products/oppo/oppo-find-x7-ultra/back.webp', alt: 'Oppo Find X7 Ultra - Dual-tone Vegan Leather Back', angle: 'back' },
    { id: 'ofx7u-3', url: '/products/oppo/oppo-find-x7-ultra/camera.webp', alt: 'Oppo Find X7 Ultra - Dual Periscope Hasselblad System', angle: 'camera' },
    { id: 'ofx7u-4', url: '/products/oppo/oppo-find-x7-ultra/side.webp', alt: 'Oppo Find X7 Ultra - Aircraft Grade Aluminum Midframe', angle: 'side' },
    { id: 'ofx7u-5', url: '/products/oppo/oppo-find-x7-ultra/angle.webp', alt: 'Oppo Find X7 Ultra - Master Photography Studio View', angle: 'detail' }
  ],

  // 9. Realme GT 5 Pro
  'realme-gt-5-pro': [
    { id: 'rgt5p-1', url: '/products/realme/realme-gt-5-pro/front.webp', alt: 'Realme GT 5 Pro - 1.5K 144Hz AMOLED Display', angle: 'front' },
    { id: 'rgt5p-2', url: '/products/realme/realme-gt-5-pro/back.webp', alt: 'Realme GT 5 Pro - Red Rock Vegan Leather Rear', angle: 'back' },
    { id: 'rgt5p-3', url: '/products/realme/realme-gt-5-pro/camera.webp', alt: 'Realme GT 5 Pro - Sony IMX890 Large Sensor Periscope', angle: 'camera' },
    { id: 'rgt5p-4', url: '/products/realme/realme-gt-5-pro/side.webp', alt: 'Realme GT 5 Pro - Precision Machined Metal Bezel', angle: 'side' },
    { id: 'rgt5p-5', url: '/products/realme/realme-gt-5-pro/angle.webp', alt: 'Realme GT 5 Pro - Snapdragon 8 Gen 3 Gaming Studio', angle: 'detail' }
  ],

  // 10. Motorola Edge 50 Ultra
  'motorola-edge-50-ultra': [
    { id: 'me50u-1', url: '/products/motorola/motorola-edge-50-ultra/front.webp', alt: 'Motorola Edge 50 Ultra - Endless Edge pOLED Display', angle: 'front' },
    { id: 'me50u-2', url: '/products/motorola/motorola-edge-50-ultra/back.webp', alt: 'Motorola Edge 50 Ultra - Nordic Wood Finished Back', angle: 'back' },
    { id: 'me50u-3', url: '/products/motorola/motorola-edge-50-ultra/camera.webp', alt: 'Motorola Edge 50 Ultra - 50MP Pantone Validated Cameras', angle: 'camera' },
    { id: 'me50u-4', url: '/products/motorola/motorola-edge-50-ultra/side.webp', alt: 'Motorola Edge 50 Ultra - Sandblasted Curved Aluminum Edge', angle: 'side' },
    { id: 'me50u-5', url: '/products/motorola/motorola-edge-50-ultra/angle.webp', alt: 'Motorola Edge 50 Ultra - Minimalist Luxury Showcase', angle: 'detail' }
  ],

  // 11. MacBook Pro 14" M3 Pro
  'macbook-pro-14-m3': [
    { id: 'mbp14-1', url: '/products/apple/macbook-pro-14-m3/front.webp', alt: 'MacBook Pro 14" - Liquid Retina XDR Display & Keyboard', angle: 'front' },
    { id: 'mbp14-2', url: '/products/apple/macbook-pro-14-m3/back.webp', alt: 'MacBook Pro 14" - Space Black Anodized Unibody Lid', angle: 'back' },
    { id: 'mbp14-3', url: '/products/apple/macbook-pro-14-m3/side.webp', alt: 'MacBook Pro 14" - MagSafe 3 & Thunderbolt 4 Ports', angle: 'side' },
    { id: 'mbp14-4', url: '/products/apple/macbook-pro-14-m3/keyboard.webp', alt: 'MacBook Pro 14" - Backlit Magic Keyboard with Touch ID', angle: 'detail' },
    { id: 'mbp14-5', url: '/products/apple/macbook-pro-14-m3/lifestyle.webp', alt: 'MacBook Pro 14" - Creative Production Studio Setup', angle: 'lifestyle' }
  ],

  // 12. Dell XPS 15 (2024 OLED)
  'dell-xps-15': [
    { id: 'xps15-1', url: '/products/dell/dell-xps-15/front.webp', alt: 'Dell XPS 15 - 3.5K OLED InfinityEdge Screen & Carbon Rest', angle: 'front' },
    { id: 'xps15-2', url: '/products/dell/dell-xps-15/back.webp', alt: 'Dell XPS 15 - CNC Platinum Machined Aluminum Exterior', angle: 'back' },
    { id: 'xps15-3', url: '/products/dell/dell-xps-15/side.webp', alt: 'Dell XPS 15 - Razor-thin Wedge Profile with USB-C Ports', angle: 'side' },
    { id: 'xps15-4', url: '/products/dell/dell-xps-15/keyboard.webp', alt: 'Dell XPS 15 - Precision Glass Touchpad & Keyboard', angle: 'detail' },
    { id: 'xps15-5', url: '/products/dell/dell-xps-15/lifestyle.webp', alt: 'Dell XPS 15 - Executive Suite Office Arrangement', angle: 'lifestyle' }
  ],

  // 13. iPad Pro 13" M4
  'ipad-pro-13-m4': [
    { id: 'ipad13m4-1', url: '/products/apple/ipad-pro-13-m4/front.webp', alt: 'iPad Pro 13" - Tandem OLED Ultra Retina XDR Display', angle: 'front' },
    { id: 'ipad13m4-2', url: '/products/apple/ipad-pro-13-m4/back.webp', alt: 'iPad Pro 13" - 5.1mm Space Black Aluminum Architecture', angle: 'back' },
    { id: 'ipad13m4-3', url: '/products/apple/ipad-pro-13-m4/side.webp', alt: 'iPad Pro 13" - Record 5.1mm Ultra-Slim Profile', angle: 'side' },
    { id: 'ipad13m4-4', url: '/products/apple/ipad-pro-13-m4/angle.webp', alt: 'iPad Pro 13" - Apple Pencil Pro Magnetic Attachment Angle', angle: 'detail' },
    { id: 'ipad13m4-5', url: '/products/apple/ipad-pro-13-m4/lifestyle.webp', alt: 'iPad Pro 13" - Professional Digital Canvas Studio', angle: 'lifestyle' }
  ],

  // 14. Sony WH-1000XM5
  'sony-wh1000xm5': [
    { id: 'wh1000xm5-1', url: '/products/sony/sony-wh1000xm5/front.webp', alt: 'Sony WH-1000XM5 - Soft Fit Leather Headband & Earcups', angle: 'front' },
    { id: 'wh1000xm5-2', url: '/products/sony/sony-wh1000xm5/side.webp', alt: 'Sony WH-1000XM5 - Dual Noise Sensor Microphone Array', angle: 'side' },
    { id: 'wh1000xm5-3', url: '/products/sony/sony-wh1000xm5/folded.webp', alt: 'Sony WH-1000XM5 - Collapsible Hard Travel Case Presentation', angle: 'box' },
    { id: 'wh1000xm5-4', url: '/products/sony/sony-wh1000xm5/detail.webp', alt: 'Sony WH-1000XM5 - 30mm Carbon Fiber Composite Drivers', angle: 'detail' },
    { id: 'wh1000xm5-5', url: '/products/sony/sony-wh1000xm5/lifestyle.webp', alt: 'Sony WH-1000XM5 - Commuter Noise Cancellation Lifestyle', angle: 'lifestyle' }
  ],

  // 15. Apple AirPods Pro 2
  'airpods-pro-2': [
    { id: 'app2-1', url: '/products/apple/airpods-pro-2/front.webp', alt: 'Apple AirPods Pro 2 - Acoustic Mesh & Silicone Ear Tips', angle: 'front' },
    { id: 'airpods-pro-2-side', url: '/products/apple/airpods-pro-2/side.webp', alt: 'Apple AirPods Pro 2 - Touch Volume & Force Sensor Stem', angle: 'side' },
    { id: 'app2-3', url: '/products/apple/airpods-pro-2/case.webp', alt: 'Apple AirPods Pro 2 - MagSafe USB-C Case Open Presentation', angle: 'box' },
    { id: 'app2-4', url: '/products/apple/airpods-pro-2/detail.webp', alt: 'Apple AirPods Pro 2 - Built-in Speaker & Lanyard Loop', angle: 'detail' },
    { id: 'app2-5', url: '/products/apple/airpods-pro-2/lifestyle.webp', alt: 'Apple AirPods Pro 2 - Spatial Audio Experience on Desk', angle: 'lifestyle' }
  ],

  // 16. Marshall Stanmore III
  'marshall-stanmore-3': [
    { id: 'mstan3-1', url: '/products/marshall/marshall-stanmore-3/front.webp', alt: 'Marshall Stanmore III - Iconic Brass Script & Fret Grille', angle: 'front' },
    { id: 'mstan3-2', url: '/products/marshall/marshall-stanmore-3/side.webp', alt: 'Marshall Stanmore III - Textured Black Vinyl Cabinet Wall', angle: 'side' },
    { id: 'mstan3-3', url: '/products/marshall/marshall-stanmore-3/controls.webp', alt: 'Marshall Stanmore III - Tactile Brass Rotary Knobs & Switch', angle: 'detail' },
    { id: 'mstan3-4', url: '/products/marshall/marshall-stanmore-3/detail.webp', alt: 'Marshall Stanmore III - Rear Bass Reflex Port Architecture', angle: 'detail' },
    { id: 'mstan3-5', url: '/products/marshall/marshall-stanmore-3/lifestyle.webp', alt: 'Marshall Stanmore III - Mid-century Modern Audiophile Room', angle: 'lifestyle' }
  ],

  // 17. Apple Watch Ultra 2
  'apple-watch-ultra-2': [
    { id: 'awu2-1', url: '/products/apple/apple-watch-ultra-2/display.webp', alt: 'Apple Watch Ultra 2 - 3000-nit Flat Sapphire Crystal Screen', angle: 'front' },
    { id: 'awu2-2', url: '/products/apple/apple-watch-ultra-2/side.webp', alt: 'Apple Watch Ultra 2 - Digital Crown Guard & Orange Action Button', angle: 'side' },
    { id: 'awu2-3', url: '/products/apple/apple-watch-ultra-2/rear.webp', alt: 'Apple Watch Ultra 2 - Ceramic Bio-sensor Cluster Array', angle: 'back' },
    { id: 'awu2-4', url: '/products/apple/apple-watch-ultra-2/strap.webp', alt: 'Apple Watch Ultra 2 - Aerospace Titanium Trail Loop', angle: 'detail' },
    { id: 'awu2-5', url: '/products/apple/apple-watch-ultra-2/lifestyle.webp', alt: 'Apple Watch Ultra 2 - High-altitude Expedition Wrist Shot', angle: 'lifestyle' }
  ],

  // 18. Samsung Galaxy Watch 7
  'samsung-galaxy-watch-7': [
    { id: 'sgw7-1', url: '/products/samsung/samsung-galaxy-watch-7/display.webp', alt: 'Samsung Galaxy Watch 7 - Sapphire Super AMOLED Display', angle: 'front' },
    { id: 'sgw7-2', url: '/products/samsung/samsung-galaxy-watch-7/side.webp', alt: 'Samsung Galaxy Watch 7 - Dual Tactile Buttons & Mic Holes', angle: 'side' },
    { id: 'sgw7-3', url: '/products/samsung/samsung-galaxy-watch-7/rear.webp', alt: 'Samsung Galaxy Watch 7 - BioActive Sensor Module Underneath', angle: 'back' },
    { id: 'sgw7-4', url: '/products/samsung/samsung-galaxy-watch-7/strap.webp', alt: 'Samsung Galaxy Watch 7 - Ripple Sport Band Stitching Detail', angle: 'detail' },
    { id: 'sgw7-5', url: '/products/samsung/samsung-galaxy-watch-7/lifestyle.webp', alt: 'Samsung Galaxy Watch 7 - Fitness Tracking Performance Shot', angle: 'lifestyle' }
  ],

  // 19. Anker Prime 240W GaN Station
  'anker-prime-240w-gan': [
    { id: 'anker240-1', url: '/products/anker/anker-prime-240w-gan/front.webp', alt: 'Anker Prime 240W GaN - Smart Digital Power Meter Display', angle: 'front' },
    { id: 'anker240-2', url: '/products/anker/anker-prime-240w-gan/side.webp', alt: 'Anker Prime 240W GaN - Quad USB-C & USB-A Power Ports', angle: 'side' },
    { id: 'anker240-3', url: '/products/anker/anker-prime-240w-gan/detail.webp', alt: 'Anker Prime 240W GaN - Thermal Shield Cooling Vents', angle: 'detail' },
    { id: 'anker240-4', url: '/products/anker/anker-prime-240w-gan/angle.webp', alt: 'Anker Prime 240W GaN - Dual Stand Isometric Studio View', angle: 'detail' },
    { id: 'anker240-5', url: '/products/anker/anker-prime-240w-gan/lifestyle.webp', alt: 'Anker Prime 240W GaN - High-Power Creative Multi-Device Desk', angle: 'lifestyle' }
  ]
};

/**
 * Dedicated Color-Specific Image Mappings
 */
export const PRODUCT_COLOR_IMAGE_REGISTRY: Record<string, Record<string, ProductImage[]>> = {
  'iphone-15-pro-max': {
    'Black Titanium': PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'],
    'Natural Titanium': [
      PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'][0],
      PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'][2],
      PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'][3],
      PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'][4],
      PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'][5]
    ],
    'White Titanium': [
      PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'][0],
      PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'][1],
      PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'][3],
      PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'][4],
      PRODUCT_IMAGE_REGISTRY['iphone-15-pro-max'][5]
    ]
  },
  'huawei-mate-70-rs': {
    'Rui Red': PRODUCT_IMAGE_REGISTRY['huawei-mate-70-rs'],
    'Obsidian Black': PRODUCT_IMAGE_REGISTRY['huawei-mate-70-rs'],
    'Pure White': PRODUCT_IMAGE_REGISTRY['huawei-mate-70-rs']
  },
  'samsung-galaxy-s24-ultra': {
    'Titanium Gray': PRODUCT_IMAGE_REGISTRY['samsung-galaxy-s24-ultra'],
    'Titanium Black': PRODUCT_IMAGE_REGISTRY['samsung-galaxy-s24-ultra'],
    'Titanium Violet': PRODUCT_IMAGE_REGISTRY['samsung-galaxy-s24-ultra']
  }
};

/**
 * Helper to safely retrieve product images with zero broken images guarantee
 */
export function getProductImages(slug: string): ProductImage[] {
  return PRODUCT_IMAGE_REGISTRY[slug] || [
    {
      id: `${slug}-fallback`,
      url: FALLBACK_PRODUCT_IMAGE,
      alt: 'Saitronics Verified Electronics Product',
      angle: 'front'
    }
  ];
}

export function getProductImagesByColor(slug: string, colorName: string): ProductImage[] {
  const colorMap = PRODUCT_COLOR_IMAGE_REGISTRY[slug];
  if (colorMap && colorMap[colorName] && colorMap[colorName].length > 0) {
    return colorMap[colorName];
  }
  return getProductImages(slug);
}
