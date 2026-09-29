import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import strings from '../../localization';
import {useAuth} from '../Context/AuthContext';
import {fetchUserProfile} from '../services/ProfileService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'https://api.hiranyagarbhsanskar.co/hiranyagarbha';
const BOOKING_API = `${API_URL}/appointments/book`;
const DOCTORS_API = `${API_URL}/doctors/get-all`;
const SLOTS_API = `${API_URL}/appointments/slots`;
const WHATSAPP_NUMBER = '+917972833428';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Doctor {
  _id: string;
  userId?: string;
  fullName: string;
  email?: string;
  phone?: string;
  expertise: string[];
  languages: string[];
  rating: number;
  reviewsCount: number;
  patientsCount: number;
  status: string;
  isProfileCompleted: boolean;
  isActive: boolean;
  isDeleted: boolean;
  address?: string;
  availableDays?: string;
  availableTime?: string;
  bloodGroup?: string;
  consultationFee?: string;
  dateOfBirth?: string;
  department?: string;
  experience: string;
  gender?: string;
  licenseNumber?: string;
  qualifications?: string;
  specialization: string;
  availabilityId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const AVATAR_GRADIENTS: [string, string][] = [
  ['#D6336C', '#F06292'],
  ['#8B5CF6', '#C084FC'],
  ['#0EA5E9', '#38BDF8'],
  ['#10B981', '#34D399'],
  ['#F59E0B', '#FBBF24'],
  ['#EC4899', '#F9A8D4'],
];

const getInitials = (name: string): string =>
  name
    .replace(/^Dr\.?\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('') || 'DR';

const parseTimeToDate = (timeStr: string, date: Date): Date => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

const AppointmentScreen = () => {
  const {user, token} = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(
    null,
  );
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [slotsRetry, setSlotsRetry] = useState(0);
  const [search, setSearch] = useState('');

  const filteredDoctors = useMemo(
    () =>
      doctors.filter(d => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          d.fullName.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          (d.department || '').toLowerCase().includes(q) ||
          d.expertise.some(e => e.toLowerCase().includes(q)) ||
          d.languages.some(l => l.toLowerCase().includes(q))
        );
      }),
    [doctors, search],
  );

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctorId) {
        setTimeSlots([]);
        setSelectedTimeSlotId(null);
        return;
      }

      setSlotsLoading(true);
      setSlotsError(null);
      setSelectedTimeSlotId(null);

      try {
        const today = new Date();
        const appointmentDate = new Date(today);
        appointmentDate.setHours(0, 0, 0, 0);
        const dateStr = appointmentDate.toISOString().split('T')[0];

        const url = `${SLOTS_API}?doctorId=${selectedDoctorId}&appointmentDate=${dateStr}`;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(url, {
          method: 'GET',
          headers,
        });
        const data = await response.json();

        if (response.ok && data.success && Array.isArray(data.data)) {
          const formattedSlots: TimeSlot[] = data.data.map((item: any) => ({
            id: item._id || item.id || String(Math.random()),
            time: item.time || item.slotTime || '',
            available: item.available !== false,
          }));
          setTimeSlots(formattedSlots);
        } else {
          setSlotsError(data.message || 'Failed to fetch time slots');
          setTimeSlots([]);
        }
      } catch (err) {
        console.error('Failed to fetch time slots:', err);
        setSlotsError('Network error. Please try again.');
        setTimeSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDoctorId, slotsRetry]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        let page = 1;
        let totalPages = 1;
        const allItems: any[] = [];

        do {
          const res = await fetch(`${DOCTORS_API}?page=${page}&limit=10`, {
            method: 'GET',
            headers,
          });
          const json = await res.json();
          if (res.ok && json.success && Array.isArray(json.data?.data)) {
            allItems.push(...json.data.data);
            totalPages = json.data.totalPages || 1;
          } else {
            console.log('Doctors API error:', json?.message);
            if (page === 1) {
              setError(json?.message || 'Failed to fetch doctors');
            }
            break;
          }
          page++;
        } while (page <= totalPages);

        const formattedDoctors: Doctor[] = allItems.map((item: any) => ({
          _id: item._id,
          userId: item.userId,
          fullName: item.fullName?.trim() || 'Doctor',
          email: item.email,
          phone: item.phone,
          expertise: Array.isArray(item.expertise) ? item.expertise : [],
          languages: Array.isArray(item.languages) ? item.languages : [],
          rating: typeof item.rating === 'number' ? item.rating : 0,
          reviewsCount:
            typeof item.reviewsCount === 'number' ? item.reviewsCount : 0,
          patientsCount:
            typeof item.patientsCount === 'number' ? item.patientsCount : 0,
          status: item.status || 'Inactive',
          isProfileCompleted: !!item.isProfileCompleted,
          isActive: !!item.isActive,
          isDeleted: !!item.isDeleted,
          address: item.address,
          availableDays: item.availableDays,
          availableTime: item.availableTime,
          bloodGroup: item.bloodGroup,
          consultationFee:
            item.consultationFee !== undefined && item.consultationFee !== null
              ? String(item.consultationFee)
              : undefined,
          dateOfBirth: item.dateOfBirth,
          department: item.department || item.specialization || 'General',
          experience: item.experience || 'Not specified',
          gender: item.gender,
          licenseNumber: item.licenseNumber,
          qualifications: item.qualifications,
          specialization: item.specialization || 'General',
          availabilityId: item.availabilityId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        setDoctors(formattedDoctors);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [token]);

  useEffect(() => {
    const loginUserId = user?.id || user?._id;
    if (loginUserId && !profileUserId) {
      setProfileUserId(loginUserId);
    }
  }, [user?.id, user?._id, profileUserId]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const profile = await fetchUserProfile(token);
        if (profile) {
          setProfile(profile);
          const profileId = profile.id || profile._id || user?.id || user?._id;
          if (profileId) {
            setProfileUserId(profileId);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile for userId:', err);
      }
    };

    fetchProfile();
  }, [token, user?.id]);

  const selectedDoctor = doctors.find(d => d._id === selectedDoctorId);
  const selectedTimeSlot = timeSlots.find(s => s.id === selectedTimeSlotId);

  const handleBookAppointment = async () => {
    if (!selectedDoctorId || !selectedTimeSlotId) {
      Alert.alert(
        'Incomplete Selection',
        'Please select a doctor and a time slot first.',
      );
      return;
    }
    const effectiveUserId = user?.id || user?._id || profileUserId;
    const today = new Date();
    const appointmentDate = new Date(today);
    appointmentDate.setHours(0, 0, 0, 0);
    const startDateTime = parseTimeToDate(selectedTimeSlot!.time, today);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);
    const payload = {
      patientId: effectiveUserId,
      doctorId: selectedDoctor!._id,
      scheduledBy: 'PATIENT',
      appointmentDate: appointmentDate.toISOString(),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      duration: 30,
      appointmentType: 'CLINIC',
      symptoms: symptoms.trim() || 'General consultation',
      notes: notes.trim() || '',
    };
    console.log('Booking payload:', JSON.stringify(payload, null, 2));
    setBooking(true);
    let authToken = token;
    if (!authToken) {
      try {
        const storedToken = await AsyncStorage.getItem('@auth_token');
        if (storedToken) {
          authToken = storedToken;
        }
      } catch (err) {
        console.error('Error reading token from AsyncStorage:', err);
      }
    }

    if (!authToken) {
      Alert.alert('Error', 'No authentication token found. Please login again.');
      setBooking(false);
      return;
    }

    console.log('Token being sent to booking API:', authToken);
    console.log('Token starts with eyJ (JWT):', authToken.startsWith('eyJ'));
    console.log('Token is UUID format:', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(authToken));

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    };
console.log(authToken,"this is toke ");
    try {
      const response = await fetch(BOOKING_API, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        Alert.alert(
          'Appointment Booked',
          `Your appointment with ${selectedDoctor?.fullName} at ${selectedTimeSlot?.time} has been confirmed.`,
          [
            {
              text: 'OK',
              onPress: () => {
                setSelectedDoctorId(null);
                setSelectedTimeSlotId(null);
                setSymptoms('');
                setNotes('');
              },
            },
          ],
        );
      } else {
        Alert.alert(
          'Booking Failed',
          data.message || 'Something went wrong. Please try again.',
        );
      }
    } catch (err) {
      console.error('Booking error:', err);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const handleSelectDoctor = (id: string) => {
    setSelectedDoctorId(id);
    setSelectedTimeSlotId(null);
  };

  const handleSelectTimeSlot = (id: string) => {
    const slot = timeSlots.find(s => s.id === id);
    if (slot?.available) {
      setSelectedTimeSlotId(id);
    }
  };

  const isBookingEnabled =
    selectedDoctorId !== null && selectedTimeSlotId !== null;

  const openWhatsApp = () => {
    if (!selectedDoctorId || !selectedTimeSlotId) {
      Alert.alert(
        'Incomplete Selection',
        'Please select a doctor and a time slot first.',
      );
      return;
    }

    const phoneNumber = WHATSAPP_NUMBER.replace(/\s+/g, '');
    const message = `Hello, I would like to book an appointment with ${selectedDoctor?.fullName} at ${selectedTimeSlot?.time}. Please confirm.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.substring(
      1,
    )}?text=${encodedMessage}`;

    Linking.canOpenURL(whatsappUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert('Error', 'WhatsApp is not installed on this device');
        }
      })
      .catch(err => {
        Alert.alert('Error', 'Could not open WhatsApp');
        console.error(err);
      });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#D6336C', '#F06292', '#F8B4C2']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>
        <View style={styles.blobOne} />
        <View style={styles.blobTwo} />
        <Text style={styles.headerGreeting}>
          {profile?.name || user?.name || 'Hello'}
        </Text>
        <Text style={styles.headerTitle}>
          {strings.bookAppointment || 'Book Appointment'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {strings.appointmentSubtitle || 'Consult with pregnancy experts'}
        </Text>
        <View style={styles.headerStatBar}>
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>{doctors.length}</Text>
            <Text style={styles.headerStatLabel}>Doctors</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>
              {doctors.filter(d => d.rating > 0).length}
            </Text>
            <Text style={styles.headerStatLabel}>Reviewed</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStatItem}>
            <Text style={styles.headerStatValue}>
              {doctors.filter(d => d.isProfileCompleted).length}
            </Text>
            <Text style={styles.headerStatLabel}>Available</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {strings.availableDoctors || 'Available Doctors'}
          </Text>

          {!loading && !error && filteredDoctors.length > 0 && (
            <View style={styles.searchWrapper}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, specialty or language"
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Text style={styles.searchClear}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#D6336C" />
              <Text style={styles.loadingText}>Loading doctors...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => setLoading(true)}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredDoctors.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No doctors match your search.
              </Text>
            </View>
          ) : (
            filteredDoctors.map(doctor => (
              <React.Fragment key={doctor._id}>
                <TouchableOpacity
                  style={[
                    styles.doctorCard,
                    selectedDoctorId === doctor._id &&
                      styles.doctorCardSelected,
                  ]}
                  onPress={() => handleSelectDoctor(doctor._id)}
                  activeOpacity={0.85}>
                  <LinearGradient
                    colors={AVATAR_GRADIENTS[
                      doctor._id.charCodeAt(doctor._id.length - 1) %
                        AVATAR_GRADIENTS.length
                    ]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.doctorAvatar}>
                    <Text style={styles.doctorAvatarText}>
                      {getInitials(doctor.fullName)}
                    </Text>
                  </LinearGradient>
                  <View style={styles.doctorInfo}>
                    <View style={styles.doctorNameRow}>
                      <Text style={styles.doctorName} numberOfLines={1}>
                        {doctor.fullName}
                      </Text>
                      {doctor.gender === 'Female' && (
                        <Text style={styles.genderIcon}>♀</Text>
                      )}
                    </View>
                    <Text style={styles.doctorSpecialty} numberOfLines={1}>
                      {doctor.specialization}
                    </Text>
                    <View style={styles.doctorMetaRow}>
                      <View style={styles.metaChip}>
                        <Text style={styles.metaChipText}>
                          ⭐{' '}
                          {doctor.rating > 0
                            ? `${doctor.rating.toFixed(1)} (${doctor.reviewsCount})`
                            : 'New'}
                        </Text>
                      </View>
                      {doctor.consultationFee &&
                        Number(doctor.consultationFee) > 0 && (
                          <View style={styles.feeChip}>
                            <Text style={styles.feeChipText}>
                              ₹{doctor.consultationFee}
                            </Text>
                          </View>
                        )}
                    </View>
                    <Text style={styles.doctorDepartment} numberOfLines={1}>
                      {doctor.department} · {doctor.experience}
                    </Text>
                  </View>
                  {selectedDoctorId === doctor._id && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedIndicatorText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {selectedDoctorId === doctor._id && (
                  <View style={styles.expandedDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Qualification:</Text>
                      <Text style={styles.detailValue}>
                        {doctor.qualifications || 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Consultation Fee:</Text>
                      <Text style={styles.detailValue}>
                        ₹{doctor.consultationFee || 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Available:</Text>
                      <Text style={styles.detailValue}>
                        {doctor.availableDays || 'N/A'} (
                        {doctor.availableTime || 'N/A'})
                      </Text>
                    </View>
                    {doctor.address && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Address:</Text>
                        <Text style={styles.detailValue}>{doctor.address}</Text>
                      </View>
                    )}
                    {doctor.expertise.length > 0 && (
                      <View style={styles.tagsContainer}>
                        {doctor.expertise.map((tag, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    {doctor.languages.length > 0 && (
                      <View style={styles.languagesRow}>
                        <Text style={styles.detailLabel}>Languages: </Text>
                        <Text style={styles.detailValue}>
                          {doctor.languages.join(', ')}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </React.Fragment>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {strings.availableTimeSlots || 'Available Time Slots'}
          </Text>
          {slotsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#D6336C" />
              <Text style={styles.loadingText}>Loading time slots...</Text>
            </View>
          ) : slotsError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{slotsError}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => setSlotsRetry(prev => prev + 1)}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : !selectedDoctorId ? (
            <Text style={styles.emptyText}>
              Please select a doctor to view available slots.
            </Text>
          ) : timeSlots.length === 0 ? (
            <Text style={styles.emptyText}>
              No slots available for the selected doctor today.
            </Text>
          ) : (
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map(slot => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlot,
                    slot.available
                      ? styles.availableSlot
                      : styles.unavailableSlot,
                    selectedTimeSlotId === slot.id && styles.timeSlotSelected,
                  ]}
                  disabled={!slot.available}
                  onPress={() => handleSelectTimeSlot(slot.id)}>
                  <Text
                    style={[
                      styles.timeSlotText,
                      slot.available
                        ? styles.availableSlotText
                        : styles.unavailableSlotText,
                      selectedTimeSlotId === slot.id &&
                        styles.timeSlotTextSelected,
                    ]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Symptoms (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe your symptoms"
            placeholderTextColor="#999"
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Any additional notes for the doctor"
            placeholderTextColor="#999"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.bookingSection}>
          {isBookingEnabled && (
            <View style={styles.selectedSummary}>
              <Text style={styles.summaryText}>
                📋 {selectedDoctor?.fullName} at {selectedTimeSlot?.time}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.bookButton,
              (!isBookingEnabled || booking) && styles.bookButtonDisabled,
            ]}
            onPress={handleBookAppointment}
            disabled={!isBookingEnabled || booking}>
            <LinearGradient
              colors={
                isBookingEnabled && !booking
                  ? ['#D6336C', '#F06292']
                  : ['#B0BEC5', '#78909C']
              }
              style={styles.bookButtonGradient}>
              {booking ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.bookButtonText}>
                  {isBookingEnabled
                    ? 'Confirm Appointment'
                    : 'Select Doctor & Time First'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={openWhatsApp}>
            <Text style={styles.whatsappButtonText}>💬 Book via WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  blobOne: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    opacity: 0.12,
  },
  blobTwo: {
    position: 'absolute',
    bottom: -60,
    left: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    opacity: 0.08,
  },
  headerStatBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 18,
  },
  headerStatItem: {flex: 1, alignItems: 'center'},
  headerStatValue: {fontSize: 18, fontWeight: '800', color: '#FFFFFF'},
  headerStatLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.85,
    marginTop: 2,
  },
  headerStatDivider: {width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.3)'},
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3D4DC',
  },
  searchIcon: {fontSize: 15, marginRight: 8},
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  searchClear: {
    fontSize: 15,
    color: '#9CA3AF',
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerGreeting: {
    fontSize: 16,
    color: '#FFF5F7',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFF5F7',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#D6336C',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  doctorCardSelected: {
    borderColor: '#D6336C',
    backgroundColor: '#FFF0F3',
  },
  doctorAvatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  doctorAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  doctorNameRow: {flexDirection: 'row', alignItems: 'center'},
  genderIcon: {
    fontSize: 13,
    color: '#EC4899',
    marginLeft: 6,
    fontWeight: '700',
  },
  doctorMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 6,
  },
  metaChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  metaChipText: {fontSize: 11, color: '#92400E', fontWeight: '700'},
  feeChip: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  feeChipText: {fontSize: 11, color: '#047857', fontWeight: '700'},
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#D6336C',
    marginBottom: 4,
  },
  doctorExperience: {
    fontSize: 12,
    color: '#666',
  },
  doctorDepartment: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: '#FFF0F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D6336C',
  },
  selectedIndicator: {
    marginLeft: 8,
    backgroundColor: '#D6336C',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  expandedDetails: {
    backgroundColor: '#FFF0F3',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginTop: -8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D6336C',
    width: 120,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFD6E0',
  },
  tagText: {
    fontSize: 12,
    color: '#D6336C',
    fontWeight: '500',
  },
  languagesRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  availableSlot: {
    backgroundColor: '#FFFFFF',
    borderColor: '#34D399',
  },
  unavailableSlot: {
    backgroundColor: '#F5F5F5',
    borderColor: '#DDDDDD',
  },
  timeSlotSelected: {
    borderColor: '#D6336C',
    backgroundColor: '#FFE4E9',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  availableSlotText: {
    color: '#34D399',
  },
  unavailableSlotText: {
    color: '#999',
  },
  timeSlotTextSelected: {
    color: '#D6336C',
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  bookingSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  selectedSummary: {
    backgroundColor: '#FFF0F3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'center',
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D6336C',
  },
  bookButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 12,
    width: '100%',
  },
  bookButtonDisabled: {
    opacity: 0.7,
  },
  bookButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  whatsappButton: {
    borderRadius: 30,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: '#25D366',
    paddingVertical: 14,
    alignItems: 'center',
  },
  whatsappButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default AppointmentScreen;
