import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/AuthContext';
import {
  AppNotification,
  fetchMyNotifications,
  iconForType,
  markAllNotificationsRead,
  markNotificationRead,
  relativeTime,
} from '../services/NotificationService';

const PAGE_SIZE = 20;

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const load = useCallback(
    async (targetPage: number, mode: 'initial' | 'refresh' | 'more') => {
      if (mode === 'more') {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await fetchMyNotifications(token, targetPage, PAGE_SIZE);
        setNotifications(prev =>
          mode === 'more' ? [...prev, ...result.items] : result.items,
        );
        setPage(result.page);
        setTotal(result.total);
        setHasMore(result.hasMore);
      } catch (err: any) {
        console.error('Failed to fetch notifications:', err);
        setSessionExpired(err?.code === 'UNAUTHORIZED');
        setError(err?.message || 'Could not load your notifications.');
        if (mode === 'initial') {
          setNotifications([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [token],
  );

  useEffect(() => {
    load(1, 'initial');
  }, [load]);

  const handleRefresh = () => {
    setRefreshing(true);
    load(1, 'refresh');
  };

  const handleEndReached = () => {
    if (!hasMore || loadingMore || loading) {
      return;
    }
    load(page + 1, 'more');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    const target = notifications.find(n => n.id === id);
    if (!target || target.read) {
      return;
    }
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    );
    try {
      await markNotificationRead(id, token);
    } catch (err: any) {
      console.error('Failed to mark notification as read:', err);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: false } : n)),
      );
      Alert.alert(
        'Could not update',
        err?.message || 'Please try again.',
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead(token);
    } catch (err: any) {
      console.error('Failed to mark all as read:', err);
      Alert.alert(
        'Could not update',
        err?.message || 'Please try again.',
      );
      load(1, 'refresh');
    }
  };

  const renderNotification = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.notificationCardUnread,
      ]}
      activeOpacity={0.7}
      onPress={() => handleMarkAsRead(item.id)}>
      <View style={styles.notificationIconContainer}>
        <Icon name={iconForType(item.type)} size={moderateScale(24)} color="#D6336C" />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{relativeTime(item.createdAt)}</Text>
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D6336C" />
          <Text style={styles.loadingText}>Loading notifications…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="wifi-off" size={moderateScale(60)} color="#CCC" />
          <Text style={styles.emptyText}>
            {sessionExpired ? 'Session expired' : 'Could not load notifications'}
          </Text>
          <Text style={styles.emptySubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => load(1, 'initial')}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (notifications.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="bell-off" size={moderateScale(60)} color="#CCC" />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>Stay tuned for updates</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item, index) => item.id || `notif-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#D6336C']} />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.footerLoader} color="#D6336C" />
          ) : !hasMore ? (
            <Text style={styles.endText}>
              {total > 0 ? `Showing all ${total} notifications` : ''}
            </Text>
          ) : null
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#D6336C', '#F06292', '#F8B4C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={moderateScale(24)} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      <View style={styles.content}>{renderBody()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: scale(16),
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: scale(8),
    marginRight: scale(8),
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: moderateScale(13),
    color: 'rgba(255,255,255,0.85)',
    marginTop: verticalScale(2),
  },
  markAllButton: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  markAllText: {
    fontSize: moderateScale(11),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  retryButton: {
    marginTop: verticalScale(18),
    backgroundColor: '#D6336C',
    paddingHorizontal: scale(26),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
  footerLoader: {
    marginVertical: verticalScale(16),
  },
  endText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: moderateScale(12),
    marginTop: verticalScale(8),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(60),
  },
  loadingText: {
    marginTop: verticalScale(12),
    fontSize: moderateScale(14),
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(80),
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: '#666',
    marginTop: verticalScale(12),
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: moderateScale(13),
    color: '#999',
    marginTop: verticalScale(4),
  },
  listContent: {
    paddingBottom: verticalScale(24),
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: moderateScale(14),
    marginBottom: verticalScale(10),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  notificationCardUnread: {
    backgroundColor: '#FFF5F7',
    borderColor: '#FFD6E0',
    borderWidth: 1,
  },
  notificationIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: 'rgba(214,51,108,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  notificationTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#1a1a2e',
    flex: 1,
  },
  notificationTime: {
    fontSize: moderateScale(11),
    color: '#999',
    marginLeft: scale(8),
  },
  notificationMessage: {
    fontSize: moderateScale(12),
    color: '#666',
    lineHeight: verticalScale(18),
  },
  unreadDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: '#D6336C',
    marginLeft: scale(8),
  },
});

export default NotificationScreen;
