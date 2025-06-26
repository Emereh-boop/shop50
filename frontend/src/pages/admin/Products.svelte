<script>
  import { onMount } from 'svelte';
  import axios from '../../lib/axios';
  import Button from '../../components/common/Button.svelte';
  import { toast } from '../../components/common/sonner.js';
  
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
    featured: false,
    onSale: false,
    discount: 0,
    relatedProducts: [],
    type: 'product',
    ctaText: '',
    link: '',
    author: ''
  };
  let mainImage = null;
  let additionalImages = [];
  let mainPreviewUrl = '';
  let editMode = false;
  let editingProductId = null;

  onMount(async () => {
    await loadProducts();
  });

  async function loadProducts() {
    try {
      const response = await axios.get('https://shop50.onrender.com/api/admin/products');
      products = response.data;
    } catch (e) {
      error = 'Failed to load products';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function handleAddProduct() {
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'category', 'stock', 'brand'];
    for (const field of requiredFields) {
      if (!newProduct[field]) {
        error = `Please fill in the required field: ${field}`;
        return;
      }
    }
    if (!mainImage && !editMode) {
      error = 'Please select a main image for the product.';
      return;
    }

    const formData = new FormData();
    if (mainImage) formData.append('mainImage', mainImage);
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
    formData.append('featured', newProduct.featured);
    formData.append('onSale', newProduct.onSale);
    formData.append('discount', newProduct.discount);
    formData.append('relatedProducts', JSON.stringify(newProduct.relatedProducts));
    formData.append('type', newProduct.type);
    if (newProduct.type === 'banner' || newProduct.type === 'ad') {
      formData.append('link', newProduct.link);
    }
    if (newProduct.type === 'banner') {
      formData.append('ctaText', newProduct.ctaText);
    }
    if (newProduct.type === 'blog') {
      formData.append('author', newProduct.author);
    }

    try {
      if (editMode && editingProductId) {
        await axios.put(`https://shop50.onrender.com/api/products/${editingProductId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('https://shop50.onrender.com/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
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
        featured: false,
        onSale: false,
        discount: 0,
        relatedProducts: [],
        type: 'product',
        ctaText: '',
        link: '',
        author: ''
      };
      mainImage = null;
      additionalImages = [];
      editMode = false;
      editingProductId = null;
    } catch (e) {
      console.error('5. Frontend: Error occurred', e);
      error = e.response?.data?.message || 'Failed to save product';
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axios.delete(`https://shop50.onrender.com/api/products/${id}`);
      await loadProducts();
    } catch (e) {
      error = 'Failed to delete product';
      console.error(e);
    }
  }

  function handleMainImageChange(e) {
    const file = e.target.files[0];
    mainImage = file;
    if (file) {
      mainPreviewUrl = URL.createObjectURL(file);
    } else {
      mainPreviewUrl = '';
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

  function handleEditProduct(product) {
    showAddModal = true;
    editMode = true;
    editingProductId = product.id;
    newProduct = {
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      category: product.category,
      stock: product.stock,
      brand: product.brand,
      sizes: product.sizes,
      colors: product.colors,
      tags: product.tags,
      trending: product.trending,
      featured: product.featured || false,
      onSale: product.onSale,
      discount: product.discount,
      relatedProducts: product.relatedProducts || [],
      type: product.type || 'product',
      ctaText: product.ctaText || '',
      link: product.link || '',
      author: product.author || ''
    };
    mainImage = null;
    additionalImages = [];
    mainPreviewUrl = product.mainImage || product.image || product.imageUrl || '';
  }
</script>

<style>
  @import '../../styles/responsive.css';
  .products-title {
    font-size: var(--page-title);
  }
  .products-container {
    padding: var(--page-pad);
  }
  .products-btn {
    font-size: var(--form-btn);
    padding: calc(var(--form-btn) * 0.8) calc(var(--form-btn) * 2);
  }
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .table-container table {
    min-width: 800px;
  }
  .table-header {
    font-size: var(--form-label);
  }
  .table-cell {
    font-size: var(--form-input);
  }
  .modal-content {
    padding: calc(var(--page-pad) * 0.6);
  }
  
  /* Mobile-specific styles */
  @media (max-width: 768px) {
    .products-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    .products-btn {
      width: 100%;
      text-align: center;
    }
    .table-container {
      margin: 0 -1rem;
      padding: 0 1rem;
    }
    .modal-content {
      margin: 1rem;
      max-height: calc(100vh - 2rem);
    }
    .form-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .action-buttons {
      flex-direction: column;
      gap: 0.5rem;
    }
    .action-buttons button {
      width: 100%;
    }
  }
</style>

<div class="max-w-7xl mx-auto px-2 sm:px-8 py-6 md:py-10 products-container">
  <div class="products-header flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 md:mb-12 gap-4">
    <h1 class="products-title font-extrabold uppercase tracking-widest text-black dark:text-white">Products Management</h1>
    <Button 
      variation="stroke"
      class="products-btn font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
      on:click={() => showAddModal = true}
    >
      Add New Product
    </Button>
  </div>
  
  {#if loading}
    <div class="flex justify-center">
      <div class="animate-spin h-12 w-12 border-b-2 border-black dark:border-white"></div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center mb-2">{error}</div>
  {:else}
    <div class="table-container">
      <div class="bg-white dark:bg-black border-2 border-black dark:border-white shadow-xl overflow-hidden">
        <table class="min-w-full divide-y divide-black dark:divide-white text-sm">
          <thead class="bg-white dark:bg-black">
            <tr>
              <th class="px-3 md:px-6 py-3 md:py-4 text-left table-header font-extrabold uppercase tracking-widest text-black dark:text-white">Product</th>
              <th class="px-3 md:px-6 py-3 md:py-4 text-left table-header font-extrabold uppercase tracking-widest text-black dark:text-white">Price</th>
              <th class="px-3 md:px-6 py-3 md:py-4 text-left table-header font-extrabold uppercase tracking-widest text-black dark:text-white">Category</th>
              <th class="px-3 md:px-6 py-3 md:py-4 text-left table-header font-extrabold uppercase tracking-widest text-black dark:text-white">Stock</th>
              <th class="px-3 md:px-6 py-3 md:py-4 text-left table-header font-extrabold uppercase tracking-widest text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-black divide-y divide-black dark:divide-white">
            {#each products as product}
              <tr>
                <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2 md:gap-4">
                    <div class="h-12 w-12 md:h-14 md:w-14 flex-shrink-0 border-2 border-black dark:border-white overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <img class="h-full w-full object-cover" src={getResolvedImageUrl(product)} alt={product.name} />
                    </div>
                    <div class="min-w-0">
                      <div class="text-sm md:text-base font-extrabold uppercase tracking-widest text-black dark:text-white truncate max-w-[100px] md:max-w-[120px]">{product.name}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[120px] md:max-w-[160px]">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base font-bold text-black dark:text-white">${product.price}</td>
                <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">{product.category}</td>
                <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base font-bold text-black dark:text-white">{product.stock}</td>
                <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                  <div class="action-buttons flex gap-2">
                    <Button variation="stroke" class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white px-2 md:px-4 py-1 md:py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-xs md:text-sm" on:click={() => handleEditProduct(product)}>Edit</Button>
                    <Button variation="stroke" class="font-extrabold uppercase tracking-widest border-2 border-red-500 text-red-500 px-2 md:px-4 py-1 md:py-2 hover:bg-red-500 hover:text-white transition-colors text-xs md:text-sm" on:click={() => handleDeleteProduct(product.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

{#if showAddModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
    <div class="bg-white dark:bg-black shadow-2xl modal-content w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
      <button class="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-black dark:hover:text-white" on:click={() => showAddModal = false}>&times;</button>
      <h2 class="text-xl md:text-2xl font-extrabold uppercase tracking-widest mb-6 md:mb-8 text-black dark:text-white text-center">Add New Product</h2>
      <form on:submit|preventDefault={handleAddProduct} class="space-y-4 md:space-y-6">
        <div class="form-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.name} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Short Description</label>
            <input class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.shortDescription} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Price</label>
            <input type="number" class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.price} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <input class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.category} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Stock</label>
            <input type="number" class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.stock} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Brand</label>
            <input class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.brand} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Sizes</label>
            <input class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.sizes} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Colors</label>
            <input class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.colors} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Tags</label>
            <input class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.tags} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Trending</label>
            <input type="checkbox" class="mr-2" bind:checked={newProduct.trending} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Featured</label>
            <input type="checkbox" class="mr-2" bind:checked={newProduct.featured} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">On Sale</label>
            <input type="checkbox" class="mr-2" bind:checked={newProduct.onSale} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Discount (%)</label>
            <input type="number" class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.discount} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Related Products (IDs, comma separated)</label>
            <input class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.relatedProducts} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <select class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.type}>
              <option value="product">Product</option>
              <option value="banner">Banner</option>
              <option value="ad">Ad</option>
              <option value="blog">Blog</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">CTA Text (for banners)</label>
            <input class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.ctaText} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Link (for banners/ads)</label>
            <input class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.link} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Author (for blogs)</label>
            <input class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.author} />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea class="w-full border-2 border-black dark:border-white px-3 md:px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.description} rows="2" required></textarea>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Main Image</label>
          <input type="file" accept="image/*" class="w-full" on:change={handleMainImageChange} />
          {#if mainPreviewUrl}
            <img src={mainPreviewUrl} alt="Preview" class="mt-2 h-24 w-24 object-cover border-2 border-black dark:border-white" />
          {/if}
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Additional Images</label>
          <input type="file" accept="image/*" class="w-full" multiple on:change={e => additionalImages = Array.from(e.target.files)} />
        </div>
        <div class="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-6 md:mt-8">
          <Button variation="ghost" class="products-btn font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white" type="button" on:click={() => showAddModal = false}>Cancel</Button>
          <Button variation="stroke" class="products-btn font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white" type="submit">{editMode ? 'Update Product' : 'Add Product'}</Button>
        </div>
      </form>
    </div>
  </div>
{/if} 