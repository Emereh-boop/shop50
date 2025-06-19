<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { products } from '../../stores/products';

  let currentIndex = 0;
  let banners = $products?.banners || [];
  let isLoading = true;

  function nextSlide() {
    currentIndex = currentIndex === banners.length - 1 ? 0 : currentIndex + 1;
  }

  function goToSlide(index) {
    currentIndex = index;
  }

  function handleNavigation(href) {
    if (!href) return;
    if (href.startsWith('http') || href.startsWith('www.')) {
      window.open(href.startsWith('www.') ? `https://${href}` : href, '_blank');
    } else {
      push(href);
    }
  }

  onMount(() => {
    const interval = setInterval(nextSlide, 10000);
    isLoading = false;
    return () => clearInterval(interval);
  });
</script>

<section class="relative h-[70vh] bg-pink-50 dark:bg-gray-800">
  {#if banners?.length > 0}
    <!-- Banner Image -->
    <div class="absolute inset-0">
      <img
        src={banners[currentIndex]?.imageUrl}
        alt={banners[currentIndex]?.title}
        class="w-full h-full object-cover opacity-50"
        loading="lazy"
      />
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
      <div class="text-black dark:text-white">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 tracking-wider">
          {banners[currentIndex]?.title || 'SUMMER COLLECTION 2024'}
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-2xl">
          {banners[currentIndex]?.description || 'Discover the latest trends in fashion with our exclusive summer collection. Limited edition pieces that define style and comfort.'}
        </p>
        <button
          class="px-8 py-4 bg-primary-light dark:bg-primary-dark text-black dark:text-white rounded-lg hover:bg-opacity-90 transition-colors tracking-wider text-lg"
          on:click={() => handleNavigation(banners[currentIndex]?.category ? `/products/${banners[currentIndex]?.category}` : '/products')}
        >
          SHOP NOW
        </button>
      </div>
    </div>

    <!-- Dots Indicator -->
    <div class="absolute bottom-4 flex justify-center w-full space-x-2">
      {#each banners as _, index}
        <div
          class="h-2 w-2 md:h-3 md:w-3 rounded-full cursor-pointer transition-all {index === currentIndex
            ? 'bg-secondary scale-110 md:scale-125'
            : 'bg-gray-400'}"
          on:click={() => goToSlide(index)}
        ></div>
      {/each}
    </div>
  {:else}
    <!-- Fallback Hero -->
    <div class="absolute inset-0">
      <img
        src="/images/hero-bg.jpg"
        alt="Hero background"
        class="w-full h-full object-cover opacity-50"
      />
    </div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
      <div class="text-black dark:text-white">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 tracking-wider">
          SUMMER COLLECTION 2024
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-2xl">
          Discover the latest trends in fashion with our exclusive summer collection.
          Limited edition pieces that define style and comfort.
        </p>
        <button
          class="px- 8 py- 4 bg-primary-light dark:bg-primary-dark text-black dark:text-white rounded-lg hover:bg-opacity-90 transition-colors tracking-wider text-lg"
          on:click={() => push('/products')}
        >
          SHOP NOW
        </button>
      </div>
    </div>
  {/if}
</section> 