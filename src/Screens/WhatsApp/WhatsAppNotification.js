import React from 'react';
import {View, Text, Image} from 'react-native';

export default function WhatsAppNotification() {
  return (
    <View>
      <Image
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRDqDF9L9bpvq2l3MK9Gu_Z6e4JdkYjd2Uzg&s',
        }}
        style={{height: 200, width: 200}}
      />
    </View>
  );
}
