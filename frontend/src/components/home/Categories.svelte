<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { products, fetchProducts } from '../../stores/products';
  import { get } from 'svelte/store';

  let categories = [];
  let isLoading = true;
  let error = null;

  onMount(async () => {
    await fetchProducts();
    const prods = get(products).products;
    // Count products per category
    const categoryMap = {};
    for (const product of prods) {
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
    isLoading = false;
  });

  function handleCategoryClick(categoryId) {
    const url = `/products?category=${encodeURIComponent(categoryId)}`;
    push(url);
  }

  function getResolvedImageUrl(category) {
    let url = category.image || category.mainImage || category.imageUrl;
    if (url && !url.startsWith('http')) {
      url = `https://shop50.onrender.com${url}`;
    }
    return url;
  }
</script>

<style>
  @import '../../styles/responsive.css';
  .cat-title {
    font-size: var(--cat-title);
    font-weight: bold;
  }
  .cat-btn {
    font-size: calc(var(--cat-btn) + 2);
    padding: calc(var(--cat-btn) * 0.8) calc(var(--cat-btn) * 2);
  }
  .cat-card {
    max-width: var(--cat-card-width);
    width: var(--cat-card-width);
    /* height: var(--cat-card-height); */
    min-width: 0;
  }
  .cat-desc {
    /* display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal; */
  }
  @media (max-width: 600px) {
    .cat-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .cat-desc {
      display: none;
    }
    .cat-btn {
      padding: calc(var(--cat-btn) * 0.6) calc(var(--cat-btn) * 1.5);
      
    }
  }
  @media (min-width: 601px) {
    .cat-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>

<section class="py-16 bg-white dark:bg-gray-900">
  <div class="max-w-7xl container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12 font-adidas">Shop by Category</h2>
    {#if isLoading}
      <div class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light dark:border-primary-dark mx-auto"></div>
      </div>
    {:else if error}
      <div class="text-center py-12">
        <p class="text-red-500 dark:text-red-400">{error}</p>
      </div>
    {:else}
      <div class="grid cat-grid gap-2">
        {#each categories as category}
          <div 
            class="relative group cursor-pointer overflow-hidden md:rounded-md shadow-lg cat-card md:h-[70vh]"
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
              <h3 class="cat-title mb-2 font-adidas">{category.name}</h3>
              <p class="cat-desc text-sm opacity-90 mb-4">
                {#if window.innerWidth <= 600}
                  <!-- Mobile: no description -->
                {:else if window.innerWidth <= 900}
                  <!-- Medium: short description -->
                  {category.shortDescription || category.description}
                {:else}
                  <!-- Large: full description -->
                  {category.description}
                {/if}
              </p>
              <button class="cat-btn text-x inline-flex items-center text-white border-2 border-white hover:bg-white hover:text-black transition-colors duration-300">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" class="hidden md:block h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
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