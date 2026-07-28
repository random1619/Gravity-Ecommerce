# ⚡ Gravity-Ecommerce (GRAVITY)

> **GRAVITY** is a high-end, luxury streetwear e-commerce platform built with Next.js 16 (App Router), React 19, and TypeScript. Featuring a warm earthy palette, sleek obsidian dark mode, smooth micro-interactions, and context-driven application state, GRAVITY delivers a premium digital shopping experience.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<br/>

![](https://github-readme-stats.vercel.app/api/pin/?username=random1619&repo=Gravity-Ecommerce&theme=radical&show_icons=true)

---

## ✨ Features

### 🛍️ E-Commerce & Product Discovery
- **Dynamic Catalog & Filtering**: Browse products by category, tag, price range, and sort order with instant real-time updates.
- **Product Detail Pages**: Detailed views with gallery previews, size selector, stock counters, product highlights, and customer review star ratings.
- **Interactive Quick View & Reels**: Instant modal previews for items and video/image story reels.
- **Editorial Lookbook & Collections**: Curated seasonal campaigns, lookbook galleries, and featured drops.

### 🛒 Shopping Experience & Cart
- **Sliding Cart Drawer**: Fast slide-out cart with subtotal calculation, quantity adjustments, free-shipping progress indicators, and promo code inputs.
- **Wishlist & Recently Viewed**: One-click bookmarking and history tracking saved to persistent storage.
- **Simulated Checkout Flow**: Full checkout experience including shipping address input, discount code application, and order confirmation summary.

### 👤 User Account & Loyalty
- **Modal Authentication**: Fast customer login and registration modal with client-side state management.
- **Account Dashboard**: Order history tracking, address management, and customer profile preferences.
- **Rewards & Discounts**: Special discount page, student ID verification system, and loyalty points breakdown.

### 🎨 Design & Interactivity
- **Dual Aesthetic Theming**: Seamless switching between Light (*Parchment & Charcoal*) and Dark (*Obsidian Noir & Warm Gold*) modes using CSS variables.
- **Custom Cursor & Micro-Interactions**: Dynamic fine-pointer tracking, magnetic buttons, marquee scrolling, and smooth scroll reveals.
- **Toast Notification System**: Lightweight contextual alert notifications for cart, wishlist, and authentication actions.
- **Fully Responsive**: Mobile-first responsive layout with dedicated navigation drawer and touch-friendly controls.

### 🚀 SEO & Optimization
- **Next.js App Router Metadata**: Per-page dynamic titles, open-graph tags, and metadata templates.
- **Automated Sitemap & Robots**: Native `sitemap.ts` and `robots.ts` generation for optimal search engine indexing.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | Vanilla CSS Modules (`.module.css`) + SCSS Custom Properties |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations** | Custom CSS Keyframes & Framer Motion |
| **State Management** | React Context API (`ThemeProvider`, `AuthProvider`, `CartProvider`, `WishlistProvider`, `RecentlyViewedProvider`, `ToastProvider`) |

---

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages & API routes
│   ├── about/                # Brand story & identity
│   ├── blog/                 # Editorial articles & streetwear journal
│   ├── cart/                 # Full shopping cart page
│   ├── checkout/             # Checkout process & order review
│   ├── collections/          # Seasonal drops & collection showcases
│   ├── discount/             # Student verification & promo codes
│   ├── faq/                  # Frequently asked questions
│   ├── gift-cards/           # Digital gift card selection
│   ├── lookbook/             # Interactive visual campaign gallery
│   ├── orders/               # User order history
│   ├── product/[id]/         # Dynamic product details page
│   ├── rewards/              # Customer loyalty program
│   ├── settings/             # User preferences & address book
│   ├── shipping-returns/     # Delivery policies & return guide
│   ├── shop/                 # Product catalog & filter engine
│   ├── sustainability/       # Eco-friendly & ethical production info
│   ├── wishlist/             # Bookmarked items page
│   ├── globals.css           # CSS design tokens & custom properties
│   ├── sitemap.ts            # Dynamic search engine sitemap
│   └── robots.ts             # Robots crawler configuration
├── components/
│   ├── layout/               # Navbar & Footer
│   └── ui/                   # Reusable UI components (Button, Modal, ProductCard, CartDrawer, etc.)
├── hooks/                    # Custom React hooks (useFocusTrap, useReducedMotion)
└── lib/                      # React Context providers, mock data & utility helpers
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/random1619/gravity-commerce.git
   cd gravity-commerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the site.

---

## 📜 Available Scripts

- `npm run dev` – Starts the Next.js development server on port 3000.
- `npm run build` – Creates an optimized production build of the app.
- `npm run start` – Starts the production server.
- `npm run lint` – Runs ESLint checks across all TypeScript and React files.

---

## 📄 License

This project is created for demonstration and educational purposes. All rights reserved.
