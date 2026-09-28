import { support } from './support-config.js';

const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: support.currency });
const confirmed = Number.isSafeInteger(support.confirmedDonatedMinor) && support.confirmedDonatedMinor >= 0;
for (const counter of document.querySelectorAll('[data-charity-total]')) {
  counter.textContent = confirmed ? money.format(support.confirmedDonatedMinor / 100) : 'Awaiting confirmation';
}
for (const date of document.querySelectorAll('[data-charity-date]')) {
  date.textContent = confirmed && support.confirmedAsOf ? `Confirmed through ${support.confirmedAsOf}` : 'Only completed donations to the charity count towards this total.';
}
for (const percentage of document.querySelectorAll('[data-charity-percent]')) percentage.textContent = `${support.charityPercent}%`;
let available = false;
for (const link of document.querySelectorAll('[data-payment]')) {
  const url = support.stripeLinks[link.dataset.payment];
  if (!url) continue;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'buy.stripe.com') continue;
    link.href = parsed.href;
    link.removeAttribute('aria-disabled');
    link.removeAttribute('tabindex');
    available = true;
  } catch { /* An invalid or missing checkout stays unavailable. */ }
}
const paymentStatus = document.getElementById('payment-status');
if (paymentStatus && available) paymentStatus.textContent = 'Choose an amount to continue to secure checkout with Stripe.';
