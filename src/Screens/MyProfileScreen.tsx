import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, TextInput, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/AuthContext';
import { scale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchUserProfile, updateUserProfile, pickProfileImage, UpdateProfilePayload } from '../services/ProfileService';

const MyProfileScreen = () => {
  const navigation: any = useNavigation();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState({ label: '', value: '', key: '' });
  const [imageUri, setImageUri] = useState<string | null>(null);
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
        if (profile?.image) {
          setImageUri(profile.image.startsWith('http') ? profile.image : null);
        }
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

  const handlePickImage = async () => {
    const picked = await pickProfileImage();
    if (picked) {
      setEditField({ key: 'image', label: 'Profile Image', value: picked.path || picked.path || '' });
      setImageUri(picked.path);
      setEditModalVisible(true);
    }
  };

  const handleSave = async () => {
    if (!editField.value.trim() && editField.key !== 'image') {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }
    setSaving(true);
    try {
      const payload: UpdateProfilePayload = {};
      if (editField.key === 'name') payload.name = editField.value.trim();
      if (editField.key === 'address') payload.address = editField.value.trim();
      if (editField.key === 'email') payload.email = editField.value.trim();
      if (editField.key === 'mobile') payload.mobile = editField.value.trim();
      if (editField.key === 'dob') payload.dob = editField.value.trim();
      if (editField.key === 'image') payload.image = { path: editField.value, mime: 'image/jpeg', filename: 'profile.jpg' };

      const response = await updateUserProfile(payload, token);
      if (response.success) {
        setProfileData((prev: any) => ({ ...prev, [editField.key]: editField.value.trim() }));
        setEditModalVisible(false);
        Alert.alert('Success', response.message || 'Profile updated successfully');
        setReloadKey(prev => prev + 1);
      } else {
        Alert.alert('Error', response.message || 'Failed to update');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const menuItems = [
    { icon: '👤', label: 'Full Name', value: profileData?.name || user?.name || 'Not set', key: 'name', editable: true },
    { icon: '📱', label: 'Mobile', value: profileData?.mobile || user?.mobile || 'Not set', key: 'mobile', editable: true },
    { icon: '📧', label: 'Email', value: profileData?.email || user?.email || 'Not set', key: 'email', editable: true },
    { icon: '🎂', label: 'Date of Birth', value: profileData?.dob || profileData?.dateOfBirth || 'Not set', key: 'dob', editable: true },
    { icon: '📍', label: 'Address', value: profileData?.address || 'Not set', key: 'address', editable: true },
    { icon: '🖼️', label: 'Profile Image', value: 'Change photo', key: 'image', editable: true },
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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={moderateScale(22)} color="#666" />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Icon name="account" size={moderateScale(48)} color="#fff" />
              </View>
            )}
            <TouchableOpacity style={styles.editImageButton} onPress={handlePickImage}>
              <Icon name="camera" size={moderateScale(18)} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.userName}>{profileData?.name || user?.name || 'User Name'}</Text>
            <Text style={styles.userTag}>Pregnancy Journey</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => item.key === 'image' ? handlePickImage() : handleEdit(item.key, item.label, String(item.value))}
              disabled={!item.editable}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuValue}>{item.key === 'image' ? 'Tap to change photo' : item.value}</Text>
              </View>
              <Text style={styles.editArrow}>✎</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Notification' as any)}
          >
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
            {editField.key === 'image' ? (
              <View style={styles.imagePickerRow}>
                <Text style={styles.imageLabel}>Selected photo will be uploaded</Text>
                <TouchableOpacity style={styles.changeImageButton} onPress={handlePickImage}>
                  <Text style={styles.changeImageText}>Choose Another Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TextInput
                style={styles.modalInput}
                value={editField.value}
                onChangeText={text => setEditField({ ...editField, value: text })}
                placeholder={`Enter ${editField.label.toLowerCase()}`}
                placeholderTextColor="#999"
                keyboardType={editField.key === 'email' ? 'email-address' : editField.key === 'mobile' ? 'phone-pad' : 'default'}
                multiline={editField.key === 'address'}
              />
            )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFE4E9',
  },
  backButton: { padding: 8 },
  headerSpacer: { width: 44 },
  avatarContainer: { alignItems: 'center', position: 'relative', marginTop: 6 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#D6336C', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  editImageButton: {
    position: 'absolute',
    bottom: 60,
    right: 2,
    backgroundColor: '#D6336C',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
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
  editArrow: { fontSize: 18, color: '#D6336C' },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, elevation: 1 },
  actionIcon: { fontSize: 20, marginRight: 16 },
  actionText: { flex: 1, fontSize: 16, color: '#333' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  statCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 4, elevation: 1 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#D6336C' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, width: '85%', maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16, textAlign: 'center' },
  modalInput: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, fontSize: 16, color: '#333', marginBottom: 20, minHeight: 50 },
  imagePickerRow: { alignItems: 'center', marginBottom: 20 },
  imageLabel: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 12 },
  changeImageButton: { backgroundColor: '#F5F5F5', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  changeImageText: { color: '#D6336C', fontSize: 14, fontWeight: '600' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F0F0F0' },
  saveButton: { backgroundColor: '#D6336C' },
  cancelButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default MyProfileScreen;
