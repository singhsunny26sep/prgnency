import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config/env';

const NOTIFICATIONS_API = `${API_BASE}/notifications`;

export const DEFAULT_CHANNEL_ID = 'default';
export const DEFAULT_CHANNEL_NAME = 'Default Channel';

let cachedToken: string | null = null;
let backgroundHandlerRegistered = false;

const getMessaging = () => {
  try {
    return messaging() ?? null;
  } catch (error) {
    console.warn('FCM messaging unavailable:', error);
    return null;
  }
};

class NotificationService {
  static async requestUserPermission() {
    const settings = await notifee.requestPermission();
    return settings;
  }

  static async createNotificationChannel() {
    const channelId = await notifee.createChannel({
      id: DEFAULT_CHANNEL_ID,
      name: DEFAULT_CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
    });
    return channelId;
  }

  static async getFCMToken(force = false): Promise<string> {
    if (cachedToken && !force) {
      return cachedToken;
    }

    const instance = getMessaging();
    if (!instance) {
      return '';
    }

    try {
      console.log('Fetching FCM token...');
      const authStatus = await instance.requestPermission();
      console.log('FCM auth status:', authStatus);
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('FCM permission not granted');
        return '';
      }

      const token = await instance.getToken();
      cachedToken = token || null;
      console.log('FCM Token:', cachedToken);
      return cachedToken || '';
    } catch (error) {
      console.warn('FCM token fetch failed:', error);
      return '';
    }
  }

  static async displayNotification(
    remoteMessage?: FirebaseMessagingTypes.RemoteMessage,
    channelId: string = DEFAULT_CHANNEL_ID,
  ) {
    const data = remoteMessage?.data || {};
    const notification = remoteMessage?.notification;

    await notifee.displayNotification({
      title: String(notification?.title || data.title || ''),
      body: String(notification?.body || data.body || data.message || ''),
      data,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },
    });
  }

  static async configurePushNotifications() {
    await this.requestUserPermission();
    await this.createNotificationChannel();
    await this.getFCMToken();
  }

  static registerBackgroundMessageHandler() {
    if (backgroundHandlerRegistered) {
      return;
    }

    const instance = getMessaging();
    if (!instance) {
      console.warn('FCM background handler not registered: messaging is null');
      return;
    }

    try {
      instance.setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background message received:', remoteMessage);
        await this.displayNotification(remoteMessage);
      });
      backgroundHandlerRegistered = true;
    } catch (error) {
      console.warn('FCM background handler registration failed:', error);
    }
  }

  static setupNotificationListeners() {
    const instance = getMessaging();
    if (!instance) {
      console.warn('FCM listeners not registered: messaging is null');
      return undefined;
    }

    instance.onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    instance.onTokenRefresh(token => {
      cachedToken = token;
      console.log('FCM Token refreshed:', token);
    });

    instance
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
        }
      })
      .catch(error => console.warn('getInitialNotification failed:', error));

    instance.onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened while app in background:', remoteMessage);
    });

    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Notification pressed:', detail.notification);
      } else if (type === EventType.DISMISSED) {
        console.log('Notification dismissed:', detail.notification);
      }
    });
  }
}

export default NotificationService;

export type NotificationErrorCode =
  | 'UNAUTHORIZED'
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'EMPTY_TOKEN';

export class NotificationApiError extends Error {
  code: NotificationErrorCode;
  status: number;

  constructor(message: string, code: NotificationErrorCode, status = 0) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationPage {
  items: AppNotification[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  unreadCount: number;
}

const TYPE_ICONS: Record<string, string> = {
  APPOINTMENT: 'calendar-check',
  APPOINTMENT_REMINDER: 'clock-alert',
  BOOKING: 'calendar-check',
  ORDER: 'shopping',
  PAYMENT: 'credit-card',
  SUBSCRIPTION: 'crown',
  COMMUNITY: 'account-group',
  CHAT: 'message-text',
  TIP: 'lightbulb',
  PRODUCT: 'shopping',
  GROWTH: 'chart-line',
};

export const iconForType = (type: string): string => {
  const key = (type || '').toUpperCase().replace(/[\s-]+/g, '_');
  return TYPE_ICONS[key] || 'bell';
};

const toNumber = (value: any): number | undefined => {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const toText = (value: any, fallback = ''): string => {
  if (value === null || value === undefined) {
    return fallback;
  }
  return typeof value === 'string' ? value : String(value);
};

const toBool = (value: any): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return ['true', '1', 'yes'].includes(value.toLowerCase());
  }
  if (typeof value === 'number') {
    return value > 0;
  }
  return false;
};

export const relativeTime = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  const diffMs = Date.now() - parsed.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) {
    return 'Just now';
  }
  if (mins < 60) {
    return `${mins} min ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const normalize = (item: any): AppNotification => ({
  id: toText(item?._id || item?.id || item?.notificationId),
  title: toText(
    item?.title || item?.heading || item?.subject,
    'Notification',
  ),
  message: toText(
    item?.message || item?.body || item?.description || item?.content,
  ),
  type: toText(item?.type || item?.category || item?.notificationType),
  read: toBool(item?.isRead ?? item?.read ?? item?.seen),
  createdAt: toText(item?.createdAt || item?.sentAt || item?.date),
});

const pickList = (payload: any): any[] => {
  const candidates = [
    payload,
    payload?.notifications,
    payload?.list,
    payload?.data,
    payload?.results,
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }
  return [];
};

export const fetchMyNotifications = async (
  token?: string | null,
  page = 1,
  limit = 20,
): Promise<NotificationPage> => {
  const authToken =
    token || (await AsyncStorage.getItem('@auth_token')) || '';

  if (!authToken) {
    throw new NotificationApiError(
      'Please log in to view your notifications.',
      'EMPTY_TOKEN',
    );
  }

  const url = `${NOTIFICATIONS_API}/my?page=${page}&limit=${limit}`;
  const startedAt = Date.now();

  console.log(
    '[NOTIF] ▶ GET',
    url,
    JSON.stringify({
      hasToken: true,
      tokenPreview: `${authToken.slice(0, 12)}...${authToken.slice(-4)}`,
    }),
  );

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error: any) {
    console.error('[NOTIF] ✖ NETWORK ERROR:', error?.message);
    throw new NotificationApiError(
      error?.message || 'Network error. Please try again.',
      'NETWORK_ERROR',
    );
  }

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  console.log(
    `[NOTIF] ◀ RESPONSE ${response.status} (${Date.now() - startedAt}ms)`,
  );
  console.log(`[NOTIF]   data: ${JSON.stringify(data, null, 2)}`);

  const isAuthError =
    response.status === 401 ||
    response.status === 403 ||
    data?.code === 'UNAUTHORIZED' ||
    data?.code === 'TOKEN_EXPIRED';

  if (!response.ok || data?.success === false) {
    throw new NotificationApiError(
      isAuthError
        ? 'Your session has expired. Please log in again.'
        : data?.message || 'Could not load your notifications.',
      isAuthError ? 'UNAUTHORIZED' : 'API_ERROR',
      response.status,
    );
  }

  const payload = data?.data;
  const fromPayload = pickList(payload);
  const list = fromPayload.length ? fromPayload : pickList(data);
  const items = list.map(normalize);

  const total = toNumber(payload?.total) ?? items.length;
  const totalPages = toNumber(payload?.totalPages) ?? 1;
  const resolvedPage = toNumber(payload?.page) ?? page;
  const unreadCount =
    toNumber(payload?.unreadCount) ??
    toNumber(data?.unreadCount) ??
    items.filter(i => !i.read).length;

  console.log(
    '[NOTIF] parsed:',
    JSON.stringify(
      {
        count: items.length,
        total,
        page: resolvedPage,
        totalPages,
        unreadCount,
        dataKeys:
          payload && typeof payload === 'object'
            ? Object.keys(payload).join(',')
            : typeof payload,
        types: items.map(i => i.type).join(','),
      },
      null,
      2,
    ),
  );

  return {
    items,
    total,
    page: resolvedPage,
    totalPages,
    hasMore: resolvedPage < totalPages,
    unreadCount,
  };
};

export const fetchUnreadCount = async (
  token?: string | null,
): Promise<number> => {
  const authToken =
    token || (await AsyncStorage.getItem('@auth_token')) || '';

  if (!authToken) {
    return 0;
  }

  const url = `${NOTIFICATIONS_API}/my/unread-count`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json().catch(() => null);

    console.log(
      `[NOTIF] unread-count → ${response.status}`,
      JSON.stringify(data),
    );

    if (!response.ok || data?.success === false) {
      return 0;
    }

    const body = data?.data;
    const raw =
      (typeof body === 'number' || typeof body === 'string'
        ? body
        : body?.unreadCount ??
          body?.count ??
          body?.unread) ??
      data?.unreadCount ??
      data?.count;

    const count = Number(raw);
    return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
  } catch (error: any) {
    console.error('[NOTIF] ✖ unread-count failed:', error?.message);
    return 0;
  }
};

export const markNotificationRead = async (
  notificationId: string,
  token?: string | null,
): Promise<boolean> => {
  if (!notificationId) {
    return false;
  }

  const authToken =
    token || (await AsyncStorage.getItem('@auth_token')) || '';

  if (!authToken) {
    throw new NotificationApiError(
      'Please log in to update notifications.',
      'EMPTY_TOKEN',
    );
  }

  const url = `${NOTIFICATIONS_API}/my/${encodeURIComponent(
    notificationId,
  )}/read`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json().catch(() => null);

    console.log(
      `[NOTIF] ▶ PATCH ${url} → ${response.status}`,
      JSON.stringify(data),
    );

    if (!response.ok || data?.success === false) {
      const isAuthError = response.status === 401 || response.status === 403;
      throw new NotificationApiError(
        isAuthError
          ? 'Your session has expired. Please log in again.'
          : data?.message || 'Could not mark this notification as read.',
        isAuthError ? 'UNAUTHORIZED' : 'API_ERROR',
        response.status,
      );
    }

    return true;
  } catch (error: any) {
    if (error instanceof NotificationApiError) {
      throw error;
    }
    console.error('[NOTIF] ✖ mark-read failed:', error?.message);
    throw new NotificationApiError(
      error?.message || 'Network error. Please try again.',
      'NETWORK_ERROR',
    );
  }
};

export const markAllNotificationsRead = async (
  token?: string | null,
): Promise<boolean> => {
  const authToken =
    token || (await AsyncStorage.getItem('@auth_token')) || '';

  if (!authToken) {
    throw new NotificationApiError(
      'Please log in to update notifications.',
      'EMPTY_TOKEN',
    );
  }

  const url = `${NOTIFICATIONS_API}/my/read-all`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json().catch(() => null);

    console.log(
      `[NOTIF] ▶ PATCH ${url} → ${response.status}`,
      JSON.stringify(data),
    );

    if (!response.ok || data?.success === false) {
      const isAuthError = response.status === 401 || response.status === 403;
      throw new NotificationApiError(
        isAuthError
          ? 'Your session has expired. Please log in again.'
          : data?.message || 'Could not mark notifications as read.',
        isAuthError ? 'UNAUTHORIZED' : 'API_ERROR',
        response.status,
      );
    }

    return true;
  } catch (error: any) {
    if (error instanceof NotificationApiError) {
      throw error;
    }
    console.error('[NOTIF] ✖ read-all failed:', error?.message);
    throw new NotificationApiError(
      error?.message || 'Network error. Please try again.',
      'NETWORK_ERROR',
    );
  }
};

export const deleteNotification = async (
  notificationId: string,
  token?: string | null,
): Promise<boolean> => {
  if (!notificationId) {
    return false;
  }

  const authToken =
    token || (await AsyncStorage.getItem('@auth_token')) || '';

  if (!authToken) {
    throw new NotificationApiError(
      'Please log in to delete notifications.',
      'EMPTY_TOKEN',
    );
  }

  const url = `${NOTIFICATIONS_API}/my/${encodeURIComponent(notificationId)}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json().catch(() => null);

    console.log(
      `[NOTIF] ▶ DELETE ${url} → ${response.status}`,
      JSON.stringify(data),
    );

    if (!response.ok || data?.success === false) {
      const isAuthError = response.status === 401 || response.status === 403;
      throw new NotificationApiError(
        isAuthError
          ? 'Your session has expired. Please log in again.'
          : data?.message || 'Could not delete this notification.',
        isAuthError ? 'UNAUTHORIZED' : 'API_ERROR',
        response.status,
      );
    }

    return true;
  } catch (error: any) {
    if (error instanceof NotificationApiError) {
      throw error;
    }
    console.error('[NOTIF] ✖ delete failed:', error?.message);
    throw new NotificationApiError(
      error?.message || 'Network error. Please try again.',
      'NETWORK_ERROR',
    );
  }
};
