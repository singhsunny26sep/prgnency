import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export const DEFAULT_CHANNEL_ID = 'default';
export const DEFAULT_CHANNEL_NAME = 'Default Channel';

let cachedToken: string | null = null;
let backgroundHandlerRegistered = false;

const getMessaging = () => {
  try {
    return messaging() ?? null;
  } catch (error) {
    console.warn('FCM messaging unavailable:', error);
    return null;
  }
};

class NotificationService {
  static async requestUserPermission() {
    const settings = await notifee.requestPermission();
    return settings;
  }

  static async createNotificationChannel() {
    const channelId = await notifee.createChannel({
      id: DEFAULT_CHANNEL_ID,
      name: DEFAULT_CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
    });
    return channelId;
  }

  static async getFCMToken(force = false): Promise<string> {
    if (cachedToken && !force) {
      return cachedToken;
    }

    const instance = getMessaging();
    if (!instance) {
      return '';
    }

    try {
      console.log('Fetching FCM token...');
      const authStatus = await instance.requestPermission();
      console.log('FCM auth status:', authStatus);
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('FCM permission not granted');
        return '';
      }

      const token = await instance.getToken();
      cachedToken = token || null;
      console.log('FCM Token:', cachedToken);
      return cachedToken || '';
    } catch (error) {
      console.warn('FCM token fetch failed:', error);
      return '';
    }
  }

  static async displayNotification(
    remoteMessage?: FirebaseMessagingTypes.RemoteMessage,
    channelId: string = DEFAULT_CHANNEL_ID,
  ) {
    const data = remoteMessage?.data || {};
    const notification = remoteMessage?.notification;

    await notifee.displayNotification({
      title: String(notification?.title || data.title || ''),
      body: String(notification?.body || data.body || data.message || ''),
      data,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },
    });
  }

  static async configurePushNotifications() {
    await this.requestUserPermission();
    await this.createNotificationChannel();
    await this.getFCMToken();
  }

  static registerBackgroundMessageHandler() {
    if (backgroundHandlerRegistered) {
      return;
    }

    const instance = getMessaging();
    if (!instance) {
      console.warn('FCM background handler not registered: messaging is null');
      return;
    }

    try {
      instance.setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background message received:', remoteMessage);
        await this.displayNotification(remoteMessage);
      });
      backgroundHandlerRegistered = true;
    } catch (error) {
      console.warn('FCM background handler registration failed:', error);
    }
  }

  static setupNotificationListeners() {
    const instance = getMessaging();
    if (!instance) {
      console.warn('FCM listeners not registered: messaging is null');
      return undefined;
    }

    instance.onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    instance.onTokenRefresh(token => {
      cachedToken = token;
      console.log('FCM Token refreshed:', token);
    });

    instance
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
        }
      })
      .catch(error => console.warn('getInitialNotification failed:', error));

    instance.onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened while app in background:', remoteMessage);
    });

    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Notification pressed:', detail.notification);
      } else if (type === EventType.DISMISSED) {
        console.log('Notification dismissed:', detail.notification);
      }
    });
  }
}

export default NotificationService;
