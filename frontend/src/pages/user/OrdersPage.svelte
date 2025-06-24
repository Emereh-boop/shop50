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
  <div class="max-w-5xl mx-auto p-6 md:p-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg mt-10">
    <h1 class="text-4xl font-extrabold uppercase tracking-widest text-gray-900 dark:text-white mb-10 text-center">Your Orders</h1>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Order ID</th>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Date</th>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Status</th>
            <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Total</th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Placeholder row -->
          <tr>
            <td class="px-6 py-4 text-gray-500 dark:text-gray-400" colspan="5">
              <div class="flex flex-col items-center justify-center py-12">
                <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">You have no orders yet.</p>
                <button class="px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white font-extrabold rounded-full uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                  Shop Now
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
{/if} 