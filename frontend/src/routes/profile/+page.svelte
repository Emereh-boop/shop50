<script>
  import { onMount } from 'svelte';
  import { user, auth } from '../../stores/auth';
  import Button from '../../components/common/Button.svelte';
  import branding from '../../lib/branding.js';
  import { toast } from '../../components/common/sonner.js';
  import ProductCard from '../../components/product/ProductCard.svelte';
  import { Pencil } from 'svelte-bootstrap-icons';
  import { products, fetchProducts } from '../../stores/products';

  let orders = [];
  let isLoading = true;
  let error = null;
  let loyaltyPoints = 0;
  let loyaltyTier = branding.loyaltyTiers[0];
  let nextTier = branding.loyaltyTiers[1];
  let interestedProducts = [];

  onMount(async () => {
    try {
      // Fetch user orders
      const ordersResponse = await fetch('https://shop50.onrender.com/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      orders = ordersResponse.ok ? await ordersResponse.json() : [];
      loyaltyPoints = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      // Determine loyalty tier
      for (let i = branding.loyaltyTiers.length - 1; i >= 0; i--) {
        if (loyaltyPoints >= branding.loyaltyTiers[i].threshold) {
          loyaltyTier = branding.loyaltyTiers[i];
          nextTier = branding.loyaltyTiers[i + 1] || branding.loyaltyTiers[i];
          break;
        }
      }
      await fetchProducts();
      // Get interested product IDs
      let ids = [];
      if ($user && $user.id) {
        // Logged in: fetch from backend
        const res = await fetch(`/api/admin/users/${$user.id}/interested-products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          ids = data.interestedProducts || [];
        }
      } else {
        ids = JSON.parse(localStorage.getItem('interestedProducts') || '[]');
      }
      interestedProducts = $products.products.filter(p => ids.includes(p.id));
    } catch (e) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  });

  function handleLogout() {
    auth.logout();
    window.location.href = '/';
  }
  function handleEditProfile() {
    toast.info('Edit Profile is coming soon!');
  }
  function handleManageAddresses() {
    toast.info('Manage Addresses is coming soon!');
  }
  function handleChangePassword() {
    toast.info('Change Password is coming soon!');
  }
  function handleViewOrder(order) {
    toast.info('Order details for #' + order.id + ' coming soon!');
  }
  function handleSeeAllOrders() {
    toast.info('Order history coming soon!');
  }
  function handleDeleteAccount() {
    toast.warning('This action is irreversible. Please contact support to delete your account.');
  }
  function handleRemoveInterested(id) {
    // Remove from localStorage or backend
    if ($user && $user.id) {
      fetch(`/api/admin/users/${$user.id}/interested-products`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productIds: [id] })
      });
    } else {
      let interested = JSON.parse(localStorage.getItem('interestedProducts') || '[]');
      interested = interested.filter(pid => pid !== id);
      localStorage.setItem('interestedProducts', JSON.stringify(interested));
    }
    interestedProducts = interestedProducts.filter(p => p.id !== id);
  }
</script>

<style>
  @import '../../styles/responsive.css';
  .profile-container {
    padding: var(--page-pad);
  }
  .profile-title {
    font-size: calc(var(--page-title) * 0.8);
  }
  .profile-subtitle {
    font-size: var(--form-input);
  }
  .profile-badge {
    font-size: var(--form-label);
    padding: calc(var(--form-label) * 0.5) calc(var(--form-label) * 1);
  }
  .profile-points {
    font-size: var(--form-label);
  }
  .section-title {
    font-size: calc(var(--page-title) * 0.4);
  }
  .section-card {
    padding: calc(var(--page-pad) * 0.5);
  }
  .order-title {
    font-size: calc(var(--page-title) * 0.3);
  }
  .order-item {
    padding: calc(var(--page-pad) * 0.3);
  }
  .order-id {
    font-size: var(--form-input);
  }
  .order-status {
    font-size: var(--form-label);
    padding: calc(var(--form-label) * 0.3) calc(var(--form-label) * 0.6);
  }
  .order-date {
    font-size: var(--form-label);
  }
  .order-btn {
    font-size: var(--form-btn);
    padding: calc(var(--form-btn) * 0.6) calc(var(--form-btn) * 1.5);
  }
  .action-btn {
    font-size: var(--form-btn);
    padding: calc(var(--form-btn) * 0.8) calc(var(--form-btn) * 1.5);
  }
  .interested-grid {
    gap: calc(var(--grid-gap) * 0.3);
  }
</style>

<div class="max-w-4xl mx-auto profile-container">
  <!-- Dashboard Header -->
  <div class="flex flex-col gap-2 mb-8 items-start">
    <div class="flex items-center gap-2 w-full">
      <h1 class="profile-title font-extrabold uppercase tracking-widest text-black dark:text-white">{$user.name || $user.email}</h1>
      <Button variation="icon" aria-label="Edit Profile" on:click={handleEditProfile}><Pencil size={22} /></Button>
    </div>
    <p class="profile-subtitle text-gray-600 dark:text-gray-400">Welcome to your {branding.name} profile</p>
    <span class={`profile-badge inline-flex items-center font-bold uppercase tracking-widest ${loyaltyTier.color}`}>{loyaltyTier.name} Member</span>
    <div class="mt-2 profile-points text-gray-700 dark:text-gray-300 font-bold">Loyalty Points: {loyaltyPoints}</div>
  </div>

  <!-- Still Interested Products -->
  <div class="mb-8 w-full">
    <h2 class="section-title font-bold mb-3 text-left">Still Interested?</h2>
    {#if isLoading}
      <div class="grid grid-cols-2 md:grid-cols-4 interested-grid">
        {#each Array(4) as _}
          <div class="bg-gray-200 dark:bg-gray-700 h-36 md:h-40 animate-pulse"></div>
        {/each}
      </div>
    {:else if interestedProducts.length === 0}
      <div class="text-gray-500 dark:text-gray-400 text-left">No products yet.</div>
    {:else}
      <div class="grid grid-cols-2 md:grid-cols-4 interested-grid">
        {#each interestedProducts.slice(0, 4) as product}
          <div class="max-w-[8.5rem] col-span-1 md:max-w-[10rem] mx-auto">
            <ProductCard {product} variant="still-interested" on:remove={() => handleRemoveInterested(product.id)} />
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Orders Overview -->
  <div class="bg-white dark:bg-gray-900 section-card shadow-lg flex flex-col mb-8 w-full border-2 border-black dark:border-white">
    <div class="flex items-center mb-4">
      <span class="order-title font-extrabold uppercase tracking-widest text-gray-900 dark:text-white">Recent Orders</span>
    </div>
    {#if orders.length === 0}
      <p class="text-gray-700 dark:text-gray-300">No orders found.</p>
    {:else}
      <ul class="divide-y divide-gray-200 dark:divide-gray-700 mb-4">
        {#each orders.slice(0,3) as order}
          <li class="order-item flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="order-id font-bold text-gray-900 dark:text-white">Order #{order.id}</span>
              <span class="ml-2 order-status font-bold uppercase tracking-widest {order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}">{order.status || 'pending'}</span>
            </div>
            <div class="order-date text-gray-700 dark:text-gray-300">{new Date(order.date).toLocaleDateString()} &bull; <span class="font-bold">${order.total}</span></div>
            <Button variation="stroke" color="primary" class="order-btn w-full mt-2" on:click={() => handleViewOrder(order)}>View Details</Button>
          </li>
        {/each}
      </ul>
      <Button variation="stroke" color="primary" class="order-btn w-full mt-2" on:click={handleSeeAllOrders}>See All Orders</Button>
    {/if}
  </div>

  <!-- Account Actions -->
  <div class="bg-white dark:bg-gray-900 section-card shadow-lg border-2 border-black dark:border-white flex flex-col items-start w-full">
    <h2 class="section-title font-extrabold uppercase tracking-widest mb-4 text-gray-900 dark:text-white">Account Actions</h2>
    <div class="flex flex-col w-full">
      <button class="action-btn w-full text-start font-extrabold uppercase tracking-widest" on:click={handleManageAddresses}>Manage Addresses</button>
      <button class="action-btn w-full text-start text-red-500 font-extrabold uppercase tracking-widest" on:click={handleLogout}>Logout</button>
      <button class="action-btn w-full text-start text-red-500 font-extrabold uppercase tracking-widest" on:click={handleChangePassword}>Change Password</button>
      <button class="action-btn w-full text-start text-red-500 font-extrabold uppercase tracking-widest" on:click={handleDeleteAccount}>Delete Account</button>
    </div>
  </div>
</div>