import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.DISMISSED) {
    console.log('User dismissed notification', detail.notification);
  } else if (type === EventType.PRESS) {
    console.log('User pressed notification', detail.notification);
    // Handle notification press in background
  }
});

export default {};
