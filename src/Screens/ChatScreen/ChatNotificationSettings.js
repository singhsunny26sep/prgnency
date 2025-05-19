import React, {useState} from 'react';
import {
  View,
  Text,
  Switch,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import {moderateScale, scale, verticalScale} from '../../Constants/Scalling';
import RadioBtn from '../../Components/radioButton/RadioButton';

export default function ChatNotificationSettings(props) {
  const [isMutedAllGroups, setIsMutedAllGroups] = useState(false);
  const [isMutedGroup1, setIsMutedGroup1] = useState(false);
  const [isMutedGroup2, setIsMutedGroup2] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null); 

  const toggleSwitchAllGroups = () => {
    if (isMutedAllGroups) {
      setIsMutedAllGroups(false); 
    } else {
      setIsMutedAllGroups(true);
      setModalVisible(true);
    }
  };

  const toggleSwitchGroup1 = () => {
    if (isMutedGroup1) {
      setIsMutedGroup1(false); 
    } else {
      setIsMutedGroup1(true); 
      setModalVisible(true);
    }
  };

  const toggleSwitchGroup2 = () => {
    if (isMutedGroup2) {
      setIsMutedGroup2(false); 
    } else {
      setIsMutedGroup2(true); 
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleOkPress = () => {
    if (selectedDuration) {

      console.log(`Muted for ${selectedDuration}`);
    }

    setModalVisible(false)
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Mute Notification"
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <View>
        <View style={styles.muteGroupContainer}>
          <Text style={styles.muteGroupText}>Mute All Groups</Text>
          <Switch
            value={isMutedAllGroups}
            onValueChange={toggleSwitchAllGroups}
            thumbColor={isMutedAllGroups ? AllColors.green : AllColors.primary}
            trackColor={{false: AllColors.primary, true: AllColors.green}}
          />
        </View>

        <Text style={styles.muteIndividualGroupsText}>
          Mute Individual Groups
        </Text>

        <View style={styles.groupRow}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjZirTv3YUaHSe-VVIQzwXUHXxb8mnJ-krbg&s',
            }}
            style={styles.groupImage}
          />
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>your Daily ClassRoom</Text>
            <Text style={styles.userName}>Samir: Hi</Text>
          </View>
          <Switch
            value={isMutedGroup1}
            onValueChange={toggleSwitchGroup1}
            thumbColor={isMutedGroup1 ? AllColors.green : AllColors.primary}
            trackColor={{false: AllColors.primary, true: AllColors.green}}
          />
        </View>

        <View style={styles.groupRow}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjZirTv3YUaHSe-VVIQzwXUHXxb8mnJ-krbg&s',
            }}
            style={styles.groupImage}
          />
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>Rajkot</Text>
            <Text style={styles.userName}>Piyush: Hi</Text>
          </View>
          <Switch
            value={isMutedGroup2}
            onValueChange={toggleSwitchGroup2}
            thumbColor={isMutedGroup2 ? AllColors.green : AllColors.primary}
            trackColor={{false: AllColors.primary, true: AllColors.green}}
          />
        </View>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Notification Muted for..</Text>
            <View style={styles.radioOptions}>
              <View style={styles.radioOption}>
                <RadioBtn
                  selected={selectedDuration === '6 hours'}
                  onPress={() => setSelectedDuration('6 hours')}
                />
                <Text style={styles.ModalTitletxt}>6 hours</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioBtn
                  selected={selectedDuration === '3 days'}
                  onPress={() => setSelectedDuration('3 days')}
                />
                <Text style={styles.ModalTitletxt}>3 days</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioBtn
                  selected={selectedDuration === '30 days'}
                  onPress={() => setSelectedDuration('30 days')}
                />
                <Text style={styles.ModalTitletxt}>30 days</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.okButton} onPress={handleOkPress}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  muteGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(10),
    borderTopWidth: 1,
    paddingHorizontal: scale(15),
    paddingTop: scale(20),
    borderBottomWidth: 1,
    paddingBottom: scale(20),
    borderTopColor: AllColors.primary,
    borderBottomColor: AllColors.primary,
  },
  muteGroupText: {
    color: AllColors.black,
    fontWeight: 'bold',
    fontSize: moderateScale(15),
  },
  muteIndividualGroupsText: {
    paddingHorizontal: scale(15),
    fontWeight: '500',
    fontSize: moderateScale(15),
    color: AllColors.red,
    borderBottomWidth: 1,
    borderBottomColor: AllColors.primary,
    paddingVertical: verticalScale(10),
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: AllColors.primary,
    paddingBottom: scale(20),
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
  },
  groupImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(40),
    marginRight: scale(15),
    borderWidth: 0.5,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: AllColors.black,
  },
  userName: {
    fontSize: moderateScale(14),
    color: AllColors.darkGray,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: scale(20),
    backgroundColor: 'white',
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: AllColors.black,
    marginBottom: scale(20),
  },

  radioOptions: {
    width: '100%',
    marginBottom: scale(20),
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(10),
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  cancelButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(15),
    borderRadius: scale(5),
    marginRight: scale(10),
  },
  okButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(15),
    borderRadius: scale(5),
  },
  buttonText: {
    fontSize: moderateScale(16),
    color: AllColors.black,
    fontWeight: 'bold',
  },
  ModalTitletxt: {
    color: AllColors.black,
    fontWeight: '600',
    fontSize: moderateScale(16),
    marginLeft: scale(15),
  },
});
