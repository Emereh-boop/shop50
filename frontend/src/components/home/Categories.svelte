<script>
  import { push } from 'svelte-spa-router';

  const categories = [
    {
      id: 'summer',
      name: 'Summer Collection',
      image: '/images/categories/summer.jpg',
      description: 'Light and breathable styles for the season'
    },
    {
      id: 'new',
      name: 'New Arrivals',
      image: '/images/categories/new.jpg',
      description: 'Latest drops and fresh styles'
    },
    {
      id: 'sale',
      name: 'Sale',
      image: '/images/categories/sale.jpg',
      description: 'Up to 50% off selected items'
    }
  ];

  function handleCategoryClick(categoryId) {
    push(`/products?category=${categoryId}`);
  }
</script>

<section class="py-16 bg-white dark:bg-gray-900">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-bold text-center mb-12 font-adidas">Shop by Category</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {#each categories as category}
        <div 
          class="relative group cursor-pointer overflow-hidden rounded-md shadow-lg"
          on:click={() => handleCategoryClick(category.id)}
        >
          <!-- Category Image -->
          <div class="aspect-[4/5] w-full overflow-hidden">
            <img 
              src={category.image} 
              alt={category.name}
              class="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-gray-700/70 to-transparent"></div>
          </div>
          
          <!-- Category Content -->
          <div class="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
            <h3 class="text-2xl font-bold mb-2 font-adidas">{category.name}</h3>
            <p class="text-sm opacity-90 mb-4">{category.description}</p>
            <button class="inline-flex items-center text-white border-2 border-white px-6 py-2 rounded-md hover:bg-white hover:text-black transition-colors duration-300">
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section> 