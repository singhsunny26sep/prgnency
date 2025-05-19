import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Container } from '../../Components/Container/Container';
import { AllColors } from '../../Constants/COLORS';
import { Images } from '../../Assets/Images';
import { moderateScale, scale } from '../../Constants/Scalling';

export default function NewChat() {
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.lightBlue}
      backgroundColor={AllColors.white}>
      {/* Parent View to center the content */}
      <View style={styles.centeredContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={Images.message}
            style={styles.image}
          />
          <Text style={styles.chatText}>Chat</Text>
        </View>
        <Text style={styles.noConversationText}>
          You haven't started any{'\n'}conversation yet
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: scale(30),
    width: scale(30),
    alignSelf: 'center',
  },
  chatText: {
    color: AllColors.lightBlue,
    fontSize: moderateScale(25),
    fontWeight: 'bold',
    marginLeft: scale(10),
  },
  noConversationText: {
    color: AllColors.primary,
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
