# SALSA et al.

Public site: https://zibaee-2021.github.io/

## Panels

- SALSA is a live, scaled iframe of https://salsa-maru.onrender.com/. The caption opens the full application in a new tab. SALSA's production Content-Security-Policy permits framing only by itself and this GitHub Pages origin.
- The manuscript viewer renders `manuscripts/SALSA_WebApp.pdf` using locally served PDF.js 6.3.289 (Apache-2.0; license under `vendor/pdfjs/LICENSE`). Previous/Next controls navigate pages. Open PDF opens the full original document.
- The chalkboard is a placeholder for ideas.

The PDF is public. Overleaf/LaTeX source remains in the separate private manuscripts repository. No credentials are required or included here.

## Updates

Replace the PDF at the same path, commit it and push `main` to refresh the manuscript after Pages deploys. If renamed, update its path in `index.html` and `gallery.js`.

SALSA changes deploy separately through its own GitHub repository and Render. Reload the gallery to load the latest deployed app. Render may need time to wake up; the full-size link remains available. The screenshot JPEG is ignored and no longer used.

## Local preview

Run `python3 -m http.server 8765 --bind 127.0.0.1` and open http://127.0.0.1:8765/. A local gallery cannot embed production SALSA because only the published Pages origin is allowed; test live embedding on the published site.

## Publication

This local checkout tracks `origin/main`. Stage the intended files, commit, and push. GitHub Pages publishes from main / (root). `.DS_Store`, the obsolete local `salsa-preview.jpg`, and node_modules are ignored.

## Contact and donations

The author name reveals contact and donation actions on hover, click/tap, or keyboard. Configure public connections in `support-config.js`:

1. Create a Formspree form, verify its recipient email privately in Formspree, and copy its `https://formspree.io/f/...` endpoint to `formspreeEndpoint`.
2. Complete Stripe account onboarding. Create GBP Payment Links for £5, £10, £25, £50 and a customer-chosen amount. Put their public `https://buy.stripe.com/...` URLs in `stripeLinks`. Test checkout using Stripe test mode before publishing live links.
3. The charity allocation is 50% of the gross payment before fees. Contributions are transferred separately; Payment Links do not automatically send half to the charity.
4. After verifying charity receipts, update `confirmedDonatedMinor` with the cumulative amount actually donated in pence, and `confirmedAsOf` with YYYY-MM-DD. For example, £50 is 5000. Null displays an unconfirmed state, not a fabricated zero. Commit and push to update both counters. Do not count checkout clicks or browser success redirects as donations.

Never place a recipient email, secret API key, bank details or private receipts in this public repository. Messaging and each checkout remain unavailable until configured. Automated counter updates would require a trusted server-side process and evidence of charity transfers, not just Stripe payment events.

The current public PDF has had its email address redacted. The email can be restored in a future PDF export when the author is ready for publication. Update the PDF URL version in `index.html` and `gallery.js` when replacing it to refresh cached previews. Older Git history contains the original PDF.
