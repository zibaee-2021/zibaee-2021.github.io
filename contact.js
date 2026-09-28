import { support } from './support-config.js';
// Formspree's public endpoint identifies the form without exposing its recipient.
const contactEndpoint = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(support.formspreeEndpoint) ? support.formspreeEndpoint : '';
const author = document.querySelector('.author');
const toggle = document.getElementById('author-toggle');
const actions = document.getElementById('author-actions');
const dialog = document.getElementById('contact-dialog');
const form = document.getElementById('contact-form');
const send = document.getElementById('contact-send');
const status = document.getElementById('contact-status');
function showActions(open) {
  actions.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
}
author.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'touch') showActions(true);
});
author.addEventListener('pointerleave', () => {
  if (!author.contains(document.activeElement)) showActions(false);
});
toggle.addEventListener('click', () => showActions(actions.hidden));
author.addEventListener('focusout', event => {
  if (!author.contains(event.relatedTarget)) showActions(false);
});
document.addEventListener('click', event => {
  if (!author.contains(event.target)) showActions(false);
});
author.addEventListener('keydown', event => {
  if (event.key === 'Escape') { showActions(false); toggle.focus(); }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    showActions(true);
    document.getElementById('contact-open').focus();
  }
});
document.getElementById('contact-open').addEventListener('click', () => {
  dialog.showModal();
  showActions(false);
});
document.getElementById('contact-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => toggle.focus());
if (contactEndpoint) {
  send.disabled = false;
  status.textContent = 'Your email will only be used to reply to your message.';
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!contactEndpoint || send.disabled || !form.reportValidity()) return;
  send.disabled = true;
  status.textContent = 'Sending…';
  try {
    const response = await fetch(contactEndpoint, {
      method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('Message service rejected the request');
    form.reset();
    status.textContent = 'Thank you — your message has been sent.';
  } catch {
    status.textContent = 'Your message could not be sent. Please try again. Your text is still here.';
  } finally { send.disabled = false; }
});
