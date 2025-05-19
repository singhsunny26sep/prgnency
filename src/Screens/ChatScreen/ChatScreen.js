import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {AllColors} from '../../Constants/COLORS';
import {NavigationProp, useRoute} from '@react-navigation/native';
import {Container} from '../../Components/Container/Container';
import {Fonts} from '../../Constants/Fonts';
import socketServices from '../../Utils/socketServices';
import moment from 'moment';
import {useAuthContext} from '../../Utils/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Instance} from '../../API/Instance';
import {moderateScale, scale} from '../../Constants/Scalling';

const ChatScreen = ({navigation}) => {
  const route = useRoute();
  const {chatData} = route.params;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [senderId, setSenderId] = useState(null);

  const formatTime = date => {
    const hours = date?.getHours();
    const minutes = date?.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const minute = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${minute} ${ampm}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No token found');
          return;
        }
        const response = await Instance.get('/api/users/profile', {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (response.data.success) {
          setSenderId(response.data.data._id);
          console.log('Sender ID:', response.data.data._id);
        } else {
          console.log('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (senderId && chatData) {
      const roomId = [senderId, chatData._id].sort().join('_');

      socketServices.initialzeSocket();
      socketServices.emit('join_room', {
        userId: senderId,
        receiverId: chatData._id,
      });

      socketServices.on('loadMessages', loadedMessages => {
        setMessages(loadedMessages);
      });

      socketServices.emit('seenMessages', {
        userId: senderId,
        senderId: chatData._id,
      });

      return () => {
        socketServices.removeListener('loadMessages');
        socketServices.removeListener('join_room');
        socketServices.removeListener('seenMessages');
      };
    }
  }, [chatData, senderId]);

  useEffect(() => {
    if (senderId) {
      socketServices.on('receiveMessage', message => {
        socketServices.emit('seenMessages', {
          userId: senderId,
          senderId: chatData._id,
        });
        if (message.sender === senderId || message.receiver === senderId) {
          setMessages(prevMessages => [...prevMessages, message]);
        }
      });

      return () => {
        socketServices.removeListener('receiveMessage');
        socketServices.removeListener('seenMessages');
      };
    }
  }, [senderId, chatData]);

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = {
        sender: senderId,
        receiver: chatData._id,
        message: inputText,
      };
      socketServices.emit('sendMessage', newMessage);
      setInputText('');
    }
  };

  const handleImagePick = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 800,
      compressImageQuality: 0.7,
    })
      .then(image => {
        const newMessage = {
          _id: Date.now().toString(),
          sender: senderId,
          receiver: chatData.receiverId,
          imageUri: image.path,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        socketServices.emit('sendMessage', newMessage);
        setMessages(prevMessages => [newMessage, ...prevMessages]);
      })
      .catch(error => {
        console.error('Error picking image:', error);
      });
  };

  const handleVideoPick = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then(video => {
        const newMessageObj = {
          id: (messages.length + 1).toString(),
          text: 'Sent a video',
          sender: 'me',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          videoUri: video.path,
        };
        setMessages([newMessageObj, ...messages]);
      })
      .catch(error => {
        console.log('Error picking video:', error);
      });
  };

  const renderMessage = ({item}) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === senderId ? styles.userMessage : styles.receivedMessage,
      ]}>
      {item.message ? (
        <Text style={styles.messageText}>{item.message}</Text>
      ) : null}
      {item.imageUri ? (
        <Image source={{uri: item.imageUri}} style={styles.messageImage} />
      ) : null}
      <Text style={styles.timestamp}>
        {moment(item?.createdAt).format('LLL')}
      </Text>
    </View>
  );


  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={scale(25)}
            color={AllColors.black}
          />
        </TouchableOpacity>
        <Image
          source={{uri: chatData.profilePic}}
          style={styles.profileImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.groupName}>{chatData.name}</Text>
          <Text style={styles.userName}>{chatData.name}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.chatContainer}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={{marginRight: scale(10)}}>
            <Ionicons name="send" size={scale(24)} color={AllColors.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.rightSideButtons}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handleImagePick}>
            <Ionicons name="image" size={scale(24)} color={AllColors.black} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.videoButton} onPress={handleVideoPick}>
            <Ionicons
              name="videocam-outline"
              size={scale(24)}
              color={AllColors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.micButton}>
            <Ionicons
              name={'mic-off'}
              size={scale(24)}
              color={AllColors.black}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  chatContainer: {padding: 10},
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    backgroundColor: AllColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AllColors.lightGray,
  },
  profileImage: {
    height: scale(45),
    width: scale(45),
    borderRadius: scale(30),
    marginRight: scale(10),
  },
  textContainer: {
    justifyContent: 'center',
  },
  groupName: {
    fontSize: moderateScale(15),
    fontFamily: Fonts.AfacadBold,
    color: AllColors.black,
  },
  userName: {
    fontSize: moderateScale(13),
    color: AllColors.gray,
    fontFamily: Fonts.AfacadMedium,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: AllColors.lightGray,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: AllColors.lightBlue,
  },
  messageText: {color: '#000'},

  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: AllColors.primary300,
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 41,
    height: 41,
    marginLeft: 5,
  },
  sendButton: {
    backgroundColor: AllColors.primary300,
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginLeft: 5,
  },
  messageImage: {width: 150, height: 150, borderRadius: 10, marginVertical: 5},
  timestamp: {
    fontSize: 12,
    color: AllColors.black,
    alignSelf: 'flex-end',
    fontFamily: Fonts.AfacadBold,
    top: 5,
  },
  ImgButton: {
    backgroundColor: AllColors.primary300,
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    borderTopWidth: 1,
    borderTopColor: AllColors.lightGray,
    backgroundColor: AllColors.white,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: AllColors.lightGray,
    borderRadius: scale(20),
  },
  input: {
    flex: 1,
    height: scale(40),
    borderRadius: scale(20),
    paddingHorizontal: scale(15),
    fontSize: moderateScale(14),
  },
  rightSideButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    left: scale(10),
  },
  galleryButton: {
    marginRight: scale(10),
  },
  videoButton: {
    marginRight: scale(10),
  },
  micButton: {
    marginRight: scale(10),
  },
});

export default ChatScreen;
