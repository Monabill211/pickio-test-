/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number, currency: string = 'EGP'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedPrice = formatter.format(price);
  
  const currencySymbols: Record<string, string> = {
    EGP: 'E£',
    USD: '$',
    EUR: '€',
    SAR: 'SR',
  };

  const symbol = currencySymbols[currency] || currency;
  return `${formattedPrice} ${symbol}`;
};
