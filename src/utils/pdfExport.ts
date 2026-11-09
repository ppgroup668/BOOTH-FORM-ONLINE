import { PDFDocument } from 'pdf-lib';

export async function exportCombinedPdf(
  page1Canvas: HTMLCanvasElement,
  page2Canvas: HTMLCanvasElement,
  fileName: string = '中銀人壽團隊活動申請表.pdf'
): Promise<void> {
  const pdfDoc = await PDFDocument.create();

  // Convert canvas 1 to PNG image
  const p1DataUrl = page1Canvas.toDataURL('image/png', 1.0);
  const p1Image = await pdfDoc.embedPng(p1DataUrl);
  const page1 = pdfDoc.addPage([595.32, 841.92]);
  page1.drawImage(p1Image, {
    x: 0,
    y: 0,
    width: 595.32,
    height: 841.92,
  });

  // Convert canvas 2 to PNG image
  const p2DataUrl = page2Canvas.toDataURL('image/png', 1.0);
  const p2Image = await pdfDoc.embedPng(p2DataUrl);
  const page2 = pdfDoc.addPage([595.32, 841.92]);
  page2.drawImage(p2Image, {
    x: 0,
    y: 0,
    width: 595.32,
    height: 841.92,
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes) as unknown as BlobPart], { type: 'application/pdf' });
  const downloadUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
