// Utility function to filter most purchased products
export const filterMostPurchasedProducts = (orders, products) => {
    if (!Array.isArray(orders) || !Array.isArray(products)) return [];
  
    const productIds = orders
      .flatMap(order => order.itemsInCart.map(item => item.id))
      .reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1; // Count the occurrences of each product
        return acc;
      }, {});
  
    const sortedProductIds = Object.entries(productIds)
      .sort(([, countA], [, countB]) => countB - countA) // Sort by most purchased
      .map(([id]) => id);
  
    // Filter products based on sorted product ids
    const sortedProducts = products.filter(product => sortedProductIds.includes(product.id));
  
    return sortedProducts;
  };