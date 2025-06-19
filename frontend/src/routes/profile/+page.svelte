<script>
  import { onMount } from 'svelte';
  import { user, auth } from '../../stores/auth';
  import { PersonCircle, Bag, Star } from 'svelte-bootstrap-icons';

  let orders = [];
  let recommendations = [];
  let isLoading = true;
  let error = null;

  onMount(async () => {
    try {
      // Fetch user orders
      const ordersResponse = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (ordersResponse.status === 404) {
        orders = [];
      } else if (!ordersResponse.ok) {
        throw new Error('Failed to fetch orders');
      } else {
        orders = await ordersResponse.json();
      }

      // Fetch recommendations
      const recommendationsResponse = await fetch('/api/recommendations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (recommendationsResponse.status === 404) {
        recommendations = [];
      } else if (!recommendationsResponse.ok) {
        throw new Error('Failed to fetch recommendations');
      } else {
        recommendations = await recommendationsResponse.json();
      }
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
</script>

<div class="max-w-4xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">User Dashboard</h1>
  
  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error: </strong>
      <span class="block sm:inline">{error}</span>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
          <PersonCircle class="h-6 w-6 mr-2" />
          User Information
        </h2>
        {#if $user}
          <p class="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {$user.name}</p>
          <p class="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {$user.email}</p>
        {:else}
          <p class="text-gray-700 dark:text-gray-300">Please log in to view your information.</p>
        {/if}
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
          <Bag class="h-6 w-6 mr-2" />
          Orders
        </h2>
        {#if orders.length === 0}
          <p class="text-gray-700 dark:text-gray-300">No orders found.</p>
        {:else}
          <ul>
            {#each orders as order}
              <li class="border-b border-gray-200 dark:border-gray-700 py-2">
                <p class="text-gray-700 dark:text-gray-300"><strong>Order ID:</strong> {order.id}</p>
                <p class="text-gray-700 dark:text-gray-300"><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p class="text-gray-700 dark:text-gray-300"><strong>Total:</strong> ${order.total}</p>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
          <Star class="h-6 w-6 mr-2" />
          Recommendations
        </h2>
        {#if recommendations.length === 0}
          <p class="text-gray-700 dark:text-gray-300">No recommendations available.</p>
        {:else}
          <ul>
            {#each recommendations as rec}
              <li class="border-b border-gray-200 dark:border-gray-700 py-2">
                <p class="text-gray-700 dark:text-gray-300"><strong>Product:</strong> {rec.name}</p>
                <p class="text-gray-700 dark:text-gray-300"><strong>Price:</strong> ${rec.price}</p>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Account Actions</h2>
        <button
          class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
          on:click={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  {/if}
</div> 