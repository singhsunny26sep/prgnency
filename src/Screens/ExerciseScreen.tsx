import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/Route';
import strings from '../../localization';

type ExerciseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Exercise'>;

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  trimester: string[];
  image: string;
  instructions: string[];
}

const exercises: Exercise[] = [
  {
    id: '1',
    title: 'Prenatal Yoga Flow',
    description: 'Gentle stretching and breathing exercises',
    duration: '20 min',
    difficulty: 'Easy',
    trimester: ['1', '2', '3'],
    image: '🧘',
    instructions: [
      'Start with deep breathing for 2 minutes',
      'Gentle neck rotations (5 each side)',
      'Shoulder rolls (10 forward, 10 backward)',
      'Seated cat-cow stretches (10 reps)',
      'Hip circles (10 each direction)',
      'End with 3 minutes of meditation',
    ],
  },
  {
    id: '2',
    title: 'Walking Workout',
    description: 'Low-impact cardio for all trimesters',
    duration: '30 min',
    difficulty: 'Easy',
    trimester: ['1', '2', '3'],
    image: '🚶',
    instructions: [
      'Warm-up: 5 min slow pace',
      'Main workout: 20 min moderate pace',
      'Cool-down: 5 min slow walking',
      'Total: 30 minutes daily',
      'Stay hydrated throughout',
    ],
  },
  {
    id: '3',
    title: 'Strength Training',
    description: 'Light weights for muscle tone',
    duration: '25 min',
    difficulty: 'Moderate',
    trimester: ['2', '3'],
    image: '🏋️',
    instructions: [
      'Wall push-ups: 2 sets of 12',
      'Seated dumbbell curls: 2 sets of 10',
      'Leg raises while lying: 2 sets of 12',
      'Kegel exercises: 3 sets of 15',
      'Rest 30 seconds between sets',
    ],
  },
  {
    id: '4',
    title: 'Pelvic Floor exercises',
    description: 'Strengthen muscles for childbirth',
    duration: '10 min',
    difficulty: 'Easy',
    trimester: ['1', '2', '3'],
    image: '💪',
    instructions: [
      'Sit or lie comfortably',
      'Tighten pelvic floor muscles',
      'Hold for 5 seconds',
      'Relax for 5 seconds',
      'Repeat 10-15 times',
      'Do 3 sets daily',
    ],
  },
  {
    id: '5',
    title: 'Swimming & Water Aerobics',
    description: 'Low-impact exercise in water',
    duration: '45 min',
    difficulty: 'Moderate',
    trimester: ['2', '3'],
    image: '🏊',
    instructions: [
      'Warm-up: 5 min walking in pool',
      'Water walking: 15 min',
      'Leg kicks holding edge: 10 min',
      'Water arm circles: 10 min',
      'Cool-down: 5 min slow movement',
    ],
  },
  {
    id: '6',
    title: 'Pilates for Pregnancy',
    description: 'Core strengthening with care',
    duration: '30 min',
    difficulty: 'Challenging',
    trimester: ['2'],
    image: '🤸',
    instructions: [
      'Concentrate on breathing',
      'Pelvic tilts: 15 reps',
      'Side leg raises: 10 each side',
      'Modified plank on knees: 20 seconds',
      'Avoid lying flat on back',
    ],
  },
];

const ExerciseScreen = () => {
  const navigation = useNavigation<ExerciseScreenNavigationProp>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTrimester, setSelectedTrimester] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const difficulties = ['All', 'Easy', 'Moderate', 'Challenging'];
  const trimesters = ['All', '1', '2', '3'];

  const filteredExercises = exercises.filter(ex => {
    const matchesDifficulty = selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty;
    const matchesTrimester = selectedTrimester === 'All' || ex.trimester.includes(selectedTrimester);
    return matchesDifficulty && matchesTrimester;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Moderate': return '#FF9800';
      case 'Challenging': return '#D6336C';
      default: return '#666';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.exercise || 'Exercise'}</Text>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Difficulty</Text>
        <View style={styles.buttonRow}>
          {difficulties.map(diff => (
            <TouchableOpacity
              key={diff}
              style={[styles.filterButton, selectedDifficulty === diff && styles.filterButtonActive]}
              onPress={() => setSelectedDifficulty(diff)}
            >
              <Text style={[styles.filterButtonText, selectedDifficulty === diff && styles.filterButtonTextActive]}>{diff}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.trimesterSection}>
        <Text style={styles.filterLabel}>Trimester</Text>
        <View style={styles.trimesterButtons}>
          {trimesters.map(trim => (
            <TouchableOpacity
              key={trim}
              style={[styles.trimButton, selectedTrimester === trim && styles.trimButtonActive]}
              onPress={() => setSelectedTrimester(trim)}
            >
              <Text style={[styles.trimButtonText, selectedTrimester === trim && styles.trimButtonTextActive]}>
                {trim === 'All' ? 'All' : `Tri ${trim}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.exercisesList}>
        <Text style={styles.resultCount}>{filteredExercises.length} exercises</Text>

        {filteredExercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseEmoji}>{exercise.image}</Text>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <View style={styles.exerciseMeta}>
                  <View style={[styles.badge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                    <Text style={styles.badgeText}>{exercise.difficulty}</Text>
                  </View>
                  <Text style={styles.durationText}>⏱️ {exercise.duration}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.exerciseDesc}>{exercise.description}</Text>

            {expandedId === exercise.id && (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>Instructions:</Text>
                {exercise.instructions.map((inst, idx) => (
                  <View key={idx} style={styles.instructionItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.instructionText}>{inst}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => toggleExpand(exercise.id)}
            >
              <Text style={styles.expandButtonText}>
                {expandedId === exercise.id ? 'Show Less' : 'View Instructions'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.warningBanner}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningText}>
          Always consult your doctor before starting any exercise routine during pregnancy.
        </Text>
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
  filterSection: { padding: 16 },
  filterLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  buttonRow: { flexDirection: 'row', gap: 8 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  filterButtonActive: { backgroundColor: '#D6336C', borderColor: '#D6336C' },
  filterButtonText: { fontSize: 13, color: '#666' },
  filterButtonTextActive: { color: '#fff', fontWeight: '500' },
  trimesterSection: { paddingHorizontal: 16, marginBottom: 8 },
  trimesterButtons: { flexDirection: 'row', gap: 8 },
  trimButton: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  trimButtonActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  trimButtonText: { fontSize: 13, color: '#666' },
  trimButtonTextActive: { color: '#fff', fontWeight: '500' },
  exercisesList: { padding: 16 },
  resultCount: { fontSize: 13, color: '#666', marginBottom: 12 },
  exerciseCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1 },
  exerciseHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  exerciseEmoji: { fontSize: 40, marginRight: 12 },
  exerciseInfo: { flex: 1 },
  exerciseTitle: { fontSize: 17, fontWeight: '600', color: '#333', marginBottom: 4 },
  exerciseMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  durationText: { fontSize: 13, color: '#666' },
  exerciseDesc: { fontSize: 14, color: '#666', marginTop: 8, lineHeight: 20 },
  instructionsContainer: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  instructionsTitle: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 8 },
  instructionItem: { flexDirection: 'row', marginBottom: 6 },
  bulletPoint: { fontSize: 14, color: '#D6336C', marginRight: 8, fontWeight: 'bold' },
  instructionText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 18 },
  expandButton: { marginTop: 12, alignItems: 'center' },
  expandButtonText: { fontSize: 14, color: '#D6336C', fontWeight: '500' },
  warningBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF4E4', padding: 16, margin: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#FF9800' },
  warningIcon: { fontSize: 24, marginRight: 12 },
  warningText: { flex: 1, fontSize: 13, color: '#333', lineHeight: 18 },
});

export default ExerciseScreen;

