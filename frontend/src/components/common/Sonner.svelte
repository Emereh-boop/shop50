<script>
  import { sonnerStore } from './sonner.js';
  import { fly, fade } from 'svelte/transition';
  let toasts = [];
  const unsubscribe = sonnerStore.subscribe((v) => (toasts = v));
  function removeToast(id) {
    sonnerStore.update((toasts) => toasts.filter((t) => t.id !== id));
  }
</script>

<div class="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-xs">
  {#each toasts as toast (toast.id)}
    <div
      class="rounded-lg shadow-lg px-5 py-4 text-sm font-bold flex items-center gap-3 animate-in"
      class:!bg-blue-100={toast.type === 'info'}
      class:!bg-green-100={toast.type === 'success'}
      class:!bg-yellow-100={toast.type === 'warning'}
      class:!bg-red-100={toast.type === 'error'}
      class:!text-blue-900={toast.type === 'info'}
      class:!text-green-900={toast.type === 'success'}
      class:!text-yellow-900={toast.type === 'warning'}
      class:!text-red-900={toast.type === 'error'}
      in:fly={{ x: 100, duration: 200 }} out:fade={{ duration: 200 }}
      on:introend={() => setTimeout(() => removeToast(toast.id), 3500)}
    >
      {#if toast.type === 'info'}<span>ℹ️</span>{/if}
      {#if toast.type === 'success'}<span>✅</span>{/if}
      {#if toast.type === 'warning'}<span>⚠️</span>{/if}
      {#if toast.type === 'error'}<span>❌</span>{/if}
      <span>{toast.message}</span>
      <button class="ml-auto text-lg" on:click={() => removeToast(toast.id)}>&times;</button>
    </div>
  {/each}
</div>

<style>
  .animate-in {
    animation: sonner-in 0.2s;
  }
  @keyframes sonner-in {
    from { opacity: 0; transform: translateX(100px); }
    to { opacity: 1; transform: translateX(0); }
  }
</style> 