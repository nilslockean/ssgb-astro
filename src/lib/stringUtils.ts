const currenyFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(prices: number[]) {
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // The currency formatter likes the &nbsp; character. I don't.
  const formattedPrice = currenyFormatter
    .format(minPrice)
    .replace(/\u00A0/g, " ");

  if (minPrice === maxPrice) {
    return formattedPrice;
  }

  return "Från " + formattedPrice;
}
