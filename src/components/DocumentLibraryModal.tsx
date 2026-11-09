import React, { useState } from 'react';
import { SavedDocumentMeta } from '../types/form';
import { 
  X, 
  FolderOpen, 
  Plus, 
  Copy, 
  Trash2, 
  Calendar, 
  User, 
  MapPin, 
  Search, 
  CheckCircle2, 
  Clock, 
  FileText,
  Sparkles
} from 'lucide-react';

interface DocumentLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: SavedDocumentMeta[];
  currentDocId: string | null;
  onSelectDocument: (id: string) => void;
  onCreateNew: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onLoadTemplate: () => void;
}

export const DocumentLibraryModal: React.FC<DocumentLibraryModalProps> = ({
  isOpen,
  onClose,
  documents,
  currentDocId,
  onSelectDocument,
  onCreateNew,
  onDuplicate,
  onDelete,
  onLoadTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'submitted' | 'approved'>('all');

  if (!isOpen) return null;

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary?.applicant1Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary?.applicant1Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary?.activityType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary?.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shadow-xs">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-lg">線上活動申請文件庫</h3>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  雲端即時同步已啟動
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                團隊同事可隨時儲存、載入或繼續編輯各場次之團隊活動申請表
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLoadTemplate();
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              載入示範範本
            </button>
            <button
              onClick={() => {
                onCreateNew();
                onClose();
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              新建空白申請
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition ml-1"
              title="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋文件標題、申請人姓名、代理編號、活動類型或地點..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 mr-1">狀態篩選：</span>
            {[
              { key: 'all', label: '全部文件' },
              { key: 'draft', label: '草稿中' },
              { key: 'submitted', label: '已完成填妥' },
              { key: 'approved', label: '已獲審批' }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key as any)}
                className={`px-2.5 py-1 rounded-md transition ${
                  statusFilter === f.key
                    ? 'bg-slate-800 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
          {filteredDocs.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-1" />
              <h4 className="text-slate-700 font-medium text-sm">暫無符合條件的申請文件</h4>
              <p className="text-slate-400 text-xs mt-1">您可以點擊上方「新建空白申請」或「載入示範範本」開始填寫。</p>
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isCurrent = doc.id === currentDocId;
              return (
                <div
                  key={doc.id}
                  className={`bg-white rounded-xl p-4.5 border transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-base hover:text-blue-700 cursor-pointer truncate" onClick={() => { onSelectDocument(doc.id); onClose(); }}>
                        {doc.title}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 rounded-md">
                          當前編輯中
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${
                          doc.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'submitted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {doc.status === 'approved' ? '已核准' : doc.status === 'submitted' ? '已簽署填妥' : '草稿'}
                      </span>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                      {doc.summary?.applicant1Name && (
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>申請人：<strong className="text-slate-700 font-medium">{doc.summary.applicant1Name}</strong> {doc.summary.applicant1Code ? `(${doc.summary.applicant1Code})` : ''}</span>
                        </div>
                      )}
                      {doc.summary?.activityType && (
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span>類型：{doc.summary.activityType}</span>
                        </div>
                      )}
                      {doc.summary?.eventDates && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>日期：{doc.summary.eventDates}</span>
                        </div>
                      )}
                      {doc.summary?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[200px]">{doc.summary.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>最後修改時間：{formatDate(doc.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onSelectDocument(doc.id);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition"
                    >
                      開啟編輯
                    </button>
                    <button
                      onClick={() => onDuplicate(doc.id)}
                      title="複製為新申請表"
                      className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-slate-200 transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(doc.id)}
                      title="刪除文件"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>共 {filteredDocs.length} 份線上儲存記錄</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition"
          >
            返回編輯器
          </button>
        </div>
      </div>
    </div>
  );
};
