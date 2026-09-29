import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../Context/AuthContext';
import { fetchUserProfile, UserProfile } from '../services/ProfileService';
import { fetchMySubscription, MySubscription } from '../services/SubscriptionCheckout';
import { scale, moderateScale } from 'react-native-size-matters';
import strings from '../../localization';

const formatDate = (value?: string) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const ActivePlanCard = ({
  subscription,
  loading,
  error,
  onRetry,
}: {
  subscription: MySubscription | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) => {
  if (loading) {
    return (
      <View style={styles.planCard}>
        <ActivityIndicator size="small" color="#D6336C" />
        <Text style={styles.planCardHint}>Loading your plan…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.planCard}>
        <Text style={styles.planCardTitle}>Active plan</Text>
        <Text style={styles.planError}>{error}</Text>
        <TouchableOpacity onPress={onRetry} style={styles.planRetry}>
          <Text style={styles.planRetryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!subscription) {
    return null;
  }

  const endDate = formatDate(subscription.endDate);
  const amountPaid = subscription.amountPaid;

  return (
    <View style={styles.planCard}>
      <View style={styles.planCardTop}>
        <Text style={styles.planCardTitle}>Active plan</Text>
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>
            {subscription.isActive ? 'ACTIVE' : subscription.status}
          </Text>
        </View>
      </View>

      <Text style={styles.planName}>{subscription.name}</Text>
      {!!subscription.subtitle && (
        <Text style={styles.planSubtitle}>{subscription.subtitle}</Text>
      )}

      <View style={styles.planMetaRow}>
        {!!subscription.subscriptionNumber && (
          <Text style={styles.planMeta}>{subscription.subscriptionNumber}</Text>
        )}
        {!!subscription.trimester && (
          <Text style={styles.planMeta}>
            {subscription.trimester} trimester
          </Text>
        )}
      </View>

      <View style={styles.planDivider} />

      <View style={styles.planStatRow}>
        {subscription.daysRemaining !== undefined && (
          <View style={styles.planStat}>
            <Text style={styles.planStatValue}>
              {subscription.daysRemaining}
            </Text>
            <Text style={styles.planStatLabel}>Days left</Text>
          </View>
        )}
        {subscription.durationInDays !== undefined && (
          <View style={styles.planStat}>
            <Text style={styles.planStatValue}>
              {subscription.durationInDays}
            </Text>
            <Text style={styles.planStatLabel}>Days total</Text>
          </View>
        )}
        {amountPaid !== undefined && amountPaid > 0 && (
          <View style={styles.planStat}>
            <Text style={styles.planStatValue}>
              ₹{amountPaid.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.planStatLabel}>Paid</Text>
          </View>
        )}
      </View>

      {!!endDate && (
        <Text style={styles.planFooter}>
          Valid till {endDate}
          {subscription.inGrace ? ' · Grace period' : ''}
        </Text>
      )}
    </View>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout, token, user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [subscription, setSubscription] = useState<MySubscription | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState<string | null>(null);
  const [planReloadKey, setPlanReloadKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const profile = await fetchUserProfile(token);
        setUserProfile(profile);
      } catch (err: any) {
        console.error('Failed to fetch user profile:', err);
        setError(err?.message || 'Could not load your profile.');
        setSessionExpired(err?.code === 'UNAUTHORIZED');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, reloadKey]);

  useEffect(() => {
    const loadPlan = async () => {
      if (!token) {
        setPlanLoading(false);
        return;
      }

      setPlanLoading(true);
      setPlanError(null);
      try {
        const data = await fetchMySubscription(token);
        setSubscription(data);
      } catch (err: any) {
        console.error('Failed to fetch active plan:', err);
        setSubscription(null);
        setPlanError(
          err?.code === 'UNAUTHORIZED'
            ? null
            : err?.message || 'Could not load your active plan.',
        );
      } finally {
        setPlanLoading(false);
      }
    };

    loadPlan();
  }, [token, planReloadKey]);

  const handleRetry = () => {
    setReloadKey(prev => prev + 1);
  };

  const handlePlanRetry = useCallback(() => {
    setPlanReloadKey(prev => prev + 1);
  }, []);

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
    { id: '1', title: strings.myProfile || 'मेरा प्रोफ़ाइल', icon: 'account', screen: 'MyProfile' },
    { id: '2', title: strings.premiumMenu || 'प्रीमियम', icon: 'crown', screen: 'Premium' },
    { id: '3', title: 'My Plans', icon: 'package-variant', screen: 'MyOrders' },
    { id: '4', title: strings.ProductsPlans || 'उत्पाद एवं योजनाएँ', icon: 'shopping', screen: 'ProductsTab' },
    { id: '5', title: strings.morningDashboard || 'Morning Dashboard', icon: 'chart-line', screen: 'MorningDashboard' },
    { id: '6', title: strings.changeLanguage || 'भाषा बदलें', icon: 'translate', screen: 'Language' },
    { id: '7', title: strings.privacyPolicy || 'निजी नीति', icon: 'lock', screen: 'PrivacyPolicy' },
    { id: '8', title: strings.termsConditions || 'सेवा की शर्तें', icon: 'file-document', screen: 'TermsConditions' },
    { id: '9', title: strings.helpSupport || 'सहायता', icon: 'help-circle', screen: 'ContactUs' },
    { id: '10', title: 'Notifications', icon: 'bell', screen: 'Notification' },
    { id: '11', title: strings.Logout || 'लॉग आउट', icon: 'logout-variant', action: 'logout' },
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

  const userName = userProfile?.name || user?.name || strings.userName || 'Not available';
  const userPhone = userProfile?.mobile
    ? `+91 ${userProfile.mobile}`
    : user?.mobile
      ? `+91 ${user.mobile}`
      : strings.userPhone || 'Not available';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="account" size={moderateScale(40)} color="#fff" />
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

      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={sessionExpired ? handleLogout : handleRetry}
            style={styles.errorButton}
          >
            <Text style={styles.errorButtonText}>
              {sessionExpired ? 'Log in again' : 'Retry'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.planWrapper}>
        <ActivePlanCard
          subscription={subscription}
          loading={planLoading}
          error={planError}
          onRetry={handlePlanRetry}
        />
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => handlePress(item)}
          >
            <Icon name={item.icon} size={moderateScale(24)} color="#666" style={styles.menuIcon} />
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
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 18,
  },
  errorButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
  planWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D6336C',
    elevation: 1,
  },
  planCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  planCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  planBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  planCardHint: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
  planError: {
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 18,
  },
  planRetry: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
  },
  planRetryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  planName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#333',
  },
  planSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  planMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  planMeta: {
    fontSize: 11,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  planDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  planStatRow: {
    flexDirection: 'row',
  },
  planStat: {
    flex: 1,
  },
  planStatValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#D6336C',
  },
  planStatLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  planFooter: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
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
    marginRight: scale(16),
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

