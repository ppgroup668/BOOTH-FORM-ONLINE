import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { renderPdfPage } from '../services/pdfRenderer';
import { PdfPageOverlay } from './PdfPageOverlay';
import { ApplicationFormData, DocumentSignatures } from '../types/form';
import { Loader2 } from 'lucide-react';

interface PdfPageViewProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  pageNumber: 1 | 2;
  scale: number;
  formData: ApplicationFormData;
  signatures: DocumentSignatures;
  onChange: (field: keyof ApplicationFormData, value: any) => void;
  onOpenSignature: (slot: 'applicant1' | 'applicant2' | 'director1' | 'director2', title: string, defaultName?: string) => void;
  onClearSignature: (slot: 'applicant1' | 'applicant2' | 'director1' | 'director2') => void;
  highlightFields: boolean;
  onCanvasReady?: (pageNumber: 1 | 2, canvas: HTMLCanvasElement) => void;
}

export const PdfPageView: React.FC<PdfPageViewProps> = ({
  pdfDoc,
  pageNumber,
  scale,
  formData,
  signatures,
  onChange,
  onOpenSignature,
  onClearSignature,
  highlightFields,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [pageSize, setPageSize] = useState<{ width: number; height: number }>({
    width: 595.32 * scale,
    height: 841.92 * scale
  });

  useEffect(() => {
    let isCancelled = false;

    async function render() {
      if (!pdfDoc || !canvasRef.current) return;
      setIsRendering(true);

      try {
        const dimensions = await renderPdfPage(pdfDoc, pageNumber, canvasRef.current, scale);
        if (!isCancelled) {
          setPageSize(dimensions);
          setIsRendering(false);
          if (onCanvasReady && canvasRef.current) {
            onCanvasReady(pageNumber, canvasRef.current);
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error(`Error rendering page ${pageNumber}:`, err);
          setIsRendering(false);
        }
      }
    }

    render();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, pageNumber, scale]);

  return (
    <div className="pdf-page-wrapper flex flex-col items-center">
      {/* Page indicator in UI */}
      <div className="w-full flex items-center justify-between px-2 py-1 text-[11px] text-slate-500 font-medium select-none print:hidden mb-1">
        <span>第 {pageNumber} 頁 (共 2 頁)</span>
        <span>A4 規格 (210mm × 297mm) · 官方格式鎖定</span>
      </div>

      {/* Main A4 Document Sheet */}
      <div
        ref={containerRef}
        style={{
          width: `${pageSize.width}px`,
          height: `${pageSize.height}px`,
        }}
        className="relative bg-white shadow-xl rounded-sm border border-slate-300 print:border-none print:shadow-none print:rounded-none overflow-hidden print-page"
      >
        {/* Background PDF Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
          className="pointer-events-none"
        />

        {/* Loading overlay if re-rendering */}
        {isRendering && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex flex-col items-center justify-center text-slate-500 text-xs z-20 print:hidden">
            <Loader2 className="w-7 h-7 text-blue-600 animate-spin mb-2" />
            <span>載入官方第 {pageNumber} 頁 PDF 向量圖層中...</span>
          </div>
        )}

        {/* Interactive Form & Checkboxes Layer */}
        <PdfPageOverlay
          pageNumber={pageNumber}
          formData={formData}
          signatures={signatures}
          onChange={onChange}
          onOpenSignature={onOpenSignature}
          onClearSignature={onClearSignature}
          highlightFields={highlightFields}
        />
      </div>
    </div>
  );
};
