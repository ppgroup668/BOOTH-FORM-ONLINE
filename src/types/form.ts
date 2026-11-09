export interface AgentItem {
  id: string;
  name: string;
  team: string;
  code: string;
  license: string;
}

export interface ApplicationFormData {
  // Page 1: Applicants Info
  team1: string;
  name1: string;
  agentNo1: string;
  phone1: string;

  team2: string;
  name2: string;
  agentNo2: string;
  phone2: string;

  // 1. 活動基本資料
  activityTypes: string[]; // 'roadshow_link' | 'roadshow_non_link' | 'workshop' | 'online_ad' | 'physical_ad' | 'promotion' | 'other'
  activityOtherText: string;

  purposes: string[]; // 'relationship' | 'insurance_promo' | 'mpf_promo' | 'reverse_mortgage' | 'other'
  purposeOtherText: string;

  insuranceCategories: string[]; // 'boclife_non_ilp' | 'bupa_gi' | 'bocg_gi' | 'annuity'

  activityDesc: string;
  eventDates: string;

  customQuestionnaire: 'yes' | 'no' | '';
  customPromoMaterial: 'yes' | 'no' | '';
  giveawayGifts: 'yes' | 'no' | '';

  // Venue Groups: 'link' | 'other' | 'office' | 'ad'
  venueGroup: string;

  // Link venue
  venueLinkLocation: string;
  venueLinkType: string; // 'truck' | 'booth_venue'

  // Other venue
  venueOtherLocation: string;
  venueOtherType: string; // 'clubhouse' | 'non_link' | 'gov' | 'hospital' | 'exhibition' | 'other'
  venueOtherCustomText: string;

  // Office venue
  venueOfficeLocation: string; // 'gateway' | 'wharf_1101' | 'wharf_1115'
  venueOfficeRooms: string[]; // 'A2', 'A3', 'A4', 'T1', 'T2', 'T3', 'T4', 'T5'
  venueOfficeAc: string; // 'needed' | 'not_needed' | 'office_hours'

  // Ad
  adMediumType: string; // 'online' | 'physical'
  adLocationAgency: string;

  // Page 2:
  section2Notes: string;
  agentsList: AgentItem[];

  // Applicant 1 & 2 Signatures & Dates
  applicant1SignDate: string;
  applicant2SignDate: string;

  // District Directors
  director1Name: string;
  director1SignDate: string;
  director2Name: string;
  director2SignDate: string;
}

export interface DocumentSignatures {
  applicant1?: string;
  applicant2?: string;
  director1?: string;
  director2?: string;
}

export interface SavedDocumentMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'submitted' | 'approved';
  summary?: {
    applicant1Name?: string;
    applicant1Code?: string;
    applicant2Name?: string;
    activityType?: string;
    eventDates?: string;
    location?: string;
  };
}

export interface SavedDocumentRecord extends SavedDocumentMeta {
  formData: ApplicationFormData;
  signatures: DocumentSignatures;
}

export const DEFAULT_FORM_DATA: ApplicationFormData = {
  team1: '',
  name1: '',
  agentNo1: '',
  phone1: '',

  team2: '',
  name2: '',
  agentNo2: '',
  phone2: '',

  activityTypes: [],
  activityOtherText: '',

  purposes: [],
  purposeOtherText: '',

  insuranceCategories: [],

  activityDesc: '',
  eventDates: '',

  customQuestionnaire: '',
  customPromoMaterial: '',
  giveawayGifts: '',

  venueGroup: '',

  venueLinkLocation: '',
  venueLinkType: '',

  venueOtherLocation: '',
  venueOtherType: '',
  venueOtherCustomText: '',

  venueOfficeLocation: '',
  venueOfficeRooms: [],
  venueOfficeAc: '',

  adMediumType: '',
  adLocationAgency: '',

  section2Notes: '',
  agentsList: [
    { id: '1', name: '', team: '', code: '', license: '' },
    { id: '2', name: '', team: '', code: '', license: '' },
    { id: '3', name: '', team: '', code: '', license: '' }
  ],

  applicant1SignDate: '',
  applicant2SignDate: '',

  director1Name: '',
  director1SignDate: '',
  director2Name: '',
  director2SignDate: ''
};
