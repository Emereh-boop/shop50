<script>
  import { cart } from '../../stores/cart';
  import { showCart } from '../../stores/ui';
  import { user } from '../../stores/user';
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
      url = `https://shop50.onrender.com${url}`;
    }
    return url;
  }

  function goToCheckout() {
    showCart.set(false);
    push('/checkout')
  }
</script>

<style>
  @import '../../styles/responsive.css';
  .cart-title {
    font-size: calc(var(--page-title) * 0.6);
  }
  .cart-header {
    padding: calc(var(--page-pad) * 0.4);
  }
  .cart-content {
    padding: calc(var(--page-pad) * 0.4);
  }
  .cart-item-title {
    font-size: calc(var(--form-input) * 1.1);
  }
  .cart-item-price {
    font-size: var(--form-input);
  }
  .cart-item-label {
    font-size: var(--form-label);
  }
  .cart-quantity-btn {
    width: calc(var(--form-btn) * 2);
    height: calc(var(--form-btn) * 2);
    font-size: calc(var(--form-btn) * 1.2);
  }
  .cart-quantity-text {
    font-size: calc(var(--form-input) * 1.1);
  }
  .cart-remove-icon {
    width: calc(var(--form-btn) * 1.2);
    height: calc(var(--form-btn) * 1.2);
  }
  .cart-summary {
    padding: calc(var(--page-pad) * 0.5);
  }
  .cart-summary-text {
    font-size: var(--form-input);
  }
  .cart-total-text {
    font-size: calc(var(--form-input) * 1.1);
  }
  .cart-checkout-btn {
    font-size: calc(var(--form-btn) * 1.1);
    padding: calc(var(--form-btn) * 1.2) calc(var(--form-btn) * 2);
  }
  .cart-empty-text {
    font-size: calc(var(--form-input) * 1.1);
  }
  .cart-continue-btn {
    font-size: var(--form-btn);
    padding: calc(var(--form-btn) * 0.8) calc(var(--form-btn) * 2);
  }
  .cart-close-icon {
    width: calc(var(--form-btn) * 2);
    height: calc(var(--form-btn) * 2);
  }
</style>

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
    <div class="cart-header border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h2 class="cart-title font-extrabold tracking-widest uppercase text-gray-900 dark:text-white">Your Bag</h2>
      <button class="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200" on:click={() => showCart.set(false)}>
        <svg class="cart-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Cart Items -->
    <div class="flex-1 overflow-y-auto cart-content space-y-8">
      {#if $cart.length === 0}
        <div class="text-center py-16">
          <p class="cart-empty-text text-gray-500 dark:text-gray-400 mb-6">Your bag is empty</p>
          <button class="cart-continue-btn border-2 border-black dark:border-white text-black dark:text-white font-bold  uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors" on:click={() => showCart.set(false)}>
            Continue Shopping
          </button>
        </div>
      {:else}
        {#each $cart as item, index}
          <div class="flex items-center gap-6">
            <img src={getResolvedImageUrl(item)} alt={getResolvedImageUrl(item)} class="w-24 h-24 object-cover border border-gray-200 dark:border-gray-700" />
            <div class="flex-1">
              <h3 class="cart-item-title font-extrabold uppercase tracking-widest text-gray-900 dark:text-white">{item.name}</h3>
              <div class="flex items-center gap-2 mt-2">
                <span class="cart-item-label text-gray-500 dark:text-gray-400">Size:</span>
                <span class="cart-item-price font-bold text-gray-900 dark:text-white">{item.size}</span>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <span class="cart-item-label text-gray-500 dark:text-gray-400">Price:</span>
                <span class="cart-item-price font-bold text-gray-900 dark:text-white">${item.price}</span>
              </div>
              <div class="flex items-center gap-4 mt-4">
                <button class="cart-quantity-btn border border-gray-300 dark:border-gray-600  flex items-center justify-center font-bold hover:bg-gray-100 dark:hover:bg-gray-700" on:click={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span class="cart-quantity-text font-bold">{item.quantity}</span>
                <button class="cart-quantity-btn border border-gray-300 dark:border-gray-600  flex items-center justify-center font-bold hover:bg-gray-100 dark:hover:bg-gray-700" on:click={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                <button class="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" on:click={() => removeItem(item.id)} title="Remove">
                  <svg class="cart-remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div class="ml-2">
              <p class="cart-item-price font-extrabold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- Order Summary & Checkout -->
    {#if $cart.length > 0}
      <div class="border-t border-gray-200 dark:border-gray-700 cart-summary bg-gray-50 dark:bg-gray-900 flex-1">
        <div class="flex justify-between mb-3">
          <span class="cart-summary-text font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Subtotal</span>
          <span class="cart-summary-text font-bold text-gray-900 dark:text-white">${calculateTotal().toFixed(2)}</span>
        </div>
        <div class="flex justify-between mb-3">
          <span class="cart-summary-text font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Shipping</span>
          <span class="cart-summary-text font-bold text-gray-900 dark:text-white">Free</span>
        </div>
        <div class="flex justify-between mb-6">
          <span class="cart-total-text font-extrabold uppercase tracking-widest text-gray-900 dark:text-white">Total</span>
          <span class="cart-total-text font-extrabold text-gray-900 dark:text-white">${calculateTotal().toFixed(2)}</span>
        </div>
     
          <button on:click={goToCheckout} class="cart-checkout-btn w-full border-2 border-black dark:border-white text-black dark:text-white font-extrabold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
            Checkout
          </button>
      </div>
    {/if}
  </div>
{/if}

{#if showSuccessModal}
  <CheckoutSuccess />
{/if}
