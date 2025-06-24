<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';

  let categories = [];
  let isLoading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const products = await response.json();
      // Count products per category
      const categoryMap = {};
      for (const product of products) {
        if (!product.category) continue;
        if (!categoryMap[product.category]) {
          categoryMap[product.category] = { count: 0, image: product.mainImage || product.imageUrl, name: product.category, description: product.description };
        }
        categoryMap[product.category].count++;
        // Prefer a product with an image for the category
        if (!categoryMap[product.category].image && (product.mainImage || product.imageUrl)) {
          categoryMap[product.category].image = product.mainImage || product.imageUrl;
        }
      }
      // Get top 3 categories by count
      categories = Object.entries(categoryMap)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3)
        .map(([id, data]) => ({ id, ...data }));
    } catch (e) {
      error = e.message;
    } finally {
      isLoading = false;
    }
  });

  function handleCategoryClick(categoryId) {
    push(`/products?category=${encodeURIComponent(categoryId)}`);
  }

  function getResolvedImageUrl(category) {
    let url = category.image || category.mainImage || category.imageUrl;
    if (url && !url.startsWith('http')) {
      url = `http://localhost:3001${url}`;
    }
    return url;
  }
</script>

<section class="py-16 bg-white dark:bg-gray-900">
  <div class="max-w-7xl container mx-auto px-4">
    <h2 class="text-4xl font-bold text-center mb-12 font-adidas">Shop by Category</h2>
    {#if isLoading}
      <div class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light dark:border-primary-dark mx-auto"></div>
      </div>
    {:else if error}
      <div class="text-center py-12">
        <p class="text-red-500 dark:text-red-400">{error}</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {#each categories as category}
          <div 
            class="relative group cursor-pointer overflow-hidden rounded-md shadow-lg"
            on:click={() => handleCategoryClick(category.id)}
          >
            <!-- Category Image -->
            <div class="aspect-[4/5] w-full overflow-hidden">
              <img 
                src={getResolvedImageUrl(category)} 
                alt={getResolvedImageUrl(category)}
                class="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-gray-700/70 to-transparent"></div>
            </div>
            <!-- Category Content -->
            <div class="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
              <h3 class="text-2xl font-bold mb-2 font-adidas">{category.name}</h3>
              <p class="text-sm opacity-90 mb-4">{category.description}</p>
              <button class="inline-flex items-center text-white border-2 border-white px-6 py-2 rounded-md hover:bg-white hover:text-black transition-colors duration-300">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section> 