import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {scale} from '../../Constants/Scalling';

export default function MyOrder() {
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={{
              uri: 'https://www.shareicon.net/download/2015/09/22/104989_basket_256x256.png',
            }}
            style={styles.image}
          />
          <Text style={styles.text}>
            Your bag is empty and you haven't{'\n'}bought any product till now
          </Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>ORDER NOW & START EARNING</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:scale(60)
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(20),
  },
  image: {
    height: scale(80),
    width: scale(80),
  },
  text: {
    textAlign: 'center',
    marginTop: scale(10),
    fontWeight:'500'
  },
  button: {
    backgroundColor: AllColors.primary,
    paddingVertical: scale(10),
    paddingHorizontal: scale(30),
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: AllColors.white,
    fontSize: scale(14),
    fontWeight: 'bold',
  },
});
