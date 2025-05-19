import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Share,
  Alert,
} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import Icon from 'react-native-vector-icons/Feather';
import {Fonts} from '../../Constants/Fonts';

export default function Settings(props) {
  const onSharePress = async () => {
    try {
      const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRDqDF9L9bpvq2l3MK9Gu_Z6e4JdkYjd2Uzg&s'; // The default image link
  
      const shareOptions = {
        title: 'Check out this amazing content!',
        message: 'I found some great content on this app. You should check it out!',
        url: imageUrl, 
        subject: 'Interesting Content',
      };
  
      const result = await Share.share(shareOptions);
  
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type: ' + result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const handleCallPress = () => {
    const phoneNumber = '8015270968';
    Linking.openURL(`tel:${phoneNumber}`).catch(err =>
      console.error('An error occurred', err),
    );
  };
  const handleSharePress = async () => {
    try {
      const result = await Share.share({
        message:
          'Check out my profile on this app! [Insert your profile URL or details here]',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type: ' + result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Are you sure?',
      'This will permanently delete your account.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            console.log('Account deleted');
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <CustomHeader
        type="back"
        screenName="Settings"
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity style={styles.option}>
          <Icon name="bell-off" size={30} color={AllColors.babyPink} />
          <Text style={styles.text}>Mute Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleSharePress}>
          <Icon name="share" size={30} color={AllColors.babyPink} />
          <Text style={styles.text}>Share Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="map-pin" size={30} color={AllColors.babyPink} />
          <Text style={styles.text}>Saved Address</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="help-circle" size={30} color={AllColors.babyPink} />
          <Text style={styles.text}>My Question</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleCallPress}>
          <Icon name="phone-call" size={30} color={AllColors.babyPink} />
          <Text style={styles.text}>Contact of HiranyaGarbha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleDeletePress}>
          <Icon name="trash-2" size={30} color={AllColors.babyPink} />
          <Text style={styles.text}>Delete My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={onSharePress}>
          <Icon name="bell" size={30} color={AllColors.babyPink} />
          <Text style={styles.text}>Add Notification</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: AllColors.lightGray,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    marginLeft: 15,
    fontSize: 18,
    color: AllColors.black,
    fontFamily: Fonts.AfacadBold,
  },
});
