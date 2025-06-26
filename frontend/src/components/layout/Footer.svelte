<script>
  import { Facebook, Twitter, Instagram } from 'lucide-svelte';
  import branding from '../../lib/branding.js';
  import { push } from 'svelte-spa-router';
  import { products, fetchProducts } from '../../stores/products';
  import { onMount } from 'svelte';
  import { toast } from '../../components/common/sonner.js';

  function openShareModal() {
    toast('Product sharing coming soon!');
    // showShareModal = true;
    // shareMessage = '';
    // shareSuccess = false;
    // selectedProductId = '';
  }
  
</script>

<style>
  @import '../../styles/responsive.css';
  .footer-title {
    font-size: var(--footer-title);
  }
  .footer-section {
    padding-top: var(--footer-pad);
    padding-bottom: var(--footer-pad);
  }
</style>

<footer class="bg-white dark:bg-gray-900 footer-section">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Brand Info -->
      <div class="space-y-4">
        <h3 class="footer-title font-semibold text-gray-900 dark:text-white">{branding.companyName}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {branding.address}
        </p>
      </div>

      <!-- Quick Links -->
      <div class="space-y-4">
        <h3 class="footer-title font-semibold text-gray-900 dark:text-white">Quick Links</h3>
        <ul class="space-y-2">
          <li>
            <button on:click={() => push('/products')} class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-left w-full">Products</button>
          </li>
          <li>
            <button on:click={() => push('/about')} class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-left w-full">About</button>
          </li>
        </ul>
      </div>
      
      <!-- Customer Service -->
      <div class="space-y-4">
        <h3 class="footer-title font-semibold text-gray-900 dark:text-white">Customer Service</h3>
        <ul class="space-y-2">
          <li>
            <button on:click={() => push('/contact')} class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-left w-full">Contact</button>
          </li>
          <li>
            <a href="/shipping" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Shipping Info</a>
          </li>
          <li>
            <a href="/returns" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Returns</a>
          </li>
        </ul>
      </div>

      <!-- Social Media -->
      <div class="space-y-4">
        <h3 class="footer-title font-semibold text-gray-900 dark:text-white">Share</h3>
        <div class="flex flex-col gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Share your favorite product or outfit across the internet!</span>
          <button class="bg-gray-700 text-white px-4 py-2 hover:bg-pink-700 transition" on:click={openShareModal}>Share a Product</button>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} {branding.companyName}. All rights reserved.
      </p>
    </div>
  </div>
</footer>