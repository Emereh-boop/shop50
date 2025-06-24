<script>
  import { push } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { cart } from '../../stores/cart';
  export let order = null;
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

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
  <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center">
    <div class="mb-6">
      <svg class="h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2l4-4"/></svg>
    </div>
    <h2 class="text-3xl font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-4">Order Placed!</h2>
    <p class="text-lg text-gray-700 dark:text-gray-300 mb-6 text-center">Thank you for your purchase. Your order has been placed successfully.</p>
    {#if order}
      <div class="w-full mb-6">
        <h3 class="text-lg font-bold mb-2">Order Summary</h3>
        <ul class="divide-y divide-gray-200 dark:divide-gray-700 mb-4">
          {#each order.cart as item}
            <li class="flex justify-between py-2">
              <span class="font-semibold">{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          {/each}
        </ul>
        <div class="flex justify-between font-bold">
          <span>Total</span>
          <span>${order.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
        </div>
        <div class="flex justify-between text-sm mt-2">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      </div>
    {/if}
    <button class="w-full py-3 border-2 border-black dark:border-white text-black dark:text-white font-extrabold rounded-full uppercase tracking-widest text-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors" on:click={() => push('/')}>Continue Shopping</button>
  </div>
</div> 