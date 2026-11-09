import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Check, PenTool, Type } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  title: string;
  defaultName?: string;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  defaultName = ''
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState(defaultName);
  const [inkColor, setInkColor] = useState<string>('#0f2b5c'); // Executive Blue
  const [hasDrawn, setHasDrawn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTypedName(defaultName);
      setHasDrawn(false);
      // Initialize canvas
      setTimeout(() => {
        initCanvas();
      }, 50);
    }
  }, [isOpen, defaultName]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.5;
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const coords = getCanvasCoords(e);
    lastPointRef.current = coords;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentCoords = getCanvasCoords(e);

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(currentCoords.x, currentCoords.y);
    ctx.stroke();

    lastPointRef.current = currentCoords;
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleClear = () => {
    initCanvas();
    setHasDrawn(false);
  };

  const generateTypedSignature = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, 600, 200);
    ctx.font = 'italic bold 48px "Brush Script MT", "Segoe Script", cursive, "Noto Serif TC", serif';
    ctx.fillStyle = inkColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName || 'Signed', 300, 100);

    return canvas.toDataURL('image/png');
  };

  const handleSave = () => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) {
        alert('請先在畫布上進行簽名，或切換至文字生成模式。');
        return;
      }
      onSave(canvas.toDataURL('image/png'));
    } else {
      if (!typedName.trim()) {
        alert('請輸入簽名英文或中文姓名。');
        return;
      }
      const dataUrl = generateTypedSignature();
      onSave(dataUrl);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">提供具法律約束力之授權電子簽名紀錄</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition"
            title="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('draw')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition ${
              activeTab === 'draw'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            滑鼠 / 觸控手寫簽名
          </button>
          <button
            onClick={() => setActiveTab('type')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 transition ${
              activeTab === 'type'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            鍵盤輸入英中文草寫
          </button>
        </div>

        {/* Ink Colors & Tools */}
        <div className="px-5 py-2.5 flex items-center justify-between bg-white border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">筆跡顏色：</span>
            <button
              type="button"
              onClick={() => setInkColor('#0f2b5c')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${
                inkColor === '#0f2b5c'
                  ? 'border-blue-700 bg-blue-50 text-blue-900 font-medium'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#0f2b5c]"></span>
              商務深藍
            </button>
            <button
              type="button"
              onClick={() => setInkColor('#111827')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${
                inkColor === '#111827'
                  ? 'border-slate-800 bg-slate-100 text-slate-900 font-medium'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#111827]"></span>
              經典炭黑
            </button>
          </div>

          {activeTab === 'draw' && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 transition"
              title="清除重填"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新繪畫</span>
            </button>
          )}
        </div>

        {/* Body Canvas / Input */}
        <div className="p-5 bg-slate-50/50">
          {activeTab === 'draw' ? (
            <div className="relative border-2 border-dashed border-slate-300 rounded-lg bg-white overflow-hidden shadow-inner group">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-44 cursor-crosshair touch-none"
              />
              {!hasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs">
                  <PenTool className="w-6 h-6 mb-1.5 opacity-50 stroke-1" />
                  <span>在此虛線框內以手指或滑鼠書寫簽名</span>
                </div>
              )}
              <div className="absolute bottom-2 left-3 pointer-events-none text-[10px] text-slate-300">
                ✕ 請於底線上簽署
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  簽署人全名（英文或中文）
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="例如: CHAN TAI MAN"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="border border-slate-200 rounded-lg p-6 bg-white flex flex-col items-center justify-center min-h-32">
                <span className="text-xs text-slate-400 mb-2">生成預覽效果</span>
                <span
                  style={{ color: inkColor }}
                  className="text-3xl font-serif italic tracking-wide select-none"
                >
                  {typedName || '請在上方輸入姓名'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100 border-t border-slate-200">
          <span className="text-[11px] text-slate-500">
            簽名將自動按官方比例壓印於表格指定欄位
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg transition"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <Check className="w-3.5 h-3.5" />
              確認使用此簽名
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
