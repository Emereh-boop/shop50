<script>
  import { push } from 'svelte-spa-router';
  import { cart } from '../../stores/cart';
  import ProductDetail from './ProductDetail.svelte';

  export let product;

  let isProductModalOpen = false;

  function addToCart() {
    const existingItem = $cart.find(item => item.id === product.id);
    if (existingItem) {
      cart.update(items =>
        items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      cart.update(items => [...items, { ...product, quantity: 1 }]);
    }
  }

  function handleProductClick() {
    push(`/product/${product.id}`);
  }
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
  <a href="/products/{product.id}" class="block">
    <div class="relative pb-[100%]">
      <img
        src={product.image}
        alt={product.name}
        class="absolute inset-0 w-full h-full object-cover"
      />
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {product.name}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
        {product.description}
      </p>
      <div class="flex justify-between items-center">
        <span class="text-lg font-bold text-gray-900 dark:text-white">
          ${product.price.toFixed(2)}
        </span>
        <button
          class="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </a>
</div>

<ProductDetail
  bind:isOpen={isProductModalOpen}
  {product}
  on:close={() => {
    isProductModalOpen = false;
  }}
/> 