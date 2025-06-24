<script>
    import { createEventDispatcher } from 'svelte';
  
    export let type = 'button';
    export let variation = 'stroke';
    export let color = 'primary';
    export let disabled = false;
    export let fullWidth = false;
  
    const dispatch = createEventDispatcher();
  
    $: base = 'font-adidas font-semibold rounded-lg p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    $: stroke = `border-[2px] border-current px-2 py-1 bg-transparent text-${color}-light dark:text-${color}-dark hover:bg-gray-100 dark:hover:bg-gray-800`;
    $: text = `bg-transparent text-${color}-light dark:text-${color}-dark hover:underline`;
    $: icon = 'bg-transparent p-2';
    $: width = fullWidth ? 'w-full' : '';
  
    $: classes = [
      base,
      variation === 'stroke' ? stroke : '',
      variation === 'text' ? text : '',
      variation === 'icon' ? icon : '',
      width,
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ].join(' ');
  </script>
  
  <button
    type={type}
    class={classes}
    disabled={disabled}
    on:click={(e) => dispatch('click', e)}
    {...$$restProps}
  >
    <slot />
  </button>
  