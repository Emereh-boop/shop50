<script>
  import { Facebook, Twitter, Instagram, Youtube } from 'lucide-svelte';
  import branding from '../../lib/branding.js';
</script>

<footer class="bg-white dark:bg-gray-900">
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Company Info -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">About Us</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Adidas is a global leader in the sporting goods industry, offering innovative products for athletes and sports enthusiasts.
        </p>
      </div>

      <!-- Quick Links -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h3>
        <ul class="space-y-2">
          <li>
            <a href="/products" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Products</a>
          </li>
          <li>
            <a href="/trend" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Trending</a>
          </li>
          <li>
            <a href="/about" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</a>
          </li>
        </ul>
      </div>

      <!-- Customer Service -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Customer Service</h3>
        <ul class="space-y-2">
          <li>
            <a href="/contact" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact Us</a>
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
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Follow Us</h3>
        <div class="flex space-x-4">
          <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <Facebook class="h-6 w-6" />
          </a>
          <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <Twitter class="h-6 w-6" />
          </a>
          <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <Instagram class="h-6 w-6" />
          </a>
          <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <Youtube class="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div class="font-bold text-lg">{branding.companyName}</div>
      <div class="text-sm">{branding.address}</div>
      <div class="text-sm">Email: <a href={`mailto:${branding.email}`} class="underline">{branding.email}</a></div>
      <div class="flex gap-4 mt-2">
        {#each branding.socialLinks as link}
          <a href={link.url} target="_blank" rel="noopener" class="hover:underline">{link.name}</a>
        {/each}
      </div>
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Adidas. All rights reserved.
      </p>
    </div>
  </div>
</footer> 