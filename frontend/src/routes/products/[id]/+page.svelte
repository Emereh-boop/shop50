<script>
  import { onMount } from 'svelte';
  import { params } from 'svelte-spa-router';
  import { cart } from '../../../stores/cart';
  import { user } from '../../../stores/user';
  import Button from '../../../components/common/Button.svelte';

  let product = null;
  $: productId = $params?.id;

  let quantity = 1;
  let selectedSize = '';
  let error = '';

  // Gallery modal state
  let showGallery = false;
  let galleryIndex = 0;
  $: galleryImages = [getResolvedImageUrl(product), ...(product?.additionalImages?.map(getResolvedImageUrl) || [])];

  // Related products
  let relatedProducts = [];
  let isLoadingRelated = true;

  // Reactively fetch product when productId changes
  $: if (productId) {
    fetchProduct(productId);
  }

  async function fetchProduct(id) {
    product = null;
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        product = await res.json();
        fetchRelatedProducts();
      } else {
        product = null;
      }
    } catch (e) {
      product = null;
    }
  }

  async function fetchRelatedProducts() {
    if (!product?.id) return;
    isLoadingRelated = true;
    try {
      const response = await fetch(`/api/products/${product.id}/related`);
      if (response.ok) {
        relatedProducts = await response.json();
      } else {
        relatedProducts = [];
      }
    } catch (e) {
      relatedProducts = [];
    } finally {
      isLoadingRelated = false;
    }
  }

  function openGallery(index = 0) {
    galleryIndex = index;
    showGallery = true;
  }
  function closeGallery() {
    showGallery = false;
  }
  function prevImage() {
    galleryIndex = (galleryIndex - 1 + galleryImages?.length) % galleryImages?.length;
  }
  function nextImage() {
    galleryIndex = (galleryIndex + 1) % galleryImages?.length;
  }

  function addToCart() {
    if (!selectedSize) {
      error = 'Please select a size';
      return;
    }
    error = '';
    const item = {
      id: product?.id,
      name: product?.name,
      price: product?.price,
      image: product?.image || product?.mainImage,
      size: selectedSize,
      quantity
    };
    $cart = [...$cart, item];
  }

  function handleRelatedProductClick(relatedProduct) {
    window.location.hash = `/products/${relatedProduct.id}`;
  }

  function getResolvedImageUrl(productOrUrl) {
    if (!productOrUrl) return '';
    let url = typeof productOrUrl === 'string' ? productOrUrl : (productOrUrl.mainImage || productOrUrl.image || productOrUrl.imageUrl);
    if (url && !url.startsWith('http')) {
      url = `https://shop50.onrender.com${url}`;
    }
    return url;
  }
</script>

{#if !productId}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-red-600 text-xl font-bold">
    Invalid product URL. No product ID found.
  </div>
{:else}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Product Image & Gallery -->
      <div class="relative">
        <div class="w-full aspect-w-1 aspect-h-1 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center" on:click={() => openGallery(galleryIndex)}>
          <img
            src={getResolvedImageUrl(product)}
            alt={getResolvedImageUrl(product)}
            class="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
          />
        </div>
        {#if product?.additionalImages && product.additionalImages?.length > 0}
          <div class="flex gap-3 mt-6">
            {#each product?.additionalImages as img, i}
              <img
                src={getResolvedImageUrl(img)}
                alt={getResolvedImageUrl(img)}
                class="w-16 h-16 object-cover rounded-lg border-2 {galleryIndex === i+1 ? 'border-primary-light dark:border-primary-dark' : 'border-gray-200 dark:border-gray-700'} cursor-pointer"
                on:click={() => openGallery(i+1)}
              />
            {/each}
          </div>
        {/if}
      </div>

      <!-- Product Info -->
      <div class="flex flex-col justify-between space-y-8">
        <div>
          <h1 class="text-4xl font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-4">{product?.name || 'No name'}</h1>
          <div class="flex items-center gap-4 mb-4">
            <span class="text-2xl font-bold text-gray-900 dark:text-white">${product?.price ? product.price.toFixed(2) : '0.00'}</span>
            {#if product?.onSale}
              <span class="text-base font-bold text-red-500 ml-2">Sale</span>
            {/if}
          </div>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">{product?.description || 'No description'}</p>
        </div>
        <!-- Size Selection -->
        <div>
          <h2 class="text-base font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Size</h2>
          <div class="flex gap-3 flex-wrap">
            {#each product?.sizes || ['S', 'M', 'L', 'XL'] as size}
              <button
                class="border-2 border-black dark:border-white rounded-full py-2 px-6 text-base font-bold uppercase tracking-widest {selectedSize === size ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors"
                on:click={() => selectedSize = size}
              >
                {size}
              </button>
            {/each}
          </div>
          {#if error}
            <p class="mt-2 text-sm text-red-600">{error}</p>
          {/if}
        </div>
        <!-- Quantity -->
        <div>
          <h2 class="text-base font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Quantity</h2>
          <div class="flex items-center gap-4">
            <button
              class="w-8 h-8 border-2 border-black dark:border-white rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700"
              on:click={() => quantity = Math.max(1, quantity - 1)}
            >-</button>
            <span class="text-lg font-bold">{quantity}</span>
            <button
              class="w-8 h-8 border-2 border-black dark:border-white rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700"
              on:click={() => quantity++}
            >+</button>
          </div>
        </div>
        <!-- Add to Cart Button -->
        <Button variation="stroke" color="primary" class="w-full py-4 text-lg font-extrabold rounded-full uppercase tracking-widest mt-6" on:click={addToCart}>Add to Cart</Button>
      </div>
    </div>

    <!-- Related Products -->
    <div class="mt-16">
      <h2 class="text-2xl font-extrabold uppercase tracking-widest mb-6 text-gray-900 dark:text-white">Related Products</h2>
      {#if isLoadingRelated}
        <div>Loading...</div>
      {:else if !relatedProducts || relatedProducts.length === 0}
        <div class="text-gray-500 dark:text-gray-400">No related products found.</div>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {#each relatedProducts as related}
            <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer" on:click={() => handleRelatedProductClick(related)}>
              <img src={getResolvedImageUrl(related)} alt={getResolvedImageUrl(related)} class="w-full aspect-square object-cover" />
              <div class="flex-1 flex flex-col justify-between p-5">
                <h3 class="text-lg font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-2 line-clamp-2">{related.name || 'No name'}</h3>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-base font-bold text-gray-900 dark:text-white">${related.price ? related.price : '0.00'}</span>
                  {#if related.onSale}
                    <span class="text-xs font-bold text-red-500 ml-2">Sale</span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Gallery Modal -->
  {#if showGallery}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <Button variation="icon" color="primary" class="absolute top-4 right-4 text-3xl" on:click={closeGallery}>&times;</Button>
      <Button variation="icon" color="primary" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-3xl" on:click={prevImage}>&lt;</Button>
      <img src={galleryImages[galleryIndex]} alt="Gallery image" class="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg" />
      <Button variation="icon" color="primary" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-3xl" on:click={nextImage}>&gt;</Button>
    </div>
  {/if}
{/if} 