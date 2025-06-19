<script>
  import { push } from 'svelte-spa-router';
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
  <div class="max-w-lg w-full text-center">
    <h1 class="text-9xl font-bold text-primary-light dark:text-primary-dark mb-4 tracking-wider">
      404
    </h1>
    <h2 class="text-3xl font-bold mb-4 tracking-wider">PAGE NOT FOUND</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-8">
      The page you are looking for might have been removed, had its name changed,
      or is temporarily unavailable.
    </p>
    <button
      class="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-opacity-90 transition-colors tracking-wider"
      on:click={() => push('/')}
    >
      GO TO HOME
    </button>
  </div>
</div> 