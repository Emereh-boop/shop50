<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { products, fetchProducts } from '../../stores/products';
  import { ChevronCompactLeft, ChevronCompactRight } from 'svelte-bootstrap-icons';
  import ProductCard from '../product/ProductCard.svelte';

  export let type = 'featured'; // featured, trending, new-arrivals, most-purchased, still-interested
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
  let shouldShow = true;

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

  // Helper: Get 'still interested' product IDs from localStorage
  function getStillInterestedIds() {
    if (typeof localStorage !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('interestedProducts') || '[]');
      } catch {
        return [];
      }
    }
    return [];
  }

  // Helper: Is product new (added in last 30 days)?
  function isNew(product) {
    const days = 30;
    const now = new Date();
    const added = new Date(product.timeStamp);
    return (now - added) / (1000 * 60 * 60 * 24) <= days;
  }

  function handleRemoveInterested(id) {
    // Remove from localStorage
    let interested = JSON.parse(localStorage.getItem('interestedProducts') || '[]');
    interested = interested.filter(pid => pid !== id);
    localStorage.setItem('interestedProducts', JSON.stringify(interested));
    // Remove from displayedProducts
    displayedProducts = displayedProducts.filter(p => p.id !== id);
  }

  onMount(async () => {
    await fetchProducts(); // Will only fetch if not already loaded
    // Filter products based on type
    switch (type) {
      case 'featured':
        displayedProducts = prods.filter(p => p.featured).slice(0, limit);
        break;
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
      case 'featured':
        displayedProducts = prods.filter(p => p.featured).slice(0, limit);
        break;
      case 'trending':
        displayedProducts = prods.filter(p => p.trending).slice(0, limit);
        break;
      case 'new-arrivals':
        displayedProducts = prods.filter(isNew).sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)).slice(0, limit);
        break;
      case 'most-purchased':
        displayedProducts = prods
          .slice()
          .sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0))
          .slice(0, limit);
        break;
      case 'still-interested':
        const interestedIds = getStillInterestedIds();
        displayedProducts = prods.filter(p => interestedIds.includes(p.id)).slice(0, limit);
        break;
      default:
        displayedProducts = prods.slice(0, limit);
    }
  }

  $: if (type === 'still-interested' && displayedProducts.length === 0) {
    shouldShow = false;
  }
</script>

<style>
  @import '../../styles/responsive.css';
  .showcase-title {
    font-size: calc(var(--prod-card) * 0.05 + 1.2rem);
  }
  .showcase-scroll {
    gap: var(--prod-gap);
  }
  .showcase-card {
    width: var(--prod-card);
    min-width: var(--prod-card);
    max-width: var(--prod-card);
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>

<section class="py-5 md:py-10 lg:py-14 bg-white dark:bg-gray-800" style="display: {shouldShow ? 'block' : 'none'}">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center mb-5 md:mb-12">
      <h2 class="showcase-title font-bold tracking-wider">
        {title}
      </h2>
      <button
        on:click={() => handleNavigation(seeMoreLink)}
        class="text-black dark:text-white hover:underline text-sm lg:text-base"
      >
        See More →
      </button>
    </div>

    <div class="relative">
      <div
        bind:this={sliderRef}
        class="flex overflow-x-auto scroll-smooth scrollbar-hide gap-6 snap-x snap-mandatory transition-transform duration-700 ease-in-out showcase-scroll"
      >
        {#if isLoading}
          {#each Array(limit) as _}
            <div class="flex-shrink-0 showcase-card snap-start animate-pulse">
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
            <div class="flex-shrink-0 showcase-card snap-start">
              <ProductCard {product} variant={type === 'still-interested' ? 'still-interested' : 'image-only'} on:remove={e => handleRemoveInterested(e.detail)} />
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