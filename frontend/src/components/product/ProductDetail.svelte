<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { cart } from '../../stores/cart';
  import { fade, scale, fly } from 'svelte/transition';

  export let product = null;
  export let isOpen = false;

  const dispatch = createEventDispatcher();

  let selectedImage = 0;
  let quantity = 1;
  let isLoading = true;
  let relatedProducts = [];
  let selectedSize = '';
  let error = '';

  onMount(async () => {
    if (product) {
      try {
        const response = await fetch(`/api/products/${product.id}/related`);
        const data = await response.json();
        relatedProducts = data;
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        isLoading = false;
      }
    }
  });

  function closeModal() {
    dispatch('close');
  }

  function addToCart() {
    if (!selectedSize) {
      error = 'Please select a size';
      return;
    }

    const existingItem = $cart.find(
      item => item.id === product.id && item.size === selectedSize
    );

    if (existingItem) {
      cart.update(items =>
        items.map(item =>
          item.id === product.id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      cart.update(items => [
        ...items,
        { ...product, size: selectedSize, quantity },
      ]);
    }

    isOpen = false;
    dispatch('close');
  }

  function updateQuantity(value) {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      quantity = newQuantity;
    }
  }

  function handleProductClick(relatedProduct) {
    product = relatedProduct;
    quantity = 1;
    selectedImage = 0;
  }

  function handleClose() {
    isOpen = false;
    dispatch('close');
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-40"
    on:click={handleClose}
    transition:fade
  ></div>
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    transition:fade
  >
    <div class="min-h-screen px-4 text-center">
      <div
        class="fixed inset-0"
        aria-hidden="true"
      ></div>
      <span
        class="inline-block h-screen align-middle"
        aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl"
        transition:fly={{ y: -20, duration: 300 }}
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Product Image -->
          <div class="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              class="w-full h-96 object-cover rounded-lg"
            />
          </div>

          <!-- Product Info -->
          <div class="flex flex-col">
            <h2 class="text-2xl font-bold mb-2 tracking-wider">{product.name}</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {product.description}
            </p>
            <p class="text-2xl font-bold text-primary-light dark:text-primary-dark mb-6">
              ${product.price}
            </p>

            <!-- Size Selection -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SIZE
              </h3>
              <div class="grid grid-cols-4 gap-2">
                {#each ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as size}
                  <button
                    class="px-4 py-2 border {selectedSize === size
                      ? 'border-primary-light dark:border-primary-dark bg-primary-light dark:bg-primary-dark text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-light dark:hover:border-primary-dark'} rounded-lg transition-colors"
                    on:click={() => {
                      selectedSize = size;
                      error = '';
                    }}
                  >
                    {size}
                  </button>
                {/each}
              </div>
              {#if error}
                <p class="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
              {/if}
            </div>

            <!-- Quantity -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                QUANTITY
              </h3>
              <div class="flex items-center">
                <button
                  class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  on:click={() => quantity > 1 && quantity--}
                >
                  -
                </button>
                <span class="px-4 py-1 border-t border-b border-gray-300 dark:border-gray-600">
                  {quantity}
                </span>
                <button
                  class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  on:click={() => quantity++}
                >
                  +
                </button>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button
              class="w-full px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-opacity-90 transition-colors tracking-wider"
              on:click={addToCart}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if} 