<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { showAuthModal, authMode } from '../../stores/ui';
  import { auth } from '../../stores/auth';
  import Button from '../common/Button.svelte';

  const dispatch = createEventDispatcher();
  
  let email = '';
  let password = '';
  let name = '';
  let error = '';
  let isLoading = false;

  async function handleSubmit() {
    error = '';
    isLoading = true;
    try {
      if ($authMode === 'login') {
        await auth.login(email, password);
      } else {
        await auth.register(name, email, password);
      }
      dispatch('success');
      showAuthModal.set(false);
    } catch (e) {
      error = e.message || 'Authentication failed';
    } finally {
      isLoading = false;
    }
  }

  function switchMode() {
    authMode.set($authMode === 'login' ? 'signup' : 'login');
    error = '';
  }

  function handleClose() {
    showAuthModal.set(false);
  }
</script>

{#if $showAuthModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    transition:fade
    on:click={handleClose}
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 relative"
      transition:fly={{ y: -20, duration: 300 }}
      on:click|stopPropagation
    >
      <!-- Close button -->
      <Button
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        on:click={handleClose}
        variation="stroke"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>

      <h2 class="text-2xl font-bold mb-6 tracking-wider">
        {$authMode === 'login' ? 'LOGIN' : 'SIGN UP'}
      </h2>
      
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        {#if $authMode === 'signup'}
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Name</label
            >
            <input
              type="text"
              id="name"
              bind:value={name}
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </div>
        {/if}
        
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Email</label
          >
          <input
            type="email"
            id="email"
            bind:value={email}
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
          />
        </div>
        
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Password</label
          >
          <input
            type="password"
            id="password"
            bind:value={password}
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
          />
        </div>
        
        {#if error}
          <p class="text-red-500 dark:text-red-400 text-sm">{error}</p>
        {/if}
        
        <Button
          type="submit"
          class="w-full px-6 py-3 bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-lg hover:bg-opacity-90 transition-colors tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
          variation="stroke"
        >
          {#if isLoading}
            <div class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span class="ml-2">Processing...</span>
            </div>
          {:else}
            {$authMode === 'login' ? 'LOGIN' : 'SIGN UP'}
          {/if}
        </Button>
      </form>
      
      <div class="mt-4 text-center">
        <Button
          class="text-primary-light dark:text-primary-dark hover:underline"
          on:click={switchMode}
          variation="text"
        >
          {$authMode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Login'}
        </Button>
      </div>
    </div>
  </div>
{/if} 