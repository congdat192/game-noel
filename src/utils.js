/**
 * Generates a random voucher code with a prefix.
 * Format: [PREFIX][RANDOM_CHARS] to make a total of 8 characters.
 * @returns {string} The generated voucher code.
 */
export const generateVoucherCode = () => {
  const prefix = "NOEL";
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  // 4 random chars to make a total of 8
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${randomPart}`;
};
