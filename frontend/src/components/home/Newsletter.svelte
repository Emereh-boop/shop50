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

<style>
  @import '../../styles/responsive.css';
  .newsletter-title {
    font-size: var(--news-title);
  }
  .newsletter-section {
    padding-top: var(--news-pad);
    padding-bottom: var(--news-pad);
  }
  .newsletter-input {
    font-size: calc(var(--news-title) * 0.7);
    padding: 0.5em 1em;
  }
  .newsletter-btn {
    font-size: calc(var(--news-title) * 0.7);
    padding: 0.5em 1.5em;
  }
</style>

<section class="bg-white dark:bg-gray-900 newsletter-section">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h2 class="newsletter-title font-bold mb-4 tracking-wider">JOIN OUR NEWSLETTER</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Subscribe to our newsletter and be the first to know about new collections,
        special offers, and exclusive events.
      </p>
      <form on:submit|preventDefault={subscribe} class="max-w-md mx-auto">
        <div class="flex gap-4 flex-col sm:flex-row">
          <input
            type="email"
            bind:value={email}
            placeholder="Enter your email"
            required
            class="newsletter-input flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
          />
          <button
            type="submit"
            class="newsletter-btn bg-primary-light dark:bg-primary-dark text-white  hover:bg-opacity-90 transition-colors tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
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