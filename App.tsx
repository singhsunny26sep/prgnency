// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React, {useEffect, useState} from 'react';

// import Route from './src/Navigation/Route';
// import {StatusBar, View, StatusBarStyle} from 'react-native';
// import {persistStore, persistReducer} from 'redux-persist';
// import {Provider} from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {combineReducers, createStore} from 'redux';
// import Common from './src/Redux/Common';
// import {PersistGate} from 'redux-persist/integration/react';
// import strings from './localization';
// import NotificationService from './src/services/NotificationService';

// function App(): React.JSX.Element {
//   const persistConfig = {
//     key: 'root',
//     storage: AsyncStorage,
//     whitelist: ['language'], 
//   };

//   const reducers = combineReducers({Common});

//   const persistedReducer = persistReducer(persistConfig, reducers);

//   const store = createStore(persistedReducer);
//   const persistor = persistStore(store);

//   useEffect(() => {
//     const initializeApp = async () => {
//       const storedLang = await AsyncStorage.getItem("appLanguage");
//       if (storedLang) {
//         strings.setLanguage(storedLang);
//       }

//       await NotificationService.requestUserPermission();
//       NotificationService.configurePushNotifications();
//       NotificationService.setupNotificationListeners();
//     };

//     initializeApp();
//   }, []);

//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <View style={{flex: 1}}>
//           <Route />
//         </View>
//       </PersistGate>
//     </Provider>
//   );
// }

// export default App;
import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import Route from './src/Navigation/Route';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, createStore } from 'redux';
import Common from './src/Redux/Common';
import strings from './localization';
import NotificationService from './src/services/NotificationService';
import { checkForUpdates, checkDismissedUpdate } from './src/Redux/UpdateActions';
import UpdatePopup from './src/Components/UpdatePopup/UpdatePopup';

// Inner component that uses Redux hooks
const AppContent: React.FC = () => {
  const updateInfo = useSelector((state: any) => state.Common.updateInfo);
  const updateDismissed = useSelector((state: any) => state.Common.updateDismissed);

  const handleCloseUpdate = () => {
    // Update popup will handle dismissal internally
  };

  // Show popup if update is available and not dismissed
  const showUpdatePopup = updateInfo?.isUpdateAvailable && !updateDismissed;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ADD8E6" />
      <Route />
      <UpdatePopup
        visible={showUpdatePopup}
        onClose={handleCloseUpdate}
      />
    </View>
  );
};

function App(): React.JSX.Element {
  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['language'],
  };

  const reducers = combineReducers({ Common });
  const persistedReducer = persistReducer(persistConfig, reducers);
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);

  useEffect(() => {
    const initializeApp = async () => {
      const storedLang = await AsyncStorage.getItem('appLanguage');
      if (storedLang) {
        strings.setLanguage(storedLang);
      }

      await NotificationService.requestUserPermission();
      await NotificationService.createNotificationChannel();
      NotificationService.setupNotificationListeners();

      // Check for dismissed updates
      store.dispatch(checkDismissedUpdate() as any);

      // Check for app updates after a delay
      setTimeout(() => {
        store.dispatch(checkForUpdates() as any);
      }, 3000);
    };

    initializeApp();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;