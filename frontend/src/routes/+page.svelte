<script>
  import Hero from '../components/layout/Hero.svelte';
  import ProductShowcase from '../components/home/ProductShowcase.svelte';
  import Categories from '../components/home/Categories.svelte';
  import Newsletter from '../components/home/Newsletter.svelte';
</script>

<div class="min-h-screen">
  <Hero />
  
  <!-- Still Interested Products -->
  <ProductShowcase 
    type="still-interested"
    title="Still Interested?"
    seeMoreLink="/products"
    limit={4}
  />
  
  <!-- Featured Products -->
  <ProductShowcase 
    type="featured"
    title="Featured Products"
    seeMoreLink="/products?featured=true"
    limit={4}
  />
  
  <!-- Trending Products -->
  <ProductShowcase 
    type="trending"
    title="Trending Now"
    seeMoreLink="/products?trending=true"
    limit={4}
  />
  
  <!-- New Arrivals -->
  <ProductShowcase 
    type="new-arrivals"
    title="New Arrivals"
    seeMoreLink="/products?new=true"
    limit={4}
  />
  
  <Categories />
  <Newsletter />
</div> 