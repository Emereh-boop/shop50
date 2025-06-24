<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { products } from '../../stores/products';
  import { ChevronCompactLeft, ChevronCompactRight } from 'svelte-bootstrap-icons';
  import ProductCard from '../product/ProductCard.svelte';

  export let type = 'featured'; // featured, trending, new-arrivals, most-purchased
  export let title = 'Featured Products';
  export let seeMoreLink = '/products';
  export let limit = 4;

  let sliderRef;
  let canScrollLeft = false;
  let canScrollRight = false;
  let prods = $products?.products || [];
  let displayedProducts = [];
  let isLoading = $products.loading;
  let error = $products.error;

  function checkScroll() {
    if (sliderRef) {
      canScrollLeft = sliderRef.scrollLeft > 0;
      canScrollRight = sliderRef.scrollLeft + sliderRef.clientWidth < sliderRef.scrollWidth;
    }
  }

  function slideLeft() {
    sliderRef.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  }

  function slideRight() {
    sliderRef.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  }

  function handleNavigation(path) {
    push(path);
  }

  onMount(async () => {
    if (!$products.products || !$products.products.length) {
      products.update(store => ({ ...store, loading: true, error: null }));
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        products.update(store => ({ ...store, products: data, loading: false }));
      } catch (e) {
        products.update(store => ({ ...store, error: e.message, loading: false }));
      }
    }

    // Filter products based on type
    switch (type) {
      case 'trending':
        displayedProducts = prods.filter(p => p.trending).slice(0, limit);
        break;
      case 'new-arrivals':
        displayedProducts = prods
          .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
          .slice(0, limit);
        break;
      case 'most-purchased':
        // This would need orders data to be implemented
        displayedProducts = prods.slice(0, limit);
        break;
      default: // featured
        displayedProducts = prods.slice(0, limit);
    }

    checkScroll();
    sliderRef?.addEventListener('scroll', checkScroll);
    return () => sliderRef?.removeEventListener('scroll', checkScroll);
  });

  $: prods = $products?.products || [];
  $: isLoading = $products.loading;
  $: error = $products.error;
  $: {
    switch (type) {
      case 'trending':
        displayedProducts = prods.filter(p => p.trending).slice(0, limit);
        break;
      case 'new-arrivals':
        displayedProducts = prods
          .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
          .slice(0, limit);
        break;
      case 'most-purchased':
        displayedProducts = prods.slice(0, limit);
        break;
      default:
        displayedProducts = prods.slice(0, limit);
    }
  }
</script>

<section class="py-16 bg-white dark:bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center mb-12">
      <h2 class="text-3xl font-bold tracking-wider">
        {title}
      </h2>
      <button
        on:click={() => handleNavigation(seeMoreLink)}
        class="text-black hover:underline text-sm lg:text-base"
      >
        See More →
      </button>
    </div>

    <div class="relative">
      <div
        bind:this={sliderRef}
        class="flex overflow-x-auto scroll-smooth scrollbar-hide gap-8 snap-x snap-mandatory transition-transform duration-700 ease-in-out"
      >
        {#if isLoading}
          {#each Array(limit) as _}
            <div class="flex-shrink-0 w-64 lg:w-80 snap-start animate-pulse">
              <div class="bg-gray-200 dark:bg-gray-700 rounded-lg">
                <div class="w-full h-64 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
                <div class="p-4 space-y-3">
                  <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                </div>
              </div>
            </div>
          {/each}
        {:else if error}
          <div class="text-center py-12">
            <p class="text-red-500 dark:text-red-400">{error}</p>
          </div>
        {:else}
          {#each displayedProducts as product}
            <div class="flex-shrink-0 w-64 lg:w-80 snap-start">
              <ProductCard {product} />
            </div>
          {/each}
        {/if}
      </div>

      {#if canScrollLeft}
        <ChevronCompactLeft
          on:click={slideLeft}
          size={30}
          class="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 text-gray-700 cursor-pointer rounded-sm z-10 hover:bg-gray-100/50 transition"
        />
      {/if}

      {#if canScrollRight}
        <ChevronCompactRight
          on:click={slideRight}
          size={30}
          class="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 text-gray-700 cursor-pointer rounded-sm z-10 hover:bg-gray-100/50 transition"
        />
      {/if}
    </div>
  </div>
</section>

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style> 