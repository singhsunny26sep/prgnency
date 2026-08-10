import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/AuthContext';
import strings from '../../localization';

const API_URL = 'https://api.hiranyagarbhsanskar.co/hiranyagarbha/users/get';

interface UserProfile {
  name?: string;
  mobile?: string;
  email?: string;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout, token } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('User profile API response:', data);

        if (response.ok && data.success) {
          setUserProfile(data.data || data);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleLogout = async () => {
    Alert.alert(
      strings.Logout || 'लॉग आउट',
      strings.logoutConfirm || 'क्या आप लॉग आउट करना चाहते हैं?',
      [
        { text: strings.cancel || 'रद्द करें', style: 'cancel' },
        {
          text: strings.Logout || 'लॉग आउट',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const menuItems = [
    { id: '1', title: strings.myProfile || 'मेरा प्रोफ़ाइल', icon: '👤', screen: 'MyProfile' },
    { id: '2', title: strings.premiumMenu || 'प्रीमियम', icon: '👑', screen: 'Premium' },
    { id: '3', title: strings.myOrders || 'मेरे आदेश', icon: '📦', screen: 'MyOrders' },
    { id: '4', title: strings.ProductsPlans || 'उत्पाद एवं योजनाएँ', icon: '🛒', screen: 'ProductsTab' },
    { id: '5', title: strings.morningDashboard || 'Morning Dashboard', icon: '📊', screen: 'MorningDashboard' },
    { id: '6', title: strings.changeLanguage || 'भाषा बदलें', icon: '🌐', screen: 'Language' },
    { id: '7', title: strings.privacyPolicy || 'निजी नीति', icon: '🔒', screen: 'PrivacyPolicy' },
    { id: '8', title: strings.termsConditions || 'सेवा की शर्तें', icon: '📄', screen: 'TermsConditions' },
    { id: '9', title: strings.helpSupport || 'सहायता', icon: '❓', screen: 'ContactUs' },
    { id: '10', title: strings.Logout || 'लॉग आउट', icon: '🚪', action: 'logout' },
  ];

  const handlePress = (item: { screen?: string; action?: string }) => {
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.screen) {
      if (item.screen === 'ProductsTab') {
        (navigation as any).navigate('Products');
      } else {
        navigation.getParent()?.navigate(item.screen as never);
      }
    }
  };

  const userName = userProfile?.name || strings.userName || 'अंजलि शर्मा';
  const userPhone = userProfile?.mobile 
    ? `+91 ${userProfile.mobile}` 
    : strings.userPhone || '+91 9876543210';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        {loading ? (
          <ActivityIndicator color="#D6336C" />
        ) : (
          <>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userPhone}>{userPhone}</Text>
          </>
        )}
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFE4E9',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D6336C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  menuArrow: {
    fontSize: 20,
    color: '#999',
  },
});

export default ProfileScreen;

