import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../Context/AuthContext';
import strings from '../../localization';

const API_BASE = 'https://api.hiranyagarbhsanskar.co/hiranyagarbha';

const MyProfileScreen = () => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/users/get`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setProfileData(data.data);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const menuItems = [
    { icon: '📱', label: 'Mobile', value: profileData?.mobile || user?.mobile || 'Not set' },
    { icon: '📧', label: 'Email', value: profileData?.email || user?.email || 'Not set' },
    { icon: '👤', label: 'Full Name', value: profileData?.name || user?.name || 'Not set' },
    { icon: '🎂', label: 'Pregnancy Week', value: profileData?.pregnancyWeek || 'Not updated' },
    { icon: '📍', label: 'City', value: profileData?.city || 'Not set' },
  ];

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D6336C" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>{profileData?.name || user?.name || 'User Name'}</Text>
          <Text style={styles.userTag}>Pregnancy Journey</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {menuItems.map((item, index) => (
          <View key={index} style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuInfo}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuValue}>{item.value}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔔</Text>
          <Text style={styles.actionText}>Notifications</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔒</Text>
          <Text style={styles.actionText}>Privacy & Security</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>❓</Text>
          <Text style={styles.actionText}>Help & Support</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Weeks Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>28</Text>
          <Text style={styles.statLabel}>Weeks Remaining</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>156</Text>
          <Text style={styles.statLabel}>Days to Go</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F7' },
  header: { backgroundColor: '#FFE4E9', paddingVertical: 30, alignItems: 'center' },
  avatarContainer: { alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#D6336C', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 50 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  userTag: { fontSize: 14, color: '#D6336C' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, elevation: 1 },
  menuIcon: { fontSize: 24, marginRight: 16 },
  menuInfo: { flex: 1 },
  menuLabel: { fontSize: 12, color: '#999' },
  menuValue: { fontSize: 16, color: '#333', fontWeight: '500' },
  menuArrow: { fontSize: 20, color: '#999' },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, elevation: 1 },
  actionIcon: { fontSize: 20, marginRight: 16 },
  actionText: { flex: 1, fontSize: 16, color: '#333' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  statCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 4, elevation: 1 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#D6336C' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
});

export default MyProfileScreen;