<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import Skeleton from '../../components/common/Skeleton.svelte';
  import Button from '../../components/common/Button.svelte';
  
  let allProducts = [];
  let filteredProducts = [];
  let loading = true;
  let error = null;
  let selectedCategory = 'all';

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'new', name: 'New Arrivals' },
    { id: 'trending', name: 'Trending' },
    { id: 'sale', name: 'On Sale' }
  ];

  onMount(async () => {
    try {
      const response = await axios.get('https://shop50.onrender.com/api/products');
      // Ensure products have a valid createdAt date for sorting
      allProducts = response.data.map(p => ({ ...p, createdAt: p.createdAt || new Date(0) }));
      filterProducts();
    } catch (e) {
      error = 'Failed to load products';
      console.error(e);
    } finally {
      loading = false;
    }
  });

  function handleCategorySelect(categoryId) {
    selectedCategory = categoryId;
    filterProducts();
  }

  function filterProducts() {
    if (selectedCategory === 'all') {
      filteredProducts = allProducts;
    } else if (selectedCategory === 'new') {
      // Sort by creation date to get the newest arrivals
      filteredProducts = [...allProducts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8); // Show the 8 newest products
    } else if (selectedCategory === 'trending') {
      filteredProducts = allProducts.filter(p => p.trending);
    } else if (selectedCategory === 'sale') {
      filteredProducts = allProducts.filter(p => p.onSale);
    } else {
      filteredProducts = allProducts;
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

<div class="min-h-screen bg-white dark:bg-black">
  <!-- Hero Section -->
  <div class="bg-black text-white py-24">
    <div class="max-w-7xl container mx-auto px-4 text-center">
      <h1 class="text-5xl md:text-6xl font-extrabold uppercase tracking-widest mb-4">Discover Our Collections</h1>
      <p class="text-xl opacity-90">Explore our latest trends and find your perfect style</p>
    </div>
  </div>
  <!-- Categories Navigation -->
  <div class="max-w-7xl container mx-auto px-4 -mt-10">
    <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl p-6">
      <div class="flex flex-wrap gap-4 justify-center">
        {#each categories as category}
          <Button
            variation="stroke"
            class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-8 py-3 {selectedCategory === category.id ? 'bg-black text-white dark:bg-white dark:text-black' : ''}"
            on:click={() => handleCategorySelect(category.id)}
          >
            {category.name}
          </Button>
        {/each}
      </div>
    </div>
  </div>
  <!-- Products Grid -->
  <div class="max-w-7xl container mx-auto px-4 py-16">
    {#if loading}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {#each Array(8) as _}
          <Skeleton type="card" />
        {/each}
      </div>
    {:else if error}
      <div class="text-center py-12">
        <div class="text-red-500 text-xl mb-4">{error}</div>
        <button 
          class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-8 py-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          on:click={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {#each filteredProducts as product}
          <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl overflow-hidden group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <a href={`/#/products/${product.id}`} class="block">
              <div class="relative">
                <img 
                  src={getResolvedImageUrl(product)} 
                  alt={product.name} 
                  class="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div class="p-6">
                <h2 class="text-xl font-extrabold uppercase tracking-widest mb-2 text-black dark:text-white truncate">{product.name}</h2>
                <p class="text-lg font-bold mb-4 text-black dark:text-white">${product.price}</p>
                <div class="flex justify-between items-center">
                  <button class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-6 py-2 w-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </a>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div> 