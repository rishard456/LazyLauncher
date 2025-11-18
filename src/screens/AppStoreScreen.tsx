import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { App, DownloadProgress } from '../types';
import { AppManager } from '../services/appManager';
import { AppCard } from '../components/AppCard';
import { ProgressBar } from '../components/ProgressBar';
import { MOCK_APP_STORE_APPS } from '../constants';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface Props {
  navigation: any;
}

export const AppStoreScreen: React.FC<Props> = ({ navigation }) => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingApps, setDownloadingApps] = useState<Set<string>>(new Set());
  const [downloadProgress, setDownloadProgress] = useState<Map<string, number>>(
    new Map()
  );

  useEffect(() => {
    loadApps();

    const unsubscribe = navigation.addListener('focus', () => {
      loadApps();
    });

    return unsubscribe;
  }, [navigation]);

  const loadApps = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get installed apps to mark them in the store
      const installedApps = await AppManager.getInstalledApps();
      const installedIds = new Set(installedApps.map((app) => app.id));

      const storeApps = MOCK_APP_STORE_APPS.map((app) => ({
        ...app,
        isInstalled: installedIds.has(app.id),
      }));

      setApps(storeApps);
    } catch (error) {
      console.error('Failed to load apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async (app: App) => {
    try {
      setDownloadingApps((prev) => new Set(prev).add(app.id));
      setDownloadProgress((prev) => new Map(prev).set(app.id, 0));

      await AppManager.downloadAndInstallApp(app, (progress: DownloadProgress) => {
        setDownloadProgress((prev) => new Map(prev).set(app.id, progress.progress));
      });

      setDownloadingApps((prev) => {
        const newSet = new Set(prev);
        newSet.delete(app.id);
        return newSet;
      });

      setDownloadProgress((prev) => {
        const newMap = new Map(prev);
        newMap.delete(app.id);
        return newMap;
      });

      // Refresh apps list
      await loadApps();

      Alert.alert('Success', `${app.name} has been installed successfully!`, [
        { text: 'OK' },
        {
          text: 'Open',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    } catch (error) {
      console.error('Failed to install app:', error);
      setDownloadingApps((prev) => {
        const newSet = new Set(prev);
        newSet.delete(app.id);
        return newSet;
      });
      Alert.alert('Error', 'Failed to install app. Please try again.');
    }
  };

  const renderApp = ({ item }: { item: App }) => {
    const isDownloading = downloadingApps.has(item.id);
    const progress = downloadProgress.get(item.id) || 0;

    return (
      <View>
        <AppCard
          app={{
            ...item,
            isDownloading,
            downloadProgress: progress,
          }}
          onPress={() => {}}
          onInstall={() => handleInstall(item)}
        />
        {isDownloading && (
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} label="Installing..." />
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading App Store...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <Text style={styles.title}>App Store</Text>
        <Text style={styles.subtitle}>{apps.length} apps available</Text>
      </View>
      <FlatList
        data={apps}
        renderItem={renderApp}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  list: {
    padding: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  progressContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
  },
});
