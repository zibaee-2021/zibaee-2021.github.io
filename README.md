# Research gallery

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
