import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Container} from '../../Components/Container/Container';
import {AllColors} from '../../Constants/COLORS';
import {CustomHeader} from '../../Components/CustomHeader/CutsomHeader';
import metrics from '../../Constants/Metrics';
import WebView from 'react-native-webview';

export default function SessionDetails({route, navigation}) {
  const {video} = route.params;

  let formattedDate = '';
  if (video.createdAt) {
    const dateObj = new Date(video.createdAt);
    formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={AllColors.lightBlue}
      backgroundColor={AllColors.white}>
        <CustomHeader
          type="back"
          screenName={video.title}
          onPressBack={() => {
            navigation.goBack();
          }}
        />
      <View style={styles.videoContainer}>
        <WebView
          source={{uri: video.url}}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{video.title}</Text>
          {video.description ? (
            <Text style={styles.description}>{video.description}</Text>
          ) : null}
          {formattedDate ? (
            <Text style={styles.date}>Date: {formattedDate}</Text>
          ) : null}
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
  videoContainer: {
    flex: 1,
    marginTop: 20,
  },
  webview: {
    flex: 1,
  },
  infoContainer: {
    marginTop: 16,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: AllColors.black,
  },
  description: {
    fontSize: 15,
    color: AllColors.black,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: AllColors.black,
    fontStyle: 'italic',
  },
}); 