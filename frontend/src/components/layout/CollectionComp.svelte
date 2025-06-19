<script>
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';
  import { products } from '../../stores/products';
  import { ChevronCompactLeft, ChevronCompactRight, ArrowRight } from 'svelte-bootstrap-icons';

  let sliderRef;
  let canScrollLeft = false;
  let canScrollRight = false;
  let prods = $products?.products || [];

  // Filter products and extract unique categories for collections
  let collections = Array.from(
    new Set(prods.filter(p => p.onsale && p.instock).map(p => p.category))
  ).map(category => {
    const collectionProduct = prods.find(p => p.category === category);
    return {
      id: category,
      category,
      imageUrl: collectionProduct?.imageUrl || collectionProduct?.image,
      brand: collectionProduct?.brand
    };
  });

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

<div class="bg mb-5">
  <div class="mx-auto max-w-7xl px-4 group md:px-6 lg:px-8 flex justify-between items-center my-5">
    <h2 class="text-xl lg:text-xl font-extrabold text-black">
      Collections
    </h2>
    <Link to="/collections" class="text-black hover:underline text-sm lg:text-base">
      View All
    </Link>
  </div>

  <div class="relative mx-auto max-w-7xl px-4 group md:px-6 lg:px-8">
    <div
      bind:this={sliderRef}
      class="flex overflow-x-auto scroll-smooth scrollbar-hide gap-2 snap-x snap-mandatory transition-transform duration-700 ease-in-out"
    >
      {#if collections?.length}
        {#each collections.slice(0, 4) as collection}
          <div
            class="flex-shrink-0 w-40 lg:w-40 snap-start relative flex flex-col"
            on:click={() => goto(`products/${collection.category}`)}
          >
            <img
              class="w-full h-60 lg:h-[25rem] object-cover transition-transform duration-300 hover:scale-105"
              src={collection.imageUrl}
              alt={collection.category}
              loading="lazy"
            />

            <div class="absolute inset-0 bg-black opacity-30"></div>
            <div class="z-10 w-full max-w-xl px-6">
              <h2 class="text-white text-lg lg:text-xl font-bold">
                {collection.brand}
              </h2>
              <h1 class="text-white text-xl flex items-center lg:text-xl lg:font-extrabold font-bold">
                {collection.category} <ArrowRight />
              </h1>
            </div>
          </div>
        {/each}
      {:else}
        {#each Array(2) as _, i}
          <div
            class="animate-pulse border border-gray-200 shadow-sm rounded-sm p-2 w-full {i > 1 ? 'hidden sm:block' : ''}"
          >
            <div class="bg-gray-300 h-[24rem] w-full rounded mb-2" />
            <div class="h-4 bg-gray-300 rounded w-1/3" />
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

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style> 