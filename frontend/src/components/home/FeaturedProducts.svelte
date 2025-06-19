<script>
  import { onMount } from 'svelte';
  import { products } from '../../stores/products';
  import ProductCard from '../product/ProductCard.svelte';

  let featuredProducts = [];
  let isLoading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      products.set({ products: data });
      featuredProducts = data.slice(0, 4); // Show first 4 products as featured
    } catch (e) {
      error = 'Failed to load products';
      console.error(e);
    } finally {
      isLoading = false;
    }
  });
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