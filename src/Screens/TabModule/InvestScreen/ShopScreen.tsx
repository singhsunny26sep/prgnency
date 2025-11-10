import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';
import { Container } from '../../../Components/Container/Container';
import { AllColors } from '../../../Constants/COLORS';

interface ShopScreenProps {
  navigation: NavigationProp<any, any>;
}

const ShopScreen = (props: ShopScreenProps) => {
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.white}
      backgroundColor={AllColors.white}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: AllColors.white,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: AllColors.black,
          }}
        >
          Coming Soon 🚀
        </Text>
      </View>
    </Container>
  );
};

export default ShopScreen;
