# simple ideas, algorithms & experiments

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

Run `python3 preview_server.py` and open http://127.0.0.1:8765/. A local gallery cannot embed production SALSA because only the published Pages origin is allowed; test live embedding on the published site.

## Publication

This local checkout tracks `origin/main`. Stage the intended files, commit, and push. GitHub Pages publishes from main / (root). `.DS_Store`, the obsolete local `salsa-preview.jpg`, and node_modules are ignored.

## Contact and donations

The author name reveals contact and donation actions on hover, click/tap, or keyboard. Configure public connections in `support-config.js`:

1. Create a Formspree form, verify its recipient email privately in Formspree, and copy its `https://formspree.io/f/...` endpoint to `formspreeEndpoint`.
2. Complete Stripe account onboarding. Create GBP Payment Links for £5, £10, £25, £50 and a customer-chosen amount. Put their public `https://buy.stripe.com/...` URLs in `stripeLinks`. Test checkout using Stripe test mode before publishing live links.
3. The charity allocation is 50% of the gross payment before fees. Contributions are transferred separately; Payment Links do not automatically send half to the charity.
4. After verifying charity receipts, update `confirmedDonatedMinor` with the cumulative amount actually donated in pence, and `confirmedAsOf` with YYYY-MM-DD. For example, £50 is 5000. Null displays an unconfirmed state, not a fabricated zero. Commit and push to update the donation-page counter. Do not count checkout clicks or browser success redirects as donations.

Never place a recipient email, secret API key, bank details or private receipts in this public repository. Messaging and each checkout remain unavailable until configured. Automated counter updates would require a trusted server-side process and evidence of charity transfers, not just Stripe payment events.

The current public PDF has had its email address redacted. The email can be restored in a future PDF export when the author is ready for publication. Update the PDF URL version in `index.html` and `gallery.js` when replacing it to refresh cached previews. Older Git history contains the original PDF.

## Typography

The gallery and donation page use locally hosted Reenie Beanie, with its SIL Open Font License in `fonts/reenie-beanie/OFL.txt`. Shared rules are in `typography.css`. The embedded SALSA application and manuscript retain their own typography.

## One-page index

The fixed left-hand index groups Apps, Manuscripts and Ideas. At widths below 1200px it becomes a sticky expandable menu. Links use native URL fragments, smooth scrolling (unless reduced motion is preferred), keyboard focus and active-section highlighting.

To add an entry, append its figure/section inside `.gallery`, give it a unique `id`, `tabindex="-1"`, a descriptive `aria-label`, `data-index-group="Manuscripts"` (or Apps/Ideas), and `data-index-label="Your title"`. `navigation.js` discovers entries automatically. Update the static fallback links in `index.html` too. Sections can link to each other using these IDs, allowing several manuscripts to refer to one app without duplicating the app. Additional live PDF viewers will need their own viewer instances; do not duplicate the existing PDF control IDs.

## Repository-backed task lists

Every gallery item now has a read-only, numbered Markdown task list. Lists are
fetched when opened; close and reopen to load edits. No browser edits are saved.
Previous browser-local lists are left untouched in localStorage, not published.

| Gallery item | Authoritative source |
| --- | --- |
| SALSA app | `../SALSA/TodoList/TODO.md` |
| ADA app | `../ADA/app/TodoList/TODO.md` |
| Lagtime app | `../LagtimeEstimator/TodoList/TODO.md` |
| Amyloid experiments | `../SALSA/TodoList/amyloid-experiments.md` |
| Helical experiments | `../SALSA/TodoList/helical-experiments.md` |
| Five manuscripts | `~/Documents/Manuscripts/manuscripts/TodoList/<manuscript-id>.md` |
| Thought board | `TodoList/thought-experiments.md` in this website repository |

App/experiment lists are published via read-only endpoints on their corresponding
Render service after a successful deployment. Only explicitly selected task files
are public; credentials and other repository files are not exposed.

Manuscript IDs are salsa-webapp, ada, lagtime-calculator,
amyloid-beta-sheet-contiguity, and salsa-helical-amphipathicity. Their private
repository's Publish manuscript task lists workflow uses the existing
PAGES_PUBLISH_TOKEN to update only `tasks/manuscripts/*.md` in this website.
Those website files are published copies, not the editing source. This does not
require a LaTeX build. The workflow respects the manuscript publication switch.

If a manuscript has `TodoList/TODO.md` in its Overleaf source directory, that
file takes precedence after the usual Overleaf sync. Otherwise the repository's
top-level TodoList file is used. Never edit the synced source directories locally:
the next Overleaf sync replaces them. Top-level TodoList files survive that sync.

Use Markdown checkboxes (`- [ ]`, `- [x]`) and two spaces per nesting level.
The gallery displays hierarchical numbers (1, 1.1, 1.2, 2) and strikes through
completed tasks. A heading-only file displays “No tasks listed yet.”
All task files are intended to be public: keep private notes out of them.

### Preview unpublished task edits

Run `python3 preview_server.py --port 8766` and open the printed localhost URL.
The server binds only to 127.0.0.1 and reads an explicit allowlist of files in the
local project repositories above. No app server or deployment is required for
these lists. Close and reopen a panel after editing its Markdown file.
The ordinary `python3 -m http.server` command cannot serve those local sources.
Restart preview_server.py after changing its code or file mapping.
