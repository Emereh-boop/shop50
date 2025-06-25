<script>
  import { onMount, onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";
  import Products from "./Products.svelte";
  import Orders from "./Orders.svelte";
  import Users from "./Users.svelte";
  import ShippingManagement from "./ShippingManagement.svelte";
  import Coupon from "./Coupon.svelte";
  import Button from "../../components/common/Button.svelte";

  let activeTab = "overview";
  let stats = {
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  };

  let recentOrders = [];
  let recentProducts = [];
  let loading = true;

  let showSidebar = false;
  let onlineUsers = [];
  let onlineInterval;

  async function fetchOnlineUsers() {
    try {
      const res = await fetch("https://shop50.onrender.com/api/users/online");
      if (res.ok) {
        onlineUsers = await res.json();
      }
    } catch (e) {
      // Optionally handle error
    }
  }

  onMount(async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch("https://shop50.onrender.com/api/admin/orders?limit=5"),
        fetch("https://shop50.onrender.com/api/admin/products?limit=5"),
        fetch("https://shop50.onrender.com/api/admin/users?limit=5"),
      ]);

      const [ordersData, productsData, usersData] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        usersRes.json(),
      ]);

      recentOrders = ordersData;
      recentProducts = productsData;

      // Calculate stats
      stats = {
        totalOrders: ordersData.length,
        totalProducts: productsData.length,
        totalUsers: usersData.length,
        totalRevenue: ordersData.reduce((sum, order) => sum + order.total, 0),
      };
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      loading = false;
    }
    fetchOnlineUsers();
    onlineInterval = setInterval(fetchOnlineUsers, 10000);
  });

  onDestroy(() => {
    clearInterval(onlineInterval);
  });
</script>

<div class="min-h-screen bg-white dark:bg-black">
  <!-- Sidebar Overlay (all screens) -->
  {#if showSidebar}
    <div class="fixed inset-0 z-40 bg-black opacity-40" on:click={() => showSidebar = false}></div>
    <aside class="fixed top-0 left-0 z-50 w-72 h-full bg-white dark:bg-black shadow-2xl p-8 flex flex-col gap-8 transition-transform duration-300 transform" style="transform: translateX(0);">
      <img src="/src/assets/yntlogo.svg" alt="YNT Logo" class="h-10 mb-8" />
      <nav class="flex flex-col gap-4 mt-4">
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-6 py-2" on:click={() => { activeTab = 'overview'; showSidebar = false; }}>Overview</Button>
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-6 py-2" on:click={() => { activeTab = 'products'; showSidebar = false; }}>Products</Button>
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-6 py-2" on:click={() => { activeTab = 'orders'; showSidebar = false; }}>Orders</Button>
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-6 py-2" on:click={() => { activeTab = 'users'; showSidebar = false; }}>Users</Button>
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-6 py-2" on:click={() => { activeTab = 'shipping'; showSidebar = false; }}>Shipping</Button>
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-6 py-2" on:click={() => { activeTab = 'coupons'; showSidebar = false; }}>Coupons</Button>
      </nav>
    </aside>
  {/if}
  <!-- Main Content -->
  <div class="p-2 md:p-12 transition-all duration-300 mx-auto max-w-7xl">
    <!-- Sidebar Toggle Button (all screens) -->
    <button class="text-black dark:text-white font-extrabold uppercase tracking-widest border-2 border-black dark:border-white rounded-full px-6 py-2 mb-8" on:click={() => (showSidebar = true)}>
      Menu
    </button>
    {#if loading}
      <div class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>
    {:else}
      <!-- Overview Tab -->
      {#if activeTab === "overview"}
        <div transition:fade>
          <h2 class="text-4xl font-extrabold uppercase tracking-widest mb-12 text-black dark:text-white text-center">Admin Dashboard</h2>
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl flex flex-col items-center justify-center aspect-square p-8">
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Total Orders</h3>
              <p class="text-5xl font-extrabold text-black dark:text-white">{stats.totalOrders}</p>
            </div>
            <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl flex flex-col items-center justify-center aspect-square p-8">
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Total Products</h3>
              <p class="text-5xl font-extrabold text-black dark:text-white">{stats.totalProducts}</p>
            </div>
            <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl flex flex-col items-center justify-center aspect-square p-8">
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Total Users</h3>
              <p class="text-5xl font-extrabold text-black dark:text-white">{stats.totalUsers}</p>
            </div>
            <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl flex flex-col items-center justify-center aspect-square p-8">
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Total Revenue</h3>
              <p class="text-5xl font-extrabold text-black dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <!-- Online Users Section -->
          <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow p-8 mb-12">
            <h3 class="text-lg font-extrabold uppercase tracking-widest mb-4 text-black dark:text-white">Online Users</h3>
            <ul>
              {#each onlineUsers as user}
                <li class="py-2 border-b last:border-b-0 flex items-center justify-between">
                  <span class="text-black dark:text-white font-bold uppercase">{user.name}<span class="text-xs text-gray-500 ml-2">({user.email})</span></span>
                  <span class="inline-block w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                </li>
              {/each}
            </ul>
          </div>
          <!-- Recent Orders -->
          <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow mb-10">
            <div class="px-8 py-6 border-b border-black dark:border-white">
              <h3 class="text-lg font-extrabold uppercase tracking-widest text-black dark:text-white">Recent Orders</h3>
            </div>
            <div class="p-8 overflow-x-auto">
              <table class="min-w-full divide-y divide-black dark:divide-white">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-black dark:text-white">Order ID</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-black dark:text-white">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-black dark:text-white">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-black dark:text-white">Total</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-black divide-y divide-black dark:divide-white">
                  {#each recentOrders as order}
                    <tr>
                      <td class="px-6 py-4 text-black dark:text-white font-bold">{order.id}</td>
                      <td class="px-6 py-4 text-black dark:text-white">{new Date(order.date).toLocaleDateString()}</td>
                      <td class="px-6 py-4">
                        <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest {order.status === 'delivered' ? 'bg-black text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}">{order.status || 'pending'}</span>
                      </td>
                      <td class="px-6 py-4 text-black dark:text-white font-bold">${order.total}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {/if}

      <!-- Products Tab -->
      {#if activeTab === "products"}
        <div transition:fade>
          <Products />
        </div>
      {/if}

      <!-- Orders Tab -->
      {#if activeTab === "orders"}
        <div transition:fade>
          <Orders />
        </div>
      {/if}

      <!-- Users Tab -->
      {#if activeTab === "users"}
        <div transition:fade>
          <Users />
        </div>
      {/if}

      <!-- Shipping Tab -->
      {#if activeTab === "shipping"}
        <div transition:fade>
          <ShippingManagement />
        </div>
      {/if}

      <!-- Coupons Tab -->
      {#if activeTab === "coupons"}
        <div transition:fade>
          <Coupon />
        </div>
      {/if}

      <!-- Upload Tab -->
    {/if}
  </div>
</div>
