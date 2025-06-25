<div class="max-w-7xl mx-auto py-10">
  <h1 class="text-3xl font-bold mb-6">Manage Collections</h1>
  <Button on:click={openCreate} class="mb-4">+ New Collection</Button>
  {#if loading}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-8">
      {#each Array(4) as _, i}
        <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl flex flex-col overflow-hidden animate-pulse" key={i}>
          <div class="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-t-2xl"></div>
          <div class="p-6 flex-1 flex flex-col">
            <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-2/3"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2 w-full"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded mb-4 w-1/2"></div>
            <div class="flex gap-2 mt-auto">
              <div class="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div class="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="text-red-500 text-center my-8">{error}</div>
  {:else if collections.length === 0}
    <div class="text-gray-500 text-center my-8">No collections yet.</div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-8">
      {#each collections as c}
        <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <img src={c.image} alt={c.name} class="w-full h-40 object-cover rounded-t-2xl" />
          <div class="p-6 flex-1 flex flex-col">
            <h2 class="text-xl font-extrabold uppercase tracking-widest mb-2 text-black dark:text-white truncate">{c.name}</h2>
            <p class="text-base text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">{c.description}</p>
            <div class="text-xs text-gray-500 mb-4">{c.products.length} products</div>
            <div class="flex gap-2 mt-auto">
              <Button on:click={() => openEdit(c)} class="w-full">Edit</Button>
              <Button on:click={() => remove(c.id)} variation="danger" class="w-full">Delete</Button>
            </div>
          </div>
        </div>
      {/each}
    </div>
    {#if showForm}
      <div class="bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-xl p-8 mb-8 max-w-xl mx-auto">
        <h2 class="text-xl font-bold mb-4">{editing ? 'Edit' : 'Create'} Collection</h2>
        <div class="mb-2">
          <label>ID</label>
          <input class="w-full p-2 rounded border" bind:value={form.id} disabled={editing} />
        </div>
        <div class="mb-2">
          <label>Name</label>
          <input class="w-full p-2 rounded border" bind:value={form.name} />
        </div>
        <div class="mb-2">
          <label>Description</label>
          <textarea class="w-full p-2 rounded border" bind:value={form.description} />
        </div>
        <div class="mb-2">
          <label>Image URL</label>
          <input class="w-full p-2 rounded border" bind:value={form.image} />
          <input type="file" accept="image/*" on:change={handleImageUpload} class="mt-2" />
          {#if form.image}
            <img src={form.image} alt="Preview" class="mt-2 w-32 h-32 object-cover rounded" />
          {/if}
        </div>
        <div class="mb-2">
          <label>Products</label>
          <select multiple class="w-full p-2 rounded border" bind:value={form.products}>
            {#each products as p}
              <option value={p.id}>{p.name}</option>
            {/each}
          </select>
        </div>
        <div class="flex gap-2 mt-4">
          <Button on:click={save} class="w-full">Save</Button>
          <Button on:click={() => showForm = false} variation="stroke" class="w-full">Cancel</Button>
        </div>
      </div>
    {/if}
  {/if}
</div>

<script>
  import { onMount } from 'svelte';
  import Button from '../../components/common/Button.svelte';
  import { products as productsStore, fetchProducts } from '../../stores/products';

  let collections = [];
  let products = [];
  let loading = true;
  let error = null;
  let showForm = false;
  let editing = null;
  let form = { id: '', name: '', description: '', image: '', products: [] };

  async function fetchCollections() {
    try {
      const res = await fetch('https://shop50.onrender.com/api/products/collections');
      if (!res.ok) throw new Error('Failed to fetch collections');
      collections = await res.json();
      error = null;
    } catch (e) {
      collections = [];
      error = 'Failed to load collections.';
    }
  }
  async function fetchProductsList() {
    await fetchProducts();
    products = productsStore?.products || [];
  }
  async function load() {
    loading = true;
    await Promise.all([fetchCollections(), fetchProductsList()]);
    loading = false;
  }
  onMount(load);

  function openCreate() {
    editing = null;
    form = { id: '', name: '', description: '', image: '', products: [] };
    showForm = true;
  }
  function openEdit(collection) {
    editing = collection.id;
    form = { ...collection };
    showForm = true;
  }
  async function save() {
    if (editing) {
      await fetch(`/api/products/collections/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    } else {
      await fetch('/api/products/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    showForm = false;
    await load();
  }
  async function remove(id) {
    if (!confirm('Delete this collection?')) return;
    await fetch(`/api/products/collections/${id}`, { method: 'DELETE' });
    await load();
  }
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/uploads', { method: 'POST', body: formData });
    const data = await res.json();
    form.image = data.file?.path || '';
  }
</script> 