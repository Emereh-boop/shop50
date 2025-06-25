<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import Skeleton from '../../components/common/Skeleton.svelte';
  
  let cartItems = [];
  let loading = true;
  let error = null;
  let total = 0;
  let shipping = 0;
  let tax = 0;

  // Form data
  let shippingInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };

  let paymentInfo = {
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  };

  onMount(async () => {
    try {
      const response = await axios.get('https://shop50.onrender.com/api/cart');
      cartItems = response.data;
      calculateTotals();
    } catch (e) {
      error = 'Failed to load cart';
      console.error(e);
    } finally {
      loading = false;
    }
  });

  function calculateTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    shipping = subtotal > 100 ? 0 : 10;
    tax = subtotal * 0.1; // 10% tax
    total = subtotal + shipping + tax;
  }

  async function handleSubmit() {
    try {
      const orderData = {
        items: cartItems,
        shipping: shippingInfo,
        payment: paymentInfo,
        totals: {
          subtotal: total - shipping - tax,
          shipping,
          tax,
          total
        }
      };

      const response = await axios.post('https://shop50.onrender.com/api/orders', orderData);
      // Redirect to order confirmation page
      window.location.href = `/order-confirmation/${response.data.orderId}`;
    } catch (e) {
      error = 'Failed to process order';
      console.error(e);
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Checkout</h1>

  {#if loading}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <Skeleton type="list" />
      </div>
      <div>
        <Skeleton type="card" height="400px" />
      </div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center">{error}</div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Order Summary -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
        <div class="space-y-4">
          {#each cartItems as item}
            <div class="flex items-center">
              <img src={item.image} alt={item.name} class="w-16 h-16 object-cover rounded" />
              <div class="ml-4 flex-grow">
                <h3 class="text-sm font-medium">{item.name}</h3>
                <p class="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p class="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          {/each}
        </div>
        <div class="border-t mt-4 pt-4 space-y-2">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span>${(total - shipping - tax).toFixed(2)}</span>
          </div>
          <div class="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div class="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div class="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Checkout Form -->
      <div class="space-y-8">
        <!-- Shipping Information -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Shipping Information</h2>
          <form class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">First Name</label>
                <input 
                  type="text" 
                  bind:value={shippingInfo.firstName}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Last Name</label>
                <input 
                  type="text" 
                  bind:value={shippingInfo.lastName}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                bind:value={shippingInfo.email}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <input 
                type="tel" 
                bind:value={shippingInfo.phone}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <input 
                type="text" 
                bind:value={shippingInfo.address}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">City</label>
                <input 
                  type="text" 
                  bind:value={shippingInfo.city}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">State</label>
                <input 
                  type="text" 
                  bind:value={shippingInfo.state}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input 
                  type="text" 
                  bind:value={shippingInfo.zipCode}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Country</label>
                <input 
                  type="text" 
                  bind:value={shippingInfo.country}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </form>
        </div>

        <!-- Payment Information -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Payment Information</h2>
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Card Number</label>
              <input 
                type="text" 
                bind:value={paymentInfo.cardNumber}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                maxlength="16"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name on Card</label>
              <input 
                type="text" 
                bind:value={paymentInfo.cardName}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input 
                  type="text" 
                  bind:value={paymentInfo.expiryDate}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="MM/YY"
                  maxlength="5"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">CVV</label>
                <input 
                  type="text" 
                  bind:value={paymentInfo.cvv}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  maxlength="3"
                  placeholder="123"
                />
              </div>
            </div>
          </form>
        </div>

        <button
          class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          on:click={handleSubmit}
        >
          Place Order
        </button>
      </div>
    </div>
  {/if}
</div> 