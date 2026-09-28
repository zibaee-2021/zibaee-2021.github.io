import { getDocument, GlobalWorkerOptions } from './vendor/pdfjs/pdf.min.mjs';
GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/pdf.worker.min.mjs', import.meta.url).href;

const frame = document.getElementById('salsa-frame');
const appPanel = document.getElementById('salsa-preview');
function fitApp() {
  const scale = appPanel.clientWidth / 840;
  frame.style.transform = `scale(${scale})`;
  frame.style.height = `${appPanel.clientHeight / scale}px`;
}
new ResizeObserver(fitApp).observe(appPanel);
fitApp();

const canvas = document.getElementById('pdf-canvas');
const panel = document.getElementById('pdf-page');
const message = document.getElementById('pdf-message');
const counter = document.getElementById('pdf-counter');
const previous = document.getElementById('pdf-prev');
const next = document.getElementById('pdf-next');
let pdf, pageNumber = 1, rendering = false, queued = false;

async function renderPage() {
  if (!pdf) return;
  if (rendering) { queued = true; return; }
  rendering = true;
  previous.disabled = next.disabled = true;
  try {
    const page = await pdf.getPage(pageNumber);
    const natural = page.getViewport({ scale: 1 });
    const scale = Math.min(panel.clientWidth / natural.width, panel.clientHeight / natural.height);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const viewport = page.getViewport({ scale: scale * ratio });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = `${viewport.width / ratio}px`;
    canvas.style.height = `${viewport.height / ratio}px`;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    canvas.setAttribute('aria-label', `Manuscript page ${pageNumber} of ${pdf.numPages}. Use Open PDF for the full document.`);
    counter.textContent = `${pageNumber} / ${pdf.numPages}`;
    message.hidden = true;
  } catch (error) {
    message.textContent = 'Preview unavailable. Use Open PDF below.';
    message.hidden = false;
    console.error('PDF rendering failed', error);
  } finally {
    rendering = false;
    previous.disabled = pageNumber <= 1;
    next.disabled = pageNumber >= pdf.numPages;
    if (queued) { queued = false; renderPage(); }
  }
}
previous.addEventListener('click', () => { if (!rendering && pageNumber > 1) { pageNumber--; renderPage(); } });
next.addEventListener('click', () => { if (!rendering && pdf && pageNumber < pdf.numPages) { pageNumber++; renderPage(); } });
let resizeTimer;
new ResizeObserver(() => { clearTimeout(resizeTimer); resizeTimer = setTimeout(renderPage, 150); }).observe(panel);
try {
  pdf = await getDocument({
    url: new URL('./manuscripts/SALSA_WebApp.pdf', import.meta.url).href,
    cMapUrl: new URL('./vendor/pdfjs/cmaps/', import.meta.url).href,
    cMapPacked: true,
    standardFontDataUrl: new URL('./vendor/pdfjs/standard_fonts/', import.meta.url).href,
    wasmUrl: new URL('./vendor/pdfjs/wasm/', import.meta.url).href,
  }).promise;
  await renderPage();
} catch (error) {
  counter.textContent = 'Preview unavailable';
  message.textContent = 'Unable to load the preview. Use Open PDF below.';
  console.error('PDF loading failed', error);
}
