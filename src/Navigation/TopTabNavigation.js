import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { AllColors } from '../Constants/COLORS';
import { moderateScale, scale, verticalScale } from '../Constants/Scalling';
import MyChat from '../Screens/ChatScreen/MyChat';
import NewChat from '../Screens/ChatScreen/NewChat';

export default function CustomTabNavigator() {
  const [activeTab, setActiveTab] = useState('MyChat'); 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'MyChat' ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => setActiveTab('MyChat')}>
          <Text style={styles.tabLabel(activeTab === 'MyChat')}>My Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'NewChat' ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => setActiveTab('NewChat')}>
          <Text style={styles.tabLabel(activeTab === 'NewChat')}>New Chat</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'MyChat' && <MyChat />}
      {activeTab === 'NewChat' && <NewChat />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(15),
    marginTop: scale(10),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    justifyContent: 'center',
    borderRadius: moderateScale(25),
    marginHorizontal: scale(5), 
    borderWidth: 0.5, 
    borderColor: AllColors.black,
  },
  activeTab: {
    backgroundColor: AllColors.babyPink,
  },
  inactiveTab: {
    backgroundColor:AllColors.white,
  },
  tabLabel: isActive => ({
    color: isActive ? 'white' : 'black',
    // fontFamily: isActive ? 'Afacad-Bold' : 'Afacad-SemiBold',
    fontSize:moderateScale(15),
    fontWeight:"Bold"
  }),
});
