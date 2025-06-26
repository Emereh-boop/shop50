<script>
  import { cart, calculateTotal } from '../../stores/cart';
  import { user } from '../../stores/auth';
  import { onMount } from 'svelte';
  import CheckoutSuccess from '../../components/checkout/CheckoutSuccess.svelte';
  import { push } from 'svelte-spa-router';
  import { modalStore } from '../../stores/modalStore';

  let shippingInfo = {
    fullName: '',
    email: '',
    address: '',
    phone: '',
    location: ''
  };

  let isLoading = false;
  let error = null;
  let showInvoiceModal = false;
  let showSuccessModal = false;
  let showErrorModal = false;
  let lastOrder = null;

  onMount(() => {
    // We no longer block guests.
    // The form will pre-fill if the user is logged in.
    if ($user) {
      shippingInfo.fullName = $user.name;
      shippingInfo.email = $user.email;
    }
    // Request geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          shippingInfo.location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        },
        (err) => {
          shippingInfo.location = 'Location not available';
        }
      );
    } else {
      shippingInfo.location = 'Location not available';
    }
  });

  function openInvoiceModal() {
    error = null;
    showInvoiceModal = true;
  }

  async function handleCheckout() {
    isLoading = true;
    error = null;
    for (const key of ['fullName', 'email', 'address', 'phone']) {
      if (!shippingInfo[key]) {
        error = 'Please fill out all required fields.';
        isLoading = false;
        return;
      }
    }
    showInvoiceModal = false;
    try {
      const response = await fetch('https://shop50.onrender.com/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: $cart,
          email: shippingInfo.email,
          shippingInfo
        }),
      });
      if (response.ok) {
        const { data } = await response.json();
        window.location.href = data.authorization_url;
      } else {
        throw new Error('Checkout failed');
      }
    } catch (err) {
      showErrorModal = true;
      error = 'Failed to process checkout. Please try again.';
      console.error('Checkout error:', err);
    } finally {
      isLoading = false;
    }
  }

</script>

<style>
  @import '../../styles/responsive.css';
  .checkout-title {
    font-size: var(--page-title);
  }
  .checkout-container {
    padding: var(--page-pad);
  }
  .checkout-form-input {
    font-size: var(--form-input);
    padding: calc(var(--form-input) * 0.5) calc(var(--form-input) * 1);
  }
  .checkout-label {
    font-size: var(--form-label);
  }
  .checkout-btn {
    font-size: calc(var(--form-btn) * 1.1);
    padding: calc(var(--form-btn) * 1.2) calc(var(--form-btn) * 2);
  }
  .checkout-section-title {
    font-size: calc(var(--page-title) * 0.7);
  }
  .checkout-grid {
    gap: var(--grid-gap);
  }
  .checkout-card {
    padding: calc(var(--page-pad) * 0.8);
  }
  .modal-content {
    padding: calc(var(--page-pad) * 0.6);
  }
</style>

<div class="max-w-4xl mx-auto px-4 checkout-container">
  <h1 class="checkout-title font-extrabold uppercase tracking-widest text-black dark:text-white mb-12 text-center">Checkout</h1>
  {#if error && !showErrorModal}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}
  <div class="grid grid-cols-1 md:grid-cols-2 checkout-grid">
    <!-- Shipping Information -->
    <div class="bg-white dark:bg-black border-2 border-black dark:border-white shadow-xl checkout-card">
      <h2 class="checkout-section-title font-extrabold uppercase tracking-widest mb-8 text-black dark:text-white">Shipping Information</h2>
      <form on:submit|preventDefault={openInvoiceModal} class="space-y-6">
        <div class="space-y-6">
          <div>
            <label class="checkout-label block font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input type="text" bind:value={shippingInfo.fullName} required class="checkout-form-input w-full border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
          </div>
          <div>
            <label class="checkout-label block font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" bind:value={shippingInfo.email} required class="checkout-form-input w-full border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
          </div>
          <div>
            <label class="checkout-label block font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Phone</label>
            <input type="tel" bind:value={shippingInfo.phone} required class="checkout-form-input w-full border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
          </div>
          <div>
            <label class="checkout-label block font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Address</label>
            <input type="text" bind:value={shippingInfo.address} required class="checkout-form-input w-full border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" />
          </div>
          <div>
            <label class="checkout-label block font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Location (auto-detected)</label>
            <input type="text" value={shippingInfo.location} readonly class="checkout-form-input w-full border-2 border-black dark:border-white bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" />
          </div>
        </div>
        <button class="checkout-btn w-full mt-8 border-2 border-black dark:border-white text-black dark:text-white font-extrabold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors" type="submit" disabled={isLoading}>
          {#if isLoading}
            Processing...
          {:else}
            Review Invoice
          {/if}
        </button>
      </form>
    </div>
    <!-- Order Summary -->
    <div class="bg-white dark:bg-black border-2 border-black dark:border-white shadow-xl checkout-card">
      <h2 class="checkout-section-title font-extrabold uppercase tracking-widest mb-8 text-black dark:text-white">Order Summary</h2>
      <div class="space-y-4">
        {#each $cart as item}
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-bold text-black dark:text-white">{item.name}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
            </div>
            <p class="font-bold text-black dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        {/each}
      </div>
      <div class="border-t border-black dark:border-white mt-8 pt-4">
        <div class="flex justify-between font-bold text-lg text-black dark:text-white">
          <span>Total</span>
          <span>${calculateTotal()?.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Invoice Modal -->
  {#if showInvoiceModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div class="bg-white dark:bg-black border-2 border-black dark:border-white shadow-2xl modal-content max-w-lg w-full flex flex-col items-center">
        <h2 class="checkout-section-title font-extrabold uppercase tracking-widest text-black dark:text-white mb-6">Invoice</h2>
        <div class="w-full mb-6">
          <h3 class="text-lg font-bold mb-2">Order Summary</h3>
          <ul class="divide-y divide-gray-200 dark:divide-gray-700 mb-4">
            {#each $cart as item}
              <li class="flex justify-between py-2">
                <span class="font-semibold">{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            {/each}
          </ul>
          <div class="flex justify-between font-bold">
            <span>Total</span>
            <span>${calculateTotal()?.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-sm mt-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
        </div>
        <button class="checkout-btn w-full border-2 border-black dark:border-white text-black dark:text-white font-extrabold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors mb-4" on:click={handleCheckout} disabled={isLoading}>
          {#if isLoading}
            Processing...
          {:else}
            Pay with Paystack
          {/if}
        </button>
        <button class="checkout-btn w-full border-2 border-gray-400 text-gray-700 dark:text-gray-300 font-extrabold uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" on:click={() => showInvoiceModal = false}>
          Cancel
        </button>
      </div>
    </div>
  {/if}

  <!-- Success Modal -->
  {#if showSuccessModal}
    <CheckoutSuccess order={lastOrder} />
  {/if}

  <!-- Error Modal -->
  {#if showErrorModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div class="bg-white dark:bg-black border-2 border-black dark:border-white shadow-2xl modal-content max-w-lg w-full flex flex-col items-center">
        <h2 class="checkout-section-title font-extrabold uppercase tracking-widest text-red-600 mb-6">Error</h2>
        <p class="text-center mb-6">{error}</p>
        <button class="checkout-btn w-full border-2 border-black dark:border-white text-black dark:text-white font-extrabold rounded-full uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors" on:click={() => showErrorModal = false}>
          Close
        </button>
      </div>
    </div>
  {/if}
</div> 