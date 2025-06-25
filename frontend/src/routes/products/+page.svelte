<script>
    import { onMount } from 'svelte';
    import { products } from '../../stores/products';
    import { push } from 'svelte-spa-router';
    import { cart } from '../../stores/cart.js';
    import Skeleton from '../../components/common/Skeleton.svelte';
    import Button from '../../components/common/Button.svelte';
    import ProductCard from '../../components/product/ProductCard.svelte';
  
    let filteredProducts = [];
    let selectedCategory = 'all';
    let searchQuery = '';
    let user = null;
    let selectedProduct = null;
    let showSidebar = false;
    let sortOption = 'default';
    let categories = [];
  
    let isLoading = $products.loading;
    let error = $products.error;
    $: isLoading = $products.loading;
    $: error = $products.error;
  
    // Helper to get query param
    function getQueryParam(name) {
      const url = new URL(window.location.href);
      return url.searchParams.get(name);
    }
  
    // Update selectedCategory from URL on mount and when URL changes
    function updateCategoryFromUrl() {
      const cat = getQueryParam('category');
      selectedCategory = cat ? cat : 'all';
    }
  
    $: updateCategoryFromUrl(); // reactively update if URL changes
  
    // Derive categories from products
    $: categories = Array.from(new Set($products.products.map(p => p.category))).filter(Boolean);
  
    $: filteredProducts = $products.products
      .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
      .filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  
    $: filteredProducts =
      sortOption === 'price-asc'
        ? [...filteredProducts].sort((a, b) => a.price - b.price)
        : sortOption === 'price-desc'
        ? [...filteredProducts].sort((a, b) => b.price - a.price)
        : filteredProducts;
  
    onMount(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
      updateCategoryFromUrl();
      window.addEventListener('popstate', updateCategoryFromUrl);
      loadProducts();
    });
  
    async function loadProducts() {
      try {
        products.update(store => ({ ...store, loading: true, error: null }));
        const response = await fetch('https://shop50.onrender.com/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        products.update(store => ({
          ...store,
          products: data,
          loading: false
        }));
      } catch (e) {
        console.error('Error loading products:', e);
        products.update(store => ({
          ...store,
          error: e.message,
          loading: false
        }));
      }
    }
  
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
  </script>
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-10 text-center">Shop All Products</h1>
    <div class="flex flex-col md:flex-row md:items-end gap-6 mb-10">
      <div class="flex-1 flex flex-col md:flex-row gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest mb-1">Category</label>
          <select bind:value={selectedCategory} class="border-2 border-black dark:border-white rounded-full px-4 py-2 font-bold bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <option value="all">All</option>
            {#each categories as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest mb-1">Sort</label>
          <select bind:value={sortOption} class="border-2 border-black dark:border-white rounded-full px-4 py-2 font-bold bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
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
          bind:value={searchQuery}
          placeholder="Search products..."
          class="w-full border-2 border-black dark:border-white rounded-full px-4 py-2 font-bold bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {#each filteredProducts as product}
        <ProductCard {product} />
      {/each}
    </div>
  </div> 