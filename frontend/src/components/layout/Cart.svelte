<script>
  import { cart } from '../../stores/cart';
  import { showCart } from '../../stores/ui';
  import { user } from '../../stores/auth';
  import { slide } from 'svelte/transition';
  import CheckoutSuccess from '../checkout/CheckoutSuccess.svelte';
  import { link, push } from 'svelte-spa-router';
  import { toast } from '$components/common/sonner';
  import { modalStore } from '../../stores/modalStore';

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
    push('/checkout');
    showCart.set(false);
  }

  function getResolvedImageUrl(product) {
    let url = product.mainImage || product.image || product.imageUrl;
    if (url && !url.startsWith('http')) {
      url = `http://localhost:3001${url}`;
    }
    return url;
  }

  function goToCheckout() {
    showCart.set(false);
    push('/checkout')
  }
</script>

{#if $showCart}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-40"
    on:click={() => showCart.set(false)}
  ></div>
  <div
    class="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
    transition:slide={{ duration: 300 }}
  >
    <!-- Header -->
    <div class="px-6 py-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h2 class="text-2xl font-extrabold tracking-widest uppercase text-gray-900 dark:text-white">Your Bag</h2>
      <button class="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200" on:click={() => showCart.set(false)}>
        <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Cart Items -->
    <div class="flex-1 overflow-y-auto px-6 py-6 space-y-8">
      {#if $cart.length === 0}
        <div class="text-center py-16">
          <p class="text-gray-500 dark:text-gray-400 mb-6 text-lg">Your bag is empty</p>
          <button class="px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white font-bold rounded-full uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors" on:click={() => showCart.set(false)}>
            Continue Shopping
          </button>
        </div>
      {:else}
        {#each $cart as item, index}
          <div class="flex items-center gap-6">
            <img src={getResolvedImageUrl(item)} alt={getResolvedImageUrl(item)} class="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
            <div class="flex-1">
              <h3 class="text-lg font-extrabold uppercase tracking-widest text-gray-900 dark:text-white">{item.name}</h3>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">Size:</span>
                <span class="text-sm font-bold text-gray-900 dark:text-white">{item.size}</span>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">Price:</span>
                <span class="text-base font-bold text-gray-900 dark:text-white">${item.price}</span>
              </div>
              <div class="flex items-center gap-4 mt-4">
                <button class="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700" on:click={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span class="text-lg font-bold">{item.quantity}</span>
                <button class="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700" on:click={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                <button class="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" on:click={() => removeItem(item.id)} title="Remove">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div class="ml-2">
              <p class="text-lg font-extrabold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- Order Summary & Checkout -->
    {#if $cart.length > 0}
      <div class="border-t border-gray-200 dark:border-gray-700 px-6 py-8 bg-gray-50 dark:bg-gray-900">
        <div class="flex justify-between mb-3">
          <span class="text-base font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Subtotal</span>
          <span class="text-base font-bold text-gray-900 dark:text-white">${calculateTotal().toFixed(2)}</span>
        </div>
        <div class="flex justify-between mb-3">
          <span class="text-base font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Shipping</span>
          <span class="text-base font-bold text-gray-900 dark:text-white">Free</span>
        </div>
        <div class="flex justify-between mb-6">
          <span class="text-lg font-extrabold uppercase tracking-widest text-gray-900 dark:text-white">Total</span>
          <span class="text-lg font-extrabold text-gray-900 dark:text-white">${calculateTotal().toFixed(2)}</span>
        </div>
     
          <button on:click={goToCheckout} class="w-full py-4 border-2 border-black dark:border-white text-black dark:text-white font-extrabold rounded-full uppercase tracking-widest text-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
            Checkout
          </button>
      </div>
    {/if}
  </div>
{/if}

{#if showSuccessModal}
  <CheckoutSuccess />
{/if}
