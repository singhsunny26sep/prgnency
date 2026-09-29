/**
 * @format
 */

import 'react-native-gesture-handler';
import './src/services/notifeeBackgroundHandler';
import NotificationService from './src/services/NotificationService';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

NotificationService.registerBackgroundMessageHandler();

AppRegistry.registerComponent(appName, () => App);
