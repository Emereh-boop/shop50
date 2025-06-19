<script>
  export let type = 'card'; // card, text, image, button, list, profile, order
  export let width = '100%';
  export let height = '100%';
  export let className = '';
</script>

{#if type === 'card'}
  <div class="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse {className}" style="width: {width}; height: {height};">
    <div class="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
    <div class="p-4 space-y-3">
      <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
    </div>
  </div>
{:else if type === 'text'}
  <div class="bg-gray-200 dark:bg-gray-700 rounded animate-pulse {className}" style="width: {width}; height: {height};"></div>
{:else if type === 'image'}
  <div class="bg-gray-200 dark:bg-gray-700 rounded animate-pulse {className}" style="width: {width}; height: {height};"></div>
{:else if type === 'button'}
  <div class="bg-gray-200 dark:bg-gray-700 rounded animate-pulse {className}" style="width: {width}; height: {height};"></div>
{:else if type === 'list'}
  <div class="space-y-4 {className}">
    {#each Array(3) as _}
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    {/each}
  </div>
{:else if type === 'profile'}
  <div class="space-y-6 {className}">
    <div class="flex items-center space-x-4">
      <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      <div class="flex-1 space-y-3">
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
      </div>
    </div>
    <div class="space-y-4">
      {#each Array(3) as _}
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      {/each}
    </div>
  </div>
{:else if type === 'order'}
  <div class="space-y-6 {className}">
    <div class="flex justify-between items-center">
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/6 animate-pulse"></div>
    </div>
    <div class="space-y-4">
      {#each Array(2) as _}
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if} 