<script>
  import { onMount } from 'svelte';
  import { user, auth } from '../../stores/auth';
  import { PersonCircle, Bag, Star, Truck } from 'svelte-bootstrap-icons';
  import Button from '../../components/common/Button.svelte';
  import branding from '../../lib/branding.js';
  import { toast } from '../../components/common/sonner.js';

  let orders = [];
  let recommendations = [];
  let isLoading = true;
  let error = null;
  let loyaltyPoints = 0;
  let loyaltyTier = branding.loyaltyTiers[0];
  let nextTier = branding.loyaltyTiers[1];

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
      // Fetch recommendations
      const recommendationsResponse = await fetch('https://shop50.onrender.com/api/recommendations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      recommendations = recommendationsResponse.ok ? await recommendationsResponse.json() : [];
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

  function getLoyaltyProgress() {
    if (!nextTier || loyaltyTier === nextTier) return 100;
    const range = nextTier.threshold - loyaltyTier.threshold;
    const progress = loyaltyPoints - loyaltyTier.threshold;
    return Math.min(100, Math.round((progress / range) * 100));
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
</script>

<div class="max-w-7xl mx-auto p-0 md:p-8">
  <!-- Dashboard Header -->
  <div class="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-4">
        <img src={branding.logo} alt="YNT Logo" class="h-16 w-16 rounded-full border-2 border-black dark:border-white">
        <div>
          <h1 class="text-3xl font-extrabold uppercase tracking-widest text-black dark:text-white">{$user.name || $user.email}</h1>
          <p class="text-gray-600 dark:text-gray-400">Welcome to your {branding.name} profile</p>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-2">
        <span class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${loyaltyTier.color}`}>{loyaltyTier.name} Member</span>
      </div>
    </div>
    <Button variation="stroke" color="primary" class="px-6 py-2 font-extrabold rounded-full uppercase tracking-widest" on:click={handleEditProfile}>Edit Profile</Button>
  </div>

  <!-- Smaller Loyalty Circular Analytics, now in grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
    <!-- Loyalty Analytics -->
    <div class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center">
      <div class="relative w-48 h-48 flex items-center justify-center mb-4">
        <svg class="absolute top-0 left-0" width="192" height="192">
          <circle cx="96" cy="96" r="80" fill="none" stroke="#e5e7eb" stroke-width="18" />
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="currentColor"
            stroke-width="18"
            stroke-dasharray="502"
            stroke-dashoffset={502 - (getLoyaltyProgress() / 100) * 502}
            class={loyaltyTier.color}
            style="transition: stroke-dashoffset 0.5s;"
          />
        </svg>
        <div class="flex flex-col items-center">
          <span class="text-4xl font-extrabold text-gray-900 dark:text-white">{loyaltyPoints}</span>
          <span class="text-sm uppercase font-bold text-gray-500 dark:text-gray-400">Points</span>
          <span class="mt-2 text-base font-bold text-gray-700 dark:text-gray-300">{loyaltyTier.name} Member</span>
          <span class="text-xs text-gray-400 dark:text-gray-500">Next: {nextTier.name} ({nextTier.threshold} pts)</span>
        </div>
      </div>
    </div>
    <!-- Orders Overview -->
    <div class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg flex flex-col">
      <div class="flex items-center mb-4">
        <Bag class="h-6 w-6 mr-2 text-black dark:text-white" />
        <h2 class="text-lg font-extrabold uppercase tracking-widest text-gray-900 dark:text-white">Recent Orders</h2>
      </div>
      {#if orders.length === 0}
        <p class="text-gray-700 dark:text-gray-300">No orders found.</p>
      {:else}
        <ul class="divide-y divide-gray-200 dark:divide-gray-700 mb-4">
          {#each orders.slice(0,3) as order}
            <li class="py-4 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-gray-900 dark:text-white">Order #{order.id}</span>
                <span class="ml-2 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-widest {order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}">{order.status || 'pending'}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Truck class="h-4 w-4" />
                <span>Tracking: {order.tracking || 'N/A'}</span>
              </div>
              <div class="text-sm text-gray-700 dark:text-gray-300">{new Date(order.date).toLocaleDateString()} &bull; <span class="font-bold">${order.total}</span></div>
              <Button variation="stroke" color="primary" class="w-full mt-2" on:click={() => handleViewOrder(order)}>View Details</Button>
            </li>
          {/each}
        </ul>
        <Button variation="stroke" color="primary" class="w-full mt-2" on:click={handleSeeAllOrders}>See All Orders</Button>
      {/if}
    </div>
    <!-- Account Actions -->
    <div class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center">
      <h2 class="text-lg font-extrabold uppercase tracking-widest mb-4 text-gray-900 dark:text-white">Account Actions</h2>
      <div class="flex flex-col gap-4 w-full">
        <Button variation="stroke" color="primary" class="w-full py-3 text-lg font-extrabold rounded-full uppercase tracking-widest" on:click={handleLogout}>Logout</Button>
        <Button variation="ghost" color="primary" class="w-full py-3 text-lg font-extrabold rounded-full uppercase tracking-widest" on:click={handleManageAddresses}>Manage Addresses</Button>
        <Button variation="ghost" color="primary" class="w-full py-3 text-lg font-extrabold rounded-full uppercase tracking-widest" on:click={handleChangePassword}>Change Password</Button>
        <Button variation="stroke" color="danger" class="w-full py-3 text-lg font-extrabold rounded-full uppercase tracking-widest" on:click={handleDeleteAccount}>Delete Account</Button>
      </div>
    </div>
  </div>
</div> 