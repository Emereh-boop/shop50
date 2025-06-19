<script>
  let email = '';
  let isSubmitting = false;
  let success = false;
  let error = '';

  async function handleSubmit() {
    isSubmitting = true;
    error = '';

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      success = true;
      email = '';
    } catch (e) {
      error = 'Failed to subscribe. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section class="py-16 bg-white dark:bg-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h2 class="text-3xl font-bold mb-4 tracking-wider">JOIN OUR NEWSLETTER</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Subscribe to our newsletter and be the first to know about new collections,
        special offers, and exclusive events.
      </p>
      <form on:submit|preventDefault={handleSubmit} class="max-w-md mx-auto">
        <div class="flex gap-4">
          <input
            type="email"
            bind:value={email}
            placeholder="Enter your email"
            required
            class="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
          />
          <button
            type="submit"
            class="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:bg-opacity-90 transition-colors tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {#if isSubmitting}
              <div class="flex items-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span class="ml-2">Processing...</span>
              </div>
            {:else}
              SUBSCRIBE
            {/if}
          </button>
        </div>
        {#if error}
          <p class="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
        {/if}
        {#if success}
          <p class="text-green-500 dark:text-green-400 text-sm mt-2">
            Thank you for subscribing!
          </p>
        {/if}
      </form>
    </div>
  </div>
</section> 