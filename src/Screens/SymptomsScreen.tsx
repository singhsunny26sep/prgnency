import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/Route';
import strings from '../../localization';

type SymptomsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Symptoms'>;

interface SymptomEntry {
  id: string;
  date: string;
  symptoms: string[];
  notes: string;
}

const commonSymptoms = [
  'Nausea', 'Vomiting', 'Fatigue', 'Breast Tenderness',
  'Food Cravings', 'Frequent Urination', 'Mood Swings', 'Headaches',
  'Back Pain', 'Constipation', 'Heartburn', 'Swelling',
];

const SymptomsScreen = () => {
  const navigation = useNavigation<SymptomsScreenNavigationProp>();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<SymptomEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      symptoms: ['Nausea', 'Fatigue', 'Breast Tenderness'],
      notes: 'Feeling very tired in the mornings',
    },
    {
      id: '2',
      date: '2024-01-14',
      symptoms: ['Headaches', 'Mood Swings'],
      notes: 'Mild headache throughout the day',
    },
  ]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSaveEntry = () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Error', 'Please select at least one symptom');
      return;
    }
    const newEntry: SymptomEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      symptoms: selectedSymptoms,
      notes,
    };
    setHistory([newEntry, ...history]);
    setSelectedSymptoms([]);
    setNotes('');
    Alert.alert('Success', 'Symptoms logged successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.symptomsTracker || 'Symptoms Tracker'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Symptoms</Text>
        <Text style={styles.sectionSubtitle}>Select all that apply</Text>

        <View style={styles.symptomsGrid}>
          {commonSymptoms.map((symptom) => (
            <TouchableOpacity
              key={symptom}
              style={[
                styles.symptomChip,
                selectedSymptoms.includes(symptom) && styles.symptomChipSelected,
              ]}
              onPress={() => toggleSymptom(symptom)}
            >
              <Text style={[
                styles.symptomText,
                selectedSymptoms.includes(symptom) && styles.symptomTextSelected,
              ]}>
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Additional Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How are you feeling today?"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
          <Text style={styles.saveButtonText}>Log Symptoms</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Recent Logs</Text>
        {history.map((entry) => (
          <View key={entry.id} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyDate}>{entry.date}</Text>
              <View style={styles.symptomTags}>
                {entry.symptoms.slice(0, 3).map((s) => (
                  <View key={s} style={styles.tag}>
                    <Text style={styles.tagText}>{s}</Text>
                  </View>
                ))}
                {entry.symptoms.length > 3 && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>+{entry.symptoms.length - 3}</Text>
                  </View>
                )}
              </View>
            </View>
            {entry.notes ? (
              <Text style={styles.historyNotes}>{entry.notes}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', elevation: 2 },
  backButton: { padding: 8 },
  backIcon: { fontSize: 24, color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginLeft: 16 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#666', marginBottom: 16 },
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symptomChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  symptomChipSelected: { backgroundColor: '#D6336C', borderColor: '#D6336C' },
  symptomText: { fontSize: 13, color: '#666' },
  symptomTextSelected: { color: '#fff', fontWeight: '500' },
  notesContainer: { marginTop: 20 },
  notesLabel: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 8 },
  notesInput: { backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 14, color: '#333', textAlignVertical: 'top', minHeight: 100, borderWidth: 1, borderColor: '#ddd' },
  saveButton: { backgroundColor: '#D6336C', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  saveButtonText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  historySection: { padding: 16, backgroundColor: '#fff', marginTop: 8 },
  historyCard: { padding: 16, borderRadius: 12, backgroundColor: '#FFF5F7', marginBottom: 12 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  historyDate: { fontSize: 12, color: '#999', fontWeight: '500' },
  symptomTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#FFE4E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, color: '#D6336C' },
  historyNotes: { fontSize: 13, color: '#666', marginTop: 8, lineHeight: 18 },
});

export default SymptomsScreen;

