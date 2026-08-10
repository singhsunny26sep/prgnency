import notifee, { AndroidImportance } from '@notifee/react-native';

class NotificationService {
  static async requestUserPermission() {
    const settings = await notifee.requestPermission();
    return settings;
  }

  static async createNotificationChannel() {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
    return channelId;
  }

  static setupNotificationListeners() {
    // Notification listeners setup
  }
}

export default NotificationService;
