import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { StoredApp } from '../types';
import { AppManager } from '../services/appManager';
import { AppCard } from '../components/AppCard';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface Props {
  navigation: any;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [installedApps, setInstalledApps] = useState<StoredApp[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadInstalledApps = useCallback(async () => {
    try {
      const apps = await AppManager.getInstalledApps();
      setInstalledApps(apps);
    } catch (error) {
      console.error('Failed to load installed apps:', error);
    }
  }, []);

  useEffect(() => {
    loadInstalledApps();

    const unsubscribe = navigation.addListener('focus', () => {
      loadInstalledApps();
    });

    return unsubscribe;
  }, [navigation, loadInstalledApps]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInstalledApps();
    setRefreshing(false);
  };

  const handleOpenApp = (app: StoredApp) => {
    navigation.navigate('AppRunner', { app });
  };

  const handleUninstall = async (appId: string) => {
    try {
      await AppManager.uninstallApp(appId);
      await loadInstalledApps();
    } catch (error) {
      console.error('Failed to uninstall app:', error);
    }
  };

  const renderApp = ({ item }: { item: StoredApp }) => (
    <AppCard
      app={{ ...item, isInstalled: true }}
      onPress={() => handleOpenApp(item)}
      onUninstall={() => handleUninstall(item.id)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📱</Text>
      <Text style={styles.emptyTitle}>No Apps Installed</Text>
      <Text style={styles.emptyText}>
        Visit the App Store to discover and install apps
      </Text>
      <TouchableOpacity
        style={styles.storeButton}
        onPress={() => navigation.navigate('AppStore')}
      >
        <Text style={styles.storeButtonText}>Open App Store</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <Text style={styles.title}>My Apps</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Text style={styles.iconButtonText}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('AppStore')}
          >
            <Text style={styles.iconButtonText}>🏪</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={installedApps}
        renderItem={renderApp}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 24,
  },
  list: {
    padding: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  storeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  storeButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: '600',
  },
});
