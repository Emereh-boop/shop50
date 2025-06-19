<script>
    import { onMount } from 'svelte';
    import { products } from '../../stores/products';
    import { push } from 'svelte-spa-router';
    import { cart } from '../../stores/cart.js';
    import ProductDetail from '../../components/product/ProductDetail.svelte';
    import Skeleton from '../../components/common/Skeleton.svelte';
  
    let filteredProducts = [];
    let selectedCategory = 'all';
    let searchQuery = '';
    let isLoading = true;
    let error = null;
    let user = null;
    let selectedProduct = null;
    let isProductModalOpen = false;
  
    $: {
      if ($products?.products) {
        filteredProducts = $products.products.filter(product => {
          const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
          const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        });
      } else {
        filteredProducts = [];
      }
    }
  
    onMount(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
      loadProducts();
    });
  
    async function loadProducts() {
      try {
        products.update(store => ({ ...store, loading: true, error: null }));
        const response = await fetch('http://localhost:3001/api/products');
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
      selectedProduct = product;
      isProductModalOpen = true;
    }
  
    async function handleDelete(id) {
      if (!confirm('Are you sure you want to delete this product?')) return;
  
      try {
        const response = await fetch(`http://localhost:3001/api/products/${id}`, {
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
  </script>
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Filters -->
      <div class="w-full md:w-64 space-y-6">
        <div>
          <h3 class="text-lg font-semibold mb-4 tracking-wider">CATEGORIES</h3>
          <div class="space-y-2">
            <button
              class="block w-full text-left px-4 py-2 rounded-lg {selectedCategory === 'all'
                ? 'bg-primary-light dark:bg-primary-dark text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'}"
              on:click={() => (selectedCategory = 'all')}
            >
              All Products
            </button>
            <button
              class="block w-full text-left px-4 py-2 rounded-lg {selectedCategory === 'summer'
                ? 'bg-primary-light dark:bg-primary-dark text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'}"
              on:click={() => (selectedCategory = 'summer')}
            >
              Summer Collection
            </button>
            <button
              class="block w-full text-left px-4 py-2 rounded-lg {selectedCategory === 'new'
                ? 'bg-primary-light dark:bg-primary-dark text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'}"
              on:click={() => (selectedCategory = 'new')}
            >
              New Arrivals
            </button>
          </div>
        </div>
      </div>
  
      <!-- Products Grid -->
      <div class="flex-1">
        <div class="mb-6">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search products..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
          />
        </div>
  
        {#if isLoading}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each Array(9) as _}
              <Skeleton type="card" />
            {/each}
          </div>
        {:else if error}
          <div class="text-center py-12">
            <p class="text-red-500 dark:text-red-400">{error}</p>
          </div>
        {:else if filteredProducts.length === 0}
          <div class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400">No products found</p>
          </div>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredProducts as product}
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div 
                  class="cursor-pointer"
                  on:click={() => handleProductClick(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    class="w-full h-64 object-cover"
                  />
                  <div class="p-4">
                    <p class="text-sm font-medium text-primary-light dark:text-primary-dark mb-2">
                      {product.category}
                    </p>
                    <h3 class="text-lg font-semibold mb-2 tracking-wider">{product.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div class="flex justify-between items-center">
                      <span class="text-xl font-bold text-primary-light dark:text-primary-dark"
                        >${product.price}</span
                      >
                      <button
                        class="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-opacity-90 transition-colors tracking-wider"
                        on:click|stopPropagation={() => addToCart(product)}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
                {#if user}
                  <div class="px-4 pb-4">
                    <button
                      on:click={() => handleDelete(product.id)}
                      class="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete Product
                    </button>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>

  <ProductDetail
    bind:isOpen={isProductModalOpen}
    product={selectedProduct}
    on:close={() => {
      isProductModalOpen = false;
      selectedProduct = null;
    }}
  /> 