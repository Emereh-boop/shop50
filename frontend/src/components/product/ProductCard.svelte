<script>
  import { push } from 'svelte-spa-router';
  import { cart } from '../../stores/cart';

  export let product;

  function handleClick() {
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
      url = `http://localhost:3001${url}`;
    }
    return url;
  }
</script>

<div class="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer" on:click={handleClick}>
  <div class="relative w-full" style="aspect-ratio: 1/1;">
    <img
      src={getResolvedImageUrl(product)}
      alt={getResolvedImageUrl(product)}
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <button
      class="absolute top-3 right-3 bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-full p-2 shadow hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors z-10"
      on:click|stopPropagation={addToCart}
      title="Add to Cart"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.48 19h9.04a2 2 0 001.83-2.7L17 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7"/></svg>
    </button>
  </div>
  <div class="flex-1 flex flex-col justify-between p-5">
    <div>
      <h3 class="text-lg font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-2 line-clamp-2">{product.name}</h3>
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
