import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/AuthContext';
import { fetchUserProfile } from '../services/ProfileService';

const API_BASE = 'https://api.hiranyagarbhsanskar.co/hiranyagarbha';
const MyProfileScreen = () => {
  const navigation = useNavigation();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState({ label: '', value: '', key: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await fetchUserProfile(token);
        setProfileData(profile);
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        setError(err?.message || 'Could not load your profile.');
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token, reloadKey]);

  const handleRetry = () => {
    setReloadKey(prev => prev + 1);
  };

  const handleEdit = (key: string, label: string, currentValue: string) => {
    setEditField({ key, label, value: currentValue });
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    if (!editField.value.trim()) {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/users/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [editField.key]: editField.value.trim() }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProfileData((prev: any) => ({ ...prev, [editField.key]: editField.value.trim() }));
        setEditModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', data.message || 'Failed to update');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const menuItems = [
    { icon: '📱', label: 'Mobile', value: profileData?.mobile || user?.mobile || 'Not set', key: 'mobile', editable: false },
    { icon: '📧', label: 'Email', value: profileData?.email || user?.email || 'Not set', key: 'email', editable: false },
    { icon: '👤', label: 'Full Name', value: profileData?.name || user?.name || 'Not set', key: 'name', editable: true },
    { icon: '🎂', label: 'Pregnancy Week', value: profileData?.pregnancyWeek || 'Not updated', key: 'pregnancyWeek', editable: true },
    { icon: '📍', label: 'City', value: profileData?.city || 'Not set', key: 'city', editable: true },
  ];

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D6336C" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorTitle}>Profile unavailable</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
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
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => item.editable && handleEdit(item.key, item.label, String(item.value))}
              disabled={!item.editable}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuValue}>{item.value}</Text>
              </View>
              {item.editable ? (
                <Text style={styles.editArrow}>✎</Text>
              ) : (
                <Text style={styles.menuArrow}>›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Notification' as any)}>
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
            <Text style={styles.statValue}>{profileData?.pregnancyWeek || '12'}</Text>
            <Text style={styles.statLabel}>Weeks Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{40 - (profileData?.pregnancyWeek || 12)}</Text>
            <Text style={styles.statLabel}>Weeks Remaining</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{(40 - (profileData?.pregnancyWeek || 12)) * 7}</Text>
            <Text style={styles.statLabel}>Days to Go</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField.label}</Text>
            <TextInput
              style={styles.modalInput}
              value={editField.value}
              onChangeText={text => setEditField({ ...editField, value: text })}
              placeholder={`Enter ${editField.label.toLowerCase()}`}
              placeholderTextColor="#999"
              multiline={editField.key === 'city'}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F7', padding: 24 },
  errorTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 8 },
  errorText: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 16, lineHeight: 19 },
  retryButton: { backgroundColor: '#D6336C', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
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
  editArrow: { fontSize: 18, color: '#D6336C' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, width: '85%', maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16, textAlign: 'center' },
  modalInput: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, fontSize: 16, color: '#333', marginBottom: 20, minHeight: 50 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F0F0F0' },
  saveButton: { backgroundColor: '#D6336C' },
  cancelButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default MyProfileScreen;