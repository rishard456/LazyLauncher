import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { FLOATING_BUTTON_SIZE, FLOATING_BUTTON_MARGIN } from '../constants';

interface Props {
  onPress: () => void;
  visible?: boolean;
}

export const FloatingHomeButton: React.FC<Props> = ({ onPress, visible = true }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.icon}>🏠</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: FLOATING_BUTTON_MARGIN,
    width: FLOATING_BUTTON_SIZE,
    height: FLOATING_BUTTON_SIZE,
    zIndex: 9999,
  },
  button: {
    width: FLOATING_BUTTON_SIZE,
    height: FLOATING_BUTTON_SIZE,
    borderRadius: FLOATING_BUTTON_SIZE / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  icon: {
    fontSize: 24,
  },
});
