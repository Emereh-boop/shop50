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

    console.log('3. Frontend: Sending request to backend');
    try {
      const response = await axios.post('https://shop50.onrender.com/api/products', formData, {
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
        relatedProducts: [],
        type: 'product',
        ctaText: '',
        link: '',
        author: ''
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
    toast.info('Edit product modal coming soon!');
    // Optionally: set up edit modal state here
  }
</script>

<div class="max-w-7xl mx-auto px-2 sm:px-8 py-10">
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 gap-4">
    <h1 class="text-4xl font-extrabold uppercase tracking-widest text-black dark:text-white">Products Management</h1>
    <Button 
      variation="stroke"
      class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-8 py-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
      on:click={() => showAddModal = true}
    >
      Add New Product
    </Button>
  </div>
  {#if loading}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center mb-2">{error}</div>
  {:else}
    <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl overflow-x-auto">
      <table class="min-w-full divide-y divide-black dark:divide-white text-sm">
        <thead class="bg-white dark:bg-black">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Product</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Price</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Category</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Stock</th>
            <th class="px-6 py-4 text-left text-xs font-extrabold uppercase tracking-widest text-black dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-black divide-y divide-black dark:divide-white">
          {#each products as product}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-4">
                  <div class="h-14 w-14 flex-shrink-0 border-2 border-black dark:border-white rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <img class="h-full w-full object-cover" src={getResolvedImageUrl(product)} alt={product.name} />
                  </div>
                  <div class="min-w-0">
                    <div class="text-base font-extrabold uppercase tracking-widest text-black dark:text-white truncate max-w-[120px]">{product.name}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[160px]">{product.description}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-base font-bold text-black dark:text-white">${product.price}</td>
              <td class="px-6 py-4 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">{product.category}</td>
              <td class="px-6 py-4 whitespace-nowrap text-base font-bold text-black dark:text-white">{product.stock}</td>
              <td class="px-6 py-4 whitespace-nowrap flex gap-2">
                <Button variation="stroke" class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors" on:click={() => handleEditProduct(product)}>Edit</Button>
                <Button variation="stroke" class="font-extrabold uppercase tracking-widest border-2 border-red-500 text-red-500 rounded-full px-4 py-2 hover:bg-red-500 hover:text-white transition-colors" on:click={() => handleDeleteProduct(product.id)}>Delete</Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if showAddModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-white dark:bg-black rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
      <button class="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-black dark:hover:text-white" on:click={() => showAddModal = false}>&times;</button>
      <h2 class="text-2xl font-extrabold uppercase tracking-widest mb-8 text-black dark:text-white text-center">Add New Product</h2>
      <form on:submit|preventDefault={handleAddProduct} class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.name} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Short Description</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.shortDescription} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Price</label>
            <input type="number" class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.price} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.category} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Stock</label>
            <input type="number" class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.stock} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Brand</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.brand} required />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Sizes</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.sizes} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Colors</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.colors} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Tags</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.tags} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Trending</label>
            <input type="checkbox" class="mr-2" bind:checked={newProduct.trending} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">On Sale</label>
            <input type="checkbox" class="mr-2" bind:checked={newProduct.onSale} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Discount (%)</label>
            <input type="number" class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.discount} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Related Products (IDs, comma separated)</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.relatedProducts} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <select class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.type}>
              <option value="product">Product</option>
              <option value="banner">Banner</option>
              <option value="ad">Ad</option>
              <option value="blog">Blog</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">CTA Text (for banners)</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.ctaText} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Link (for banners/ads)</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.link} />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Author (for blogs)</label>
            <input class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.author} />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea class="w-full border-2 border-black dark:border-white rounded-lg px-4 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white" bind:value={newProduct.description} rows="2" required></textarea>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Main Image</label>
          <input type="file" accept="image/*" class="w-full" on:change={handleMainImageChange} />
          {#if mainPreviewUrl}
            <img src={mainPreviewUrl} alt="Preview" class="mt-2 h-24 w-24 object-cover rounded-lg border-2 border-black dark:border-white" />
          {/if}
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">Additional Images</label>
          <input type="file" accept="image/*" class="w-full" multiple on:change={e => additionalImages = Array.from(e.target.files)} />
        </div>
        <div class="flex justify-end gap-4 mt-8">
          <Button variation="ghost" class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-8 py-3" type="button" on:click={() => showAddModal = false}>Cancel</Button>
          <Button variation="stroke" class="font-extrabold uppercase tracking-widest border-2 border-black dark:border-white text-black dark:text-white rounded-full px-8 py-3" type="submit">Add Product</Button>
        </div>
      </form>
    </div>
  </div>
{/if} 