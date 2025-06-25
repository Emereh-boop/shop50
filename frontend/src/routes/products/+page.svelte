<script>
    import { onMount, onDestroy } from 'svelte';
    import { products, fetchProducts } from '../../stores/products';
    import { push, location } from 'svelte-spa-router';
    import { cart } from '../../stores/cart.js';
    import Skeleton from '../../components/common/Skeleton.svelte';
    import Button from '../../components/common/Button.svelte';
    import ProductCard from '../../components/product/ProductCard.svelte';
  import { Search } from 'svelte-bootstrap-icons';
  
    let filteredProducts = [];
    let selectedCategory = 'all';
    let searchInput = '';
    let user = null;
    let selectedProduct = null;
    let showSidebar = false;
    let sortOption = 'default';
    let categories = [];
    let trending = false;
    let tag = '';
    let featured = false;
    let isNew = false;
  
    let isLoading = $products.loading;
    let error = $products.error;
    $: isLoading = $products.loading;
    $: error = $products.error;
  
    // Helper to get query params from hash-based routing
    function getHashQueryParams() {
      // window.location.hash is something like '#/products?category=Running%20Shoes'
      const hash = window.location.hash || '';
      const queryIndex = hash.indexOf('?');
      if (queryIndex === -1) return {};
      const queryString = hash.substring(queryIndex + 1);
      return Object.fromEntries(new URLSearchParams(queryString));
    }
  
    function syncUIFromHash() {
      const paramsObj = getHashQueryParams();
      searchInput = paramsObj.q || '';
      selectedCategory = paramsObj.category || 'all';
      sortOption = paramsObj.sort || 'default';
      trending = paramsObj.trending === 'true';
      tag = paramsObj.tag || '';
      featured = paramsObj.featured === 'true';
      isNew = paramsObj.new === 'true';
    }
  
    // Derive categories from products
    $: categories = Array.from(new Set($products.products.map(p => p.category))).filter(Boolean);
  
    $: filteredProducts = $products.products
      .filter(p => selectedCategory === 'all' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()))
      .filter(p => !trending || p.trending)
      .filter(p => !featured || p.featured)
      .filter(p => {
        if (!tag) return true;
        if (tag.toLowerCase() === 'featured') return p.featured;
        if (tag.toLowerCase() === 'new') return p.isNew || (p.tag && p.tag.toLowerCase() === 'new');
        return true;
      })
      .filter(p => !isNew || (p.createdAt && (new Date() - new Date(p.createdAt)) < 30 * 24 * 60 * 60 * 1000))
      .filter(p =>
        p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchInput.toLowerCase()))
      );
  
    $: filteredProducts =
      isNew
        ? [...filteredProducts].sort((a, b) => new Date(b.createdAt || b.timeStamp) - new Date(a.createdAt || a.timeStamp))
        : sortOption === 'price-asc'
        ? [...filteredProducts].sort((a, b) => a.price - b.price)
        : sortOption === 'price-desc'
        ? [...filteredProducts].sort((a, b) => b.price - a.price)
        : filteredProducts;
  
    onMount(() => {
      syncUIFromHash();
      window.addEventListener('hashchange', syncUIFromHash);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
      fetchProducts();
    });
    onDestroy(() => {
      window.removeEventListener('hashchange', syncUIFromHash);
    });
  
    function handleProductClick(product) {
      push(`/products/${product.id}`);
    }
  
    async function handleDelete(id) {
      if (!confirm('Are you sure you want to delete this product?')) return;
  
      try {
        const response = await fetch(`https://shop50.onrender.com/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          products.update(store => ({
            ...store,
            products: store.products.filter(p => p.id !== id)
          }));
        } else {
          throw new Error('Failed to delete product');
        }
      } catch (e) {
        console.error('Error deleting product:', e);
        products.update(store => ({
          ...store,
          error: e.message
        }));
      }
    }
  
    function addToCart(product) {
      const existingItem = $cart.find(item => item.id === product.id);
      if (existingItem) {
        cart.update(items => 
          items.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        cart.update(items => [...items, { ...product, quantity: 1 }]);
      }
    }
  
    function getResolvedImageUrl(product) {
      let url = product.mainImage || product.image || product.imageUrl;
      if (url && !url.startsWith('http')) {
        url = `https://shop50.onrender.com${url}`;
      }
      return url;
    }
  
    function updateHash() {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
      if (sortOption && sortOption !== 'default') params.set('sort', sortOption);
      if (searchInput) params.set('q', searchInput);
      window.location.hash = `/products?${params.toString()}`;
    }
  
    function handleSearchKey(e) {
      if (e.key === 'Enter') updateHash();
    }
  
    function handleSearchClick() {
      updateHash();
    }
  </script>
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-10 text-center">Shop All Products</h1>
    <div class="flex flex-col md:flex-row md:items-end gap-6 mb-10">
      <div class="flex-1 flex flex-col md:flex-row gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest mb-1">Category</label>
          <select bind:value={selectedCategory} on:change={updateHash} class="border-2 border-black dark:border-white rounded-full px-4 py-2 font-bold bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <option value="all">All</option>
            {#each categories as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest mb-1">Sort</label>
          <select bind:value={sortOption} on:change={updateHash} class="border-2 border-black dark:border-white rounded-full px-4 py-2 font-bold bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div class="flex-1">
        <label class="block text-xs font-bold uppercase tracking-widest mb-1">Search</label>
        <input
          type="text"
          bind:value={searchInput}
          on:keydown={handleSearchKey}
          placeholder="Search products..."
          class="w-full border-2 border-black dark:border-white rounded-full px-4 py-2 font-bold bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <Button on:click={handleSearchClick} class="ml-2"><Search/></Button>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {#each filteredProducts as product}
        <ProductCard {product} variant="image-like" />
      {/each}
    </div>
  </div> 