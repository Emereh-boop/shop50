# YNT Store Frontend (Svelte SPA) – Landmark Update (March)

This is the Svelte-based frontend for the YNT e-commerce platform. This README marks a major project milestone, summarizing all features, architecture, and recent progress.

---

## Overview
- Modern, mobile-first e-commerce SPA
- Built with Svelte, Tailwind CSS, and svelte-spa-router
- Secure authentication, robust admin protection, and a clean, modular codebase

---

## Directory Structure

```
frontend/
├── src/
│   ├── components/         # Svelte UI components (layout, product, admin, etc.)
│   ├── pages/              # Page-level Svelte components (admin, user, etc.)
│   ├── routes/             # SPA route entrypoints (+page.svelte)
│   ├── stores/             # Svelte stores (user, cart, admin, etc.)
│   ├── styles/             # CSS (Tailwind, responsive)
│   ├── utils/              # Utility JS
│   └── main.js             # App entrypoint
├── public/                 # Static assets
├── index.html
└── package.json
```

---

## Setup & Development

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Install & Run
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173` by default.

### Build for Production
```bash
npm run build
npm run preview
```

---

## Features

### User
- Register, login, logout (JWT, secure)
- Browse, search, and filter products
- Add to cart, update cart, checkout
- View order history
- Responsive design (mobile-first)
- Dark mode

### Admin
- Admin-only dashboard and management pages (products, users, orders, banners, coupons, shipping)
- Add/edit/delete products
- Manage users and roles
- View and manage orders
- Upload product images
- All admin routes are protected (via RequireAdmin wrapper and store-based guard)

### UI/UX
- 2-column product grid on mobile, tight card sizing, no overflow
- Cart summary always visible on all mobile sizes
- Modern, accessible, and fast

---

## What's New & Different (Landmark March Update)
- **Unified user/auth store:** All user and admin logic now uses a single Svelte store for reliability
- **Robust admin protection:** Admin routes use a wrapper component (`RequireAdmin`) for real-time, reactive access control
- **Mobile grid improvements:** Product grid is now 2-column on mobile, with tight card sizing and no overflow
- **Cart summary bugfix:** Cart summary always visible on all mobile sizes
- **Cleaner codebase:** Removed redundant stores, unified logic, and improved documentation
- **Wrapper-based admin routing:** Each admin route now has a dedicated Svelte wrapper for compatibility and clarity

---

## Key Logic Explanations

### Authentication & User Store
- User logs in/registers → backend returns JWT and user object (with role)
- User info is stored in Svelte store and localStorage
- All components and guards use this single source of truth

### Admin Route Guard (Svelte)
- Each admin route is a Svelte wrapper that uses `<RequireAdmin component={...} />`
- `RequireAdmin` checks the user store and admin status reactively
- If not admin, user is redirected to home

### Cart & Checkout
- Cart is a Svelte store, synced to localStorage
- Cart summary and checkout always available on all devices

---

## Progress & History
- **Day 1:** Svelte SPA bootstrapped
- **Milestone:** All major features ported from React
- **Recent:** Major refactor for admin protection, mobile UI, and codebase cleanup
- **This README:** Marks a major project landmark (March)

---

## For Developers & Stakeholders
- All code is modular, documented, and ready for further extension
- Please open issues or PRs for bugs, features, or questions

---

# End of Landmark Update

## Technologies Used

- Svelte
- Tailwind CSS
- Vite
- svelte-spa-router

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Frontend Documentation

## Product Schema

The product schema includes the following fields:

- **id**: Unique identifier for the product.
- **name**: Name of the product.
- **description**: Full description of the product.
- **shortDescription**: Short summary of the product.
- **price**: Price of the product.
- **category**: Category of the product.
- **stock**: Number of items in stock.
- **brand**: Brand name of the product.
- **sizes**: Array of available sizes.
- **colors**: Array of available colors.
- **tags**: Array of tags/keywords for the product.
- **trending**: Boolean indicating if the product is trending.
- **onSale**: Boolean indicating if the product is on sale.
- **discount**: Discount percentage if the product is on sale.
- **mainImage**: URL of the main product image.
- **additionalImages**: Array of URLs for additional product images.
- **relatedProducts**: Array of related product IDs.
- **createdAt**: Timestamp when the product was created.
- **updatedAt**: Timestamp when the product was last updated.

## API Endpoints

### Products

- **GET `/api/products`**: Fetches all products.
- **GET `/api/products/:id`**: Fetches a single product by ID.
- **POST `/api/products`**: Creates a new product. Requires a multipart form data with fields for product details and images.
- **PUT `/api/products/:id`**: Updates an existing product.
- **DELETE `/api/products/:id`**: Deletes a product.

### Authentication

- **POST `/api/auth/login`**: Logs in a user.
- **POST `/api/auth/register`**: Registers a new user.
- **POST `/api/auth/logout`**: Logs out a user.

### Orders

- **GET `/api/orders`**: Fetches all orders for the logged-in user.
- **POST `/api/orders`**: Creates a new order.

### Recommendations

- **GET `/api/recommendations`**: Fetches product recommendations for the logged-in user. 