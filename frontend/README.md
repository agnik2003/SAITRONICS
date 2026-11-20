# SAITRONICS — Luxury Consumer Electronics Flagship

A state-of-the-art frontend e-commerce platform and live retail management portal built for **Saitronics**, featuring a signature black-and-crimson identity, high-precision 3D device staging, real-time cross-tab inventory synchronization, and zero third-party dependencies.

---

## Key Highlights

* **Cinematic 3D Hero Showcase**: 8-layer composite device stage with 1200px CSS perspective, real-time mouse spring physics, ambient radial glow, 3D orbit ring, floor reflection, specular light sweeps, and responsive typography with zero layout shifts.
* **Complete Admin Management Portal (`/admin`)**: Fully functional retail suite with 12 dedicated sections (Dashboard, Products, Categories, Brands, Inventory, Orders, Customers, Coupons, Reviews, Website Content, Reports, and Settings).
* **Zero-Latency Cross-Tab Sync Engine**: All admin modifications (pricing, stock adjustments, hero slides, banner alerts, publishing status) propagate instantaneously across tabs through a unified Zustand storage event bus.
* **End-to-End Commerce Flow**: Interactive product detail pages with storage/color variant selector, dynamic pricing calculations, interactive cart drawer, wishlist toggle, coupon engine, checkout, and order history with printable invoices.
* **Strict Design Identity**: Pure dark luxury aesthetic (`#090909`, `#121212`, crimson `#E50924`), Lucide React SVG iconography exclusively, and zero emojis throughout the codebase.

---

## Admin Portal Access

The admin portal is pre-configured with demo credentials for seamless client review:

* **URL**: `/admin` (e.g., `http://localhost:3000/admin`)
* **Admin ID**: `saitronics`
* **Password**: `saitronics`

> **Live Sync Demo**: Open the storefront (`/`) in one browser tab and the admin portal (`/admin`) in a second tab. Edit any product title, hero banner, or stock count in the admin portal and watch it update immediately on the storefront tab without refreshing the page.

---

## Admin Portal Modules

1. **Dashboard**: Live GMV, revenue charts, order statistics, stock velocity, and quick action shortcuts.
2. **Products**: Complete product catalogue matrix with status filters, search, inline editing, and multi-variant support.
3. **Categories & Brands**: Full taxonomy management with hierarchy, icons, and slug generation.
4. **Inventory**: Stock count tracking, low-stock threshold alerts, restock logs, and SKU adjustments.
5. **Orders**: Order processing matrix, status workflows (Pending, Processing, Shipped, Delivered, Cancelled), and printable luxury customer invoices.
6. **Customers**: Customer profile directory with order histories, total lifetime spend, and status badges.
7. **Coupons**: Promotional discount code builder (percentage or fixed amount), validity dates, and minimum order requirements.
8. **Reviews**: Customer review moderation table with star ratings, verified buyer badges, and visibility toggles.
9. **Website Content**: Live hero carousel slide builder, announcement bar text/link editor, and homepage showcase manager.
10. **Reports**: Revenue breakdown, top selling devices, inventory turnover rate, and tax calculation metrics.
11. **Settings**: Store physical address, support email, phone numbers, showroom hours, and social media links.

---

## Tech Stack

* **Framework**: Next.js 14 (App Router)
* **Library**: React 18
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **State Management & Persistence**: Zustand with `persist` middleware & custom cross-tab sync engine
* **Motion & Physics**: Framer Motion & requestAnimationFrame spring hooks
* **Icons**: Lucide React
* **Specification Document**: See `PROJECT SCOPE SAITRONICS.pdf`

---

## Getting Started

### Prerequisites
* Node.js 18.17 or higher
* npm, pnpm, or yarn

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/agnik2003/SAITRONICS.git
   cd SAITRONICS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Open your browser:
   * **Storefront**: [http://localhost:3000](http://localhost:3000)
   * **Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)

### Production Build & Verification

```bash
# Typecheck verification
npm run build
```

---

## License

Proprietary — Developed for Saitronics. All rights reserved.
