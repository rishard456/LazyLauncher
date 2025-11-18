import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface Props {
  navigation: any;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🏠</Text>
        <Text style={styles.title}>LazyLauncher Home</Text>
        <Text style={styles.subtitle}>Phone OS-Style Launcher</Text>

        <View style={styles.info}>
          <Text style={styles.infoText}>✅ Simplified Home Screen</Text>
          <Text style={styles.infoText}>✅ No complex components</Text>
          <Text style={styles.infoText}>✅ Testing basic functionality</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('App Store - Coming Soon')}
        >
          <Text style={styles.buttonText}>App Store (Disabled)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('QR Scanner - Coming Soon')}
        >
          <Text style={styles.buttonText}>QR Scanner (Disabled)</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  icon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
    textAlign: 'center',
  },
  info: {
    marginBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  infoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    width: '80%',
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
