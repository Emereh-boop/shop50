<script>
  import { products } from '../../stores/products';

  let sliderRef;
  let prods = $products?.products || [];
  let newArrivals = prods
    .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
    .slice(0, 20);

  function navigateTo(path) {
    window.location.href = path;
  }
</script>

<div class="md:px-4 mt-1 mx-auto max-w-7xl">
  <div class="flex justify-between items-center px-4 lg:px-1 my-5">
    <h2 class="text-xl lg:text-xl font-extrabold text-black">
      New Arrivals
    </h2>
    <button
      on:click={() => navigateTo('/new')}
      class="text-black hover:underline text-sm lg:text-base"
    >
      See More →
    </button>
  </div>

  <div class="relative group px-0 lg:px-0 mx-auto">
    <div
      bind:this={sliderRef}
      class="flex overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory transition-transform duration-700 ease-in-out"
    >
      {#if newArrivals?.length > 0}
        {#each newArrivals as p}
          <div
            class="flex-shrink-0 w-60 lg:w-[20rem] snap-start"
            on:click={() => navigateTo(`/product/${p.id}`)}
          >
            <div class="relative">
              <img
                class="w-full h-60 object-center hover:scale-105 lg:h-[25rem] object-cover rounded-sm transition-transform duration-500 ease-in-out"
                src={p.imageUrl || p.image}
                alt={p.title}
                loading="lazy"
              />
            </div>
          </div>
        {/each}
      {:else}
        {#each Array(16) as _, i}
          <div
            class="flex-shrink-0 w-60 lg:w-[20rem] snap-start animate-pulse border border-gray-200 shadow-sm rounded-sm p-2 {i > 1 ? 'hidden sm:block' : ''}"
          >
            <div class="bg-gray-300 h-[24rem] w-full rounded mb-2" />
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div> 