const currenyFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function _splitRest(s: string): string[] {
  if (s.length === 7) {
    return [s.slice(0, 3), s.slice(3, 5), s.slice(5)];
  }
  return s.match(/.{1,2}/g) ?? [];
}

export function formatPhone(e164: string, domestic: boolean): string {
  const match = e164.match(/^\+(\d{2})(\d+)$/);
  if (!match) throw new Error("Invalid E.164 format");

  const national = match[2];
  const prefix = national.slice(0, 2);
  const rest = _splitRest(national.slice(2)).join(" ");

  if (domestic) {
    return `0${prefix}-${rest}`;
  }
  return `+${match[1]} ${prefix}-${rest}`;
}

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
