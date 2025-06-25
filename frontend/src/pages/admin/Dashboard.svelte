<script>
  import { onMount, onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";
  import Products from "./Products.svelte";
  import Orders from "./Orders.svelte";
  import Users from "./Users.svelte";
  import ShippingManagement from "./ShippingManagement.svelte";
  import Coupon from "./Coupon.svelte";
  import Button from "../../components/common/Button.svelte";
  import { onlineUsers, fetchOnlineUsers } from '../../stores/onlineUsers';
  import { Collection, BoxSeam, People, Clipboard, Truck, Gift, Layers, BarChart, PieChart, ChevronLeft, ChevronRight } from 'svelte-bootstrap-icons';
  import Collections from './Collections.svelte';

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
  let onlineInterval;
  let sidebarCollapsed = false;

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
    await fetchOnlineUsers();
    onlineInterval = setInterval(() => fetchOnlineUsers(), 10000);
  });

  onDestroy(() => {
    clearInterval(onlineInterval);
  });
</script>

<div class="min-h-screen bg-white dark:bg-black flex">
  <!-- Sidebar: always visible on md+ screens, overlay on small screens -->
  <aside class="h-full bg-white dark:bg-black shadow-2xl flex flex-col gap-8 transition-all duration-300 {sidebarCollapsed ? 'w-24' : 'w-64'} p-8 hidden md:flex" style="min-width: {sidebarCollapsed ? '80px' : '260px'};">
    <div class="flex items-center mb-6">
      <Button class="p-2" on:click={() => sidebarCollapsed = !sidebarCollapsed} aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {#if sidebarCollapsed}
          <ChevronRight/>
        {:else}
          <ChevronLeft/>
        {/if}
      </Button>
    </div>
    <nav class="flex flex-col gap-4 mt-2 w-full">
      <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full flex items-center gap-2 px-2 py-2 {sidebarCollapsed ? 'w-12 h-12 justify-start' : 'pl-4 pr-6 py-2 w-full flex-row'}" on:click={() => { activeTab = 'overview'; }}>{#if sidebarCollapsed}<BarChart class="w-6 h-6"/>{:else}<BarChart class="w-6 h-6"/> <span>Overview</span>{/if}</Button>
      <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full flex items-center gap-2 px-2 py-2 {sidebarCollapsed ? 'w-12 h-12 justify-start' : 'pl-4 pr-6 py-2 w-full flex-row'}" on:click={() => { activeTab = 'products'; }}>{#if sidebarCollapsed}<BoxSeam class="w-6 h-6"/>{:else}<BoxSeam class="w-6 h-6"/> <span>Products</span>{/if}</Button>
      <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full flex items-center gap-2 px-2 py-2 {sidebarCollapsed ? 'w-12 h-12 justify-start' : 'pl-4 pr-6 py-2 w-full flex-row'}" on:click={() => { activeTab = 'orders'; }}>{#if sidebarCollapsed}<Clipboard class="w-6 h-6"/>{:else}<Clipboard class="w-6 h-6"/> <span>Orders</span>{/if}</Button>
      <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full flex items-center gap-2 px-2 py-2 {sidebarCollapsed ? 'w-12 h-12 justify-start' : 'pl-4 pr-6 py-2 w-full flex-row'}" on:click={() => { activeTab = 'users'; }}>{#if sidebarCollapsed}<People class="w-6 h-6"/>{:else}<People class="w-6 h-6"/> <span>Users</span>{/if}</Button>
      <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full flex items-center gap-2 px-2 py-2 {sidebarCollapsed ? 'w-12 h-12 justify-start' : 'pl-4 pr-6 py-2 w-full flex-row'}" on:click={() => { activeTab = 'collections'; }}>{#if sidebarCollapsed}<Layers class="w-6 h-6"/>{:else}<Layers class="w-6 h-6"/> <span>Collections</span>{/if}</Button>
      <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full flex items-center gap-2 px-2 py-2 {sidebarCollapsed ? 'w-12 h-12 justify-start' : 'pl-4 pr-6 py-2 w-full flex-row'}" on:click={() => { activeTab = 'shipping'; }}>{#if sidebarCollapsed}<Truck class="w-6 h-6"/>{:else}<Truck class="w-6 h-6"/> <span>Shipping</span>{/if}</Button>
      <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full flex items-center gap-2 px-2 py-2 {sidebarCollapsed ? 'w-12 h-12 justify-start' : 'pl-4 pr-6 py-2 w-full flex-row'}" on:click={() => { activeTab = 'coupons'; }}>{#if sidebarCollapsed}<Gift class="w-6 h-6"/>{:else}<Gift class="w-6 h-6"/> <span>Coupons</span>{/if}</Button>
    </nav>
  </aside>
  <!-- Overlay sidebar for small screens -->
  {#if showSidebar}
    <div class="fixed inset-0 z-40 bg-black opacity-40 md:hidden" on:click={() => showSidebar = false}></div>
    <aside class="fixed top-0 left-0 z-50 h-full bg-white dark:bg-black shadow-2xl flex flex-col gap-8 transition-all duration-300 w-64 p-8 md:hidden">
      <nav class="flex flex-col gap-4 mt-4">
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-2 py-2 flex items-center gap-2 justify-center" on:click={() => { activeTab = 'overview'; showSidebar = false; }}><BarChart/> Overview</Button>
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-2 py-2 flex items-center gap-2 justify-center" on:click={() => { activeTab = 'products'; showSidebar = false; }}><BoxSeam/> Products</Button>
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-2 py-2 flex items-center gap-2 justify-center" on:click={() => { activeTab = 'orders'; showSidebar = false; }}><Clipboard/> Orders</Button>
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-2 py-2 flex items-center gap-2 justify-center" on:click={() => { activeTab = 'users'; showSidebar = false; }}><People/> Users</Button>
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-2 py-2 flex items-center gap-2 justify-center" on:click={() => { activeTab = 'collections'; showSidebar = false; }}><Layers/> Collections</Button>
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-2 py-2 flex items-center gap-2 justify-center" on:click={() => { activeTab = 'shipping'; showSidebar = false; }}><Truck/> Shipping</Button>
        <Button variation="ghost" class="font-extrabold uppercase tracking-widest text-lg text-black dark:text-white border-2 border-black dark:border-white rounded-full px-2 py-2 flex items-center gap-2 justify-center" on:click={() => { activeTab = 'coupons'; showSidebar = false; }}><Gift/> Coupons</Button>
      </nav>
    </aside>
  {/if}
  <!-- Main Content -->
  <div class="flex-1 p-2 md:p-12 transition-all duration-300 mx-auto max-w-7xl">
    <!-- Sidebar Toggle Button (small screens only) -->
    <button class="text-black dark:text-white font-extrabold uppercase tracking-widest border-2 border-black dark:border-white rounded-full px-6 py-2 mb-8 md:hidden" on:click={() => (showSidebar = true)}>
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
          <!-- Analytics Section -->
          <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl p-8 mb-10 flex flex-col items-center">
            <h3 class="text-lg font-extrabold uppercase tracking-widest mb-4 text-black dark:text-white flex items-center gap-2"><PieChart/> Analytics</h3>
            <div class="w-full h-40 flex items-center justify-center text-gray-400 dark:text-gray-600">[Analytics Chart Placeholder]</div>
          </div>
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl flex flex-col items-center justify-center aspect-square p-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition" on:click={() => activeTab = 'orders'}>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Total Orders</h3>
              <p class="text-5xl font-extrabold text-black dark:text-white">{stats.totalOrders}</p>
            </div>
            <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl flex flex-col items-center justify-center aspect-square p-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition" on:click={() => activeTab = 'products'}>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Total Products</h3>
              <p class="text-5xl font-extrabold text-black dark:text-white">{stats.totalProducts}</p>
            </div>
            <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl flex flex-col items-center justify-center aspect-square p-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition" on:click={() => activeTab = 'users'}>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Total Users</h3>
              <p class="text-5xl font-extrabold text-black dark:text-white">{stats.totalUsers}</p>
            </div>
            <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl flex flex-col items-center justify-center aspect-square p-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition" on:click={() => activeTab = 'collections'}>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Collections</h3>
              <p class="text-5xl font-extrabold text-black dark:text-white">{stats.totalCollections || 0}</p>
            </div>
            <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl flex flex-col items-center justify-center aspect-square p-8 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition" on:click={() => { document.getElementById('online-users-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Total Revenue</h3>
              <p class="text-5xl font-extrabold text-black dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <!-- Online Users Section -->
          <div id="online-users-section" class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow p-8 mb-12">
            <h3 class="text-lg font-extrabold uppercase tracking-widest mb-4 text-black dark:text-white">Online Users</h3>
            <ul>
              {#each $onlineUsers.users as user}
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

      <!-- Collections Tab -->
      {#if activeTab === "collections"}
        <div transition:fade>
          <Collections />
        </div>
      {/if}

      <!-- Upload Tab -->
    {/if}
  </div>
</div>
