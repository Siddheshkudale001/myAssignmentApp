
export const stars = (rate) => {
  const filled = Math.round(rate);
  return '★'.repeat(filled) + '☆'.repeat(Math.max(0, 5 - filled));
};
