<script>
  import { onMount } from 'svelte';
  import { products } from '../../stores/products';
  import { orders } from '../../stores/orders';
  import { user } from '../../stores/auth';
  import ProductCard from '../product/ProductCard.svelte';

  let mostPurchased = [];

  onMount(() => {
    if ($user && $orders?.length > 0) {
      // Filter orders based on the userId from the order and the current user.uid
      const userOrders = $orders.filter(order => order.userId === $user?.uid);

      // Filter products by purchase frequency based on the user's orders
      const productCounts = {};
      userOrders.forEach(order => {
        order.items.forEach(item => {
          productCounts[item.productId] = (productCounts[item.productId] || 0) + item.quantity;
        });
      });

      mostPurchased = $products?.products
        .filter(product => productCounts[product.id])
        .sort((a, b) => productCounts[b.id] - productCounts[a.id])
        .slice(0, 8);
    }
  });
</script>

{#if mostPurchased?.length > 0}
  <div class="most-purchased-products">
    <h2 class="text-center text-4xl font-extrabold text-black mb-8">Most Purchased Products</h2>
    <div class="product-grid">
      {#each mostPurchased as product}
        <ProductCard {product} />
      {/each}
    </div>
  </div>
{/if} 