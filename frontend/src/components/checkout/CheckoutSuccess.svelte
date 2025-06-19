<script>
  import { push } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { cart } from '../../stores/cart';
  onMount(() => {
    // Clear cart after successful checkout
    cart.set([]);
    localStorage.removeItem('cart');
  });

  function handleContinueShopping() {
    goto('/products');
  }

  function handleViewOrders() {
    goto('/orders');
  }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
    <div class="text-center">
      <div class="text-6xl mb-4">✓</div>
      <h2 class="text-2xl font-bold mb-2">Order Confirmed!</h2>
      <p class="text-gray-600 mb-6">Thank you for your purchase.</p>
      
      <div class="space-y-4">
        <button
          class="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
          on:click={handleContinueShopping}
        >
          Continue Shopping
        </button>
        <button
          class="w-full border border-black py-2 px-4 rounded hover:bg-gray-100 transition-colors"
          on:click={handleViewOrders}
        >
          View Orders
        </button>
      </div>
    </div>
  </div>
</div> 