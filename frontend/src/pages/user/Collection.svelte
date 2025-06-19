<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import Skeleton from '../../components/common/Skeleton.svelte';
  
  let trendingProducts = [];
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
      const response = await axios.get('/api/products/trending');
      trendingProducts = response.data;
    } catch (e) {
      error = 'Failed to load trending products';
      console.error(e);
    } finally {
      loading = false;
    }
  });

  function handleCategorySelect(categoryId) {
    selectedCategory = categoryId;
    // Here you would typically fetch products for the selected category
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Hero Section -->
  <div class="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white py-16">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Discover Our Collections</h1>
      <p class="text-xl opacity-90">Explore our latest trends and find your perfect style</p>
    </div>
  </div>

  <!-- Categories Navigation -->
  <div class="container mx-auto px-4 -mt-8">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div class="flex flex-wrap gap-4 justify-center">
        {#each categories as category}
          <button
            class="px-6 py-2 rounded-full transition-all duration-200 {selectedCategory === category.id 
              ? 'bg-primary-light dark:bg-primary-dark text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}"
            on:click={() => handleCategorySelect(category.id)}
          >
            {category.name}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Products Grid -->
  <div class="container mx-auto px-4 py-12">
    {#if loading}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each Array(8) as _}
          <Skeleton type="card" />
        {/each}
      </div>
    {:else if error}
      <div class="text-center py-12">
        <div class="text-red-500 text-xl mb-4">{error}</div>
        <button 
          class="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-opacity-90 transition-colors"
          on:click={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each trendingProducts as product}
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="relative">
              <img 
                src={product.image} 
                alt={product.name} 
                class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {#if product.trendingRank <= 3}
                <span class="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  #{product.trendingRank} Trending
                </span>
              {/if}
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
            </div>
            <div class="p-6">
              <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{product.name}</h2>
              <p class="text-primary-light dark:text-primary-dark text-lg font-bold mb-4">${product.price}</p>
              <div class="flex justify-between items-center">
                <button class="bg-primary-light dark:bg-primary-dark text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex-1 mr-2">
                  Add to Cart
                </button>
                <button class="p-2 text-gray-500 hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div> 