import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import strings from '../../localization';

const API_URL =
  'https://hiranyagarbha.onrender.com/hiranyagarbha/contact-us/create';

const ContactUsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [isPermissionGiven, setIsPermissionGiven] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !mobile || !city || !message) {
      Alert.alert(
        strings.contactError || 'त्रुटि',
        strings.contactFillAllFields || 'कृपया सभी फ़ील्ड भरें',
      );
      return;
    }
    if (!isPermissionGiven) {
      Alert.alert(
        strings.contactError || 'त्रुटि',
        strings.contactPermissionRequired || 'कृपया अनुमति दें',
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          mobile: `91${mobile}`,
          city,
          message,
          isPermissionGiven: true,
        }),
      });

      const data = await response.json();
      console.log('Contact API response:', data);

      if (response.ok) {
        Alert.alert(
          strings.contactSuccess || 'सफल',
          strings.contactSuccessMessage ||
            'आपका संदेश भेजा गया है। हम जल्द ही आपसे संपर्क करेंगे।',
        );
        setName('');
        setEmail('');
        setMobile('');
        setCity('');
        setMessage('');
        setIsPermissionGiven(false);
      } else {
        Alert.alert(
          strings.contactError || 'त्रुटि',
          data.message ||
            strings.contactErrorMessage ||
            'संदेश भेजने में विफल। कृपया पुनः प्रयास करें।',
        );
      }
    } catch (error) {
      console.error('Contact API error:', error);
      Alert.alert(
        strings.contactError || 'त्रुटि',
        strings.contactNetworkError ||
          'सर्वर से जुड़ने में विफल। कृपया अपना इंटरनेट जाँचें।',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {strings.contactTitle || 'संपर्क करें'}
        </Text>
        <Text style={styles.subtitle}>
          {strings.contactSubtitle || 'हमसे संपर्क करने के लिए नीचे भरें'}
        </Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>{strings.fullname || 'पूरा नाम'}</Text>
          <TextInput
            style={styles.input}
            placeholder={strings.enterYourFullname || 'अपना पूरा नाम दर्ज करें'}
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>{strings.Email || 'ईमेल'}</Text>
          <TextInput
            style={styles.input}
            placeholder={strings.enterYourEmail || 'अपना ईमेल दर्ज करें'}
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>{strings.userMo || 'मोबाइल नंबर'}</Text>
          <View style={styles.phoneInput}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder={strings.enterusermo || 'अपना मोबाइल नंबर दर्ज करें'}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          <Text style={styles.label}>{strings.city || 'शहर'}</Text>
          <TextInput
            style={styles.input}
            placeholder={strings.cityPlaceholder || 'अपना शहर दर्ज करें'}
            placeholderTextColor="#999"
            value={city}
            onChangeText={setCity}
          />

          <Text style={styles.label}>{strings.message || 'संदेश'}</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder={strings.messagePlaceholder || 'अपना संदेश लिखें'}
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsPermissionGiven(!isPermissionGiven)}>
            <View
              style={[
                styles.checkbox,
                isPermissionGiven && styles.checkboxChecked,
              ]}>
              {isPermissionGiven && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              {strings.contactPermission ||
                'मैं सहमत हूँ कि आप मेरे डेटा का उपयोग कर सकते हैं'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {strings.contactSubmit || 'भेजें'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF5F7'},
  content: {flex: 1, paddingHorizontal: 24, paddingTop: 40},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {marginBottom: 24},
  label: {fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '500'},
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
    marginBottom: 16,
  },
  countryCode: {fontSize: 16, color: '#333', fontWeight: '500', marginRight: 8},
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
    marginBottom: 16,
    color: '#333',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#D6336C',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#D6336C',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
  },
  checkboxLabel: {flex: 1, fontSize: 13, color: '#666'},
  button: {
    backgroundColor: '#D6336C',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {fontSize: 16, color: '#fff', fontWeight: '600'},
});

export default ContactUsScreen;
