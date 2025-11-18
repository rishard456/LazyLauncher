import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [filteredApps, setFilteredApps] = useState<StoredApp[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'recent'>('recent');

  const loadInstalledApps = useCallback(async () => {
    try {
      const apps = await AppManager.getInstalledApps();
      setInstalledApps(apps);
      setFilteredApps(apps);
    } catch (error) {
      console.error('Failed to load installed apps:', error);
    }
  }, []);

  useEffect(() => {
    loadInstalledApps();

    const unsubscribe = navigation.addListener('focus', () => {
      loadInstalledApps();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, loadInstalledApps]);

  useEffect(() => {
    // Filter and sort apps
    let filtered = installedApps.filter(app =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = filtered.sort((a, b) => b.installedAt - a.installedAt);
    }

    setFilteredApps(filtered);
  }, [searchQuery, sortBy, installedApps]);

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

  const toggleSort = () => {
    setSortBy(sortBy === 'name' ? 'recent' : 'name');
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LazyLauncher</Text>
        <TouchableOpacity onPress={toggleSort} style={styles.filterButton}>
          <Text style={styles.filterIcon}>
            {sortBy === 'name' ? '🔤' : '🕐'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchInput} onPress={() => {/* Focus on input */}}>
            {searchQuery || 'Search apps...'}
          </Text>
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
        {/* Apps Grid */}
        <View style={styles.appsContainer}>
          {filteredApps.length === 0 && installedApps.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📱</Text>
              <Text style={styles.emptyText}>No apps installed</Text>
              <Text style={styles.emptySubtext}>
                Open the Store to discover apps
              </Text>
            </View>
          ) : filteredApps.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No apps found</Text>
              <Text style={styles.emptySubtext}>
                Try a different search term
              </Text>
            </View>
          ) : (
            <View style={styles.appsGrid}>
              {filteredApps.map(renderAppIcon)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
  },
  filterButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
  },
  filterIcon: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: 24,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  searchInput: {
    color: COLORS.textMuted,
    fontSize: 16,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
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
