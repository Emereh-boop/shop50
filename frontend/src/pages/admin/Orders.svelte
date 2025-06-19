<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  
  let orders = [];
  let loading = true;
  let error = null;
  let selectedOrder = null;
  let showOrderModal = false;
  let statusFilter = 'all';
  let dateFilter = 'all';

  onMount(async () => {
    await loadOrders();
  });

  async function loadOrders() {
    try {
      const response = await axios.get('/api/admin/orders', {
        params: { status: statusFilter, date: dateFilter }
      });
      orders = response.data;
    } catch (e) {
      error = 'Failed to load orders';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { status: newStatus });
      await loadOrders();
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

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">Orders Management</h1>
    <div class="flex space-x-4">
      <select
        bind:value={statusFilter}
        on:change={loadOrders}
        class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
        on:change={loadOrders}
        class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center">{error}</div>
  {:else}
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each orders as order}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{order.id}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.customerName}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.date).toLocaleDateString()}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${order.total.toFixed(2)}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  value={order.status}
                  on:change={(e) => updateOrderStatus(order.id, e.target.value)}
                  class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  class="text-blue-600 hover:text-blue-900"
                  on:click={() => viewOrderDetails(order)}
                >
                  View Details
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if showOrderModal && selectedOrder}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white rounded-lg p-8 max-w-2xl w-full">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Order Details</h2>
        <button
          class="text-gray-400 hover:text-gray-500"
          on:click={() => showOrderModal = false}
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-medium">Customer Information</h3>
          <div class="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Name</p>
              <p class="text-sm font-medium">{selectedOrder.customerName}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="text-sm font-medium">{selectedOrder.customerEmail}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Phone</p>
              <p class="text-sm font-medium">{selectedOrder.customerPhone}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-medium">Shipping Address</h3>
          <p class="mt-2 text-sm">
            {selectedOrder.shippingAddress.street}<br />
            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}<br />
            {selectedOrder.shippingAddress.country}
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium">Order Items</h3>
          <div class="mt-2 space-y-4">
            {#each selectedOrder.items as item}
              <div class="flex items-center">
                <img src={item.image} alt={item.name} class="w-16 h-16 object-cover rounded" />
                <div class="ml-4 flex-grow">
                  <p class="text-sm font-medium">{item.name}</p>
                  <p class="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p class="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            {/each}
          </div>
        </div>

        <div class="border-t pt-4">
          <div class="flex justify-between text-sm">
            <p>Subtotal</p>
            <p>${selectedOrder.subtotal.toFixed(2)}</p>
          </div>
          <div class="flex justify-between text-sm">
            <p>Shipping</p>
            <p>${selectedOrder.shipping.toFixed(2)}</p>
          </div>
          <div class="flex justify-between text-sm">
            <p>Tax</p>
            <p>${selectedOrder.tax.toFixed(2)}</p>
          </div>
          <div class="flex justify-between font-medium mt-2">
            <p>Total</p>
            <p>${selectedOrder.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if} 