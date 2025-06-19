<script>
  import { onMount } from 'svelte';
  import { cart } from '../../../stores/cart';
  import { user } from '../../../stores/user';

  export let data;
  const product = data.product;

  let quantity = 1;
  let selectedSize = '';
  let error = '';

  function addToCart() {
    if (!selectedSize) {
      error = 'Please select a size';
      return;
    }
    error = '';
    
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity
    };

    $cart = [...$cart, item];
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- Product Image -->
    <div class="relative">
      <div class="aspect-w-1 aspect-h-1 w-full">
        <img
          src={product.image}
          alt={product.name}
          class="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>

    <!-- Product Info -->
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {product.name}
        </h1>
        <p class="mt-2 text-2xl text-gray-900 dark:text-white">
          ${product.price.toFixed(2)}
        </p>
      </div>

      <div>
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Description</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {product.description}
        </p>
      </div>

      <!-- Size Selection -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Size</h2>
        <div class="mt-2 grid grid-cols-4 gap-2">
          {#each ['S', 'M', 'L', 'XL'] as size}
            <button
              class="border rounded-md py-2 px-4 text-sm font-medium {selectedSize === size
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}"
              on:click={() => selectedSize = size}
            >
              {size}
            </button>
          {/each}
        </div>
        {#if error}
          <p class="mt-2 text-sm text-red-600">{error}</p>
        {/if}
      </div>

      <!-- Quantity -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Quantity</h2>
        <div class="mt-2 flex items-center space-x-4">
          <button
            class="border rounded-md p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            on:click={() => quantity = Math.max(1, quantity - 1)}
          >
            -
          </button>
          <span class="text-gray-900 dark:text-white">{quantity}</span>
          <button
            class="border rounded-md p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            on:click={() => quantity++}
          >
            +
          </button>
        </div>
      </div>

      <!-- Add to Cart Button -->
      <button
        on:click={addToCart}
        class="w-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md text-base font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
      >
        Add to Cart
      </button>
    </div>
  </div>
</div> 