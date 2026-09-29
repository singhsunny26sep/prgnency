import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE} from '../config/env';

export const COMPLETE_PROFILE_ENDPOINT = `${API_BASE}/patients/complete-profile`;
export const PATIENT_PROFILE_ENDPOINT = `${API_BASE}/patients/profile`;
export const DOCTORS_ENDPOINT = `${API_BASE}/doctors/get-all`;

export interface PreviousDelivery {
  year: string;
  type: string;
  babyWeight: string;
  complications: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface DoctorDetails {
  doctorName: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address: string;
}

export interface CompleteProfilePayload {
  fullName: string;
  husbandOrParentName: string;
  profession: string;
  dateOfBirth: string;
  age: number | string;
  bloodGroup: string;
  height: string;
  weight: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  lmp: string;
  edd: string;
  currentTrimester: string;
  gravida: number | string;
  para: number | string;
  abortions: number | string;
  previousDeliveries: PreviousDelivery[];
  medicalConditions: string[];
  medications: Medication[];
  primaryDoctor: string;
  doctorDetails: DoctorDetails;
  heardAboutGarbhsanskar: string;
  expectationsFromHiranyagarbha: string;
  preferredLanguage: string;
  emergencyContact: EmergencyContact;
}

export const EMPTY_PROFILE: CompleteProfilePayload = {
  fullName: '',
  husbandOrParentName: '',
  profession: '',
  dateOfBirth: '',
  age: '',
  bloodGroup: '',
  height: '',
  weight: '',
  email: '',
  phone: '',
  whatsappNumber: '',
  address: '',
  lmp: '',
  edd: '',
  currentTrimester: '',
  gravida: '',
  para: '',
  abortions: '',
  previousDeliveries: [],
  medicalConditions: [],
  medications: [],
  primaryDoctor: '',
  doctorDetails: {
    doctorName: '',
    specialization: '',
    hospital: '',
    phone: '',
    email: '',
  },
  heardAboutGarbhsanskar: '',
  expectationsFromHiranyagarbha: '',
  preferredLanguage: 'Hindi',
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
    address: '',
  },
};

export class PatientProfileError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.status = status;
  }
}

const getToken = async (token?: string | null): Promise<string> => {
  if (token) {
    return token;
  }
  return (await AsyncStorage.getItem('@auth_token')) || '';
};

const getStoredUserId = async (): Promise<string> => {
  try {
    const raw = await AsyncStorage.getItem('@auth_user');
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.id || parsed?._id || '';
  } catch {
    return '';
  }
};

const buildHeaders = async (
  token?: string | null,
): Promise<Record<string, string>> => {
  const authToken = await getToken(token);
  if (!authToken) {
    throw new PatientProfileError('Please log in to continue.', 401);
  }
  return {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };
};

const toNumber = (value: number | string): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  const parsed = parseInt(String(value).trim(), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const normalizeProfilePayload = (
  payload: CompleteProfilePayload,
): Record<string, any> => ({
  ...payload,
  age: toNumber(payload.age),
  gravida: toNumber(payload.gravida),
  para: toNumber(payload.para),
  abortions: toNumber(payload.abortions),
  previousDeliveries: (payload.previousDeliveries || [])
    .filter(entry => entry && (entry.year || entry.type))
    .map(entry => ({
      year: toNumber(entry.year),
      type: entry.type || '',
      babyWeight: entry.babyWeight || '',
      complications: entry.complications || '',
    })),
  medications: (payload.medications || [])
    .filter(entry => entry && entry.name)
    .map(entry => ({
      name: entry.name || '',
      dosage: entry.dosage || '',
      frequency: entry.frequency || '',
    })),
  medicalConditions: (payload.medicalConditions || []).filter(Boolean),
});

export const submitCompleteProfile = async (
  payload: CompleteProfilePayload,
  token?: string | null,
): Promise<any> => {
  const headers = await buildHeaders(token);

  const response = await fetch(COMPLETE_PROFILE_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(normalizeProfilePayload(payload)),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    console.log('[COMPLETE_PROFILE] failed', response.status, data);
    throw new PatientProfileError(
      data?.message || `Profile save failed (${response.status})`,
      response.status,
    );
  }

  console.log('[COMPLETE_PROFILE] saved', data?.data?._id || data?.data?.id || '');
  return data?.data || {};
};

export const fetchPatientProfile = async (
  token?: string | null,
): Promise<Partial<CompleteProfilePayload> | null> => {
  try {
    const headers = await buildHeaders(token);
    const userId = await getStoredUserId();
    if (userId) {
      headers['X-User-Id'] = userId;
    }
    const url = userId
      ? `${PATIENT_PROFILE_ENDPOINT}?userId=${encodeURIComponent(userId)}`
      : PATIENT_PROFILE_ENDPOINT;

    const response = await fetch(url, {method: 'GET', headers});
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
      return null;
    }

    const profile =
      data?.profile ||
      data?.data?.profile ||
      data?.data?.patient ||
      data?.data ||
      null;
    return profile && typeof profile === 'object' ? profile : null;
  } catch (error) {
    console.log('[COMPLETE_PROFILE] prefetch skipped:', (error as Error).message);
    return null;
  }
};

export interface DoctorOption {
  _id: string;
  fullName: string;
  specialization?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const fetchDoctors = async (
  token?: string | null,
): Promise<DoctorOption[]> => {
  try {
    const headers = await buildHeaders(token);
    const response = await fetch(`${DOCTORS_ENDPOINT}?page=1&limit=50`, {
      method: 'GET',
      headers,
    });
    const data = await response.json().catch(() => null);
    const list = data?.data?.data || data?.data;
    if (!response.ok || !data?.success || !Array.isArray(list)) {
      return [];
    }
    return list;
  } catch (error) {
    console.log('[COMPLETE_PROFILE] doctors fetch failed:', (error as Error).message);
    return [];
  }
};
