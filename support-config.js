// Public configuration only: never add email addresses, secret keys or bank details.
export const support = {
  formspreeEndpoint: '',
  currency: 'GBP',
  charityPercent: 50,
  stripeLinks: { 5: '', 10: '', 25: '', 50: '', custom: '' },
  // Money actually transferred to the charity, in pence. Null means unverified.
  confirmedDonatedMinor: null,
  confirmedAsOf: '', // YYYY-MM-DD, updated only after checking donation receipts.
};
