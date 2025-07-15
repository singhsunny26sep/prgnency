// import messaging from '@react-native-firebase/messaging';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import PushNotification from 'react-native-push-notification';
// import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';

// declare module 'react-native-push-notification';

// class NotificationService {
//   async requestUserPermission() {
//     console.log('Requesting notification permission...');
//     const authStatus = await messaging().requestPermission();
//     console.log('Notification permission status:', authStatus);
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log('Notification permission granted');
//       this.getFCMToken();
//     } else {
//       console.log('Notification permission denied');
//     }
//   }

//   async getFCMToken() {
//     try {
//       console.log('Getting FCM token...');
//       const fcmToken = await AsyncStorage.getItem('fcmToken');
//       console.log('Current FCM token from storage:', fcmToken);
      
//       if (!fcmToken) {
//         console.log('No existing FCM token found, generating new one...');
//         const token = await messaging().getToken();
//         console.log('Raw FCM token from Firebase:', token);
        
//         if (token) {
//           console.log('New FCM Token generated:', token);
//           await AsyncStorage.setItem('fcmToken', token);
//           console.log('FCM Token saved to AsyncStorage');
//           return token;
//         } else {
//           console.log('Failed to generate FCM token');
//           return null;
//         }
//       } else {
//         console.log('Using existing FCM Token:', fcmToken);
//         return fcmToken;
//       }
//     } catch (error) {
//       console.log('Error getting FCM token:', error);
//       return null;
//     }
//   }

//   async onDisplayNotification(remoteMessage: any) {
//     console.log('=== ATTEMPTING TO DISPLAY NOTIFICATION ===');
//     console.log('Message received:', JSON.stringify(remoteMessage, null, 2));
    
//     if (!remoteMessage.notification) {
//       console.log('ERROR: Cannot display notification - no notification object in message');
//       return;
//     }

//     try {
//       const notificationConfig = {
//         channelId: 'default-channel-id',
//         title: remoteMessage.notification.title || 'New Notification',
//         message: remoteMessage.notification.body || '',
//         playSound: true,
//         soundName: 'default',
//         importance: 'high' as const,
//         priority: 'high' as const,
//         smallIcon: 'ic_notification',
//         largeIcon: '', 
//       };
      
//       console.log('Displaying notification with config:', notificationConfig);
      
//       PushNotification.localNotification(notificationConfig);
//       console.log('Notification display command sent successfully');
//     } catch (error) {
//       console.log('ERROR displaying notification:', error);
//       throw error; 
//     }
//   }

//   setupNotificationListeners() {
//     console.log('Setting up notification listeners...');
    
//     messaging().onMessage(async remoteMessage => {
//       console.log('=== FOREGROUND NOTIFICATION RECEIVED ===');
//       console.log('Full message:', JSON.stringify(remoteMessage, null, 2));
//       console.log('Notification title:', remoteMessage.notification?.title);
//       console.log('Notification body:', remoteMessage.notification?.body);
//       console.log('Notification data:', remoteMessage.data);
      
//       if (!remoteMessage.notification) {
//         console.log('WARNING: No notification object in message');
//       }
      
//       try {
//         await this.onDisplayNotification(remoteMessage);
//       } catch (error) {
//         console.log('Error in onMessage handler:', error);
//       }
//     });

//     messaging().setBackgroundMessageHandler(async remoteMessage => {
//       console.log('=== BACKGROUND NOTIFICATION RECEIVED ===');
//       console.log('Full message:', JSON.stringify(remoteMessage, null, 2));
//       console.log('Notification title:', remoteMessage.notification?.title);
//       console.log('Notification body:', remoteMessage.notification?.body);
//       console.log('Notification data:', remoteMessage.data);
      
//       if (!remoteMessage.notification) {
//         console.log('WARNING: No notification object in message');
//       }
      
//       try {
//         await this.onDisplayNotification(remoteMessage);
//       } catch (error) {
//         console.log('Error in background handler:', error);
//       }
//     });

//     messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log('Notification opened app:', JSON.stringify(remoteMessage, null, 2));
//     });

//     messaging()
//       .getInitialNotification()
//       .then(remoteMessage => {
//         if (remoteMessage) {
//           console.log('App opened from quit state:', JSON.stringify(remoteMessage, null, 2));
//         }
//       });

//     console.log('Notification listeners setup completed');
//   }

//   configurePushNotifications() {
//     try {
//       // Create the channel first
//       PushNotification.createChannel(
//         {
//           channelId: 'default-channel-id',
//           channelName: 'Default Channel',
//           channelDescription: 'A default channel for notifications',
//           playSound: true,
//           soundName: 'default',
//           importance: 4, // IMPORTANCE_HIGH
//           vibrate: true,
//         },
//         (created: boolean) => {
//           if (created) {
//             console.log('Notification channel created successfully');
//           } else {
//             console.log('Notification channel already exists');
//           }
//         }
//       );

//       // Configure push notifications
//       PushNotification.configure({
//         onRegister: function (token: { os: string; token: string }) {
//           console.log('Push Notification Token:', token);
//         },
//         onNotification: function (notification: any) {
//           console.log('Notification received:', notification);
//           // Handle notification when app is in foreground
//           notification.finish();
//         },
//         onAction: function (notification: any) {
//           console.log('Notification action:', notification);
//         },
//         onRegistrationError: function (err: Error) {
//           console.error('Push notification registration error:', err);
//         },
//         permissions: {
//           alert: true,
//           badge: true,
//           sound: true,
//         },
//         popInitialNotification: true,
//         requestPermissions: true,
//       });

//       console.log('Push notifications configured successfully');
//     } catch (error) {
//       console.error('Error configuring push notifications:', error);
//     }
//   }
// }

// export default new NotificationService();


// src/services/NotificationService.ts

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';
import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';

class NotificationService {
  async requestUserPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getFCMToken();
      } else {
        console.log('Notification permission denied on Android 13+');
      }
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted:', authStatus);
        this.getFCMToken();
      } else {
        console.log('Notification permission denied');
      }
    }
  }

  async getFCMToken() {
    try {
      const storedToken = await AsyncStorage.getItem('fcmToken');
      if (!storedToken) {
        const token = await messaging().getToken();
        if (token) {
          await AsyncStorage.setItem('fcmToken', token);
          console.log('New FCM Token:', token);
        }
      } else {
        console.log('Using stored FCM Token:', storedToken);
      }
    } catch (err) {
      console.log('Error getting FCM Token:', err);
    }
  }

  async displayNotification(remoteMessage: any) {
    const image = remoteMessage.notification?.image;

    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'New Notification',
      body: remoteMessage.notification?.body || '',
      android: {
        channelId: '1234',
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_launcher',
        style: image
          ? { type: AndroidStyle.BIGPICTURE, picture: image }
          : undefined,
      },
    });
  }

  setupNotificationListeners() {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from quit state via notification:', remoteMessage);
        }
      });
  }

  async createNotificationChannel() {
    await notifee.createChannel({
      id: '1234',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }
}

export default new NotificationService();
