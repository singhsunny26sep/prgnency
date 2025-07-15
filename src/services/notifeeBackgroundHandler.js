import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('[NOTIFEE BACKGROUND EVENT]', type, detail);

  if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
    const notification = detail.notification;
    const pressAction = detail.pressAction;
    console.log('Notification tapped:', notification);
    console.log('Press action:', pressAction);
    // TODO: Navigate or update state/storage as needed
  }
});