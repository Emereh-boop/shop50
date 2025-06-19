<script>
  import { onMount } from 'svelte';
  import { products } from '../../stores/products';
  import { ChevronCompactLeft, ChevronCompactRight } from 'svelte-bootstrap-icons';

  let sliderRef;
  let canScrollLeft = false;
  let canScrollRight = false;
  let prods = $products?.products || [];
  let trending = prods.filter(p => p.trending).slice(0, 16);

  function navigateTo(path) {
    window.location.href = path;
  }

  function checkScroll() {
    if (sliderRef) {
      canScrollLeft = sliderRef.scrollLeft > 0;
      canScrollRight = sliderRef.scrollLeft + sliderRef.clientWidth < sliderRef.scrollWidth;
    }
  }

  function slideLeft() {
    sliderRef.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  }

  function slideRight() {
    sliderRef.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  }

  onMount(() => {
    checkScroll();
    sliderRef?.addEventListener('scroll', checkScroll);
    return () => sliderRef?.removeEventListener('scroll', checkScroll);
  });
</script>

<div class="bg- mx-auto max-w-7xl px-4 group md:px-6 lg:px-8">
  <div class="flex justify-between items-center my-5">
    <h2 class="text-xl lg:text-xl font-extrabold text-black">
      Featured products
    </h2>
    <button
      on:click={() => navigateTo('/trend')}
      class="text-black hover:underline text-sm lg:text-base"
    >
      See More →
    </button>
  </div>

  <div class="relative">
    <div
      bind:this={sliderRef}
      class="flex overflow-x-auto scroll-smooth scrollbar-hide gap-1 snap-x snap-mandatory transition-transform duration-700 ease-in-out"
    >
      {#if trending?.length}
        {#each trending as product}
          <div
            class="flex-shrink-0 w-44 lg:w-80 snap-start"
            on:click={() => navigateTo(`/product/${product.id}`)}
          >
            <div class="relative cursor-pointer">
              <img
                class="w-full h-60 lg:h-[25rem] object-cover transition-transform duration-300 hover:scale-105"
                src={product.imageUrl}
                alt={product.title}
                loading="lazy"
              />
              <div class="absolute bg-white p-2 bottom-4 left-1 text-sm font-medium text-gray-400">
                ${product.price.toFixed(2)}
              </div>
            </div>
          </div>
        {/each}
      {:else}
        {#each Array(16) as _, i}
          <div
            class="flex-shrink-0 w-48 lg:w-80 snap-start relative animate-pulse border border-gray-200 shadow-sm rounded-sm p-2 {i > 1 ? 'hidden sm:block' : ''}"
          >
            <div class="bg-gray-300 h-60 w-full rounded mb-2" />
            <div class="absolute bottom-2 z-10 left-2 h-6 bg-gray-200 rounded w-1/3 mb-2" />
          </div>
        {/each}
      {/if}
    </div>

    {#if canScrollLeft}
      <ChevronCompactLeft
        on:click={slideLeft}
        size={30}
        class="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 text-gray-700 cursor-pointer rounded-sm z-10 hover:bg-gray-100/50 transition"
      />
    {/if}

    {#if canScrollRight}
      <ChevronCompactRight
        on:click={slideRight}
        size={30}
        class="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 text-gray-700 cursor-pointer rounded-sm z-10 hover:bg-gray-100/50 transition"
      />
    {/if}
  </div>
</div> 