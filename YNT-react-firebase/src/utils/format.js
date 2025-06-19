export const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };
  