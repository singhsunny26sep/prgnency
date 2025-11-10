import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../../localization';
import {actionTypes} from './ActionTypes';

const initialState = {
   userToken: '',
   userData: {},
   premiumData: [],
   language: 'en',
   updateInfo: null,
   updateDismissed: false,
   isCheckingUpdate: false,
   updateError: null,
 };

export default function (state = initialState, action: any) {
   switch (action.type) {
     case actionTypes.USER_DATA:
       return {...state, userData: action.payload};
     case actionTypes.PREMIUM_DATA:
       return {...state, premiumData: action.payload};
     case actionTypes.SET_LANGUAGE:
       strings.setLanguage(action.payload); // Change language globally
       AsyncStorage.setItem('appLanguage', action.payload); // Persist in AsyncStorage
       return {...state, language: action.payload};
     case actionTypes.SET_UPDATE_INFO:
       return {...state, updateInfo: action.payload, updateError: null};
     case actionTypes.SET_UPDATE_DISMISSED:
       return {...state, updateDismissed: action.payload};
     case actionTypes.CHECK_UPDATE_START:
       return {...state, isCheckingUpdate: true, updateError: null};
     case actionTypes.CHECK_UPDATE_SUCCESS:
       return {...state, isCheckingUpdate: false, updateInfo: action.payload};
     case actionTypes.CHECK_UPDATE_ERROR:
       return {...state, isCheckingUpdate: false, updateError: action.payload};
     default:
       return state;
   }
 }
