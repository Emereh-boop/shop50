<script>
  import { cart } from '../../stores/cart';
  import { X, Plus, Minus } from 'lucide-svelte';

  function removeItem(index) {
    $cart = $cart.filter((_, i) => i !== index);
  }

  function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return;
    $cart = $cart.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    );
  }

  $: subtotal = $cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  $: shipping = subtotal > 0 ? 10 : 0;
  $: total = subtotal + shipping;
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

  {#if $cart.length === 0}
    <div class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-400">Your cart is empty</p>
      <a
        href="/products"
        class="mt-4 inline-block text-black dark:text-white px-6 py-3 rounded-md text-base font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
      >
        Continue Shopping
      </a>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div class="space-y-4">
          {#each $cart as item, index}
            <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <img
                src={item.image}
                alt={item.name}
                class="w-24 h-24 object-cover rounded"
              />
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {item.name}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Size: {item.size}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <button
                    on:click={() => updateQuantity(index, item.quantity - 1)}
                    class="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Minus class="h-4 w-4" />
                  </button>
                  <span class="text-gray-900 dark:text-white">{item.quantity}</span>
                  <button
                    on:click={() => updateQuantity(index, item.quantity + 1)}
                    class="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <Plus class="h-4 w-4" />
                  </button>
                </div>
                <button
                  on:click={() => removeItem(index)}
                  class="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600"
                >
                  <X class="h-5 w-5" />
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Order Summary
          </h2>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span class="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Shipping</span>
              <span class="text-gray-900 dark:text-white">${shipping.toFixed(2)}</span>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div class="flex justify-between">
                <span class="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                <span class="text-lg font-medium text-gray-900 dark:text-white">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              class="w-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md text-base font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div> 