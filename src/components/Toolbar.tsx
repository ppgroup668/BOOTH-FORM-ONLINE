import React from 'react';
import { 
  Printer, 
  Download, 
  Save, 
  FolderOpen, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Highlighter, 
  PanelRight, 
  FileText,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface ToolbarProps {
  documentTitle: string;
  onTitleChange: (newTitle: string) => void;
  currentPage: 1 | 2 | 'all';
  onPageChange: (page: 1 | 2 | 'all') => void;
  zoomScale: number;
  onZoomChange: (newZoom: number) => void;
  highlightFields: boolean;
  onToggleHighlight: () => void;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  onOpenLibrary: () => void;
  onSaveOnline: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isSaving: boolean;
  lastSavedText: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  documentTitle,
  onTitleChange,
  currentPage,
  onPageChange,
  zoomScale,
  onZoomChange,
  highlightFields,
  onToggleHighlight,
  isDrawerOpen,
  onToggleDrawer,
  onOpenLibrary,
  onSaveOnline,
  onPrint,
  onDownloadPdf,
  isSaving,
  lastSavedText
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 shadow-xs select-none print:hidden z-30 relative">
      {/* Left: Branding & Document Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            中銀
          </div>
          <div className="hidden lg:block">
            <h1 className="font-bold text-slate-800 text-sm leading-tight">中銀人壽團隊活動申請表</h1>
            <p className="text-[10px] text-slate-400">官方 PDF 填寫、簽名與線上存檔系統</p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

        {/* Document Title Editable Input */}
        <div className="flex items-center gap-2 min-w-0 max-w-[280px] sm:max-w-[340px]">
          <div className="relative w-full">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="輸入申請文件標題..."
              className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded-lg px-2.5 py-1.5 focus:outline-none transition truncate"
              title="點擊修改此申請表名稱"
            />
          </div>
          {lastSavedText && (
            <span className="text-[11px] text-emerald-600 flex items-center gap-1 shrink-0 font-medium hidden xl:flex">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              {lastSavedText}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Page & View Controls */}
      <div className="flex items-center gap-2">
        {/* Page Switcher */}
        <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs">
          <button
            onClick={() => onPageChange(1)}
            className={`px-2.5 py-1 rounded-md transition ${
              currentPage === 1
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            第 1 頁
          </button>
          <button
            onClick={() => onPageChange(2)}
            className={`px-2.5 py-1 rounded-md transition ${
              currentPage === 2
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            第 2 頁
          </button>
          <button
            onClick={() => onPageChange('all')}
            className={`px-2.5 py-1 rounded-md transition hidden md:block ${
              currentPage === 'all'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            兩頁並排
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs hidden sm:flex">
          <button
            onClick={() => onZoomChange(Math.max(0.6, zoomScale - 0.15))}
            className="p-1 hover:bg-white text-slate-600 rounded"
            title="縮小"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-medium text-slate-700 min-w-11 text-center">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(2.0, zoomScale + 0.15))}
            className="p-1 hover:bg-white text-slate-600 rounded"
            title="放大"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onZoomChange(1.15)}
            className="p-1 hover:bg-white text-slate-400 hover:text-slate-700 rounded ml-0.5"
            title="重設大小 (適合寬度)"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Highlight Fields toggle */}
        <button
          onClick={onToggleHighlight}
          className={`p-1.5 text-xs rounded-lg border flex items-center gap-1 transition ${
            highlightFields
              ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="切換填寫框藍色高亮標示"
        >
          <Highlighter className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">高亮可填欄位</span>
        </button>

        {/* Toggle Form Drawer */}
        <button
          onClick={onToggleDrawer}
          className={`p-1.5 text-xs rounded-lg border flex items-center gap-1 transition ${
            isDrawerOpen
              ? 'bg-slate-800 border-slate-800 text-white font-medium'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="開啟/收起表單導航抽屜"
        >
          <PanelRight className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">表單助理</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenLibrary}
          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs flex items-center gap-1.5 transition"
          title="查看團隊同事儲存的線上文件"
        >
          <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>線上文件庫</span>
        </button>

        <button
          onClick={onSaveOnline}
          disabled={isSaving}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs flex items-center gap-1.5 transition disabled:opacity-50"
          title="儲存並同步至雲端伺服器"
        >
          {isSaving ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>儲存線上文件</span>
        </button>

        <button
          onClick={onPrint}
          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs flex items-center gap-1.5 transition hidden sm:flex"
          title="直接列印或儲存為 PDF (保持官方版面大小)"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>列印 / 輸出</span>
        </button>

        <button
          onClick={onDownloadPdf}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-xs flex items-center gap-1.5 transition"
          title="下載填妥的高清晰度 PDF 檔案"
        >
          <Download className="w-3.5 h-3.5 text-blue-700" />
          <span className="hidden md:inline">下載填妥 PDF</span>
        </button>
      </div>
    </header>
  );
};
