import {
  DeviceEventEmitter,
  NativeModules,
  TurboModuleRegistry,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PATIENT_SUBSCRIPTIONS_BASE,
  RAZORPAY_BRAND,
  RAZORPAY_KEY_ID,
} from '../config/env';

const PREVIEW_API = `${PATIENT_SUBSCRIPTIONS_BASE}/preview`;
const CHECKOUT_API = `${PATIENT_SUBSCRIPTIONS_BASE}/checkout`;
const VERIFY_API = `${PATIENT_SUBSCRIPTIONS_BASE}/verify`;
const MY_SUBSCRIPTION_API = `${PATIENT_SUBSCRIPTIONS_BASE}/my`;
const HISTORY_API = `${MY_SUBSCRIPTION_API}/history`;

const RAZORPAY_SUCCESS_EVENT = 'Razorpay::PAYMENT_SUCCESS';
const RAZORPAY_ERROR_EVENT = 'Razorpay::PAYMENT_ERROR';

export interface SubscriptionPreview {
  amount: number;
  originalAmount?: number;
  currency: string;
  durationInDays?: number;
  label?: string;
  isFree: boolean;
  features: string[];
  alreadySubscribed: boolean;
  raw: any;
}

export interface CheckoutSession {
  razorpayOrderId: string;
  amountInPaise: number;
  amountSource: string;
  currency: string;
  key: string;
  name: string;
  description: string;
  prefill: {name?: string; email?: string; contact?: string};
  isFreeActivation: boolean;
  requiresPayment: boolean;
  raw: any;
}

export interface PaymentResult {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PendingCheckout {
  id: string;
  subscriptionNumber: string;
  name: string;
  amountPayable: number;
  orderId: string;
  createdAt?: string;
}

export interface SubscriptionHistoryPage {
  items: MySubscription[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface MySubscription {
  id: string;
  subscriptionNumber: string;
  packageId: string;
  name: string;
  subtitle?: string;
  tier?: string;
  trimester?: string;
  status: string;
  paymentStatus?: string;
  currency: string;
  isActive: boolean;
  hasAccess: boolean;
  inGrace: boolean;
  startDate?: string;
  endDate?: string;
  graceUntil?: string;
  daysRemaining?: number;
  durationInDays?: number;
  amountPaid?: number;
  amountPayable?: number;
  originalPrice?: number;
  discount?: number;
  createdAt?: string;
  orderId?: string;
  modules: string[];
  includes: string[];
  bonusCourses: any[];
  pendingCheckouts: PendingCheckout[];
  raw: any;
}

export class SubscriptionError extends Error {
  code: string;
  constructor(message: string, code = 'SUBSCRIPTION_ERROR') {
    super(message);
    this.code = code;
  }
}

export const PAYMENT_CANCELLED = 'PAYMENT_CANCELLED';

const pickPayload = (data: any) => data?.data?.data ?? data?.data ?? data ?? {};

const toNumber = (...values: any[]): number | undefined => {
  for (const value of values) {
    if (typeof value === 'number' && isFinite(value)) {
      return value;
    }
    if (
      typeof value === 'string' &&
      value.trim() !== '' &&
      isFinite(Number(value))
    ) {
      return Number(value);
    }
  }
  return undefined;
};

const toStringList = (...values: any[]): string[] => {
  for (const value of values) {
    if (Array.isArray(value)) {
      return value
        .map(item =>
          typeof item === 'string' ? item : item?.title || item?.label || item?.name,
        )
        .filter((item): item is string => typeof item === 'string' && item.length > 0);
    }
  }
  return [];
};

const getAuthToken = async (token?: string | null): Promise<string> => {
  if (token) {
    return token;
  }
  const stored = await AsyncStorage.getItem('@auth_token');
  return stored || '';
};

export const getAuthUserId = async (): Promise<string> => {
  try {
    const stored = await AsyncStorage.getItem('@auth_user');
    if (!stored) {
      return '';
    }
    const parsed = JSON.parse(stored);
    return parsed?.id || parsed?._id || '';
  } catch {
    return '';
  }
};

const maskToken = (t: string): string =>
  t.length > 24 ? `${t.slice(0, 20)}...${t.slice(-4)} (len ${t.length})` : t;

const ORDER_ID_KEYS = [
  'razorpayOrderId',
  'razorpay_order_id',
  'orderId',
  'order_id',
];

const ORDER_NODE_KEYS = [
  'order',
  'razorpayOrder',
  'orderDetails',
  'paymentOrder',
  'razorpay_order',
];

const PAISE_KEYS = [
  'amountInPaise',
  'amount_in_paise',
  'amountInRupeesPaise',
  'payableInPaise',
  'totalInPaise',
  'orderAmount',
  'order_amount',
  'razorpayAmount',
  'paise',
];

const RUPEE_KEYS = [
  'amount',
  'amountInRupees',
  'amount_in_rupees',
  'payableAmount',
  'payable',
  'totalAmount',
  'finalAmount',
  'total',
  'price',
];

const findDeep = (
  node: any,
  keys: string[],
  depth = 6,
): any => {
  if (!node || typeof node !== 'object' || depth <= 0) {
    return undefined;
  }
  for (const key of keys) {
    const value = node[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  for (const key of Object.keys(node)) {
    const value = node[key];
    if (value && typeof value === 'object') {
      const found = findDeep(value, keys, depth - 1);
      if (found !== undefined) {
        return found;
      }
    }
  }
  return undefined;
};

const findFirstNumber = (root: any, keys: string[]): number | undefined => {
  for (const key of keys) {
    const value = toNumber(findDeep(root, [key]));
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
};

const extractOrderId = (root: any): string => {
  const direct = findDeep(root, ORDER_ID_KEYS);
  if (direct !== undefined && direct !== null) {
    const asString = String(direct).trim();
    if (asString) {
      return asString;
    }
  }
  const orderNode = findDeep(root, ORDER_NODE_KEYS);
  if (orderNode && typeof orderNode === 'object') {
    const nested = orderNode.id ?? orderNode.order_id ?? orderNode.orderId;
    if (nested) {
      return String(nested).trim();
    }
  }
  return '';
};

const resolveAmountInPaise = (
  root: any,
  expectedRupees?: number,
): {amountInPaise: number; source: string} => {
  const explicitPaise = findFirstNumber(root, PAISE_KEYS);
  if (explicitPaise !== undefined && explicitPaise > 0) {
    return {amountInPaise: Math.round(explicitPaise), source: 'paise-field'};
  }

  const orderNode = findDeep(root, ORDER_NODE_KEYS);
  const orderAmount =
    orderNode && typeof orderNode === 'object'
      ? toNumber(orderNode.amount)
      : undefined;
  if (orderAmount !== undefined && orderAmount > 0) {
    return {amountInPaise: Math.round(orderAmount), source: 'order.amount'};
  }

  const generic = findFirstNumber(root, RUPEE_KEYS);
  if (generic !== undefined && generic > 0) {
    if (expectedRupees && expectedRupees > 0) {
      if (Math.abs(generic - expectedRupees) <= 1) {
        return {
          amountInPaise: Math.round(generic * 100),
          source: 'rupees-field (x100)',
        };
      }
      if (Math.abs(generic - expectedRupees * 100) <= 1) {
        return {amountInPaise: Math.round(generic), source: 'amount-field-as-paise'};
      }
    }
    return {amountInPaise: Math.round(generic), source: 'amount-field-as-paise'};
  }

  if (expectedRupees && expectedRupees > 0) {
    return {
      amountInPaise: Math.round(expectedRupees * 100),
      source: 'preview-fallback (x100)',
    };
  }

  return {amountInPaise: 0, source: 'none'};
};

const buildAuthHeaders = async (
  token?: string | null,
): Promise<Record<string, string>> => {
  const [authToken, authUserId] = await Promise.all([
    getAuthToken(token),
    getAuthUserId(),
  ]);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  if (authUserId) {
    headers['X-User-Id'] = authUserId;
  }
  console.log(`[SUBS]   userId      : ${authUserId || '(none)'}`);
  console.log(`[SUBS]   authToken   : ${maskToken(authToken)}`);
  return headers;
};

const readResponse = async (
  url: string,
  init: RequestInit,
): Promise<any> => {
  const startedAt = Date.now();

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error: any) {
    console.log(`[SUBS] ✖ NETWORK ERROR: ${error?.message}`);
    throw new SubscriptionError(
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
    `[SUBS] ◀ RESPONSE ${response.status} (${Date.now() - startedAt}ms)`,
  );
  console.log(`[SUBS]   data: ${JSON.stringify(data)}`);

  if (response.status === 401 || response.status === 403) {
    console.error(
      '[SUBS] AUTH REJECTED — server could not authenticate the token.',
      {status: response.status, message: data?.message},
    );
  } else if (response.status >= 500) {
    console.error(
      '[SUBS] SERVER CRASH (5xx) — backend threw an unhandled exception.',
      {status: response.status, message: data?.message},
    );
  }

  if (!response.ok || data?.success === false || data?.status === 'error') {
    const isAuthError =
      response.status === 401 ||
      response.status === 403 ||
      data?.code === 'UNAUTHORIZED' ||
      data?.code === 'TOKEN_EXPIRED';

    throw new SubscriptionError(
      isAuthError
        ? 'Your session has expired. Please log in again.'
        : data?.message || 'Something went wrong. Please try again.',
      isAuthError ? 'UNAUTHORIZED' : 'API_ERROR',
    );
  }

  return data;
};

const request = async (
  url: string,
  body: any,
  token?: string | null,
): Promise<any> => {
  const headers = await buildAuthHeaders(token);

  console.log(`[SUBS] ▶ REQUEST ${url}`);
  console.log(`[SUBS]   headers     : ${JSON.stringify(headers)}`);
  console.log(`[SUBS]   body        : ${JSON.stringify(body)}`);

  return readResponse(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
};

const requestGet = async (
  url: string,
  token?: string | null,
): Promise<any> => {
  const headers = await buildAuthHeaders(token);

  console.log(`[SUBS] ▶ GET ${url}`);
  console.log(`[SUBS]   headers     : ${JSON.stringify(headers)}`);

  return readResponse(url, {method: 'GET', headers});
};

const normalizePreview = (data: any): SubscriptionPreview => {
  const payload = pickPayload(data);
  const amountInPaise = toNumber(payload.amountInPaise, payload.paise);
  const amount =
    (amountInPaise !== undefined ? amountInPaise / 100 : undefined) ??
    toNumber(
      payload.amount,
      payload.payableAmount,
      payload.finalAmount,
      payload.totalAmount,
      payload.price,
    ) ??
    0;
  const originalAmount = toNumber(
    payload.originalAmount,
    payload.originalPrice,
    payload.mrp,
    payload.baseAmount,
  );

  return {
    amount,
    originalAmount:
      originalAmount && originalAmount > amount ? originalAmount : undefined,
    currency: payload.currency || RAZORPAY_BRAND.currency,
    durationInDays: toNumber(payload.durationInDays, payload.validityInDays),
    label: payload.label || payload.trimesterLabel || payload.name,
    isFree: payload.isFree ?? amount === 0,
    features: toStringList(
      payload.features,
      payload.includedFeatures,
      payload.benefits,
      payload.includes,
    ),
    alreadySubscribed: !!(payload.alreadySubscribed || payload.isSubscribed),
    raw: payload,
  };
};

const normalizeCheckout = (
  data: any,
  expectedRupees?: number,
): CheckoutSession => {
  const payload = pickPayload(data);
  const razorpayOrderId = extractOrderId(data) || extractOrderId(payload);
  const {amountInPaise, source: amountSource} = resolveAmountInPaise(
    data,
    expectedRupees,
  );
  const prefill =
    findDeep(payload, ['prefill']) ||
    findDeep(payload, ['customer']) ||
    findDeep(payload, ['user']) ||
    {};

  return {
    razorpayOrderId,
    amountInPaise,
    amountSource,
    currency: payload.currency || RAZORPAY_BRAND.currency,
    key: payload.razorpayKeyId || payload.key || RAZORPAY_KEY_ID,
    name: payload.name || payload.merchantName || RAZORPAY_BRAND.name,
    description:
      payload.description || payload.planName || 'Subscription',
    prefill: {
      name: prefill.name,
      email: prefill.email,
      contact: prefill.contact || prefill.phone,
    },
    isFreeActivation: !razorpayOrderId && amountInPaise === 0,
    requiresPayment: !!razorpayOrderId && amountInPaise > 0,
    raw: payload,
  };
};

const toSubscriptionRecord = (pkg: any): MySubscription => {
  const snapshot = pkg?.snapshot || {};

  return {
    id: String(pkg?._id || pkg?.id || ''),
    subscriptionNumber: String(pkg?.subscriptionNumber || ''),
    packageId: String(pkg?.packageId || ''),
    name: snapshot.name || pkg?.name || 'Subscription',
    subtitle: snapshot.subtitle || pkg?.subtitle,
    tier: pkg?.tier,
    trimester: pkg?.trimester,
    status: pkg?.status || 'UNKNOWN',
    paymentStatus: pkg?.paymentStatus,
    currency: pkg?.currency || RAZORPAY_BRAND.currency,
    isActive: !!pkg?.isActive,
    hasAccess: !!pkg?.hasAccess,
    inGrace: !!pkg?.inGrace,
    startDate: pkg?.startDate,
    endDate: pkg?.endDate,
    graceUntil: pkg?.graceUntil,
    daysRemaining: toNumber(pkg?.daysRemaining),
    durationInDays: toNumber(snapshot.durationInDays, pkg?.durationInDays),
    amountPaid: toNumber(pkg?.amountPaid, pkg?.amountPayable),
    amountPayable: toNumber(pkg?.amountPayable, pkg?.amountPaid),
    originalPrice: toNumber(snapshot.originalPrice, pkg?.listPrice),
    discount: toNumber(pkg?.discount),
    createdAt: pkg?.createdAt,
    orderId: pkg?.gateway?.orderId,
    modules: toStringList(snapshot.modules, pkg?.modules),
    includes: toStringList(snapshot.includes, pkg?.includes),
    bonusCourses: [],
    pendingCheckouts: [],
    raw: pkg,
  };
};

const normalizeMySubscription = (data: any): MySubscription | null => {
  const payload = pickPayload(data);
  const pkg = payload?.package ?? payload?.subscription ?? null;
  if (!pkg || typeof pkg !== 'object') {
    return null;
  }

  return {
    ...toSubscriptionRecord(pkg),
    bonusCourses: Array.isArray(payload.bonusCourses)
      ? payload.bonusCourses
      : [],
    pendingCheckouts: (Array.isArray(payload.pendingCheckouts)
      ? payload.pendingCheckouts
      : []
    ).map((item: any) => ({
      id: String(item?._id || item?.id || ''),
      subscriptionNumber: String(item?.subscriptionNumber || ''),
      name: item?.name || 'Subscription',
      amountPayable: toNumber(item?.amountPayable) ?? 0,
      orderId: item?.orderId || '',
      createdAt: item?.createdAt,
    })),
  };
};

export const fetchSubscriptionPreview = async (
  packageId: string,
  trimester: string,
  token?: string | null,
): Promise<SubscriptionPreview> => {
  const data = await request(PREVIEW_API, {packageId, trimester}, token);
  return normalizePreview(data);
};

export const fetchMySubscription = async (
  token?: string | null,
): Promise<MySubscription | null> => {
  const data = await requestGet(MY_SUBSCRIPTION_API, token);
  const subscription = normalizeMySubscription(data);
  console.log(
    `[SUBS] MY SUBSCRIPTION — ${
      subscription
        ? `${subscription.name} status=${subscription.status} daysRemaining=${subscription.daysRemaining}`
        : 'none'
    }`,
  );
  return subscription;
};

export const fetchSubscriptionHistory = async (
  token?: string | null,
  page = 1,
  limit = 10,
): Promise<SubscriptionHistoryPage> => {
  const data = await requestGet(
    `${HISTORY_API}?page=${page}&limit=${limit}`,
    token,
  );

  const payload: any = data?.data ?? {};
  const list: any[] = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
    ? payload
    : [];

  const total = toNumber(payload?.total) ?? list.length;
  const totalPages = toNumber(payload?.totalPages) ?? 1;
  const resolvedPage = toNumber(payload?.page) ?? page;

  return {
    items: list.map(toSubscriptionRecord),
    total,
    page: resolvedPage,
    totalPages,
    hasMore: resolvedPage < totalPages,
  };
};

export const createCheckoutSession = async (
  packageId: string,
  trimester: string,
  token?: string | null,
  expectedRupees?: number,
): Promise<CheckoutSession> => {
  const data = await request(CHECKOUT_API, {packageId, trimester}, token);
  const session = normalizeCheckout(data, expectedRupees);
  console.log('[SUBS] CHECKOUT NORMALIZED', {
    razorpayOrderId: session.razorpayOrderId || '(none)',
    amountInPaise: session.amountInPaise,
    amountSource: session.amountSource,
    requiresPayment: session.requiresPayment,
  });
  return session;
};

export const verifySubscriptionPayment = async (
  payment: PaymentResult,
  token?: string | null,
): Promise<any> => {
  const data = await request(
    VERIFY_API,
    {
      razorpayOrderId: payment.razorpayOrderId,
      razorpayPaymentId: payment.razorpayPaymentId,
      razorpaySignature: payment.razorpaySignature,
    },
    token,
  );
  return pickPayload(data);
};

export const RAZORPAY_NOT_LINKED = 'RAZORPAY_NOT_LINKED';

const resolveRazorpayModule = (): any => {
  try {
    const turbo = TurboModuleRegistry.get<any>('RNRazorpayCheckout');
    if (turbo) {
      return turbo;
    }
  } catch {
    console.log('[SUBS] TurboModuleRegistry lookup failed');
  }
  return (NativeModules as any)?.RNRazorpayCheckout || null;
};

const runRazorpayCheckout = (
  nativeModule: any,
  options: any,
): Promise<any> =>
  new Promise((resolve, reject) => {
    let settled = false;

    const successSub = DeviceEventEmitter.addListener(
      RAZORPAY_SUCCESS_EVENT,
      (data: any) => {
        if (settled) {
          return;
        }
        settled = true;
        successSub.remove();
        errorSub.remove();
        resolve(data);
      },
    );

    const errorSub = DeviceEventEmitter.addListener(
      RAZORPAY_ERROR_EVENT,
      (data: any) => {
        if (settled) {
          return;
        }
        settled = true;
        successSub.remove();
        errorSub.remove();
        reject(data);
      },
    );

    try {
      nativeModule.open(options);
    } catch (error: any) {
      if (!settled) {
        settled = true;
        successSub.remove();
        errorSub.remove();
        reject(error);
      }
    }
  });

export const openRazorpayCheckout = async (
  session: CheckoutSession & {notes?: {[key: string]: string}},
): Promise<PaymentResult> => {
  const nativeModule = resolveRazorpayModule();
  console.log(
    `[SUBS] RAZORPAY NATIVE MODULE — ${
      nativeModule ? 'linked' : 'NOT LINKED (rebuild required)'
    }`,
  );
  if (!nativeModule) {
    throw new SubscriptionError(
      'Payment is unavailable in this build. Please update the app and try again.',
      RAZORPAY_NOT_LINKED,
    );
  }

  let response: any;

  try {
    response = await runRazorpayCheckout(nativeModule, {
      key: session.key,
      order_id: session.razorpayOrderId,
      amount: String(session.amountInPaise),
      currency: session.currency,
      name: session.name,
      description: session.description,
      notes: session.notes,
      prefill: {
        name: session.prefill.name || '',
        email: session.prefill.email || '',
        contact: session.prefill.contact || '',
      },
      theme: {color: '#D6336C'},
      modal: {
        backdropclose: false,
        escape: false,
        handleback: true,
        confirm_close: true,
      },
    });
  } catch (error: any) {
    if (Number(error?.code) === 2) {
      throw new SubscriptionError(PAYMENT_CANCELLED, PAYMENT_CANCELLED);
    }
    throw new SubscriptionError(
      error?.description || error?.message || 'Payment failed. Please try again.',
      'PAYMENT_FAILED',
    );
  }

  const razorpayPaymentId = response?.razorpay_payment_id || '';
  const razorpaySignature = response?.razorpay_signature || '';

  if (!razorpayPaymentId || !razorpaySignature) {
    throw new SubscriptionError(
      'Payment response was incomplete. Please try again.',
      'PAYMENT_FAILED',
    );
  }

  return {
    razorpayOrderId:
      response?.razorpay_order_id || session.razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  };
};
