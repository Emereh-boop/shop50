<script>
  import { onMount } from 'svelte';
  let email = '';
  let status = '';
  let error = '';
  const brandEmail = 'abuashiaemereh@gmail.com';

  function validateEmail(email) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  async function subscribe() {
    error = '';
    status = '';
    if (!validateEmail(email)) {
      error = 'Please enter a valid email address.';
      return;
    }
    try {
      const res = await fetch('https://shop50.onrender.com/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        status = 'Thank you for subscribing!';
        email = '';
      } else {
        error = 'Subscription failed. Please try again.';
      }
    } catch (e) {
      error = 'Subscription failed. Please try again.';
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
      <form on:submit|preventDefault={subscribe} class="max-w-md mx-auto">
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
          >
            SUBSCRIBE
          </button>
        </div>
        {#if status}
          <div class="text-green-600 mt-2">{status}</div>
        {/if}
        {#if error}
          <div class="text-red-600 mt-2">{error}</div>
        {/if}
      </form>
      <p class="mt-4 text-xs text-gray-500">For questions, contact <a href="mailto:{brandEmail}" class="underline">{brandEmail}</a></p>
    </div>
  </div>
</section> 