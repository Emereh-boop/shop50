<script>
  import { cart } from '../../stores/cart';
  import { showCart } from '../../stores/ui';
  import { slide } from 'svelte/transition';
  import CheckoutSuccess from '../checkout/CheckoutSuccess.svelte';

  let showSuccessModal = false;

  function updateQuantity(id, newQuantity) {
    if (newQuantity < 1) return;
    cart.update(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  function removeItem(id) {
    cart.update(items => items.filter(item => item.id !== id));
  }

  function calculateTotal() {
    return $cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  async function handleCheckout() {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: $cart,
          total: calculateTotal(),
        }),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        cart.set([]);
        showCart.set(false);
        showSuccessModal = true;
      } else {
        throw new Error('Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
    }
  }
</script>

{#if $showCart}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-40"
    on:click={() => showCart.set(false)}
  ></div>
  <div
    class="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50"
    transition:slide={{ duration: 300 }}
  >
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold tracking-wider">SHOPPING CART</h2>
          <button
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            on:click={() => showCart.set(false)}
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto px-4 py-6">
        {#if $cart.length === 0}
          <div class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</p>
            <button
              class="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-opacity-90 transition-colors tracking-wider"
              on:click={() => showCart.set(false)}
            >
              Continue Shopping
            </button>
          </div>
        {:else}
          <div class="space-y-6">
            {#each $cart as item}
              <div class="flex items-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  class="w-20 h-20 object-cover rounded-lg"
                />
                <div class="ml-4 flex-1">
                  <h3 class="text-lg font-semibold tracking-wider">{item.name}</h3>
                  <p class="text-gray-600 dark:text-gray-400">${item.price}</p>
                  <div class="mt-2 flex items-center">
                    <button
                      class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      on:click={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span class="px-4 py-1 border-t border-b border-gray-300 dark:border-gray-600">
                      {item.quantity}
                    </span>
                    <button
                      class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      on:click={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      class="ml-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      on:click={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-lg font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Footer -->
      {#if $cart.length > 0}
        <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-6">
          <div class="flex justify-between mb-4">
            <span class="text-lg font-semibold">Total</span>
            <span class="text-lg font-semibold">${calculateTotal().toFixed(2)}</span>
          </div>
          <button
            class="w-full px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-opacity-90 transition-colors tracking-wider"
            on:click={handleCheckout}
          >
            CHECKOUT
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

{#if showSuccessModal}
  <CheckoutSuccess />
{/if}
