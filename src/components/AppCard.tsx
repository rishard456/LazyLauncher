import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { App } from '../types';
import { COLORS, BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface Props {
  app: App;
  onPress: () => void;
  onInstall?: () => void;
  onUninstall?: () => void;
}

export const AppCard: React.FC<Props> = ({ app, onPress, onInstall, onUninstall }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{app.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {app.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {app.description}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.version}>v{app.version}</Text>
          <Text style={styles.author}>{app.author}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {app.isInstalled ? (
          <>
            <TouchableOpacity style={styles.openButton} onPress={onPress}>
              <Text style={styles.buttonText}>Open</Text>
            </TouchableOpacity>
            {onUninstall && (
              <TouchableOpacity
                style={[styles.button, styles.uninstallButton]}
                onPress={onUninstall}
              >
                <Text style={styles.uninstallText}>Uninstall</Text>
              </TouchableOpacity>
            )}
          </>
        ) : app.isDownloading ? (
          <View style={styles.downloadingContainer}>
            <Text style={styles.downloadingText}>
              {app.downloadProgress?.toFixed(0)}%
            </Text>
          </View>
        ) : (
          onInstall && (
            <TouchableOpacity style={styles.installButton} onPress={onInstall}>
              <Text style={styles.buttonText}>Install</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  name: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  version: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  author: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  actions: {
    gap: SPACING.xs,
  },
  button: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  installButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  openButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  uninstallButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: '600',
  },
  uninstallText: {
    ...TYPOGRAPHY.small,
    color: COLORS.white,
  },
  downloadingContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  downloadingText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
