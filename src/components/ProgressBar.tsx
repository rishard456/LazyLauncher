import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface Props {
  progress: number;
  label?: string;
}

export const ProgressBar: React.FC<Props> = ({ progress, label }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${Math.min(100, Math.max(0, progress))}%` }]} />
      </View>
      <Text style={styles.percentage}>{progress.toFixed(0)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  barContainer: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  bar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  percentage: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textAlign: 'right',
  },
});
