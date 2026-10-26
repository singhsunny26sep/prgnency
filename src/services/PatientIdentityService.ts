import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE, PATIENT_SUBSCRIPTIONS_BASE} from '../config/env';

const PATIENT_PROFILE_API = `${API_BASE}/patients/profile`;
const MY_SUBSCRIPTION_API = `${PATIENT_SUBSCRIPTIONS_BASE}/my`;

const CACHE_KEY = '@patient_id';

let inFlight: Promise<string> | null = null;

const getToken = async (token?: string | null): Promise<string> =>
  token || (await AsyncStorage.getItem('@auth_token')) || '';

const getStoredUserId = async (): Promise<string> => {
  try {
    const raw = await AsyncStorage.getItem('@auth_user');
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.id || parsed?._id || '';
  } catch {
    return '';
  }
};

const getJson = async (
  url: string,
  token: string,
): Promise<any | null> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json().catch(() => null);
  } catch (error: any) {
    console.log('[PATIENT_ID] request failed:', error?.message);
    return null;
  }
};

const fromPatientProfile = async (
  token: string,
  userId: string,
): Promise<string> => {
  const url = userId
    ? `${PATIENT_PROFILE_API}?userId=${encodeURIComponent(userId)}`
    : PATIENT_PROFILE_API;
  const data = await getJson(url, token);
  const payload = data?.data;
  return payload?._id || payload?.patientId || payload?.id || '';
};

const fromMySubscription = async (token: string): Promise<string> => {
  const data = await getJson(MY_SUBSCRIPTION_API, token);
  return (
    data?.data?.package?.patientId ||
    data?.data?.patientId ||
    ''
  );
};

/**
 * Resolves the Patient document id.
 *
 * This is NOT the auth user id: the subscription payload carries both
 * `userId` (6abc202b...) and `patientId` (6abc202c...), and they are
 * separate records. Appointment endpoints expect the patient id.
 */
export const resolvePatientId = async (
  token?: string | null,
  opts: {force?: boolean} = {},
): Promise<string> => {
  if (inFlight) {
    return inFlight;
  }

  inFlight = (async () => {
    try {
      if (!opts.force) {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          console.log('[PATIENT_ID] cached →', cached);
          return cached;
        }
      }

      const authToken = await getToken(token);
      const userId = await getStoredUserId();

      if (!authToken) {
        console.warn('[PATIENT_ID] no auth token, falling back to user id');
        return userId;
      }

      let patientId = await fromPatientProfile(authToken, userId);

      if (!patientId) {
        console.log('[PATIENT_ID] patients/profile had no id, trying subscription');
        patientId = await fromMySubscription(authToken);
      }

      if (!patientId) {
        console.warn(
          '[PATIENT_ID] could not resolve patient id, falling back to user id',
        );
        return userId;
      }

      console.log('[PATIENT_ID] resolved →', patientId, '(userId was', userId + ')');

      if (patientId !== userId) {
        await AsyncStorage.setItem(CACHE_KEY, patientId);
      }

      return patientId;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
};

export const clearPatientIdCache = async (): Promise<void> => {
  await AsyncStorage.removeItem(CACHE_KEY).catch(() => {});
};
