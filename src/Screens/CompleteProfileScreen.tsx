import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import strings from '../../localization';
import {useAuth} from '../Context/AuthContext';
import {RootStackParamList} from '../Navigation/Route';
import {
  DoctorOption,
  EMPTY_PROFILE,
  fetchDoctors,
  fetchPatientProfile,
  submitCompleteProfile,
} from '../services/PatientProfileService';

const localized = strings as unknown as Record<string, string | undefined>;

const EN: Record<string, string> = {
  completeProfileTitle: 'Complete Your Profile',
  completeProfileSubtitle:
    'Accurate details help us take better care of your pregnancy.',
  prefillInfo: 'Previously saved details have been loaded. Please review them.',
  personalDetails: 'Personal Details',
  fullName: 'Full Name',
  namePlaceholder: 'Enter your full name',
  husbandOrParentName: "Husband's / Father's Name",
  husbandNamePlaceholder: 'Enter name',
  profession: 'Occupation',
  professionPlaceholder: 'e.g. Software Engineer',
  dobLabel: 'Date of Birth',
  age: 'Age',
  selectDate: 'Select date',
  bloodGroup: 'Blood Group',
  height: 'Height',
  weight: 'Weight',
  heightHint: 'Enter height in feet.inches, e.g. 5.4',
  contactDetails: 'Contact Details',
  email: 'Email',
  phone: 'Mobile Number',
  whatsappLabel: 'WhatsApp Number',
  address: 'Address',
  addressPlaceholder: 'Enter full address',
  pregnancyDetails: 'Pregnancy Details',
  pregnancySubtitle: 'Tell us about your pregnancy',
  lmpLabel: 'Last Menstrual Period (LMP)',
  eddLabel: 'Expected Delivery Date (EDD)',
  trimester: 'Trimester',
  trimesterFirstLabel: 'First (1-13 weeks)',
  trimesterSecondLabel: 'Second (14-27 weeks)',
  trimesterThirdLabel: 'Third (28-40 weeks)',
  gravida: 'Gravida (G)',
  para: 'Para (P)',
  abortions: 'Abortions (A)',
  previousDeliveries: 'Previous Deliveries',
  previousDeliveriesSubtitle: 'Add your earlier deliveries, if any',
  previousDelivery: 'Delivery',
  year: 'Year',
  deliveryBabyWeight: 'Baby Weight',
  deliveryType: 'Delivery Type',
  complicationsPlaceholder: 'Complications (if any)',
  addDelivery: 'Add Delivery',
  normalDelivery: 'Normal',
  caesareanDelivery: 'C-Section',
  otherDelivery: 'Other',
  medicalInfo: 'Medical Information',
  medicalConditions: 'Medical Conditions',
  conditionPlaceholder: 'Add another',
  add: 'Add',
  medications: 'Current Medications',
  medication: 'Medication',
  medicineName: 'Medicine name',
  dosage: 'Dosage',
  frequency: 'Frequency',
  addMedication: 'Add Medication',
  onceADay: 'Once a day',
  twiceADay: 'Twice a day',
  thriceADay: 'Thrice a day',
  weekly: 'Once a week',
  asNeeded: 'As needed',
  doctorDetails: "Doctor's Information",
  doctorSubtitle: 'Select your doctor or enter the details manually',
  selectDoctor: 'Select Doctor',
  searchDoctor: 'Search doctors',
  noDoctorFound: 'No doctors found',
  doctorName: 'Doctor Name',
  specialization: 'Specialization',
  specializationPlaceholder: 'Obstetrics & Gynaecology',
  hospital: 'Hospital',
  hospitalPlaceholder: 'Hiranyagarbha Care',
  doctorPhone: 'Doctor Phone',
  doctorEmail: 'Doctor Email',
  moreInfo: 'More Information',
  heardAbout: 'How did you hear about us?',
  friendOrFamily: 'Friend / Family',
  other: 'Other',
  expectations: 'Your expectations from us',
  expectationsPlaceholder: 'What do you expect from us?',
  preferredLanguage: 'Preferred Language',
  hindiLang: 'Hindi',
  englishLang: 'English',
  marathiLang: 'Marathi',
  bengaliLang: 'Bengali',
  tamilLang: 'Tamil',
  teluguLang: 'Telugu',
  kannadaLang: 'Kannada',
  gujaratiLang: 'Gujarati',
  emergencyContact: 'Emergency Contact',
  contactName: 'Contact Name',
  contactNamePlaceholder: 'Rohit Verma',
  relationship: 'Relationship',
  husband: 'Husband',
  father: 'Father',
  mother: 'Mother',
  brother: 'Brother',
  emergencyPhone: 'Emergency Phone',
  emergencyAddress: 'Address',
  saveAndContinue: 'Save and Continue',
  privacyNote:
    'Your information is secure and is used only for your care.',
  fieldRequired: 'This field is required',
  invalidPhone: 'Enter a valid 10-digit mobile number',
  invalidEmail: 'Enter a valid email address',
  pleaseCheckFields: 'Please check the highlighted fields.',
  errorTitle: 'Error',
  success: 'Success',
  profileSaved: 'Your profile has been saved successfully.',
  profileSaveFailed: 'Could not save your profile. Please try again.',
  pickerCancel: 'Cancel',
  pickerDone: 'Done',
};

const t = (key: string): string => localized[key] || EN[key] || key;

const PINK = '#D6336C';
const PINK_SOFT = '#FFE4E9';
const TEXT = '#333';
const MUTED = '#8A8A8A';
const BORDER = '#E4E4E4';
const SURFACE = '#FFFFFF';
const PAGE_BG = '#FFF5F7';
const BRAND = 'HiranyaGarbha Sanskar';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TRIMESTERS = [
  {value: 'first', label: t('trimesterFirstLabel')},
  {value: 'second', label: t('trimesterSecondLabel')},
  {value: 'third', label: t('trimesterThirdLabel')},
];
const DELIVERY_TYPES = [
  {value: 'normal', label: t('normalDelivery')},
  {value: 'caesarean', label: t('caesareanDelivery')},
  {value: 'other', label: t('otherDelivery')},
];
const MEDICATION_FREQUENCIES = [
  t('onceADay'),
  t('twiceADay'),
  t('thriceADay'),
  t('weekly'),
  t('asNeeded'),
];
const COMMON_CONDITIONS = [
  'Anemia',
  'Diabetes',
  'Thyroid',
  'BP / High Blood Pressure',
  'PCOS',
  'Asthma',
  'None',
];
const HEARD_ABOUT = [
  'Instagram',
  'Facebook',
  'YouTube',
  'WhatsApp',
  t('friendOrFamily'),
  t('other'),
];
const LANGUAGES = [
  t('hindiLang'),
  t('englishLang'),
  t('marathiLang'),
  t('bengaliLang'),
  t('tamilLang'),
  t('teluguLang'),
  t('kannadaLang'),
  t('gujaratiLang'),
];
const RELATIONSHIPS = [
  t('husband'),
  t('father'),
  t('mother'),
  t('brother'),
  t('other'),
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const toISODate = (date: Date): string => {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const parseISODate = (iso: string): Date => {
  const [year, month, day] = (iso || '').split('-').map(Number);
  if (!year || !month || !day) {
    return new Date();
  }
  return new Date(year, month - 1, day);
};

const displayDate = (iso: string): string => {
  if (!iso) {
    return '';
  }
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) {
    return iso;
  }
  return `${day} ${MONTHS[month - 1]} ${year}`;
};

const calculateAge = (dobISO: string): string => {
  if (!dobISO) {
    return '';
  }
  const dob = parseISODate(dobISO);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age > 0 ? String(age) : '';
};

const calculateEdd = (lmpISO: string): string => {
  if (!lmpISO) {
    return '';
  }
  const edd = parseISODate(lmpISO);
  edd.setDate(edd.getDate() + 280);
  return toISODate(edd);
};

const trimesterFromLmp = (lmpISO: string): string => {
  if (!lmpISO) {
    return '';
  }
  const lmp = parseISODate(lmpISO).getTime();
  const weeks = Math.floor((Date.now() - lmp) / (7 * 24 * 60 * 60 * 1000));
  if (weeks <= 0) {
    return '';
  }
  if (weeks < 14) {
    return 'first';
  }
  if (weeks < 28) {
    return 'second';
  }
  return 'third';
};

const isValidEmail = (value: string): boolean =>
  !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidPhone = (value: string): boolean =>
  !value || /^[0-9]{10}$/.test(value.trim());

type FormState = typeof EMPTY_PROFILE;

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({label, required, error, children}) => (
  <View style={styles.field}>
    <Text style={styles.label}>
      {label}
      {required ? <Text style={styles.required}> *</Text> : null}
    </Text>
    {children}
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const Section: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({title, subtitle, children}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {!!subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    {children}
  </View>
);

const OptionChips: React.FC<{
  options: {value: string; label: string}[];
  selected?: string;
  onSelect: (value: string) => void;
  multiple?: boolean;
  values?: string[];
}> = ({options, selected, onSelect, multiple, values}) => (
  <View style={styles.chipRow}>
    {options.map(option => {
      const active = multiple
        ? !!values?.includes(option.value)
        : selected === option.value;
      return (
        <TouchableOpacity
          key={option.value}
          style={[styles.chip, active && styles.chipActive]}
          onPress={() => onSelect(option.value)}>
          <Text style={[styles.chipText, active && styles.chipTextActive]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const DateFieldButton: React.FC<{
  value: string;
  placeholder: string;
  onPress: () => void;
}> = ({value, placeholder, onPress}) => (
  <TouchableOpacity
    style={styles.dateButton}
    onPress={onPress}
    activeOpacity={0.8}>
    <Text style={value ? styles.dateText : styles.datePlaceholder}>
      {value ? displayDate(value) : placeholder}
    </Text>
    <Icon name="calendar-month" size={moderateScale(20)} color={PINK} />
  </TouchableOpacity>
);

const RemoveButton: React.FC<{onPress: () => void}> = ({onPress}) => (
  <TouchableOpacity style={styles.removeButton} onPress={onPress}>
    <Icon name="close" size={moderateScale(18)} color="#EF4444" />
  </TouchableOpacity>
);

const CompleteProfileScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {user, token, updateUser} = useAuth();

  const [form, setForm] = useState<FormState>({
    ...EMPTY_PROFILE,
    phone: user?.mobile || '',
    whatsappNumber: user?.mobile || '',
    email: user?.email || '',
    fullName: user?.name || '',
    husbandOrParentName: '',
    emergencyContact: {...EMPTY_PROFILE.emergencyContact},
    doctorDetails: {...EMPTY_PROFILE.doctorDetails},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefilled, setPrefilled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dateTarget, setDateTarget] = useState<
    'dateOfBirth' | 'lmp' | 'edd' | null
  >(null);
  const [customCondition, setCustomCondition] = useState('');
  const [doctorModalVisible, setDoctorModalVisible] = useState(false);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');

  useEffect(() => {
    let active = true;
    fetchPatientProfile(token).then(saved => {
      if (!active || !saved) {
        return;
      }
      setForm(prev => ({
        ...prev,
        ...saved,
        doctorDetails: {...prev.doctorDetails, ...(saved.doctorDetails || {})},
        emergencyContact: {
          ...prev.emergencyContact,
          ...(saved.emergencyContact || {}),
        },
        previousDeliveries: Array.isArray(saved.previousDeliveries)
          ? saved.previousDeliveries
          : prev.previousDeliveries,
        medications: Array.isArray(saved.medications)
          ? saved.medications
          : prev.medications,
        medicalConditions: Array.isArray(saved.medicalConditions)
          ? saved.medicalConditions
          : prev.medicalConditions,
      }));
      setPrefilled(true);
    });
    return () => {
      active = false;
    };
  }, [token]);

  const pickerValue = useMemo(() => {
    if (dateTarget === 'dateOfBirth') {
      return parseISODate(form.dateOfBirth);
    }
    if (dateTarget === 'lmp') {
      return parseISODate(form.lmp);
    }
    return parseISODate(form.edd || form.lmp);
  }, [dateTarget, form.dateOfBirth, form.lmp, form.edd]);

  const pickerTitle =
    dateTarget === 'dateOfBirth'
      ? t('dobLabel')
      : dateTarget === 'lmp'
      ? t('lmpLabel')
      : t('eddLabel');

  const filteredDoctors = useMemo(() => {
    const query = doctorSearch.trim().toLowerCase();
    if (!query) {
      return doctors;
    }
    return doctors.filter(doctor =>
      `${doctor.fullName || ''} ${doctor.specialization || ''}`
        .toLowerCase()
        .includes(query),
    );
  }, [doctors, doctorSearch]);

  const clearError = (key: string) => {
    setErrors(prev => {
      if (!prev[key]) {
        return prev;
      }
      const next = {...prev};
      delete next[key];
      return next;
    });
  };

  const patch = (key: keyof FormState, value: any) => {
    setForm(prev => ({...prev, [key]: value}));
    clearError(key);
  };

  const applyDate = (target: 'dateOfBirth' | 'lmp' | 'edd', iso: string) => {
    if (target === 'dateOfBirth') {
      setForm(prev => ({...prev, dateOfBirth: iso, age: calculateAge(iso)}));
    } else if (target === 'lmp') {
      setForm(prev => ({
        ...prev,
        lmp: iso,
        edd: calculateEdd(iso),
        currentTrimester: trimesterFromLmp(iso) || prev.currentTrimester,
      }));
    } else {
      patch('edd', iso);
    }
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selected?: Date,
    closeAfter = true,
  ) => {
    const target = dateTarget;
    if (closeAfter) {
      setDateTarget(null);
    }
    if (event.type === 'dismissed' || !selected || !target) {
      return;
    }
    applyDate(target, toISODate(selected));
  };

  const toggleCondition = (condition: string) => {
    setForm(prev => {
      const list = prev.medicalConditions.includes(condition)
        ? prev.medicalConditions.filter(item => item !== condition)
        : [
            ...prev.medicalConditions.filter(item => item !== 'None'),
            condition,
          ];
      return {...prev, medicalConditions: list};
    });
  };

  const addCustomCondition = () => {
    const value = customCondition.trim();
    if (!value) {
      return;
    }
    setForm(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.includes(value)
        ? prev.medicalConditions
        : [...prev.medicalConditions, value],
    }));
    setCustomCondition('');
  };

  const addDelivery = () => {
    setForm(prev => ({
      ...prev,
      previousDeliveries: [
        ...prev.previousDeliveries,
        {year: '', type: 'normal', babyWeight: '', complications: ''},
      ],
    }));
  };

  const updateDelivery = (index: number, key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      previousDeliveries: prev.previousDeliveries.map((item, itemIndex) =>
        itemIndex === index ? {...item, [key]: value} : item,
      ),
    }));
  };

  const removeDelivery = (index: number) => {
    setForm(prev => ({
      ...prev,
      previousDeliveries: prev.previousDeliveries.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const addMedication = () => {
    setForm(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        {name: '', dosage: '', frequency: ''},
      ],
    }));
  };

  const updateMedication = (index: number, key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      medications: prev.medications.map((item, itemIndex) =>
        itemIndex === index ? {...item, [key]: value} : item,
      ),
    }));
  };

  const removeMedication = (index: number) => {
    setForm(prev => ({
      ...prev,
      medications: prev.medications.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const openDoctorPicker = async () => {
    setDoctorModalVisible(true);
    if (doctors.length) {
      return;
    }
    setDoctorsLoading(true);
    const list = await fetchDoctors(token);
    setDoctors(list);
    setDoctorsLoading(false);
  };

  const selectDoctor = (doctor: DoctorOption) => {
    setForm(prev => ({
      ...prev,
      primaryDoctor: doctor._id,
      doctorDetails: {
        doctorName: doctor.fullName || '',
        specialization: doctor.specialization || '',
        hospital: doctor.address || '',
        phone: doctor.phone || '',
        email: doctor.email || '',
      },
    }));
    setDoctorModalVisible(false);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) {
      next.fullName = t('fieldRequired');
    }
    if (!form.dateOfBirth) {
      next.dateOfBirth = t('fieldRequired');
    }
    if (!isValidPhone(form.phone)) {
      next.phone = t('invalidPhone');
    }
    if (!isValidPhone(form.whatsappNumber)) {
      next.whatsappNumber = t('invalidPhone');
    }
    if (!isValidEmail(form.email)) {
      next.email = t('invalidEmail');
    }
    if (!form.lmp) {
      next.lmp = t('fieldRequired');
    }
    if (!isValidPhone(form.emergencyContact.phone)) {
      next.emergencyContact = t('invalidPhone');
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert(t('errorTitle'), t('pleaseCheckFields'));
      return;
    }

    setSaving(true);
    try {
      const payload: FormState = {
        ...form,
        age: form.age || calculateAge(form.dateOfBirth),
        edd: form.edd || calculateEdd(form.lmp),
        currentTrimester: form.currentTrimester || trimesterFromLmp(form.lmp),
      };
      await submitCompleteProfile(payload, token);
      await updateUser({isSignUpCompleted: true, isProfileCompleted: true});
      Alert.alert(t('success'), t('profileSaved'), [
        {
          text: 'OK',
          onPress: () =>
            navigation.reset({index: 0, routes: [{name: 'MainTabs'}]}),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        t('errorTitle'),
        error?.message || t('profileSaveFailed'),
      );
    } finally {
      setSaving(false);
    }
  };

  const renderDelivery = (
    delivery: {
      year: string;
      type: string;
      babyWeight: string;
      complications: string;
    },
    index: number,
  ) => (
    <View key={`delivery-${index}`} style={styles.subCard}>
      <View style={styles.subCardHeader}>
        <Text style={styles.subCardTitle}>
          {t('previousDelivery')} {index + 1}
        </Text>
        <RemoveButton onPress={() => removeDelivery(index)} />
      </View>
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Text style={styles.miniLabel}>{t('year')}</Text>
          <TextInput
            style={styles.input}
            value={delivery.year}
            onChangeText={value => updateDelivery(index, 'year', value)}
            placeholder="2022"
            placeholderTextColor="#BDBDBD"
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.miniLabel}>{t('deliveryBabyWeight')}</Text>
          <TextInput
            style={styles.input}
            value={delivery.babyWeight}
            onChangeText={value => updateDelivery(index, 'babyWeight', value)}
            placeholder="2.9 kg"
            placeholderTextColor="#BDBDBD"
          />
        </View>
      </View>
      <Text style={styles.miniLabel}>{t('deliveryType')}</Text>
      <OptionChips
        options={DELIVERY_TYPES}
        selected={delivery.type}
        onSelect={value => updateDelivery(index, 'type', value)}
      />
      <TextInput
        style={[styles.input, styles.lastInput]}
        value={delivery.complications}
        onChangeText={value => updateDelivery(index, 'complications', value)}
        placeholder={t('complicationsPlaceholder')}
        placeholderTextColor="#BDBDBD"
      />
    </View>
  );

  const renderMedication = (
    medication: {name: string; dosage: string; frequency: string},
    index: number,
  ) => (
    <View key={`medication-${index}`} style={styles.subCard}>
      <View style={styles.subCardHeader}>
        <Text style={styles.subCardTitle}>
          {t('medication')} {index + 1}
        </Text>
        <RemoveButton onPress={() => removeMedication(index)} />
      </View>
      <TextInput
        style={styles.input}
        value={medication.name}
        onChangeText={value => updateMedication(index, 'name', value)}
        placeholder={t('medicineName')}
        placeholderTextColor="#BDBDBD"
      />
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Text style={styles.miniLabel}>{t('dosage')}</Text>
          <TextInput
            style={styles.input}
            value={medication.dosage}
            onChangeText={value => updateMedication(index, 'dosage', value)}
            placeholder="5mg"
            placeholderTextColor="#BDBDBD"
          />
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.miniLabel}>{t('frequency')}</Text>
          <TextInput
            style={styles.input}
            value={medication.frequency}
            onChangeText={value => updateMedication(index, 'frequency', value)}
            placeholder={MEDICATION_FREQUENCIES[0]}
            placeholderTextColor="#BDBDBD"
          />
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.brand}>{BRAND}</Text>
        <Text style={styles.title}>{t('completeProfileTitle')}</Text>
        <Text style={styles.subtitle}>{t('completeProfileSubtitle')}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {prefilled && (
          <View style={styles.infoBox}>
            <Icon name="information" size={moderateScale(18)} color="#2563EB" />
            <Text style={styles.infoText}>{t('prefillInfo')}</Text>
          </View>
        )}

        <Section title={t('personalDetails')}>
          <Field
            label={t('fullName')}
            required
            error={errors.fullName}>
            <TextInput
              style={styles.input}
              value={form.fullName}
              onChangeText={value => patch('fullName', value)}
              placeholder={t('namePlaceholder')}
              placeholderTextColor="#BDBDBD"
            />
          </Field>
          <Field
            label={t('husbandOrParentName')}
            error={errors.husbandOrParentName}>
            <TextInput
              style={styles.input}
              value={form.husbandOrParentName}
              onChangeText={value => patch('husbandOrParentName', value)}
              placeholder={t('husbandNamePlaceholder')}
              placeholderTextColor="#BDBDBD"
            />
          </Field>
          <Field label={t('profession')}>
            <TextInput
              style={styles.input}
              value={form.profession}
              onChangeText={value => patch('profession', value)}
              placeholder={t('professionPlaceholder')}
              placeholderTextColor="#BDBDBD"
            />
          </Field>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Field
                label={t('dobLabel')}
                required
                error={errors.dateOfBirth}>
                <DateFieldButton
                  value={form.dateOfBirth}
                  placeholder={t('selectDate')}
                  onPress={() => setDateTarget('dateOfBirth')}
                />
              </Field>
            </View>
            <View style={styles.rowItem}>
              <Field label={t('age')}>
                <TextInput
                  style={styles.input}
                  value={String(form.age || '')}
                  onChangeText={value =>
                    patch('age', value.replace(/[^0-9]/g, ''))
                  }
                  placeholder="29"
                  placeholderTextColor="#BDBDBD"
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </Field>
            </View>
          </View>
          <Field label={t('bloodGroup')}>
            <OptionChips
              options={BLOOD_GROUPS.map(value => ({value, label: value}))}
              selected={form.bloodGroup}
              onSelect={value => patch('bloodGroup', value)}
            />
          </Field>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Field label={t('height')}>
                <TextInput
                  style={styles.input}
                  value={form.height}
                  onChangeText={value => patch('height', value)}
                  placeholder="5.4"
                  placeholderTextColor="#BDBDBD"
                />
              </Field>
            </View>
            <View style={styles.rowItem}>
              <Field label={`${t('weight')} (kg)`}>
                <TextInput
                  style={styles.input}
                  value={form.weight}
                  onChangeText={value => patch('weight', value)}
                  placeholder="58"
                  placeholderTextColor="#BDBDBD"
                  keyboardType="numeric"
                />
              </Field>
            </View>
          </View>
          <Text style={styles.hint}>{t('heightHint')}</Text>
        </Section>

        <Section title={t('contactDetails')}>
          <Field label={t('email')} error={errors.email}>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={value => patch('email', value)}
              placeholder="name@email.com"
              placeholderTextColor="#BDBDBD"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Field>
          <Field label={t('phone')} required error={errors.phone}>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={value =>
                patch('phone', value.replace(/[^0-9]/g, '').slice(0, 10))
              }
              placeholder="9876500011"
              placeholderTextColor="#BDBDBD"
              keyboardType="number-pad"
              maxLength={10}
            />
          </Field>
          <Field label={t('whatsappLabel')} error={errors.whatsappNumber}>
            <TextInput
              style={styles.input}
              value={form.whatsappNumber}
              onChangeText={value =>
                patch(
                  'whatsappNumber',
                  value.replace(/[^0-9]/g, '').slice(0, 10),
                )
              }
              placeholder="9876500011"
              placeholderTextColor="#BDBDBD"
              keyboardType="number-pad"
              maxLength={10}
            />
          </Field>
          <Field label={t('address')}>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.address}
              onChangeText={value => patch('address', value)}
              placeholder={t('addressPlaceholder')}
              placeholderTextColor="#BDBDBD"
              multiline
            />
          </Field>
        </Section>

        <Section
          title={t('pregnancyDetails')}
          subtitle={t('pregnancySubtitle')}>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Field label={t('lmpLabel')} required error={errors.lmp}>
                <DateFieldButton
                  value={form.lmp}
                  placeholder={t('selectDate')}
                  onPress={() => setDateTarget('lmp')}
                />
              </Field>
            </View>
            <View style={styles.rowItem}>
              <Field label={t('eddLabel')}>
                <DateFieldButton
                  value={form.edd}
                  placeholder={t('selectDate')}
                  onPress={() => setDateTarget('edd')}
                />
              </Field>
            </View>
          </View>
          <Field label={t('trimester')}>
            <OptionChips
              options={TRIMESTERS}
              selected={form.currentTrimester}
              onSelect={value => patch('currentTrimester', value)}
            />
          </Field>
          <View style={styles.row}>
            {(['gravida', 'para', 'abortions'] as const).map(key => (
              <View style={styles.rowItem} key={key}>
                <Field label={t(key)}>
                  <TextInput
                    style={styles.input}
                    value={String((form as any)[key] ?? '')}
                    onChangeText={value =>
                      patch(key, value.replace(/[^0-9]/g, '').slice(0, 2))
                    }
                    placeholder="0"
                    placeholderTextColor="#BDBDBD"
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </Field>
              </View>
            ))}
          </View>
        </Section>

        <Section
          title={t('previousDeliveries')}
          subtitle={t('previousDeliveriesSubtitle')}>
          {form.previousDeliveries.map(renderDelivery)}
          <TouchableOpacity style={styles.addButton} onPress={addDelivery}>
            <Icon name="plus" size={moderateScale(18)} color={PINK} />
            <Text style={styles.addButtonText}>{t('addDelivery')}</Text>
          </TouchableOpacity>
        </Section>

        <Section title={t('medicalInfo')}>
          <Field label={t('medicalConditions')}>
            <OptionChips
              options={COMMON_CONDITIONS.map(value => ({value, label: value}))}
              multiple
              values={form.medicalConditions}
              onSelect={toggleCondition}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.rowItem]}
                value={customCondition}
                onChangeText={setCustomCondition}
                placeholder={t('conditionPlaceholder')}
                placeholderTextColor="#BDBDBD"
                onSubmitEditing={addCustomCondition}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.inlineButton}
                onPress={addCustomCondition}>
                <Text style={styles.inlineButtonText}>{t('add')}</Text>
              </TouchableOpacity>
            </View>
            {!!form.medicalConditions.length && (
              <OptionChips
                options={form.medicalConditions.map(value => ({
                  value,
                  label: value,
                }))}
                multiple
                values={form.medicalConditions}
                onSelect={toggleCondition}
              />
            )}
          </Field>
          <Field label={t('medications')}>
            {form.medications.map(renderMedication)}
            <TouchableOpacity style={styles.addButton} onPress={addMedication}>
              <Icon name="plus" size={moderateScale(18)} color={PINK} />
              <Text style={styles.addButtonText}>{t('addMedication')}</Text>
            </TouchableOpacity>
          </Field>
        </Section>

        <Section
          title={t('doctorDetails')}
          subtitle={t('doctorSubtitle')}>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={openDoctorPicker}>
            <Icon name="stethoscope" size={moderateScale(20)} color={PINK} />
            <Text style={styles.pickerButtonText}>
              {form.doctorDetails.doctorName || t('selectDoctor')}
            </Text>
            <Icon name="chevron-right" size={moderateScale(22)} color="#BDBDBD" />
          </TouchableOpacity>
          <Field label={t('doctorName')}>
            <TextInput
              style={styles.input}
              value={form.doctorDetails.doctorName}
              onChangeText={value =>
                setForm(prev => ({
                  ...prev,
                  doctorDetails: {...prev.doctorDetails, doctorName: value},
                }))
              }
              placeholder="Dr. Meera Sharma"
              placeholderTextColor="#BDBDBD"
            />
          </Field>
          <Field label={t('specialization')}>
            <TextInput
              style={styles.input}
              value={form.doctorDetails.specialization}
              onChangeText={value =>
                setForm(prev => ({
                  ...prev,
                  doctorDetails: {
                    ...prev.doctorDetails,
                    specialization: value,
                  },
                }))
              }
              placeholder={t('specializationPlaceholder')}
              placeholderTextColor="#BDBDBD"
            />
          </Field>
          <Field label={t('hospital')}>
            <TextInput
              style={styles.input}
              value={form.doctorDetails.hospital}
              onChangeText={value =>
                setForm(prev => ({
                  ...prev,
                  doctorDetails: {...prev.doctorDetails, hospital: value},
                }))
              }
              placeholder={t('hospitalPlaceholder')}
              placeholderTextColor="#BDBDBD"
            />
          </Field>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Field label={t('doctorPhone')}>
                <TextInput
                  style={styles.input}
                  value={form.doctorDetails.phone}
                  onChangeText={value =>
                    setForm(prev => ({
                      ...prev,
                      doctorDetails: {
                        ...prev.doctorDetails,
                        phone: value.replace(/[^0-9]/g, '').slice(0, 10),
                      },
                    }))
                  }
                  placeholder="9876543210"
                  placeholderTextColor="#BDBDBD"
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </Field>
            </View>
            <View style={styles.rowItem}>
              <Field label={t('doctorEmail')}>
                <TextInput
                  style={styles.input}
                  value={form.doctorDetails.email}
                  onChangeText={value =>
                    setForm(prev => ({
                      ...prev,
                      doctorDetails: {
                        ...prev.doctorDetails,
                        email: value,
                      },
                    }))
                  }
                  placeholder="doctor@email.com"
                  placeholderTextColor="#BDBDBD"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Field>
            </View>
          </View>
        </Section>

        <Section title={t('moreInfo')}>
          <Field label={t('heardAbout')}>
            <OptionChips
              options={HEARD_ABOUT.map(value => ({value, label: value}))}
              selected={form.heardAboutGarbhsanskar}
              onSelect={value => patch('heardAboutGarbhsanskar', value)}
            />
          </Field>
          <Field label={t('expectations')}>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.expectationsFromHiranyagarbha}
              onChangeText={value =>
                patch('expectationsFromHiranyagarbha', value)
              }
              placeholder={t('expectationsPlaceholder')}
              placeholderTextColor="#BDBDBD"
              multiline
            />
          </Field>
          <Field label={t('preferredLanguage')}>
            <OptionChips
              options={LANGUAGES.map(value => ({value, label: value}))}
              selected={form.preferredLanguage}
              onSelect={value => patch('preferredLanguage', value)}
            />
          </Field>
        </Section>

        <Section title={t('emergencyContact')}>
          <Field label={t('contactName')} required>
            <TextInput
              style={styles.input}
              value={form.emergencyContact.name}
              onChangeText={value =>
                setForm(prev => ({
                  ...prev,
                  emergencyContact: {
                    ...prev.emergencyContact,
                    name: value,
                  },
                }))
              }
              placeholder={t('contactNamePlaceholder')}
              placeholderTextColor="#BDBDBD"
            />
          </Field>
          <Field label={t('relationship')}>
            <OptionChips
              options={RELATIONSHIPS.map(value => ({value, label: value}))}
              selected={form.emergencyContact.relationship}
              onSelect={value =>
                setForm(prev => ({
                  ...prev,
                  emergencyContact: {
                    ...prev.emergencyContact,
                    relationship: value,
                  },
                }))
              }
            />
          </Field>
          <Field
            label={t('emergencyPhone')}
            required
            error={errors.emergencyContact}>
            <TextInput
              style={styles.input}
              value={form.emergencyContact.phone}
              onChangeText={value => {
                clearError('emergencyContact');
                setForm(prev => ({
                  ...prev,
                  emergencyContact: {
                    ...prev.emergencyContact,
                    phone: value.replace(/[^0-9]/g, '').slice(0, 10),
                  },
                }));
              }}
              placeholder="9876500022"
              placeholderTextColor="#BDBDBD"
              keyboardType="number-pad"
              maxLength={10}
            />
          </Field>
          <Field label={t('emergencyAddress')}>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.emergencyContact.address}
              onChangeText={value =>
                setForm(prev => ({
                  ...prev,
                  emergencyContact: {
                    ...prev.emergencyContact,
                    address: value,
                  },
                }))
              }
              placeholder={t('addressPlaceholder')}
              placeholderTextColor="#BDBDBD"
              multiline
            />
          </Field>
        </Section>

        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>{t('saveAndContinue')}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerNote}>{t('privacyNote')}</Text>
      </ScrollView>

      {dateTarget && Platform.OS !== 'ios' && (
        <DateTimePicker
          value={pickerValue}
          mode="date"
          maximumDate={new Date()}
          minimumDate={
            dateTarget === 'dateOfBirth' ? new Date(1990, 0, 1) : undefined
          }
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Modal
        visible={!!dateTarget && Platform.OS === 'ios'}
        transparent
        animationType="fade"
        onRequestClose={() => setDateTarget(null)}>
        <View style={styles.pickerOverlay}>
          <TouchableOpacity
            style={styles.pickerBackdrop}
            activeOpacity={1}
            onPress={() => setDateTarget(null)}
          />
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={() => setDateTarget(null)}>
                <Text style={styles.pickerCancel}>{t('pickerCancel')}</Text>
              </TouchableOpacity>
              <Text style={styles.pickerTitle}>{pickerTitle}</Text>
              <TouchableOpacity onPress={() => setDateTarget(null)}>
                <Text style={styles.pickerDone}>{t('pickerDone')}</Text>
              </TouchableOpacity>
            </View>
            {dateTarget && (
              <DateTimePicker
                value={pickerValue}
                mode="date"
                maximumDate={new Date()}
                minimumDate={
                  dateTarget === 'dateOfBirth' ? new Date(1990, 0, 1) : undefined
                }
                display="spinner"
                onChange={(event, selected) =>
                  handleDateChange(event, selected, false)
                }
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={doctorModalVisible}
        animationType="slide"
        onRequestClose={() => setDoctorModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('selectDoctor')}</Text>
            <TouchableOpacity onPress={() => setDoctorModalVisible(false)}>
              <Icon name="close" size={moderateScale(24)} color={TEXT} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={doctorSearch}
            onChangeText={setDoctorSearch}
            placeholder={t('searchDoctor')}
            placeholderTextColor="#BDBDBD"
          />
          {doctorsLoading ? (
            <ActivityIndicator style={styles.modalLoader} color={PINK} />
          ) : (
            <FlatList
              data={filteredDoctors}
              keyExtractor={item => item._id}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.emptyText}>{t('noDoctorFound')}</Text>
              }
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.doctorRow}
                  onPress={() => selectDoctor(item)}>
                  <View style={styles.doctorAvatar}>
                    <Icon
                      name="stethoscope"
                      size={moderateScale(20)}
                      color={PINK}
                    />
                  </View>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{item.fullName}</Text>
                    <Text style={styles.doctorSpecialization}>
                      {item.specialization || ''}
                    </Text>
                  </View>
                  <Icon
                    name="chevron-right"
                    size={moderateScale(22)}
                    color="#BDBDBD"
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: PAGE_BG},
  header: {
    backgroundColor: PINK_SOFT,
    paddingTop: verticalScale(48),
    paddingBottom: verticalScale(20),
    paddingHorizontal: scale(20),
  },
  brand: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: PINK,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: TEXT,
    marginTop: verticalScale(6),
  },
  subtitle: {
    fontSize: moderateScale(13),
    color: MUTED,
    marginTop: verticalScale(6),
    lineHeight: moderateScale(19),
  },
  scroll: {flex: 1},
  scrollContent: {padding: scale(16), paddingBottom: verticalScale(40)},
  section: {
    backgroundColor: SURFACE,
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: scale(16),
    elevation: 1,
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: TEXT,
    marginBottom: verticalScale(4),
  },
  sectionSubtitle: {
    fontSize: moderateScale(12),
    color: MUTED,
    marginBottom: verticalScale(10),
  },
  field: {marginBottom: verticalScale(14)},
  label: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#555',
    marginBottom: verticalScale(6),
  },
  miniLabel: {
    fontSize: moderateScale(11),
    color: MUTED,
    marginBottom: verticalScale(4),
  },
  required: {color: '#EF4444'},
  input: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(15),
    color: TEXT,
  },
  multiline: {minHeight: verticalScale(84), textAlignVertical: 'top'},
  lastInput: {marginTop: verticalScale(10)},
  errorText: {
    fontSize: moderateScale(11),
    color: '#EF4444',
    marginTop: verticalScale(4),
  },
  hint: {fontSize: moderateScale(11), color: MUTED, marginTop: -verticalScale(6)},
  row: {flexDirection: 'row', gap: scale(10)},
  rowItem: {flex: 1},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: scale(8)},
  chip: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipActive: {backgroundColor: PINK, borderColor: PINK},
  chipText: {fontSize: moderateScale(13), color: '#555'},
  chipTextActive: {color: '#fff', fontWeight: '600'},
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
  },
  dateText: {fontSize: moderateScale(15), color: TEXT},
  datePlaceholder: {fontSize: moderateScale(15), color: '#BDBDBD'},
  subCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: BORDER,
    padding: scale(12),
    marginBottom: verticalScale(10),
  },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  subCardTitle: {fontSize: moderateScale(14), fontWeight: '700', color: TEXT},
  removeButton: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    borderWidth: 1,
    borderColor: PINK,
    borderStyle: 'dashed',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(11),
  },
  addButtonText: {fontSize: moderateScale(14), color: PINK, fontWeight: '600'},
  inlineButton: {
    backgroundColor: PINK_SOFT,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(18),
    justifyContent: 'center',
  },
  inlineButtonText: {
    color: PINK,
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    backgroundColor: PINK_SOFT,
    borderRadius: moderateScale(12),
    padding: scale(14),
    marginBottom: verticalScale(14),
  },
  pickerButtonText: {
    flex: 1,
    fontSize: moderateScale(15),
    color: TEXT,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    backgroundColor: '#EFF6FF',
    borderRadius: moderateScale(12),
    padding: scale(12),
    marginBottom: scale(16),
  },
  infoText: {
    flex: 1,
    fontSize: moderateScale(12),
    color: '#1D4ED8',
    lineHeight: moderateScale(18),
  },
  submitButton: {
    backgroundColor: PINK,
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  submitButtonDisabled: {opacity: 0.7},
  submitText: {color: '#fff', fontSize: moderateScale(16), fontWeight: '700'},
  footerNote: {
    fontSize: moderateScale(11),
    color: MUTED,
    textAlign: 'center',
    marginTop: verticalScale(14),
    lineHeight: moderateScale(17),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: PAGE_BG,
    padding: scale(16),
    paddingTop: verticalScale(48),
  },
  pickerOverlay: {flex: 1, justifyContent: 'flex-end'},
  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pickerSheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: scale(16),
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  pickerTitle: {fontSize: moderateScale(15), fontWeight: '700', color: TEXT},
  pickerCancel: {fontSize: moderateScale(15), color: MUTED},
  pickerDone: {fontSize: moderateScale(15), color: PINK, fontWeight: '700'},
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(14),
  },
  modalTitle: {fontSize: moderateScale(18), fontWeight: '700', color: TEXT},
  modalLoader: {marginTop: verticalScale(30)},
  emptyText: {
    textAlign: 'center',
    color: MUTED,
    marginTop: verticalScale(30),
    fontSize: moderateScale(14),
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    backgroundColor: SURFACE,
    borderRadius: moderateScale(12),
    padding: scale(12),
    marginTop: verticalScale(10),
  },
  doctorAvatar: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: PINK_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorInfo: {flex: 1},
  doctorName: {fontSize: moderateScale(15), fontWeight: '600', color: TEXT},
  doctorSpecialization: {
    fontSize: moderateScale(12),
    color: MUTED,
    marginTop: 2,
  },
});

export default CompleteProfileScreen;
