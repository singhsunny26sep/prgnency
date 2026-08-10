module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-redux|redux-persist|redux|@notifee|react-native-responsive-screen)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.kilo/worktrees/'],
};
