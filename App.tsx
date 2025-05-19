/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';

import Route from './src/Navigation/Route';
import {StatusBar, View, StatusBarStyle} from 'react-native';
import {persistStore, persistReducer} from 'redux-persist';
import {Provider} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, createStore} from 'redux';
import Common from './src/Redux/Common';
import {PersistGate} from 'redux-persist/integration/react';
import strings from './localization';

function App(): React.JSX.Element {
  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['language'], 
  };

  const reducers = combineReducers({Common});

  const persistedReducer = persistReducer(persistConfig, reducers);

  const store = createStore(persistedReducer);
  const persistor = persistStore(store);

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem("appLanguage");
      if (storedLang) {
        strings.setLanguage(storedLang)
      }
    };
    loadLanguage();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={{flex: 1}}>
          <Route />
        </View>
      </PersistGate>
    </Provider>
  );
}

export default App;
