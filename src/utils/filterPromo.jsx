export const filterPromotions = (products) => {
    if (!Array.isArray(products)) return []; // Return an empty array if `products` is not an array
  
    // Filter products based on a promotion (e.g., discount percentage or a special offer)
    const filteredPromotions = products.filter(product =>
      product.promoted && product.instock && parseInt(product.quantity) > 5 // Example condition for promotions
    );
  
    return filteredPromotions;
  };
  