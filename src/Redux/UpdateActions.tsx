export const checkForUpdates = () => {
  return { type: 'SET_UPDATE_INFO', payload: { isUpdateAvailable: false } };
};

export const checkDismissedUpdate = () => {
  return { type: 'SET_UPDATE_DISMISSED', payload: false };
};

export const dismissUpdate = () => {
  return { type: 'SET_UPDATE_DISMISSED', payload: true };
};

export const setLanguage = (language: string) => {
  return { type: 'SET_LANGUAGE', payload: language };
};
