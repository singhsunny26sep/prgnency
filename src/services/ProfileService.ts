import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE} from '../config/env';

const PROFILE_ENDPOINTS = [
  {name: 'users/get', url: `${API_BASE}/users/get`},
  {name: 'patients/profile', url: `${API_BASE}/patients/profile`},
];

export interface UserProfile {
  id?: string;
  name?: string;
  mobile?: string;
  email?: string;
  [key: string]: any;
}

export type ProfileErrorCode =
  | 'UNAUTHORIZED'
  | 'SERVER_ERROR'
  | 'SERVER_BROKEN'
  | 'EMPTY_TOKEN';

export class ProfileError extends Error {
  code: ProfileErrorCode;
  status: number;
  endpoint: string;

  constructor(message: string, code: ProfileErrorCode, status = 0, endpoint = '') {
    super(message);
    this.code = code;
    this.status = status;
    this.endpoint = endpoint;
  }
}

const SERVER_BROKEN_MESSAGE =
  'Profile service is temporarily unavailable. Showing saved details.';

const getToken = async (token?: string | null): Promise<string> => {
  if (token) {
    return token;
  }
  return (await AsyncStorage.getItem('@auth_token')) || '';
};

const PROFILE_CACHE_KEY = '@profile_cache';

const getStoredUser = async (): Promise<UserProfile | null> => {
  try {
    const [rawUser, rawCache] = await Promise.all([
      AsyncStorage.getItem('@auth_user'),
      AsyncStorage.getItem(PROFILE_CACHE_KEY),
    ]);

    const parsed = rawUser ? JSON.parse(rawUser) : null;
    const cached = rawCache ? JSON.parse(rawCache) : null;

    if (!parsed?.id && !parsed?._id) {
      return null;
    }

    return {
      ...parsed,
      ...cached,
      id: parsed.id || parsed._id,
      _id: parsed._id || parsed.id,
      name: parsed.name || cached?.name,
      mobile: parsed.mobile || cached?.mobile,
      email: parsed.email || cached?.email,
    };
  } catch {
    return null;
  }
};

export const fetchUserProfile = async (
  token?: string | null,
): Promise<UserProfile> => {
  const authToken = await getToken(token);

  if (!authToken) {
    throw new ProfileError('Please log in to view your profile.', 'EMPTY_TOKEN');
  }

  const userId = (await getStoredUser())?.id || '';

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };
  if (userId) {
    headers['X-User-Id'] = userId;
  }

  let lastError: ProfileError | null = null;

  for (const endpoint of PROFILE_ENDPOINTS) {
    const url = userId
      ? `${endpoint.url}?userId=${encodeURIComponent(userId)}`
      : endpoint.url;

    console.log(`[PROFILE] ▶ ${endpoint.name} → ${url}`);
    console.log(`[PROFILE]   userId    : ${userId || '(none)'}`);
    console.log(`[PROFILE]   authToken : ${authToken.slice(0, 20)}...${authToken.slice(-4)}`);

    let response: Response;

    try {
      response = await fetch(url, {method: 'GET', headers});
    } catch (error: any) {
      console.log(`[PROFILE] ✖ NETWORK ERROR: ${error?.message}`);
      lastError = new ProfileError(
        'Network error. Please try again.',
        'SERVER_ERROR',
        0,
        endpoint.name,
      );
      continue;
    }

    console.log(`[PROFILE] ◀ ${endpoint.name} → HTTP ${response.status}`);

    if (response.status === 401 || response.status === 403) {
      console.error(
        '[PROFILE] AUTH REJECTED — backend could not authenticate the token.',
      );
      lastError = new ProfileError(
        'Your session has expired. Please log in again.',
        'UNAUTHORIZED',
        response.status,
        endpoint.name,
      );
      continue;
    }

    const data = await response.json().catch(() => null);

    if (response.ok && data?.success) {
      const payload = data?.data || {};
      const id = payload.id || payload._id || userId;
      console.log(`Profile loaded from ${endpoint.name}`);

      const profile: UserProfile = {
        ...payload,
        id,
        _id: payload._id || id,
        name: payload.name || payload.fullName || payload.userName,
        mobile: payload.mobile || payload.phone || payload.mobileNumber,
        email: payload.email || payload.emailAddress,
      };

      AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile)).catch(
        err => console.warn('Failed to cache profile:', err),
      );

      return profile;
    }

    lastError = new ProfileError(
      data?.message || `Request failed (${response.status})`,
      response.status >= 500 ? 'SERVER_BROKEN' : 'SERVER_ERROR',
      response.status,
      endpoint.name,
    );
  }

  console.error(
    'All profile endpoints failed:',
    PROFILE_ENDPOINTS.map(e => e.name).join(', '),
    lastError?.message,
  );

  if (lastError?.code === 'UNAUTHORIZED') {
    throw lastError;
  }

  const cached = await getStoredUser();
  if (cached) {
    console.warn('Falling back to locally cached profile for', cached.id);
    return cached;
  }

  throw new ProfileError(
    lastError?.code === 'SERVER_BROKEN'
      ? SERVER_BROKEN_MESSAGE
      : lastError?.message || 'Could not load your profile.',
    lastError?.code === 'SERVER_BROKEN' ? 'SERVER_BROKEN' : 'SERVER_ERROR',
    lastError?.status || 0,
    lastError?.endpoint || '',
  );
};
