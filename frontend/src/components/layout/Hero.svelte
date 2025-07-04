<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { products } from '../../stores/products';
  import Button from '../common/Button.svelte';

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

  $: prods = $products.products || [];
  $: banners = prods.filter(p => p.type === 'banner');
  $: featured = banners[0];

  function handleShopNow() {
    if (featured?.category) {
      const url = `/products?category=${encodeURIComponent(featured.category)}`;
      push(url);
    } else {
      push('/products');
    }
  }

  function getResolvedImageUrl(product) {
    if (!product) return '';
    let url = product.mainImage || product.image || product.imageUrl;
    if (url && !url.startsWith('http')) {
      url = `https://shop50.onrender.com${url}`;
    }
    return url;
  }
</script>

<style>
  @import '../../styles/responsive.css';
  .hero-title {
    font-size: var(--hero-title);
    padding-top: var(--hero-pad);
    padding-bottom: var(--hero-pad);
  }
  .hero-btn {
    font-size: var(--hero-btn);
    padding: calc(var(--hero-btn) * 1.5) calc(var(--hero-btn) * 2.5);
  }
  .hero-section {
    height: auto;
    padding: 0 var(--hero-pad);
  }
</style>

<section class="relative hero-section min-h-[40vh] md:min-h-[70vh] bg-pink-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
  {#if featured}
    <img
      src={getResolvedImageUrl(featured)}
      alt={featured.name}
      class="absolute inset-0 w-full h-full object-cover object-center opacity-80"
    />
    <div class="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
      <h1 class="hero-title font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-4 md:mb-8 drop-shadow-lg">{featured.name}</h1>
      <p class="text-xl md:text-2xl text-gray-800 dark:text-gray-200 mb-4 md:mb-8 max-w-2xl mx-auto drop-shadow" style="font-size:calc(var(--hero-title) * 0.45)">{featured.shortDescription || featured.description}</p>
      <Button variation="stroke" color="primary" class="hero-btn font-extrabold rounded-full uppercase tracking-widest" on:click={handleShopNow}>
        Shop Now
      </Button>
    </div>
  {:else}
    <div class="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
      <h1 class="hero-title font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-8 drop-shadow-lg">Welcome to YNT</h1>
      <Button variation="stroke" color="primary" class="hero-btn font-extrabold rounded-full uppercase tracking-widest" on:click={() => push('/products')}>
        Shop Now
      </Button>
    </div>
  {/if}
</section> 