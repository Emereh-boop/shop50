<script>
  import Skeleton from '../../components/common/Skeleton.svelte';
  let loading = true;
  // Simulate loading for demo
  setTimeout(() => loading = false, 1200);
</script>

{#if loading}
  <div class="flex justify-center py-12">
    <Skeleton type="order" />
  </div>
{:else}
  <div class="p-8 text-center">
    <h1 class="text-3xl font-bold">Your Orders</h1>
    <p class="mt-4 text-gray-600">This is the user orders page placeholder.</p>
  </div>
{/if} 