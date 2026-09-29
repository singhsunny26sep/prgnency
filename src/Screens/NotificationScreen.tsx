import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

const notificationsData: NotificationItem[] = [
  {
    id: '1',
    title: 'New Expert Session',
    message: 'Dr. Sharma is hosting a live session on prenatal yoga tomorrow at 7 AM.',
    time: '2 hours ago',
    read: false,
    icon: 'video',
  },
  {
    id: '2',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Patel is confirmed for Oct 20 at 10:30 AM.',
    time: '5 hours ago',
    read: false,
    icon: 'calendar-check',
  },
  {
    id: '3',
    title: 'Weekly Tips Available',
    message: 'New weekly tips for week 25 are now available. Check them out!',
    time: '1 day ago',
    read: false,
    icon: 'lightbulb',
  },
  {
    id: '4',
    title: 'Community Update',
    message: 'Priya M. shared a new post in your community group.',
    time: '2 days ago',
    read: true,
    icon: 'account-group',
  },
  {
    id: '5',
    title: 'Product Recommendation',
    message: 'Check out our new collection of prenatal vitamins and supplements.',
    time: '3 days ago',
    read: true,
    icon: 'shopping',
  },
  {
    id: '6',
    title: 'Growth Milestone',
    message: 'Your baby is now the size of a cauliflower! Track development updates.',
    time: '5 days ago',
    read: true,
    icon: 'chart-line',
  },
  {
    id: '7',
    title: 'Reminder',
    message: 'Time for your daily meditation session. Stay consistent!',
    time: '1 week ago',
    read: true,
    icon: 'meditation',
  },
];

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationsData);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.notificationCardUnread,
      ]}
      activeOpacity={0.7}
      onPress={() => handleMarkAsRead(item.id)}>
      <View style={styles.notificationIconContainer}>
        <Icon name={item.icon} size={moderateScale(24)} color="#D6336C" />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="bell-off" size={moderateScale(60)} color="#CCC" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>Stay tuned for updates</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </ScrollView>
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
