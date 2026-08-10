import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/Route';
import strings from '../../localization';

type BabyNamesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BabyNames'>;

interface BabyName {
  id: string;
  name: string;
  meaning: string;
  origin: string;
  gender: 'boy' | 'girl' | 'unisex';
  startingLetter?: string;
}

const babyNames: BabyName[] = [
  { id: '1', name: 'Aarav', meaning: 'Peaceful', origin: 'Sanskrit', gender: 'boy' },
  { id: '2', name: 'Aarya', meaning: 'Noble', origin: 'Sanskrit', gender: 'girl' },
  { id: '3', name: 'Advait', meaning: 'Unique', origin: 'Sanskrit', gender: 'boy' },
  { id: '4', name: 'Ananya', meaning: 'Incomparable', origin: 'Sanskrit', gender: 'girl' },
  { id: '5', name: 'Arjun', meaning: 'Bright', origin: 'Sanskrit', gender: 'boy' },
  { id: '6', name: 'Diya', meaning: 'Light', origin: 'Sanskrit', gender: 'girl' },
  { id: '7', name: 'Ishaan', meaning: 'Lord Shiva', origin: 'Sanskrit', gender: 'boy' },
  { id: '8', name: 'Ishita', meaning: 'Desired', origin: 'Sanskrit', gender: 'girl' },
  { id: '9', name: 'Krishna', meaning: 'Dark', origin: 'Sanskrit', gender: 'boy', startingLetter: 'K' },
  { id: '10', name: 'Kavya', meaning: 'Poetry', origin: 'Sanskrit', gender: 'girl', startingLetter: 'K' },
  { id: '11', name: 'Reyansh', meaning: 'Ray of light', origin: 'Sanskrit', gender: 'boy', startingLetter: 'R' },
  { id: '12', name: 'Riya', meaning: 'Singer', origin: 'Sanskrit', gender: 'girl', startingLetter: 'R' },
  { id: '13', name: 'Vihaan', meaning: 'Dawn', origin: 'Sanskrit', gender: 'boy', startingLetter: 'V' },
  { id: '14', name: 'Varida', meaning: 'River', origin: 'Sanskrit', gender: 'girl', startingLetter: 'V' },
  { id: '15', name: 'Sai', meaning: 'Divine', origin: 'Sanskrit', gender: 'unisex', startingLetter: 'S' },
];

const alphabets = ['A', 'B', 'C', 'D', 'G', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Y'];

const BabyNamesScreen = () => {
  const navigation = useNavigation<BabyNamesScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'boy' | 'girl'>('all');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredNames = babyNames.filter(name => {
    const matchesSearch = name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         name.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = selectedGender === 'all' || name.gender === selectedGender || name.gender === 'unisex';
    const matchesLetter = !selectedLetter || name.startingLetter === selectedLetter;
    return matchesSearch && matchesGender && matchesLetter;
  });

  const toggleFavorite = (nameId: string) => {
    setFavorites(prev =>
      prev.includes(nameId)
        ? prev.filter(id => id !== nameId)
        : [...prev, nameId]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{strings.babyNames || 'Baby Names'}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or meaning..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Gender</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.filterButton, selectedGender === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedGender('all')}
          >
            <Text style={[styles.filterButtonText, selectedGender === 'all' && styles.filterButtonTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedGender === 'boy' && styles.filterButtonActive]}
            onPress={() => setSelectedGender('boy')}
          >
            <Text style={[styles.filterButtonText, selectedGender === 'boy' && styles.filterButtonTextActive]}>Boy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedGender === 'girl' && styles.filterButtonActive]}
            onPress={() => setSelectedGender('girl')}
          >
            <Text style={[styles.filterButtonText, selectedGender === 'girl' && styles.filterButtonTextActive]}>Girl</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.alphabetSection}>
        <Text style={styles.filterLabel}>Starting Letter</Text>
        <View style={styles.alphabetScroll}>
          <TouchableOpacity
            style={[styles.letterButton, !selectedLetter && styles.letterButtonActive]}
            onPress={() => setSelectedLetter(null)}
          >
            <Text style={[styles.letterText, !selectedLetter && styles.letterTextActive]}>All</Text>
          </TouchableOpacity>
          {alphabets.map(letter => (
            <TouchableOpacity
              key={letter}
              style={[styles.letterButton, selectedLetter === letter && styles.letterButtonActive]}
              onPress={() => setSelectedLetter(letter)}
            >
              <Text style={[styles.letterText, selectedLetter === letter && styles.letterTextActive]}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.resultsSection}>
        <Text style={styles.resultCount}>{filteredNames.length} names found</Text>

        {filteredNames.map((name) => (
          <View key={name.id} style={styles.nameCard}>
            <View style={styles.nameHeader}>
              <View>
                <Text style={styles.nameText}>{name.name}</Text>
                <Text style={styles.nameMeta}>{name.origin} • {name.gender.charAt(0).toUpperCase() + name.gender.slice(1)}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(name.id)}>
                <Text style={styles.favoriteIcon}>{favorites.includes(name.id) ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.meaningText}>Meaning: {name.meaning}</Text>
          </View>
        ))}
      </View>

      {favorites.length > 0 && (
        <View style={styles.favoritesBanner}>
          <Text style={styles.favoritesBannerText}>
            {favorites.length} name{favorites.length > 1 ? 's' : ''} favorited
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', elevation: 2 },
  backButton: { padding: 8 },
  backIcon: { fontSize: 24, color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginLeft: 16 },
  searchContainer: { padding: 16 },
  searchInput: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#ddd' },
  filterSection: { paddingHorizontal: 16, marginBottom: 12 },
  filterLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  buttonGroup: { flexDirection: 'row', gap: 8 },
  filterButton: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  filterButtonActive: { backgroundColor: '#D6336C', borderColor: '#D6336C' },
  filterButtonText: { fontSize: 13, color: '#666', fontWeight: '500' },
  filterButtonTextActive: { color: '#fff' },
  alphabetSection: { paddingHorizontal: 16, marginBottom: 12 },
  alphabetScroll: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  letterButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  letterButtonActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  letterText: { fontSize: 12, color: '#666', fontWeight: '600' },
  letterTextActive: { color: '#fff' },
  resultsSection: { paddingHorizontal: 16, paddingBottom: 80 },
  resultCount: { fontSize: 13, color: '#666', marginBottom: 12 },
  nameCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, elevation: 1 },
  nameHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nameText: { fontSize: 18, fontWeight: '600', color: '#333' },
  nameMeta: { fontSize: 12, color: '#999', marginTop: 2 },
  favoriteIcon: { fontSize: 24 },
  meaningText: { fontSize: 13, color: '#666', marginTop: 8, fontStyle: 'italic' },
  favoritesBanner: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#D6336C', padding: 16, alignItems: 'center' },
  favoritesBannerText: { color: '#fff', fontWeight: '600' },
});

export default BabyNamesScreen;

