<script>
  import { cart } from '../../stores/cart';
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';

  let shippingInfo = {
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };

  let paymentInfo = {
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  let isLoading = false;
  let error = null;

  function calculateTotal() {
    return $cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  async function handleSubmit() {
    isLoading = true;
    error = null;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: $cart,
          shipping: shippingInfo,
          payment: paymentInfo,
          total: calculateTotal()
        }),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        cart.set([]);
        goto('/checkout/success');
      } else {
        throw new Error('Checkout failed');
      }
    } catch (err) {
      error = 'Failed to process checkout. Please try again.';
      console.error('Checkout error:', err);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">CHECKOUT</h1>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="space-y-8">
    <!-- Shipping Information -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Shipping Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1" for="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            bind:value={shippingInfo.fullName}
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="email">Email</label>
          <input
            type="email"
            id="email"
            bind:value={shippingInfo.email}
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1" for="address">Address</label>
          <input
            type="text"
            id="address"
            bind:value={shippingInfo.address}
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="city">City</label>
          <input
            type="text"
            id="city"
            bind:value={shippingInfo.city}
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="state">State</label>
          <input
            type="text"
            id="state"
            bind:value={shippingInfo.state}
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="zipCode">ZIP Code</label>
          <input
            type="text"
            id="zipCode"
            bind:value={shippingInfo.zipCode}
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="country">Country</label>
          <input
            type="text"
            id="country"
            bind:value={shippingInfo.country}
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>

    <!-- Payment Information -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Payment Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1" for="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            bind:value={paymentInfo.cardNumber}
            required
            placeholder="1234 5678 9012 3456"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="expiryDate">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            bind:value={paymentInfo.expiryDate}
            required
            placeholder="MM/YY"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            bind:value={paymentInfo.cvv}
            required
            placeholder="123"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>

    <!-- Order Summary -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
      <div class="space-y-4">
        {#each $cart as item}
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-medium">{item.name}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
            </div>
            <p class="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        {/each}
        <div class="border-t pt-4">
          <div class="flex justify-between items-center font-bold">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>

    <button
      type="submit"
      disabled={isLoading}
      class="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Processing...' : 'Complete Purchase'}
    </button>
  </form>
</div> 