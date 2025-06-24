<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
  <div class="bg-white dark:bg-black border-2 border-red-500 rounded-2xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center">
    <div class="mb-6">
      <svg class="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </div>
    <h2 class="text-3xl font-extrabold uppercase tracking-widest text-black dark:text-white mb-4">Payment Failed</h2>
    <p class="text-lg text-gray-700 dark:text-gray-300 mb-6 text-center">Something went wrong with your payment. Please try again.</p>
    <a href="/#/checkout" use:link>
      <button class="w-full py-3 border-2 border-black dark:border-white text-black dark:text-white font-extrabold rounded-full uppercase tracking-widest text-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
        Try Again
      </button>
    </a>
  </div>
</div> 