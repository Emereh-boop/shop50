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
import RequireAdmin from './components/common/RequireAdmin.svelte';
import AdminDashboardWrapper from './routes/admin/+page.svelte';
import AdminProductsWrapper from './routes/admin/products/+page.svelte';
import AdminOrdersWrapper from './routes/admin/orders/+page.svelte';
import AdminUsersWrapper from './routes/admin/users/+page.svelte';
import AdminBannersWrapper from './routes/admin/banners/+page.svelte';
import AdminUploadWrapper from './routes/admin/upload/+page.svelte';
import AdminShippingWrapper from './routes/admin/shipping/+page.svelte';
import AdminCouponsWrapper from './routes/admin/coupons/+page.svelte';

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
  '/admin': AdminDashboardWrapper,
  '/admin/products': AdminProductsWrapper,
  '/admin/orders': AdminOrdersWrapper,
  '/admin/users': AdminUsersWrapper,
  '/admin/banners': AdminBannersWrapper,
  '/admin/upload': AdminUploadWrapper,
  '/admin/shipping': AdminShippingWrapper,
  '/admin/coupons': AdminCouponsWrapper,

  // 404 route
  '*': NotFound
};

export default routes; 