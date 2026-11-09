import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

let cachedDoc: pdfjsLib.PDFDocumentProxy | null = null;
let loadingPromise: Promise<pdfjsLib.PDFDocumentProxy> | null = null;

export async function loadPdfDocument(url: string = '/assets/aistudio/TA_activitiesapplication_202610_Final__1__0724f91a.pdf'): Promise<pdfjsLib.PDFDocumentProxy> {
  if (cachedDoc) return cachedDoc;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const loadingTask = pdfjsLib.getDocument({
        url,
        cMapUrl: '/cmaps/',
        cMapPacked: true,
      });
      cachedDoc = await loadingTask.promise;
      return cachedDoc;
    } catch (err) {
      console.error('Failed to load PDF with pdfjs:', err);
      loadingPromise = null;
      throw err;
    }
  })();

  return loadingPromise;
}

export async function renderPdfPage(
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.5
): Promise<{ width: number; height: number }> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  // High DPI support
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(viewport.width * dpr);
  canvas.height = Math.floor(viewport.height * dpr);

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Cannot get 2d context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const transform = dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined;

  const renderContext: any = {
    canvasContext: ctx,
    viewport: viewport,
    transform: transform,
    canvas: canvas
  };

  await page.render(renderContext).promise;

  return {
    width: viewport.width,
    height: viewport.height
  };
}
