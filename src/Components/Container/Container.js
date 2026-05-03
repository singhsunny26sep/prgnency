import { Fragment } from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';

export function Container(props) {
  const {
    children,
    backgroundColor = '#ffffff',
    fullScreen,
  } = props;

  const screenBackgroundColor = backgroundColor;

  return (
    <View style={{ flex: 1, backgroundColor: screenBackgroundColor }}>
      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />
      {fullScreen ? (
        <Fragment>{children}</Fragment>
      ) : (
        <Fragment>
          <SafeAreaView style={{ flex: 0, backgroundColor: screenBackgroundColor }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: screenBackgroundColor }}>
            {children}
          </SafeAreaView>
        </Fragment>
      )}
    </View>
  );
}
