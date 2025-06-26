// User pages
import Home from './routes/+page.svelte';
import Products from './routes/products/+page.svelte';
import Checkout from './routes/checkout/+page.svelte';
import Orders from './routes/orders/+page.svelte';
import Profile from './routes/profile/+page.svelte';
import Collection from './pages/user/Collection.svelte';
import ProductDetail from './routes/products/[id]/+page.svelte';
import About from './routes/about/+page.svelte';
import Contact from './routes/contact/+page.svelte';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard.svelte';
import AdminProducts from './pages/admin/Products.svelte';
import AdminOrders from './pages/admin/Orders.svelte';
import AdminUsers from './pages/admin/Users.svelte';
import AdminBanners from './pages/admin/Banners.svelte';
import AdminUpload from './pages/admin/Upload.svelte';
import AdminShipping from './pages/admin/ShippingManagement.svelte';
import AdminCoupon from './pages/admin/Coupon.svelte';

// 404 page
import NotFound from './routes/+not-found.svelte';

import { isAdmin } from './stores/admin';
import { user } from './stores/user';
import { get } from 'svelte/store';
import { push } from 'svelte-spa-router';

function adminOnly(component) {
  const isUserAdmin = get(isAdmin);
  const currentUser = get(user);
  if (!currentUser || !isUserAdmin) {
    return Home;
    // return NotFound; // Fallback, though replace should handle it
  }
  return component;
}

const routes = {
  // User routes
  '/': Home,
  '/products': Products,
  '/products/:id': ProductDetail,
  '/checkout': Checkout,
  '/orders': Orders,
  '/profile': Profile,
  '/collection': Collection,
  '/about': About,
  '/contact': Contact,

  // Admin routes
  '/admin': adminOnly(AdminDashboard),
  '/admin/products': adminOnly(AdminProducts),
  '/admin/orders': adminOnly(AdminOrders),
  '/admin/users': adminOnly(AdminUsers),
  '/admin/banners': adminOnly(AdminBanners),
  '/admin/upload': adminOnly(AdminUpload),
  '/admin/shipping': adminOnly(AdminShipping),
  '/admin/coupons': adminOnly(AdminCoupon),

  // 404 route
  '*': NotFound
};

export default routes; 