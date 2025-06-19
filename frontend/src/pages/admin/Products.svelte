<script>
  import { onMount } from 'svelte';
  import axios from '../../lib/axios';
  
  let products = [];
  let loading = true;
  let error = null;
  let showAddModal = false;
  let newProduct = {
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    category: '',
    stock: '',
    brand: '',
    sizes: '',
    colors: '',
    tags: '',
    trending: false,
    onSale: false,
    discount: 0,
    relatedProducts: []
  };
  let mainImage = null;
  let additionalImages = [];

  onMount(async () => {
    await loadProducts();
  });

  async function loadProducts() {
    try {
      const response = await axios.get('/api/admin/products');
      products = response.data;
    } catch (e) {
      error = 'Failed to load products';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function handleAddProduct() {
    console.log('1. Frontend: Starting handleAddProduct');
    if (!mainImage) {
      error = 'Please select a main image for the product.';
      return;
    }

    console.log('2. Frontend: Creating FormData');
    const formData = new FormData();
    formData.append('mainImage', mainImage);
    additionalImages.forEach((file, index) => {
      formData.append(`additionalImages`, file);
    });
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('shortDescription', newProduct.shortDescription);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    formData.append('stock', newProduct.stock);
    formData.append('brand', newProduct.brand);
    formData.append('sizes', newProduct.sizes);
    formData.append('colors', newProduct.colors);
    formData.append('tags', newProduct.tags);
    formData.append('trending', newProduct.trending);
    formData.append('onSale', newProduct.onSale);
    formData.append('discount', newProduct.discount);
    formData.append('relatedProducts', JSON.stringify(newProduct.relatedProducts));

    console.log('3. Frontend: Sending request to backend');
    try {
      const response = await axios.post('http://localhost:3001/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('4. Frontend: Received response from backend', response.data);
      showAddModal = false;
      await loadProducts();
      // Reset form
      newProduct = {
        name: '',
        description: '',
        shortDescription: '',
        price: '',
        category: '',
        stock: '',
        brand: '',
        sizes: '',
        colors: '',
        tags: '',
        trending: false,
        onSale: false,
        discount: 0,
        relatedProducts: []
      };
      mainImage = null;
      additionalImages = [];
    } catch (e) {
      console.error('5. Frontend: Error occurred', e);
      error = e.response?.data?.message || 'Failed to add product';
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`/api/admin/products/${id}`);
      await loadProducts();
    } catch (e) {
      error = 'Failed to delete product';
      console.error(e);
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">Products Management</h1>
    <button 
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      on:click={() => showAddModal = true}
    >
      Add New Product
    </button>
  </div>
  
  {#if loading}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center">{error}</div>
  {:else}
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each products as product}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img class="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt={product.name} />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{product.name}</div>
                    <div class="text-sm text-gray-500">{product.description}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${product.price}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.category}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.stock}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                  on:click={() => {/* TODO: Implement edit */}}
                >
                  Edit
                </button>
                <button 
                  class="text-red-600 hover:text-red-900"
                  on:click={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if showAddModal}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4">Add New Product</h2>
      <form on:submit|preventDefault={handleAddProduct}>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              bind:value={newProduct.name}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              bind:value={newProduct.description}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Short Description</label>
            <textarea 
              bind:value={newProduct.shortDescription}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="2"
              required
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Price</label>
            <input 
              type="number" 
              bind:value={newProduct.price}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <input 
              type="text" 
              bind:value={newProduct.category}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Stock</label>
            <input 
              type="number" 
              bind:value={newProduct.stock}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Brand</label>
            <input 
              type="text" 
              bind:value={newProduct.brand}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Sizes (comma-separated)</label>
            <input 
              type="text" 
              bind:value={newProduct.sizes}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Colors (comma-separated)</label>
            <input 
              type="text" 
              bind:value={newProduct.colors}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input 
              type="text" 
              bind:value={newProduct.tags}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Main Image</label>
            <input 
              type="file" 
              bind:files={mainImage}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Additional Images</label>
            <input 
              type="file" 
              bind:files={additionalImages}
              multiple
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Trending</label>
            <input 
              type="checkbox" 
              bind:checked={newProduct.trending}
              class="mt-1"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">On Sale</label>
            <input 
              type="checkbox" 
              bind:checked={newProduct.onSale}
              class="mt-1"
            />
          </div>
          {#if newProduct.onSale}
            <div>
              <label class="block text-sm font-medium text-gray-700">Discount (%)</label>
              <input 
                type="number" 
                bind:value={newProduct.discount}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          {/if}
          <div>
            <label class="block text-sm font-medium text-gray-700">Related Products</label>
            <select 
              bind:value={newProduct.relatedProducts}
              multiple
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {#each products as product}
                <option value={product.id}>{product.name}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            on:click={() => showAddModal = false}
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  </div>
{/if} 