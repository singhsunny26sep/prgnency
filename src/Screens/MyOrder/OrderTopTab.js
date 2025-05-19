import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import metrics from '../../Constants/Metrics';
import {moderateScale, scale, verticalScale} from '../../Constants/Scalling';
import MyOrder from './MyOrder';
import SavedItems from './SavedItems';
import MyAnswers from './MyAnswers';
import MyQuestions from './MyQuestions';

export default function OrderTopTab(props) {
  const [activeTab, setActiveTab] = useState('MyOrder');

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <View style={{flex: 1}}>
        <CustomHeader
          type="back"
          screenName="Back to Profile"
          onPressBack={() => {
            props.navigation.goBack();
          }}
        />
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'MyOrder'
                    ? styles.activeTab
                    : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab('MyOrder')}>
                <Text style={styles.tabLabel(activeTab === 'MyOrder')}>
                  My Order
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'SavedItems'
                    ? styles.activeTab
                    : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab('SavedItems')}>
                <Text style={styles.tabLabel(activeTab === 'SavedItems')}>
                  Saved Items(0)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'MyPosts'
                    ? styles.activeTab
                    : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab('MyPosts')}>
                <Text style={styles.tabLabel(activeTab === 'MyPosts')}>
                  My Posts(0)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'MyAnswers'
                    ? styles.activeTab
                    : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab('MyAnswers')}>
                <Text style={styles.tabLabel(activeTab === 'MyAnswers')}>
                  My Answers(0)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'MyQuestions'
                    ? styles.activeTab
                    : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab('MyQuestions')}>
                <Text style={styles.tabLabel(activeTab === 'MyQuestions')}>
                  My Questions(0)
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <View style={{flex: 1}}>
          {activeTab === 'MyOrder' && <MyOrder />}
          {activeTab === 'SavedItems' && <SavedItems />}
          {activeTab === 'MyPosts' && <MyPosts />}
          {activeTab === 'MyAnswers' && <MyAnswers />}
          {activeTab === 'MyQuestions' && <MyQuestions />}
        </View>
      </View>
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
    marginTop: scale(10),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(5),
    justifyContent: 'center',
    borderRadius: moderateScale(30),
    marginHorizontal: scale(5),
    borderWidth: 1,
    borderColor: AllColors.primary,
    width: scale(120),
    paddingVertical:moderateScale(8)
  },
  activeTab: {
    backgroundColor: AllColors.babyPink,
  },
  inactiveTab: {
    backgroundColor: AllColors.white,
  },
  tabLabel: isActive => ({
    color: isActive ? 'white' : 'black',
    // fontFamily: isActive ? 'Afacad-Bold' : 'Afacad-SemiBold',
    fontSize: moderateScale(15),
    fontWeight: '500',
  }),
});
