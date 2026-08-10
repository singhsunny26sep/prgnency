import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/Route';
import strings from '../../localization';

type NutritionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Nutrition'>;

interface NutritionTip {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const nutritionTipsByTrimester: { [key: string]: NutritionTip[] } = {
  'First Trimester': [
    { id: '1', title: 'Folate Rich Foods', description: 'Spinach, lentils, fortified grains for neural tube development', icon: '🥬', color: '#FFE4E9' },
    { id: '2', title: 'Stay Hydrated', description: 'Drink at least 8-10 glasses of water daily', icon: '💧', color: '#E4F9FF' },
    { id: '3', title: 'Small Frequent Meals', description: 'Eat 5-6 small meals to manage nausea and heartburn', icon: '🍽️', color: '#FFF4E4' },
    { id: '4', title: 'Vitamin B6', description: 'Bananas, nuts, and potatoes to reduce morning sickness', icon: '🍌', color: '#F0E4FF' },
  ],
  'Second Trimester': [
    { id: '5', title: 'Iron Rich Diet', description: 'Red meat, beans, and spinach for blood volume increase', icon: '🥩', color: '#FFE4E9' },
    { id: '6', title: 'Calcium Intake', description: 'Dairy or alternatives for baby bone development', icon: '🥛', color: '#E4F9FF' },
    { id: '7', title: 'Omega-3 Fatty Acids', description: 'Salmon, walnuts for baby brain development', icon: '🐟', color: '#FFF4E4' },
    { id: '8', title: 'Protein Power', description: 'Lean meats, eggs, legumes for tissue growth', icon: '🥚', color: '#E4FFE4' },
  ],
  'Third Trimester': [
    { id: '9', title: 'Extra Calories', description: 'Add 300-500 calories daily for baby growth', icon: '🔋', color: '#FFF4E4' },
    { id: '10', title: 'Fiber Rich Foods', description: 'Prevent constipation with whole grains and vegetables', icon: '🌾', color: '#E4F9FF' },
    { id: '11', title: 'Vitamin C', description: 'Citrus fruits for iron absorption and immunity', icon: '🍊', color: '#FFE4E9' },
    { id: '12', title: 'DHA Supplements', description: 'Support brain and eye development in final stages', icon: '🥚', color: '#E4FFE4' },
  ],
};

const foodsToAvoid = [
  { name: 'Raw/Undercooked Eggs', reason: 'Risk of Salmonella' },
  { name: 'Unpasteurized Dairy', reason: 'Listeria bacteria risk' },
  { name: 'Raw Fish & Sushi', reason: 'Parasites and bacteria' },
  { name: 'Deli Meats', reason: 'Listeria risk unless heated' },
  { name: 'High Mercury Fish', reason: 'Developmental toxicity' },
  { name: 'Alcohol', reason: 'Fetal Alcohol Spectrum Disorders' },
  { name: 'Excess Caffeine', reason: 'Limit to <200mg daily' },
  { name: 'Unwashed Produce', reason: 'Toxoplasma risk' },
];

const dailySupplements = [
  { name: 'Folic Acid', dosage: '400-800 mcg', timing: 'Daily, before conception & during pregnancy' },
  { name: 'Iron', dosage: '27 mg', timing: 'As prescribed by doctor' },
  { name: 'Calcium', dosage: '1000 mg', timing: 'With meals for better absorption' },
  { name: 'Vitamin D', dosage: '600 IU', timing: 'Daily with food' },
  { name: 'DHA/Omega-3', dosage: '200-300 mg', timing: 'With meals' },
  { name: 'Prenatal Vitamin', dosage: '1 tablet', timing: 'As directed' },
];

const NutritionScreen = () => {
  const navigation = useNavigation<NutritionScreenNavigationProp>();
  const [waterIntake, setWaterIntake] = useState(6);
  const [selectedTrimester, setSelectedTrimester] = useState('First Trimester');

  const incrementWater = () => setWaterIntake(prev => Math.min(prev + 1, 12));
  const decrementWater = () => setWaterIntake(prev => Math.max(prev - 1, 0));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.nutritionGuide || 'Nutrition Guide'}</Text>
      </View>

      <View style={styles.waterSection}>
        <View style={styles.waterCard}>
          <Text style={styles.waterIcon}>💧</Text>
          <Text style={styles.waterLabel}>Water Intake Today</Text>
          <View style={styles.waterRow}>
            <TouchableOpacity onPress={decrementWater} style={styles.waterButton}>
              <Text style={styles.waterButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.waterCount}>
              <Text style={styles.waterNumber}>{waterIntake}</Text>
              <Text style={styles.waterUnit}>glasses</Text>
            </View>
            <TouchableOpacity onPress={incrementWater} style={styles.waterButton}>
              <Text style={styles.waterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.waterGoal}>Goal: 8-10 glasses per day</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition by Trimester</Text>
        <View style={styles.trimesterTabs}>
          {Object.keys(nutritionTipsByTrimester).map((trimester) => (
            <TouchableOpacity
              key={trimester}
              style={[styles.trimesterTab, selectedTrimester === trimester && styles.trimesterTabActive]}
              onPress={() => setSelectedTrimester(trimester)}
            >
              <Text style={[styles.trimesterTabText, selectedTrimester === trimester && styles.trimesterTabTextActive]}>
                {trimester}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {nutritionTipsByTrimester[selectedTrimester].map((tip) => (
          <View key={tip.id} style={[styles.nutritionCard, { backgroundColor: tip.color }]}>
            <Text style={styles.nutritionIcon}>{tip.icon}</Text>
            <View style={styles.nutritionContent}>
              <Text style={styles.nutritionTitle}>{tip.title}</Text>
              <Text style={styles.nutritionDescription}>{tip.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.section, styles.supplementsSection]}>
        <Text style={styles.sectionTitle}>Daily Supplements</Text>
        {dailySupplements.map((supplement, index) => (
          <View key={index} style={styles.supplementCard}>
            <View style={styles.supplementHeader}>
              <Text style={styles.supplementName}>{supplement.name}</Text>
              <Text style={styles.supplementDosage}>{supplement.dosage}</Text>
            </View>
            <Text style={styles.supplementTiming}>{supplement.timing}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.section, styles.foodsToAvoidSection]}>
        <Text style={styles.sectionTitle}>Foods to Avoid</Text>
        <View style={styles.foodsGrid}>
          {foodsToAvoid.map((food, index) => (
            <View key={index} style={styles.foodCard}>
              <Text style={styles.foodEmoji}>⛔</Text>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodReason}>{food.reason}</Text>
            </View>
          ))}
        </View>
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
  waterSection: { padding: 16 },
  waterCard: { backgroundColor: '#4A90E2', borderRadius: 16, padding: 20, alignItems: 'center', elevation: 3 },
  waterIcon: { fontSize: 48, marginBottom: 8 },
  waterLabel: { fontSize: 14, color: '#fff', opacity: 0.9, marginBottom: 12 },
  waterRow: { flexDirection: 'row', alignItems: 'center', gap: 30 },
  waterButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  waterButtonText: { fontSize: 24, color: '#fff', fontWeight: '300' },
  waterCount: { alignItems: 'center' },
  waterNumber: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  waterUnit: { fontSize: 12, color: '#fff', opacity: 0.8 },
  waterGoal: { fontSize: 12, color: '#fff', marginTop: 12, opacity: 0.9 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  trimesterTabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  trimesterTab: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  trimesterTabActive: { backgroundColor: '#D6336C', borderColor: '#D6336C' },
  trimesterTabText: { fontSize: 13, color: '#666', fontWeight: '500' },
  trimesterTabTextActive: { color: '#fff' },
  nutritionCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderRadius: 12, marginBottom: 10 },
  nutritionIcon: { fontSize: 32, marginRight: 14 },
  nutritionContent: { flex: 1 },
  nutritionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  nutritionDescription: { fontSize: 13, color: '#666', lineHeight: 18 },
  supplementsSection: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 16, marginTop: 8 },
  supplementCard: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  supplementHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  supplementName: { fontSize: 15, fontWeight: '600', color: '#333' },
  supplementDosage: { fontSize: 13, color: '#D6336C', fontWeight: '600' },
  supplementTiming: { fontSize: 12, color: '#999' },
  foodsToAvoidSection: { marginBottom: 100 },
  foodsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  foodCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 14, elevation: 1, alignItems: 'center' },
  foodEmoji: { fontSize: 28, marginBottom: 6 },
  foodName: { fontSize: 13, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 4 },
  foodReason: { fontSize: 11, color: '#999', textAlign: 'center', lineHeight: 14 },
});

export default NutritionScreen;

