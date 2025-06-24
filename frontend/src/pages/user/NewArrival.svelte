<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import Skeleton from '../../components/common/Skeleton.svelte';
  
  let newArrivals = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await axios.get('/api/products/new-arrivals');
      newArrivals = response.data;
    } catch (e) {
      error = 'Failed to load new arrivals';
      console.error(e);
    } finally {
      loading = false;
    }
  });
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">New Arrivals</h1>
  
  {#if loading}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each Array(8) as _}
        <Skeleton type="card" />
      {/each}
    </div>
  {:else if error}
    <div class="text-red-500 text-center">{error}</div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each newArrivals as product}
        <div class="bg-white rounded-lg shadow-md overflow-hidden group">
          <div class="relative">
            <img 
              src={product.mainImage || product.image || product.imageUrl} 
              alt={product.name} 
              class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {#if product.isNew}
              <span class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                New
              </span>
            {/if}
          </div>
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{product.name}</h2>
            <p class="text-gray-600 mb-2">${product.price}</p>
            <div class="flex justify-between items-center">
              <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Add to Cart
              </button>
              <button class="text-gray-500 hover:text-gray-700">
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