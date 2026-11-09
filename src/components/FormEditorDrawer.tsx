import React from 'react';
import { ApplicationFormData, DocumentSignatures } from '../types/form';
import { 
  Users, 
  MapPin, 
  Calendar, 
  FileCheck2, 
  ShieldCheck, 
  HelpCircle, 
  Plus, 
  Trash2, 
  ChevronRight,
  Sparkles,
  Building2,
  FileSignature
} from 'lucide-react';

interface FormEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ApplicationFormData;
  signatures: DocumentSignatures;
  onChange: (field: keyof ApplicationFormData, value: any) => void;
  onOpenSignature: (slot: 'applicant1' | 'applicant2' | 'director1' | 'director2', title: string, defaultName?: string) => void;
}

export const FormEditorDrawer: React.FC<FormEditorDrawerProps> = ({
  isOpen,
  onClose,
  formData,
  signatures,
  onChange,
  onOpenSignature
}) => {
  if (!isOpen) return null;

  const getTodayFormatted = () => {
    const today = new Date();
    const d = today.getDate().toString().padStart(2, '0');
    const m = (today.getMonth() + 1).toString().padStart(2, '0');
    const y = today.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleAddAgentRow = () => {
    const next = [
      ...formData.agentsList,
      {
        id: `agent-${Date.now()}`,
        name: '',
        team: formData.team1 || '',
        code: '',
        license: '持有壽險及強積金牌照'
      }
    ];
    onChange('agentsList', next);
  };

  const handleRemoveAgentRow = (index: number) => {
    const next = [...formData.agentsList];
    next.splice(index, 1);
    onChange('agentsList', next);
  };

  return (
    <div className="w-96 shrink-0 bg-white border-l border-slate-200 shadow-xl flex flex-col h-[calc(100vh-64px)] z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            快速表單欄位助理
          </h3>
          <p className="text-[11px] text-slate-500">此處欄位與左側 PDF 畫布即時雙向連動</p>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200/60 rounded"
        >
          收起 ✕
        </button>
      </div>

      {/* Form Content */}
      <div className="p-4 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
        {/* Section 1: 申請人基本資料 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1.5 border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              申請人基本資料 (第 1 頁頂部)
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 space-y-2">
            <span className="font-semibold text-blue-900 text-[11px]">主要申請人 1</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-500">所屬區域團隊</label>
                <input
                  type="text"
                  value={formData.team1}
                  onChange={(e) => onChange('team1', e.target.value)}
                  placeholder="如: KLE-01"
                  className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500">英文全名</label>
                <input
                  type="text"
                  value={formData.name1}
                  onChange={(e) => onChange('name1', e.target.value.toUpperCase())}
                  placeholder="CHAN TAI MAN"
                  className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500">專屬代理編號</label>
                <input
                  type="text"
                  value={formData.agentNo1}
                  onChange={(e) => onChange('agentNo1', e.target.value)}
                  placeholder="BOC-98231"
                  className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500">聯絡電話號碼</label>
                <input
                  type="text"
                  value={formData.phone1}
                  onChange={(e) => onChange('phone1', e.target.value)}
                  placeholder="9123 4567"
                  className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
            </div>
          </div>

          {/* Applicant 2 */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 space-y-2">
            <span className="font-semibold text-slate-600 text-[11px]">聯合申請人 2 (跨區域合作適用)</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-500">所屬區域團隊</label>
                <input
                  type="text"
                  value={formData.team2}
                  onChange={(e) => onChange('team2', e.target.value)}
                  placeholder="如: HKI-02"
                  className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500">英文全名</label>
                <input
                  type="text"
                  value={formData.name2}
                  onChange={(e) => onChange('name2', e.target.value.toUpperCase())}
                  placeholder="WONG KA YAN"
                  className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500">專屬代理編號</label>
                <input
                  type="text"
                  value={formData.agentNo2}
                  onChange={(e) => onChange('agentNo2', e.target.value)}
                  placeholder="BOC-65432"
                  className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500">聯絡電話號碼</label>
                <input
                  type="text"
                  value={formData.phone2}
                  onChange={(e) => onChange('phone2', e.target.value)}
                  placeholder="9876 5432"
                  className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: 活動內容與日期 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1.5 border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              活動簡介與舉辦日期
            </span>
            <button
              type="button"
              onClick={() => onChange('eventDates', `${getTodayFormatted()} - ${getTodayFormatted()}`)}
              className="text-[10px] text-blue-600 hover:underline"
            >
              填入今日日期
            </button>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-medium">舉辦日期／廣告刊登日期</label>
            <input
              type="text"
              value={formData.eventDates}
              onChange={(e) => onChange('eventDates', e.target.value)}
              placeholder="15/12/2026 - 17/12/2026 (日/月/年)"
              className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-medium">團隊活動內容簡介</label>
            <textarea
              value={formData.activityDesc}
              onChange={(e) => onChange('activityDesc', e.target.value)}
              rows={3}
              placeholder="詳細說明活動目的、路展安排、諮詢櫃枱或產品講解..."
              className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
            />
          </div>
        </div>

        {/* Section 3: 場地與物料設定 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1.5 border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              舉辦場地與物料備註 (第 2 頁)
            </span>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-medium">領展商場地點名稱</label>
            <input
              type="text"
              value={formData.venueLinkLocation}
              onChange={(e) => {
                onChange('venueLinkLocation', e.target.value);
                if (!formData.venueGroup) onChange('venueGroup', 'link');
              }}
              placeholder="如: 黃大仙中心北館 1 樓中庭展銷場地"
              className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-medium">第 2 部份：宣傳活動或場地佈置資料</label>
            <textarea
              value={formData.section2Notes}
              onChange={(e) => onChange('section2Notes', e.target.value)}
              rows={3}
              placeholder="列明宣傳單張、物資清單、需借用之易拉架、桌布及文檔..."
              className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
            />
          </div>
        </div>

        {/* Section 4: 參與代理名單 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1.5 border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              專屬代理名單 (第 3 部份)
            </span>
            <button
              type="button"
              onClick={handleAddAgentRow}
              className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              新增代理
            </button>
          </div>

          <div className="space-y-2">
            {formData.agentsList.map((agent, idx) => (
              <div key={agent.id || idx} className="p-2 bg-slate-50 border border-slate-200 rounded space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[11px] text-slate-700">代理 #{idx + 1}</span>
                  {formData.agentsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAgentRow(idx)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={agent.name}
                    onChange={(e) => {
                      const next = [...formData.agentsList];
                      next[idx] = { ...agent, name: e.target.value.toUpperCase() };
                      onChange('agentsList', next);
                    }}
                    placeholder="英文全名"
                    className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px]"
                  />
                  <input
                    type="text"
                    value={agent.code}
                    onChange={(e) => {
                      const next = [...formData.agentsList];
                      next[idx] = { ...agent, code: e.target.value };
                      onChange('agentsList', next);
                    }}
                    placeholder="代理編號"
                    className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px]"
                  />
                  <input
                    type="text"
                    value={agent.team}
                    onChange={(e) => {
                      const next = [...formData.agentsList];
                      next[idx] = { ...agent, team: e.target.value };
                      onChange('agentsList', next);
                    }}
                    placeholder="區域團隊"
                    className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px]"
                  />
                  <input
                    type="text"
                    value={agent.license}
                    onChange={(e) => {
                      const next = [...formData.agentsList];
                      next[idx] = { ...agent, license: e.target.value };
                      onChange('agentsList', next);
                    }}
                    placeholder="牌照資格"
                    className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: 電子簽名及總監審核 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1.5 border-slate-200">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileSignature className="w-3.5 h-3.5 text-blue-600" />
              簽署與日期管理
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-medium text-slate-800 block text-[11px]">申請人 1 電子簽名</span>
                <span className="text-[10px] text-slate-400">
                  {signatures.applicant1 ? '已簽署 ✓' : '尚未簽署'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenSignature('applicant1', '申請人 1 簽署', formData.name1)}
                className="px-2.5 py-1 text-xs text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded"
              >
                {signatures.applicant1 ? '重新簽署' : '立即簽名'}
              </button>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-medium text-slate-800 block text-[11px]">區域總監 1 簽署</span>
                <span className="text-[10px] text-slate-400">
                  {signatures.director1 ? '已簽署 ✓' : '尚未簽署'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenSignature('director1', '區域總監 1 簽署', formData.director1Name)}
                className="px-2.5 py-1 text-xs text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded"
              >
                {signatures.director1 ? '重新簽署' : '立即簽名'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
