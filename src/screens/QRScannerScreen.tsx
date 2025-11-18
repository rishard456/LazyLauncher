import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { AppManager } from '../services/appManager';
import { ProgressBar } from '../components/ProgressBar';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';
import { DownloadProgress } from '../types';

interface Props {
  navigation: any;
}

export const QRScannerScreen: React.FC<Props> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || installing) return;

    setScanned(true);

    // Check if it's a valid URL
    if (!data.startsWith('http://') && !data.startsWith('https://')) {
      Alert.alert('Invalid QR Code', 'This QR code does not contain a valid app URL.', [
        { text: 'Scan Again', onPress: () => setScanned(false) },
        { text: 'Cancel', onPress: () => navigation.goBack() },
      ]);
      return;
    }

    Alert.alert(
      'Install App',
      'Do you want to install this app from the scanned QR code?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setScanned(false),
        },
        {
          text: 'Install',
          onPress: () => installFromQR(data),
        },
      ]
    );
  };

  const installFromQR = async (qrData: string) => {
    try {
      setInstalling(true);
      setProgress(0);

      await AppManager.installFromQRCode(qrData, (downloadProgress: DownloadProgress) => {
        setProgress(downloadProgress.progress);
      });

      Alert.alert(
        'Success',
        'App has been installed successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setInstalling(false);
              navigation.navigate('Home');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Failed to install from QR:', error);
      Alert.alert(
        'Installation Failed',
        'Failed to install app. The QR code might be invalid or the app is not compatible.',
        [
          {
            text: 'Try Again',
            onPress: () => {
              setScanned(false);
              setInstalling(false);
              setProgress(0);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              setInstalling(false);
              navigation.goBack();
            },
          },
        ]
      );
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centerContainer}>
          <Text style={styles.icon}>📷</Text>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.text}>
            LazyLauncher needs camera access to scan QR codes for installing apps.
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.topOverlay}>
            <Text style={styles.instructions}>
              Scan an Expo QR code to install an app
            </Text>
          </View>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.bottomOverlay}>
            <TouchableOpacity
              style={styles.cancelScanButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>

      <Modal visible={installing} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Installing App</Text>
            <ProgressBar progress={progress} label="Please wait..." />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
  instructions: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  scanArea: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  bottomOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: SPACING.lg,
  },
  icon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  text: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    minWidth: 200,
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelScanButton: {
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  cancelButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    width: '80%',
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
});
