export const filterTrendingProducts = (products) => {
    if (!Array.isArray(products)) return []; // Return an empty array if `products` is not an array

    const filteredBySaleAndStock = products.filter(product =>
      product.onsale &&
      product.instock &&
      parseInt(product.quantity) > 10
    );

    const filteredByReviews = filteredBySaleAndStock.filter(product =>
      product.reviewrating >= 4
    );

    const trendingByNewness = filteredByReviews.sort((a, b) =>
      new Date(b.timeStamp) - new Date(a.timeStamp) // Newest first
    );

    return trendingByNewness;
  };