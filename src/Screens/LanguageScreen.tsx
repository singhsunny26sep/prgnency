import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../../localization';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

const LanguageScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem('appLanguage');
      if (storedLang) {
        setSelectedLanguage(storedLang);
      }
    };
    loadLanguage();
  }, []);

  const handleLanguageChange = async (langCode: string) => {
    try {
      await AsyncStorage.setItem('appLanguage', langCode);
      strings.setLanguage(langCode);
      setSelectedLanguage(langCode);
      Alert.alert(
        strings.languageChanged || 'भाषा बदली गई',
        strings.languageRestartMessage || 'कृपया ऐप को पुनः शुरू करने के लिए बंद करके खोलें'
      );
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{strings.changeLanguage || 'भाषा बदलें'}</Text>
        <Text style={styles.subtitle}>{strings.chooseLanguage || 'अपनी पसंदीदा भाषा चुनें'}</Text>

        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageItem,
              selectedLanguage === lang.code && styles.selectedLanguageItem,
            ]}
            onPress={() => handleLanguageChange(lang.code)}
          >
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{lang.nativeName}</Text>
              <Text style={styles.languageEnglish}>({lang.name})</Text>
            </View>
            {selectedLanguage === lang.code && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    justifyContent: 'space-between',
  },
  selectedLanguageItem: {
    borderWidth: 2,
    borderColor: '#D6336C',
  },
  languageInfo: { flex: 1 },
  languageName: { fontSize: 18, color: '#333', fontWeight: '500', marginBottom: 2 },
  languageEnglish: { fontSize: 13, color: '#999' },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D6336C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default LanguageScreen;