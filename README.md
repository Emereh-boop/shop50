# YNT Store – Project Landmark Update (March)

A modern, full-stack e-commerce platform for fashion, built with Svelte, Node.js/Express, and (legacy) React+Firebase. This README marks a major project milestone, summarizing all features, architecture, and recent progress.

---

## Project Overview
YNT Store is a robust, scalable, and modern e-commerce solution. It supports:
- User shopping and checkout
- Admin product and order management
- Responsive, mobile-first UI
- Secure authentication and role-based access
- Modular, maintainable codebase

---

## Directory Structure

```
ynt/
├── backend/                # Node.js/Express API, LowDB, file uploads
│   ├── db.json             # JSON database
│   ├── routes/             # API endpoints (admin, auth, products, uploads)
│   └── server.js           # Main Express server
├── frontend/               # Svelte SPA frontend
│   ├── src/
│   │   ├── components/     # Svelte UI components (layout, product, admin, etc.)
│   │   ├── pages/          # Svelte page-level components
│   │   ├── routes/         # Svelte SPA routes
│   │   ├── stores/         # Svelte stores (user, cart, admin, etc.)
│   │   ├── styles/         # CSS (Tailwind, responsive)
│   │   └── utils/          # Utility JS
│   ├── public/             # Static assets
│   └── ...
├── YNT-react-firebase/     # Legacy React+Firebase implementation
│   ├── src/                # React components, context, pages
│   ├── api/                # API logic
│   └── ...
└── README.md               # This file
```

---

## Setup Instructions

### Backend (Node.js/Express)
1. `cd backend`
2. `npm install`
3. Create `.env` with:
   ```
   PORT=3001
   JWT_SECRET=your-super-secret-key
   ```
4. `node server.js`

### Frontend (Svelte)
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Legacy React+Firebase
1. `cd YNT-react-firebase`
2. `npm install`
3. `npm start`

---

## Features

### User Features
- Register, login, logout (JWT, secure)
- Browse, search, and filter products
- Add to cart, update cart, checkout
- View order history
- Responsive design (mobile-first)
- Dark mode

### Admin Features
- Admin-only dashboard and management pages (products, users, orders, banners, coupons, shipping)
- Add/edit/delete products
- Manage users and roles
- View and manage orders
- Upload product images
- All admin routes are protected (Svelte: via RequireAdmin wrapper and store-based guard)

### Security & Logic
- JWT authentication (backend)
- Password hashing (bcrypt)
- Role-based access (admin/user)
- Svelte store-based route guards (frontend)
- LocalStorage sync for user session
- All admin pages require live admin check (no stale role)

### Technology
- **Frontend:** Svelte, Tailwind CSS, svelte-spa-router, Axios
- **Backend:** Node.js, Express, LowDB, Multer (uploads), JWT, bcrypt
- **Legacy:** React, Firebase, Context API

---

## What's New & Different (Landmark March Update)
- **Svelte SPA migration:** Modernized frontend from React to Svelte for better performance and maintainability
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
- **Day 1:** Project bootstrapped, backend and legacy React app created
- **Milestone:** Svelte frontend built, all major features ported
- **Recent:** Major refactor for admin protection, mobile UI, and codebase cleanup
- **This README:** Marks a major project landmark (March)

---

## For Developers & Stakeholders
- See `frontend/README.md` and `YNT-react-firebase/README.md` for more details on each app
- All code is modular, documented, and ready for further extension
- Please open issues or PRs for bugs, features, or questions

---

# End of Landmark Update 