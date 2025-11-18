import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface Props {
  navigation: any;
}

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🚀</Text>
        <Text style={styles.title}>LazyLauncher</Text>
        <Text style={styles.subtitle}>Your Offline App Ecosystem</Text>

        <View style={styles.features}>
          <Text style={styles.feature}>✅ Install apps once</Text>
          <Text style={styles.feature}>✅ Run completely offline</Text>
          <Text style={styles.feature}>✅ Phone OS experience</Text>
          <Text style={styles.feature}>✅ QR code support</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('Welcome to LazyLauncher!\n\nOther screens are currently disabled for debugging.')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
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
    fontSize: 36,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
    textAlign: 'center',
  },
  features: {
    marginBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  feature: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 18,
  },
  version: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: SPACING.lg,
  },
});
