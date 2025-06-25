<script>
  import { onMount } from 'svelte';
  
  let banners = [];
  let loading = true;
  let error = null;
  let showAddModal = false;
  let newBanner = {
    title: '',
    description: '',
    image: '',
    link: '',
    position: 'home',
    active: true
  };

  onMount(async () => {
    await loadBanners();
  });

  async function loadBanners() {
    try {
      const response = await fetch('https://shop50.onrender.com/api/admin/banners');
      if (!response.ok) throw new Error('Failed to load banners');
      banners = await response.json();
    } catch (e) {
      error = 'Failed to load banners';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function handleAddBanner() {
    try {
      const response = await fetch('https://shop50.onrender.com/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBanner)
      });
      if (!response.ok) throw new Error('Failed to add banner');
      
      showAddModal = false;
      await loadBanners();
      // Reset form
      newBanner = {
        title: '',
        description: '',
        image: '',
        link: '',
        position: 'home',
        active: true
      };
    } catch (e) {
      error = 'Failed to add banner';
      console.error(e);
    }
  }

  async function updateBannerStatus(bannerId, active) {
    try {
      const response = await fetch(`https://shop50.onrender.com/api/admin/banners/${bannerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active })
      });
      if (!response.ok) throw new Error('Failed to update banner status');
      await loadBanners();
    } catch (e) {
      error = 'Failed to update banner status';
      console.error(e);
    }
  }

  async function deleteBanner(bannerId) {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const response = await fetch(`https://shop50.onrender.com/api/admin/banners/${bannerId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete banner');
      await loadBanners();
    } catch (e) {
      error = 'Failed to delete banner';
      console.error(e);
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">Banners Management</h1>
    <button 
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      on:click={() => showAddModal = true}
    >
      Add New Banner
    </button>
  </div>

  {#if loading}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center">{error}</div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each banners as banner}
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="relative">
            <img 
              src={banner.image} 
              alt={banner.title}
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-2 right-2">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={banner.active}
                  on:change={(e) => updateBannerStatus(banner.id, e.target.checked)}
                  class="form-checkbox h-5 w-5 text-blue-600"
                />
                <span class="ml-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{banner.title}</h3>
            <p class="text-gray-600 mb-2">{banner.description}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Position: {banner.position}</span>
              <button
                class="text-red-600 hover:text-red-900"
                on:click={() => deleteBanner(banner.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if showAddModal}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4">Add New Banner</h2>
      <form on:submit|preventDefault={handleAddBanner}>
        <div class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input 
              id="title"
              type="text" 
              bind:value={newBanner.title}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              id="description"
              bind:value={newBanner.description}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label for="image" class="block text-sm font-medium text-gray-700">Image URL</label>
            <input 
              id="image"
              type="url" 
              bind:value={newBanner.image}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label for="link" class="block text-sm font-medium text-gray-700">Link</label>
            <input 
              id="link"
              type="url" 
              bind:value={newBanner.link}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label for="position" class="block text-sm font-medium text-gray-700">Position</label>
            <select 
              id="position"
              bind:value={newBanner.position}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="home">Home Page</option>
              <option value="category">Category Page</option>
              <option value="product">Product Page</option>
            </select>
          </div>
          <div>
            <label for="active" class="inline-flex items-center">
              <input 
                id="active"
                type="checkbox" 
                bind:checked={newBanner.active}
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2 text-gray-700">Active</span>
            </label>
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
            Add Banner
          </button>
        </div>
      </form>
    </div>
  </div>
{/if} 