import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../Context/AuthContext';
import {
  Appointment,
  DEFAULT_TIMEZONE,
  TimeSlot,
  buildDayOptions,
  canCancel,
  canReschedule,
  cancelAppointment,
  fetchAppointments,
  fetchDoctorSlots,
  formatDateInZone,
  formatTimeInZone,
  offsetMinutesForTimeZone,
  rescheduleAppointment,
  toDateParam,
} from '../services/AppointmentService';

const PAGE_SIZE = 10;

const STATUS_STYLES: Record<string, {bg: string; fg: string; label: string}> =
  {
    CONFIRMED: {bg: '#D1FAE5', fg: '#047857', label: 'Confirmed'},
    BOOKED: {bg: '#D1FAE5', fg: '#047857', label: 'Booked'},
    COMPLETED: {bg: '#DBEAFE', fg: '#1D4ED8', label: 'Completed'},
    PENDING: {bg: '#FEF3C7', fg: '#B45309', label: 'Pending'},
    CANCELLED: {bg: '#FEE2E2', fg: '#B91C1C', label: 'Cancelled'},
    REJECTED: {bg: '#FEE2E2', fg: '#B91C1C', label: 'Rejected'},
  };

const statusStyle = (status: string) =>
  STATUS_STYLES[status?.toUpperCase?.() ?? ''] || {
    bg: '#F3F4F6',
    fg: '#4B5563',
    label: status
      ? status.replace(/_/g, ' ').toLowerCase().replace(/^./, c =>
          c.toUpperCase(),
        )
      : 'Unknown',
  };

const dateLabelOf = (
  appointment: Appointment | null,
  offsetMinutes: number,
): string => {
  if (!appointment?.appointmentDate) {
    return '';
  }
  return formatDateInZone(appointment.appointmentDate, offsetMinutes);
};

const MyAppointmentsScreen = ({navigation}: any) => {
  const {user, token} = useAuth();

  const [items, setItems] = useState<Appointment[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(
    null,
  );
  const [rescheduleDate, setRescheduleDate] = useState(() =>
    toDateParam(new Date()),
  );
  const [rescheduleSlotId, setRescheduleSlotId] = useState<string | null>(null);
  const [rescheduleSlots, setRescheduleSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState(false);
  const dayOptions = useMemo(() => buildDayOptions(14), []);

  const offset = useMemo(
    () => offsetMinutesForTimeZone(DEFAULT_TIMEZONE),
    [],
  );

  const load = useCallback(
    async (targetPage: number, mode: 'initial' | 'refresh' | 'more') => {
      if (mode === 'more') {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        let patientId = user?.id || user?._id || '';
        if (!patientId) {
          const stored = await AsyncStorage.getItem('@auth_user');
          const parsed = stored ? JSON.parse(stored) : null;
          patientId = parsed?.id || parsed?._id || '';
        }
        if (!patientId) {
          throw new Error('Could not identify your account. Please log in again.');
        }

        const result = await fetchAppointments(
          patientId,
          token,
          targetPage,
          PAGE_SIZE,
        );
        setItems(prev =>
          mode === 'more' ? [...prev, ...result.items] : result.items,
        );
        setPage(result.page);
        setTotal(result.total);
        setHasMore(result.hasMore);
      } catch (err: any) {
        console.error('[APPT] list failed:', err);
        setSessionExpired(err?.code === 'UNAUTHORIZED');
        setError(err?.message || 'Could not load your appointments.');
        if (mode === 'initial') {
          setItems([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [token, user?.id, user?._id],
  );

  useEffect(() => {
    load(1, 'initial');
  }, [load]);

  useEffect(() => {
    let active = true;
    const loadSlots = async () => {
      if (!rescheduleTarget) {
        return;
      }
      setSlotsLoading(true);
      setSlotsError(null);
      setRescheduleSlotId(null);
      try {
        const {slots} = await fetchDoctorSlots(
          rescheduleTarget.doctorId,
          rescheduleDate,
          token,
        );
        if (active) {
          setRescheduleSlots(slots);
        }
      } catch (err: any) {
        console.error('[APPT] reschedule slots failed:', err);
        if (active) {
          setRescheduleSlots([]);
          setSlotsError(
            err?.code === 'UNAUTHORIZED'
              ? 'Your session has expired. Please log in again.'
              : err?.message || 'Could not load slots.',
          );
        }
      } finally {
        if (active) {
          setSlotsLoading(false);
        }
      }
    };
    loadSlots();
    return () => {
      active = false;
    };
  }, [rescheduleTarget, rescheduleDate, token]);

  const handleRefresh = () => {
    setRefreshing(true);
    load(1, 'refresh');
  };

  const handleEndReached = () => {
    if (!hasMore || loadingMore || loading) {
      return;
    }
    load(page + 1, 'more');
  };

  const closeCancelModal = () => {
    if (cancelling) {
      return;
    }
    setCancelTarget(null);
    setCancelReason('');
  };

  const openReschedule = (appointment: Appointment) => {
    setRescheduleTarget(appointment);
    setRescheduleSlotId(null);
    setRescheduleDate(toDateParam(new Date()));
  };

  const closeReschedule = () => {
    if (rescheduling) {
      return;
    }
    setRescheduleTarget(null);
    setRescheduleSlotId(null);
    setRescheduleSlots([]);
    setSlotsError(null);
  };

  const confirmReschedule = async () => {
    const slot = rescheduleSlots.find(s => s.id === rescheduleSlotId);
    if (!rescheduleTarget || !slot) {
      Alert.alert('Pick a time slot', 'Please select an available time slot.');
      return;
    }
    setRescheduling(true);
    try {
      await rescheduleAppointment(
        rescheduleTarget.id,
        {
          appointmentDate: rescheduleDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
        token,
      );
      closeReschedule();
      load(1, 'refresh');
    } catch (err: any) {
      console.error('[APPT] reschedule failed:', err);
      Alert.alert(
        'Reschedule failed',
        err?.message || 'Could not reschedule this appointment.',
      );
    } finally {
      setRescheduling(false);
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) {
      return;
    }
    setCancelling(true);
    try {
      await cancelAppointment(
        cancelTarget.id,
        cancelReason.trim() || 'Cancelled by patient',
        token,
      );
      setCancelTarget(null);
      setCancelReason('');
      setItems(prev =>
        prev.map(item =>
          item.id === cancelTarget.id
            ? {...item, status: 'CANCELLED'}
            : item,
        ),
      );
      load(1, 'refresh');
    } catch (err: any) {
      console.error('[APPT] cancel failed:', err);
      Alert.alert(
        'Cancellation failed',
        err?.message || 'Could not cancel this appointment. Please try again.',
      );
    } finally {
      setCancelling(false);
    }
  };

  const renderItem = ({item}: {item: Appointment}) => {
    const status = statusStyle(item.status);
    const date = item.appointmentDate
      ? formatDateInZone(item.appointmentDate, offset)
      : '';
    const start = item.startTime
      ? formatTimeInZone(item.startTime, offset)
      : '';
    const end = item.endTime ? formatTimeInZone(item.endTime, offset) : '';

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardTopLeft}>
            <Text style={styles.doctorName} numberOfLines={1}>
              {item.doctorName}
            </Text>
            {!!item.doctorSpecialization && (
              <Text style={styles.specialization} numberOfLines={1}>
                {item.doctorSpecialization}
              </Text>
            )}
          </View>
          <View style={[styles.statusBadge, {backgroundColor: status.bg}]}>
            <Text style={[styles.statusText, {color: status.fg}]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeIcon}>📅</Text>
          <Text style={styles.timeValue}>{date || 'Date not set'}</Text>
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeIcon}>🕐</Text>
          <Text style={styles.timeValue}>
            {start ? `${start}${end ? ` – ${end}` : ''}` : 'Time not set'}
            {item.duration > 0 && start ? ` · ${item.duration} min` : ''}
          </Text>
        </View>

        {!!item.appointmentType && (
          <View style={styles.chipRow}>
            <Text style={styles.chip}>{item.appointmentType}</Text>
            {!!item.scheduledBy && <Text style={styles.chip}>{item.scheduledBy}</Text>}
          </View>
        )}

        {!!item.symptoms && (
          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>Symptoms</Text>
            <Text style={styles.noteText}>{item.symptoms}</Text>
          </View>
        )}

        {!!item.notes && (
          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>Notes</Text>
            <Text style={styles.noteText}>{item.notes}</Text>
          </View>
        )}

        {(canCancel(item.status) || canReschedule(item.status)) && (
          <View style={styles.actionRow}>
            {canReschedule(item.status) && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openReschedule(item)}
                activeOpacity={0.8}>
                <Text style={styles.actionButtonText}>Reschedule</Text>
              </TouchableOpacity>
            )}
            {canCancel(item.status) && (
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonDanger]}
                onPress={() => {
                  setCancelTarget(item);
                  setCancelReason('');
                }}
                activeOpacity={0.8}>
                <Text
                  style={[styles.actionButtonText, styles.actionButtonDangerText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Appointments</Text>
        <Text style={styles.subtitle}>
          {total > 0
            ? `${total} appointment${total === 1 ? '' : 's'} booked`
            : 'All your booked consultations'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#D6336C" />
          <Text style={styles.loadingText}>Loading your appointments…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>
            {sessionExpired ? 'Session expired' : 'Could not load appointments'}
          </Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => load(1, 'initial')} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No appointments yet</Text>
          <Text style={styles.errorText}>
            Appointments you book will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => item.id || `appt-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#D6336C']}
            />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                style={styles.footerLoader}
                color="#D6336C"
              />
            ) : !hasMore ? (
              <Text style={styles.endText}>No more appointments to show</Text>
            ) : null
          }
        />
      )}

      <Modal
        visible={!!cancelTarget}
        transparent
        animationType="fade"
        onRequestClose={closeCancelModal}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeCancelModal}
          />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Cancel Appointment</Text>
            <Text style={styles.modalSubtitle}>
              {cancelTarget?.doctorName} · {dateLabelOf(cancelTarget, offset)}
            </Text>

            <Text style={styles.modalLabel}>Reason (optional)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Feeling unwell, will rebook next week"
              placeholderTextColor="#9CA3AF"
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
              numberOfLines={3}
              editable={!cancelling}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonGhost]}
                onPress={closeCancelModal}
                disabled={cancelling}>
                <Text style={styles.modalButtonGhostText}>Keep</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDanger]}
                onPress={confirmCancel}
                disabled={cancelling}>
                {cancelling ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonDangerText}>
                    Confirm Cancel
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!rescheduleTarget}
        transparent
        animationType="fade"
        onRequestClose={closeReschedule}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeReschedule}
          />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Reschedule Appointment</Text>
            <Text style={styles.modalSubtitle}>
              {rescheduleTarget?.doctorName} · current slot{' '}
              {dateLabelOf(rescheduleTarget, offset)}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayStrip}>
              {dayOptions.map(day => {
                const isActive = day.label === rescheduleDate;
                return (
                  <TouchableOpacity
                    key={day.label}
                    style={[styles.dayChip, isActive && styles.dayChipActive]}
                    onPress={() => setRescheduleDate(day.label)}
                    activeOpacity={0.85}>
                    <Text
                      style={[
                        styles.dayChipDay,
                        isActive && styles.dayChipDayActive,
                      ]}>
                      {day.isToday ? 'Today' : day.dayName}
                    </Text>
                    <Text
                      style={[
                        styles.dayChipDate,
                        isActive && styles.dayChipDateActive,
                      ]}>
                      {day.dayNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.modalLabel}>Pick a time</Text>

            {slotsLoading ? (
              <View style={styles.slotsPlaceholder}>
                <ActivityIndicator size="small" color="#D6336C" />
                <Text style={styles.slotsPlaceholderText}>
                  Loading slots…
                </Text>
              </View>
            ) : slotsError ? (
              <Text style={styles.slotsErrorText}>{slotsError}</Text>
            ) : rescheduleSlots.length === 0 ? (
              <Text style={styles.slotsPlaceholderText}>
                No slots on {rescheduleDate}.
              </Text>
            ) : (
              <View style={styles.slotGrid}>
                {rescheduleSlots.map(slot => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.slotChip,
                      slot.available
                        ? styles.slotChipAvailable
                        : styles.slotChipBooked,
                      rescheduleSlotId === slot.id && styles.slotChipSelected,
                    ]}
                    disabled={!slot.available}
                    onPress={() => setRescheduleSlotId(slot.id)}>
                    <Text
                      style={[
                        styles.slotChipText,
                        slot.available
                          ? styles.slotChipTextAvailable
                          : styles.slotChipTextBooked,
                        rescheduleSlotId === slot.id && styles.slotChipTextSelected,
                      ]}>
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonGhost]}
                onPress={closeReschedule}
                disabled={rescheduling}>
                <Text style={styles.modalButtonGhostText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDanger]}
                onPress={confirmReschedule}
                disabled={rescheduling || !rescheduleSlotId}>
                {rescheduling ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalButtonDangerText}>
                    Confirm Reschedule
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF5F7'},
  header: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#FFE4E9',
  },
  backButton: {alignSelf: 'flex-start', marginBottom: 8},
  backText: {fontSize: 15, color: '#D6336C', fontWeight: '700'},
  title: {fontSize: 24, fontWeight: 'bold', color: '#333'},
  subtitle: {fontSize: 14, color: '#666', marginTop: 4},

  listContent: {padding: 16, paddingBottom: 32},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTopLeft: {flex: 1, marginRight: 8},
  doctorName: {fontSize: 17, fontWeight: '700', color: '#333'},
  specialization: {fontSize: 13, color: '#D6336C', marginTop: 2},
  statusBadge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12},
  statusText: {fontSize: 11, fontWeight: '700'},

  timeRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 5},
  timeIcon: {fontSize: 13, marginRight: 8},
  timeValue: {fontSize: 13, color: '#374151', fontWeight: '600', flex: 1},

  chipRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 6},
  chip: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },

  noteBox: {
    marginTop: 10,
    backgroundColor: '#FFF0F3',
    borderRadius: 10,
    padding: 10,
  },
  noteLabel: {fontSize: 11, fontWeight: '700', color: '#D6336C'},
  noteText: {fontSize: 12, color: '#4B5563', marginTop: 3, lineHeight: 17},

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {marginTop: 12, color: '#6B7280', fontSize: 14},
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#D6336C',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {color: '#fff', fontWeight: '700', fontSize: 14},

  actionRow: {flexDirection: 'row', gap: 10, marginTop: 12},
  actionButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3B6C0',
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonDanger: {backgroundColor: '#FFF0F3', borderColor: '#F3B6C0'},
  actionButtonText: {fontSize: 14, fontWeight: '700', color: '#D6336C'},
  actionButtonDangerText: {color: '#D6336C'},

  dayStrip: {flexDirection: 'row', paddingVertical: 2, marginBottom: 14},
  dayChip: {
    width: 58,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F3D4DC',
  },
  dayChipActive: {borderColor: '#D6336C', backgroundColor: '#FFF0F3'},
  dayChipDay: {fontSize: 10, fontWeight: '600', color: '#888'},
  dayChipDayActive: {color: '#D6336C'},
  dayChipDate: {fontSize: 15, fontWeight: '800', color: '#333', marginTop: 2},
  dayChipDateActive: {color: '#D6336C'},

  slotGrid: {flexDirection: 'row', flexWrap: 'wrap', maxHeight: 190},
  slotChip: {
    width: '30%',
    margin: '1.6%',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
  },
  slotChipAvailable: {backgroundColor: '#FFFFFF', borderColor: '#34D399'},
  slotChipBooked: {backgroundColor: '#F5F5F5', borderColor: '#DDDDDD'},
  slotChipSelected: {backgroundColor: '#FFE4E9', borderColor: '#D6336C'},
  slotChipText: {fontSize: 12, fontWeight: '600'},
  slotChipTextAvailable: {color: '#059669'},
  slotChipTextBooked: {color: '#999'},
  slotChipTextSelected: {color: '#D6336C', fontWeight: '700'},

  slotsPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  slotsPlaceholderText: {fontSize: 13, color: '#6B7280'},
  slotsErrorText: {fontSize: 13, color: '#C62828', paddingVertical: 12},

  modalOverlay: {flex: 1, justifyContent: 'center', padding: 24},
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
  },
  modalTitle: {fontSize: 18, fontWeight: '800', color: '#333'},
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#F3D4DC',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 84,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 10,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    minWidth: 96,
    alignItems: 'center',
  },
  modalButtonGhost: {backgroundColor: '#F3F4F6'},
  modalButtonGhostText: {fontSize: 14, fontWeight: '700', color: '#4B5563'},
  modalButtonDanger: {backgroundColor: '#D6336C'},
  modalButtonDangerText: {fontSize: 14, fontWeight: '700', color: '#FFFFFF'},

  footerLoader: {marginVertical: 16},
  endText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 8,
  },
});

export default MyAppointmentsScreen;
