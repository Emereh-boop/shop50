<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import Button from '../../components/common/Button.svelte';
  import { adminOrders, fetchAdminOrders } from '../../stores/adminOrders';
  import { get } from 'svelte/store';
  
  let orders = [];
  let loading = true;
  let error = null;
  let selectedOrder = null;
  let showOrderModal = false;
  let statusFilter = 'all';
  let dateFilter = 'all';

  onMount(async () => {
    loading = true;
    await fetchAdminOrders();
    const store = get(adminOrders);
    orders = store.orders;
    loading = store.loading;
    error = store.error;
  });

  async function updateOrderStatus(orderId, newStatus) {
    try {
      await axios.put(`https://shop50.onrender.com/api/admin/orders/${orderId}`, { status: newStatus });
      await fetchAdminOrders(true);
      const store = get(adminOrders);
      orders = store.orders;
      loading = store.loading;
      error = store.error;
    } catch (e) {
      error = 'Failed to update order status';
      console.error(e);
    }
  }

  function viewOrderDetails(order) {
    selectedOrder = order;
    showOrderModal = true;
  }
</script>

<div class="max-w-7xl mx-auto px-2 sm:px-8 py-10">
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 gap-4">
    <h1 class="text-4xl font-extrabold uppercase tracking-widest text-black dark:text-white">Orders Management</h1>
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
      <select
        bind:value={statusFilter}
        on:change={() => fetchAdminOrders()}
        class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-6 py-2 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white w-full sm:w-auto"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select
        bind:value={dateFilter}
        on:change={() => fetchAdminOrders()}
        class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-6 py-2 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white w-full sm:w-auto"
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>
  </div>
  {#if $adminOrders.loading}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
    </div>
  {:else if $adminOrders.error}
    <div class="text-red-500 text-center">{$adminOrders.error}</div>
  {:else}
    <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl overflow-x-auto">
      <table class="min-w-full divide-y divide-black dark:divide-white text-sm">
        <thead class="bg-white dark:bg-black">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Order ID</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Customer</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Date</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Total</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Status</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-black divide-y divide-black dark:divide-white">
          {#each $adminOrders.orders as order}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-base font-bold text-black dark:text-white">#{order.id}</td>
              <td class="px-6 py-4 whitespace-nowrap text-base font-bold text-black dark:text-white">{order.customerName}</td>
              <td class="px-6 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300">{new Date(order.date).toLocaleDateString()}</td>
              <td class="px-6 py-4 whitespace-nowrap text-base font-bold text-black dark:text-white">${order.total.toFixed(2)}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  value={order.status}
                  on:change={(e) => updateOrderStatus(order.id, e.target.value)}
                  class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-4 py-2 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Button
                  variation="stroke"
                  class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  on:click={() => viewOrderDetails(order)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if showOrderModal && selectedOrder}
  <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-extrabold uppercase tracking-widest text-black dark:text-white">Order Details</h2>
        <Button
          variation="ghost"
          class="border-2 border-black dark:border-white text-black dark:text-white rounded-full p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          on:click={() => showOrderModal = false}
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-extrabold uppercase tracking-widest text-black dark:text-white mb-2">Customer Information</h3>
          <div class="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Name</p>
              <p class="text-base font-bold text-black dark:text-white">{selectedOrder.customerName}</p>
            </div>
            <div>
              <p class="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Email</p>
              <p class="text-base font-bold text-black dark:text-white">{selectedOrder.customerEmail}</p>
            </div>
            <div>
              <p class="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Phone</p>
              <p class="text-base font-bold text-black dark:text-white">{selectedOrder.customerPhone}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-extrabold uppercase tracking-widest text-black dark:text-white mb-2">Shipping Address</h3>
          <p class="mt-2 text-base text-black dark:text-white">
            {selectedOrder.shippingAddress.street}<br />
            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}<br />
            {selectedOrder.shippingAddress.country}
          </p>
        </div>
        <div>
          <h3 class="text-lg font-extrabold uppercase tracking-widest text-black dark:text-white mb-2">Order Items</h3>
          <div class="mt-2 space-y-4">
            {#each selectedOrder.items as item}
              <div class="flex items-center gap-4">
                <img src={item.image} alt={item.name} class="w-16 h-16 object-cover border-2 border-black dark:border-white rounded-xl" />
                <div class="flex-grow">
                  <p class="text-base font-bold text-black dark:text-white">{item.name}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <p class="text-base font-bold text-black dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            {/each}
          </div>
        </div>
        <div class="border-t border-black dark:border-white pt-4">
          <div class="flex justify-between text-base font-bold text-black dark:text-white">
            <span>Total</span>
            <span>${selectedOrder.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if} 