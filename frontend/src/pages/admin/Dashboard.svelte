<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Products from './Products.svelte';
  import Orders from './Orders.svelte';
  import Users from './Users.svelte';
  import ShippingManagement from './ShippingManagement.svelte';
  import Coupon from './Coupon.svelte';
  import Upload from './Upload.svelte';
  
  let activeTab = 'overview';
  let stats = {
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0
  };
  
  let recentOrders = [];
  let recentProducts = [];
  let loading = true;
  
  onMount(async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch('/api/admin/orders?limit=5'),
        fetch('/api/admin/products?limit=5'),
        fetch('/api/admin/users?limit=5')
      ]);
      
      const [ordersData, productsData, usersData] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        usersRes.json()
      ]);
      
      recentOrders = ordersData;
      recentProducts = productsData;
      
      // Calculate stats
      stats = {
        totalOrders: ordersData.length,
        totalProducts: productsData.length,
        totalUsers: usersData.length,
        totalRevenue: ordersData.reduce((sum, order) => sum + order.total, 0)
      };
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      loading = false;
    }
  });
</script>

<div class="min-h-screen bg-gray-100">
  <!-- Sidebar -->
  <div class="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
    <div class="flex items-center justify-center h-16 border-b">
      <h1 class="text-xl font-bold text-gray-800">Admin Dashboard</h1>
    </div>
    
    <nav class="mt-6">
      <button
        class="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {activeTab === 'overview' ? 'bg-gray-100' : ''}"
        on:click={() => activeTab = 'overview'}
      >
        <span class="mx-3">Overview</span>
      </button>
      
      <button
        class="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {activeTab === 'products' ? 'bg-gray-100' : ''}"
        on:click={() => activeTab = 'products'}
      >
        <span class="mx-3">Products</span>
      </button>
      
      <button
        class="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {activeTab === 'orders' ? 'bg-gray-100' : ''}"
        on:click={() => activeTab = 'orders'}
      >
        <span class="mx-3">Orders</span>
      </button>
      
      <button
        class="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {activeTab === 'users' ? 'bg-gray-100' : ''}"
        on:click={() => activeTab = 'users'}
      >
        <span class="mx-3">Users</span>
      </button>
      
      <button
        class="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {activeTab === 'shipping' ? 'bg-gray-100' : ''}"
        on:click={() => activeTab = 'shipping'}
      >
        <span class="mx-3">Shipping</span>
      </button>
      
      <button
        class="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {activeTab === 'coupons' ? 'bg-gray-100' : ''}"
        on:click={() => activeTab = 'coupons'}
      >
        <span class="mx-3">Coupons</span>
      </button>
      
      <button
        class="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 {activeTab === 'upload' ? 'bg-gray-100' : ''}"
        on:click={() => activeTab = 'upload'}
      >
        <span class="mx-3">Uploads</span>
      </button>
    </nav>
  </div>
  
  <!-- Main Content -->
  <div class="ml-64 p-8">
    {#if loading}
      <div class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    {:else}
      <!-- Overview Tab -->
      {#if activeTab === 'overview'}
        <div transition:fade>
          <h2 class="text-2xl font-bold mb-6">Overview</h2>
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-gray-500 text-sm font-medium">Total Orders</h3>
              <p class="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-gray-500 text-sm font-medium">Total Products</h3>
              <p class="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-gray-500 text-sm font-medium">Total Users</h3>
              <p class="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-gray-500 text-sm font-medium">Total Revenue</h3>
              <p class="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          
          <!-- Recent Orders -->
          <div class="bg-white rounded-lg shadow mb-8">
            <div class="px-6 py-4 border-b">
              <h3 class="text-lg font-medium">Recent Orders</h3>
            </div>
            <div class="p-6">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th class="text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th class="text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th class="text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {#each recentOrders as order}
                    <tr class="border-t">
                      <td class="py-4 text-sm">{order.id}</td>
                      <td class="py-4 text-sm">{order.customerName}</td>
                      <td class="py-4 text-sm">${order.total.toFixed(2)}</td>
                      <td class="py-4 text-sm">
                        <span class="px-2 py-1 text-xs rounded-full {order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Recent Products -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b">
              <h3 class="text-lg font-medium">Recent Products</h3>
            </div>
            <div class="p-6">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th class="text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th class="text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th class="text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {#each recentProducts as product}
                    <tr class="border-t">
                      <td class="py-4 text-sm">{product.name}</td>
                      <td class="py-4 text-sm">${product.price.toFixed(2)}</td>
                      <td class="py-4 text-sm">{product.category}</td>
                      <td class="py-4 text-sm">{product.stock}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Products Tab -->
      {#if activeTab === 'products'}
        <div transition:fade>
          <Products />
        </div>
      {/if}
      
      <!-- Orders Tab -->
      {#if activeTab === 'orders'}
        <div transition:fade>
          <Orders />
        </div>
      {/if}
      
      <!-- Users Tab -->
      {#if activeTab === 'users'}
        <div transition:fade>
          <Users />
        </div>
      {/if}
      
      <!-- Shipping Tab -->
      {#if activeTab === 'shipping'}
        <div transition:fade>
          <ShippingManagement />
        </div>
      {/if}
      
      <!-- Coupons Tab -->
      {#if activeTab === 'coupons'}
        <div transition:fade>
          <Coupon />
        </div>
      {/if}
      
      <!-- Upload Tab -->
      {#if activeTab === 'upload'}
        <div transition:fade>
          <Upload />
        </div>
      {/if}
    {/if}
  </div>
</div> 