<script>
  import { products } from '../../stores/products';
  import ProductCard from '../product/ProductCard.svelte';

  let featuredProducts = [];
  let isLoading = $products.loading;
  let error = $products.error;

  $: featuredProducts = $products.products.slice(0, 4);
</script>

<section class="py-16 bg-pink-50 dark:bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold mb-12 text-center tracking-wider">
      FEATURED PRODUCTS
    </h2>

    {#if isLoading}
      <div class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light dark:border-primary-dark mx-auto"></div>
      </div>
    {:else if error}
      <div class="text-center py-12">
        <p class="text-red-500 dark:text-red-400">{error}</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each featuredProducts as product}
          <ProductCard {product} />
        {/each}
      </div>
    {/if}
  </div>
</section> 