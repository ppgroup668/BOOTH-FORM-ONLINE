import { SavedDocumentMeta, SavedDocumentRecord, ApplicationFormData, DocumentSignatures } from '../types/form';

const LOCAL_STORAGE_KEY = 'boclife_pdf_documents_backup';

export async function fetchDocumentList(): Promise<SavedDocumentMeta[]> {
  try {
    const res = await fetch('/api/documents');
    if (res.ok) {
      const data = await res.json();
      if (data.documents) {
        // Update local backup
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.documents));
        } catch {
          // ignore storage quota error
        }
        return data.documents;
      }
    }
  } catch (err) {
    console.warn('Network fetch documents failed, falling back to local storage:', err);
  }

  // Fallback to local storage if offline
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // ignore
  }

  return [];
}

export async function fetchDocumentById(id: string): Promise<SavedDocumentRecord | null> {
  try {
    const res = await fetch(`/api/documents/${id}`);
    if (res.ok) {
      const data = await res.json();
      return data.document;
    }
  } catch (err) {
    console.warn('Network fetch document by ID failed:', err);
  }

  // Check localStorage full records cache
  try {
    const recordCache = localStorage.getItem(`boclife_doc_${id}`);
    if (recordCache) {
      return JSON.parse(recordCache);
    }
  } catch {
    // ignore
  }

  return null;
}

export async function saveDocumentOnline(
  id: string | null,
  title: string,
  formData: ApplicationFormData,
  signatures: DocumentSignatures,
  status: 'draft' | 'submitted' | 'approved' = 'draft'
): Promise<SavedDocumentRecord> {
  const payload = {
    id,
    title,
    formData,
    signatures,
    status
  };

  try {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      const saved = data.document;
      // Cache locally
      try {
        localStorage.setItem(`boclife_doc_${saved.id}`, JSON.stringify(saved));
      } catch {
        // ignore
      }
      return saved;
    }
  } catch (err) {
    console.warn('Server save failed, using local fallback:', err);
  }

  // Offline fallback
  const fallbackId = id || `doc-local-${Date.now()}`;
  const now = new Date().toISOString();
  const fallbackRecord: SavedDocumentRecord = {
    id: fallbackId,
    title,
    createdAt: now,
    updatedAt: now,
    status,
    formData,
    signatures,
    summary: {
      applicant1Name: formData.name1,
      applicant1Code: formData.agentNo1,
      applicant2Name: formData.name2,
      activityType: formData.activityTypes.join(', '),
      eventDates: formData.eventDates,
      location: formData.venueLinkLocation || formData.venueOtherLocation || formData.venueOfficeLocation
    }
  };

  try {
    localStorage.setItem(`boclife_doc_${fallbackId}`, JSON.stringify(fallbackRecord));
  } catch {
    // ignore
  }

  return fallbackRecord;
}

export async function deleteDocumentOnline(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    if (res.ok) {
      try {
        localStorage.removeItem(`boclife_doc_${id}`);
      } catch {
        // ignore
      }
      return true;
    }
  } catch (err) {
    console.warn('Server delete failed:', err);
  }
  return false;
}

export async function duplicateDocumentOnline(id: string): Promise<SavedDocumentRecord | null> {
  try {
    const res = await fetch(`/api/documents/${id}/duplicate`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      return data.document;
    }
  } catch (err) {
    console.warn('Server duplicate failed:', err);
  }
  return null;
}
