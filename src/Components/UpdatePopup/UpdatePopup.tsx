import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AllColors } from '../../Constants/COLORS';
import { formatVersionDisplay } from '../../Utils/VersionUtils';
import { dismissUpdate } from '../../Redux/UpdateActions';

interface UpdatePopupProps {
  visible: boolean;
  onClose: () => void;
}

const UpdatePopup: React.FC<UpdatePopupProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const updateInfo = useSelector((state: any) => state.Common.updateInfo);

  const handleUpdate = async () => {
    try {
      if (updateInfo?.downloadUrl) {
        const supported = await Linking.canOpenURL(updateInfo.downloadUrl);
        if (supported) {
          await Linking.openURL(updateInfo.downloadUrl);
        } else {
          Alert.alert(
            'Error',
            'Unable to open the update link. Please visit Play Store to update the app.',
            [
              { text: 'OK' }
            ]
          );
        }
      } else {
        // Open Play Store directly
        await Linking.openURL('https://play.google.com/store/apps/details?id=com.hiranyagarbh');
      }
      onClose();
    } catch (error) {
      console.error('Error opening update link:', error);
      Alert.alert(
        'Error',
        'Unable to open Play Store. Please update the app manually.',
        [
          { text: 'OK' }
        ]
      );
    }
  };

  const handleLater = () => {
    if (updateInfo?.version) {
      dispatch(dismissUpdate(updateInfo.version) as any);
    }
    onClose();
  };

  if (!updateInfo) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>App Update Available</Text>
              <Text style={styles.subtitle}>
                New version {formatVersionDisplay(updateInfo.version)} is available
              </Text>
            </View>

            {/* Update Message */}
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{updateInfo.updateMessage}</Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {updateInfo.isMandatory ? (
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleUpdate}
                  activeOpacity={0.8}
                >
                  <Text style={styles.updateButtonText}>Update Now</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={handleUpdate}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.updateButtonText}>Update Now</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.laterButton}
                    onPress={handleLater}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.laterButtonText}>Later</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Mandatory Update Note */}
            {updateInfo.isMandatory && (
              <View style={styles.mandatoryContainer}>
                <Text style={styles.mandatoryText}>
                  This update is required to continue using the app.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: AllColors.white,
    borderRadius: 20,
    width: '100%',
    maxWidth: 350,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AllColors.text500,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AllColors.text300,
    textAlign: 'center',
    lineHeight: 22,
  },
  messageContainer: {
    marginBottom: 24,
  },
  message: {
    fontSize: 14,
    color: AllColors.text400,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: AllColors.primary500,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    color: AllColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  laterButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AllColors.text300,
  },
  laterButtonText: {
    color: AllColors.text400,
    fontSize: 16,
    fontWeight: '500',
  },
  mandatoryContainer: {
    alignItems: 'center',
  },
  mandatoryText: {
    fontSize: 12,
    color: AllColors.red,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default UpdatePopup;