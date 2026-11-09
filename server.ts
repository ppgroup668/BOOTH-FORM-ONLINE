import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'documents.json');

app.use(express.json({ limit: '20mb' }));

// Ensure data folder and documents.json exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface SavedDocument {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'submitted' | 'approved';
  formData: Record<string, any>;
  signatures: {
    applicant1?: string;
    applicant2?: string;
    director1?: string;
    director2?: string;
  };
  summary?: {
    applicant1Name?: string;
    applicant1Code?: string;
    applicant2Name?: string;
    activityType?: string;
    eventDates?: string;
    location?: string;
  };
}

function getDocuments(): SavedDocument[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read documents.json:', err);
  }
  return [];
}

function saveDocuments(docs: SavedDocument[]): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(docs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save documents.json:', err);
  }
}

// Initial seed if empty
if (getDocuments().length === 0) {
  const initialSample: SavedDocument = {
    id: 'sample-doc-001',
    title: '【示範範本】中銀人壽領展路展活動申請',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
    summary: {
      applicant1Name: 'CHAN TAI MAN',
      applicant1Code: 'BOC-98231',
      applicant2Name: '',
      activityType: '路展/展銷 (領展)',
      eventDates: '15/12/2026 - 17/12/2026',
      location: '黃大仙中心北館 1 樓中庭展銷場地'
    },
    formData: {
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
        { name: 'CHAN TAI MAN', team: 'KLE-01', code: 'BOC-98231', license: '持有壽險、一般保險及強積金牌照' },
        { name: 'WONG SIU FUNG', team: 'KLE-01', code: 'BOC-87654', license: '持有壽險及強積金牌照' },
        { name: 'LEUNG KA YAN', team: 'KLE-01', code: 'BOC-76543', license: '持有壽險牌照' }
      ],
      applicant1SignDate: '09/11/2026',
      applicant2SignDate: '',
      director1Name: 'CHEUNG CHUN KIT',
      director1SignDate: '09/11/2026',
      director2Name: '',
      director2SignDate: ''
    },
    signatures: {
      applicant1: '',
      applicant2: '',
      director1: '',
      director2: ''
    }
  };
  saveDocuments([initialSample]);
}

// REST API Endpoints
app.get('/api/documents', (req: Request, res: Response) => {
  const docs = getDocuments();
  const summaryList = docs.map(doc => ({
    id: doc.id,
    title: doc.title,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    status: doc.status,
    summary: doc.summary || {
      applicant1Name: doc.formData?.name1 || '',
      applicant1Code: doc.formData?.agentNo1 || '',
      applicant2Name: doc.formData?.name2 || '',
      activityType: Array.isArray(doc.formData?.activityTypes) ? doc.formData.activityTypes[0] : '',
      eventDates: doc.formData?.eventDates || '',
      location: doc.formData?.venueLinkLocation || doc.formData?.venueOtherLocation || ''
    }
  }));
  res.json({ success: true, documents: summaryList });
});

app.get('/api/documents/:id', (req: Request, res: Response) => {
  const docs = getDocuments();
  const doc = docs.find(d => d.id === req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: '找不到此申請文件' });
  }
  res.json({ success: true, document: doc });
});

app.post('/api/documents', (req: Request, res: Response) => {
  const { id, title, formData, signatures, status } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: '文件標題不能為空' });
  }

  const docs = getDocuments();
  const docId = id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const summary = {
    applicant1Name: formData?.name1 || '',
    applicant1Code: formData?.agentNo1 || '',
    applicant2Name: formData?.name2 || '',
    activityType: Array.isArray(formData?.activityTypes) ? formData.activityTypes.join(', ') : '',
    eventDates: formData?.eventDates || '',
    location: formData?.venueLinkLocation || formData?.venueOtherLocation || formData?.venueOfficeLocation || ''
  };

  const existingIndex = docs.findIndex(d => d.id === docId);
  const updatedDoc: SavedDocument = {
    id: docId,
    title,
    createdAt: existingIndex >= 0 ? docs[existingIndex].createdAt : now,
    updatedAt: now,
    status: status || (existingIndex >= 0 ? docs[existingIndex].status : 'draft'),
    formData: formData || {},
    signatures: signatures || {},
    summary
  };

  if (existingIndex >= 0) {
    docs[existingIndex] = updatedDoc;
  } else {
    docs.unshift(updatedDoc);
  }

  saveDocuments(docs);
  res.json({ success: true, document: updatedDoc });
});

app.delete('/api/documents/:id', (req: Request, res: Response) => {
  let docs = getDocuments();
  const filtered = docs.filter(d => d.id !== req.params.id);
  if (filtered.length === docs.length) {
    return res.status(404).json({ success: false, message: '找不到欲刪除的文件' });
  }
  saveDocuments(filtered);
  res.json({ success: true, message: '文件已成功刪除' });
});

app.post('/api/documents/:id/duplicate', (req: Request, res: Response) => {
  const docs = getDocuments();
  const source = docs.find(d => d.id === req.params.id);
  if (!source) {
    return res.status(404).json({ success: false, message: '找不到來源文件' });
  }

  const newId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const duplicateDoc: SavedDocument = {
    ...JSON.parse(JSON.stringify(source)),
    id: newId,
    title: `${source.title} (副本)`,
    createdAt: now,
    updatedAt: now,
    status: 'draft',
    // signatures can be kept or cleared as preference; we keep or clear signature
    signatures: { applicant1: '', applicant2: '', director1: '', director2: '' }
  };

  docs.unshift(duplicateDoc);
  saveDocuments(docs);
  res.json({ success: true, document: duplicateDoc });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (dev mode: ${isDev})`);
  });
}

startServer();
