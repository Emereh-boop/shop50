<script>
  import { onMount } from 'svelte';
  import Button from '../../components/common/Button.svelte';
  import ProductCard from '../../components/product/ProductCard.svelte';

  let collections = [];
  let collection = null;
  let loading = true;
  let error = null;
  let isDetail = false;
  let sortOption = 'default';
  let filterCategory = 'all';

  function getCollectionIdFromHash() {
    const hash = window.location.hash || '';
    const match = hash.match(/#\/collections\/([^?&#]+)/);
    return match ? match[1] : null;
  }

  async function fetchCollections() {
    const res = await fetch('https://shop50.onrender.com/api/products/collections');
    if (!res.ok) throw new Error('Failed to fetch collections');
    collections = await res.json();
  }

  async function fetchCollectionDetail(id) {
    const res = await fetch(`https://shop50.onrender.com/api/products/collections/${id}`);
    if (!res.ok) throw new Error('Failed to fetch collection');
    collection = await res.json();
  }

  async function loadPage() {
    loading = true;
    error = null;
    collection = null;
    collections = [];
    const collectionId = getCollectionIdFromHash();
    isDetail = !!collectionId;
    try {
      if (isDetail) {
        await fetchCollectionDetail(collectionId);
      } else {
        await fetchCollections();
      }
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadPage();
    window.addEventListener('hashchange', loadPage);
  });

  $: categories = collection && collection.products ? Array.from(new Set(collection.products.map(p => p.category))).filter(Boolean) : [];
  $: filteredProducts = collection && collection.products
    ? collection.products
        .filter(p => filterCategory === 'all' || (p.category && p.category.toLowerCase() === filterCategory.toLowerCase()))
        .sort((a, b) => {
          if (sortOption === 'price-asc') return a.price - b.price;
          if (sortOption === 'price-desc') return b.price - a.price;
          if (sortOption === 'newest') return new Date(b.createdAt || b.timeStamp) - new Date(a.createdAt || a.timeStamp);
          if (sortOption === 'name') return a.name.localeCompare(b.name);
          return 0;
        })
    : [];
</script>

<div class="min-h-screen bg-white dark:bg-black">
  {#if isDetail}
    <!-- Collection Detail Page -->
    {#if loading}
      <div class="text-center text-lg">Loading collection...</div>
    {:else if error}
      <div class="text-center text-red-500">{error}</div>
    {:else if collection}
      <div class="bg-black text-white py-24">
        <div class="max-w-7xl container mx-auto px-4 text-center">
          <h1 class="text-5xl md:text-6xl font-extrabold uppercase tracking-widest mb-4">{collection.name}</h1>
          <p class="text-xl opacity-90 mb-4">{collection.description}</p>
        </div>
      </div>
      <div class="max-w-7xl container mx-auto px-4 py-8">
        <div class="flex flex-wrap gap-4 mb-8 items-end">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest mb-1">Sort</label>
            <select bind:value={sortOption} class="border-2 border-black dark:border-white rounded-full px-4 py-2 font-bold bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="name">Name</option>
            </select>
          </div>
          {#if categories.length > 1}
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest mb-1">Category</label>
            <select bind:value={filterCategory} class="border-2 border-black dark:border-white rounded-full px-4 py-2 font-bold bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <option value="all">All</option>
              {#each categories as cat}
                <option value={cat}>{cat}</option>
              {/each}
            </select>
          </div>
          {/if}
        <div class="max-w-7xl container mx-auto px-4 py-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {#each collection.products as product}
            <ProductCard {product} variant="image-like" />
          {/each}
        </div>
      </div>
      </div>
    </div>
  {:else}
    <!-- All Collections Grid -->
    <div class="bg-black text-white py-24">
      <div class="max-w-7xl container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold uppercase tracking-widest mb-4">Discover Our Collections</h1>
        <p class="text-xl opacity-90">Explore our latest curated collections and find your perfect style</p>
      </div>
    </div>
    <div class="max-w-7xl container mx-auto px-4 py-16">
      {#if loading}
        <div class="text-center text-lg">Loading collections...</div>
      {:else if error}
        <div class="text-center text-red-500">{error}</div>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {#each collections as collection}
            <a href={`/#/collections/${collection.id}`} class="block bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl overflow-hidden group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div class="relative">
                <img src={collection.image} alt={collection.name} class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div class="p-6">
                <h2 class="text-xl font-extrabold uppercase tracking-widest mb-2 text-black dark:text-white truncate">{collection.name}</h2>
                <p class="text-base text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">{collection.description}</p>
                <Button variation="stroke" class="w-full mt-2">View Collection</Button>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
{/if}
</div>