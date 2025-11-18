import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { StoredApp } from '../types';
import { AppManager } from '../services/appManager';
import { COLORS, SPACING } from '../constants/theme';

interface Props {
  navigation: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ICONS_PER_ROW = 4;
const ICON_SIZE = (SCREEN_WIDTH - SPACING.xl * 2) / ICONS_PER_ROW - SPACING.md;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [installedApps, setInstalledApps] = useState<StoredApp[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const unsubscribe = navigation.addListener('focus', () => {
      loadInstalledApps();
    });

    return () => {
      clearInterval(timeInterval);
      unsubscribe();
    };
  }, [navigation, loadInstalledApps]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInstalledApps();
    setRefreshing(false);
  };

  const handleOpenApp = (app: StoredApp) => {
    navigation.navigate('AppRunner', { app });
  };

  const handleLongPress = (app: StoredApp) => {
    // Show options menu on long press
    navigation.navigate('AppInfo', { app });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderAppIcon = (app: StoredApp) => (
    <TouchableOpacity
      key={app.id}
      style={styles.appIcon}
      onPress={() => handleOpenApp(app)}
      onLongPress={() => handleLongPress(app)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{app.icon}</Text>
      </View>
      <Text style={styles.appName} numberOfLines={1}>
        {app.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSystemApps = () => (
    <>
      <TouchableOpacity
        style={styles.appIcon}
        onPress={() => navigation.navigate('AppStore')}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, styles.systemIcon]}>
          <Text style={styles.icon}>🏪</Text>
        </View>
        <Text style={styles.appName}>Store</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.appIcon}
        onPress={() => navigation.navigate('QRScanner')}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, styles.systemIcon]}>
          <Text style={styles.icon}>📷</Text>
        </View>
        <Text style={styles.appName}>Scanner</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Text style={styles.statusTime}>{formatTime()}</Text>
        </View>
        <View style={styles.statusRight}>
          <Text style={styles.statusIcon}>📶</Text>
          <Text style={styles.statusIcon}>📡</Text>
          <Text style={styles.statusIcon}>🔋</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.white}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Clock Widget */}
        <View style={styles.clockWidget}>
          <Text style={styles.clockTime}>{formatTime()}</Text>
          <Text style={styles.clockDate}>{formatDate()}</Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => {
            /* Add search functionality */
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>Search apps...</Text>
        </TouchableOpacity>

        {/* Apps Grid */}
        <View style={styles.appsContainer}>
          {installedApps.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📱</Text>
              <Text style={styles.emptyText}>No apps installed</Text>
              <Text style={styles.emptySubtext}>
                Open the Store to discover apps
              </Text>
            </View>
          ) : (
            <View style={styles.appsGrid}>
              {installedApps.map(renderAppIcon)}
            </View>
          )}

          {/* System Apps Section */}
          <View style={styles.systemSection}>
            <Text style={styles.sectionTitle}>System</Text>
            <View style={styles.appsGrid}>{renderSystemApps()}</View>
          </View>
        </View>
      </ScrollView>

      {/* Dock */}
      <View style={styles.dock}>
        <TouchableOpacity
          style={styles.dockIcon}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, styles.dockIconContainer]}>
            <Text style={styles.icon}>🏠</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dockIcon}
          onPress={() => navigation.navigate('AppStore')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, styles.dockIconContainer]}>
            <Text style={styles.icon}>🏪</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dockIcon}
          onPress={() => navigation.navigate('QRScanner')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, styles.dockIconContainer]}>
            <Text style={styles.icon}>📷</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dockIcon}
          onPress={() => {
            /* Settings */
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, styles.dockIconContainer]}>
            <Text style={styles.icon}>⚙️</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: SPACING.xs,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statusTime: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  statusIcon: {
    fontSize: 12,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  clockWidget: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  clockTime: {
    fontSize: 72,
    fontWeight: '200',
    color: COLORS.text,
    letterSpacing: -2,
  },
  clockDate: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: 24,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  searchText: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  appsContainer: {
    paddingHorizontal: SPACING.md,
  },
  appsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  appIcon: {
    width: SCREEN_WIDTH / ICONS_PER_ROW,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.xs,
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE * 0.225,
    backgroundColor: COLORS.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  systemIcon: {
    backgroundColor: COLORS.primaryDark,
  },
  icon: {
    fontSize: ICON_SIZE * 0.5,
  },
  appName: {
    color: COLORS.text,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  systemSection: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.md,
    marginLeft: SPACING.xs,
  },
  dock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(20px)',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  dockIcon: {
    alignItems: 'center',
  },
  dockIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundCard,
  },
});
