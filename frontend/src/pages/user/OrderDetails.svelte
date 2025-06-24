<script>
  import Skeleton from '../../components/common/Skeleton.svelte';
  let loading = true;
  // Simulate loading for demo
  setTimeout(() => loading = false, 1200);
</script>

{#if loading}
  <div class="flex justify-center py-16">
    <Skeleton type="order" />
  </div>
{:else}
  <div class="max-w-3xl mx-auto p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg mt-10">
    <h1 class="text-4xl font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-8 text-center">Order Details</h1>
    <div class="flex flex-col items-center justify-center py-12">
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">Order details will appear here.</p>
      <button class="px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white font-extrabold rounded-full uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
        Back to Orders
      </button>
    </div>
  </div>
{/if} 