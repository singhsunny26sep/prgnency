import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE} from '../config/env';

const APPOINTMENTS_API = `${API_BASE}/appointments`;

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

export type AppointmentErrorCode =
  | 'UNAUTHORIZED'
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'EMPTY_TOKEN';

export class AppointmentError extends Error {
  code: AppointmentErrorCode;
  status: number;

  constructor(message: string, code: AppointmentErrorCode, status = 0) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  appointmentType: string;
  symptoms: string;
  notes: string;
  scheduledBy: string;
  createdAt: string;
}

export interface AppointmentPage {
  items: Appointment[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
  label: string;
}

export const toDateParam = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const buildDayOptions = (count: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({length: count}, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() + index);
    return {
      value: date,
      label: toDateParam(date),
      dayName: date.toLocaleDateString('en-US', {weekday: 'short'}),
      dayNumber: String(date.getDate()),
      isToday: index === 0,
    };
  });
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

const getToken = async (token?: string | null): Promise<string> => {
  if (token) {
    return token;
  }
  return (await AsyncStorage.getItem('@auth_token')) || '';
};

const requireToken = async (
  token: string | null | undefined,
  message: string,
): Promise<string> => {
  const authToken = await getToken(token);
  if (!authToken) {
    throw new AppointmentError(message, 'EMPTY_TOKEN');
  }
  return authToken;
};

export const offsetMinutesForTimeZone = (
  timeZone: string,
  at: Date = new Date(),
): number => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).formatToParts(at);
    const map: Record<string, string> = {};
    for (const part of parts) {
      if (part.type !== 'literal') {
        map[part.type] = part.value;
      }
    }
    const asUTC = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(map.hour) % 24,
      Number(map.minute),
      Number(map.second),
    );
    return Math.round((asUTC - at.getTime()) / 60000);
  } catch {
    return -at.getTimezoneOffset();
  }
};

const zoned = (value: string, offsetMinutes: number): Date | null => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return new Date(parsed.getTime() + offsetMinutes * 60000);
};

export const formatTimeInZone = (
  value: string,
  offsetMinutes: number,
): string => {
  const shifted = zoned(value, offsetMinutes);
  if (!shifted) {
    return '';
  }
  const hours = shifted.getHours();
  const minutes = shifted.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(h12).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )} ${period}`;
};

export const formatDateInZone = (
  value: string,
  offsetMinutes: number,
): string => {
  const shifted = zoned(value, offsetMinutes);
  if (!shifted) {
    return '';
  }
  return shifted.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const pickList = (payload: any): any[] => {
  const candidates = [
    payload,
    payload?.appointments,
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

const normalize = (item: any): Appointment => {
  const doctor = item?.doctor || item?.doctorDetails || {};
  return {
    id: toText(item?._id || item?.id || item?.appointmentId),
    doctorId: toText(
      item?.doctorId?._id || item?.doctorId?.id || item?.doctorId,
    ),
    doctorName: toText(
      doctor?.fullName || item?.doctorName || item?.doctor?.name,
      'Doctor',
    ),
    doctorSpecialization: toText(
      doctor?.specialization ||
        doctor?.department ||
        item?.doctorSpecialization ||
        item?.specialization,
    ),
    appointmentDate: toText(
      item?.appointmentDate || item?.date || item?.scheduledDate,
    ),
    startTime: toText(item?.startTime || item?.start || item?.slotStartTime),
    endTime: toText(item?.endTime || item?.end || item?.slotEndTime),
    duration: toNumber(item?.duration) ?? 30,
    status: toText(item?.status || item?.appointmentStatus, 'PENDING'),
    appointmentType: toText(item?.appointmentType || item?.type),
    symptoms: toText(item?.symptoms),
    notes: toText(item?.notes),
    scheduledBy: toText(item?.scheduledBy),
    createdAt: toText(item?.createdAt),
  };
};

interface RequestOptions {
  method?: 'GET' | 'PATCH' | 'POST';
  body?: any;
}

const readResponse = async (
  url: string,
  token: string,
  options: RequestOptions = {},
): Promise<any> => {
  const startedAt = Date.now();
  const method = options.method ?? 'GET';

  console.log(
    `[APPT] ▶ ${method}`,
    url,
    JSON.stringify({
      hasToken: !!token,
      tokenPreview: token ? `${token.slice(0, 12)}...${token.slice(-4)}` : null,
      body: options.body,
    }),
  );

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...(options.body !== undefined
        ? {body: JSON.stringify(options.body)}
        : {}),
    });
  } catch (error: any) {
    console.error('[APPT] ✖ NETWORK ERROR:', error?.message);
    throw new AppointmentError(
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
    `[APPT] ◀ RESPONSE ${response.status} (${Date.now() - startedAt}ms)`,
  );
  console.log(`[APPT]   data: ${JSON.stringify(data, null, 2)}`);

  const isAuthError =
    response.status === 401 ||
    response.status === 403 ||
    data?.code === 'UNAUTHORIZED' ||
    data?.code === 'TOKEN_EXPIRED';

  if (!response.ok || data?.success === false) {
    throw new AppointmentError(
      isAuthError
        ? 'Your session has expired. Please log in again.'
        : data?.message || 'Could not load your appointments.',
      isAuthError ? 'UNAUTHORIZED' : 'API_ERROR',
      response.status,
    );
  }

  return data;
};

export const fetchAppointments = async (
  patientId: string,
  token?: string | null,
  page = 1,
  limit = 10,
): Promise<AppointmentPage> => {
  if (!patientId) {
    throw new AppointmentError(
      'Could not identify your account. Please log in again.',
      'API_ERROR',
    );
  }

  const authToken = await getToken(token);
  if (!authToken) {
    throw new AppointmentError(
      'Please log in to view your appointments.',
      'EMPTY_TOKEN',
    );
  }

  const query = new URLSearchParams({
    patientId,
    page: String(page),
    limit: String(limit),
  });
  const data = await readResponse(
    `${APPOINTMENTS_API}/get-all?${query.toString()}`,
    authToken,
  );

  const payload = data?.data;
  const fromPayload = pickList(payload);
  const list = fromPayload.length ? fromPayload : pickList(data);
  const items = list.map(normalize);

  const total = toNumber(payload?.total) ?? items.length;
  const totalPages = toNumber(payload?.totalPages) ?? 1;
  const resolvedPage = toNumber(payload?.page) ?? page;

  console.log(
    '[APPT] parsed:',
    JSON.stringify(
      {
        count: items.length,
        total,
        page: resolvedPage,
        totalPages,
        dataKeys:
          payload && typeof payload === 'object'
            ? Object.keys(payload).join(',')
            : typeof payload,
        statuses: items.map(i => i.status).join(','),
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
  };
};

export const CANCELLABLE_STATUSES = ['PENDING', 'CONFIRMED', 'BOOKED'];

export const canCancel = (status: string): boolean =>
  CANCELLABLE_STATUSES.includes(status?.toUpperCase?.() ?? '');

export const canReschedule = canCancel;

export const cancelAppointment = async (
  appointmentId: string,
  cancellationReason: string,
  token?: string | null,
): Promise<Appointment> => {
  if (!appointmentId) {
    throw new AppointmentError(
      'Could not identify the appointment to cancel.',
      'API_ERROR',
    );
  }

  const authToken = await getToken(token);
  if (!authToken) {
    throw new AppointmentError('Please log in to cancel appointments.', 'EMPTY_TOKEN');
  }

  const data = await readResponse(
    `${APPOINTMENTS_API}/${encodeURIComponent(appointmentId)}/cancel`,
    authToken,
    {
      method: 'PATCH',
      body: {
        cancelledBy: 'PATIENT',
        cancellationReason: cancellationReason.trim(),
      },
    },
  );

  const updated = normalize(data?.data?.appointment || data?.data || data);
  console.log(
    `[APPT] cancelled ${appointmentId} → status=${updated.status}`,
  );
  return updated;
};

export const rescheduleAppointment = async (
  appointmentId: string,
  payload: {appointmentDate: string; startTime: string; endTime: string},
  token?: string | null,
): Promise<Appointment> => {
  if (!appointmentId) {
    throw new AppointmentError(
      'Could not identify the appointment to reschedule.',
      'API_ERROR',
    );
  }
  if (!payload?.appointmentDate || !payload?.startTime || !payload?.endTime) {
    throw new AppointmentError(
      'Please pick a date and time slot first.',
      'API_ERROR',
    );
  }

  const authToken = await requireToken(
    token,
    'Please log in to reschedule appointments.',
  );

  const data = await readResponse(
    `${APPOINTMENTS_API}/${encodeURIComponent(appointmentId)}/reschedule`,
    authToken,
    {method: 'PATCH', body: payload},
  );

  const updated = normalize(data?.data?.appointment || data?.data || data);
  console.log(
    `[APPT] rescheduled ${appointmentId} → ${payload.appointmentDate} ${payload.startTime}`,
  );
  return updated;
};

const SLOTS_API = `${APPOINTMENTS_API}/slots`;

const toSlot = (item: any, available: boolean): TimeSlot | null => {
  const startTime = item?.startTime ?? item?.slotTime ?? item?.time;
  if (typeof startTime !== 'string' || !startTime.trim()) {
    return null;
  }
  const endTime = item?.endTime ?? '';
  return {
    id: item?._id || item?.id || item?.slotId || startTime,
    startTime,
    endTime: typeof endTime === 'string' ? endTime : '',
    duration: typeof item?.duration === 'number' ? item.duration : 30,
    available,
    label: '',
  };
};

export const fetchDoctorSlots = async (
  doctorId: string,
  appointmentDate: string,
  token?: string | null,
): Promise<{slots: TimeSlot[]; timezone: string}> => {
  if (!doctorId) {
    throw new AppointmentError(
      'Could not identify the doctor for this appointment.',
      'API_ERROR',
    );
  }

  const authToken = await requireToken(
    token,
    'Please log in to view available slots.',
  );

  const url = `${SLOTS_API}?doctorId=${encodeURIComponent(
    doctorId,
  )}&appointmentDate=${encodeURIComponent(appointmentDate)}`;

  const data = await readResponse(url, authToken);

  const body = data?.data;
  if (!body || typeof body !== 'object') {
    throw new AppointmentError(
      data?.message || 'Could not load available slots.',
      'API_ERROR',
    );
  }

  const timezone =
    typeof body.timezone === 'string' ? body.timezone : DEFAULT_TIMEZONE;
  const offset = offsetMinutesForTimeZone(timezone);

  const availableSlots = Array.isArray(body.availableSlots)
    ? body.availableSlots
    : Array.isArray(body.slots)
    ? body.slots
    : Array.isArray(body.data)
    ? body.data
    : [];
  const bookedSlots = Array.isArray(body.bookedSlots) ? body.bookedSlots : [];

  const slots = [
    ...availableSlots.map((item: any) => toSlot(item, true)),
    ...bookedSlots.map((item: any) => toSlot(item, false)),
  ]
    .filter((slot): slot is TimeSlot => slot !== null)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map(slot => ({...slot, label: formatTimeInZone(slot.startTime, offset)}));

  console.log(
    '[SLOTS] parsed:',
    JSON.stringify(
      {
        doctorId,
        appointmentDate,
        timezone,
        offsetMinutes: offset,
        totalSlots: body.totalSlots ?? 'n/a',
        available: slots.filter(s => s.available).length,
        booked: slots.filter(s => !s.available).length,
      },
      null,
      2,
    ),
  );

  return {slots, timezone};
};
