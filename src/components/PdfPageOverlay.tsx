import React from 'react';
import { ApplicationFormData, DocumentSignatures } from '../types/form';
import { PenLine, Trash2 } from 'lucide-react';

interface PdfPageOverlayProps {
  pageNumber: 1 | 2;
  formData: ApplicationFormData;
  signatures: DocumentSignatures;
  onChange: (field: keyof ApplicationFormData, value: any) => void;
  onOpenSignature: (slot: 'applicant1' | 'applicant2' | 'director1' | 'director2', title: string, defaultName?: string) => void;
  onClearSignature: (slot: 'applicant1' | 'applicant2' | 'director1' | 'director2') => void;
  highlightFields: boolean;
}

export const PdfPageOverlay: React.FC<PdfPageOverlayProps> = ({
  pageNumber,
  formData,
  signatures,
  onChange,
  onOpenSignature,
  onClearSignature,
  highlightFields
}) => {
  // Helper to toggle array item
  const toggleArrayItem = (field: 'activityTypes' | 'purposes' | 'insuranceCategories' | 'venueOfficeRooms', item: string) => {
    const list = [...formData[field]];
    const idx = list.indexOf(item);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(item);
    }
    onChange(field, list);
  };

  const isChecked = (field: 'activityTypes' | 'purposes' | 'insuranceCategories' | 'venueOfficeRooms', item: string) => {
    return formData[field]?.includes(item);
  };

  // Base input class
  const inputBaseClass = `absolute bg-transparent text-slate-900 font-sans text-[11px] sm:text-[12px] leading-none px-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600 transition ${
    highlightFields ? 'bg-blue-50/40 hover:bg-blue-50/70 border border-blue-300/50' : 'hover:bg-slate-100/40'
  }`;

  // Checkbox button renderer with exact dimensions
  const renderCheckbox = (
    checked: boolean,
    onClick: () => void,
    coords: { left: string; top: string; width?: string; height?: string },
    label?: string
  ) => {
    return (
      <button
        type="button"
        onClick={onClick}
        title={label || '點擊勾選'}
        style={{
          left: coords.left,
          top: coords.top,
          width: coords.width || '1.7%',
          height: coords.height || '1.2%'
        }}
        className={`absolute z-10 flex items-center justify-center cursor-pointer transition rounded-2xs ${
          highlightFields ? 'ring-1 ring-blue-400/80 bg-blue-100/40' : ''
        } hover:bg-blue-200/60 print:bg-transparent print:ring-0`}
      >
        {checked && (
          <span className="text-blue-900 font-extrabold text-[12px] sm:text-[14px] select-none leading-none -mt-0.5 print:text-black">
            ✓
          </span>
        )}
      </button>
    );
  };

  // ================= PAGE 1 =================
  if (pageNumber === 1) {
    return (
      <div className="absolute inset-0 pointer-events-auto select-none print:select-auto">
        {/* ================= HEADER APPLICANT INFO TABLE ================= */}
        {/* Row 1: 所屬區域團隊 (Top: 22.84% -> 24.86%) */}
        <input
          type="text"
          value={formData.team1}
          onChange={(e) => onChange('team1', e.target.value)}
          placeholder="所屬區域團隊"
          style={{ left: '22.8%', top: '22.9%', width: '34.8%', height: '1.9%' }}
          className={inputBaseClass}
        />
        <input
          type="text"
          value={formData.team2}
          onChange={(e) => onChange('team2', e.target.value)}
          placeholder="跨區域申請人2團隊 (如有)"
          style={{ left: '57.8%', top: '22.9%', width: '34.9%', height: '1.9%' }}
          className={inputBaseClass}
        />

        {/* Row 2: 英文全名 (Top: 24.86% -> 26.87%) */}
        <input
          type="text"
          value={formData.name1}
          onChange={(e) => onChange('name1', e.target.value.toUpperCase())}
          placeholder="CHAN TAI MAN"
          style={{ left: '22.8%', top: '24.9%', width: '34.8%', height: '1.9%' }}
          className={inputBaseClass}
        />
        <input
          type="text"
          value={formData.name2}
          onChange={(e) => onChange('name2', e.target.value.toUpperCase())}
          placeholder="WONG KA YAN"
          style={{ left: '57.8%', top: '24.9%', width: '34.9%', height: '1.9%' }}
          className={inputBaseClass}
        />

        {/* Row 3: 專屬代理編號 (Top: 26.87% -> 28.89%) */}
        <input
          type="text"
          value={formData.agentNo1}
          onChange={(e) => onChange('agentNo1', e.target.value)}
          placeholder="BOC-12345"
          style={{ left: '22.8%', top: '26.9%', width: '34.8%', height: '1.9%' }}
          className={inputBaseClass}
        />
        <input
          type="text"
          value={formData.agentNo2}
          onChange={(e) => onChange('agentNo2', e.target.value)}
          placeholder="BOC-67890"
          style={{ left: '57.8%', top: '26.9%', width: '34.9%', height: '1.9%' }}
          className={inputBaseClass}
        />

        {/* Row 4: 聯絡電話號碼 (Top: 28.89% -> 30.86%) */}
        <input
          type="text"
          value={formData.phone1}
          onChange={(e) => onChange('phone1', e.target.value)}
          placeholder="9123 4567"
          style={{ left: '22.8%', top: '28.9%', width: '34.8%', height: '1.9%' }}
          className={inputBaseClass}
        />
        <input
          type="text"
          value={formData.phone2}
          onChange={(e) => onChange('phone2', e.target.value)}
          placeholder="9876 5432"
          style={{ left: '57.8%', top: '28.9%', width: '34.9%', height: '1.9%' }}
          className={inputBaseClass}
        />

        {/* ================= 1. 擬舉辦的團隊活動的基本資料 ================= */}
        {/* 團隊活動類型 Line 1 */}
        {renderCheckbox(isChecked('activityTypes', 'roadshow_link'), () => toggleArrayItem('activityTypes', 'roadshow_link'), { left: '23.49%', top: '33.40%' }, '路展/展銷 (領展)')}
        {renderCheckbox(isChecked('activityTypes', 'roadshow_non_link'), () => toggleArrayItem('activityTypes', 'roadshow_non_link'), { left: '39.25%', top: '33.40%' }, '路展/展銷 (非領展)')}
        {renderCheckbox(isChecked('activityTypes', 'workshop'), () => toggleArrayItem('activityTypes', 'workshop'), { left: '63.59%', top: '33.40%' }, '客戶講座/工作坊')}
        {renderCheckbox(isChecked('activityTypes', 'online_ad'), () => toggleArrayItem('activityTypes', 'online_ad'), { left: '79.13%', top: '33.40%' }, '線上廣告')}

        {/* 團隊活動類型 Line 2 */}
        {renderCheckbox(isChecked('activityTypes', 'physical_ad'), () => toggleArrayItem('activityTypes', 'physical_ad'), { left: '23.49%', top: '35.05%' }, '實體廣告')}
        {renderCheckbox(isChecked('activityTypes', 'promotion'), () => toggleArrayItem('activityTypes', 'promotion'), { left: '39.17%', top: '35.05%' }, '客戶優惠/推廣')}
        {renderCheckbox(isChecked('activityTypes', 'other'), () => toggleArrayItem('activityTypes', 'other'), { left: '63.27%', top: '35.05%' }, '其他活動類型')}
        <input
          type="text"
          value={formData.activityOtherText}
          onChange={(e) => onChange('activityOtherText', e.target.value)}
          placeholder="請註明其他活動類型"
          style={{ left: '73.5%', top: '35.0%', width: '18.8%', height: '1.4%' }}
          className={inputBaseClass}
        />

        {/* ================= 團隊活動目的 ================= */}
        {renderCheckbox(isChecked('purposes', 'relationship'), () => toggleArrayItem('purposes', 'relationship'), { left: '23.49%', top: '36.80%' }, '客戶關係建立')}
        {renderCheckbox(isChecked('purposes', 'insurance_promo'), () => toggleArrayItem('purposes', 'insurance_promo'), { left: '38.41%', top: '36.80%' }, '保險產品推廣')}
        {renderCheckbox(isChecked('purposes', 'mpf_promo'), () => toggleArrayItem('purposes', 'mpf_promo'), { left: '54.01%', top: '36.80%' }, '強積金產品推廣')}
        {renderCheckbox(isChecked('purposes', 'reverse_mortgage'), () => toggleArrayItem('purposes', 'reverse_mortgage'), { left: '69.65%', top: '36.80%' }, '保單逆按 / 安老按揭')}

        {/* Purpose Other */}
        {renderCheckbox(isChecked('purposes', 'other'), () => toggleArrayItem('purposes', 'other'), { left: '23.49%', top: '38.45%' }, '其他活動目的')}
        <input
          type="text"
          value={formData.purposeOtherText}
          onChange={(e) => onChange('purposeOtherText', e.target.value)}
          placeholder="請註明其他活動目的"
          style={{ left: '33.8%', top: '38.3%', width: '58.5%', height: '1.4%' }}
          className={inputBaseClass}
        />

        {/* *如屬保險產品推廣 */}
        {renderCheckbox(isChecked('insuranceCategories', 'boclife_non_ilp'), () => toggleArrayItem('insuranceCategories', 'boclife_non_ilp'), { left: '23.49%', top: '41.85%' }, '中銀人壽保險產品')}
        {renderCheckbox(isChecked('insuranceCategories', 'bupa_gi'), () => toggleArrayItem('insuranceCategories', 'bupa_gi'), { left: '59.07%', top: '41.85%' }, '保柏(亞洲)一般保險')}
        {renderCheckbox(isChecked('insuranceCategories', 'bocg_gi'), () => toggleArrayItem('insuranceCategories', 'bocg_gi'), { left: '23.49%', top: '43.55%' }, '中銀集團保險一般保險')}
        {renderCheckbox(isChecked('insuranceCategories', 'annuity'), () => toggleArrayItem('insuranceCategories', 'annuity'), { left: '59.07%', top: '43.55%' }, '香港年金計劃')}

        {/* ================= 團隊活動內容簡介 (Top: 46.77% -> 49.22%) ================= */}
        <textarea
          value={formData.activityDesc}
          onChange={(e) => onChange('activityDesc', e.target.value)}
          placeholder="請填寫團隊活動內容簡介、目的、舉辦形式及預計接觸客戶群體..."
          style={{ left: '22.7%', top: '46.8%', width: '69.7%', height: '2.3%' }}
          className={`${inputBaseClass} resize-none py-0.5 text-[10px] sm:text-[11px] leading-tight`}
        />

        {/* ================= 舉辦日期/廣告刊登日期 (Top: 49.28% -> 52.60%) ================= */}
        <input
          type="text"
          value={formData.eventDates}
          onChange={(e) => onChange('eventDates', e.target.value)}
          placeholder="例如: 15/12/2026 - 17/12/2026 (日/月/年)"
          style={{ left: '22.7%', top: '49.4%', width: '69.7%', height: '3.0%' }}
          className={inputBaseClass}
        />

        {/* ================= 自製問卷/表格 (Top: 52.67% -> 55.99%) ================= */}
        {renderCheckbox(formData.customQuestionnaire === 'yes', () => onChange('customQuestionnaire', 'yes'), { left: '23.49%', top: '52.70%' }, '會 (自製問卷)')}
        {renderCheckbox(formData.customQuestionnaire === 'no', () => onChange('customQuestionnaire', 'no'), { left: '68.79%', top: '52.70%' }, '不會 (自製問卷)')}

        {/* ================= 自製宣傳/銷售物料 (Top: 56.05% -> 59.39%) ================= */}
        {renderCheckbox(formData.customPromoMaterial === 'yes', () => onChange('customPromoMaterial', 'yes'), { left: '23.49%', top: '56.10%' }, '會 (自製宣傳物料)')}
        {renderCheckbox(formData.customPromoMaterial === 'no', () => onChange('customPromoMaterial', 'no'), { left: '68.79%', top: '56.10%' }, '不會 (自製宣傳物料)')}

        {/* ================= 會否向客戶贈送禮品 (Top: 59.44% -> 62.76%) ================= */}
        {renderCheckbox(formData.giveawayGifts === 'yes', () => onChange('giveawayGifts', 'yes'), { left: '23.49%', top: '59.50%' }, '會 (贈送禮品)')}
        {renderCheckbox(formData.giveawayGifts === 'no', () => onChange('giveawayGifts', 'no'), { left: '68.79%', top: '59.50%' }, '不會 (贈送禮品)')}

        {/* ================= 舉辦地點／廣告刊登位置 (Top: 62.82% -> 92.21%) ================= */}
        {/* Group A: 屬「領展」管轄的場地 */}
        {renderCheckbox(formData.venueGroup === 'link', () => onChange('venueGroup', formData.venueGroup === 'link' ? '' : 'link'), { left: '23.49%', top: '64.60%' }, '屬「領展」管轄的場地')}
        <input
          type="text"
          value={formData.venueLinkLocation}
          onChange={(e) => {
            onChange('venueLinkLocation', e.target.value);
            if (!formData.venueGroup) onChange('venueGroup', 'link');
          }}
          placeholder="填寫領展商場地點名稱 (如: 黃大仙中心北館 1 樓中庭)"
          style={{ left: '45.0%', top: '64.60%', width: '47.0%', height: '1.5%' }}
          className={inputBaseClass}
        />
        {renderCheckbox(formData.venueLinkType === 'truck', () => onChange('venueLinkType', 'truck'), { left: '54.33%', top: '66.30%' }, '展銷車')}
        {renderCheckbox(formData.venueLinkType === 'booth_venue', () => onChange('venueLinkType', 'booth_venue'), { left: '68.51%', top: '66.30%' }, '展銷場地')}

        {/* Group B: 其他路展/展銷/客戶講座/工作坊之活動場地 */}
        {renderCheckbox(formData.venueGroup === 'other', () => onChange('venueGroup', formData.venueGroup === 'other' ? '' : 'other'), { left: '23.49%', top: '68.05%' }, '其他路展/客戶講座場地')}
        <input
          type="text"
          value={formData.venueOtherLocation}
          onChange={(e) => {
            onChange('venueOtherLocation', e.target.value);
            if (!formData.venueGroup) onChange('venueGroup', 'other');
          }}
          placeholder="填寫其他活動地點 (如: 灣仔告士打道會議中心)"
          style={{ left: '45.0%', top: '68.05%', width: '47.0%', height: '1.5%' }}
          className={inputBaseClass}
        />
        {renderCheckbox(formData.venueOtherType === 'clubhouse', () => onChange('venueOtherType', 'clubhouse'), { left: '54.33%', top: '69.75%' }, '屋苑私人會所')}
        {renderCheckbox(formData.venueOtherType === 'non_link', () => onChange('venueOtherType', 'non_link'), { left: '68.51%', top: '69.75%' }, '「非領展」管轄場地')}
        {renderCheckbox(formData.venueOtherType === 'gov', () => onChange('venueOtherType', 'gov'), { left: '54.33%', top: '71.45%' }, '政府機構')}
        {renderCheckbox(formData.venueOtherType === 'hospital', () => onChange('venueOtherType', 'hospital'), { left: '68.51%', top: '71.45%' }, '醫院')}
        {renderCheckbox(formData.venueOtherType === 'exhibition', () => onChange('venueOtherType', 'exhibition'), { left: '81.15%', top: '71.45%' }, '展覽會')}
        {renderCheckbox(formData.venueOtherType === 'other', () => onChange('venueOtherType', 'other'), { left: '54.33%', top: '73.10%' }, '其他場地類型')}
        <input
          type="text"
          value={formData.venueOtherCustomText}
          onChange={(e) => onChange('venueOtherCustomText', e.target.value)}
          placeholder="請註明其他場地類型"
          style={{ left: '64.5%', top: '73.0%', width: '27.5%', height: '1.4%' }}
          className={inputBaseClass}
        />

        {/* Group C: 使用專屬代理辦公室 */}
        {renderCheckbox(formData.venueGroup === 'office', () => onChange('venueGroup', formData.venueGroup === 'office' ? '' : 'office'), { left: '23.49%', top: '74.80%' }, '使用專屬代理辦公室')}
        {renderCheckbox(formData.venueOfficeLocation === 'gateway', () => onChange('venueOfficeLocation', 'gateway'), { left: '54.33%', top: '74.80%' }, '港威大廈第 5 座 11 樓')}
        
        {/* Gateway Rooms (Top: 76.45%) */}
        {['A2', 'A3', 'A4'].map((room, i) => (
          renderCheckbox(
            isChecked('venueOfficeRooms', room),
            () => toggleArrayItem('venueOfficeRooms', room),
            { left: `${54.33 + i * 3.61}%`, top: '76.45%' },
            room
          )
        ))}
        {['T1', 'T2', 'T3', 'T4', 'T5'].map((room, i) => (
          renderCheckbox(
            isChecked('venueOfficeRooms', room),
            () => toggleArrayItem('venueOfficeRooms', room),
            { left: `${67.05 + i * 3.41}%`, top: '76.45%' },
            room
          )
        ))}

        {renderCheckbox(formData.venueOfficeLocation === 'wharf_1101', () => onChange('venueOfficeLocation', 'wharf_1101'), { left: '54.33%', top: '78.15%' }, '九倉電訊中心 1101-1107室')}
        {renderCheckbox(formData.venueOfficeLocation === 'wharf_1115', () => onChange('venueOfficeLocation', 'wharf_1115'), { left: '54.33%', top: '79.80%' }, '九倉電訊中心 1115-1116室')}

        {/* Office AC confirmation */}
        {renderCheckbox(formData.venueOfficeAc === 'needed', () => onChange('venueOfficeAc', 'needed'), { left: '38.91%', top: '83.20%' }, '需要額外提供冷氣')}
        {renderCheckbox(formData.venueOfficeAc === 'not_needed', () => onChange('venueOfficeAc', 'not_needed'), { left: '38.91%', top: '84.85%' }, '不需要額外冷氣')}
        {renderCheckbox(formData.venueOfficeAc === 'office_hours', () => onChange('venueOfficeAc', 'office_hours'), { left: '38.91%', top: '86.50%' }, '活動於辦公時間進行')}

        {/* Group D: 廣告刊登 */}
        {renderCheckbox(formData.venueGroup === 'ad', () => onChange('venueGroup', formData.venueGroup === 'ad' ? '' : 'ad'), { left: '23.49%', top: '88.25%' }, '廣告刊登')}
        {renderCheckbox(formData.adMediumType === 'online', () => onChange('adMediumType', 'online'), { left: '54.33%', top: '88.25%' }, '線上廣告')}
        {renderCheckbox(formData.adMediumType === 'physical', () => onChange('adMediumType', 'physical'), { left: '66.23%', top: '88.25%' }, '實體廣告')}
        <input
          type="text"
          value={formData.adLocationAgency}
          onChange={(e) => onChange('adLocationAgency', e.target.value)}
          placeholder="填寫刊登位置及機構 (如: Facebook專頁推廣 / 地鐵燈箱廣告)"
          style={{ left: '48.0%', top: '90.2%', width: '44.0%', height: '1.8%' }}
          className={inputBaseClass}
        />
      </div>
    );
  }

  // ================= PAGE 2 =================
  return (
    <div className="absolute inset-0 pointer-events-auto select-none print:select-auto">
      {/* 2. 廣告、宣傳活動或場地佈置資料 (Top: 7.06% -> 23.01%) */}
      <textarea
        value={formData.section2Notes}
        onChange={(e) => onChange('section2Notes', e.target.value)}
        placeholder="請詳細列明：1. 宣傳單張及場地物料說明  2. 需借用之官方保險/強積金路展物資清單  3. 廣告草稿附帶說明..."
        style={{ left: '7.5%', top: '15.5%', width: '85.0%', height: '7.3%' }}
        className={`${inputBaseClass} resize-none p-2 text-[11px] sm:text-[12px] leading-relaxed`}
      />

      {/* 3. 參與此團隊活動之專屬代理名單 (Top: 23.74% -> 39.16%) */}
      <div
        style={{ left: '7.5%', top: '32.2%', width: '85.0%', height: '6.8%' }}
        className={`absolute rounded-xs overflow-hidden flex flex-col justify-between ${
          highlightFields ? 'bg-blue-50/30 border border-blue-300/40' : ''
        }`}
      >
        <div className="grid grid-cols-12 gap-1 text-[11px] font-sans h-full items-center px-1">
          {formData.agentsList.slice(0, 3).map((agent, index) => (
            <React.Fragment key={agent.id || index}>
              <div className="col-span-3">
                <input
                  type="text"
                  value={agent.name}
                  onChange={(e) => {
                    const next = [...formData.agentsList];
                    next[index] = { ...agent, name: e.target.value.toUpperCase() };
                    onChange('agentsList', next);
                  }}
                  placeholder={`代理 ${index + 1} 英文全名`}
                  className="w-full bg-transparent px-1 py-0.5 text-[11px] border-b border-slate-300/60 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={agent.team}
                  onChange={(e) => {
                    const next = [...formData.agentsList];
                    next[index] = { ...agent, team: e.target.value };
                    onChange('agentsList', next);
                  }}
                  placeholder="所屬區域團隊"
                  className="w-full bg-transparent px-1 py-0.5 text-[11px] border-b border-slate-300/60 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={agent.code}
                  onChange={(e) => {
                    const next = [...formData.agentsList];
                    next[index] = { ...agent, code: e.target.value };
                    onChange('agentsList', next);
                  }}
                  placeholder="代理編號"
                  className="w-full bg-transparent px-1 py-0.5 text-[11px] border-b border-slate-300/60 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  value={agent.license}
                  onChange={(e) => {
                    const next = [...formData.agentsList];
                    next[index] = { ...agent, license: e.target.value };
                    onChange('agentsList', next);
                  }}
                  placeholder="持有保險/強積金牌照及委任資格"
                  className="w-full bg-transparent px-1 py-0.5 text-[11px] border-b border-slate-300/60 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ================= 申請人聲明及簽署 ================= */}
      {/* 申請人 1 簽署框 (Left: 23.85% -> 48.89%, Top: 58.76% -> 61.84%) */}
      <div
        style={{ left: '23.85%', top: '58.8%', width: '25.0%', height: '2.95%' }}
        className={`absolute flex items-center justify-center p-0.5 group cursor-pointer ${
          highlightFields ? 'bg-blue-50/40 border border-blue-300/50' : 'hover:bg-slate-100/40'
        }`}
        onClick={() => onOpenSignature('applicant1', '申請人 1 電子簽署', formData.name1)}
      >
        {signatures.applicant1 ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={signatures.applicant1}
              alt="申請人1簽名"
              className="max-h-full max-w-full object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClearSignature('applicant1');
              }}
              title="清除簽名"
              className="absolute top-0 right-0 p-0.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-sm opacity-0 group-hover:opacity-100 transition print:hidden"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center gap-1 text-[11px] text-blue-700 font-medium print:hidden">
            <PenLine className="w-3 h-3" />
            <span>點擊簽署</span>
          </div>
        )}
      </div>

      {/* 申請人 1 簽署日期 (Left: 72.68% -> 92.80%, Top: 58.76% -> 61.84%) */}
      <input
        type="text"
        value={formData.applicant1SignDate}
        onChange={(e) => onChange('applicant1SignDate', e.target.value)}
        placeholder="日／月／年"
        style={{ left: '72.68%', top: '58.8%', width: '20.0%', height: '2.95%' }}
        className={inputBaseClass}
      />

      {/* 申請人 2 簽署框 (Left: 23.85% -> 48.89%, Top: 64.92% -> 67.61%) */}
      <div
        style={{ left: '23.85%', top: '64.95%', width: '25.0%', height: '2.65%' }}
        className={`absolute flex items-center justify-center p-0.5 group cursor-pointer ${
          highlightFields ? 'bg-blue-50/40 border border-blue-300/50' : 'hover:bg-slate-100/40'
        }`}
        onClick={() => onOpenSignature('applicant2', '申請人 2 電子簽署 (跨區域合作)', formData.name2)}
      >
        {signatures.applicant2 ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={signatures.applicant2}
              alt="申請人2簽名"
              className="max-h-full max-w-full object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClearSignature('applicant2');
              }}
              title="清除簽名"
              className="absolute top-0 right-0 p-0.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-sm opacity-0 group-hover:opacity-100 transition print:hidden"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center gap-1 text-[11px] text-slate-500 font-medium print:hidden">
            <PenLine className="w-3 h-3" />
            <span>點擊簽署 (如有)</span>
          </div>
        )}
      </div>

      {/* 申請人 2 簽署日期 (Left: 72.68% -> 92.80%, Top: 64.92% -> 67.61%) */}
      <input
        type="text"
        value={formData.applicant2SignDate}
        onChange={(e) => onChange('applicant2SignDate', e.target.value)}
        placeholder="日／月／年"
        style={{ left: '72.68%', top: '64.95%', width: '20.0%', height: '2.65%' }}
        className={inputBaseClass}
      />

      {/* ================= 區域總監聲明及簽署 ================= */}
      {/* 申請人 1 之區域總監姓名 (Left: 29.84% -> 49.98%, Top: 75.25% -> 78.20%) */}
      <input
        type="text"
        value={formData.director1Name}
        onChange={(e) => onChange('director1Name', e.target.value)}
        placeholder="總監姓名"
        style={{ left: '29.84%', top: '75.28%', width: '20.1%', height: '2.9%' }}
        className={inputBaseClass}
      />

      {/* 申請人 2 之區域總監姓名 (Left: 72.70% -> 92.80%, Top: 75.25% -> 78.20%) */}
      <input
        type="text"
        value={formData.director2Name}
        onChange={(e) => onChange('director2Name', e.target.value)}
        placeholder="跨區總監姓名 (如有)"
        style={{ left: '72.70%', top: '75.28%', width: '20.0%', height: '2.9%' }}
        className={inputBaseClass}
      />

      {/* 申請人 1 之區域總監簽署 (Left: 29.84% -> 49.98%, Top: 78.26% -> 81.23%) */}
      <div
        style={{ left: '29.84%', top: '78.30%', width: '20.1%', height: '2.9%' }}
        className={`absolute flex items-center justify-center p-0.5 group cursor-pointer ${
          highlightFields ? 'bg-blue-50/40 border border-blue-300/50' : 'hover:bg-slate-100/40'
        }`}
        onClick={() => onOpenSignature('director1', '區域總監 1 電子簽署', formData.director1Name)}
      >
        {signatures.director1 ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={signatures.director1}
              alt="區域總監1簽名"
              className="max-h-full max-w-full object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClearSignature('director1');
              }}
              title="清除簽名"
              className="absolute top-0 right-0 p-0.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-sm opacity-0 group-hover:opacity-100 transition print:hidden"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center gap-1 text-[11px] text-blue-700 font-medium print:hidden">
            <PenLine className="w-3 h-3" />
            <span>點擊簽署</span>
          </div>
        )}
      </div>

      {/* 申請人 2 之區域總監簽署 (Left: 72.70% -> 92.80%, Top: 78.26% -> 81.23%) */}
      <div
        style={{ left: '72.70%', top: '78.30%', width: '20.0%', height: '2.9%' }}
        className={`absolute flex items-center justify-center p-0.5 group cursor-pointer ${
          highlightFields ? 'bg-blue-50/40 border border-blue-300/50' : 'hover:bg-slate-100/40'
        }`}
        onClick={() => onOpenSignature('director2', '區域總監 2 電子簽署 (跨區域)', formData.director2Name)}
      >
        {signatures.director2 ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={signatures.director2}
              alt="區域總監2簽名"
              className="max-h-full max-w-full object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClearSignature('director2');
              }}
              title="清除簽名"
              className="absolute top-0 right-0 p-0.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-sm opacity-0 group-hover:opacity-100 transition print:hidden"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center gap-1 text-[11px] text-slate-500 font-medium print:hidden">
            <PenLine className="w-3 h-3" />
            <span>點擊簽署 (如有)</span>
          </div>
        )}
      </div>

      {/* 區域總監 1 簽署日期 (Left: 29.84% -> 49.98%, Top: 81.28% -> 84.36%) */}
      <input
        type="text"
        value={formData.director1SignDate}
        onChange={(e) => onChange('director1SignDate', e.target.value)}
        placeholder="日／月／年"
        style={{ left: '29.84%', top: '81.30%', width: '20.1%', height: '3.0%' }}
        className={inputBaseClass}
      />

      {/* 區域總監 2 簽署日期 (Left: 72.70% -> 92.80%, Top: 81.28% -> 84.36%) */}
      <input
        type="text"
        value={formData.director2SignDate}
        onChange={(e) => onChange('director2SignDate', e.target.value)}
        placeholder="日／月／年"
        style={{ left: '72.70%', top: '81.30%', width: '20.0%', height: '3.0%' }}
        className={inputBaseClass}
      />
    </div>
  );
};
