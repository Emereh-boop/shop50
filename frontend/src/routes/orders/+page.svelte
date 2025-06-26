<script>
  import { onMount } from 'svelte';

  let orders = [];
  let isLoading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch('https://shop50.onrender.com/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      orders = await response.json();
    } catch (e) {
      error = 'Failed to load orders';
      console.error(e);
    } finally {
      isLoading = false;
    }
  });

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function getStatusColor(status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <h1 class="text-3xl font-bold mb-8 tracking-wider">MY ORDERS</h1>

  {#if isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin h-12 w-12 border-b-2 border-primary-light dark:border-primary-dark mx-auto"></div>
    </div>
  {:else if error}
    <div class="text-center py-12">
      <p class="text-red-600 mb-4">{error}</p>
      <a
        href="/"
        class="inline-block px-6 py-3 bg-primary-light dark:bg-primary-dark text-white hover:bg-opacity-90 transition-colors tracking-wider"
      >
        Return to Home
      </a>
    </div>
  {:else if orders.length === 0}
    <div class="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
      <div class="p-8 text-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Orders Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">You haven't placed any orders yet.</p>
        <a
          href="/products"
          class="inline-block px-6 py-3 bg-primary-light dark:bg-primary-dark text-white hover:bg-opacity-90 transition-colors tracking-wider"
        >
          Start Shopping
        </a>
      </div>
    </div>
  {:else}
    <div class="space-y-6">
      {#each orders as order}
        <div class="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
          <div class="p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Order #{order.id}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                </p>
              </div>
              <div class="mt-2 sm:mt-0">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold {getStatusColor(
                    order.status
                  )}"
                >
                  {order.status}
                </span>
              </div>
            </div>
            <div class="mt-2 sm:mt-0">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Total: ${((order.total !== undefined ? order.total : (order.items ? order.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) : 0)).toFixed(2))}
              </p>
            </div>
            <div class="mt-2 sm:mt-0">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Items: {order.items.length}
              </p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div> 