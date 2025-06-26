<script>
  import { push } from 'svelte-spa-router';
  import { cart } from '../../stores/cart';
  import { addInterestedProduct, isNewProduct } from '../../utils/interested.js';
  import { createEventDispatcher } from 'svelte';

  export let product;
  export let variant = 'full'; // 'full', 'image-only', 'image-like', 'still-interested'
  let liked = false;
  const dispatch = createEventDispatcher();

  function handleClick() {
    addInterestedProduct(product.id);
    push(`/products/${product.id}`);
  }

  function addToCart() {
    const existingItem = $cart.find(item => item.id === product.id);
    if (existingItem) {
      $cart = $cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      $cart = [...$cart, { ...product, quantity: 1 }];
    }
  }

  function getResolvedImageUrl(product) {
    let url = product.mainImage || product.image || product.imageUrl;
    if (url && !url.startsWith('http')) {
      url = `https://shop50.onrender.com${url}`;
    }
    return url;
  }

  function toggleLike(e) {
    e.stopPropagation();
    liked = !liked;
  }
</script>

<style>
  @import '../../styles/responsive.css';
  .card-root {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }
  .card-img {
    min-height: 240px;
    max-height: 320px;
  }
  .card-title {
    font-size: var(--card-title);
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>

{#if variant === 'full'}
  <div class="group bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl border-2 dark:border-gray-200 border-black transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer relative card-root" on:click={handleClick}>
    <div class="relative w-full card-img" style="aspect-ratio: 1/1;">
      {#if product.featured}
        <span class="absolute top-3 left-3 bg-yellow-400 text-xs font-bold px-2 py-1 rounded shadow z-20">Featured</span>
      {/if}
      {#if product.trending}
        <span class="absolute top-3 right-3 bg-pink-500 text-xs font-bold px-2 py-1 rounded shadow z-20">Trending</span>
      {/if}
      {#if isNewProduct(product)}
        <span class="absolute bottom-3 left-3 bg-green-500 text-xs font-bold px-2 py-1 rounded shadow z-20">New</span>
      {/if}
      <img
        src={getResolvedImageUrl(product)}
        alt={getResolvedImageUrl(product)}
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div class="flex-1 flex flex-col justify-between p-5">
      <div>
        <h3 class="card-title font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-2 line-clamp-2">{product.name}</h3>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-base font-bold text-gray-900 dark:text-white">${product.price}</span>
          {#if product.onSale}
            <span class="text-xs font-bold text-red-500 ml-2">Sale</span>
          {/if}
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{product.shortDescription || product.description}</p>
      </div>
    </div>
  </div>
{:else if variant === 'image-only'}
  <div class="group bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl border-2 dark:border-gray-200 border-black transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer relative card-root" on:click={handleClick}>
    <div class="relative w-full card-img" style="aspect-ratio: 1/1;">
      <img
        src={getResolvedImageUrl(product)}
        alt={getResolvedImageUrl(product)}
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {#if product.additionalImages && product.additionalImages.length > 0}
        <div class="absolute left-0 bottom-0 flex gap-2 items-end px-2 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
          {#each product.additionalImages as img}
            <img
              src={img.startsWith('http') ? img : `https://shop50.onrender.com${img}`}
              alt="Additional"
              class="w-12 h-12 object-cover border dark:border-gray-200 border-black shadow pointer-events-auto"
              draggable="false"
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>
{:else if variant === 'image-like'}
  <div class="group bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl border-2 dark:border-gray-200 border-black transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer relative card-root" on:click={handleClick}>
    <div class="relative w-full card-img" style="aspect-ratio: 1/1;">
      <img
        src={getResolvedImageUrl(product)}
        alt={getResolvedImageUrl(product)}
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <button class="absolute top-3 right-3 bg-white/80 dark:bg-gray-900/80 p-2 z-20" on:click={toggleLike} aria-label="Like">
        <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? 'red' : 'none'} viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
        </svg>
      </button>
    </div>
  </div>
{:else if variant === 'still-interested'}
  <div class="group bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl border-2 border-gray-200 dark:border-black transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer relative card-root" style="margin: 0 auto;">
    <button class="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/80 p-1 z-30 hover:bg-red-100 dark:hover:bg-red-800 transition" on:click|stopPropagation={() => dispatch('remove', product.id)} aria-label="Remove">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4 text-red-500"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
    <div class="relative w-full card-img" style="aspect-ratio: 1/1;">
      <img
        src={getResolvedImageUrl(product)}
        alt={getResolvedImageUrl(product)}
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div class="flex-1 flex flex-col justify-between p-2">
      <h3 class="card-title font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
      <span class="text-xs font-bold text-gray-900 dark:text-white">${product.price}</span>
    </div>
  </div>
{/if}
