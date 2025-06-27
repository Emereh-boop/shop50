# YNT – React + Firebase (Legacy App)

## About
This is the original implementation of the YNT e-commerce platform, built with React and Firebase. It is now archived in favor of the new Svelte SPA, but remains as a reference and for feature parity.

---

## Directory Structure
```
YNT-react-firebase/
├── src/
│   ├── components/         # React UI components (cart, layout, products, etc.)
│   ├── context/            # React Context for state management (auth, cart, orders, etc.)
│   ├── pages/              # Page-level React components (admin, user, etc.)
│   ├── routes/             # Route protection (AdminRoute, PrivateRoute)
│   ├── utils/              # Utility JS
│   └── images/             # Static images
├── api/                    # API logic (charge, coupon, etc.)
├── public/                 # Static assets
├── package.json
└── ...
```

---

## Setup & Development

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Install & Run
```bash
cd YNT-react-firebase
npm install
npm start
```

---

## Features
- User authentication (register/login/logout)
- Product browsing, filtering, and search
- Shopping cart and checkout
- Order management
- Admin dashboard and management (products, users, orders, coupons, shipping)
- Route protection (AdminRoute, PrivateRoute)
- Responsive design

---

## What's New & Different
- This app is now **archived** in favor of the new Svelte SPA frontend
- All new features and improvements are being made in the Svelte app
- This codebase remains for reference, migration, and feature parity

---

## Key Logic Explanations
- **Auth:** Uses Firebase Auth and Context API for user/session management
- **Admin Guard:** AdminRoute checks user role from context and redirects if not admin
- **Cart:** Context-based cart, synced to localStorage

---

## Progress & History
- **Day 1:** React app bootstrapped, Firebase integration
- **Milestone:** All major features implemented
- **Recent:** Svelte SPA migration, this app archived

---

## For Developers & Stakeholders
- Please use the new Svelte SPA for all new development
- This app is for reference and archival only

---

# End of Legacy App README


