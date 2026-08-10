import React, {useState, useEffect} from 'react';
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

        console.log('Fetching doctors with token:', token);
        console.log('Request headers:', headers);

        const response = await fetch(DOCTORS_API, {
          method: 'GET',
          headers,
        });

        const data = await response.json();
        console.log('Doctors API response:', data);

        if (
          response.ok &&
          data.success &&
          data.data &&
          Array.isArray(data.data.data)
        ) {
          const formattedDoctors: Doctor[] = data.data.data.map(
            (item: any) => ({
              _id: item._id,
              userId: item.userId,
              fullName: item.fullName || 'Unknown Doctor',
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
              consultationFee: item.consultationFee,
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
            }),
          );
          setDoctors(formattedDoctors);
        } else {
          setError(data.message || 'Failed to fetch doctors');
        }
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
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/users/get`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        const data = await response.json();
        if (response.ok && data.success && data.data) {
          const profileId = data.data._id || data.data.id;
          if (profileId) {
            setProfileUserId(profileId);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile for userId:', err);
      }
    };

    fetchProfile();
  }, [token]);

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
        <Text style={styles.headerTitle}>
          {strings.bookAppointment || 'Book Appointment'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {strings.appointmentSubtitle || 'Consult with pregnancy experts'}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {strings.availableDoctors || 'Available Doctors'}
          </Text>

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
          ) : doctors.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No doctors available at the moment.
              </Text>
            </View>
          ) : (
            doctors.map(doctor => (
              <React.Fragment key={doctor._id}>
                <TouchableOpacity
                  style={[
                    styles.doctorCard,
                    selectedDoctorId === doctor._id &&
                      styles.doctorCardSelected,
                  ]}
                  onPress={() => handleSelectDoctor(doctor._id)}
                  activeOpacity={0.7}>
                  <View style={styles.doctorAvatar}>
                    <Text style={styles.doctorAvatarText}>👩‍⚕️</Text>
                  </View>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{doctor.fullName}</Text>
                    <Text style={styles.doctorSpecialty}>
                      {doctor.specialization}
                    </Text>
                    <Text style={styles.doctorExperience}>
                      {strings.experience || 'Experience'}: {doctor.experience}
                    </Text>
                    <Text style={styles.doctorDepartment}>
                      {doctor.department}
                    </Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>
                      ⭐ {doctor.rating > 0 ? doctor.rating.toFixed(1) : 'New'}
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE4E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  doctorAvatarText: {
    fontSize: 32,
  },
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
