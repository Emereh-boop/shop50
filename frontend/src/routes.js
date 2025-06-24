// User pages
import Home from './routes/+page.svelte';
import Products from './routes/products/+page.svelte';
import Checkout from './routes/checkout/+page.svelte';
import Orders from './routes/orders/+page.svelte';
import Profile from './routes/profile/+page.svelte';
import Collection from './pages/user/Collection.svelte';
import NewArrival from './pages/user/NewArrival.svelte';
import Trend from './routes/trend/+page.svelte';
import ProductDetail from './routes/products/[id]/+page.svelte';

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

const routes = {
  // User routes
  '/': Home,
  '/products': Products,
  '/products/:id': ProductDetail,
  '/checkout': Checkout,
  '/orders': Orders,
  '/profile': Profile,
  '/collection': Collection,
  '/new-arrivals': NewArrival,
  '/trend': Trend,

  // Admin routes
  '/admin': AdminDashboard,
  '/admin/products': AdminProducts,
  '/admin/orders': AdminOrders,
  '/admin/users': AdminUsers,
  '/admin/banners': AdminBanners,
  '/admin/upload': AdminUpload,
  '/admin/shipping': AdminShipping,
  '/admin/coupons': AdminCoupon,

  // 404 route
  '*': NotFound
};

export default routes; 