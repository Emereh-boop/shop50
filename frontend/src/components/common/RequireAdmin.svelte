<script>
  import { user } from '../../stores/user';
  import { isAdmin } from '../../stores/admin';
  import { push } from 'svelte-spa-router';

  export let component;

  $: if ($user !== undefined && $user !== null && !$isAdmin) {
    push('/');
  }

  function isSvelteComponent(comp) {
    return comp && (typeof comp === 'function' || typeof comp?.render === 'function');
  }
</script>

{#if $user && $isAdmin}
  {#if isSvelteComponent(component)}
    <svelte:component this={component} />
  {:else}
    <div class="text-red-500 p-4">Error: Admin page component is not valid or not loaded.</div>
  {/if}
{:else if $user === null}
  <!-- Not logged in, redirect handled above -->
{:else}
  <!-- Loading or redirecting -->
{/if} 