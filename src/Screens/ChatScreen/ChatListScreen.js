import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import metrics from '../../Constants/Metrics';
import {moderateScale, scale, verticalScale} from '../../Constants/Scalling';
import MyChat from './MyChat';
import NewChat from './NewChat';

export default function ChatListScreen({navigation}) {
  const [activeTab, setActiveTab] = useState('MyChat');

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.lightBlue}
      backgroundColor={AllColors.white}>
      <SafeAreaView style={{flex:1}}>
        <View style={styles.headerView}>
          <CustomHeader
            type="back"
            screenName="Chat User"
            onPressBack={() => {
              navigation.goBack();
            }}
          />
        </View>

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
            <Text style={styles.tabLabel(activeTab === 'NewChat')}>
              New Chat
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'MyChat' && <MyChat />}
        {activeTab === 'NewChat' && <NewChat />}
      </SafeAreaView>
    </Container>
  );
}

const styles = StyleSheet.create({
  headerView: {
    height: metrics.hp10,
    backgroundColor: AllColors.lightBlue,
    paddingTop: metrics.hp2,
    borderBottomEndRadius: metrics.hp20,
    borderRadius: 10,
    elevation: 22,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    paddingVertical: verticalScale(10),
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
    backgroundColor: AllColors.white,
  },
  tabLabel: isActive => ({
    color: isActive ? 'white' : 'black',
    fontFamily: isActive ? 'Afacad-Bold' : 'Afacad-SemiBold',
    fontSize: moderateScale(15),
  }),
});
