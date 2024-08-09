import currency from 'currency.js';

export const createCurrency = value => {
  let normalizedValue = String(value).replace(/[^\d.,]/g, '');
  normalizedValue = normalizedValue.replace(/,/g, '.');
  normalizedValue = normalizedValue.replace(/\.(?=.*\.)/g, '');

  const currencyOptions = {
    symbol: '₺',
    precision: 2,
  };

  if (isNaN(normalizedValue)) {
    return currency(0, currencyOptions);
  }

  return currency(Number(normalizedValue), currencyOptions);
};
