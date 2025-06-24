<script>
  import { theme, THEMES, toggleTheme } from '../../stores/theme';
  import { Sun, Moon, Monitor } from 'lucide-svelte';

  function handleThemeClick() {
    toggleTheme();
  }
</script>

<button
  on:click={handleThemeClick}
  class="p-2 text-gray-900 dark:text-white hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
  aria-label="Toggle theme"
>
  {#if $theme === THEMES.LIGHT}
    <Sun class="h-6 w-6" />
  {:else if $theme === THEMES.DARK}
    <Moon class="h-6 w-6" />
  {:else}
    <Monitor class="h-6 w-6" />
  {/if}
</button> 