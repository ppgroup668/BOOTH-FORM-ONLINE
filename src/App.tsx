import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { loadPdfDocument } from './services/pdfRenderer';
import { 
  fetchDocumentList, 
  fetchDocumentById, 
  saveDocumentOnline, 
  deleteDocumentOnline, 
  duplicateDocumentOnline 
} from './services/api';
import { 
  ApplicationFormData, 
  DocumentSignatures, 
  SavedDocumentMeta, 
  DEFAULT_FORM_DATA 
} from './types/form';
import { Toolbar } from './components/Toolbar';
import { PdfPageView } from './components/PdfPageView';
import { SignaturePadModal } from './components/SignaturePadModal';
import { DocumentLibraryModal } from './components/DocumentLibraryModal';
import { FormEditorDrawer } from './components/FormEditorDrawer';
import { exportCombinedPdf } from './utils/pdfExport';
import { Loader2, AlertCircle, FileCheck, HelpCircle } from 'lucide-react';

export default function App() {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Document state
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>('中銀人壽團隊活動申請表');
  const [formData, setFormData] = useState<ApplicationFormData>(DEFAULT_FORM_DATA);
  const [signatures, setSignatures] = useState<DocumentSignatures>({});
  const [docStatus, setDocStatus] = useState<'draft' | 'submitted' | 'approved'>('draft');

  // Online library list
  const [documentsList, setDocumentsList] = useState<SavedDocumentMeta[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // View controls
  const [currentPage, setCurrentPage] = useState<1 | 2 | 'all'>('all');
  const [zoomScale, setZoomScale] = useState<number>(1.15);
  const [highlightFields, setHighlightFields] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedText, setLastSavedText] = useState<string>('');

  // Signature modal
  const [sigModalConfig, setSigModalConfig] = useState<{
    isOpen: boolean;
    slot: 'applicant1' | 'applicant2' | 'director1' | 'director2' | null;
    title: string;
    defaultName: string;
  }>({
    isOpen: false,
    slot: null,
    title: '',
    defaultName: ''
  });

  // Canvas references for PDF export
  const page1CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const page2CanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Load PDF Document on mount
  useEffect(() => {
    async function initPdf() {
      try {
        setLoadingPdf(true);
        const doc = await loadPdfDocument();
        setPdfDoc(doc);
        setLoadingPdf(false);
      } catch (err: any) {
        console.error('Failed to load PDF asset:', err);
        setPdfError('無法載入中銀人壽官方申請表 PDF，請確認檔案路徑是否正確。');
        setLoadingPdf(false);
      }
    }
    initPdf();
  }, []);

  // 2. Fetch documents list from online database on mount
  const refreshDocumentsList = useCallback(async () => {
    try {
      const docs = await fetchDocumentList();
      setDocumentsList(docs);
      return docs;
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    refreshDocumentsList().then(async (docs) => {
      if (docs && docs.length > 0) {
        // Load the most recent document
        const latestId = docs[0].id;
        const fullDoc = await fetchDocumentById(latestId);
        if (fullDoc) {
          setCurrentDocId(fullDoc.id);
          setDocumentTitle(fullDoc.title);
          setFormData(fullDoc.formData || DEFAULT_FORM_DATA);
          setSignatures(fullDoc.signatures || {});
          setDocStatus(fullDoc.status || 'draft');
          setLastSavedText('已同步至雲端');
        }
      }
    });
  }, [refreshDocumentsList]);

  // Form field change handler
  const handleFieldChange = (field: keyof ApplicationFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Online save handler
  const handleSaveOnline = async () => {
    try {
      setIsSaving(true);
      const saved = await saveDocumentOnline(
        currentDocId,
        documentTitle.trim() || '未命名申請表',
        formData,
        signatures,
        docStatus
      );

      setCurrentDocId(saved.id);
      setIsSaving(false);

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setLastSavedText(`已儲存於 ${timeStr}`);

      await refreshDocumentsList();
    } catch (err) {
      console.error('Save failed:', err);
      setIsSaving(false);
      alert('儲存至線上資料庫時發生錯誤，已為您暫存於本地快取。');
    }
  };

  // Auto-save debounce effect (every 45s if modified)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentDocId && formData) {
        saveDocumentOnline(
          currentDocId,
          documentTitle,
          formData,
          signatures,
          docStatus
        ).then(() => {
          const now = new Date();
          setLastSavedText(`已自動儲存於 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
        }).catch(() => {});
      }
    }, 45000);

    return () => clearTimeout(timer);
  }, [formData, signatures, documentTitle, currentDocId, docStatus]);

  // Document Library Actions
  const handleSelectDocument = async (id: string) => {
    try {
      const doc = await fetchDocumentById(id);
      if (doc) {
        setCurrentDocId(doc.id);
        setDocumentTitle(doc.title);
        setFormData(doc.formData || DEFAULT_FORM_DATA);
        setSignatures(doc.signatures || {});
        setDocStatus(doc.status || 'draft');
        setLastSavedText('已載入雲端文件');
      }
    } catch (err) {
      console.error('Select document failed:', err);
    }
  };

  const handleCreateNew = () => {
    setCurrentDocId(null);
    setDocumentTitle(`中銀人壽團隊活動申請表 - ${new Date().toLocaleDateString('zh-HK')}`);
    setFormData(DEFAULT_FORM_DATA);
    setSignatures({});
    setDocStatus('draft');
    setLastSavedText('新草稿（未儲存）');
  };

  const handleDuplicate = async (id: string) => {
    try {
      const dup = await duplicateDocumentOnline(id);
      if (dup) {
        await refreshDocumentsList();
        await handleSelectDocument(dup.id);
      }
    } catch (err) {
      console.error('Duplicate failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此份線上申請文件嗎？此動作無法復原。')) return;
    try {
      await deleteDocumentOnline(id);
      await refreshDocumentsList();
      if (currentDocId === id) {
        handleCreateNew();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleLoadSampleTemplate = () => {
    setDocumentTitle('【示範範本】中銀人壽領展路展活動申請');
    setFormData({
      team1: '九龍東第一分區 (KLE-01)',
      name1: 'CHAN TAI MAN',
      agentNo1: 'BOC-98231',
      phone1: '9123 4567',
      team2: '',
      name2: '',
      agentNo2: '',
      phone2: '',
      activityTypes: ['roadshow_link'],
      activityOtherText: '',
      purposes: ['relationship', 'insurance_promo'],
      purposeOtherText: '',
      insuranceCategories: ['boclife_non_ilp', 'bocg_gi'],
      activityDesc: '舉辦為期三天的中銀人壽專屬代理年終客戶諮詢及產品推廣路展，設立兩組諮詢櫃枱，派發官方核准產品小冊子，並提供現場退休及儲蓄人壽方案說明。',
      eventDates: '15/12/2026 - 17/12/2026',
      customQuestionnaire: 'no',
      customPromoMaterial: 'no',
      giveawayGifts: 'no',
      venueGroup: 'link',
      venueLinkLocation: '黃大仙中心北館 1 樓中庭展銷場地',
      venueLinkType: 'booth_venue',
      venueOtherLocation: '',
      venueOtherType: '',
      venueOtherCustomText: '',
      venueOfficeLocation: '',
      venueOfficeRooms: [],
      venueOfficeAc: '',
      adMediumType: '',
      adLocationAgency: '',
      section2Notes: '1. 需借用官方保險路展易拉架 4 個、中銀人壽檯布 2 塊、宣傳單張架 2 個。\n2. 所有展示物料均為我司現行有效之官方宣傳單張。\n3. 場地已向領展商場完成初步預約登記。',
      agentsList: [
        { id: '1', name: 'CHAN TAI MAN', team: 'KLE-01', code: 'BOC-98231', license: '持有壽險、一般保險及強積金牌照' },
        { id: '2', name: 'WONG SIU FUNG', team: 'KLE-01', code: 'BOC-87654', license: '持有壽險及強積金牌照' },
        { id: '3', name: 'LEUNG KA YAN', team: 'KLE-01', code: 'BOC-76543', license: '持有壽險牌照' }
      ],
      applicant1SignDate: '09/11/2026',
      applicant2SignDate: '',
      director1Name: 'CHEUNG CHUN KIT',
      director1SignDate: '09/11/2026',
      director2Name: '',
      director2SignDate: ''
    });
    setSignatures({});
    setLastSavedText('已載入示範資料');
  };

  // Signatures
  const handleOpenSignature = (
    slot: 'applicant1' | 'applicant2' | 'director1' | 'director2',
    title: string,
    defaultName?: string
  ) => {
    setSigModalConfig({
      isOpen: true,
      slot,
      title,
      defaultName: defaultName || ''
    });
  };

  const handleSaveSignature = (dataUrl: string) => {
    if (!sigModalConfig.slot) return;
    setSignatures((prev) => ({
      ...prev,
      [sigModalConfig.slot!]: dataUrl
    }));
  };

  const handleClearSignature = (slot: 'applicant1' | 'applicant2' | 'director1' | 'director2') => {
    setSignatures((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  };

  // Printing
  const handlePrint = () => {
    // Before printing, trigger window.print()
    window.print();
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    if (!page1CanvasRef.current || !page2CanvasRef.current) {
      alert('請先切換至「兩頁並排」或瀏覽過兩頁後，方可產生完整雙頁 PDF。');
      return;
    }
    try {
      await exportCombinedPdf(
        page1CanvasRef.current,
        page2CanvasRef.current,
        `${documentTitle}.pdf`
      );
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('匯出 PDF 時發生錯誤，請嘗試使用列印功能選擇「另存為 PDF」。');
    }
  };

  const handleCanvasReady = (pageNumber: 1 | 2, canvas: HTMLCanvasElement) => {
    if (pageNumber === 1) page1CanvasRef.current = canvas;
    if (pageNumber === 2) page2CanvasRef.current = canvas;
  };

  if (loadingPdf) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold">正在載入中銀人壽官方申請表...</h2>
        <p className="text-slate-400 text-sm mt-1">
          系統正在精確解析官方 PDF 格式與向量圖層，請稍候
        </p>
      </div>
    );
  }

  if (pdfError) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-rose-200 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">載入申請表失敗</h2>
          <p className="text-slate-600 text-sm mt-2">{pdfError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition"
          >
            重新整理頁面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-200/90 text-slate-900 font-sans">
      {/* Top Application Toolbar */}
      <Toolbar
        documentTitle={documentTitle}
        onTitleChange={setDocumentTitle}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        zoomScale={zoomScale}
        onZoomChange={setZoomScale}
        highlightFields={highlightFields}
        onToggleHighlight={() => setHighlightFields((prev) => !prev)}
        isDrawerOpen={isDrawerOpen}
        onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onSaveOnline={handleSaveOnline}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        isSaving={isSaving}
        lastSavedText={lastSavedText}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Document Canvas Viewport */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start gap-8 print:p-0 print:m-0 print:overflow-visible">
          {/* Subtle Instructions Banner (Collapsible/Dismissible) */}
          <div className="w-full max-w-4xl bg-blue-50/90 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-900 flex items-center justify-between shadow-xs print:hidden">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
              <span>
                <strong>填寫說明：</strong>點擊 PDF 上任意藍色虛線框即可直接輸入文字或勾選方塊；點擊簽署欄位可手寫電子簽名。版面尺寸、字體大小及官方格式嚴格鎖定無位移。
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="font-semibold text-blue-700 hover:underline shrink-0 ml-3"
            >
              開啟快速助理 →
            </button>
          </div>

          {/* Render Page 1 */}
          {(currentPage === 1 || currentPage === 'all') && (
            <PdfPageView
              pdfDoc={pdfDoc}
              pageNumber={1}
              scale={zoomScale}
              formData={formData}
              signatures={signatures}
              onChange={handleFieldChange}
              onOpenSignature={handleOpenSignature}
              onClearSignature={handleClearSignature}
              highlightFields={highlightFields}
              onCanvasReady={handleCanvasReady}
            />
          )}

          {/* Render Page 2 */}
          {(currentPage === 2 || currentPage === 'all') && (
            <PdfPageView
              pdfDoc={pdfDoc}
              pageNumber={2}
              scale={zoomScale}
              formData={formData}
              signatures={signatures}
              onChange={handleFieldChange}
              onOpenSignature={handleOpenSignature}
              onClearSignature={handleClearSignature}
              highlightFields={highlightFields}
              onCanvasReady={handleCanvasReady}
            />
          )}
        </main>

        {/* Collapsible Form Editor Drawer */}
        <FormEditorDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          formData={formData}
          signatures={signatures}
          onChange={handleFieldChange}
          onOpenSignature={handleOpenSignature}
        />
      </div>

      {/* Signature Modal */}
      <SignaturePadModal
        isOpen={sigModalConfig.isOpen}
        onClose={() => setSigModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveSignature}
        title={sigModalConfig.title}
        defaultName={sigModalConfig.defaultName}
      />

      {/* Online Document Library Modal */}
      <DocumentLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        documents={documentsList}
        currentDocId={currentDocId}
        onSelectDocument={handleSelectDocument}
        onCreateNew={handleCreateNew}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onLoadTemplate={handleLoadSampleTemplate}
      />
    </div>
  );
}
