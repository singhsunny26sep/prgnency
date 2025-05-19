import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { Container } from '../../Components/Container/Container';
import { AllColors } from '../../Constants/COLORS';
import { moderateScale, scale } from '../../Constants/Scalling';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../Constants/Fonts';
import { Instance } from '../../API/Instance';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socketServices from '../../Utils/socketServices';

export default function ChatListScreen({}) {
  const navigation = useNavigation();

  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('userToken').then(token => {
      if (token) {
        Instance.get('/api/users/get-all-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(response => {
            if (response.data.success) {
              setChatData(response.data.data);
            } else {
              console.log('Failed to fetch users');
            }
          })
          .catch(error => {
            console.log('Error fetching users:', error);
          });
      } else {
        console.log('No token found, please login');
      }
    });

    socketServices?.on('msg', () => {
      console.log('New message received');
      AsyncStorage.getItem('userToken').then(token => {
        if (token) {
          Instance.get('api/users/chat/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(response => {
              if (response.data.success) {
                setChatData(response.data.data);
              } else {
                console.log('Failed to fetch users');
              }
            })
            .catch(error => {
              console.log('Error fetching users:', error);
            });
        }
      });
    });

    return () => {
      socketServices.removeListener('msg');
    };
  }, []);

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.lightBlue}
      backgroundColor={AllColors.white}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your Group</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatNotificationSettings')}>
            <Text style={styles.headerText}>Notification Setting</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={chatData}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{}}>
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate('ChatScreen', { chatData: item })
              }>
              <Image source={{ uri: item.profilePic }} style={styles.chatImage} />
              <View style={styles.chatDetails}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.userName}>
                  Joined: {moment(item.createdAt).format('MMMM Do YYYY')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: scale(10),
    marginBottom: scale(20),
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: scale(15),
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.AfacadBold,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: AllColors.lightGray,
    alignItems: 'center',
  },
  chatImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(40),
    marginRight: scale(15),
    borderWidth: 0.5,
  },
  chatDetails: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  groupName: {
    fontSize: moderateScale(17),
    fontFamily: Fonts.AfacadBold,
    color: AllColors.black,
  },
  userName: {
    fontSize: moderateScale(14),
    color: AllColors.darkGray,
    fontFamily: Fonts.AfacadMedium,
  },
});
