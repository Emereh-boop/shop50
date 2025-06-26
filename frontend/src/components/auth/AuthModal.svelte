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

<style>
  @import '../../styles/responsive.css';
  .auth-modal {
    padding: calc(var(--page-pad) * 0.6);
  }
  .auth-title {
    font-size: calc(var(--page-title) * 0.5);
  }
  .auth-input {
    font-size: var(--form-input);
    padding: calc(var(--form-input) * 0.5) calc(var(--form-input) * 1);
  }
  .auth-label {
    font-size: var(--form-label);
  }
  .auth-btn {
    font-size: var(--form-btn);
    padding: calc(var(--form-btn) * 0.8) calc(var(--form-btn) * 1.5);
  }
  .auth-close-icon {
    width: calc(var(--form-btn) * 1.5);
    height: calc(var(--form-btn) * 1.5);
  }
  .auth-error {
    font-size: var(--form-label);
  }
  .auth-switch {
    font-size: var(--form-label);
  }
  .auth-spinner {
    width: calc(var(--form-btn) * 1.2);
    height: calc(var(--form-btn) * 1.2);
  }
</style>

{#if $showAuthModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    transition:fade
    on:click={handleClose}
  >
    <div
      class="bg-white dark:bg-gray-800  auth-modal max-w-md w-full mx-4 relative"
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
          class="auth-close-icon"
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

      <h2 class="auth-title font-bold mb-6 tracking-wider">
        {$authMode === 'login' ? 'LOGIN' : 'SIGN UP'}
      </h2>
      
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        {#if $authMode === 'signup'}
          <div>
            <label
              for="name"
              class="auth-label block font-medium text-gray-700 dark:text-gray-300 mb-1"
              >Name</label
            >
            <input
              type="text"
              id="name"
              bind:value={name}
              required
              class="auth-input w-full  border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </div>
        {/if}
        
        <div>
          <label
            for="email"
            class="auth-label block font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Email</label
          >
          <input
            type="email"
            id="email"
            bind:value={email}
            required
            class="auth-input w-full  border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
          />
        </div>
        
        <div>
          <label
            for="password"
            class="auth-label block font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Password</label
          >
          <input
            type="password"
            id="password"
            bind:value={password}
            required
            class="auth-input w-full  border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
          />
        </div>
        
        {#if error}
          <p class="auth-error text-red-500 dark:text-red-400">{error}</p>
        {/if}
        
        <Button
          type="submit"
          class="auth-btn w-full bg-white text-gray-900 dark:bg-gray-800 dark:text-white  hover:bg-opacity-90 transition-colors tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
          variation="stroke"
        >
          {#if isLoading}
            <div class="flex items-center justify-center">
              <div class="auth-spinner animate-spin  border-b-2 border-white"></div>
              <span class="ml-2">Processing...</span>
            </div>
          {:else}
            {$authMode === 'login' ? 'LOGIN' : 'SIGN UP'}
          {/if}
        </Button>
      </form>
      
      <div class="mt-4 text-center">
        <Button
          class="auth-switch text-primary-light dark:text-primary-dark hover:underline"
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