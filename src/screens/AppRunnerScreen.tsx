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

  // Load from LOCAL file system only - TRUE OFFLINE
  const appUrl = `file://${app.installedPath}index.html`;

  // Inject storage API for apps to persist data
  const injectedJavaScript = `
    (function() {
      // Create LazyLauncher storage API
      window.LazyStorage = {
        save: function(key, value) {
          try {
            localStorage.setItem('${app.id}_' + key, JSON.stringify(value));
            return true;
          } catch (e) {
            console.error('Storage save error:', e);
            return false;
          }
        },
        load: function(key) {
          try {
            const data = localStorage.getItem('${app.id}_' + key);
            return data ? JSON.parse(data) : null;
          } catch (e) {
            console.error('Storage load error:', e);
            return null;
          }
        },
        remove: function(key) {
          try {
            localStorage.removeItem('${app.id}_' + key);
            return true;
          } catch (e) {
            console.error('Storage remove error:', e);
            return false;
          }
        },
        clear: function() {
          try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
              if (key.startsWith('${app.id}_')) {
                localStorage.removeItem(key);
              }
            });
            return true;
          } catch (e) {
            console.error('Storage clear error:', e);
            return false;
          }
        }
      };

      // Add app info
      window.LazyAppInfo = {
        id: '${app.id}',
        name: '${app.name}',
        version: '${app.version}',
        isOffline: true,
        platform: 'LazyLauncher'
      };

      console.log('LazyLauncher Runtime: App loaded offline');
    })();
    true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading {app.name}...</Text>
          <Text style={styles.offlineBadge}>Running Offline</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Failed to Load App</Text>
          <Text style={styles.errorText}>
            Could not load {app.name} from local storage. The app may be corrupted.
          </Text>
        </View>
      )}

      <WebView
        source={{ uri: appUrl }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          setLoading(false);
          setError(true);
        }}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        allowsInlineMediaPlayback
        originWhitelist={['file://*', 'http://*', 'https://*']}
        allowFileAccess
        cacheEnabled
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
  offlineBadge: {
    ...TYPOGRAPHY.small,
    color: COLORS.success,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
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
