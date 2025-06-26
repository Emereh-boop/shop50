<script>
  import { onMount } from 'svelte';
  let files = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    await loadFiles();
  });

  async function loadFiles() {
    loading = true;
    error = null;
    try {
      // Adjust the endpoint to match your backend API for uploaded files
      const response = await fetch('https://shop50.onrender.com/api/admin/uploads');
      if (!response.ok) throw new Error('Failed to fetch uploads');
      files = await response.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function isImage(file) {
    return file.type && file.type.startsWith('image/');
  }
</script>

<div class="max-w-6xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Uploaded Files Gallery</h1>
  {#if loading}
    <div class="flex justify-center items-center h-32">
      <div class="animate-spin h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else if files.length === 0}
    <p class="text-gray-500">No files have been uploaded yet.</p>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {#each files as file}
        <div class="bg-white shadow p-4 flex flex-col items-center">
          {#if isImage(file)}
            <img src={file.url} alt={file.name} class="w-32 h-32 object-cover rounded mb-2" />
          {:else}
            <div class="w-32 h-32 flex items-center justify-center bg-gray-100 rounded mb-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            </div>
          {/if}
          <div class="text-sm font-medium text-gray-900 truncate w-full text-center">{file.name}</div>
          <div class="text-xs text-gray-500 mt-1">{file.uploadedAt ? new Date(file.uploadedAt).toLocaleString() : ''}</div>
        </div>
      {/each}
    </div>
  {/if}
</div> 