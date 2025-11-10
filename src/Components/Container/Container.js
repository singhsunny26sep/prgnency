import { Fragment } from 'react';
import { SafeAreaView, View } from 'react-native';

export function Container(props) {
  const {
    children,
    backgroundColor = '#ffffff',
    fullScreen,
  } = props;

  const screenBackgroundColor = backgroundColor;

  return (
    <View style={{ flex: 1, backgroundColor: screenBackgroundColor }}>
      {fullScreen ? (
        <Fragment>{children}</Fragment>
      ) : (
        <Fragment>
          <SafeAreaView style={{ flex: 0 }} />
          <SafeAreaView style={{ flex: 1, backgroundColor: screenBackgroundColor }}>
            {children}
          </SafeAreaView>
        </Fragment>
      )}
    </View>
  );
}
