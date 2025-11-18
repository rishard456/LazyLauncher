import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { FloatingHomeButton } from '../components/FloatingHomeButton';
import { StoredApp } from '../types';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface Props {
  navigation: any;
  route: {
    params: {
      app: StoredApp;
    };
  };
}

export const AppRunnerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { app } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const appUrl = `${app.installedPath}index.html`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading {app.name}...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Failed to Load App</Text>
          <Text style={styles.errorText}>
            There was an error loading {app.name}. Please try again.
          </Text>
        </View>
      )}

      <WebView
        source={{ uri: appUrl }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit
        allowsInlineMediaPlayback
      />

      <FloatingHomeButton onPress={handleHomePress} visible={!loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    zIndex: 10,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
